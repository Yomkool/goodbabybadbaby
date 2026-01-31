# Ticket 006: Auth Guards & Protected Routing

## Summary
Implement authentication guards to protect routes and redirect unauthenticated users.

## Acceptance Criteria

- [x] Create auth context/provider that wraps the app
- [x] Implement route protection:
  - [x] Unauthenticated users see only auth screens
  - [x] Authenticated users without pets see onboarding
  - [x] Authenticated users with pets see main app
- [x] Create loading screen while checking auth state
- [x] Handle auth state changes (login/logout) with proper navigation
- [x] Implement Expo Router layout groups:
  ```
  /app
    /(auth)        # Public auth routes
      /welcome
      /login
      /signup
    /(onboarding)  # Post-auth, pre-pet routes
      /add-pet
    /(tabs)        # Main authenticated app
      /feed
      /leaderboard
      /post
      /search
      /profile
  ```

## Technical Notes
- Use Expo Router's `_layout.tsx` for auth checks
- Consider using `Redirect` component for declarative redirects
- Handle edge cases (token expiry mid-session)

## Dependencies
- Ticket 005: Authentication Flow

## Estimated Scope
Medium

## Completion Notes
- Updated `stores/authStore.ts` - Added pets tracking, hasPets flag, refreshPets(), addPet()
- `app/(onboarding)/_layout.tsx` - Onboarding route group layout
- `app/(onboarding)/add-pet.tsx` - Add first pet screen with species selection
- `components/LoadingScreen.tsx` - Branded loading/splash screen
- `app/_layout.tsx` - Updated with 3-state routing logic:
  - Unauthenticated → `/(auth)/welcome`
  - Authenticated without pets → `/(onboarding)/add-pet`
  - Authenticated with pets → `/(tabs)`
- `app/(tabs)/index.tsx` - Updated to show user and pet info
