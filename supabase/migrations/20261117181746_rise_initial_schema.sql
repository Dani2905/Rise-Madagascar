create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('student','company','individual')),
 first_name text, last_name text, display_name text, avatar_url text,
 province text, bio text, school text, study_field text, skills text[] not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.privacy_settings (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 discoverable_by_students boolean not null default false, discoverable_by_recruiters boolean not null default false,
 contact_preference text not null default 'everyone' check (contact_preference in ('everyone','projects','nobody')),
 updated_at timestamptz not null default now()
);
create table public.blocks (
 blocker_id uuid not null references public.profiles(id) on delete cascade,
 blocked_id uuid not null references public.profiles(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(blocker_id,blocked_id), check(blocker_id<>blocked_id)
);
create table public.subscriptions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 starts_at timestamptz not null, expires_at timestamptz not null, status text not null default 'inactive' check (status in ('inactive','active','cancelled')),
 created_at timestamptz not null default now(), check(expires_at>starts_at)
);
create table public.jobs (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
 title text not null, description text not null default '', province text, location text, job_type text,
 tags text[] not null default '{}', salary text, duration text, experience_level text, requirements text, benefits text,
 status text not null default 'draft' check(status in ('draft','active','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
 title text not null, description text not null default '', province text, category text, skills text[] not null default '{}',
 status text not null default 'draft' check(status in ('draft','published','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.applications (
 id uuid primary key default gen_random_uuid(), job_id uuid not null references public.jobs(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 message text, status text not null default 'pending' check(status in ('pending','interview','accepted','rejected','withdrawn')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(job_id,student_id)
);
create table public.messages (
 id uuid primary key default gen_random_uuid(), sender_id uuid not null references public.profiles(id) on delete cascade,
 recipient_id uuid not null references public.profiles(id) on delete cascade, subject text not null default '', body text not null,
 reply_to uuid references public.messages(id) on delete set null, project_id uuid references public.projects(id) on delete set null,
 read_at timestamptz, created_at timestamptz not null default now(), check(sender_id<>recipient_id)
);
create table public.project_supports (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
 supporter_id uuid not null references public.profiles(id) on delete cascade,
 support_type text not null check(support_type in ('financing','mentoring','partnership')), message text,
 status text not null default 'pending' check(status in ('pending','accepted','rejected')),
 created_at timestamptz not null default now()
);
create table public.project_reactions (
 project_id uuid not null references public.projects(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(project_id,user_id)
);
create table public.recruiter_follows (
 student_id uuid not null references public.profiles(id) on delete cascade, recruiter_id uuid not null references public.profiles(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(student_id,recruiter_id), check(student_id<>recruiter_id)
);
create table public.student_ratings (
 student_id uuid not null references public.profiles(id) on delete cascade, recruiter_id uuid not null references public.profiles(id) on delete cascade,
 score smallint not null check(score between 1 and 5), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 primary key(student_id,recruiter_id), check(student_id<>recruiter_id)
);
create table public.reports (
 id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade,
 reported_user_id uuid references public.profiles(id) on delete set null, reason text not null,
 status text not null default 'pending' check(status in ('pending','reviewed','closed')), created_at timestamptz not null default now()
);
create index subscriptions_user_expiry_idx on public.subscriptions(user_id,expires_at);
create index jobs_owner_created_idx on public.jobs(owner_id,created_at desc);
create index projects_owner_created_idx on public.projects(owner_id,created_at desc);
create index applications_student_created_idx on public.applications(student_id,created_at desc);
create index messages_recipient_created_idx on public.messages(recipient_id,created_at desc);
create index messages_sender_created_idx on public.messages(sender_id,created_at desc);
create index project_supports_project_idx on public.project_supports(project_id);
alter table public.profiles enable row level security;
alter table public.privacy_settings enable row level security;
alter table public.blocks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.jobs enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.project_supports enable row level security;
alter table public.project_reactions enable row level security;
alter table public.recruiter_follows enable row level security;
alter table public.student_ratings enable row level security;
alter table public.reports enable row level security;
