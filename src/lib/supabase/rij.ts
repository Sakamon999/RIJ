import { supabase } from './client';
import type { Locale } from '../rij/types';

export interface ConsentData {
  userId: string;
  audioConsent: boolean;
  bioConsent: boolean;
  locationConsent: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionData {
  userId: string;
  locale: Locale;
  metadata?: Record<string, unknown>;
}

export async function createConsents(data: ConsentData) {
  const consents = [
    {
      user_id: data.userId,
      consent_type: 'audio_recording',
      version: '1.0',
      consented: data.audioConsent,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    },
    {
      user_id: data.userId,
      consent_type: 'biometric_data',
      version: '1.0',
      consented: data.bioConsent,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    },
    {
      user_id: data.userId,
      consent_type: 'location_tracking',
      version: '1.0',
      consented: data.locationConsent,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    },
  ];

  const { data: result, error } = await supabase
    .from('rij_consents')
    .insert(consents)
    .select();

  if (error) throw error;
  return result;
}

export async function createProfilingSession(data: SessionData) {
  const { data: result, error } = await supabase
    .from('rij_profiling_sessions')
    .insert({
      user_id: data.userId,
      status: 'active',
      metadata: {
        locale: data.locale,
        ...data.metadata,
      },
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getOrCreateAnonymousUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return user.id;
  }

  const anonymousId = crypto.randomUUID();
  return anonymousId;
}

export async function getUserConsents(userId: string) {
  const { data, error } = await supabase
    .from('rij_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserSession(sessionId: string) {
  const { data, error } = await supabase
    .from('rij_profiling_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  return data;
}
