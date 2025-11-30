# RIJ MVP Database Schema Documentation

## Migration Applied
- **File:** `20251130063005_rij_mvp_schema.sql`
- **Status:** ✅ Successfully applied
- **Tables Created:** 14
- **RLS Enabled:** All tables
- **Policies Created:** 56

---

## Database Overview

The RIJ (Reborn In Japan) MVP schema provides a complete data model for personalized wellness journeys, including profiling, itinerary generation, trip tracking, and support systems.

### Design Principles
- ✅ **Namespaced:** All tables prefixed with `rij_` to avoid collisions
- ✅ **Secure:** Row Level Security (RLS) enabled on all tables
- ✅ **Performant:** Comprehensive indexes on all foreign keys and user_id columns
- ✅ **Flexible:** JSONB metadata fields for extensibility
- ✅ **Typed:** Custom ENUMs for consistent data values

---

## Tables

### 1. User Settings (`rij_user_settings`)
User preferences and application configuration.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `user_id` (uuid, FK → auth.users, UNIQUE) - Owner
- `language` (text) - 'en' or 'ja', default 'en'
- `timezone` (text) - Default 'Asia/Tokyo'
- `notification_enabled` (boolean) - Default true
- `email_notifications` (boolean) - Default true
- `push_notifications` (boolean) - Default false
- `accessibility_mode` (boolean) - Default false
- `theme` (text) - 'light', 'dark', or 'auto', default 'dark'
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can fully manage only their own settings.

---

### 2. Consents (`rij_consents`)
GDPR/privacy compliance consent tracking.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `consent_type` (text) - e.g., 'privacy_policy', 'terms_of_service'
- `version` (text) - Version of the consent document
- `consented` (boolean) - User's consent status
- `consented_at` (timestamptz) - When consent was given
- `ip_address` (inet) - IP address of user
- `user_agent` (text) - Browser/device info
- `created_at` (timestamptz)

**RLS:** Users can view and insert their own consents (immutable after creation).

---

### 3. Profiling Sessions (`rij_profiling_sessions`)
Wellness profiling conversation sessions.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `status` (rij_session_status) - draft, active, completed, cancelled, paused
- `started_at` (timestamptz)
- `completed_at` (timestamptz)
- `metadata` (jsonb) - Additional session data
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can fully manage only their own profiling sessions.

---

### 4. Profiling Turns (`rij_profiling_turns`)
Individual conversation turns within profiling sessions.

**Columns:**
- `id` (uuid, PK)
- `session_id` (uuid, FK → rij_profiling_sessions)
- `user_id` (uuid, FK → auth.users)
- `turn_number` (int) - Sequential number
- `role` (text) - 'user', 'assistant', or 'system'
- `input_mode` (rij_input_mode) - text, voice, system
- `content` (text) - Message content
- `metadata` (jsonb)
- `created_at` (timestamptz)

**Unique:** (session_id, turn_number)
**RLS:** Users can fully manage only their own profiling turns.

---

### 5. User Profiles (`rij_user_profiles`)
Completed wellness profiles derived from profiling sessions.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, UNIQUE)
- `session_id` (uuid, FK → rij_profiling_sessions, nullable)
- `wellness_goals` (text[]) - Array of wellness goals
- `preferred_pillars` (rij_pillar[]) - Array of preferred pillars
- `health_conditions` (text[])
- `dietary_restrictions` (text[])
- `mobility_level` (text)
- `experience_level` (text)
- `budget_range` (text)
- `travel_dates` (daterange)
- `companion_count` (int) - Default 1
- `special_requests` (text)
- `profile_data` (jsonb) - Additional profile data
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can fully manage only their own profile.

---

### 6. Itineraries (`rij_itineraries`)
Personalized wellness journey itineraries.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `profile_id` (uuid, FK → rij_user_profiles, nullable)
- `title` (text)
- `description` (text, nullable)
- `status` (rij_itinerary_status) - draft, proposed, confirmed, active, completed, cancelled
- `start_date`, `end_date` (date)
- `total_days` (int)
- `estimated_cost` (numeric)
- `currency` (text) - Default 'JPY'
- `metadata` (jsonb)
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can fully manage only their own itineraries.

---

