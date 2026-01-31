# Ticket 013: Like Functionality

## Summary
Implement the like system with double-tap and button interactions, using Good Baby 😇 / Bad Baby 😈 emoji differentiation.

## Acceptance Criteria

### Like Actions
- [x] Double-tap anywhere on post to like
- [x] Tap like button to like/unlike
- [x] Works in both overlay visible and hidden states
- [x] Optimistic UI update (instant feedback)
- [x] Sync with server in background

### Visual Feedback
- [x] Like button shows appropriate emoji (😇 or 😈) based on post type
- [x] Double-tap shows animated emoji burst
- [x] Like count updates immediately

### Data Layer
- [x] Create like in `likes` table
- [x] Increment `like_count` on post
- [x] Increment `total_likes_received` on user and pet (via RPC functions)
- [x] Handle race conditions (duplicate likes via upsert)

### Unlike
- [x] Tap like button to unlike
- [x] Remove like from `likes` table
- [x] Decrement post like_count

### Edge Cases
- [x] Can like your own posts (decided: yes, allowed)
- [x] Handle network failures with optimistic rollback
- [x] Prevent rapid like/unlike spam (500ms debounce)

## Technical Notes
- Uses Supabase upsert for atomic like creation
- Optimistic updates with rollback on error
- 300ms double-tap detection window
- 500ms debounce prevents rapid like/unlike spam
- RPC functions for atomic counter updates (see `20250131_005_like_counter_rpcs.sql`)

## Dependencies
- Ticket 003: Database Schema ✅
- Ticket 010: Feed UI ✅

## Estimated Scope
Complete ✅
