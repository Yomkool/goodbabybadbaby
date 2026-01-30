# Ticket 038: Admin Moderation Interface

## Summary
Build admin interface for content moderation, report review, and tag management.

## Acceptance Criteria

### Report Queue
- [ ] View all pending reports
- [ ] Report details: post preview, reason, reporter, date
- [ ] Actions: Dismiss, Warn User, Remove Post, Ban User
- [ ] Mark reports as reviewed
- [ ] Filter by status, reason, date

### Tag Suggestion Queue
- [ ] View pending tag suggestions
- [ ] Approve or reject suggestions
- [ ] Add approved tags to curated library
- [ ] Notify user on approval (optional)
- [ ] Bulk actions

### User Management
- [ ] Search users by name/email
- [ ] View user details and posts
- [ ] Issue warnings
- [ ] Suspend/ban users
- [ ] View ban history

### Content Management
- [ ] Search posts
- [ ] Remove posts manually
- [ ] View post details and reports

### Dashboard
- [ ] Report counts (pending, today, this week)
- [ ] Active users
- [ ] Posts created today
- [ ] Flagged content alerts

## Technical Notes
- Can be web-based (Next.js, React) separate from mobile app
- Alternatively, integrate into Supabase Studio or Retool
- Secure with admin auth (separate from app auth)
- Audit log for admin actions

## Dependencies
- Ticket 003: Database Schema
- Ticket 016: Report Functionality
- Ticket 024: Tags System

## Estimated Scope
Large (but can be MVP'd)
