# Ticket 029: Deep Links & Web Preview

## Summary
Implement deep linking for posts and pets, with web preview for non-app users.

## Acceptance Criteria

### Deep Link Structure
- [ ] Posts: `https://goodbadbaby.app/p/{postId}`
- [ ] Pets: `https://goodbadbaby.app/pet/{petId}`
- [ ] Users: `https://goodbadbaby.app/u/{userId}` (optional)

### App Behavior
When link tapped with app installed:
- [ ] Open app directly
- [ ] Navigate to correct screen (post, pet, user)
- [ ] Handle auth state (prompt login if needed)

### Web Preview Page
When link tapped without app:
- [ ] Show web preview page with:
  - Post image/thumbnail
  - Good/Bad Baby badge
  - Pet name
  - App download CTA buttons
- [ ] App Store / Play Store links
- [ ] Smart banner for easy app open

### Universal Links / App Links
- [ ] Configure iOS Universal Links
- [ ] Configure Android App Links
- [ ] Host `.well-known/apple-app-site-association`
- [ ] Host `.well-known/assetlinks.json`

### Expo Router Integration
- [ ] Handle deep links in app routing
- [ ] Preserve link params during navigation

### Edge Cases
- [ ] Expired post: show "This post has expired" with app CTA
- [ ] Deleted post: show "Post not found"
- [ ] Invalid link: redirect to app home

## Technical Notes
- Use Expo Router's built-in deep link handling
- Web preview can be simple static page or Next.js
- Consider OG meta tags for social sharing previews

## Dependencies
- Ticket 001: Project Setup
- Ticket 017: Share Functionality

## Estimated Scope
Medium
