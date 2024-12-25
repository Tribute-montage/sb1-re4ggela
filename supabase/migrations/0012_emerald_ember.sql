/*
  # Notifications Management Schema

  1. New Tables
    - `notification_templates` - Predefined notification templates
    - `notification_settings` - User notification preferences
    - `notification_queue` - Queue for processing notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and user access
*/

-- Notification Templates Table
create table if not exists public.notification_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  subject text not null,
  body text not null,
  type text not null check (
    type in (
      'draft_ready',
      'client_feedback',
      'order_status',
      'custom'
    )
  ),
  variables jsonb not null default '[]',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notification Settings Table
create table if not exists public.notification_settings (
  user_id uuid references auth.users primary key,
  email_notifications boolean default true,
  in_app_notifications boolean default true,
  notification_types jsonb default '["draft_ready", "client_feedback", "order_status"]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notification Queue Table
create table if not exists public.notification_queue (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  template_id uuid references public.notification_templates,
  subject text not null,
  body text not null,
  data jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'failed')
  ),
  retry_count integer default 0,
  error text,
  scheduled_for timestamptz default now(),
  created_at timestamptz default now(),
  sent_at timestamptz
);

-- Enable RLS
alter table public.notification_templates enable row level security;
alter table public.notification_settings enable row level security;
alter table public.notification_queue enable row level security;

-- RLS Policies

-- Notification Templates
create policy "Admins can manage notification templates"
  on public.notification_templates
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

-- Notification Settings
create policy "Users can manage their own notification settings"
  on public.notification_settings
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notification Queue
create policy "Users can view their own notifications"
  on public.notification_queue
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Functions

-- Function to create a notification
create or replace function public.create_notification(
  p_user_id uuid,
  p_template_id uuid,
  p_data jsonb default null,
  p_scheduled_for timestamptz default now()
)
returns uuid as $$
declare
  v_template record;
  v_settings record;
  v_notification_id uuid;
  v_subject text;
  v_body text;
begin
  -- Get template
  select * into v_template
  from public.notification_templates
  where id = p_template_id and active = true;

  if not found then
    raise exception 'Template not found or inactive';
  end if;

  -- Get user notification settings
  select * into v_settings
  from public.notification_settings
  where user_id = p_user_id;

  -- Check if user wants this type of notification
  if v_settings.notification_types ? v_template.type then
    -- Replace variables in template
    v_subject := v_template.subject;
    v_body := v_template.body;

    -- Create notification
    insert into public.notification_queue (
      user_id,
      template_id,
      subject,
      body,
      data,
      scheduled_for
    ) values (
      p_user_id,
      p_template_id,
      v_subject,
      v_body,
      p_data,
      p_scheduled_for
    )
    returning id into v_notification_id;

    return v_notification_id;
  end if;

  return null;
end;
$$ language plpgsql security definer;

-- Function to mark notification as sent
create or replace function public.mark_notification_sent(
  p_notification_id uuid
)
returns void as $$
begin
  update public.notification_queue
  set
    status = 'sent',
    sent_at = now()
  where id = p_notification_id;
end;
$$ language plpgsql security definer;

-- Function to mark notification as failed
create or replace function public.mark_notification_failed(
  p_notification_id uuid,
  p_error text
)
returns void as $$
begin
  update public.notification_queue
  set
    status = 'failed',
    error = p_error,
    retry_count = retry_count + 1
  where id = p_notification_id;
end;
$$ language plpgsql security definer;