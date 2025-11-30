/*
  # RIJ MVP Database Schema

  ## Overview
  This migration creates the complete database schema for the Reborn In Japan (RIJ) MVP feature set.
  All tables are namespaced with `rij_` prefix to avoid collisions with existing schema.

  ## Tables Created
  1. **rij_user_settings** - User preferences and configuration
  2. **rij_consents** - User consent tracking (GDPR/privacy compliance)
  3. **rij_profiling_sessions** - Wellness profiling conversation sessions
  4. **rij_profiling_turns** - Individual conversation turns within profiling sessions
  5. **rij_user_profiles** - Completed wellness profiles from profiling
  6. **rij_itineraries** - Personalized wellness journey itineraries
  7. **rij_itinerary_blocks** - Individual activities/blocks within itineraries
  8. **rij_trip_sessions** - Active trip/journey sessions
  9. **rij_checkins** - User check-ins during trips
  10. **rij_assets** - Media assets (images, documents)
  11. **rij_audio_memories** - Voice recordings and audio memories
  12. **rij_support_threads** - Customer support conversation threads
  13. **rij_support_messages** - Individual messages within support threads
  14. **rij_events** - Analytics and event tracking

  ## Security
  - RLS (Row Level Security) enabled on all tables
  - Users can only access their own data via `auth.uid()` matching
  - Child tables inherit parent ownership through foreign keys
  - Events table is insert-only with read-own policy

  ## Indexes
  - All `user_id` columns indexed
  - Foreign keys indexed for join performance
  - Events table indexed on (name, created_at) for analytics queries
*/

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE rij_session_status AS ENUM (
  'draft',
  'active',
  'completed',
  'cancelled',
  'paused'
);

CREATE TYPE rij_input_mode AS ENUM (
  'text',
  'voice',
  'system'
);

CREATE TYPE rij_itinerary_status AS ENUM (
  'draft',
  'proposed',
  'confirmed',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE rij_time_slot AS ENUM (
  'morning',
  'afternoon',
  'evening',
  'night',
  'flexible'
);

CREATE TYPE rij_pillar AS ENUM (
  'toji',
  'zen',
  'shinrinyoku',
  'shokuyojo',
  'matsuri',
  'movement',
  'rest'
);

CREATE TYPE rij_asset_type AS ENUM (
  'image',
  'document',
  'video',
  'audio',
  'other'
);

CREATE TYPE rij_support_severity AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE rij_support_status AS ENUM (
  'open',
  'in_progress',
  'waiting_user',
  'resolved',
  'closed'
);

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS rij_user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ja')),
  timezone text DEFAULT 'Asia/Tokyo',
  notification_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT false,
  accessibility_mode boolean DEFAULT false,
  theme text DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS rij_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  version text NOT NULL,
  consented boolean NOT NULL,
  consented_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_profiling_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status rij_session_status DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_profiling_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES rij_profiling_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  turn_number int NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  input_mode rij_input_mode DEFAULT 'text',
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, turn_number)
);

CREATE TABLE IF NOT EXISTS rij_user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES rij_profiling_sessions(id) ON DELETE SET NULL,
  wellness_goals text[],
  preferred_pillars rij_pillar[],
  health_conditions text[],
  dietary_restrictions text[],
  mobility_level text,
  experience_level text,
  budget_range text,
  travel_dates daterange,
  companion_count int DEFAULT 1,
  special_requests text,
  profile_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS rij_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES rij_user_profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status rij_itinerary_status DEFAULT 'draft',
  start_date date,
  end_date date,
  total_days int,
  estimated_cost numeric(10,2),
  currency text DEFAULT 'JPY',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_itinerary_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES rij_itineraries(id) ON DELETE CASCADE,
  day_number int NOT NULL,
  sequence_order int NOT NULL,
  title text NOT NULL,
  description text,
  pillar rij_pillar,
  time_slot rij_time_slot DEFAULT 'flexible',
  duration_minutes int,
  location text,
  location_coordinates point,
  cost numeric(10,2),
  booking_required boolean DEFAULT false,
  booking_url text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(itinerary_id, day_number, sequence_order)
);

