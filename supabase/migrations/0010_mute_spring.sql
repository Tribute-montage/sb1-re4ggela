-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  message text not null,
  type text not null check (type in ('order_update', 'system', 'review_request')),
  read boolean default false,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- RLS policies
create policy "Users can view own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id);

-- Create index for faster queries
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_created_at on public.notifications(created_at);

-- Function to create notification
create or replace function public.create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text,
  p_metadata jsonb default null
) returns uuid as $$
declare
  v_notification_id uuid;
begin
  insert into public.notifications (
    user_id,
    title,
    message,
    type,
    metadata
  ) values (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_metadata
  ) returning id into v_notification_id;

  return v_notification_id;
end;
$$ language plpgsql security definer;

-- Trigger function for order status changes
create or replace function public.handle_order_status_change()
returns trigger as $$
begin
  -- Create notification for status change
  perform public.create_notification(
    new.client_id,
    'Order Status Updated',
    format('Your order #%s has been updated to %s', new.order_number, new.status),
    'order_update',
    jsonb_build_object(
      'order_id', new.id,
      'old_status', old.status,
      'new_status', new.status
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for order status changes
create trigger on_order_status_change
  after update of status on public.orders
  for each row
  when (old.status is distinct from new.status)
  execute function public.handle_order_status_change();