# Ticket 045: Social OAuth Setup (Apple & Google Sign-In)

## Summary
Add Apple and Google Sign-In options to the authentication flow. This requires app store setup (bundle IDs, keystores, Apple Developer account) to be complete.

## Acceptance Criteria

### Supabase Configuration
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Configure Apple OAuth in Supabase dashboard

### Google OAuth Setup
- [ ] Create Google Cloud project (if not exists)
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 Client IDs:
  - [ ] Web application (for Supabase)
  - [ ] Android (requires SHA-1 from release keystore)
  - [ ] iOS (requires bundle ID)
- [ ] Add client credentials to Supabase

### Apple Sign-In Setup
- [ ] Apple Developer account required ($99/year)
- [ ] Register App ID with Sign In with Apple capability
- [ ] Create Services ID for web authentication
- [ ] Generate and configure private key
- [ ] Add credentials to Supabase

### App Integration
- [ ] Install `expo-auth-session` and `expo-apple-authentication`
- [ ] Add "Continue with Apple" button to auth screen
- [ ] Add "Continue with Google" button to auth screen
- [ ] Implement `signInWithApple()` in auth store
- [ ] Implement `signInWithGoogle()` in auth store
- [ ] Handle OAuth deep link callbacks
- [ ] Test on physical iOS device (Apple Sign-In requirement)

## Technical Notes
- Apple Sign-In is required for App Store if any social login is offered
- Google OAuth requires different client IDs per platform
- Must have EAS Build configured with proper credentials before this ticket
- Test thoroughly on both iOS and Android physical devices

## Prerequisites
- App store accounts set up (Apple Developer, Google Play Console)
- EAS Build configured with bundle IDs and keystores
- Ticket 005 complete (email auth working)

## Dependencies
- Ticket 005: Authentication Flow (email auth)

## Estimated Scope
Medium

## Notes
This ticket was split from Tickets 002 and 005 to allow development to proceed with email authentication while app store setup is pending.
