# Ticket 005: Authentication Flow

## Summary
Implement sign up and login flows with Email authentication. Social OAuth (Apple/Google) will be added later in Ticket 045.

## Acceptance Criteria

### UI Screens
- [x] Welcome/Splash screen with app branding
- [x] Auth screen with options:
  - [x] "Continue with Email" option
  - *(Social auth buttons will be added in Ticket 045)*
- [x] Email sign up form (email, password, confirm password)
- [x] Email login form (email, password)
- [x] Forgot password flow

### Functionality
- [x] Email/password authentication via Supabase Auth
- [x] Session persistence (stay logged in)
- [x] Automatic session refresh
- [x] Logout functionality
- [x] Error handling with user-friendly messages

### Auth State Management
- [x] Create auth store (Zustand) with:
  - `user` - current user or null
  - `session` - current session
  - `isLoading` - auth state loading
  - `signInWithEmail(email, password)`
  - `signUpWithEmail(email, password)`
  - `signOut()`
  - `resetPassword(email)`

### Auto-create User Profile
- [x] On first sign-in, create user record in `users` table
- [x] Set default display name from auth provider or email

## Technical Notes
- Store session securely using AsyncStorage (via Supabase client)
- Social auth (Apple/Google) deferred to Ticket 045 when app store setup is complete

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 003: Database Schema

## Estimated Scope
Large

## Completion Notes
- `stores/authStore.ts` - Zustand auth store with full state management
- `app/(auth)/_layout.tsx` - Auth route group layout
- `app/(auth)/welcome.tsx` - Welcome screen with branding and auth options
- `app/(auth)/login.tsx` - Login form with validation and error handling
- `app/(auth)/signup.tsx` - Sign up form with password confirmation
- `app/(auth)/forgot-password.tsx` - Password reset flow with success state
- `app/_layout.tsx` - Updated with auth state routing logic
- User profile auto-creation handled by database trigger (from Ticket 003)
- Friendly error messages for common auth errors
