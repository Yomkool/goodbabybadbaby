# Ticket 012: Post Overlay & Interaction UI

## Summary
Build the post overlay that shows metadata and action buttons, with toggle visibility.

## Acceptance Criteria

### Overlay Display
- [ ] Faded gradient border/background for readability
- [ ] Good Baby ☀️ or Bad Baby 😈 label
- [ ] Pet name (tappable to view pet profile)
- [ ] Tags (tappable to filter by tag)
- [ ] Action buttons:
  - [ ] Paw print like button (filled when liked)
  - [ ] Share button
  - [ ] Report (accessible via long-press)

### Overlay States
| State | Trigger | Display |
|-------|---------|---------|
| Visible | On load, single tap when hidden | Full overlay |
| Hidden | Single tap when visible | Full bleed image only |

### Animations
- [ ] Smooth fade in/out for overlay toggle
- [ ] Like animation (paw print pulse or particles)
- [ ] Double-tap like animation (heart/paw burst)

### Accessibility
- [ ] VoiceOver/TalkBack labels for all interactive elements
- [ ] Sufficient contrast for overlay text

## Technical Notes
- Use `react-native-reanimated` for smooth animations
- Consider gesture handler for tap detection
- Overlay should not block swipe gestures

## Dependencies
- Ticket 010: Feed UI

## Estimated Scope
Medium
