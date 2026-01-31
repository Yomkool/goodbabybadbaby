# Ticket 024: Tags System

## Summary
Implement the curated tag system with tag picker, filtering, and tag suggestions.

## Acceptance Criteria

### Curated Tag Library
- [ ] Seed database with initial tags:
  | Category | Tags |
  |----------|------|
  | Behavior | zoomies, loaf, sploot, blep, mlem, tippy-taps, biscuits, screaming |
  | Situation | crime, caught-red-handed, innocent, guilty, no-regrets, caught-in-the-act |
  | Mood | chaos, cozy, judging-you, unbothered, unhinged, concerned, no-thoughts |
  | Physical | chonk, floof, beans, teefies, whiskers, ears, tiny |
  | Activity | nap, play, eat, destroy, hide, stare, beg |
- [ ] Store in `curated_tags` table

### Tag Picker (Post Creation)
- [ ] Searchable list of curated tags
- [ ] Grouped by category
- [ ] Tag chips for selected (max 5)
- [ ] Clear indication when limit reached
- [ ] "Suggest a tag" option at bottom

### Tag Display (Posts)
- [ ] Show tags on post overlay
- [ ] Tappable tags
- [ ] Tap tag to view all posts with that tag

### Tag Filter/Search
- [ ] Tag search in Explore screen
- [ ] Results show all posts with tag
- [ ] Sorted by hot score or recency

### Tag Suggestion Flow
- [ ] User taps "Suggest a tag"
- [ ] Input field (max 20 chars, alphanumeric + hyphens)
- [ ] Submit for moderation
- [ ] Success message: "Thanks! We'll review your suggestion."
- [ ] Store in `tag_suggestions` table

### Trending Tags
- [ ] Calculate most-used tags in last 24h
- [ ] Display on Explore/Search screen
- [ ] Tap to view posts with tag

## Technical Notes
- Tags lowercase, alphanumeric, max 20 chars
- Tag validation on client and server
- Consider caching tag list

## Dependencies
- Ticket 003: Database Schema
- Ticket 013: Post Creation UI

## Estimated Scope
Medium
