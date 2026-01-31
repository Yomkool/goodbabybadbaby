# Ticket 043: Post Detail Modal/Screen

## Summary
Create the post detail view for when posts are opened from grids, profiles, or deep links.

## Acceptance Criteria

### Access Points
- [ ] Tap post in profile pinned grid
- [ ] Tap post in liked grid
- [ ] Tap post in leaderboard
- [ ] Tap post in search results
- [ ] Open via deep link

### Display
- [ ] Full post image/video
- [ ] Good/Bad Baby badge
- [ ] Pet name (tappable)
- [ ] Tags (tappable)
- [ ] Like count
- [ ] Time posted / time remaining
- [ ] Winner badge (if applicable)
- [ ] Crown indicator (if current champion)

### Interactions
- [ ] Like/unlike functionality
- [ ] Share button
- [ ] Report (long-press)
- [ ] Video playback (if video)

### Owner-Only Actions
- [ ] Pin/unpin option
- [ ] Delete post (with confirmation)

### Navigation
- [ ] Close/back button
- [ ] Swipe down to dismiss (optional)
- [ ] Navigate to pet profile

### Deep Link Handling
- [ ] Show post if still active
- [ ] Show "Post expired" if expired (unless pinned/winner)
- [ ] Show "Post not found" if deleted

## Technical Notes
- Can be modal or full-screen
- Reuse post card components
- Handle video lifecycle on mount/unmount

## Dependencies
- Ticket 011: Post Overlay UI
- Ticket 029: Deep Links

## Estimated Scope
Medium
