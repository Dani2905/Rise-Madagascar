-- Le nouveau type reste inaccessible à l'inscription publique. Aucune conversion de compte ici.
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student','company','individual','admin'));
create or replace function public.crm_account_visible(target uuid) returns boolean language sql stable security definer set search_path = '' as $$
select public.crm_has_access() and exists(select 1 from public.profiles p where p.id=target and p.role <> 'admin'
 and not exists(select 1 from public.blocks b where (b.blocker_id=auth.uid() and b.blocked_id=p.id) or (b.blocker_id=p.id and b.blocked_id=auth.uid()))
 and (p.id=auth.uid() or p.role <> 'student' or exists(select 1 from public.privacy_settings pr join public.profiles viewer on viewer.id=auth.uid() where pr.user_id=p.id and ((viewer.role='student' and pr.discoverable_by_students) or (viewer.role in ('company','individual','admin') and pr.discoverable_by_recruiters))))) $$;
do $migration$
declare definition text;
begin
 select pg_catalog.pg_get_functiondef('public.crm_snapshot(timestamptz,timestamptz,text,integer,integer)'::regprocedure) into definition;
 if strpos(definition,$old$'accounts',(select count(*) from public.profiles p where p.created_at>=s and p.created_at<e)$old$)=0 then raise exception 'unexpected CRM function source'; end if;
 definition:=replace(definition,$old$'accounts',(select count(*) from public.profiles p where p.created_at>=s and p.created_at<e)$old$,$new$'accounts',(select count(*) from public.profiles p where p.role <> 'admin' and p.created_at>=s and p.created_at<e)$new$);
 execute definition;
 select pg_catalog.pg_get_functiondef('public.save_own_profile(jsonb)'::regprocedure) into definition;
 if strpos(definition,$old$if account_role is null then raise exception 'profile unavailable' using errcode = '42501'; end if;$old$)=0 then raise exception 'unexpected profile function source'; end if;
 definition:=replace(definition,$old$if account_role is null then raise exception 'profile unavailable' using errcode = '42501'; end if;$old$,$new$if account_role is null or account_role = 'admin' then raise exception 'profile unavailable' using errcode = '42501'; end if;$new$);
 execute definition;
end $migration$;
