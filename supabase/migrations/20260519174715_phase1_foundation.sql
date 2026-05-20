-- ===========================================================================
-- Phase 1 Foundation
-- ===========================================================================
-- Creates the core multi-tenant identity model:
--   - profiles      (extends auth.users)
--   - organizations (one per workspace)
--   - organization_members (links profiles to organizations with a role)
--
-- Establishes RLS helper functions, enables RLS on all tables, and creates
-- policies per Projects/StockFlow/RLS-Policies.md.
--
-- Creates the auth.users → profiles trigger so a profile is auto-created
-- on signup.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.organization_role as enum (
  'owner',
  'admin',
  'manager',
  'employee',
  'viewer'
);


-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
-- 1:1 with auth.users. The id column references auth.users(id) directly so
-- there is no possibility of orphaned profiles.

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User metadata extending Supabase auth.users';


-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
-- Each organization is a workspace. Slug is unique across all orgs and used
-- in URLs. Constraint enforces lowercase kebab-case 3-32 chars.

create table public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  slug       text not null unique check (slug ~ '^[a-z0-9-]{3,32}$'),
  logo_url   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is 'Tenant workspaces';


-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
-- Joins profiles to organizations with a role. MVP enforces one membership
-- per profile via the unique index on profile_id alone.

create table public.organization_members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  role            public.organization_role not null,
  invited_by      uuid references public.profiles(id) on delete set null,
  joined_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (organization_id, profile_id)
);

-- MVP rule: a profile can belong to at most one organization.
-- Drop this index in a future migration when multi-org support lands.
create unique index unique_profile_membership
  on public.organization_members (profile_id);

-- Indexes for the most common access patterns.
create index idx_organization_members_org
  on public.organization_members (organization_id);

comment on table public.organization_members is
  'Profile -> organization membership with a role. MVP: one org per profile.';


-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
-- These are used by RLS policies to determine the caller's org and role.
-- security definer + an explicit search_path makes them safe to call from
-- policies regardless of the caller's role.

create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.organization_members
  where profile_id = auth.uid()
  limit 1;
$$;

create or replace function public.current_role()
returns public.organization_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.organization_members
  where profile_id = auth.uid()
  limit 1;
$$;

create or replace function public.has_role(roles public.organization_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = any(roles);
$$;


-- ---------------------------------------------------------------------------
-- Enable Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles              enable row level security;
alter table public.organizations         enable row level security;
alter table public.organization_members  enable row level security;


-- ---------------------------------------------------------------------------
-- Policies -- profiles
-- ---------------------------------------------------------------------------

create policy "profiles: users can read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "profiles: members can read profiles in same org"
on public.profiles for select to authenticated
using (
  id in (
    select profile_id
    from public.organization_members
    where organization_id = public.current_org_id()
  )
);

create policy "profiles: users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- Policies -- organizations
-- ---------------------------------------------------------------------------

create policy "organizations: members can read own org"
on public.organizations for select to authenticated
using (id = public.current_org_id());

-- Onboarding: an authenticated user without an existing membership can
-- create an organization. The matching organization_members insert (as
-- owner) happens in the same server action transaction.
create policy "organizations: onboarding insert"
on public.organizations for insert to authenticated
with check (
  not exists (
    select 1 from public.organization_members
    where profile_id = auth.uid()
  )
);

create policy "organizations: owners and admins can update own org"
on public.organizations for update to authenticated
using (
  id = public.current_org_id()
  and public.has_role(array['owner','admin']::public.organization_role[])
)
with check (
  id = public.current_org_id()
);


-- ---------------------------------------------------------------------------
-- Policies -- organization_members
-- ---------------------------------------------------------------------------

create policy "members: read own org members"
on public.organization_members for select to authenticated
using (organization_id = public.current_org_id());

-- Onboarding: the user inserts themselves as owner of the org they just
-- created. The unique_profile_membership index prevents abuse.
create policy "members: owner self-insert during onboarding"
on public.organization_members for insert to authenticated
with check (
  profile_id = auth.uid()
  and role = 'owner'
);

create policy "members: owners and admins can update members in own org"
on public.organization_members for update to authenticated
using (
  organization_id = public.current_org_id()
  and public.has_role(array['owner','admin']::public.organization_role[])
)
with check (organization_id = public.current_org_id());

create policy "members: users can remove their own membership"
on public.organization_members for delete to authenticated
using (profile_id = auth.uid());

create policy "members: owners and admins can remove others"
on public.organization_members for delete to authenticated
using (
  organization_id = public.current_org_id()
  and public.has_role(array['owner','admin']::public.organization_role[])
);


-- ---------------------------------------------------------------------------
-- auth.users -> profiles trigger
-- ---------------------------------------------------------------------------
-- Auto-creates a profile row whenever a new auth.users row appears.
-- Pulls full_name + avatar_url from raw_user_meta_data when present
-- (Google OAuth populates these; email signup leaves them NULL).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
-- Generic function to bump updated_at on row UPDATE.

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.tg_set_updated_at();
