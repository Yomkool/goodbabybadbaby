# Ticket 013: Like Functionality

## Summary
Implement the paw-print like system with double-tap and button interactions.

## Acceptance Criteria

### Like Actions
- [ ] Double-tap anywhere on post to like
- [ ] Tap paw print button to like/unlike
- [ ] Works in both overlay visible and hidden states
- [ ] Optimistic UI update (instant feedback)
- [ ] Sync with server in background

### Visual Feedback
- [ ] Paw print button fills when liked
- [ ] Double-tap shows animated paw/heart burst
- [ ] Like count updates immediately

### Data Layer
- [ ] Create like in `likes` table
- [ ] Increment `like_count` on post
- [ ] Increment `total_likes_received` on user and pet
- [ ] Handle race conditions (duplicate likes)

### Unlike
- [ ] Tap filled paw print to unlike
- [ ] Remove like from `likes` table
- [ ] Decrement counters

### Edge Cases
- [ ] Can't like your own posts (or can you? - clarify)
- [ ] Handle network failures with retry
- [ ] Prevent rapid like/unlike spam

## Technical Notes
- Use database transaction for atomic counter updates
- Consider Supabase RPC for like operation
- Debounce rapid taps

## Dependencies
- Ticket 003: Database Schema
- Ticket 012: Post Overlay UI

## Estimated Scope
Medium
