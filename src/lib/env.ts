export function getEnvVar(key: string): string {
  const value = import.meta.env[key];

  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }

  return value;
}

export function validateSupabaseEnv() {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const anonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

  if (!url) {
    console.error('VITE_SUPABASE_URL is not set');
    return { url: '', anonKey: '' };
  }

  if (!url.startsWith('http')) {
    console.error('VITE_SUPABASE_URL must be a valid URL');
    return { url: '', anonKey: '' };
  }

  if (!anonKey) {
    console.error('VITE_SUPABASE_ANON_KEY is not set');
    return { url: '', anonKey: '' };
  }

  if (anonKey.length < 100) {
    console.error('VITE_SUPABASE_ANON_KEY appears to be invalid');
    return { url: '', anonKey: '' };
  }

  return { url, anonKey };
}
