-- Pricing Rules Table
create table if not exists public.pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  condition jsonb not null,
  adjustment jsonb not null,
  priority integer not null default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Discount Codes Table
create table if not exists public.discount_codes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value decimal(10,2) not null,
  min_order_amount decimal(10,2),
  max_discount decimal(10,2),
  valid_from timestamptz not null,
  valid_until timestamptz,
  usage_limit integer,
  used_count integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Discounts Table
create table if not exists public.order_discounts (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  discount_code_id uuid references public.discount_codes(id),
  amount decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.pricing_rules enable row level security;
alter table public.discount_codes enable row level security;
alter table public.order_discounts enable row level security;

-- RLS Policies
create policy "Admins can manage pricing rules"
  on public.pricing_rules
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

create policy "Admins can manage discount codes"
  on public.discount_codes
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

-- Functions
create or replace function public.validate_discount_code(
  p_code text,
  p_order_amount decimal
)
returns json as $$
declare
  v_discount record;
begin
  -- Get discount code
  select * into v_discount
  from public.discount_codes
  where code = p_code
    and active = true
    and valid_from <= now()
    and (valid_until is null or valid_until > now())
    and (usage_limit is null or used_count < usage_limit)
    and (min_order_amount is null or min_order_amount <= p_order_amount);

  if not found then
    return json_build_object(
      'valid', false,
      'message', 'Invalid or expired discount code'
    );
  end if;

  -- Calculate discount amount
  declare
    v_discount_amount decimal(10,2);
  begin
    if v_discount.discount_type = 'percentage' then
      v_discount_amount := p_order_amount * (v_discount.discount_value / 100);
      if v_discount.max_discount is not null then
        v_discount_amount := least(v_discount_amount, v_discount.max_discount);
      end if;
    else
      v_discount_amount := v_discount.discount_value;
    end if;

    return json_build_object(
      'valid', true,
      'discount_id', v_discount.id,
      'amount', v_discount_amount
    );
  end;
end;
$$ language plpgsql security definer;

-- Function to apply pricing rules
create or replace function public.apply_pricing_rules(
  p_order_id uuid
)
returns decimal(10,2) as $$
declare
  v_base_amount decimal(10,2);
  v_final_amount decimal(10,2);
  v_rule record;
begin
  -- Get base amount
  select total_amount into v_base_amount
  from public.order_pricing
  where order_id = p_order_id;

  v_final_amount := v_base_amount;

  -- Apply pricing rules
  for v_rule in (
    select *
    from public.pricing_rules
    where active = true
    order by priority desc
  )
  loop
    -- Apply rule adjustments
    if v_rule.adjustment->>'type' = 'percentage' then
      v_final_amount := v_final_amount * (1 + (v_rule.adjustment->>'value')::decimal);
    elsif v_rule.adjustment->>'type' = 'fixed' then
      v_final_amount := v_final_amount + (v_rule.adjustment->>'value')::decimal;
    end if;
  end loop;

  return v_final_amount;
end;
$$ language plpgsql security definer;