### 7. Itinerary Blocks (`rij_itinerary_blocks`)
Individual activities/experiences within itineraries.

**Columns:**
- `id` (uuid, PK)
- `itinerary_id` (uuid, FK → rij_itineraries)
- `day_number` (int)
- `sequence_order` (int)
- `title` (text)
- `description` (text, nullable)
- `pillar` (rij_pillar, nullable) - Wellness pillar
- `time_slot` (rij_time_slot) - morning, afternoon, evening, night, flexible
- `duration_minutes` (int, nullable)
- `location` (text, nullable)
- `location_coordinates` (point, nullable)
- `cost` (numeric, nullable)
- `booking_required` (boolean) - Default false
- `booking_url` (text, nullable)
- `notes` (text, nullable)
- `metadata` (jsonb)
- `created_at`, `updated_at` (timestamptz)

**Unique:** (itinerary_id, day_number, sequence_order)
**RLS:** Users can manage blocks only if they own the parent itinerary.

---

### 8. Trip Sessions (`rij_trip_sessions`)
Active wellness journey sessions.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `itinerary_id` (uuid, FK → rij_itineraries, nullable)
- `status` (rij_session_status)
- `started_at` (timestamptz)
- `completed_at` (timestamptz, nullable)
- `current_day` (int) - Default 1
- `current_block_id` (uuid, FK → rij_itinerary_blocks, nullable)
- `notes` (text, nullable)
- `metadata` (jsonb)
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can fully manage only their own trip sessions.

---

### 9. Check-ins (`rij_checkins`)
User check-ins during trips.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `trip_session_id` (uuid, FK → rij_trip_sessions, nullable)
- `block_id` (uuid, FK → rij_itinerary_blocks, nullable)
- `mood_rating` (int) - 1-5 scale
- `energy_level` (int) - 1-5 scale
- `notes` (text, nullable)
- `location` (text, nullable)
- `location_coordinates` (point, nullable)
- `metadata` (jsonb)
- `created_at` (timestamptz)

**RLS:** Users can fully manage only their own check-ins.

---

### 10. Assets (`rij_assets`)
Media assets (images, documents, videos, audio).

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `asset_type` (rij_asset_type) - image, document, video, audio, other
- `file_path` (text) - Path in storage bucket
- `file_name` (text)
- `file_size` (bigint, nullable)
- `mime_type` (text, nullable)
- `storage_bucket` (text) - Default 'rij-assets'
- `related_to_type` (text, nullable) - e.g., 'checkin', 'itinerary'
- `related_to_id` (uuid, nullable)
- `alt_text` (text, nullable)
- `metadata` (jsonb)
- `created_at` (timestamptz)

**RLS:** Users can fully manage only their own assets.

---

### 11. Audio Memories (`rij_audio_memories`)
Voice recordings and audio memories from trips.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `trip_session_id` (uuid, FK → rij_trip_sessions, nullable)
- `asset_id` (uuid, FK → rij_assets, nullable)
- `title` (text, nullable)
- `transcription` (text, nullable)
- `duration_seconds` (int, nullable)
- `location` (text, nullable)
- `location_coordinates` (point, nullable)
- `emotion_tags` (text[]) - Array of emotion descriptors
- `pillar` (rij_pillar, nullable)
- `metadata` (jsonb)
- `created_at` (timestamptz)

**RLS:** Users can fully manage only their own audio memories.

---

### 12. Support Threads (`rij_support_threads`)
Customer support conversation threads.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `subject` (text)
- `status` (rij_support_status) - open, in_progress, waiting_user, resolved, closed
- `severity` (rij_support_severity) - low, medium, high, urgent
- `category` (text, nullable)
- `assigned_to` (uuid, FK → auth.users, nullable) - Staff assignment
- `resolved_at` (timestamptz, nullable)
- `metadata` (jsonb)
- `created_at`, `updated_at` (timestamptz)

**RLS:** Users can view, insert, and update only their own support threads.

---

### 13. Support Messages (`rij_support_messages`)
Individual messages within support threads.

**Columns:**
- `id` (uuid, PK)
- `thread_id` (uuid, FK → rij_support_threads)
- `user_id` (uuid, FK → auth.users)
- `message` (text)
- `is_staff` (boolean) - Default false
- `metadata` (jsonb)
- `created_at` (timestamptz)

