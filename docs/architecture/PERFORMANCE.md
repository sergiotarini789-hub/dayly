# Dayly Performance Contract

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md), [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md), [`OBSERVABILITY.md`](OBSERVABILITY.md)

> This document defines performance priorities and measurement rules. It does not implement caching, indexes, UI, or performance tooling.

## 1. Performance goals

Dayly should feel fast for daily actions without making unsupported numeric promises before a baseline exists. The performance contract prioritizes:

1. quick orientation to Today;
2. fast task capture/completion;
3. responsive scheduling and Focus controls;
4. predictable list/search/analytics behavior as data grows;
5. graceful loading and partial failure;
6. limited client JavaScript and unnecessary network round trips.

Initial numeric budgets should be established from representative devices, network profiles, and real query measurements during implementation. A number is not a goal until the measurement method, percentile, route, and environment are specified.

## 2. Rendering strategy

- Use Server Components for initial read-oriented page content and Today composition by default.
- Keep Client Components at the smallest interactive boundary.
- Stream or independently load non-critical sections when it improves orientation without creating confusing reordering.
- Use route-level loading states and skeletons that preserve hierarchy.
- Lazy-load heavy, secondary analytics visualization or future provider UI.
- Avoid fetching data from the browser when the server can render it securely in the same request boundary.
- Do not make Today wait on an optional NutriTrack or external calendar provider.

## 3. Database/query performance

- Use the access patterns and index strategy in [`DATA_CONSTRAINTS.md`](DATA_CONSTRAINTS.md).
- Bound every list query with filters, deterministic sort, and a limit/cursor.
- Avoid N+1 repository calls; use explicit query methods or bounded joins/projections.
- Keep Today queries compositional and measurable; do not load every historical record to render a day.
- Use date ranges and User ownership constraints in query predicates.
- Keep analytics periods bounded and disclose when data is partial.
- Use transactions only for atomic writes; do not wrap unrelated read work in long transactions.
- Measure query plans and slow queries before adding denormalized caches.

## 4. Pagination and large data

- Use cursor pagination for Tasks, Notifications, Focus history, Search, and any growing list.
- Use bounded time-range queries for Calendar and Habit history.
- Enforce server-side maximum page/range sizes.
- Do not load an unbounded recurrence, external event history, or notification archive.
- Use stable ordering and opaque cursors that cannot cross User scopes.
- Provide accessible loading/next-page behavior rather than infinite scroll as the only navigation path.

## 5. Client performance

- Keep initial client JavaScript focused on the current interaction.
- Avoid a global state library unless a measured cross-route requirement exists.
- Do not make every row a Client Component for convenience.
- Debounce/cancel search input requests and avoid duplicate mutation submissions.
- Use optimistic UI only for actions with safe rollback, such as a clearly reversible local completion; never show optimistic external sync success.
- Keep Focus timer display client-local while reconciling against server/session timestamps.
- Defer secondary charts, command palette data, and future integration details until requested.

## 6. Caching strategy

| Layer | Default behavior | Isolation/freshness rule |
|---|---|---|
| Browser | Cache static assets and safe UI resources | Never cache private response data across Users. |
| Next.js/server rendering | Use route/query revalidation only where user scope and invalidation are clear | Private data must be User-scoped; mutation invalidates affected views. |
| Application | Use short-lived memoization/query cache only for bounded read work | Include User, period, filter, and source freshness in the key. |
| Database | Use indexes and measured query plans | Source records remain authoritative. |
| External provider | Respect provider cache/cursor rules | Label stale state; provider data is never assumed current without a successful sync. |

Cache invalidation is part of each application service's mutation contract. A cache must be rebuildable and must not become an editable source.

## 7. Integration performance

- Prefer incremental sync over repeated full sync after provider capability is verified.
- Batch bounded reads/writes only when ownership/idempotency remains safe.
- Coalesce duplicate refresh requests per connection.
- Respect provider rate limits and retry-after guidance.
- Keep sync work out of interactive HTTP requests when it can exceed request expectations.
- Show last successful sync and queued/running state instead of blocking a Today page on provider response.

## 8. Responsive performance

- Mobile receives the same primary hierarchy with less data and interaction overhead.
- Avoid desktop-only multi-column payloads on narrow screens.
- Keep Calendar day view usable before loading broader Week/Month data.
- Use responsive images/static assets appropriately once UI exists.
- Respect reduced motion and low-power/network conditions.

## 9. Measurement plan

Before setting hard targets, measure:

- first response/render and interactive readiness for Today, Tasks, Calendar, and Search;
- task creation/completion mutation latency;
- database query duration and slow-query distribution;
- client JS transfer/hydration for mobile and desktop;
- cache hit/stale rates;
- integration sync duration and queue age;
- error/timeout rates by route/use case.

Metrics and correlation rules are defined in [`OBSERVABILITY.md`](OBSERVABILITY.md). Performance review must use representative realistic data, not only an empty database.

## 10. Performance failure behavior

- A slow optional integration must not block Dayly-owned Today content.
- A slow analytics query uses a bounded/loading state and does not block task execution.
- Database/provider timeouts become safe errors with retry/recovery, not infinite spinners.
- Large result sets are paginated rather than truncated silently.
- A cache miss is slower, not a permission bypass.

## 11. Phase boundary

No performance budget tool, cache, index, lazy-loading implementation, benchmark, or application code was created.
