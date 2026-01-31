# Ticket 048: Unified Camera Button (Photo + Video)

## Summary
Investigate combining "Take Photo" and "Record Video" into a single camera button that supports both modes.

## Background
Currently we have separate buttons because Android's camera intent doesn't reliably support `mediaTypes: ['images', 'videos']` - some devices (notably Samsung) ignore the video option and only show photo mode.

The separate buttons work, but a unified experience would be cleaner UX.

## Options to Investigate

### 1. expo-camera Custom UI
- Build custom camera screen using `expo-camera`
- Full control over photo/video toggle
- More work, but guaranteed cross-platform consistency
- Adds bundle size

### 2. React Native Vision Camera
- Third-party library with better device support
- More features (frame processors, etc.)
- Requires native build (no Expo Go)

### 3. Device-Specific Logic
- Detect device/OS and use unified button where supported
- Fall back to separate buttons on problematic devices
- Fragile, hard to maintain

### 4. Action Sheet Approach
- Single "Use Camera" button
- Shows action sheet: "Take Photo" / "Record Video"
- Still two taps, but cleaner UI

## Acceptance Criteria
- [ ] Research which approach is most feasible
- [ ] Implement if reasonable effort
- [ ] Maintain current UX if not feasible (separate buttons work fine)

## Priority
Low - Current solution works, this is purely UX polish

## Dependencies
- None

## Estimated Scope
Small-Medium (research) or Large (if building custom camera)
