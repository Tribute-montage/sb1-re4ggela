-- File Version Control Tables
create table if not exists public.file_versions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  file_id uuid not null,
  version integer not null,
  url text not null,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Order History Table
create table if not exists public.order_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  changes jsonb not null,
  metadata jsonb not null default '{}',
  created_at timestamptz default now()
);

-- Media Backup Table
create table if not exists public.media_backups (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  backup_type text not null check (backup_type in ('full', 'incremental')),
  storage_path text not null,
  file_count integer not null,
  total_size bigint not null,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'failed')),
  error text,
  metadata jsonb not null default '{}',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Enable RLS
alter table public.file_versions enable row level security;
alter table public.order_history enable row level security;
alter table public.media_backups enable row level security;

-- Create indexes
create index idx_file_versions_order_id on public.file_versions(order_id);
create index idx_file_versions_file_id on public.file_versions(file_id);
create index idx_order_history_order_id on public.order_history(order_id);
create index idx_media_backups_order_id on public.media_backups(order_id);

-- RLS Policies
create policy "Users can view their own file versions"
  on public.file_versions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = file_versions.order_id
      and orders.client_id = auth.uid()
    )
  );

create policy "Users can view their own order history"
  on public.order_history
  for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_history.order_id
      and orders.client_id = auth.uid()
    )
  );

create policy "Admins can manage backups"
  on public.media_backups
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Functions
create or replace function public.create_file_version(
  p_order_id uuid,
  p_file_id uuid,
  p_url text,
  p_metadata jsonb default '{}'
)
returns uuid as $$
declare
  v_version integer;
  v_version_id uuid;
begin
  -- Get next version number
  select coalesce(max(version), 0) + 1 into v_version
  from public.file_versions
  where order_id = p_order_id
  and file_id = p_file_id;

  -- Create new version
  insert into public.file_versions (
    order_id,
    file_id,
    version,
    url,
    metadata,
    created_by
  ) values (
    p_order_id,
    p_file_id,
    v_version,
    p_url,
    p_metadata,
    auth.uid()
  )
  returning id into v_version_id;

  return v_version_id;
end;
$$ language plpgsql security definer;

create or replace function public.log_order_change(
  p_order_id uuid,
  p_action text,
  p_changes jsonb,
  p_metadata jsonb default '{}'
)
returns void as $$
begin
  insert into public.order_history (
    order_id,
    user_id,
    action,
    changes,
    metadata
  ) values (
    p_order_id,
    auth.uid(),
    p_action,
    p_changes,
    p_metadata
  );
end;
$$ language plpgsql security definer;

create or replace function public.create_backup(
  p_order_id uuid,
  p_backup_type text,
  p_storage_path text,
  p_metadata jsonb default '{}'
)
returns uuid as $$
declare
  v_backup_id uuid;
begin
  insert into public.media_backups (
    order_id,
    backup_type,
    storage_path,
    file_count,
    total_size,
    status,
    metadata
  ) values (
    p_order_id,
    p_backup_type,
    p_storage_path,
    0, -- Will be updated when backup completes
    0, -- Will be updated when backup completes
    'pending',
    p_metadata
  )
  returning id into v_backup_id;

  return v_backup_id;
end;
$$ language plpgsql security definer;