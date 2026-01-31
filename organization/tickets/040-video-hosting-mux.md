# Ticket 040: Video Hosting & Streaming (Mux)

## Summary
Integrate Mux for video upload, transcoding, and streaming.

## Acceptance Criteria

### Mux Setup
- [ ] Create Mux account
- [ ] Configure API credentials
- [ ] Set up upload endpoint (direct or via backend)

### Upload Flow
- [ ] Client uploads video to Mux (direct upload)
- [ ] Mux processes and transcodes
- [ ] Receive playback URL and thumbnail
- [ ] Store URLs in post record

### Video Delivery
- [ ] Adaptive bitrate streaming (HLS)
- [ ] Multiple quality levels
- [ ] Fast start for quick playback

### Thumbnail Generation
- [ ] Auto-generate thumbnail from first frame
- [ ] Or: allow user to select thumbnail frame
- [ ] Store thumbnail URL

### Playback Integration
- [ ] Use Mux playback URLs in video player
- [ ] Handle different quality based on connection
- [ ] Preload next video

### Cost Optimization
- [ ] Set video length limit (15 seconds max)
- [ ] Monitor encoding minutes usage
- [ ] Consider storage duration policies

## Technical Notes
- Mux direct upload avoids backend bandwidth
- Use Mux's React Native SDK or standard HLS player
- Consider Mux Data for analytics (optional)

## Dependencies
- Ticket 014: Media Upload
- Ticket 010: Video Playback

## Estimated Scope
Medium
