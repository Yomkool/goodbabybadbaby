# Ticket 052: Auto-Set Pet Avatar from First Upload

## Summary
Automatically set a pet's avatar using a thumbnail from their first media upload if they don't already have one set.

## Problem
Users may skip setting an avatar during pet creation, leaving their pet with no profile picture. When they upload their first photo/video of that pet, we can use that media to create a default avatar.

## Proposed Solution
When a post is created:
1. Check if the post's associated pet has an avatar set
2. If not, generate a thumbnail from the uploaded media:
   - For images: use the cropped image (scaled down appropriately)
   - For videos: use the generated thumbnail
3. Upload the thumbnail as the pet's avatar
4. Update the pet record with the new avatar URL

## Acceptance Criteria
- [ ] Detect when a pet has no avatar during post creation
- [ ] Generate appropriate avatar from uploaded media
- [ ] Upload avatar to `avatars` storage bucket
- [ ] Update pet record with avatar URL
- [ ] Only auto-set on first post per pet (don't overwrite existing avatars)
- [ ] Handle both image and video posts
- [ ] Show success feedback to user (optional toast/notification)

## Technical Considerations

### Avatar Generation
- Resize to square aspect ratio (e.g., 256x256 or 512x512)
- Use `expo-image-manipulator` for images
- Use video thumbnail for videos
- Compress appropriately for storage

### Database Updates
- Update pet record in same transaction as post creation if possible
- Or update immediately after successful post creation

### Edge Cases
- User uploads multiple posts quickly - only first should trigger
- Network failure during avatar upload - don't block post creation
- Pet already has avatar - skip entirely

## Dependencies
- Ticket 009: Media Upload & Processing (completed)

## Priority
Low - Nice-to-have UX improvement

## Phase
Phase 11 (Polish)

## Estimated Scope
Small
