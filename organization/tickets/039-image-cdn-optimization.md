# Ticket 039: Image CDN & Optimization

## Summary
Set up image optimization pipeline with CDN for fast, optimized image delivery.

## Acceptance Criteria

### Image Processing
- [ ] On upload: generate multiple sizes
  - Thumbnail (200px)
  - Medium (600px)
  - Full (1200px)
- [ ] Format optimization (WebP where supported)
- [ ] Quality compression (80%)

### CDN Setup
Options (choose one):
- [ ] **Option A:** Supabase Storage + Imgproxy
- [ ] **Option B:** Cloudinary
- [ ] **Option C:** Supabase Storage with Edge Function transforms

### Image URL Strategy
- [ ] Generate signed URLs or public URLs
- [ ] URL format for different sizes: `{base}/{size}/{filename}`
- [ ] Fallback to original if optimized not available

### Client Integration
- [ ] Helper function to get image URL by size
- [ ] Use `expo-image` with caching
- [ ] Progressive loading (blur placeholder)
- [ ] Error handling for failed loads

### Performance Targets
- [ ] Feed images load in <500ms
- [ ] Thumbnails load in <200ms
- [ ] Total image payload reduced by 50%+

## Technical Notes
- Imgproxy can run as Docker container
- Cloudinary has React Native SDK
- Consider lazy loading for off-screen images

## Dependencies
- Ticket 002: Supabase Setup
- Ticket 014: Media Upload

## Estimated Scope
Medium
