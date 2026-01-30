# Ticket 026: Crown Mechanics & Champion Transitions

## Summary
Implement the logic for crown transitions when a new post becomes #1.

## Acceptance Criteria

### Crown Detection
- [ ] Every 5 minutes, check top posts in last 24h
- [ ] Separate check for Good Baby and Bad Baby
- [ ] Compare against current champion

### Crown Transfer
When new #1 detected:
- [ ] Set `current_champion = false` on old champion
- [ ] Set `current_champion = true` on new champion
- [ ] Set `is_winner = true` on new champion (permanent)
- [ ] Increment crown count on pet:
  - `good_baby_crowns` or `bad_baby_crowns`
- [ ] Log crown transfer event

### Winner Persistence
- [ ] `is_winner = true` is permanent (even if loses crown later)
- [ ] Winner posts preserved (never expire)
- [ ] Winner badge visible on post

### Notifications
- [ ] Notify new champion: "👑 Mochi just took the Good Baby crown!"
- [ ] Optional: Notify former champion when dethroned
- [ ] Optional: Notify when within 10% of leader

### Badge Triggers
- [ ] Check for badge awards on crown event:
  - Champion badges (increment count)
  - Arc badges (Redemption, Fall from Grace, Contains Multitudes)
  - Rare achievements (Instant Royalty, Dynasty, etc.)
  - Sibling Rivalry (if applicable)

### Edge Cases
- [ ] Post expires while holding crown
- [ ] Tie in like count (first to reach wins)
- [ ] Crown transfer while app is backgrounded

## Technical Notes
- Implement as Supabase Edge Function or cron job
- Needs atomic operations to prevent race conditions
- Consider event log table for crown history

## Dependencies
- Ticket 003: Database Schema
- Ticket 025: Badges System
- Ticket 030: Hot Score Cron Job

## Estimated Scope
Large
