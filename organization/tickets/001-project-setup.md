# Ticket 001: Project Setup & Infrastructure

## Summary
Initialize the React Native Expo project with core dependencies and folder structure.

## Acceptance Criteria
- [ ] Create new Expo SDK 52+ project with TypeScript template
- [ ] Configure Expo Router for navigation
- [ ] Install and configure Zustand for state management
- [ ] Set up folder structure:
  ```
  /app (Expo Router)
  /components
  /hooks
  /lib
  /stores
  /types
  /constants
  /assets
  ```
- [ ] Configure ESLint and Prettier
- [ ] Set up environment variables structure (.env)
- [ ] Configure app.json/app.config.js with basic app metadata

## Technical Notes
- Use `npx create-expo-app@latest --template tabs` as starting point
- Target iOS 15+ and Android API 24+

## Dependencies
None - this is the first ticket

## Estimated Scope
Small
