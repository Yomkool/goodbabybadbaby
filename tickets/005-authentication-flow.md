# Ticket 005: Authentication Flow

## Summary
Implement sign up and login flows with Email authentication. Social OAuth (Apple/Google) will be added later in Ticket 045.

## Acceptance Criteria

### UI Screens
- [ ] Welcome/Splash screen with app branding
- [ ] Auth screen with options:
  - [ ] "Continue with Email" option
  - [ ] *(Social auth buttons will be added in Ticket 045)*
- [ ] Email sign up form (email, password, confirm password)
- [ ] Email login form (email, password)
- [ ] Forgot password flow

### Functionality
- [ ] Email/password authentication via Supabase Auth
- [ ] Session persistence (stay logged in)
- [ ] Automatic session refresh
- [ ] Logout functionality
- [ ] Error handling with user-friendly messages

### Auth State Management
- [ ] Create auth store (Zustand) with:
  - `user` - current user or null
  - `session` - current session
  - `isLoading` - auth state loading
  - `signInWithEmail(email, password)`
  - `signUpWithEmail(email, password)`
  - `signOut()`
  - `resetPassword(email)`

### Auto-create User Profile
- [ ] On first sign-in, create user record in `users` table
- [ ] Set default display name from auth provider or email

## Technical Notes
- Store session securely using AsyncStorage (via Supabase client)
- Social auth (Apple/Google) deferred to Ticket 045 when app store setup is complete

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 003: Database Schema

## Estimated Scope
Large
