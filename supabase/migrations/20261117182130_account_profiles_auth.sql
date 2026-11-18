alter table public.profiles add column registration_data jsonb not null default '{}'::jsonb;
create policy profile_read_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
create function public.handle_new_auth_user() returns trigger language plpgsql security definer set search_path = '' as $$
declare details jsonb := coalesce(new.raw_user_meta_data -> 'registration', '{}'::jsonb); account_role text := new.raw_user_meta_data ->> 'role';
begin
  if account_role not in ('student','company','individual') or account_role is null then raise exception 'invalid account role'; end if;
  if jsonb_typeof(details) <> 'object' or octet_length(details::text) > 16384 then raise exception 'invalid registration data'; end if;
  insert into public.profiles(id, role, first_name, last_name, display_name, school, study_field, registration_data)
  values(new.id, account_role, left(coalesce(details ->> 'firstName',''),200), left(coalesce(details ->> 'lastName',''),200), left(coalesce(details ->> 'companyName', details ->> 'firstName',''),200), left(coalesce(details ->> 'school',''),200), left(coalesce(details ->> 'studyField',''),200), details);
  insert into public.privacy_settings(user_id) values(new.id);
  return new;
end $$;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();
