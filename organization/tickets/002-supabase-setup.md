# Ticket 002: Supabase Backend Setup

## Summary
Set up Supabase project with database schema, authentication providers, and storage buckets.

## Acceptance Criteria
- [x] Create Supabase project
- [x] Configure authentication providers:
  - [x] Email/Password (enabled by default)
  - [ ] *(Social OAuth deferred to Ticket 045)*
- [x] Create storage buckets:
  - [x] `avatars` - for user/pet avatars
  - [x] `posts` - for post media (images/videos)
- [x] Configure storage policies (authenticated users can upload, public read)
- [x] Install Supabase client in React Native app
- [x] Create typed client with environment variables
- [ ] Set up Row Level Security (RLS) policies foundation *(deferred to Ticket 003/042 - requires tables)*

## Technical Notes
- Use `@supabase/supabase-js` v2
- Store Supabase URL and anon key in environment variables
- Consider enabling Supabase Realtime for future live features

## Dependencies
- Ticket 001: Project Setup

## Estimated Scope
Medium
