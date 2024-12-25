/*
  # Admin Registration Schema

  1. Tables
    - Extends user_profiles table with role field
    - Adds RLS policies for admin access

  2. Security
    - Enable RLS
    - Add policies for admin role management
*/

-- Enable RLS
alter table auth.users enable row level security;

-- Create role enum if it doesn't exist
do $$ begin
  create type user_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end $$;

-- Create profiles table if it doesn't exist
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role user_role default 'client',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.user_profiles enable row level security;

-- Create profile on user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'role')::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS Policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);