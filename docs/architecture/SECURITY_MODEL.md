# Dayly Security Model

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`AUTH_INTEGRATION_MODEL.md`](AUTH_INTEGRATION_MODEL.md), [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md), [`ENVIRONMENT.md`](ENVIRONMENT.md), [`API_CONVENTIONS.md`](API_CONVENTIONS.md)

> This document defines security requirements for future implementation. It does not implement authentication, RLS, OAuth, secrets, middleware, or application code.

## 1. Security principles

- Authentication proves identity. Authorization determines what the user may access or change.
- Every User-owned record is isolated by both application checks and database-enforced RLS.
- Sensitive values are collected, stored, logged, and displayed only when necessary.
- Server-only credentials never enter browser state or client bundles.
- Integration permissions are least-privilege and feature-specific.
- Security failures fail closed and produce safe, correlated errors.
- External data remains source-labeled and cannot silently mutate Dayly-owned records.
- Security controls are tested at unit, integration, end-to-end, and review boundaries.

## 2. Supabase Auth boundary

Supabase Auth is the approved future authentication platform, but implementation remains out of scope.

The eventual flow should:

1. establish an authenticated session through the approved Supabase Auth mechanism;
2. resolve the session to a stable Dayly User principal;
3. establish the actor context server-side;
4. apply application authorization for the requested use case;
5. rely on PostgreSQL/Supabase RLS as an additional isolation boundary.

Auth provider identity, Dayly User, Account Link, Session, and Integration Connection remain distinct as defined in [`AUTH_INTEGRATION_MODEL.md`](AUTH_INTEGRATION_MODEL.md).

The application must not treat an email address alone as a durable ownership mapping or grant calendar/NutriTrack access from an authentication event.

## 3. Authorization and RLS

### 3.1 Application authorization

Application services check:

- authenticated actor exists;
- actor maps to the requested Dayly User;
- resource belongs to that User or the future approved membership scope;
- action is allowed for the resource lifecycle/state;
- integration consent/scope exists before external reads/writes;
- destructive/export/conflict actions have explicit confirmation where required.

### 3.2 Row-Level Security

RLS should protect every client-accessible User-owned record, including:

- Tasks, Projects, Tags, Schedule Blocks, Calendar Events;
- Habits, Habit Occurrences, Focus Sessions;
- Reminders, Notifications, preferences, and availability;
- Integration Connections and cached external records;
- any persisted analytics/search/cache projections.

Policies must scope records to the authenticated Dayly User. Child records must validate ownership through their parent or direct owner. A service role, if needed for future jobs, is server-only, narrowly scoped, and never exposed to the browser.

RLS is not a replacement for application authorization, and application checks are not a replacement for RLS.

## 4. Secrets and environment security

- Keep refresh tokens, client secrets, service-role keys, webhook secrets, and encryption keys in server-only secret management.
- Never expose secrets through `NEXT_PUBLIC_*`, client components, URLs, logs, error messages, analytics, or generated DTOs.
- Validate required environment variables at server startup/use boundary.
- Use separate credentials and projects for local, staging, and production.
- Rotate/revoke credentials according to provider and incident policy.
- Do not commit `.env.local`, real values, dumps, private keys, or credentials.

See [`ENVIRONMENT.md`](ENVIRONMENT.md) for configuration classes.

## 5. Input validation and output safety

- Validate all external/user/provider input at the boundary with runtime schemas.
- Reject unknown high-risk fields instead of mass-assigning request objects.
- Bound text, list sizes, file/URL inputs, and provider payload sizes.
- Normalize IDs, dates, time zones, enums, and recurrence before domain use.
- React's default escaping is required for rendered text.
- Prevent XSS by rejecting unsafe markup/URL protocols, sanitizing approved rich text, and using context-appropriate output encoding.
- Do not render raw HTML, Markdown, or provider content without an explicit sanitization policy.
- Validate/sanitize URLs and link protocols before rendering or redirecting.
- Keep user-generated descriptions plain text initially unless a reviewed rich-text model exists.
- Encode output according to the context: HTML, URL, JSON, headers, or logs.

## 6. CSRF and browser security

Future cookie/session actions must:

- use appropriate SameSite, Secure, and HttpOnly attributes;
- validate Origin/Referer or CSRF tokens for state-changing cross-site-sensitive requests as appropriate;
- use Server Actions/Route Handlers in a way that preserves framework CSRF protections and adds explicit checks where required;
- reject unexpected content types and methods;
- avoid state changes on GET.

CORS should be deny-by-default and opened only for documented clients/routes. Security headers, Content Security Policy, and clickjacking protection should be configured during implementation.

## 7. OAuth and integration security

- Use provider-approved authorization code/server-side flows and PKCE/state/nonce where applicable.
- Allowlist redirect URIs and validate callback state before exchanging a code.
- Request least-privilege scopes and record consent/scope version.
- Keep access/refresh tokens in the secure server boundary.
- Verify provider identity before binding an Integration Connection to a User.
- Refresh/revoke tokens without exposing them to clients.
- Treat authentication provider identity as separate from data-provider authorization.
- Never log provider payloads/tokens unnecessarily.

## 8. Webhook security

Future provider webhooks must:

- verify signature/authentication before parsing or mutating state;
- validate timestamp/replay windows where the provider supports them;
- use constant-time comparison for signatures where relevant;
- enforce provider/resource/connection ownership;
- deduplicate event IDs/signals;
- enqueue a bounded sync/reconciliation instead of trusting webhook payloads as complete truth;
- return safe status codes without leaking diagnostics.

No webhook should mutate Dayly records directly without the integration application/sync boundary.

## 9. Rate limiting and abuse prevention

Apply rate limits appropriate to:

- authentication/session attempts;
- public/API requests;
- search and expensive analytics queries;
- task/event creation endpoints;
- integration connection/refresh/sync requests;
- webhook/reconciliation triggers.

Provider rate limits must be respected separately. Rate-limit responses reveal only safe retry guidance and never secret/provider internals.

## 10. Privacy and sensitive data

- Keep NutriTrack summaries minimized, consented, source-labeled, and User-isolated.
- Do not log detailed food diaries, health payloads, or private calendar descriptions unless a redacted diagnostic need is approved.
- Do not expose nutrition context through analytics or collaboration by default.
- Limit operator/support access and audit privileged access when implemented.
- Define export/deletion/disconnect treatment before retaining external cache data.
- Avoid collecting profile fields that do not serve a Dayly use case.

## 11. Auditability

Future audit/operational records should cover security-relevant events such as:

- account/link/session changes;
- permission/role changes if collaboration exists;
- integration connect, consent, refresh, revoke, disconnect;
- export/write/conflict decisions;
- destructive data deletion;
- privileged operational access.

Audit records must be append-oriented, User/connection scoped, redacted, and retained according to a future privacy policy. They are not a license to log all user content.

## 12. Security review checklist

Before implementation/release:

- authentication and authorization tests pass;
- RLS is tested for same-user, cross-user, anonymous, and service-role cases;
- no client bundle contains server secrets;
- validation exists at every trust boundary;
- CSRF/CORS/cookie/security headers are reviewed;
- OAuth callbacks and webhooks verify state/signatures;
- errors/logs are redacted;
- rate limits and abuse paths are considered;
- integration disconnect/revocation is safe;
- sensitive NutriTrack/calendar data is minimized;
- dependency and secret scanning are clean;
- threat model/incident response is documented for production.

## 13. Phase boundary

No auth provider, RLS policy, secret, security middleware, OAuth flow, webhook, dependency, migration, or application code was created.
