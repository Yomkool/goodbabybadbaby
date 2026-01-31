# Ticket 041: Streak Tracking System

## Summary
Implement daily posting streak tracking with reminders.

## Acceptance Criteria

### Streak Logic
- [ ] Track consecutive days with at least one post
- [ ] Reset streak if day missed
- [ ] Store `streak` count and `last_post_date` on user

### Streak Update
- [ ] On post creation, check last_post_date
- [ ] If same day: no change
- [ ] If yesterday: increment streak
- [ ] If older: reset streak to 1

### Streak Display
- [ ] Show streak on profile (🔥 7-day streak)
- [ ] Streak badge animation on increment
- [ ] Milestone celebrations (7, 30, 100 days)

### Streak Reminders
- [ ] Check for at-risk streaks (end of day, no post)
- [ ] Send push notification: "🔥 Post today to keep your 7-day streak alive!"
- [ ] Opt-in in notification settings

### Badge Integration
- [ ] Award "On a Roll" badge for streak milestones
- [ ] Badge shows current streak count

### Edge Cases
- [ ] Timezone handling (user's local midnight)
- [ ] Grace period consideration (optional)
- [ ] Streak recovery option (premium feature? optional)

## Technical Notes
- Consider storing timezone preference
- Cron job for end-of-day streak warnings
- Handle clock manipulation attempts

## Dependencies
- Ticket 003: Database Schema
- Ticket 025: Badges System
- Ticket 028: Push Notifications

## Estimated Scope
Medium
