# Ticket 032: Hot Score Calculation Cron Job

## Summary
Implement cron job to recalculate hot scores for feed ranking.

## Acceptance Criteria

### Hot Score Formula
```
score = (likes × followed_boost) / (hours_since_post + 2)^1.5
```
Where `followed_boost` = 1.5 for followed pets (calculated per-user at query time)

### Cron Job Behavior
- [ ] Run every 5-10 minutes
- [ ] Update `hot_score` on all active posts
- [ ] Only process non-expired posts (expires_at > now)

### Implementation
- [ ] Supabase Edge Function or pg_cron
- [ ] Query all active posts
- [ ] Calculate base score (without follow boost)
- [ ] Update hot_score column
- [ ] Log execution time and post count

### Query Optimization
- [ ] Create index on hot_score for efficient feed queries
- [ ] Batch updates for performance
- [ ] Consider materialized view for complex queries

### Monitoring
- [ ] Track cron execution success/failure
- [ ] Alert on failures
- [ ] Performance monitoring

## Technical Notes
- pg_cron can run directly in Postgres
- Alternatively use Supabase scheduled Edge Functions
- Follow boost applied at query time, not in cron

## Dependencies
- Ticket 003: Database Schema

## Estimated Scope
Medium
