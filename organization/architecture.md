# Good Baby Bad Baby - Architecture Reference

> A TikTok-style pet content app where users share "good baby" and "bad baby" moments of their pets.

## Quick Reference

| Aspect | Technology |
|--------|------------|
| Framework | React Native 0.81.5 + Expo 54 |
| Language | TypeScript 5.9 (strict mode) |
| Navigation | Expo Router 6 (file-based) |
| State | Zustand 5 |
| Backend | Supabase (Postgres + Auth + Storage) |
| Media | expo-image, expo-video, expo-image-picker |

---

## Project Structure

```
goodbabybadbaby/
├── app/                        # Expo Router file-based routing
│   ├── (auth)/                 # Auth screens (welcome, login, signup, forgot-password)
│   ├── (tabs)/                 # Main app tabs (feed, create button, profile)
│   ├── (create)/               # Post creation flow (modal overlay)
│   ├── (onboarding)/           # First-time user setup (add-pet)
│   ├── _layout.tsx             # Root layout with auth routing logic
│   └── +not-found.tsx          # 404 handler
├── stores/                     # Zustand state management
│   ├── authStore.ts            # Auth, user, pets, onboarding state
│   ├── feedStore.ts            # Feed posts, filtering, pagination
│   └── createPostStore.ts      # Post creation draft state
├── components/                 # React Native components
│   ├── feed/                   # PostCard, FeedFilters
│   ├── create/                 # AddPetModal, GoodBadToggle, PetSelector, TagSelector
│   └── *.tsx                   # Shared components (LoadingScreen, LegalModal, etc.)
├── lib/                        # Utilities & services
│   ├── supabase.ts             # Supabase client initialization
│   ├── media/                  # Upload, image/video processing, validation
│   └── constants/              # Species emoji mappings
├── types/                      # TypeScript definitions
│   ├── database.ts             # Auto-generated Supabase DB types
│   ├── models.ts               # App-level types (FeedPost, Badge, Premium, etc.)
│   ├── api.ts                  # API request/response types
│   └── navigation.ts           # Route parameter types
├── constants/                  # App constants
│   └── Colors.ts               # Theme colors
├── hooks/                      # Custom React hooks (planned)
├── assets/                     # Images, fonts, icons
├── supabase/                   # Supabase configuration
│   └── migrations/             # SQL migrations for database functions
│       └── 003_hot_ranking.sql # Hot score calculation & triggers
└── organization/               # Project documentation
    ├── architecture.md         # This file
    ├── TRACKER.md              # Development progress tracker
    └── tickets/                # Feature tickets
```

---

## Navigation Architecture

### Route Groups

```
Root Layout (_layout.tsx)
├── /(auth)          # Unauthenticated users
│   ├── welcome      # Landing page
│   ├── login        # Email/password sign in
│   ├── signup       # Registration
│   └── forgot-password
├── /(onboarding)    # Authenticated but no pets
│   └── add-pet      # First pet setup
├── /(tabs)          # Main authenticated app
│   ├── index        # Feed (TikTok-style vertical scroll)
│   ├── create       # Create post button (opens modal)
│   └── two          # Profile (coming soon)
└── /(create)        # Modal overlay for post creation
    ├── index        # Media picker
    ├── editor       # Crop/edit
    ├── details      # Pet & type selection
    └── preview      # Final review
```

### Routing Logic (Root Layout)

```typescript
// Conditional navigation based on auth state
if (status === 'unauthenticated') {
  return <Redirect href="/(auth)/welcome" />
}
if (status === 'authenticated' && !hasCompletedOnboarding) {
  return <Redirect href="/(onboarding)/add-pet" />
}
// Otherwise: render main app (tabs)
```

---

## State Management (Zustand)

### Auth Store (`stores/authStore.ts`)

```typescript
interface AuthState {
  // Status
  status: 'loading' | 'authenticated' | 'unauthenticated'
  session: Session | null
  supabaseUser: SupabaseUser | null
  user: User | null
  pets: Pet[]
  hasPets: boolean
  hasCompletedOnboarding: boolean
  isLoading: boolean
  error: string | null

  // Actions
  initialize(): Promise<void>
  signInWithEmail(email, password): Promise<{ error: string | null }>
  signUpWithEmail(email, password, displayName): Promise<{ error: string | null }>
  signOut(): Promise<void>
  resetPassword(email): Promise<{ error: string | null }>
  refreshPets(): Promise<void>
  addPet(pet: Pet): void
  skipOnboarding(): void
  clearError(): void
}
```

