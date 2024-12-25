-- Media Review Tables
create table if not exists public.media_reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  reviewer_id uuid references auth.users(id),
  status text not null check (
    status in ('pending', 'approved', 'rejected', 'reupload_requested')
  ),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media_review_items (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid references public.media_reviews(id) on delete cascade,
  media_id uuid references public.order_media(id) on delete cascade,
  status text not null check (
    status in ('pending', 'approved', 'rejected', 'reupload_requested')
  ),
  feedback text,
  created_at timestamptz default now()
);

create table if not exists public.media_review_history (
  id uuid primary key default uuid_generate_v4(),
  review_id uuid references public.media_reviews(id) on delete cascade,
  reviewer_id uuid references auth.users(id),
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.media_reviews enable row level security;
alter table public.media_review_items enable row level security;
alter table public.media_review_history enable row level security;

-- RLS Policies
create policy "Reviewers can manage reviews"
  on public.media_reviews
  to authenticated
  using (reviewer_id = auth.uid())
  with check (reviewer_id = auth.uid());

create policy "Clients can view their reviews"
  on public.media_reviews
  for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = media_reviews.order_id
      and orders.client_id = auth.uid()
    )
  );

-- Functions
create or replace function public.start_media_review(
  p_order_id uuid,
  p_reviewer_id uuid
)
returns uuid as $$
declare
  v_review_id uuid;
begin
  -- Create review record
  insert into public.media_reviews (
    order_id,
    reviewer_id,
    status
  ) values (
    p_order_id,
    p_reviewer_id,
    'pending'
  ) returning id into v_review_id;

  -- Create review items for each media
  insert into public.media_review_items (
    review_id,
    media_id,
    status
  )
  select 
    v_review_id,
    id,
    'pending'
  from public.order_media
  where order_id = p_order_id;

  -- Log review start
  insert into public.media_review_history (
    review_id,
    reviewer_id,
    action,
    details
  ) values (
    v_review_id,
    p_reviewer_id,
    'review_started',
    null
  );

  return v_review_id;
end;
$$ language plpgsql security definer;

create or replace function public.complete_media_review(
  p_review_id uuid,
  p_status text,
  p_notes text default null
)
returns void as $$
begin
  -- Update review status
  update public.media_reviews
  set
    status = p_status,
    notes = p_notes,
    updated_at = now()
  where id = p_review_id;

  -- Log completion
  insert into public.media_review_history (
    review_id,
    reviewer_id,
    action,
    details
  ) values (
    p_review_id,
    auth.uid(),
    'review_completed',
    jsonb_build_object(
      'status', p_status,
      'notes', p_notes
    )
  );
end;
$$ language plpgsql security definer;