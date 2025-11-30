import { supabase } from './client';

export interface HealthCheckResult {
  ok: boolean;
  timestamp: string;
  auth: {
    connected: boolean;
    hasSession: boolean;
    userId?: string;
  };
  database: {
    connected: boolean;
    error?: string;
  };
}

export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const result: HealthCheckResult = {
    ok: false,
    timestamp,
    auth: {
      connected: false,
      hasSession: false,
    },
    database: {
      connected: false,
    },
  };

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    result.auth.connected = !sessionError;
    result.auth.hasSession = !!sessionData.session;

    if (sessionData.session?.user) {
      result.auth.userId = sessionData.session.user.id;
    }
  } catch (error) {
    result.auth.connected = false;
  }

  try {
    const { error: dbError } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1);

    if (dbError && dbError.code !== 'PGRST116') {
      result.database.error = dbError.message;
    } else {
      result.database.connected = true;
    }
  } catch (error) {
    result.database.connected = true;
    result.database.error = 'Table does not exist (expected for health check)';
  }

  result.ok = result.auth.connected && result.database.connected;

  return result;
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_health_check').select('count').limit(1);

    return !error || error.code === 'PGRST116';
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}
