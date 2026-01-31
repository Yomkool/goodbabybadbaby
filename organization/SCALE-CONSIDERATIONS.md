# Scale Considerations

> Technical concerns to address post-MVP when traffic/data grows. Not blockers for launch, but important to revisit.

---

## Hot Score Calculation

**Current:** Trigger updates one post's `hot_score` on each like. Cron job recalculates all posts for time decay.

**Concern:** At high write volume (1000s likes/sec), individual row updates could cause contention. Cron job updating all posts gets slow with millions of posts.

**Solutions at scale:**
- Queue likes in Redis, batch update scores every few seconds
- Only recalculate posts < 48-72hrs old (older posts barely change)
- Partition posts table by created_at for faster updates
- Consider pre-computed materialized views for hot feed

**When to address:** 10k+ daily active users or 100k+ posts

---

## Feed Query Performance

**Current:** Feed queries join posts + users + pets + media, plus separate queries for follows and likes.

**Concern:** Multiple round-trips to DB per feed fetch. N+1 potential with large result sets.

**Solutions at scale:**
- Denormalize: Store pet_name, user_display_name directly on posts
- Cache hot feed results in Redis (invalidate on new posts/likes)
- Use database connection pooling (PgBouncer)
- Read replicas for feed queries

**When to address:** Query latency > 500ms or DB CPU consistently high

---

## Media Storage & Delivery

**Current:** Direct Supabase Storage URLs.

**Concern:** No CDN, no responsive images, bandwidth costs grow linearly.

**Solutions at scale:**
- CDN (Cloudflare, CloudFront) in front of storage
- Generate multiple image sizes on upload (thumbnail, medium, full)
- Lazy-load off-screen images
- Video: Use Mux or similar for adaptive streaming

**When to address:** Before launch if expecting viral growth, otherwise when bandwidth costs spike

**Related tickets:** 039 (Image CDN), 040 (Video Hosting)

---

## Database Connection Limits

**Current:** Direct Supabase connections from client.

**Concern:** Supabase free/pro tiers have connection limits. Each app instance holds connections.

**Solutions at scale:**
- Use Supabase connection pooler (Supavisor)
- Implement proper connection cleanup
- Consider Edge Functions for high-volume operations

**When to address:** Connection errors in logs, or nearing plan limits

---

## Real-time Updates

**Current:** No real-time. User must refresh to see new likes/posts.

**Concern:** Not a scale issue, but UX issue that gets worse at scale (more activity = more stale data).

**Solutions:**
- Supabase Realtime for live like counts
- Polling every 30s for new posts (cheaper than websockets)
- Push notifications for important updates

**When to address:** User feedback requests it, or engagement metrics show drop-off

---

## Rate Limiting

**Current:** No rate limiting on likes, posts, or API calls.

**Concern:** Spam, abuse, runaway costs from bad actors.

**Solutions:**
- Supabase RLS with rate limit functions
- Edge Function middleware for rate limiting
- Captcha on post creation after N posts/day

**When to address:** Before launch (Ticket 049)

**Related tickets:** 049 (Upload & Rate Limits)

---

## Search & Discovery

**Current:** No search functionality.

**Concern:** As content grows, users need to find specific pets/posts.

**Solutions:**
- Postgres full-text search (built-in, free)
- Algolia/Meilisearch for advanced search (paid)
- Tag-based discovery (already have tags)

**When to address:** When user feedback requests it

**Related tickets:** 027 (Search & Explore)

---

## Analytics & Monitoring

**Current:** No observability.

**Concern:** Can't identify bottlenecks or errors at scale.

**Solutions:**
- PostHog for product analytics (Ticket 037)
- Sentry for error tracking
- Supabase dashboard for DB metrics
- Custom logging for critical paths

**When to address:** Before launch

**Related tickets:** 037 (Analytics Integration)

---

## Cron Job Reliability

**Current:** Cron jobs planned but not implemented (Tickets 032-034).

**Concern:** Need reliable execution for hot score decay, content expiration, leaderboards.

**Solutions:**
- Supabase pg_cron extension
- External: GitHub Actions, Railway cron, Vercel cron
- Queue-based with retry logic

**When to address:** When implementing cron tickets

**Related tickets:** 032, 033, 034

---

## Adding New Concerns

When you identify a new scale consideration:
1. Add a section with: Current state, Concern, Solutions, When to address
2. Link related tickets if they exist
3. Update this doc as solutions are implemented

---

*Last updated: 2026-01-31*
