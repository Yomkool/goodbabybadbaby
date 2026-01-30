# Ticket 004: TypeScript Types & Interfaces

## Summary
Define all TypeScript types and interfaces for the application based on the data models.

## Acceptance Criteria

- [x] Create `/types/database.ts` - auto-generated from Supabase schema
- [x] Create `/types/models.ts` with application-level types:
  ```typescript
  type PetSpecies =
    | 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster'
    | 'guinea_pig' | 'fish' | 'reptile' | 'amphibian'
    | 'horse' | 'farm' | 'exotic' | 'other';

  type PostType = 'good' | 'bad';
  type MediaType = 'image' | 'video';
  type TagSuggestionStatus = 'pending' | 'approved' | 'rejected';

  interface User { ... }
  interface Pet { ... }
  interface Post { ... }
  interface Like { ... }
  interface Follow { ... }
  interface TagSuggestion { ... }
  interface CuratedTag { ... }
  interface Badge { ... }
  ```
- [x] Create `/types/navigation.ts` for route params
- [x] Create `/types/api.ts` for API request/response types
- [x] Set up script to regenerate Supabase types

## Technical Notes
- Use `supabase gen types typescript --project-id <id> > types/database.ts`
- Keep generated types separate from custom application types

## Dependencies
- Ticket 003: Database Schema

## Estimated Scope
Small

## Completion Notes
- `types/database.ts` - Full Supabase schema types with Row/Insert/Update variants
- `types/models.ts` - Application types including Badge, Feed, Leaderboard, Upload, Auth, Premium types
- `types/navigation.ts` - Expo Router route params and deep link types
- `types/api.ts` - Complete API request/response types for all endpoints
- `types/index.ts` - Barrel export for easy imports
- Added `npm run db:types` script in package.json to regenerate from Supabase
