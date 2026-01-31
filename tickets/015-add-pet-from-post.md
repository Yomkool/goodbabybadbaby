# Ticket 015: Add New Pet During Post Creation

## Summary
Allow users to add a new pet inline during the post creation flow.

## Acceptance Criteria

### Trigger
- [ ] "Add new pet" option in pet selection step
- [ ] Opens modal or inline form

### Form Fields
- [ ] Pet name (required, 1-30 chars)
- [ ] Species selector (required)
- [ ] Pet avatar (optional)

### Behavior
- [ ] Save new pet to database
- [ ] Auto-select newly created pet for current post
- [ ] Return to post flow seamlessly
- [ ] New pet appears in future pet selections

### Validation
- [ ] Name required with length limits
- [ ] Species must be selected
- [ ] Handle duplicate pet names (allow - same user can have multiple pets with same name)

## Technical Notes
- Reuse pet creation logic from onboarding
- Consider shared component/hook for pet creation

## Dependencies
- Ticket 007: Onboarding (shared logic)
- Ticket 008: Post Creation UI

## Estimated Scope
Small
