# Ticket 030: Ads Integration

## Summary
Integrate Google AdMob for banner and interstitial ads.

## Acceptance Criteria

### Banner Ads
- [ ] Bottom banner on feed screen
- [ ] Non-intrusive positioning
- [ ] Adaptive banner sizing
- [ ] Hide when premium user

### Interstitial Ads
- [ ] Show every 10-15 posts in feed
- [ ] Track post count, show ad at threshold
- [ ] Preload interstitial for smooth experience
- [ ] Skip for premium users
- [ ] Don't show during critical flows (posting, onboarding)

### Ad Configuration
- [ ] Create AdMob account and app
- [ ] Set up ad units (banner, interstitial)
- [ ] Configure test ads for development
- [ ] Implement production ad unit IDs

### User Experience
- [ ] Loading indicator while ad loads
- [ ] Graceful handling of ad failures
- [ ] Respect frequency caps
- [ ] Track ad impressions for analytics

### Premium Check
- [ ] Check `is_premium` before showing ads
- [ ] Immediately hide ads when user upgrades

## Technical Notes
- Use `react-native-google-mobile-ads`
- Configure `app.json` with AdMob app ID
- Test thoroughly on both platforms
- Consider GDPR/consent for EU users

## Dependencies
- Ticket 008: Feed UI

## Estimated Scope
Medium
