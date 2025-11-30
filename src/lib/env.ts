export function getEnvVar(key: string): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function validateSupabaseEnv() {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const anonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

  if (!url.startsWith('http')) {
    throw new Error('VITE_SUPABASE_URL must be a valid URL');
  }

  if (anonKey.length < 100) {
    throw new Error('VITE_SUPABASE_ANON_KEY appears to be invalid');
  }

  return { url, anonKey };
}
