-- La lecture est liée à l'identité de la session affichée.
drop function public.crm_get_own_avatar();
create function public.crm_get_own_avatar(p_expected_uid uuid) returns text language plpgsql stable security definer set search_path = '' as $$
begin
 if auth.uid() is distinct from p_expected_uid or not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 return (select a.data_url from public.crm_admin_avatars a where a.user_id=auth.uid());
end $$;
revoke all on function public.crm_get_own_avatar(uuid) from public, anon, authenticated;
grant execute on function public.crm_get_own_avatar(uuid) to authenticated;
