# Ticket 021: Follow System

## Summary
Implement the pet-centric follow system where users follow pets (not other users).

## Acceptance Criteria

### Follow Actions
- [ ] Follow button on pet profile
- [ ] Unfollow option (same button, toggle state)
- [ ] Optimistic UI update
- [ ] Silent operation (no notification to pet owner)

### Follow State
- [ ] Store in `follows` table (user_id, pet_id)
- [ ] Track follower_count on pet (private, owner only sees)
- [ ] No public follower count display

### Following List
- [ ] User can view their following list in settings/profile
- [ ] List of pets they follow with avatars
- [ ] Tap to view pet profile
- [ ] Quick unfollow option

### Feed Integration
- [ ] Following toggle/tab in feed (Ticket 009)
- [ ] Followed pets get boost in main feed
- [ ] "Following" mode shows only followed pets' posts

### Data Store
- [ ] Create follows store with:
  - `followedPetIds` - Set of pet IDs user follows
  - `follow(petId)`
  - `unfollow(petId)`
  - `isFollowing(petId)`
  - `fetchFollowedPets()`

### Privacy
- [ ] Unfollow is silent
- [ ] Owner sees follower count in their own stats only
- [ ] No notification on follow/unfollow

## Technical Notes
- Unique constraint on (user_id, pet_id)
- Increment/decrement follower_count atomically
- Sync followed pets on app launch

## Dependencies
- Ticket 003: Database Schema
- Ticket 020: Pet Profile

## Estimated Scope
Medium
