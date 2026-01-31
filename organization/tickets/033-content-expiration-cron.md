# Ticket 033: Content Expiration & Cleanup Cron Job

## Summary
Implement cron jobs for soft-delete and hard-delete of expired content.

## Acceptance Criteria

### Soft Delete (Mark Expired)
- [ ] Run every 15 minutes
- [ ] Mark posts where `expires_at < now` as expired
- [ ] Exclude pinned posts (`is_pinned = true`)
- [ ] Exclude winner posts (`is_winner = true`)
- [ ] Add `is_expired` flag or use expires_at check

### Hard Delete (Cleanup)
- [ ] Run daily (off-peak hours)
- [ ] Delete posts where expired for > 24 hours
- [ ] Delete associated likes
- [ ] Delete media from storage
- [ ] Log deleted post count

### Storage Cleanup
- [ ] Remove media files for deleted posts
- [ ] Clean up orphaned storage files
- [ ] Batch deletion to avoid timeout

### Preservation Rules
- [ ] Never delete pinned posts
- [ ] Never delete winner posts
- [ ] Keep winner posts indefinitely

### Safety Measures
- [ ] Dry-run mode for testing
- [ ] Audit log of deleted posts
- [ ] Recovery window consideration

## Technical Notes
- Use pg_cron or Supabase scheduled functions
- Batch deletes to avoid lock contention
- Consider archiving instead of hard delete (optional)

## Dependencies
- Ticket 003: Database Schema
- Ticket 002: Supabase Setup

## Estimated Scope
Medium