### Feed Store (`stores/feedStore.ts`)

```typescript
interface FeedState {
  posts: FeedPost[]
  feedType: 'hot' | 'new' | 'following'
  filter: 'all' | 'good' | 'bad'
  species?: SpeciesType
  cursor: string | null           // Cursor-based pagination
  hasMore: boolean
  isLoading: boolean
  isRefreshing: boolean
  isLoadingMore: boolean
  error: string | null

  // Actions
  fetchFeed(): Promise<void>
  refreshFeed(): Promise<void>
  loadMore(): Promise<void>       // Infinite scroll
  setFeedType(type): void
  setFilter(filter): void
  setSpeciesFilter(species): void
  toggleLike(postId): Promise<void>
  clearError(): void
}
```

### Create Post Store (`stores/createPostStore.ts`)

```typescript
interface CreatePostState {
  mediaUri: string | null
  mediaType: 'image' | 'video' | null
  aspectRatio: '1:1' | '4:5' | '9:16'
  croppedUri: string | null
  selectedPetId: string | null
  postType: 'good' | 'bad' | null
  selectedTags: string[]
  isUploading: boolean
  error: string | null

  // Actions: setters for each field + reset()
}
```

---

## Type System

### Database Types (`types/database.ts`)
Auto-generated from Supabase schema. Key types:
- `User`, `Pet`, `Post`, `Like`, `Follow`, `Media`
- Enums: `SpeciesType`, `MediaType`, `PostType`
- Helpers: `Tables<T>`, `InsertTables<T>`, `UpdateTables<T>`

### Model Types (`types/models.ts`)
App-level abstractions:
- `PostWithRelations` - Post with pet, user, media joined
- `FeedPost` - PostWithRelations + `isLikedByCurrentUser` + `isFollowedByCurrentUser`
- `FeedType`, `FeedFilter`, `FeedFilters`
- `Badge`, `BadgeType`, `UserBadges`
- `LeaderboardCategory`, `LeaderboardPeriod`, `LeaderboardEntry`
- `PremiumFeatures` - Tier definitions

### API Types (`types/api.ts`)
Request/response types:
- `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>`
- `PaginationParams` (cursor-based)
- Request/response pairs for all operations

### Navigation Types (`types/navigation.ts`)
- `RootStackParamList`, `AuthStackParamList`, `TabParamList`
- Screen-specific params
- Deep link support: `DeepLinkPath`, `DeepLinkParams`

---

## Backend (Supabase)

### Client Setup (`lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Database } from '@/types/database'

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)
```

### Key Tables
| Table | Purpose |
|-------|---------|
| `users` | User profiles, display names, badges, streaks |
| `pets` | Pet data (name, species, avatar_url) |
| `posts` | Feed posts (type, hot_score, like_count, pinned) |
| `media` | Media metadata (url, type, status, thumbnails) |
| `likes` | User-post like relationships |
| `follows` | User-pet follow relationships |
| `curated_tags` | System tags for categorization |
| `tag_suggestions` | User-submitted tag ideas |

### Data Flow Pattern
```
UI Component
    ↓ useStore hook
Zustand Store
    ↓ action call
Supabase Client (typed)
    ↓ query
PostgreSQL
    ↓ response
Store transforms to app types
    ↓ state update
