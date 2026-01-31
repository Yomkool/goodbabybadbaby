# Ticket 035: Settings Screen

## Summary
Build the settings screen with account, notification, and app preferences.

## Acceptance Criteria

### Account Section
- [ ] Display current email/account
- [ ] Edit display name
- [ ] Change avatar
- [ ] Logout button

### Following Section
- [ ] "Pets I Follow" list
- [ ] View and manage followed pets
- [ ] Quick unfollow option

### Notifications Section
- [ ] Global notifications toggle
- [ ] Individual notification preferences:
  - Crown won notifications
  - Crown threat notifications (opt-in)
  - Followed pet posted (opt-in)
  - Streak reminders (opt-in)
  - Weekly recap (opt-in)

### Premium Section
- [ ] Current subscription status
- [ ] "Go Premium" button (if not premium)
- [ ] Manage subscription link
- [ ] Restore purchases

### Support Section
- [ ] Help/FAQ link
- [ ] Contact support
- [ ] Privacy Policy link
- [ ] Terms of Service link

### Danger Zone
- [ ] Delete account (with confirmation)
- [ ] Handle account deletion properly

### App Info
- [ ] App version
- [ ] Build number

## Technical Notes
- Link to native settings for notification permissions
- Handle iOS/Android differences in settings

## Dependencies
- Ticket 005: Authentication Flow
- Ticket 028: Push Notifications
- Ticket 031: Premium Subscription

## Estimated Scope
Medium
