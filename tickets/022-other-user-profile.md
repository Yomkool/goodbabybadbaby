# Ticket 022: View Other User's Profile

## Summary
Enable viewing other users' profiles in a read-only public view.

## Acceptance Criteria

### Access Points
- [ ] Tap on post owner's name/avatar
- [ ] Deep link to user profile

### Public View Contents
- [ ] Display name and avatar
- [ ] Pinned posts grid (read-only)
- [ ] Pets list (tappable to view pet profiles)
- [ ] Badges earned
- [ ] Winner shelf

### Restrictions (vs own profile)
- [ ] No edit functionality
- [ ] No liked posts tab (private)
- [ ] No follower counts shown
- [ ] No settings access

### Navigation
- [ ] Back button to return
- [ ] Tap pet to view pet profile
- [ ] Tap pinned post to view post

## Technical Notes
- Reuse profile components with "isOwnProfile" flag
- RLS policies should allow reading public profile data

## Dependencies
- Ticket 019: User Profile

## Estimated Scope
Small
