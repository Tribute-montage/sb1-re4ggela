-- Create conversation type enum
do $$ begin
  create type conversation_type as enum ('direct', 'group');
  create type participant_role as enum ('owner', 'participant');
  create type message_type as enum ('text', 'file');
exception
  when duplicate_object then null;
end $$;

-- Create conversations table
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  title text,
  type conversation_type not null default 'direct',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create conversation participants table
create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role participant_role not null default 'participant',
  joined_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  content text not null,
  type message_type not null default 'text',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- RLS Policies
create policy "Users can view conversations they're part of"
  on public.conversations
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversations.id
      and user_id = auth.uid()
    )
  );

create policy "Users can create conversations"
  on public.conversations
  for insert
  to authenticated
  with check (true);

create policy "Users can view conversation participants"
  on public.conversation_participants
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can manage participants in their conversations"
  on public.conversation_participants
  for all
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
      and user_id = auth.uid()
      and role = 'owner'
    )
  );

create policy "Users can view messages in their conversations"
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can send messages to their conversations"
  on public.messages
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
      and user_id = auth.uid()
    )
    and sender_id = auth.uid()
  );

-- Functions
create or replace function public.start_conversation(
  p_title text,
  p_type conversation_type,
  p_participants uuid[]
)
returns uuid as $$
declare
  v_conversation_id uuid;
begin
  insert into public.conversations (title, type)
  values (p_title, p_type)
  returning id into v_conversation_id;

  insert into public.conversation_participants (conversation_id, user_id, role)
  select 
    v_conversation_id,
    unnest(p_participants),
    case when unnest(p_participants) = auth.uid() then 'owner'::participant_role
    else 'participant'::participant_role end;

  return v_conversation_id;
end;
$$ language plpgsql security definer;

create or replace function public.send_message(
  p_conversation_id uuid,
  p_content text,
  p_type message_type default 'text',
  p_metadata jsonb default '{}'
)
returns uuid as $$
declare
  v_message_id uuid;
begin
  if not exists (
    select 1 from public.conversation_participants
    where conversation_id = p_conversation_id
    and user_id = auth.uid()
  ) then
    raise exception 'User is not a participant in this conversation';
  end if;

  insert into public.messages (
    conversation_id,
    sender_id,
    content,
    type,
    metadata
  ) values (
    p_conversation_id,
    auth.uid(),
    p_content,
    p_type,
    p_metadata
  )
  returning id into v_message_id;

  update public.conversations
  set updated_at = now()
  where id = p_conversation_id;

  return v_message_id;
end;
$$ language plpgsql security definer;

-- Indexes for better performance
create index if not exists idx_conversation_participants_user_id 
  on public.conversation_participants(user_id);
create index if not exists idx_messages_conversation_id 
  on public.messages(conversation_id);
create index if not exists idx_messages_created_at 
  on public.messages(created_at);