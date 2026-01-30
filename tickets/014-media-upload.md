# Ticket 014: Media Upload & Processing

## Summary
Implement media upload pipeline for images and videos with optimization.

## Acceptance Criteria

### Image Upload
- [ ] Compress images before upload (quality ~80%)
- [ ] Generate consistent dimensions per aspect ratio
- [ ] Upload to Supabase Storage `posts` bucket
- [ ] Return public URL for storage

### Video Upload
- [ ] Validate video is ≤15 seconds
- [ ] Compress video for mobile optimization
- [ ] Generate thumbnail from first frame
- [ ] Upload video to Mux (or Supabase Storage)
- [ ] Store video URL and thumbnail URL

### Upload Progress
- [ ] Show upload progress indicator
- [ ] Handle upload failures with retry option
- [ ] Cancel upload capability

### Post Creation
- [ ] Create post record after successful upload
- [ ] Set `expires_at` to `created_at + 72 hours`
- [ ] Initialize `like_count` to 0
- [ ] Set `hot_score` initial value

### Validation
- [ ] Max file size limits (e.g., 50MB video, 10MB image)
- [ ] Supported formats (JPEG, PNG, HEIC, MP4, MOV)
- [ ] Reject invalid files with clear error

## Technical Notes
- Use `expo-file-system` for file operations
- Consider `expo-video-thumbnails` for thumbnail generation
- Mux handles video transcoding automatically
- Set appropriate Content-Type headers

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 013: Post Creation UI

## Estimated Scope
Large
