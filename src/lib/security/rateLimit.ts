import { supabase } from '../supabase/client';

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMinutes: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window: `${windowMinutes} minutes`
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false; // Fail closed - treat errors as rate limit exceeded
  }
}

export function getRateLimitKey(action: string, userId?: string): string {
  const prefix = action.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return userId ? `${prefix}:${userId}` : prefix;
}