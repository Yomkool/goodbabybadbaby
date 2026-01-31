# Ticket 049: Upload & Rate Limits

## Summary
Implement rate limiting and upload quotas to prevent spam and manage storage costs.

## Motivation
- Prevent malicious users from spamming uploads
- Control storage costs (especially video)
- Ensure fair usage across all users
- Protect against abuse before it becomes a problem at scale

## Acceptance Criteria

### Upload Limits
- [ ] Daily upload limit per user (e.g., 10 posts/day for free users)
- [ ] Premium users get higher limits
- [ ] Clear error message when limit reached
- [ ] Show remaining uploads in UI

### Storage Quotas
- [ ] Track total storage per user (use `user_storage_usage` view)
- [ ] Set storage cap (e.g., 500MB free, 5GB premium)
- [ ] Warn user when approaching limit
- [ ] Block uploads when quota exceeded

### Rate Limiting
- [ ] API rate limiting on upload endpoints
- [ ] Cooldown between posts (e.g., 1 minute minimum)
- [ ] Prevent rapid-fire uploads

### Database
- [ ] Add `daily_upload_count` or similar tracking
- [ ] Add `storage_quota_bytes` to users table
- [ ] Cron job to reset daily counts

## Technical Notes
- Can use Supabase Edge Functions for rate limiting
- Or implement client-side + server-side checks
- Consider Redis for rate limit counters at scale
- `user_storage_usage` view already exists for quota tracking

## Dependencies
- Ticket 009: Media Upload (completed)
- Media table with file_size tracking

## Priority
High - Should implement before public launch

## Estimated Scope
Medium
