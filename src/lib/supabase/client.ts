import { createClient } from '@supabase/supabase-js';
import { validateSupabaseEnv } from '../env';

const { url, anonKey } = validateSupabaseEnv();

const supabaseUrl = url || 'https://placeholder.supabase.co';
const supabaseKey = anonKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export type SupabaseClient = typeof supabase;

export const isSupabaseConfigured = () => {
  return url && anonKey && url.startsWith('http');
};
