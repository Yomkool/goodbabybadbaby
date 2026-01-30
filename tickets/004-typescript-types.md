# Ticket 004: TypeScript Types & Interfaces

## Summary
Define all TypeScript types and interfaces for the application based on the data models.

## Acceptance Criteria

- [ ] Create `/types/database.ts` - auto-generated from Supabase schema
- [ ] Create `/types/models.ts` with application-level types:
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
- [ ] Create `/types/navigation.ts` for route params
- [ ] Create `/types/api.ts` for API request/response types
- [ ] Set up script to regenerate Supabase types

## Technical Notes
- Use `supabase gen types typescript --project-id <id> > types/database.ts`
- Keep generated types separate from custom application types

## Dependencies
- Ticket 003: Database Schema

## Estimated Scope
Small
