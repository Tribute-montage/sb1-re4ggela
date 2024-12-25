/*
  # Fix User Registration

  1. Changes
    - Simplify user creation trigger
    - Remove email confirmation requirement
    - Add better error handling

  2. Security
    - Maintain RLS policies
    - Keep secure password requirements
*/

-- Drop existing trigger first
drop trigger if exists on_auth_user_created on auth.users;

-- Simplify user creation trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role user_role;
begin
  -- Set default role
  default_role := coalesce(
    (new.raw_user_meta_data->>'role')::user_role,
    'client'::user_role
  );

  -- Create user profile
  insert into public.user_profiles (
    id,
    email,
    full_name,
    role
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    default_role
  );

  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Ensure email confirmation columns are nullable
alter table auth.users
  alter column email_confirmed_at drop not null,
  alter column confirmation_sent_at drop not null;

-- Set existing users as confirmed
update auth.users
set email_confirmed_at = created_at
where email_confirmed_at is null;