UI re-renders
```

### Hot Ranking Algorithm
Posts are ranked using a hot score algorithm:
```
score = likes / (hours_since_post + 2)^1.5
```
- The `+2` prevents brand new posts from having infinite scores
- The `^1.5` exponent provides moderate time decay
- For personalized feeds, followed pets get a 1.5x boost

**Database Functions** (`supabase/migrations/003_hot_ranking.sql`):
- `calculate_hot_score(likes, created_at)` - Calculates base score
- `update_post_hot_score()` - Trigger function for auto-updates
- `recalculate_all_hot_scores()` - For cron job time decay
- `get_personalized_feed(...)` - RPC for personalized ranking with followed boost

**Feed Queries** (`stores/feedStore.ts`):
- Filters expired posts (`expires_at > now`)
- Species filter via pre-fetched pet IDs (Supabase limitation workaround)
- Cursor-based pagination using `hot_score` or `created_at`
- Batch fetches user's likes and follows for UI state

---

## Key Components

### PostCard (`components/feed/PostCard.tsx`)
Full-screen post card for the TikTok-style feed:
- Image/video display (expo-image, expo-video)
- Double-tap to like (300ms detection window)
- Single-tap state cycle: overlay visible → hidden (playing) → paused → repeat
- Animated emoji on like (Reanimated)
- Overlay: avatar, pet name, user, type pill, tags, champion crown, like button

### FeedFilters (`components/feed/FeedFilters.tsx`)
Floating filter UI:
- Feed type tabs: Hot / New / Following
- Filter chips: All / Good (😇) / Bad (😈)
- Species dropdown modal

### Feed Screen (`app/(tabs)/index.tsx`)
- FlatList with `pagingEnabled` + `disableIntervalMomentum`
- Dynamic height via `onLayout` for proper snapping
- `useIsFocused` to pause videos on tab switch
- Viewability tracking for current post

---

## Media Handling (`lib/media/`)

### Upload Service (`uploadService.ts`)
```typescript
uploadMedia(uri, type, onProgress?): Promise<{
  publicUrl: string
  path: string
}>
```
- Progress callback support
- Retry with exponential backoff (3 attempts)
- Cancellation support
- MIME type detection

### Processing
- `imageProcessing.ts` - Cropping, resizing
- `videoProcessing.ts` - Thumbnail generation, validation
- `validation.ts` - File type/size checks, 15s video limit

---

## Environment Variables

```env
# Required
EXPO_PUBLIC_SUPABASE_URL          # Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY     # Supabase anonymous key

# Optional (for future features)
EXPO_PUBLIC_MUX_ENV_KEY           # Mux video processing
EXPO_PUBLIC_REVENUECAT_API_KEY_*  # In-app purchases
EXPO_PUBLIC_ADMOB_APP_ID_*        # Monetization
EXPO_PUBLIC_POSTHOG_API_KEY       # Analytics
EXPO_PUBLIC_APP_ENV               # Environment identifier
```

---

## Design Patterns

### 1. Store-Driven Architecture
- All state in Zustand stores
- Components subscribe via hooks (`useAuthStore`, `useFeedStore`)
- Stores call Supabase directly (no separate API layer)

### 2. Cursor-Based Pagination
- Feed uses cursor (hot_score or created_at), not offset
- Enables infinite scroll without duplicates on data changes

### 3. Optimistic Updates
- `toggleLike` updates UI immediately, rolls back on error

### 4. Conditional Navigation
- Auth state drives route tree (no manual checks in screens)
- `router.replace()` for auth transitions (prevents back to login)

### 5. Type Safety
- Supabase client typed with generated `Database` type
- App types extend/compose DB types
- Strict TypeScript mode enabled

---

## Scripts

```bash
npm start              # Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier format
npm run typecheck      # TypeScript check
npm run db:types       # Regenerate Supabase types
```

---

## Species System

Defined in `lib/constants/species.ts`:

```typescript
export const SPECIES_OPTIONS: { value: SpeciesType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐈' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { value: 'hamster', label: 'Hamster', emoji: '🐹' },
  { value: 'guinea_pig', label: 'Guinea Pig', emoji: '🐹' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'reptile', label: 'Reptile', emoji: '🦎' },
  { value: 'amphibian', label: 'Amphibian', emoji: '🐸' },
  { value: 'horse', label: 'Horse', emoji: '🐴' },
  { value: 'farm', label: 'Farm Animal', emoji: '🐄' },
  { value: 'exotic', label: 'Exotic', emoji: '🦜' },
  { value: 'other', label: 'Other', emoji: '🐾' },
];

export function getSpeciesEmoji(species: SpeciesType | string): string
```

---

## Permissions

### iOS (Info.plist via app.json)
- `NSCameraUsageDescription` - Photo/video capture
- `NSMicrophoneUsageDescription` - Video audio
- `NSPhotoLibraryUsageDescription` - Gallery access
- `NSPhotoLibraryAddUsageDescription` - Save media

### Android (AndroidManifest via app.json)
- `CAMERA`
- `RECORD_AUDIO`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`

---

## Future Features (Defined in Types)

- **Premium Tiers**: Extra pin slots, no ads, priority support
- **Badges**: Various achievement badges with unlock conditions
- **Leaderboards**: Daily, weekly, monthly, all-time rankings
- **OAuth**: Google, Apple sign-in (types defined, not implemented)
- **Push Notifications**: Follow, like, champion notifications

---

*Last updated: January 2026*
