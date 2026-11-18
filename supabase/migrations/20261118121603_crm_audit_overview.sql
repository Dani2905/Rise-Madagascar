create function public.crm_audit_list() returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(x.entry order by x.created_at desc) from (select a.created_at,jsonb_build_object('id',a.id,'action',a.action,'actor',coalesce(u.email,'Compte supprimé'),'created_at',a.created_at) as entry from public.crm_audit a left join auth.users u on u.id=a.actor_id order by a.created_at desc,a.id desc limit 25) x),'[]'::jsonb);
end $$;
revoke all on function public.crm_audit_list() from public, anon, authenticated;
grant execute on function public.crm_audit_list() to authenticated;
