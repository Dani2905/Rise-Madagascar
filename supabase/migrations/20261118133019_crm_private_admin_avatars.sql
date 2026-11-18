-- Photo privée, propre à chaque membre CRM ; pas de bucket ni d'URL publique.
create table public.crm_admin_avatars (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data_url text not null check (length(data_url) <= 180000 and data_url ~ '^data:image/jpeg;base64,/9j/[A-Za-z0-9+/]*={0,2}$'),
 updated_at timestamptz not null default now()
);
alter table public.crm_admin_avatars enable row level security;
revoke all on public.crm_admin_avatars from public, anon, authenticated;
create function public.crm_get_own_avatar() returns text language plpgsql stable security definer set search_path = '' as $$
begin
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 return (select a.data_url from public.crm_admin_avatars a where a.user_id=auth.uid());
end $$;
create function public.crm_set_own_avatar(p_data_url text) returns void language plpgsql security definer set search_path = '' as $$
begin
 perform pg_catalog.pg_advisory_xact_lock_shared(pg_catalog.hashtext('rise.crm.admins'));
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 if p_data_url is null then delete from public.crm_admin_avatars where user_id=auth.uid(); return; end if;
 if length(p_data_url)>180000 or p_data_url !~ '^data:image/jpeg;base64,/9j/[A-Za-z0-9+/]*={0,2}$' then raise exception 'invalid photo' using errcode='22023'; end if;
 insert into public.crm_admin_avatars(user_id,data_url,updated_at) values(auth.uid(),p_data_url,now()) on conflict(user_id) do update set data_url=excluded.data_url,updated_at=excluded.updated_at;
end $$;
revoke all on function public.crm_get_own_avatar() from public, anon, authenticated;
revoke all on function public.crm_set_own_avatar(text) from public, anon, authenticated;
grant execute on function public.crm_get_own_avatar() to authenticated;
grant execute on function public.crm_set_own_avatar(text) to authenticated;
