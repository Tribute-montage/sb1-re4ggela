-- First drop the trigger that depends on the status column
drop trigger if exists on_order_status_change on public.orders;
drop function if exists public.handle_order_status_change();

-- Create a temporary column with the new type
alter table public.orders 
  add column status_new text;

-- Copy data to new column
update public.orders 
  set status_new = status;

-- Drop the old column
alter table public.orders 
  drop column status cascade;

-- Create the enum type
do $$ begin
  create type order_status as enum (
    'pending',
    'in-progress',
    'review',
    'completed'
  );
exception
  when duplicate_object then null;
end $$;

-- Rename new column and convert to enum
alter table public.orders 
  rename column status_new to status;

alter table public.orders
  alter column status type order_status using status::order_status;

-- Add not null constraint
alter table public.orders
  alter column status set not null;

-- Recreate the trigger function
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

-- Recreate the trigger
create trigger on_order_status_change
  after update of status on public.orders
  for each row
  when (old.status is distinct from new.status)
  execute function public.handle_order_status_change();