# Ticket 012: Post Overlay & Interaction UI

## Summary
Polish the post overlay with improved visuals, animations, and complete interaction features.

## Acceptance Criteria

### Overlay Display
- [x] Good Baby 😇 or Bad Baby 😈 label
- [x] Pet name display
- [x] Tags display
- [x] Like button with Good/Bad Baby emoji differentiation
- [ ] Faded gradient border/background for readability
- [ ] Pet name tappable to view pet profile (requires Ticket 020)
- [ ] Tags tappable to filter by tag (requires Ticket 024)
- [ ] Share button (requires Ticket 017)
- [ ] Report via long-press (requires Ticket 016)

### Overlay States
| State | Trigger | Display |
|-------|---------|---------|
| Visible | On load, single tap when hidden | Full overlay |
| Hidden | Single tap when visible | Full bleed image only |

Status: [x] Implemented (3-state toggle for videos)

### Animations
- [x] Like animation (emoji burst on double-tap)
- [ ] Smooth fade in/out for overlay toggle
- [ ] Enhanced like animation (particles or pulse effect)

### Accessibility
- [ ] VoiceOver/TalkBack labels for all interactive elements
- [ ] Sufficient contrast for overlay text

## Technical Notes
- Use `react-native-reanimated` for smooth animations (installed, not yet utilized)
- Consider gesture handler for tap detection
- Overlay should not block swipe gestures

## Dependencies
- Ticket 010: Feed UI ✅
- Ticket 016: Report Functionality
- Ticket 017: Share Functionality
- Ticket 020: Pet Profile Screen
- Ticket 024: Tags System

## Estimated Scope
Medium (polish pass after dependencies complete)
