import { createClient } from '@supabase/supabase-js';
import { validateSupabaseEnv } from '../env';

const { url, anonKey } = validateSupabaseEnv();

export const supabase = createClient(url, anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export type SupabaseClient = typeof supabase;
