# Ticket 014: Video Playback in Feed

## Summary
Implement video playback with autoplay, muting, and proper lifecycle management.

## Acceptance Criteria

### Playback Behavior
- [ ] Autoplay when post is in view
- [ ] Muted by default
- [ ] Loop continuously
- [ ] Pause when scrolled out of view
- [ ] Release memory for off-screen videos

### Controls
- [ ] Speaker icon to toggle mute/unmute
- [ ] Mute state persists for session
- [ ] Tap and hold to pause (release to resume)
- [ ] Duration badge on video posts (e.g., "0:12")

### Visual Indicators
- [ ] Loading spinner while buffering
- [ ] Play icon overlay when paused
- [ ] Progress bar (optional, subtle)

### Performance
- [ ] Limit concurrent video players (max 1-2)
- [ ] Preload next video while current plays
- [ ] Handle network interruptions gracefully

## Technical Notes
- Use `expo-av` or `expo-video` for playback
- Consider Mux for video hosting/streaming
- Test on both iOS and Android for behavior consistency

## Dependencies
- Ticket 010: Feed UI

## Estimated Scope
Medium
