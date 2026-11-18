create function public.crm_snapshot(p_start timestamptz default null, p_end timestamptz default null, p_query text default '', p_limit integer default 50, p_offset integer default 0) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare s timestamptz := coalesce(p_start,'-infinity'::timestamptz); e timestamptz := coalesce(p_end,'infinity'::timestamptz); q text := lower(trim(coalesce(p_query,''))); result jsonb;
begin
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 if s>=e or length(q)>200 or p_limit is null or p_limit<1 or p_limit>100 or p_offset is null or p_offset<0 or p_offset>10000 then raise exception 'invalid filters' using errcode='22023'; end if;
 select jsonb_build_object(
  'counts',jsonb_build_object(
   'accounts',(select count(*) from public.profiles p where p.created_at>=s and p.created_at<e),
   'students',(select count(*) from public.profiles p where p.role='student' and p.created_at>=s and p.created_at<e),
   'companies',(select count(*) from public.profiles p where p.role='company' and p.created_at>=s and p.created_at<e),
   'individuals',(select count(*) from public.profiles p where p.role='individual' and p.created_at>=s and p.created_at<e),
   'jobs',(select count(*) from public.jobs j where j.status='active' and j.created_at>=s and j.created_at<e),
   'projects',(select count(*) from public.projects p where p.status='published' and p.created_at>=s and p.created_at<e),
   'applications',(select count(*) from public.applications a where a.created_at>=s and a.created_at<e),
   'applications_pending',(select count(*) from public.applications a where a.status='pending' and a.created_at>=s and a.created_at<e),
   'applications_accepted',(select count(*) from public.applications a where a.status='accepted' and a.created_at>=s and a.created_at<e),
   'reports',(select count(*) from public.reports r where r.created_at>=s and r.created_at<e),
   'subscription_activations',(select count(*) from public.subscriptions sub where sub.starts_at>=s and sub.starts_at<e),
   'subscriptions_active',(select count(*) from public.subscriptions sub where sub.status='active' and sub.starts_at<=now() and sub.expires_at>now()),
   'subscriptions_expiring',(select count(*) from public.subscriptions sub where sub.status='active' and sub.starts_at<=now() and sub.expires_at>now() and sub.expires_at<=now()+interval '7 days'),
   'subscriptions_expired',(select count(*) from public.subscriptions sub where sub.status='active' and sub.expires_at<=now()),
   'team',(select count(*) from public.crm_admins)
  ),
  'accounts',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (select p.created_at,jsonb_build_object('id',p.id,'role',p.role,'name',case when p.role='company' then coalesce(nullif(p.profile_data->>'companyName',''),nullif(p.registration_data->>'companyName',''),'Entreprise') else coalesce(nullif(trim(concat_ws(' ',coalesce(p.profile_data->>'firstName',p.first_name),coalesce(p.profile_data->>'lastName',p.last_name))),''),'Compte') end,'created_at',p.created_at,'stage',coalesce(f.stage,'new'),'note',coalesce(f.note,''),'follow_up_date',f.follow_up_date,'updated_at',f.updated_at) as item from public.profiles p left join public.crm_account_followups f on f.account_id=p.id where p.created_at>=s and p.created_at<e and public.crm_account_visible(p.id) and (q='' or strpos(lower(concat_ws(' ',p.role,p.first_name,p.last_name,p.profile_data->>'firstName',p.profile_data->>'lastName',p.registration_data->>'companyName',p.profile_data->>'companyName')),q)>0) order by p.created_at desc,p.id limit p_limit offset p_offset) x),'[]'::jsonb),
  'jobs',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (select j.created_at,jsonb_build_object('id',j.id,'title',j.title,'type',j.job_type,'province',j.province,'created_at',j.created_at) as item from public.jobs j where j.status='active' and j.created_at>=s and j.created_at<e and not exists(select 1 from public.blocks b where (b.blocker_id=auth.uid() and b.blocked_id=j.owner_id) or (b.blocker_id=j.owner_id and b.blocked_id=auth.uid())) and (q='' or strpos(lower(concat_ws(' ',j.title,j.job_type,j.province)),q)>0) order by j.created_at desc,j.id limit p_limit offset p_offset) x),'[]'::jsonb),
  'projects',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (select p.created_at,jsonb_build_object('id',p.id,'title',p.title,'category',p.category,'province',p.province,'created_at',p.created_at) as item from public.projects p where p.status='published' and p.created_at>=s and p.created_at<e and not exists(select 1 from public.blocks b where (b.blocker_id=auth.uid() and b.blocked_id=p.owner_id) or (b.blocker_id=p.owner_id and b.blocked_id=auth.uid())) and (q='' or strpos(lower(concat_ws(' ',p.title,p.category,p.province)),q)>0) order by p.created_at desc,p.id limit p_limit offset p_offset) x),'[]'::jsonb)
 ) into result;
 return result;
end $$;
revoke all on function public.crm_snapshot(timestamptz,timestamptz,text,integer,integer) from public, anon, authenticated;
grant execute on function public.crm_snapshot(timestamptz,timestamptz,text,integer,integer) to authenticated;
