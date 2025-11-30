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

export async function getSessionTurns(sessionId: string) {
  const { data, error } = await supabase
    .from('rij_profiling_turns')
    .select('*')
    .eq('session_id', sessionId)
    .order('turn_number', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createProfilingTurn(turn: {
  sessionId: string;
  userId: string;
  turnNumber: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  inputMode: 'text' | 'voice' | 'system';
  audioUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from('rij_profiling_turns')
    .insert({
      session_id: turn.sessionId,
      user_id: turn.userId,
      turn_number: turn.turnNumber,
      role: turn.role,
      content: turn.content,
      input_mode: turn.inputMode,
      audio_url: turn.audioUrl,
      metadata: turn.metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSessionMetadata(sessionId: string, metadata: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('rij_profiling_sessions')
    .update({ metadata })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeProfilingSession(sessionId: string) {
  const { data, error } = await supabase
    .from('rij_profiling_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createItinerary(data: {
  userId: string;
  profileId: string;
  title: string;
  description: string;
  totalDays: number;
  metadata: Record<string, unknown>;
}) {
  const { data: result, error } = await supabase
    .from('rij_itineraries')
    .insert({
      user_id: data.userId,
      profile_id: data.profileId,
      title: data.title,
      description: data.description,
      status: 'proposed',
      total_days: data.totalDays,
      metadata: data.metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getItinerary(itineraryId: string) {
  const { data, error } = await supabase
    .from('rij_itineraries')
    .select('*')
    .eq('id', itineraryId)
    .single();

  if (error) throw error;
  return data;
}

export async function reviseItinerary(data: {
  itineraryId: string;
  userId: string;
  revisionRequest: string;
  pinnedBlockIds: string[];
  inputMode: 'text' | 'voice';
}) {
  const { data: result, error } = await supabase
    .from('rij_itinerary_revisions')
    .insert({
      itinerary_id: data.itineraryId,
      user_id: data.userId,
      revision_request: data.revisionRequest,
      pinned_block_ids: data.pinnedBlockIds,
      input_mode: data.inputMode,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function startTrip(data: {
  userId: string;
  itineraryId: string;
  metadata?: Record<string, unknown>;
}) {
  const { data: result, error } = await supabase
    .from('rij_trip_sessions')
    .insert({
      user_id: data.userId,
      itinerary_id: data.itineraryId,
      status: 'active',
      current_day: 1,
      metadata: data.metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}
