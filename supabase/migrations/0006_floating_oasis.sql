/*
  # Email Configuration Setup

  1. Changes
    - Configure email confirmation settings
    - Update user trigger for email handling
*/

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create user profile
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update email confirmation settings
alter table auth.users
  alter column email_confirmed_at drop not null,
  alter column confirmation_sent_at drop not null;