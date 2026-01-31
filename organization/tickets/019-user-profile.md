# Ticket 019: User Profile Screen

## Summary
Build the user profile screen with pinned posts, liked posts, pets, and stats.

## Acceptance Criteria

### Profile Header
- [ ] Display name
- [ ] Avatar (optional pet photo)
- [ ] Edit profile button (own profile only)
- [ ] Stats summary: total lifetime likes received

### Tab Navigation
- [ ] **Pinned** (default) - 3×3 grid of pinned posts
- [ ] **Liked** - grid of posts user has liked (active posts only)
- [ ] **Pets** - grid of user's pets

### Pinned Grid
- [ ] 3×3 grid layout (9 slots)
- [ ] Empty slots shown as placeholders
- [ ] Tap to view post detail
- [ ] Edit mode to rearrange/remove pins (own profile)

### Liked Grid
- [ ] Grid of posts user has liked
- [ ] Only shows still-active (non-expired) posts
- [ ] Tap to view post
- [ ] Empty state: "No liked posts yet"

### Pets Grid
- [ ] Grid of user's pets with avatars and names
- [ ] Tap to view pet detail
- [ ] "Add Pet" card at end (own profile)

### Winner Shelf
- [ ] Separate section showing all winning posts
- [ ] Winner badge displayed
- [ ] Permanent (doesn't count toward 9 pins)

### Badges Display
- [ ] Collection of earned badges
- [ ] Tap badge to see details/requirements

### Edit Profile (Own Profile)
- [ ] Edit display name
- [ ] Change avatar
- [ ] Settings link

## Technical Notes
- Distinguish between viewing own profile vs others
- Lazy load tabs to improve performance
- Cache profile data

## Dependencies
- Ticket 003: Database Schema
- Ticket 018: Content Lifecycle (pinning)

## Estimated Scope
Large
