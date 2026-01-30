# Ticket 007: Onboarding - Add First Pet

## Summary
Create the onboarding flow for new users to add their first pet before accessing the main app.

## Acceptance Criteria

### UI Screen
- [ ] Welcome message explaining the app concept
- [ ] Pet name input field
- [ ] Species selector (visual grid or dropdown):
  - dog, cat, bird, rabbit, hamster, guinea_pig, fish, reptile, amphibian, horse, farm, exotic, other
- [ ] Optional pet avatar upload
- [ ] "Add Pet" button
- [ ] Skip option (but gently discourage - "You'll need a pet to post!")

### Functionality
- [ ] Validate pet name (required, 1-30 characters)
- [ ] Save pet to database with user_id
- [ ] Upload avatar to storage if provided
- [ ] Navigate to main feed after completion
- [ ] Handle errors gracefully

### Edge Cases
- [ ] User closes app mid-onboarding
- [ ] Network failure during save
- [ ] Invalid image format for avatar

## Technical Notes
- Use `expo-image-picker` for avatar selection
- Compress images before upload
- Consider showing species-specific placeholder avatars

## Dependencies
- Ticket 005: Authentication Flow
- Ticket 006: Auth Guards

## Estimated Scope
Medium
