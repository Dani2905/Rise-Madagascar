create or replace function public.crm_team_add(p_email text) returns void language plpgsql security definer set search_path = '' as $$
declare target uuid; inserted integer;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('rise.crm.admins'));
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 if p_email is null or length(p_email)>254 or length(trim(p_email))<3 then raise exception 'invalid address' using errcode='22023'; end if;
 select u.id into target from auth.users u join public.profiles p on p.id=u.id where lower(u.email)=lower(trim(p_email)) and u.email_confirmed_at is not null limit 1;
 if target is null then raise exception 'verified account not found' using errcode='22023'; end if;
 insert into public.crm_admins(user_id,granted_by) values(target,auth.uid()) on conflict(user_id) do nothing;
 get diagnostics inserted = row_count;
 if inserted=0 then raise exception 'already an administrator' using errcode='22023'; end if;
 insert into public.crm_audit(actor_id,action,target_id) values(auth.uid(),'admin_added',target);
end $$;
create or replace function public.crm_team_remove(p_user uuid) returns void language plpgsql security definer set search_path = '' as $$
declare removed integer;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('rise.crm.admins'));
 if not public.crm_has_access() then raise exception 'access denied' using errcode='42501'; end if;
 if p_user is null or p_user=auth.uid() then raise exception 'cannot remove own access' using errcode='22023'; end if;
 if (select count(*) from public.crm_admins)<=1 then raise exception 'last administrator' using errcode='22023'; end if;
 delete from public.crm_admins where user_id=p_user;
 get diagnostics removed = row_count;
 if removed=0 then raise exception 'administrator not found' using errcode='22023'; end if;
 insert into public.crm_audit(actor_id,action,target_id) values(auth.uid(),'admin_removed',p_user);
end $$;
create or replace function public.crm_save_followup(p_account uuid,p_stage text,p_note text,p_follow_up_date date,p_expected timestamptz default null) returns jsonb language plpgsql security definer set search_path = '' as $$
declare old_time timestamptz; result public.crm_account_followups%rowtype;
begin
 perform pg_catalog.pg_advisory_xact_lock_shared(pg_catalog.hashtext('rise.crm.admins'));
 if not public.crm_has_access() or not public.crm_account_visible(p_account) then raise exception 'access denied' using errcode='42501'; end if;
 if p_stage is null or p_stage not in ('new','contacted','in_progress','follow_up','closed') or p_note is null or length(p_note)>4000 then raise exception 'invalid followup' using errcode='22023'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_account::text,802));
 if not public.crm_has_access() or not public.crm_account_visible(p_account) then raise exception 'access denied' using errcode='42501'; end if;
 select f.updated_at into old_time from public.crm_account_followups f where f.account_id=p_account for update;
 if old_time is distinct from p_expected then raise exception 'followup changed; reload' using errcode='40001'; end if;
 insert into public.crm_account_followups(account_id,stage,note,follow_up_date,updated_by,updated_at) values(p_account,p_stage,p_note,p_follow_up_date,auth.uid(),clock_timestamp()) on conflict(account_id) do update set stage=excluded.stage,note=excluded.note,follow_up_date=excluded.follow_up_date,updated_by=excluded.updated_by,updated_at=excluded.updated_at returning * into result;
 insert into public.crm_audit(actor_id,action,target_id) values(auth.uid(),'followup_saved',p_account);
 return jsonb_build_object('stage',result.stage,'note',result.note,'follow_up_date',result.follow_up_date,'updated_at',result.updated_at);
end $$;
