# Ticket 047: Client-Side Video Compression

## Summary
Add client-side video compression before upload to reduce file sizes and improve upload speed/reliability.

## Motivation
- 4K videos can exceed the 50MB upload limit
- Smaller files = faster uploads = better UX
- Reduces storage costs
- Helps users on slower connections

## Acceptance Criteria

### Compression
- [ ] Compress videos before upload using FFmpeg or similar
- [ ] Target output: 1080p max resolution
- [ ] Target bitrate: ~4-6 Mbps (good quality, reasonable size)
- [ ] Maintain aspect ratio
- [ ] Preserve audio

### User Experience
- [ ] Show compression progress before upload progress
- [ ] Handle compression failures gracefully
- [ ] Allow cancellation during compression

### Performance
- [ ] Compression should complete in reasonable time (<30s for 15s video)
- [ ] Don't block UI during compression

## Technical Notes
- Consider `react-native-video-processor` or `ffmpeg-kit-react-native`
- FFmpeg kit is more powerful but larger bundle size
- May need to handle different codecs (H.264 preferred for compatibility)
- Test on both iOS and Android

## Dependencies
- Ticket 009: Media Upload & Processing (completed)

## Estimated Scope
Medium

## Priority
Low - Only needed if users hit upload limits frequently
