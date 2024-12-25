import { supabase } from '../supabase/client';
import { checkRateLimit, getRateLimitKey } from './rateLimit';
import { logSecurityEvent, AUDIT_ACTIONS } from './audit';
import { passwordSchema } from './validation';

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MINUTES = 15;
const PASSWORD_HISTORY_SIZE = 5;

export async function enhancedSignIn(email: string, password: string): Promise<boolean> {
  const rateLimitKey = getRateLimitKey('login', email);
  const withinLimit = await checkRateLimit(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MINUTES);

  if (!withinLimit) {
    throw new Error('Too many login attempts. Please try again later.');
  }

  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('Login failed');

    await logSecurityEvent(
      AUDIT_ACTIONS.LOGIN,
      'user',
      user.id,
      { success: true }
    );

    return true;
  } catch (error) {
    await logSecurityEvent(
      AUDIT_ACTIONS.LOGIN,
      'user',
      email,
      { success: false, error: error.message }
    );
    throw error;
  }
}

export async function enhancedPasswordChange(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Validate new password
  passwordSchema.parse(newPassword);

  // Check password history
  const { data: passwordHistory } = await supabase
    .from('password_history')
    .select('password_hash')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PASSWORD_HISTORY_SIZE);

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;

  // Log the event
  await logSecurityEvent(
    AUDIT_ACTIONS.PASSWORD_CHANGE,
    'user',
    userId
  );
}