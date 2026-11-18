create table public.crm_admins (user_id uuid primary key references auth.users(id) on delete cascade, granted_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now());
create table public.crm_account_followups (account_id uuid primary key references public.profiles(id) on delete cascade, stage text not null default 'new' check(stage in ('new','contacted','in_progress','follow_up','closed')), note text not null default '' check(length(note)<=4000), follow_up_date date, updated_by uuid references auth.users(id) on delete set null, updated_at timestamptz not null default now());
create table public.crm_audit (id bigint generated always as identity primary key, actor_id uuid references auth.users(id) on delete set null, action text not null check(action in ('followup_saved','admin_added','admin_removed')), target_id uuid, created_at timestamptz not null default now());
alter table public.crm_admins enable row level security; alter table public.crm_account_followups enable row level security; alter table public.crm_audit enable row level security;
revoke all on public.crm_admins, public.crm_account_followups, public.crm_audit from public, anon, authenticated;
create function public.crm_has_access() returns boolean language sql stable security definer set search_path = '' as $$ select auth.uid() is not null and exists(select 1 from public.crm_admins a where a.user_id=auth.uid()) $$;
revoke all on function public.crm_has_access() from public, anon, authenticated; grant execute on function public.crm_has_access() to authenticated;
create function public.crm_account_visible(target uuid) returns boolean language sql stable security definer set search_path = '' as $$
select public.crm_has_access() and exists(select 1 from public.profiles p where p.id=target
 and not exists(select 1 from public.blocks b where (b.blocker_id=auth.uid() and b.blocked_id=p.id) or (b.blocker_id=p.id and b.blocked_id=auth.uid()))
 and (p.id=auth.uid() or p.role <> 'student' or exists(select 1 from public.privacy_settings pr join public.profiles viewer on viewer.id=auth.uid() where pr.user_id=p.id and ((viewer.role='student' and pr.discoverable_by_students) or (viewer.role in ('company','individual') and pr.discoverable_by_recruiters))))) $$;
revoke all on function public.crm_account_visible(uuid) from public, anon, authenticated;
