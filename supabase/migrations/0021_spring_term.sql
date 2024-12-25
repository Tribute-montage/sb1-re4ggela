-- Create order_drafts table if it doesn't exist
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

-- Create draft_feedback table if it doesn't exist
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

-- Add editor_id column to orders table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'orders' and column_name = 'editor_id'
  ) then
    alter table public.orders add column editor_id uuid references auth.users(id);
  end if;
end $$;

-- Enable RLS
alter table public.order_drafts enable row level security;
alter table public.draft_feedback enable row level security;

-- RLS Policies for order_drafts
create policy "Editors can view and manage their drafts"
  on public.order_drafts
  to authenticated
  using (
    editor_id = auth.uid() or
    exists (
      select 1 from public.orders
      where orders.id = order_drafts.order_id
      and orders.client_id = auth.uid()
    )
  )
  with check (editor_id = auth.uid());

-- RLS Policies for draft_feedback
create policy "Users can manage feedback"
  on public.draft_feedback
  to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.order_drafts
      where order_drafts.id = draft_feedback.draft_id
      and order_drafts.editor_id = auth.uid()
    )
  )
  with check (user_id = auth.uid());

-- Functions
create or replace function public.assign_editor(
  p_order_id uuid,
  p_editor_id uuid
)
returns void as $$
begin
  -- Verify editor role
  if not exists (
    select 1 from public.user_profiles
    where id = p_editor_id and role = 'editor'
  ) then
    raise exception 'User is not an editor';
  end if;

  -- Update order
  update public.orders
  set editor_id = p_editor_id
  where id = p_order_id;
end;
$$ language plpgsql security definer;

-- Function to submit draft for review
create or replace function public.submit_draft_for_review(
  p_order_id uuid,
  p_editor_id uuid,
  p_url text
)
returns uuid as $$
declare
  v_version integer;
  v_draft_id uuid;
begin
  -- Get next version number
  select coalesce(max(version), 0) + 1 into v_version
  from public.order_drafts
  where order_id = p_order_id;

  -- Create draft
  insert into public.order_drafts (
    order_id,
    editor_id,
    url,
    version,
    status
  ) values (
    p_order_id,
    p_editor_id,
    p_url,
    v_version,
    'pending_review'
  )
  returning id into v_draft_id;

  return v_draft_id;
end;
$$ language plpgsql security definer;