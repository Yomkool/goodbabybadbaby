# Ticket 050: Post Management (View/Edit/Delete)

## Summary
Allow users to view their active posts and manage them (edit tags, delete).

## Motivation
- Users need to see what they've posted
- Users should be able to remove posts they regret
- Users may want to edit tags after posting
- Basic content ownership/control

## Acceptance Criteria

### View Own Posts
- [ ] Section in User Profile showing active posts
- [ ] Show post thumbnail, pet, type (good/bad), likes, time remaining
- [ ] Sort by most recent
- [ ] Filter by pet (if user has multiple)
- [ ] Show expired vs active posts

### Delete Post
- [ ] Delete button on own posts
- [ ] Confirmation dialog before delete
- [ ] Also deletes associated media record
- [ ] Updates like counts on user/pet

### Edit Post
- [ ] Edit tags on existing post
- [ ] Cannot change: media, pet, good/bad type (too complex)
- [ ] Clear feedback on successful edit

### UI/UX
- [ ] Accessible from profile screen
- [ ] Quick actions (swipe to delete, or long-press menu)
- [ ] Loading states during operations

## Technical Notes
- RLS policies already allow users to delete/update own posts
- Need to handle cascading media delete
- Consider soft delete vs hard delete for moderation purposes

## Dependencies
- Ticket 019: User Profile Screen
- Ticket 043: Post Detail Modal/Screen

## Phase
Phase 3 (Social Features) - ties into User Profile

## Priority
Medium - Important for user control, but not blocking MVP

## Estimated Scope
Medium
