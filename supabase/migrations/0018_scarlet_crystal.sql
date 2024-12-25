-- Security Audit Log
create table if not exists public.security_audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Rate Limiting Table
create table if not exists public.rate_limits (
  id uuid primary key default uuid_generate_v4(),
  key text not null,
  hits integer default 1,
  reset_at timestamptz not null,
  created_at timestamptz default now()
);

-- Create indexes (only if they don't exist)
do $$
begin
  if not exists (select 1 from pg_indexes where indexname = 'idx_rate_limits_key') then
    create index idx_rate_limits_key on public.rate_limits(key);
  end if;
  
  if not exists (select 1 from pg_indexes where indexname = 'idx_rate_limits_reset_at') then
    create index idx_rate_limits_reset_at on public.rate_limits(reset_at);
  end if;
  
  if not exists (select 1 from pg_indexes where indexname = 'idx_audit_log_user_id') then
    create index idx_audit_log_user_id on public.security_audit_log(user_id);
  end if;
  
  if not exists (select 1 from pg_indexes where indexname = 'idx_audit_log_action') then
    create index idx_audit_log_action on public.security_audit_log(action);
  end if;
  
  if not exists (select 1 from pg_indexes where indexname = 'idx_audit_log_created_at') then
    create index idx_audit_log_created_at on public.security_audit_log(created_at);
  end if;
end $$;

-- Enable RLS
alter table public.security_audit_log enable row level security;
alter table public.rate_limits enable row level security;

-- Drop existing policy if it exists
do $$
begin
  drop policy if exists "Admins can view all audit logs" on public.security_audit_log;
exception when others then
  null;
end $$;

-- Create policy
create policy "Admins can view all audit logs"
  on public.security_audit_log
  for select
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Functions
create or replace function public.log_security_event(
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_metadata jsonb default null
)
returns void as $$
begin
  insert into public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address,
    user_agent,
    metadata
  ) values (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent',
    p_metadata
  );
end;
$$ language plpgsql security definer;

-- Rate limiting function
create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window interval
)
returns boolean as $$
declare
  v_record record;
begin
  -- Clean up expired records
  delete from public.rate_limits
  where reset_at < now();

  -- Get or create rate limit record
  select * into v_record
  from public.rate_limits
  where key = p_key
  for update skip locked;

  if not found then
    insert into public.rate_limits (key, hits, reset_at)
    values (p_key, 1, now() + p_window);
    return true;
  end if;

  if v_record.hits >= p_limit then
    return false;
  end if;

  update public.rate_limits
  set hits = hits + 1
  where key = p_key;

  return true;
end;
$$ language plpgsql security definer;