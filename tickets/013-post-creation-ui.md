# Ticket 013: Post Creation UI

## Summary
Build the post creation flow UI including media selection, pet selection, and tagging.

## Acceptance Criteria

### Upload Flow Screens
1. **Media Selection**
   - [ ] Camera capture option
   - [ ] Gallery picker option
   - [ ] Support images and videos
   - [ ] Video length limit: 15 seconds

2. **Media Editor**
   - [ ] Crop/adjust with aspect ratio options (1:1, 4:5, 9:16)
   - [ ] Video trimming if over 15 seconds
   - [ ] Preview of final result

3. **Pet Selection**
   - [ ] List of user's pets with avatars
   - [ ] "Add new pet" option (inline form or modal)
   - [ ] Required selection

4. **Good/Bad Toggle**
   - [ ] Visual toggle: Good Baby ☀️ / Bad Baby 😈
   - [ ] Clear selected state indication
   - [ ] Required selection

5. **Tag Selection**
   - [ ] Searchable curated tag list
   - [ ] Tag chips for selected tags
   - [ ] Max 5 tags indicator
   - [ ] "Suggest a tag" option (links to Ticket 024)
   - [ ] Optional (can post without tags)

6. **Confirmation**
   - [ ] Preview of post
   - [ ] "Post" button
   - [ ] Loading state during upload
   - [ ] Success/error feedback

### Navigation
- [ ] Back navigation with "discard" confirmation
- [ ] Clear flow between steps

## Technical Notes
- Use `expo-image-picker` for media selection
- Use `expo-image-manipulator` for cropping
- Consider step indicator for multi-step flow

## Dependencies
- Ticket 007: Onboarding (shares pet creation logic)

## Estimated Scope
Large
