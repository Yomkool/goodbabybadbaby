# Ticket 017: Share Functionality

## Summary
Implement sharing posts via share cards, links, and native share sheet.

## Acceptance Criteria

### Share Options Menu
- [ ] "Save Image" - saves branded share card to camera roll
- [ ] "Copy Link" - copies deep link to clipboard
- [ ] "Share..." - opens native share sheet

### Share Card Generation
- [ ] Generate branded image containing:
  - [ ] Pet photo (original post media)
  - [ ] Good Baby ☀️ or Bad Baby 😈 badge
  - [ ] Pet name
  - [ ] Tags (if any)
  - [ ] App logo and URL at bottom
- [ ] Support two formats:
  - [ ] 9:16 (Instagram Stories optimized)
  - [ ] 1:1 (general sharing)
- [ ] Save to camera roll with permission

### Deep Links
- [ ] Generate links in format: `https://goodbadbaby.app/p/{postId}`
- [ ] Copy to clipboard with feedback ("Link copied!")

### Native Share
- [ ] Open system share sheet with:
  - [ ] Share card image
  - [ ] Deep link
  - [ ] Default share text

## Technical Notes
- Use `expo-sharing` for native share sheet
- Use `react-native-view-shot` or similar for share card generation
- Use `expo-media-library` for saving to camera roll
- Use `expo-clipboard` for copy functionality

## Dependencies
- Ticket 011: Post Overlay UI
- Ticket 029: Deep Link Handling (for link format)

## Estimated Scope
Medium
