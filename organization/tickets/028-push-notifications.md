# Ticket 028: Push Notifications

## Summary
Implement push notifications for key events with smart permission prompting.

## Acceptance Criteria

### Permission Strategy
- [ ] Do NOT prompt on first launch
- [ ] Trigger prompt after:
  - User has posted once, OR
  - User has liked 5+ posts
- [ ] Custom explainer screen before system prompt:
  > "Want to know when your baby takes the crown? 👑 Enable notifications to find out!"
- [ ] Allow skip, with reminder later (sparingly)

### Notification Types
| Trigger | Message | Required |
|---------|---------|----------|
| Post took crown | "👑 Mochi just took the Good Baby crown!" | Yes |
| First crown ever | "🎉 Your first crown! Mochi is the Good Baby!" | Yes |
| Crown under threat | "👀 Someone is closing in on Mochi's crown!" | Opt-in |
| Followed pet posted | "🐾 Mochi just posted!" | Opt-in |
| Streak at risk | "🔥 Post today to keep your 7-day streak alive!" | Opt-in |
| Weekly recap | "Your babies got 142 likes this week 💕" | Opt-in |

### NOT Included
- Individual likes (too noisy)
- New followers (no follow notifications)

### Settings
- [ ] Notification preferences in settings
- [ ] Toggle each notification type on/off
- [ ] Global notifications toggle

### Backend
- [ ] Store device push tokens
- [ ] Supabase Edge Function to send notifications
- [ ] Handle token refresh

## Technical Notes
- Use `expo-notifications` for client-side
- Store push tokens in users table or separate table
- Use Expo Push Service or FCM/APNs directly
- Consider batching notifications

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 026: Crown Mechanics

## Estimated Scope
Large
