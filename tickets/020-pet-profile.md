# Ticket 020: Pet Profile Screen

## Summary
Build the pet detail/profile screen with follow functionality and pet-specific content.

## Acceptance Criteria

### Pet Header
- [ ] Pet name
- [ ] Species badge
- [ ] Pet avatar
- [ ] Follow/Unfollow button
- [ ] Owner name (tappable to view their profile)

### Stats Display
- [ ] Total likes received
- [ ] Crown count (Good Baby + Bad Baby)
- [ ] "👑 × N" indicators

### Recent Posts
- [ ] Grid of active posts from this pet
- [ ] Sorted by recency
- [ ] Tap to view post
- [ ] Empty state if no active posts

### Pet Pin Grid (Premium Feature)
- [ ] 3×3 grid (9 slots) for pet's pinned posts
- [ ] Only available if owner has premium
- [ ] Owner can manage pins

### Edit Pet (Owner Only)
- [ ] Edit pet name
- [ ] Change avatar
- [ ] Change species
- [ ] Delete pet option (with confirmation)

## Technical Notes
- Follow button state updates optimistically
- Consider showing "This pet's posts have expired" if no active posts

## Dependencies
- Ticket 003: Database Schema
- Ticket 021: Follow System

## Estimated Scope
Medium
