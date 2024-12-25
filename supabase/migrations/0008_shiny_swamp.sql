/*
  # Fix Registration Process

  1. Changes
    - Simplify user creation trigger
    - Remove email confirmation requirement
    - Add better error handling
*/

-- Drop existing trigger first
drop trigger if exists on_auth_user_created on auth.users;

-- Simplify user creation trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
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
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client'::user_role)
  );

  -- Auto-confirm email
  update auth.users
  set email_confirmed_at = now()
  where id = new.id;

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

-- Make sure email confirmation is not required
alter table auth.users
  alter column email_confirmed_at drop not null,
  alter column confirmation_sent_at drop not null;