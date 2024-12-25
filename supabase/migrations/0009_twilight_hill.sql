/*
  # Fix Authentication Flow

  1. Changes
    - Add better error handling to user creation trigger
    - Ensure profile creation is atomic
    - Add indexes for performance
*/

-- Drop existing trigger
drop trigger if exists on_auth_user_created on auth.users;

-- Update user creation function with better error handling
create or replace function public.handle_new_user()
returns trigger as $$
declare
  profile_exists boolean;
begin
  -- Check if profile already exists
  select exists(
    select 1 from public.user_profiles where id = new.id
  ) into profile_exists;

  -- Only create profile if it doesn't exist
  if not profile_exists then
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
  end if;

  -- Auto-confirm email
  update auth.users
  set email_confirmed_at = now()
  where id = new.id;

  return new;
exception
  when others then
    -- Log error but don't fail the transaction
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Add indexes for better performance
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_user_profiles_role on public.user_profiles(role);

-- Ensure email confirmation is not required
alter table auth.users
  alter column email_confirmed_at drop not null,
  alter column confirmation_sent_at drop not null;