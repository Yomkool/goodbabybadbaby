# Ticket 007: Onboarding - Add First Pet

## Summary
Create the onboarding flow for new users to add their first pet before accessing the main app.

## Acceptance Criteria

### UI Screen
- [x] Welcome message explaining the app concept
- [x] Pet name input field
- [x] Species selector (visual grid or dropdown):
  - dog, cat, bird, rabbit, hamster, guinea_pig, fish, reptile, amphibian, horse, farm, exotic, other
- [x] Optional pet avatar upload
- [x] "Add Pet" button
- [x] Skip option (but gently discourage - "You'll need a pet to post!")

### Functionality
- [x] Validate pet name (required, 1-30 characters)
- [x] Save pet to database with user_id
- [x] Upload avatar to storage if provided
- [x] Navigate to main feed after completion
- [x] Handle errors gracefully

### Edge Cases
- [x] User closes app mid-onboarding
- [x] Network failure during save
- [x] Invalid image format for avatar

## Technical Notes
- Use `expo-image-picker` for avatar selection
- Compress images before upload
- Consider showing species-specific placeholder avatars

## Dependencies
- Ticket 005: Authentication Flow
- Ticket 006: Auth Guards

## Estimated Scope
Medium

## Completion Notes
- Installed `expo-image-picker`, `expo-image-manipulator`, and `expo-file-system`
- Updated `app/(onboarding)/add-pet.tsx` with full features:
  - Avatar upload via camera or photo library
  - Image compression/resize to 400x400 @ 70% quality
  - Name validation (1-30 characters with live counter)
  - Species grid with emoji placeholders
  - Skip option with confirmation dialog
  - Network error handling
  - Invalid image format validation
  - Uses `expo-file-system` File class for proper React Native file upload (fetch/blob doesn't work for local URIs)
- Updated `stores/authStore.ts`:
  - Added `hasCompletedOnboarding` flag
  - Added `skipOnboarding()` action
  - Onboarding state persists via pet check on login
- Avatar uploads go to Supabase Storage `avatars/pet-avatars/` bucket
