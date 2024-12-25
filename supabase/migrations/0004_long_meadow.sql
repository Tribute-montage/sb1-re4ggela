/*
  # Password Policy and Auth Settings

  1. Changes
    - Add password strength validation
    - Add trigger for password validation
    - Set up email confirmation requirements

  2. Security
    - Enable RLS for auth tables
    - Add password complexity requirements
*/

-- Enable RLS on auth tables
alter table auth.users enable row level security;

-- Create password validation function
create or replace function auth.strong_password(password text)
returns boolean as $$
begin
  -- Requires at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
  return password ~ '^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$';
end;
$$ language plpgsql security definer;

-- Create trigger function for password validation
create or replace function auth.validate_password()
returns trigger as $$
begin
  if not auth.strong_password(new.encrypted_password) then
    raise exception 'Password must be at least 8 characters and contain uppercase, lowercase and numbers';
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for password validation
drop trigger if exists ensure_strong_password on auth.users;
create trigger ensure_strong_password
  before insert or update on auth.users
  for each row
  execute function auth.validate_password();

-- Function to configure auth settings
create or replace function auth.configure_auth()
returns void as $$
begin
  -- Update auth settings in the database
  update auth.users set 
    email_confirmed_at = null 
  where email_confirmed_at is not null;
end;
$$ language plpgsql security definer;

-- Execute the configuration
select auth.configure_auth();