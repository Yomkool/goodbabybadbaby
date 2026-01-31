# Claude Code Instructions for Good Baby Bad Baby

## Project Overview
A TikTok-style React Native/Expo app for sharing pet content. Users post "good baby" (😇) and "bad baby" (😈) moments of their pets.

## Before Starting Work

1. **Read the architecture document** at `organization/architecture.md` to understand the codebase structure, patterns, and conventions.

2. **Check the tracker** at `organization/TRACKER.md` to see current progress and what's been completed.

3. **Review relevant tickets** in `organization/tickets/` for detailed requirements on specific features.

## After Making Changes

### Update Documentation
- **architecture.md**: Update if you add new directories, change patterns, add dependencies, or modify the tech stack.
- **TRACKER.md**: Update ticket status (⬜ → 🔄 → ✅) and progress percentages when completing work.
- **Individual tickets**: Mark acceptance criteria as complete with checkmarks when implemented.

### Code Cleanup
After completing changes, review the code and:
- Remove any unused imports
- Delete unused functions, variables, or components
- Remove redundant or duplicate code
- Consolidate shared constants/utilities when patterns emerge
- Run `npm run lint` to catch issues
- Run `npx tsc --noEmit` to verify TypeScript compiles

## Code Conventions

### File Organization
- **Components**: `components/{feature}/ComponentName.tsx`
- **Stores**: `stores/{name}Store.ts` (Zustand)
- **Types**: `types/{category}.ts` (database, models, api, navigation)
- **Utilities**: `lib/{feature}/` or `lib/constants/`
- **Screens**: `app/(group)/screen-name.tsx` (Expo Router)

### Naming
- Components: PascalCase (`PostCard.tsx`)
- Stores: camelCase with Store suffix (`feedStore.ts`)
- Types: PascalCase (`FeedPost`, `SpeciesType`)
- Constants: SCREAMING_SNAKE_CASE (`SPECIES_EMOJI`)

### State Management
- Use Zustand stores for all shared state
- Components subscribe via hooks (`useAuthStore`, `useFeedStore`)
- Stores call Supabase directly (no separate API layer)
- Use optimistic updates for better UX

### Styling
- Use `StyleSheet.create()` for all styles
- Keep styles at bottom of component file
- Use theme colors from `constants/Colors.ts`

### Types
- Always type function parameters and return values
- Use types from `types/` directory, don't duplicate
- Database types are auto-generated in `types/database.ts`
- App types extend DB types in `types/models.ts`

## Common Tasks

### Adding a New Screen
1. Create file in appropriate `app/(group)/` directory
2. Add route params to `types/navigation.ts` if needed
3. Update architecture.md navigation section if significant

### Adding a New Component
1. Create in `components/{feature}/` directory
2. Export types/interfaces if reusable
3. Use shared constants from `lib/constants/`

### Adding State
1. Add to existing store or create new store in `stores/`
2. Define interface for state shape
3. Use selectors for derived state

### Working with Supabase
1. Types are in `types/database.ts` (auto-generated)
2. Client is in `lib/supabase.ts`
3. Queries go in store actions, not components

## Do Not

- Create documentation files unless explicitly requested
- Add features beyond what's requested (avoid over-engineering)
- Use `console.log` for debugging (use `console.warn` or `console.error` if needed)
- Commit `.env` files or credentials
- Create empty interfaces (use type aliases instead)
- Leave unused imports or variables

## Tech Stack Quick Reference

| What | Technology |
|------|------------|
| Framework | React Native + Expo 54 |
| Navigation | Expo Router 6 (file-based) |
| State | Zustand 5 |
| Backend | Supabase (Postgres + Auth + Storage) |
| Media | expo-image, expo-video |
| Icons | FontAwesome (@expo/vector-icons) |

## Useful Commands

```bash
npm start          # Start Expo dev server
npm run lint       # Check for lint errors
npm run lint:fix   # Auto-fix lint errors
npx tsc --noEmit   # TypeScript check
npm run db:types   # Regenerate Supabase types
```
