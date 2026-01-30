# Ticket 025: Badges System

## Summary
Implement the badge earning system with all badge types and display.

## Acceptance Criteria

### Badge Definitions
Create badge configuration for all types:

**Champion Badges (collectible, with count):**
- [ ] 👑 Good Baby Champion [×N]
- [ ] 😈 Bad Baby Champion [×N]

**Streak & Consistency:**
- [ ] 🔥 On a Roll [N days] - posted N consecutive days
- [ ] 📜 Dedicated - posted 50 times
- [ ] 📜 Committed - posted 100 times
- [ ] 📜 Chronicler - posted 500 times

**Arc Badges:**
- [ ] ⚡ Redemption Arc - pet won Bad then Good crown
- [ ] 🦹 Fall from Grace - pet won Good then Bad crown
- [ ] ✨ Contains Multitudes - pet won both (any order)

**Engagement Milestones:**
- [ ] 💕 Beloved - 100 total likes
- [ ] 💎 Treasured - 1,000 total likes
- [ ] 🏰 Legendary - 10,000 total likes

**Multi-pet Collection:**
- [ ] 🐾 Growing Family - 3 pets
- [ ] 🐾 Full House - 5 pets
- [ ] 🐾 Menagerie - 10 pets
- [ ] 👯 Sibling Rivalry - two pets held crowns same day

**Account Milestones:**
- [ ] 📅 Newcomer - account 1 month old
- [ ] 📅 Regular - account 6 months old
- [ ] 📅 Veteran - account 1 year old

**Rare Achievements:**
- [ ] 🌟 Instant Royalty - won crown on first post
- [ ] 🎊 Lucky Day - won on special date
- [ ] 🏆 Triple Crown - won 3 times
- [ ] 🏆 Dynasty - won 10 times
- [ ] 🏆 Reign Supreme - won 25 times

### Badge Award Logic
- [ ] Trigger badge checks on relevant events:
  - Post creation → streak, post count badges
  - Crown won → champion, arc, rare badges
  - Like received → engagement badges
  - Pet added → collection badges
  - Account age → milestone badges
- [ ] Store earned badges in user record (jsonb array)
- [ ] Handle badge counts (champion ×N)

### Badge Display
- [ ] Badge collection on profile
- [ ] Badge detail on tap (name, description, requirements)
- [ ] New badge earned notification/celebration

## Technical Notes
- Consider Supabase Edge Function for badge logic
- Or compute badges on relevant events client-side
- Badge history should track when earned

## Dependencies
- Ticket 003: Database Schema
- Ticket 019: User Profile

## Estimated Scope
Large
