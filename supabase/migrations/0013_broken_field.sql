/*
  # Draft Management Schema

  1. New Tables
    - `order_drafts` - Store draft versions
    - `draft_feedback` - Client feedback on drafts
    - `draft_revisions` - Track revision history

  2. Security
    - Enable RLS on all tables
    - Add policies for editor and client access
*/

-- Draft Management Tables
create table if not exists public.order_drafts (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  editor_id uuid references auth.users(id),
  url text not null,
  version integer not null,
  status text not null check (
    status in ('pending_review', 'approved', 'changes_requested')
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.draft_feedback (
  id uuid primary key default uuid_generate_v4(),
  draft_id uuid references public.order_drafts(id) on delete cascade,
  user_id uuid references auth.users(id),
  type text not null check (
    type in ('approval', 'change_request')
  ),
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.draft_revisions (
  id uuid primary key default uuid_generate_v4(),
  draft_id uuid references public.order_drafts(id) on delete cascade,
  editor_id uuid references auth.users(id),
  changes jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.order_drafts enable row level security;
alter table public.draft_feedback enable row level security;
alter table public.draft_revisions enable row level security;

-- RLS Policies

-- Order Drafts
create policy "Editors can manage drafts for their orders"
  on public.order_drafts
  to authenticated
  using (editor_id = auth.uid())
  with check (editor_id = auth.uid());

create policy "Clients can view drafts for their orders"
  on public.order_drafts
  for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_drafts.order_id
      and orders.client_id = auth.uid()
    )
  );

-- Draft Feedback
create policy "Users can manage their own feedback"
  on public.draft_feedback
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Editors can view feedback for their drafts"
  on public.draft_feedback
  for select
  to authenticated
  using (
    exists (
      select 1 from public.order_drafts
      where order_drafts.id = draft_feedback.draft_id
      and order_drafts.editor_id = auth.uid()
    )
  );

-- Draft Revisions
create policy "Editors can manage revisions for their drafts"
  on public.draft_revisions
  to authenticated
  using (editor_id = auth.uid())
  with check (editor_id = auth.uid());

-- Functions

-- Function to submit draft for review
create or replace function public.submit_draft_for_review(
  p_draft_id uuid
)
returns void as $$
declare
  v_order_id uuid;
  v_client_id uuid;
begin
  -- Get order and client info
  select order_id, client_id into v_order_id, v_client_id
  from public.order_drafts
  join public.orders on orders.id = order_drafts.order_id
  where order_drafts.id = p_draft_id;

  -- Update draft status
  update public.order_drafts
  set status = 'pending_review'
  where id = p_draft_id;

  -- Create notification
  perform public.create_notification(
    v_client_id,
    (select id from public.notification_templates where type = 'draft_ready' limit 1),
    jsonb_build_object(
      'order_id', v_order_id,
      'draft_id', p_draft_id
    )
  );
end;
$$ language plpgsql security definer;