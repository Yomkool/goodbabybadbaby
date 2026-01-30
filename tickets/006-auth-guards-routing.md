# Ticket 006: Auth Guards & Protected Routing

## Summary
Implement authentication guards to protect routes and redirect unauthenticated users.

## Acceptance Criteria

- [ ] Create auth context/provider that wraps the app
- [ ] Implement route protection:
  - [ ] Unauthenticated users see only auth screens
  - [ ] Authenticated users without pets see onboarding
  - [ ] Authenticated users with pets see main app
- [ ] Create loading screen while checking auth state
- [ ] Handle auth state changes (login/logout) with proper navigation
- [ ] Implement Expo Router layout groups:
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
