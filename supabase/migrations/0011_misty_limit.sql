/*
  # Rate Card Management Schema

  1. New Tables
    - `rate_cards`
      - Base pricing for different video types
      - Additional fees for extras
    - `rate_card_items`
      - Individual pricing items within a rate card
    - `order_pricing`
      - Calculated pricing breakdown for each order

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Rate Cards Table
create table if not exists public.rate_cards (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  active boolean default false,
  valid_from timestamptz not null,
  valid_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Rate Card Items Table
create table if not exists public.rate_card_items (
  id uuid primary key default uuid_generate_v4(),
  rate_card_id uuid references public.rate_cards(id) on delete cascade,
  item_type text not null check (
    item_type in (
      'base_price',
      'additional_photo',
      'additional_video',
      'rush_fee',
      'background_music',
      'scenery',
      'custom_verse'
    )
  ),
  video_type text not null check (
    video_type in (
      '6min-basic',
      '6min-scenery',
      '9min-basic',
      '9min-scenery'
    )
  ),
  amount decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Order Pricing Table
create table if not exists public.order_pricing (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  rate_card_id uuid references public.rate_cards(id),
  base_amount decimal(10,2) not null,
  additional_fees jsonb not null default '{}',
  total_amount decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.rate_cards enable row level security;
alter table public.rate_card_items enable row level security;
alter table public.order_pricing enable row level security;

-- RLS Policies
create policy "Admins can manage rate cards"
  on public.rate_cards
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

create policy "Admins can manage rate card items"
  on public.rate_card_items
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

create policy "All users can view active rate cards"
  on public.rate_cards
  for select
  to authenticated
  using (active = true);

-- Functions
create or replace function public.calculate_order_price(
  p_order_id uuid,
  p_rate_card_id uuid default null
)
returns decimal(10,2) as $$
declare
  v_rate_card_id uuid;
  v_base_price decimal(10,2);
  v_additional_fees jsonb := '{}'::jsonb;
  v_total_price decimal(10,2);
  v_order record;
begin
  -- Get order details
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Get active rate card if not specified
  if p_rate_card_id is null then
    select id into v_rate_card_id
    from public.rate_cards
    where active = true
    and valid_from <= now()
    and (valid_until is null or valid_until > now())
    order by valid_from desc
    limit 1;
  else
    v_rate_card_id := p_rate_card_id;
  end if;

  -- Get base price
  select amount into v_base_price
  from public.rate_card_items
  where rate_card_id = v_rate_card_id
  and item_type = 'base_price'
  and video_type = v_order.video_type;

  -- Calculate additional fees
  v_additional_fees = v_additional_fees || 
    jsonb_build_object(
      'background_music',
      coalesce((
        select amount
        from public.rate_card_items
        where rate_card_id = v_rate_card_id
        and item_type = 'background_music'
        and video_type = v_order.video_type
      ), 0)
    );

  -- Calculate total
  v_total_price := v_base_price + (
    select coalesce(sum(value::decimal), 0)
    from jsonb_each_text(v_additional_fees)
  );

  -- Store pricing breakdown
  insert into public.order_pricing (
    order_id,
    rate_card_id,
    base_amount,
    additional_fees,
    total_amount
  ) values (
    p_order_id,
    v_rate_card_id,
    v_base_price,
    v_additional_fees,
    v_total_price
  );

  return v_total_price;
end;
$$ language plpgsql security definer;