# Ticket 008: Feed UI - Vertical Swipe Cards

## Summary
Build the main feed with TikTok-style full-screen vertical swipe cards.

## Acceptance Criteria

### Layout
- [ ] Full-screen card layout (edge-to-edge)
- [ ] Vertical swipe navigation between posts
- [ ] Smooth swipe animations
- [ ] Pull-to-refresh functionality
- [ ] Infinite scroll with pagination

### Post Card Display
- [ ] Full-bleed image/video display
- [ ] Proper aspect ratio handling (1:1, 4:5, 9:16)
- [ ] Loading placeholder/skeleton
- [ ] Error state for failed media loads

### Filter Controls
- [ ] Top bar with filter toggles:
  - [ ] All / Good Babies / Bad Babies
  - [ ] Optional: Species filter dropdown
- [ ] Following tab/toggle
- [ ] Filters persist during session

### Performance
- [ ] Only render visible cards + 1 above/below
- [ ] Preload adjacent media
- [ ] Memory management for off-screen content

## Technical Notes
- Consider using `react-native-pager-view` or FlatList with `pagingEnabled`
- Use `expo-image` for optimized image loading
- Implement virtualization for large feeds

## Dependencies
- Ticket 003: Database Schema
- Ticket 004: TypeScript Types

## Estimated Scope
Large
