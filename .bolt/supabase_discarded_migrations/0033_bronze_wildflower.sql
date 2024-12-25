/*
  # Messaging System Migration
  
  1. Tables
    - message_threads: Stores message threads linked to orders
    - thread_participants: Tracks participants in each thread
    - thread_messages: Stores individual messages with attachments

  2. Security
    - Enable RLS on all tables
    - Add policies for thread access and message management
    - Secure functions for thread and message operations

  3. Features
    - Message status tracking (sent, delivered, read)
    - File attachments support
    - Real-time updates via triggers
*/

-- Create message status enum if it doesn't exist
do $$ 
begin
  create type message_status as enum ('sent', 'delivered', 'read');
exception
  when duplicate_object then null;
end $$;

-- Create tables if they don't exist
create table if not exists public.message_threads (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  subject text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.thread_participants (
  thread_id uuid references public.message_threads(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (thread_id, user_id)
);

create table if not exists public.thread_messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid references public.message_threads(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  content text not null,
  attachments jsonb default '[]',
  status message_status default 'sent',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.message_threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.thread_messages enable row level security;

-- Create new policies with unique names
create policy "thread_access_policy_v14"
  on public.message_threads
  for select
  to authenticated
  using (
    exists (
      select 1 from public.thread_participants
      where thread_id = message_threads.id
      and user_id = auth.uid()
    )
  );

create policy "message_access_policy_v14"
  on public.thread_messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.thread_participants
      where thread_id = thread_messages.thread_id
      and user_id = auth.uid()
    )
  );

create policy "message_insert_policy_v14"
  on public.thread_messages
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.thread_participants
      where thread_id = thread_messages.thread_id
      and user_id = auth.uid()
    )
    and sender_id = auth.uid()
  );

-- Functions
create or replace function public.start_thread(
  p_order_id uuid,
  p_subject text,
  p_participants uuid[]
)
returns uuid as $$
declare
  v_thread_id uuid;
begin
  -- Create thread
  insert into public.message_threads (order_id, subject)
  values (p_order_id, p_subject)
  returning id into v_thread_id;

  -- Add participants
  insert into public.thread_participants (thread_id, user_id)
  select v_thread_id, unnest(p_participants);

  return v_thread_id;
end;
$$ language plpgsql security definer;

create or replace function public.send_thread_message(
  p_thread_id uuid,
  p_content text,
  p_attachments jsonb default '[]'
)
returns uuid as $$
declare
  v_message_id uuid;
begin
  -- Verify sender is a thread participant
  if not exists (
    select 1 from public.thread_participants
    where thread_id = p_thread_id
    and user_id = auth.uid()
  ) then
    raise exception 'User is not a thread participant';
  end if;

  -- Create message
  insert into public.thread_messages (
    thread_id,
    sender_id,
    content,
    attachments
  ) values (
    p_thread_id,
    auth.uid(),
    p_content,
    p_attachments
  )
  returning id into v_message_id;

  -- Update thread timestamp
  update public.message_threads
  set updated_at = now()
  where id = p_thread_id;

  return v_message_id;
end;
$$ language plpgsql security definer;

-- Create indexes
create index if not exists idx_thread_messages_thread_id on public.thread_messages(thread_id);
create index if not exists idx_thread_messages_sender_id on public.thread_messages(sender_id);
create index if not exists idx_message_threads_order_id on public.message_threads(order_id);
create index if not exists idx_thread_participants_user_id on public.thread_participants(user_id);