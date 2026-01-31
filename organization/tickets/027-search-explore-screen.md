# Ticket 027: Search & Explore Screen

## Summary
Build the search and explore screen with tag search, trending tags, and species browsing.

## Acceptance Criteria

### Search Functionality
- [ ] Search input field at top
- [ ] Search tags (curated tags)
- [ ] Search results show matching tags
- [ ] Tap tag to view posts with that tag

### Trending Tags Section
- [ ] Display most-used tags in last 24h
- [ ] Show tag chips with usage indicator
- [ ] Tap to view posts with tag
- [ ] Refresh periodically

### Browse by Species
- [ ] Grid of species icons/cards
- [ ] All species types from PetSpecies enum
- [ ] Tap species to view posts from that species
- [ ] Consider visual icons for each species

### Tag Results View
- [ ] Grid of posts with selected tag
- [ ] Sorted by hot score
- [ ] Pagination/infinite scroll
- [ ] Back navigation to search

### Species Results View
- [ ] Grid of posts from selected species
- [ ] Sorted by hot score
- [ ] Pagination/infinite scroll

## Technical Notes
- Trending tags calculated from post tags in last 24h
- Consider caching trending data
- Debounce search input

## Dependencies
- Ticket 024: Tags System
- Ticket 009: Feed Data

## Estimated Scope
Medium
