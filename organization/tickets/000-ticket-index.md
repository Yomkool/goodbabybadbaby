# Good Baby, Bad Baby - Ticket Index

## Overview
This document provides an index of all tickets for the Good Baby, Bad Baby app development.

---

## Phase 1: Foundation (Tickets 001-007)

### Infrastructure
- **001** - Project Setup & Infrastructure
- **002** - Supabase Backend Setup
- **003** - Database Schema & Migrations
- **004** - TypeScript Types & Interfaces

### Authentication & Onboarding
- **005** - Authentication Flow (Email)
- **006** - Auth Guards & Protected Routing
- **007** - Onboarding - Add First Pet

---

## Phase 2: Core Features (Tickets 008-018)

### Posting (Create before View for testability)
- **008** - Post Creation UI
- **009** - Media Upload & Processing
- **015** - Add New Pet During Post Creation

### Feed
- **010** - Feed UI - Vertical Swipe Cards
- **011** - Feed Data & Hot Ranking Algorithm
- **014** - Video Playback in Feed

### Post Interactions
- **012** - Post Overlay & Interaction UI
- **013** - Like Functionality

### Content Management
- **016** - Report Functionality
- **017** - Share Functionality
- **018** - Content Lifecycle - Expiration & Pinning

---

## Phase 3: Social Features (Tickets 019-022)

- **019** - User Profile Screen
- **020** - Pet Profile Screen
- **021** - Follow System
- **022** - View Other User's Profile

---

## Phase 4: Competition & Gamification (Tickets 023-026)

- **023** - Leaderboard Screen
- **024** - Tags System
- **025** - Badges System
- **026** - Crown Mechanics & Champion Transitions

---

## Phase 5: Discovery & Navigation (Tickets 027, 036)

- **027** - Search & Explore Screen
- **036** - Tab Navigation Setup

---

## Phase 6: Monetization (Tickets 030-031)

- **030** - Ads Integration (AdMob)
- **031** - Premium Subscription (RevenueCat)

---

## Phase 7: Engagement & Retention (Tickets 028, 041)

- **028** - Push Notifications
- **041** - Streak Tracking System

---

## Phase 8: Sharing & Deep Links (Tickets 029)

- **029** - Deep Links & Web Preview

---

## Phase 9: Backend Jobs (Tickets 032-034)

- **032** - Hot Score Calculation Cron Job
- **033** - Content Expiration & Cleanup Cron Job
- **034** - Leaderboard & Crown Cron Job

---

## Phase 10: Platform & Polish (Tickets 035, 037-044)

- **035** - Settings Screen
- **037** - Analytics Integration (PostHog)
- **038** - Admin Moderation Interface
- **039** - Image CDN & Optimization
- **040** - Video Hosting & Streaming (Mux)
- **042** - Row Level Security Policies
- **043** - Post Detail Modal/Screen
- **044** - Error Handling & Offline Support
- **045** - Social OAuth Setup (Apple & Google Sign-In)

---

## Suggested Build Order

### MVP (Launch-Ready)
1. Foundation: 001-007
2. Core Posting & Feed: 008-015, 036
3. Social Basics: 019-021
4. Competition Core: 023, 026
5. Backend Jobs: 032-034
6. Essential Polish: 042, 043, 044

### Post-MVP
1. Social Auth: 045 (when app store setup complete)
2. Monetization: 030, 031
3. Full Tags & Badges: 024, 025
4. Engagement: 028, 041
5. Discovery: 027
6. Sharing: 017, 029
7. Reports & Moderation: 016, 038
8. Analytics: 037
9. Media Optimization: 039, 040

---

## Ticket Count by Category

| Category | Count |
|----------|-------|
| Infrastructure | 4 |
| Auth & Onboarding | 3 |
| Feed & Content | 11 |
| Social | 4 |
| Competition | 4 |
| Monetization | 2 |
| Engagement | 2 |
| Backend | 3 |
| Platform/Polish | 11 |
| **Total** | **44** |
