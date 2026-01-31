# Ticket 046: Auth Production Setup & Email Configuration

## Summary
Production-ready configuration for authentication emails and redirect URLs.

## Acceptance Criteria

### Email Configuration
- [ ] Configure custom SMTP provider in Supabase (SendGrid, Resend, etc.)
- [ ] Customize email templates (confirmation, password reset)
- [ ] Test emails don't land in spam folder

### URL Configuration
- [ ] Update Site URL in Supabase Auth settings for production domain
- [ ] Configure redirect URLs for password reset flow
- [ ] Set up deep link scheme for mobile app (`goodbabybadbaby://`)

### Email Templates
- [ ] Brand confirmation email with app logo/colors
- [ ] Brand password reset email
- [ ] Add unsubscribe/contact info as required

## Technical Notes
- Supabase Auth settings: Settings → Auth → SMTP Settings
- Site URL: Settings → Auth → Site URL
- Consider using Resend or SendGrid for reliable email delivery
- Deep links require expo-linking configuration (see Ticket 029)

## Dependencies
- Ticket 005: Authentication Flow
- Production domain setup

## Estimated Scope
Small

## Priority
Pre-launch (not needed for development/testing)
