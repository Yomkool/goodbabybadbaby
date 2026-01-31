# Ticket 051: Media Editing Enhancements

## Summary
Add additional photo and video editing capabilities beyond basic cropping.

## Current State
- Photos: Aspect ratio cropping only (1:1, 4:5, 9:16)
- Videos: No editing (uses original)

## Potential Features

### Photo Editing
- [ ] Filters/presets (e.g., warm, cool, vibrant, B&W)
- [ ] Brightness/contrast adjustment
- [ ] Saturation adjustment
- [ ] Rotation (90° increments)
- [ ] Flip horizontal/vertical
- [ ] Crop with free aspect ratio
- [ ] Zoom/pan within crop area
- [ ] Stickers/overlays (pet-themed)
- [ ] Text overlay

### Video Editing
- [ ] Trim start/end points
- [ ] Mute audio toggle
- [ ] Speed adjustment (slow-mo, fast-forward)
- [ ] Filters (same as photos)
- [ ] Thumbnail selection (choose frame)
- [ ] Rotation

### UI/UX
- [ ] Editing toolbar with icons
- [ ] Preview changes in real-time
- [ ] Reset to original option
- [ ] Undo/redo

## Technical Considerations

### Photo Editing
- `expo-image-manipulator` handles basics (crop, rotate, flip)
- Filters may need shader-based approach or pre-computed LUTs
- Consider `react-native-image-filter-kit` for filters

### Video Editing
- Trimming requires `ffmpeg-kit-react-native` or similar
- Ties into Ticket 047 (Client-Side Video Compression)
- May need custom native module for performance
- Consider processing time UX (progress indicator)

## Dependencies
- Ticket 047: Client-Side Video Compression (if adding video processing)

## Priority
Low - Current basic editing is functional for MVP

## Phase
Phase 11 (Polish)

## Estimated Scope
Large (especially video editing)
