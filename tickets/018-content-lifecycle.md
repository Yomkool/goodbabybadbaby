# Ticket 018: Content Lifecycle - Expiration & Pinning

## Summary
Implement the 72-hour post expiration system and user pinning functionality.

## Acceptance Criteria

### Expiration Display
- [ ] Show time remaining on posts (e.g., "23h left", "Expires soon")
- [ ] Visual indicator for posts expiring within 6 hours
- [ ] Posts disappear from feed when expired

### Client-Side Handling
- [ ] Filter out expired posts (expires_at < now)
- [ ] Remove expired posts from local state
- [ ] Handle viewing an expired post via deep link

### Pinning System
- [ ] Pin action on user's own posts
- [ ] Maximum 9 pins (default), more for premium
- [ ] Pin count indicator on profile
- [ ] Pinned posts never expire
- [ ] Unpin functionality

### Pin UI
- [ ] "Pin to Profile" option on own posts
- [ ] Pin icon/badge on pinned posts
- [ ] Manage pins from profile (reorder, remove)

### Database Updates
- [ ] Set `is_pinned = true` when pinned
- [ ] Pinned posts excluded from expiration
- [ ] Track pin slots used vs available

## Technical Notes
- Actual deletion happens via backend cron (Ticket 031)
- Client just filters/hides expired posts
- Consider allowing re-pinning expired posts briefly (grace period)?

## Dependencies
- Ticket 003: Database Schema
- Ticket 009: Feed Data

## Estimated Scope
Medium
