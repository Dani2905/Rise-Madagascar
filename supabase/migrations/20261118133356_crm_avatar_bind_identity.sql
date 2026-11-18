-- Lie chaque écriture à l'identité affichée, même si la session change entre-temps.
drop function public.crm_set_own_avatar(text);
create function public.crm_set_own_avatar(p_data_url text, p_expected_uid uuid) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform pg_catalog.pg_advisory_xact_lock_shared(pg_catalog.hashtext('rise.crm.admins'));
 if auth.uid() is distinct from p_expected_uid or not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 if p_data_url is null then delete from public.crm_admin_avatars where user_id=auth.uid(); return; end if;
 if length(p_data_url)>180000 or p_data_url !~ '^data:image/jpeg;base64,/9j/[A-Za-z0-9+/]*={0,2}$' then raise exception 'invalid photo' using errcode='22023'; end if;
 insert into public.crm_admin_avatars(user_id,data_url,updated_at) values(auth.uid(),p_data_url,now()) on conflict(user_id) do update set data_url=excluded.data_url,updated_at=excluded.updated_at;
end $$;
revoke all on function public.crm_set_own_avatar(text,uuid) from public, anon, authenticated;
grant execute on function public.crm_set_own_avatar(text,uuid) to authenticated;