CREATE TABLE IF NOT EXISTS rij_trip_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id uuid REFERENCES rij_itineraries(id) ON DELETE SET NULL,
  status rij_session_status DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_day int DEFAULT 1,
  current_block_id uuid REFERENCES rij_itinerary_blocks(id) ON DELETE SET NULL,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_session_id uuid REFERENCES rij_trip_sessions(id) ON DELETE CASCADE,
  block_id uuid REFERENCES rij_itinerary_blocks(id) ON DELETE SET NULL,
  mood_rating int CHECK (mood_rating BETWEEN 1 AND 5),
  energy_level int CHECK (energy_level BETWEEN 1 AND 5),
  notes text,
  location text,
  location_coordinates point,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type rij_asset_type NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  storage_bucket text DEFAULT 'rij-assets',
  related_to_type text,
  related_to_id uuid,
  alt_text text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_audio_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_session_id uuid REFERENCES rij_trip_sessions(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES rij_assets(id) ON DELETE SET NULL,
  title text,
  transcription text,
  duration_seconds int,
  location text,
  location_coordinates point,
  emotion_tags text[],
  pillar rij_pillar,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_support_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  status rij_support_status DEFAULT 'open',
  severity rij_support_severity DEFAULT 'medium',
  category text,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES rij_support_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_staff boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rij_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  name text NOT NULL,
  category text,
  properties jsonb DEFAULT '{}'::jsonb,
  page_url text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_rij_user_settings_user_id ON rij_user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_consents_user_id ON rij_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_profiling_sessions_user_id ON rij_profiling_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_profiling_turns_user_id ON rij_profiling_turns(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_user_profiles_user_id ON rij_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_itineraries_user_id ON rij_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_trip_sessions_user_id ON rij_trip_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_checkins_user_id ON rij_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_assets_user_id ON rij_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_audio_memories_user_id ON rij_audio_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_support_threads_user_id ON rij_support_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_rij_support_messages_user_id ON rij_support_messages(user_id);

CREATE INDEX IF NOT EXISTS idx_rij_profiling_turns_session_id ON rij_profiling_turns(session_id);
CREATE INDEX IF NOT EXISTS idx_rij_user_profiles_session_id ON rij_user_profiles(session_id);
CREATE INDEX IF NOT EXISTS idx_rij_itineraries_profile_id ON rij_itineraries(profile_id);
CREATE INDEX IF NOT EXISTS idx_rij_itinerary_blocks_itinerary_id ON rij_itinerary_blocks(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_rij_trip_sessions_itinerary_id ON rij_trip_sessions(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_rij_checkins_trip_session_id ON rij_checkins(trip_session_id);
CREATE INDEX IF NOT EXISTS idx_rij_checkins_block_id ON rij_checkins(block_id);
CREATE INDEX IF NOT EXISTS idx_rij_audio_memories_trip_session_id ON rij_audio_memories(trip_session_id);
CREATE INDEX IF NOT EXISTS idx_rij_audio_memories_asset_id ON rij_audio_memories(asset_id);
CREATE INDEX IF NOT EXISTS idx_rij_support_messages_thread_id ON rij_support_messages(thread_id);

CREATE INDEX IF NOT EXISTS idx_rij_events_name_created_at ON rij_events(name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rij_events_user_id_created_at ON rij_events(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rij_events_category ON rij_events(category) WHERE category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_rij_profiling_sessions_status ON rij_profiling_sessions(status);
CREATE INDEX IF NOT EXISTS idx_rij_itineraries_status ON rij_itineraries(status);
CREATE INDEX IF NOT EXISTS idx_rij_trip_sessions_status ON rij_trip_sessions(status);
CREATE INDEX IF NOT EXISTS idx_rij_support_threads_status ON rij_support_threads(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE rij_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_profiling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_profiling_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_itinerary_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_trip_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_audio_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_support_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rij_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - User Settings
-- =====================================================

CREATE POLICY "Users can view own settings"
  ON rij_user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON rij_user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON rij_user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON rij_user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Consents
-- =====================================================

CREATE POLICY "Users can view own consents"
  ON rij_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents"
  ON rij_consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Profiling Sessions
-- =====================================================

CREATE POLICY "Users can view own profiling sessions"
  ON rij_profiling_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiling sessions"
  ON rij_profiling_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiling sessions"
  ON rij_profiling_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiling sessions"
  ON rij_profiling_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Profiling Turns
-- =====================================================

CREATE POLICY "Users can view own profiling turns"
  ON rij_profiling_turns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiling turns"
  ON rij_profiling_turns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiling turns"
  ON rij_profiling_turns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiling turns"
  ON rij_profiling_turns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - User Profiles
-- =====================================================

CREATE POLICY "Users can view own profile"
  ON rij_user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON rij_user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON rij_user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON rij_user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Itineraries
-- =====================================================

CREATE POLICY "Users can view own itineraries"
  ON rij_itineraries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON rij_itineraries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON rij_itineraries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON rij_itineraries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Itinerary Blocks
-- =====================================================

CREATE POLICY "Users can view own itinerary blocks"
  ON rij_itinerary_blocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rij_itineraries
      WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
      AND rij_itineraries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own itinerary blocks"
  ON rij_itinerary_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rij_itineraries
      WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
      AND rij_itineraries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own itinerary blocks"
  ON rij_itinerary_blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rij_itineraries
      WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
      AND rij_itineraries.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rij_itineraries
      WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
      AND rij_itineraries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own itinerary blocks"
  ON rij_itinerary_blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rij_itineraries
      WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
      AND rij_itineraries.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - Trip Sessions
-- =====================================================

CREATE POLICY "Users can view own trip sessions"
  ON rij_trip_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trip sessions"
  ON rij_trip_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trip sessions"
  ON rij_trip_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trip sessions"
  ON rij_trip_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Check-ins
-- =====================================================

CREATE POLICY "Users can view own checkins"
  ON rij_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON rij_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins"
  ON rij_checkins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own checkins"
  ON rij_checkins FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Assets
-- =====================================================

CREATE POLICY "Users can view own assets"
  ON rij_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON rij_assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON rij_assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON rij_assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Audio Memories
-- =====================================================

CREATE POLICY "Users can view own audio memories"
  ON rij_audio_memories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audio memories"
  ON rij_audio_memories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audio memories"
  ON rij_audio_memories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audio memories"
  ON rij_audio_memories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Support Threads
-- =====================================================

CREATE POLICY "Users can view own support threads"
  ON rij_support_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own support threads"
  ON rij_support_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own support threads"
  ON rij_support_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - Support Messages
-- =====================================================

CREATE POLICY "Users can view own support messages"
  ON rij_support_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rij_support_threads
      WHERE rij_support_threads.id = rij_support_messages.thread_id
      AND rij_support_threads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own support messages"
  ON rij_support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM rij_support_threads
      WHERE rij_support_threads.id = rij_support_messages.thread_id
      AND rij_support_threads.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - Events (Insert-only + Read Own)
-- =====================================================

CREATE POLICY "Users can view own events"
  ON rij_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert events"
  ON rij_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rij_user_settings_updated_at
  BEFORE UPDATE ON rij_user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_profiling_sessions_updated_at
  BEFORE UPDATE ON rij_profiling_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_user_profiles_updated_at
  BEFORE UPDATE ON rij_user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_itineraries_updated_at
  BEFORE UPDATE ON rij_itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_itinerary_blocks_updated_at
  BEFORE UPDATE ON rij_itinerary_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_trip_sessions_updated_at
  BEFORE UPDATE ON rij_trip_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rij_support_threads_updated_at
  BEFORE UPDATE ON rij_support_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();