# Ticket 016: Report Functionality

## Summary
Implement the ability to report inappropriate posts.

## Acceptance Criteria

### Trigger
- [ ] Long-press on post opens report menu
- [ ] Or: Report option in post options menu

### Report Flow
- [ ] Report reason selection:
  - Inappropriate content
  - Spam
  - Animal abuse/harm
  - Human content (violates pet-only policy)
  - Other
- [ ] Optional additional details text field
- [ ] Confirm submission
- [ ] Success message: "Thanks for reporting. We'll review this."

### Data Storage
- [ ] Create `reports` table:
  ```sql
  id: uuid
  post_id: uuid (FK)
  reporter_user_id: uuid (FK)
  reason: text
  details: text (nullable)
  status: enum (pending, reviewed, actioned, dismissed)
  created_at: timestamptz
  ```
- [ ] Prevent duplicate reports from same user on same post

### Post-Report Behavior
- [ ] User can optionally hide post from their feed
- [ ] No notification to post owner

## Technical Notes
- Reports go to admin moderation queue (separate ticket)
- Consider rate limiting report submissions

## Dependencies
- Ticket 011: Post Overlay UI

## Estimated Scope
Small
