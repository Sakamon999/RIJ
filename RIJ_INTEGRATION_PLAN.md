# RIJ MVP Integration Plan

## ✅ Phase 1: Scaffolding (COMPLETED)

### Audit Summary

**Framework & Architecture:**
- Framework: Vite + React SPA (NOT Next.js)
- Routing: Client-side state-based routing
- Styling: Tailwind CSS
- Icons: lucide-react
- Backend: Supabase (already configured)
- i18n: LanguageContext (EN/JA support)

**Existing Route Structure:**
```
State-based pages:
- 'home'        → Main landing with all sections
- 'toji'        → Hot springs wellness
- 'zen'         → Zen meditation
- 'shinrinyoku' → Forest bathing
- 'shokuyojo'   → Culinary healing
- 'matsuri'     → Festival experiences
- 'rij'         → NEW: RIJ MVP (Phase 1)
```

**File Structure:**
```
src/
├── App.tsx                    # Main router (state-based)
├── components/
│   ├── Navigation.tsx         # Header with nav + NEW RIJ button
│   ├── Hero.tsx
│   ├── Philosophy.tsx
│   ├── WellnessCategories.tsx
│   ├── ExperienceGallery.tsx
│   ├── Destinations.tsx
│   ├── RIJMethodology.tsx
│   ├── Footer.tsx
│   └── HealthCheck.tsx
├── pages/
│   ├── TojiPage.tsx
│   ├── ZenPage.tsx
│   ├── ShinrinyokuPage.tsx
│   ├── ShokuyojoPage.tsx
│   ├── MatsuriPage.tsx
│   └── RIJPage.tsx            # NEW: RIJ MVP placeholder
└── contexts/
    └── LanguageContext.tsx
```

### Changes Made (Non-Breaking)

1. **Created `/src/pages/RIJPage.tsx`**
   - Placeholder page with "Coming Online" message
   - Uses existing layout patterns (back button, dark theme)
   - Supports EN/JA via LanguageContext
   - Shows 3 feature preview cards

2. **Updated `/src/App.tsx`**
   - Added `'rij'` to page state type union
   - Added RIJPage import
   - Added conditional render for RIJ page
   - Passed `onRIJClick` callback to Navigation

3. **Updated `/src/components/Navigation.tsx`**
   - Added optional `onRIJClick?: () => void` prop
   - Added prominent "RIJ MVP" button (gradient style, sparkles icon)
   - Button appears in both desktop nav and mobile menu
   - Mobile menu auto-closes on RIJ click

### Environment Variables

Existing Supabase config (already in `.env`):
```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Phase 2: Database Schema (NEXT)

### Supabase Tables to Create

1. **`rij_users` table**
   - User profiles for RIJ MVP
   - Links to Supabase auth.users
   - Stores wellness preferences

2. **`rij_journeys` table**
   - Personalized wellness journey records
   - Status tracking (draft, active, completed)
   - Goal definitions

3. **`rij_sessions` table**
   - Individual wellness sessions
   - Session notes and reflections
   - Progress metrics

4. **`rij_practitioners` table**
   - Verified wellness experts
   - Specialties and certifications
   - Booking availability

### RLS Policies

- Users can only view/edit their own data
- Practitioners table is public read, admin write
- Journey sharing with explicit permissions

---

## 📋 Phase 3: RIJ Components (NEXT)

### Components to Build

```
src/components/rij/
├── RIJDashboard.tsx           # Main dashboard view
├── RIJJourneyCard.tsx         # Journey summary card
├── RIJSessionForm.tsx         # Log session form
├── RIJProgressChart.tsx       # Visualization
├── RIJPractitionerList.tsx    # Browse experts
└── RIJBookingModal.tsx        # Booking interface
```

### Pages to Build

```
src/pages/rij/
├── RIJDashboardPage.tsx       # Main user dashboard
├── RIJJourneyDetailPage.tsx   # Journey details
├── RIJPractitionersPage.tsx   # Practitioner directory
└── RIJProfilePage.tsx         # User profile settings
```

---

## 📋 Phase 4: Authentication (NEXT)

### Auth Flow

1. Use Supabase Auth with email/password
2. No magic links initially (MVP simplicity)
3. Protected route pattern:
   ```tsx
   if (!user && currentPage === 'rij') {
     return <RIJLoginPage />;
   }
   ```

4. Auth context to share user state
5. Session persistence via Supabase client

---

## 📋 Phase 5: API Integration (NEXT)

### API Pattern

Since this is Vite SPA (not Next.js):
- Use Supabase Edge Functions for server-side logic
- Direct Supabase client for CRUD operations
- No traditional API routes

Example:
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 🎯 Next Steps

Run these commands in future prompts:

1. **Create Supabase migrations:**
   ```
   "Create RIJ database schema with rij_users, rij_journeys,
    rij_sessions, and rij_practitioners tables"
   ```

2. **Build authentication:**
   ```
   "Implement Supabase auth with login/signup for RIJ MVP"
   ```

3. **Build dashboard:**
   ```
   "Create RIJ dashboard with journey tracking and progress visualization"
   ```

4. **Build practitioner directory:**
   ```
   "Create RIJ practitioner listing and booking system"
   ```

---

## 🔒 Design Principles

1. **Non-Breaking:** All existing routes remain stable
2. **Namespaced:** RIJ features are isolated under `/rij` page state
3. **Reusable:** Leverage existing components (Navigation, Footer, LanguageContext)
4. **Incremental:** Build feature by feature, deploy continuously
5. **Secure:** RLS on all tables, authenticated routes, data validation

---

## ✅ Verification

- ✅ TypeScript compiles without errors
- ✅ Build succeeds (1.5MB dist)
- ✅ RIJ button appears in navigation
- ✅ RIJ page renders with placeholder content
- ✅ Back button returns to home
- ✅ Bilingual support (EN/JA) works
- ✅ No breaking changes to existing pages

**Status:** Ready for Phase 2 (Database Schema)
