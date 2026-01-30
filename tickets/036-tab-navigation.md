# Ticket 036: Tab Navigation Setup

## Summary
Implement the main tab bar navigation structure.

## Acceptance Criteria

### Tab Bar Configuration
- [ ] 5 tabs in order:
  1. Feed (Home) - house icon
  2. Leaderboard - crown/trophy icon
  3. Post (+) - plus/camera icon (center, highlighted)
  4. Search/Explore - search/magnifying glass icon
  5. Profile - person icon

### Tab Bar Styling
- [ ] Custom tab bar design
- [ ] Active/inactive state colors
- [ ] Center "Post" button elevated/highlighted
- [ ] Safe area handling (notch, home indicator)

### Navigation Behavior
- [ ] Tap active tab scrolls to top (feed, search)
- [ ] Double-tap refreshes content
- [ ] Post tab opens post flow (modal or push)
- [ ] Badge indicators (optional: notification dot)

### Deep Link Integration
- [ ] Tabs accessible via deep links
- [ ] Preserve navigation state

## Technical Notes
- Use Expo Router's tab layout
- Custom tab bar component for styling flexibility
- Handle keyboard visibility (hide tab bar on input focus)

## Dependencies
- Ticket 001: Project Setup
- Ticket 006: Auth Guards

## Estimated Scope
Medium
