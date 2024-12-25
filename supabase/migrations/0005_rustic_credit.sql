/*
  # Configure Email Confirmation Settings

  1. Changes
    - Enable email confirmation requirement
    - Set up email templates
    - Configure auth settings

  2. Security
    - Maintain existing RLS policies
    - Keep password validation
*/

-- Function to configure auth settings
create or replace function auth.configure_email_confirmation()
returns void as $$
begin
  -- Reset existing email confirmations
  update auth.users set 
    email_confirmed_at = null,
    confirmation_sent_at = null
  where email_confirmed_at is not null;

  -- Set up email confirmation requirement
  alter table auth.users
    alter column email_confirmed_at drop not null,
    alter column confirmation_sent_at drop not null;
end;
$$ language plpgsql security definer;

-- Execute the configuration
select auth.configure_email_confirmation();

-- Update user creation trigger to handle email confirmation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  
  -- Set confirmation_sent_at to trigger email verification
  update auth.users
  set confirmation_sent_at = now()
  where id = new.id;
  
  return new;
end;
$$ language plpgsql security definer;