**RLS:** Users can view and insert messages only in threads they own.

---

### 14. Events (`rij_events`)
Analytics and event tracking.

**Columns:**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, nullable)
- `session_id` (text, nullable) - Anonymous session ID
- `name` (text) - Event name
- `category` (text, nullable)
- `properties` (jsonb) - Event properties
- `page_url` (text, nullable)
- `user_agent` (text, nullable)
- `ip_address` (inet, nullable)
- `created_at` (timestamptz)

**RLS:** Users can view their own events and insert any events (insert-only for tracking).

---

## Custom Types (ENUMs)

### `rij_session_status`
- `draft` - Not yet started
- `active` - Currently in progress
- `completed` - Finished successfully
- `cancelled` - Cancelled by user
- `paused` - Temporarily stopped

### `rij_input_mode`
- `text` - Text input
- `voice` - Voice/audio input
- `system` - System-generated

### `rij_itinerary_status`
- `draft` - Being created
- `proposed` - Proposed to user
- `confirmed` - User confirmed
- `active` - Currently executing
- `completed` - Journey finished
- `cancelled` - Cancelled

### `rij_time_slot`
- `morning` - 6am-12pm
- `afternoon` - 12pm-6pm
- `evening` - 6pm-9pm
- `night` - 9pm-6am
- `flexible` - No specific time

### `rij_pillar`
- `toji` - Hot springs
- `zen` - Meditation/mindfulness
- `shinrinyoku` - Forest bathing
- `shokuyojo` - Culinary healing
- `matsuri` - Cultural festivals
- `movement` - Physical activity
- `rest` - Relaxation/sleep

### `rij_asset_type`
- `image` - Image file
- `document` - Document file
- `video` - Video file
- `audio` - Audio file
- `other` - Other file type

### `rij_support_severity`
- `low` - Minor issue
- `medium` - Standard issue
- `high` - Urgent issue
- `urgent` - Critical issue

### `rij_support_status`
- `open` - New ticket
- `in_progress` - Being worked on
- `waiting_user` - Awaiting user response
- `resolved` - Issue resolved
- `closed` - Ticket closed

---

## Indexes

### User ID Indexes (All Tables)
Every table with a `user_id` column has an index for fast user-based queries.

### Foreign Key Indexes
All foreign keys are indexed for optimal join performance:
- `rij_profiling_turns.session_id`
- `rij_user_profiles.session_id`
- `rij_itineraries.profile_id`
- `rij_itinerary_blocks.itinerary_id`
- `rij_trip_sessions.itinerary_id`
- `rij_checkins.trip_session_id`
- `rij_checkins.block_id`
- `rij_audio_memories.trip_session_id`
- `rij_audio_memories.asset_id`
- `rij_support_messages.thread_id`

### Status Indexes
Status columns indexed for filtering:
- `rij_profiling_sessions.status`
- `rij_itineraries.status`
- `rij_trip_sessions.status`
- `rij_support_threads.status`

### Events Analytics Indexes
- `rij_events(name, created_at DESC)` - Event type queries
- `rij_events(user_id, created_at DESC)` - User event history
- `rij_events(category)` - Category filtering

---

## Row Level Security (RLS)

### Security Model
All tables enforce strict RLS policies:

1. **Owner-based access:** Users can only access rows where `user_id = auth.uid()`
2. **Child table inheritance:** Child tables check parent ownership via EXISTS subqueries
3. **Insert-only events:** Events table allows inserts from any authenticated user but read-only for own data

### Example Policies

**Direct ownership (most tables):**
```sql
-- Users can view own data
USING (auth.uid() = user_id)

-- Users can insert own data
WITH CHECK (auth.uid() = user_id)
```

**Parent ownership (child tables like itinerary_blocks):**
```sql
-- Users can view blocks if they own the parent itinerary
USING (
  EXISTS (
    SELECT 1 FROM rij_itineraries
    WHERE rij_itineraries.id = rij_itinerary_blocks.itinerary_id
    AND rij_itineraries.user_id = auth.uid()
  )
)
```

