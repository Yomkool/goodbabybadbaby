# Ticket 005: Authentication Flow

## Summary
Implement sign up and login flows with Apple, Google, and Email authentication.

## Acceptance Criteria

### UI Screens
- [ ] Welcome/Splash screen with app branding
- [ ] Auth screen with options:
  - [ ] "Continue with Apple" button
  - [ ] "Continue with Google" button
  - [ ] "Continue with Email" option
- [ ] Email sign up form (email, password, confirm password)
- [ ] Email login form (email, password)
- [ ] Forgot password flow

### Functionality
- [ ] Apple Sign-In integration using Expo AuthSession
- [ ] Google Sign-In integration using Expo AuthSession
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
  - `signInWithApple()`
  - `signInWithGoogle()`
  - `signInWithEmail(email, password)`
  - `signUpWithEmail(email, password)`
  - `signOut()`
  - `resetPassword(email)`

### Auto-create User Profile
- [ ] On first sign-in, create user record in `users` table
- [ ] Set default display name from auth provider or email

## Technical Notes
- Use `expo-auth-session` and `expo-apple-authentication`
- Handle deep linking for OAuth callbacks
- Store session securely using Expo SecureStore

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 003: Database Schema

## Estimated Scope
Large
