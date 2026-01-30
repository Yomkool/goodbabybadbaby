# Ticket 002: Supabase Backend Setup

## Summary
Set up Supabase project with database schema, authentication providers, and storage buckets.

## Acceptance Criteria
- [ ] Create Supabase project
- [ ] Configure authentication providers:
  - [ ] Apple Sign-In
  - [ ] Google Sign-In
  - [ ] Email/Password
- [ ] Create storage buckets:
  - [ ] `avatars` - for user/pet avatars
  - [ ] `posts` - for post media (images/videos)
- [ ] Configure storage policies (authenticated users can upload, public read)
- [ ] Install Supabase client in React Native app
- [ ] Create typed client with environment variables
- [ ] Set up Row Level Security (RLS) policies foundation

## Technical Notes
- Use `@supabase/supabase-js` v2
- Store Supabase URL and anon key in environment variables
- Consider enabling Supabase Realtime for future live features

## Dependencies
- Ticket 001: Project Setup

## Estimated Scope
Medium
