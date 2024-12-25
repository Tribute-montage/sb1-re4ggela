/*
  # Enhanced User Management System

  1. Updates
    - Add new roles to user_role enum
    - Add permissions system
    - Add user activity logging
    
  2. Security
    - Add RLS policies for user management
    - Add role-based access control
*/

-- Create a transaction block to ensure all changes are atomic
begin;

  -- Update user_role enum
  alter type user_role add value 'super_admin';
  alter type user_role add value 'editor';

  -- Commit the enum changes before using them
  commit;

-- Start a new transaction for the rest of the changes
begin;

  -- Create permissions table
  create table if not exists public.permissions (
    id uuid primary key default uuid_generate_v4(),
    name text unique not null,
    description text,
    created_at timestamptz default now()
  );

  -- Create role_permissions table
  create table if not exists public.role_permissions (
    role user_role not null,
    permission_id uuid references public.permissions(id) on delete cascade,
    created_at timestamptz default now(),
    primary key (role, permission_id)
  );

  -- Create user_activity_log table
  create table if not exists public.user_activity_log (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    action text not null,
    details jsonb,
    created_at timestamptz default now()
  );

  -- Insert default permissions
  insert into public.permissions (name, description) values
    ('manage_users', 'Can manage all users'),
    ('manage_roles', 'Can assign roles to users'),
    ('manage_orders', 'Can manage all orders'),
    ('process_orders', 'Can process and edit orders'),
    ('view_analytics', 'Can view system analytics')
  on conflict (name) do nothing;

  -- Insert default role permissions
  with permission_ids as (
    select id, name from public.permissions
  )
  insert into public.role_permissions (role, permission_id)
  select 'super_admin', id from permission_ids
  on conflict do nothing;

  insert into public.role_permissions (role, permission_id)
  select 'admin', id 
  from public.permissions 
  where name in ('manage_orders', 'process_orders', 'view_analytics')
  on conflict do nothing;

  insert into public.role_permissions (role, permission_id)
  select 'editor', id 
  from public.permissions 
  where name in ('process_orders')
  on conflict do nothing;

  -- Enable RLS
  alter table public.permissions enable row level security;
  alter table public.role_permissions enable row level security;
  alter table public.user_activity_log enable row level security;

  -- RLS Policies
  create policy "Permissions viewable by authenticated users"
    on public.permissions for select
    to authenticated
    using (true);

  create policy "Role permissions viewable by authenticated users"
    on public.role_permissions for select
    to authenticated
    using (true);

  create policy "User activity log viewable by admins and super admins"
    on public.user_activity_log for select
    to authenticated
    using (
      exists (
        select 1 from public.user_profiles
        where id = auth.uid()
        and role in ('admin', 'super_admin')
      )
    );

  -- Functions for user management
  create or replace function public.check_user_permission(
    user_id uuid,
    permission_name text
  ) returns boolean as $$
  declare
    user_role user_role;
  begin
    -- Get user's role
    select role into user_role
    from public.user_profiles
    where id = user_id;

    -- Check if user has permission through their role
    return exists (
      select 1
      from public.role_permissions rp
      join public.permissions p on p.id = rp.permission_id
      where rp.role = user_role
      and p.name = permission_name
    );
  end;
  $$ language plpgsql security definer;

  -- Function to log user activity
  create or replace function public.log_user_activity(
    action text,
    details jsonb default null
  ) returns void as $$
  begin
    insert into public.user_activity_log (user_id, action, details)
    values (auth.uid(), action, details);
  end;
  $$ language plpgsql security definer;

commit;