-- Un prénom privé par administrateur, sans recréer de profil public.
alter table public.crm_admins add column first_name text not null default '' check (char_length(first_name) <= 80 and first_name !~ '[[:cntrl:]]');
create function public.crm_get_own_first_name(p_expected_uid uuid) returns text language plpgsql stable security definer set search_path = '' as $$
begin
 if auth.uid() is distinct from p_expected_uid or not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 return (select a.first_name from public.crm_admins a where a.user_id=auth.uid());
end $$;
create function public.crm_set_own_first_name(p_expected_uid uuid,p_first_name text) returns text language plpgsql security definer set search_path = '' as $$
declare cleaned text;
begin
 perform pg_catalog.pg_advisory_xact_lock_shared(pg_catalog.hashtext('rise.crm.admins'));
 if auth.uid() is distinct from p_expected_uid or not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 cleaned:=pg_catalog.btrim(p_first_name);
 if cleaned is null or char_length(cleaned)<1 or char_length(cleaned)>80 or cleaned ~ '[[:cntrl:]]' then raise exception 'invalid first name' using errcode='22023'; end if;
 update public.crm_admins set first_name=cleaned where user_id=auth.uid();
 return cleaned;
end $$;
revoke all on function public.crm_get_own_first_name(uuid) from public, anon, authenticated;
revoke all on function public.crm_set_own_first_name(uuid,text) from public, anon, authenticated;
grant execute on function public.crm_get_own_first_name(uuid) to authenticated;
grant execute on function public.crm_set_own_first_name(uuid,text) to authenticated;
