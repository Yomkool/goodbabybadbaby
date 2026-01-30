# Ticket 031: Premium Subscription (RevenueCat)

## Summary
Implement premium subscription with RevenueCat for ad-free experience and extra features.

## Acceptance Criteria

### RevenueCat Setup
- [ ] Create RevenueCat account and project
- [ ] Configure iOS App Store Connect products
- [ ] Configure Google Play Console products
- [ ] Install `react-native-purchases`

### Subscription Tiers
| Tier | Price | Benefits |
|------|-------|----------|
| Premium Monthly | $2.99/mo | Ad-free, 18 pin slots, pet pin grids |
| Premium Yearly | $24.99/yr | Same as monthly |

### One-Time Purchases
| Item | Price | Benefit |
|------|-------|---------|
| Pin Expansion Pack | $1.99 | +9 pin slots (stackable) |

### Premium Features
- [ ] Ad-free experience (remove all ads)
- [ ] Extra profile pin slots (18 total vs 9)
- [ ] Pet pin grids unlocked
- [ ] Premium badge on profile (optional)

### Purchase Flow
- [ ] Premium upsell screen/modal
- [ ] Show benefits comparison
- [ ] Purchase buttons with price
- [ ] Handle purchase success/failure
- [ ] Restore purchases option

### Subscription Management
- [ ] Check subscription status on app launch
- [ ] Listen for subscription changes
- [ ] Sync with backend (store `is_premium` on user)
- [ ] Handle expiration/renewal

### UI Integration
- [ ] "Go Premium" button in settings
- [ ] Premium upsell when hitting limits (pins, pet grids)
- [ ] Premium badge/indicator

## Technical Notes
- RevenueCat handles receipt validation
- Use RevenueCat webhooks to sync status to Supabase
- Test with sandbox accounts

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 019: User Profile

## Estimated Scope
Large
