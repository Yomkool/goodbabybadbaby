# Ticket 034: Leaderboard & Crown Cron Job

## Summary
Implement cron job to update leaderboard and handle crown transitions.

## Acceptance Criteria

### Leaderboard Calculation
- [ ] Run every 5 minutes
- [ ] Query top posts from last 24 hours by like_count
- [ ] Separate queries for Good Baby and Bad Baby
- [ ] Exclude expired posts

### Crown Transition Detection
- [ ] Compare current #1 with stored champion
- [ ] If different, trigger crown transfer

### Crown Transfer Actions
- [ ] Set `current_champion = false` on old champion
- [ ] Set `current_champion = true` on new champion
- [ ] Set `is_winner = true` on new champion
- [ ] Increment pet's crown count
- [ ] Create crown history log entry
- [ ] Trigger push notification

### Crown History Table
```sql
crown_history {
  id: uuid
  post_id: uuid
  pet_id: uuid
  type: enum (good, bad)
  crowned_at: timestamptz
  dethroned_at: timestamptz (nullable)
  like_count_at_crown: integer
}
```

### Badge Checks
- [ ] Trigger badge evaluation for new champion
- [ ] Check arc badges (redemption, fall from grace)
- [ ] Check crown count badges

### Edge Cases
- [ ] Handle ties (first to reach count wins)
- [ ] Handle expired champion
- [ ] Handle deleted posts

## Technical Notes
- Use Supabase Edge Function for complex logic
- Atomic transactions for crown transfers
- Consider race conditions with concurrent likes

## Dependencies
- Ticket 003: Database Schema
- Ticket 026: Crown Mechanics
- Ticket 028: Push Notifications

## Estimated Scope
Large
