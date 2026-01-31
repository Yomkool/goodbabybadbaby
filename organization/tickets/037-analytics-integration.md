# Ticket 037: Analytics Integration (PostHog)

## Summary
Integrate PostHog for product analytics and user behavior tracking.

## Acceptance Criteria

### PostHog Setup
- [ ] Create PostHog account and project
- [ ] Install PostHog React Native SDK
- [ ] Configure with project API key
- [ ] Set up user identification on auth

### Events to Track

**Core Actions:**
- [ ] `post_created` - type (good/bad), media_type, tag_count
- [ ] `post_liked` / `post_unliked`
- [ ] `pet_followed` / `pet_unfollowed`
- [ ] `post_shared` - share_type (save, link, native)
- [ ] `post_reported`

**Engagement:**
- [ ] `feed_scrolled` - posts_viewed
- [ ] `filter_changed` - filter_type
- [ ] `tag_tapped`
- [ ] `leaderboard_viewed`

**Conversion:**
- [ ] `onboarding_started`
- [ ] `onboarding_completed`
- [ ] `first_post_created`
- [ ] `premium_viewed`
- [ ] `premium_purchased`

**User Properties:**
- [ ] Total posts
- [ ] Total likes given/received
- [ ] Pets count
- [ ] Is premium
- [ ] Crown count

### Screen Tracking
- [ ] Automatic screen view tracking
- [ ] Custom screen names for key flows

### Privacy
- [ ] Respect user privacy preferences
- [ ] Don't track personal content
- [ ] Handle GDPR/CCPA compliance

## Technical Notes
- Use PostHog React Native SDK
- Consider batching events for performance
- Test event accuracy before launch

## Dependencies
- Ticket 001: Project Setup

## Estimated Scope
Medium
