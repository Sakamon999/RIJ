# Supabase Integration Documentation

## Overview

Supabase has been integrated into the Reborn In Japan application as the primary backend service, providing authentication, database, and storage capabilities.

## Architecture

**Framework:** Vite + React SPA (Client-side only)
**Backend:** Supabase (Auth, Database, Storage)
**Environment:** Browser-based (no SSR/SSG)

## File Structure

```
src/
├── lib/
│   ├── env.ts                      # Environment variable validation
│   └── supabase/
│       ├── index.ts                # Main exports
│       ├── client.ts               # Browser Supabase client
│       ├── auth.ts                 # Authentication utilities
│       ├── storage.ts              # File storage utilities
│       └── health.ts               # Health check utilities
└── components/
    └── SupabaseHealthCheck.tsx     # Health status component
```

## Environment Variables

Located in `.env`:

```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** These are validated on client initialization via `lib/env.ts`.

## Usage Examples

### Basic Client Usage

```typescript
import { supabase } from '@/lib/supabase';

// Query data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .limit(10);
```

### Authentication

```typescript
import { signInWithEmail, signOut, getUser } from '@/lib/supabase';

// Sign in
const { user, session, error } = await signInWithEmail(
  'user@example.com',
  'password123'
);

// Get current user
const currentUser = await getUser();

// Sign out
await signOut();
```

### Storage / File Uploads

```typescript
import { uploadFile, getPublicUrl } from '@/lib/supabase';

// Upload file
const result = await uploadFile({
  bucket: 'avatars',
  path: `user-${userId}/avatar.jpg`,
  file: fileObject,
  upsert: true,
});

console.log('File URL:', result.url);

// Get public URL
const url = getPublicUrl('avatars', 'path/to/file.jpg');
```

### Health Check

```typescript
import { checkSupabaseHealth } from '@/lib/supabase';

const health = await checkSupabaseHealth();
console.log('Auth connected:', health.auth.connected);
console.log('Database connected:', health.database.connected);
console.log('Overall status:', health.ok);
```

### Auth State Changes

```typescript
import { onAuthStateChange } from '@/lib/supabase';

const { data: { subscription } } = onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Cleanup
subscription.unsubscribe();
```

## Available Utilities

### Auth Module (`lib/supabase/auth.ts`)

- `signInWithEmail(email, password)` - Email/password sign in
- `signUpWithEmail(email, password, options?)` - User registration
- `signInWithOtp(email)` - Magic link / OTP sign in
- `signOut()` - Sign out current user
- `getSession()` - Get current session
- `getUser()` - Get authenticated user (with network verification)
- `onAuthStateChange(callback)` - Subscribe to auth events
- `resetPasswordForEmail(email, redirectTo?)` - Password reset
- `updateUser(attributes)` - Update user profile

### Storage Module (`lib/supabase/storage.ts`)

- `uploadFile({ bucket, path, file, upsert? })` - Upload files
- `deleteFile(bucket, path)` - Delete files
- `getPublicUrl(bucket, path)` - Get public file URL
- `listFiles(bucket, path?)` - List files in bucket
- `createBucket(name, options?)` - Create storage bucket

### Health Module (`lib/supabase/health.ts`)

- `checkSupabaseHealth()` - Complete health check
- `testDatabaseConnection()` - Test DB connectivity
- `getCurrentUser()` - Get current authenticated user

## Component Integration

### SupabaseHealthCheck Component

Shows real-time Supabase connection status:

```tsx
import SupabaseHealthCheck from '@/components/SupabaseHealthCheck';

<SupabaseHealthCheck />
```

**Features:**
- Auth connection status
- Active session detection
- Database connectivity check
- User ID display (if authenticated)
- Auto-refresh on mount

**Currently used in:** `/rij` page

## Security Notes

1. **RLS (Row Level Security):** Must be enabled on all tables in Phase 2
2. **Environment Variables:** Never commit actual keys to Git
3. **Anonymous Key:** Safe to expose in client-side code (public access only)
4. **Service Role Key:** NOT included (server-side only, not applicable for SPA)

## Next Steps (Phase 2)

1. **Database Schema:**
   - Create `rij_users` table
   - Create `rij_journeys` table
   - Create `rij_sessions` table
   - Create `rij_practitioners` table
   - Enable RLS on all tables

2. **Authentication UI:**
   - Create login page
   - Create signup page
   - Add protected route wrapper
   - Add auth context provider

3. **Storage Buckets:**
   - Create `avatars` bucket (public)
   - Create `documents` bucket (private)
   - Create `session-media` bucket (private)

## Troubleshooting

### "Missing required environment variable"
- Check `.env` file exists in project root
- Verify variables start with `VITE_` prefix
- Restart dev server after changing `.env`

### "Failed to establish connection"
- Verify Supabase URL is correct
- Check network connectivity
- Confirm Supabase project is active

### "Auth session expired"
- Call `getSession()` to check session status
- Implement token refresh logic
- Redirect to login if session invalid

## Testing

Health check is automatically run on RIJ page load. To test manually:

```typescript
import { checkSupabaseHealth } from '@/lib/supabase';

const result = await checkSupabaseHealth();
console.log('Health check:', result);
```

Expected output:
```json
{
  "ok": true,
  "timestamp": "2025-11-30T...",
  "auth": {
    "connected": true,
    "hasSession": false
  },
  "database": {
    "connected": true
  }
}
```

## References

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [RLS Policy Guide](https://supabase.com/docs/guides/auth/row-level-security)
