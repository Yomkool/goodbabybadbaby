# Ticket 023: Leaderboard Screen

## Summary
Build the rolling leaderboard screen showing current champions and contenders.

## Acceptance Criteria

### Screen Sections

#### Current Champions
- [ ] Good Baby Champion 👑 with:
  - Post image
  - Pet name
  - Live like count
  - Time crowned
- [ ] Bad Baby Champion 😈👑 with same info
- [ ] Visual crown/highlight treatment

#### Rising Contenders
- [ ] Top 10 Good Babies (excluding champion)
- [ ] Top 10 Bad Babies (excluding champion)
- [ ] Ranked list with like counts
- [ ] Tap to view post

#### Recent Champions
- [ ] Last 30 crown holders
- [ ] Timestamp when crowned
- [ ] Crown duration (if available)
- [ ] Scroll/pagination for history

### Real-time Updates
- [ ] Pull-to-refresh
- [ ] Auto-refresh every 60 seconds (optional)
- [ ] Live like count updates (stretch goal)

### Navigation
- [ ] Tap post to view detail
- [ ] Tap pet name to view pet profile

## Technical Notes
- Data comes from posts where created_at > now - 24h
- Ordered by like_count DESC
- Consider Supabase Realtime for live updates
- Cache leaderboard data briefly

## Dependencies
- Ticket 003: Database Schema
- Ticket 030: Hot Score Cron Job

## Estimated Scope
Medium
