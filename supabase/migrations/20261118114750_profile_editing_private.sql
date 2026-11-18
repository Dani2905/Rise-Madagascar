-- Les données restent privées ; seul le propriétaire peut enregistrer ces champs.
alter table public.profiles add column profile_data jsonb not null default '{}'::jsonb
  check (jsonb_typeof(profile_data) = 'object' and octet_length(profile_data::text) <= 60000);

create function public.save_own_profile(changes jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  account_role text;
  allowed text[] := array['firstName','lastName','location','phone','bio'];
  string_fields text[] := array['firstName','lastName','location','phone','bio','title','school','studyField','studyLevel','birthDate','companyName','website','industry','companySize','founded','description','activities','values','position','city'];
  string_arrays text[] := array['skills','languages','perks'];
  object_arrays text[] := array['education','experiences','socials'];
  entry record;
  merged jsonb;
begin
  if actor is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if changes is null or jsonb_typeof(changes) <> 'object' or octet_length(changes::text) > 50000 then
    raise exception 'invalid profile data' using errcode = '22023';
  end if;
  select role into account_role from public.profiles where id = actor;
  if account_role is null then raise exception 'profile unavailable' using errcode = '42501'; end if;
  if account_role = 'student' then
    allowed := allowed || array['title','school','studyField','studyLevel','birthDate','skills','languages','education','experiences'];
  elsif account_role = 'company' then
    allowed := allowed || array['companyName','website','industry','companySize','founded','description','activities','values','position','city','perks','socials'];
  end if;
  for entry in select key, value from jsonb_each(changes) loop
    if not (entry.key = any(allowed)) then raise exception 'invalid profile field' using errcode = '22023'; end if;
    if entry.key = any(string_fields) then
      if jsonb_typeof(entry.value) <> 'string' or length(entry.value #>> '{}') > 10000 then raise exception 'invalid profile field value' using errcode = '22023'; end if;
    elsif entry.key = any(string_arrays) then
      if jsonb_typeof(entry.value) <> 'array' then raise exception 'invalid profile list' using errcode = '22023'; end if;
      if jsonb_array_length(entry.value) > 100 or exists(select 1 from jsonb_array_elements(entry.value) el where jsonb_typeof(el) <> 'string' or length(el #>> '{}') > 1000) then raise exception 'invalid profile list' using errcode = '22023'; end if;
    elsif entry.key = any(object_arrays) then
      if jsonb_typeof(entry.value) <> 'array' then raise exception 'invalid profile list' using errcode = '22023'; end if;
      if jsonb_array_length(entry.value) > 100 or exists(select 1 from jsonb_array_elements(entry.value) el where jsonb_typeof(el) <> 'object') then raise exception 'invalid profile list' using errcode = '22023'; end if;
    else raise exception 'invalid profile field' using errcode = '22023';
    end if;
  end loop;
  update public.profiles set profile_data = profile_data || changes, updated_at = now() where id = actor returning profile_data into merged;
  if merged is null then raise exception 'profile unavailable' using errcode = '42501'; end if;
  return merged;
end $$;
revoke all on function public.save_own_profile(jsonb) from public, anon, authenticated;
grant execute on function public.save_own_profile(jsonb) to authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