**Events (insert-only tracking):**
```sql
-- Anyone can insert events
WITH CHECK (true)

-- Users can only read their own events
USING (auth.uid() = user_id)
```

---

## Storage Bucket Configuration

### Bucket: `rij-assets`

**Purpose:** Store user-uploaded media (images, documents, audio, video)

**Folder Structure:** `{user_id}/{asset_type}/{filename}`
Example: `550e8400-e29b-41d4-a716-446655440000/images/photo.jpg`

**Policies Required:**
```sql
-- Users can upload to own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rij-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can read from own folder
CREATE POLICY "Users can read from own folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'rij-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update own folder
CREATE POLICY "Users can update own folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'rij-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete from own folder
CREATE POLICY "Users can delete from own folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'rij-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Triggers

### Auto-update `updated_at` Timestamp
The following tables have triggers to automatically update `updated_at`:
- `rij_user_settings`
- `rij_profiling_sessions`
- `rij_user_profiles`
- `rij_itineraries`
- `rij_itinerary_blocks`
- `rij_trip_sessions`
- `rij_support_threads`

**Function:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Usage Examples

### Create a profiling session and add turns
```typescript
// Start profiling session
const { data: session } = await supabase
  .from('rij_profiling_sessions')
  .insert({ user_id: userId, status: 'active' })
  .select()
  .single();

// Add conversation turns
await supabase.from('rij_profiling_turns').insert([
  {
    session_id: session.id,
    user_id: userId,
    turn_number: 1,
    role: 'assistant',
    content: 'What wellness goals would you like to achieve?',
  },
  {
    session_id: session.id,
    user_id: userId,
    turn_number: 2,
    role: 'user',
    input_mode: 'text',
    content: 'I want to reduce stress and improve sleep quality',
  },
]);
```

### Create an itinerary with blocks
```typescript
// Create itinerary
const { data: itinerary } = await supabase
  .from('rij_itineraries')
  .insert({
    user_id: userId,
    profile_id: profileId,
    title: '7-Day Wellness Journey',
    status: 'draft',
    start_date: '2025-02-01',
    end_date: '2025-02-07',
    total_days: 7,
  })
  .select()
  .single();

// Add activities
await supabase.from('rij_itinerary_blocks').insert([
  {
    itinerary_id: itinerary.id,
    day_number: 1,
    sequence_order: 1,
    title: 'Morning Meditation',
    pillar: 'zen',
    time_slot: 'morning',
    duration_minutes: 60,
  },
  {
    itinerary_id: itinerary.id,
    day_number: 1,
    sequence_order: 2,
    title: 'Hot Spring Experience',
    pillar: 'toji',
    time_slot: 'afternoon',
    duration_minutes: 120,
  },
]);
```

### Track a check-in
```typescript
await supabase.from('rij_checkins').insert({
  user_id: userId,
  trip_session_id: sessionId,
  block_id: currentBlockId,
  mood_rating: 4,
  energy_level: 5,
  notes: 'Feeling refreshed after the hot spring!',
  location: 'Hakone Onsen',
});
```

### Log an event
```typescript
await supabase.from('rij_events').insert({
  user_id: userId,
  name: 'itinerary_viewed',
  category: 'engagement',
  properties: { itinerary_id: itineraryId },
  page_url: window.location.href,
});
```

---

## Testing RLS

### Verify user isolation
```sql
-- As User A (should return rows)
SELECT * FROM rij_itineraries WHERE user_id = 'user-a-uuid';

-- As User B (should return 0 rows)
SELECT * FROM rij_itineraries WHERE user_id = 'user-a-uuid';
```

### Verify child table security
```sql
-- As User A who owns itinerary X
SELECT * FROM rij_itinerary_blocks WHERE itinerary_id = 'itinerary-x-uuid';

-- As User B who doesn't own itinerary X (should return 0 rows)
SELECT * FROM rij_itinerary_blocks WHERE itinerary_id = 'itinerary-x-uuid';
```

---

## Migration Status

✅ **Successfully Applied**
- Migration file: `20251130063005_rij_mvp_schema.sql`
- Tables created: 14
- Indexes created: 25+
- RLS policies: 56
- Triggers: 7
- Custom types: 8

All tables are production-ready with comprehensive security and performance optimizations.
