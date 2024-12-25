/*
  # Initial Schema Setup

  1. Tables
    - user_profiles
    - orders
    - assets
    - order_media
    - user_favorites

  2. Security
    - Enable RLS on all tables
    - Set up auth policies
*/

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create asset_type enum
create type asset_type as enum ('music', 'cover', 'scenery', 'verse');

-- Create order_status enum
create type order_status as enum ('pending', 'in-progress', 'review', 'completed');

-- Create video_type enum
create type video_type as enum ('6min-basic', '6min-scenery', '9min-basic', '9min-scenery');

-- Create assets table
create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  type asset_type not null,
  name text not null,
  url text not null,
  thumbnail_url text,
  duration integer,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references auth.users not null,
  funeral_home text not null,
  order_number text unique not null,
  video_type video_type not null,
  subject_name text not null,
  date_of_birth date,
  date_of_death date,
  requested_delivery_date timestamptz not null,
  special_notes text,
  status order_status default 'pending',
  background_music_id uuid references public.assets(id),
  cover_image_id uuid references public.assets(id),
  scenery_id uuid references public.assets(id),
  closing_verse_id uuid references public.assets(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create order_media table
create table if not exists public.order_media (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders not null,
  url text not null,
  file_name text not null,
  content_type text not null,
  size integer not null,
  notes text,
  display_order integer not null,
  created_at timestamptz default now()
);

-- Create user_favorites table
create table if not exists public.user_favorites (
  user_id uuid references auth.users not null,
  asset_id uuid references public.assets not null,
  created_at timestamptz default now(),
  primary key (user_id, asset_id)
);

-- Enable RLS
alter table public.assets enable row level security;
alter table public.orders enable row level security;
alter table public.order_media enable row level security;
alter table public.user_favorites enable row level security;

-- RLS Policies

-- Assets policies
create policy "Assets are viewable by all authenticated users"
  on public.assets for select
  to authenticated
  using (true);

-- Orders policies
create policy "Users can view own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = client_id);

create policy "Users can create own orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = client_id);

create policy "Users can update own orders"
  on public.orders for update
  to authenticated
  using (auth.uid() = client_id);

-- Order media policies
create policy "Users can view media for their orders"
  on public.order_media for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_media.order_id
      and orders.client_id = auth.uid()
    )
  );

create policy "Users can insert media for their orders"
  on public.order_media for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_media.order_id
      and orders.client_id = auth.uid()
    )
  );

-- User favorites policies
create policy "Users can view own favorites"
  on public.user_favorites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can manage own favorites"
  on public.user_favorites for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_assets_updated_at
  before update on public.assets
  for each row execute procedure public.handle_updated_at();

create trigger handle_orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();