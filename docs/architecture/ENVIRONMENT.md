# Dayly Environment and Configuration Contract

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`SECURITY_MODEL.md`](SECURITY_MODEL.md), [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md), [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md)

> This document defines future configuration behavior. It does not create environment files, add credentials, initialize a framework, or implement configuration loading.

## 1. Environment files

### `.env.local`

- Developer-specific local values.
- Must be ignored by Git and never committed.
- May contain local Supabase/provider credentials for approved development use.
- Must not be copied into issue descriptions, logs, screenshots, or test artifacts.

### `.env.example`

- Committed template containing variable names, safe descriptions, and placeholder values only.
- Must never contain real tokens, private keys, refresh tokens, service-role keys, or production values.
- Must be updated when a required variable is introduced or removed.
- Should distinguish public, server-only, and secret variables.

### Staging and production

- Values are supplied by the deployment/secret manager, not committed files.
- Staging and production use separate Supabase projects, provider apps, callback URLs, credentials, and data.
- Production secrets are not reused in local/staging environments.

## 2. Variable classes

### Public runtime configuration

Safe for browser exposure only when the value is not a secret and the feature explicitly requires it. Typical examples:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_ENVIRONMENT
```

Even a public Supabase key does not bypass RLS and must not be treated as a secret substitute.

### Server-only configuration

Available only in server/application/integration boundaries:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
AUTH_SERVER_CONFIGURATION
INTEGRATION_CLIENT_CONFIGURATION
WEBHOOK_VERIFICATION_CONFIGURATION
```

Exact names are subject to implementation/provider review. Server-only variables must never be imported into client modules.

### Secret configuration

Examples include:

```text
OAUTH_CLIENT_SECRET
INTEGRATION_ENCRYPTION_KEY
WEBHOOK_SIGNING_SECRET
PROVIDER_REFRESH_TOKEN_STORAGE_KEY
```

The actual values belong in managed secret storage or encrypted server-side storage, not in `.env.example`, source, or normal domain records.

## 3. Configuration loading rules

- Parse environment configuration once at a server-only boundary with runtime validation.
- Fail fast for required server configuration in the environment that needs it.
- Allow optional provider configuration to remain disabled without breaking the Dayly core.
- Do not read secrets from `process.env` inside arbitrary UI/components.
- Expose a typed configuration object rather than scattered string lookups.
- Do not log configuration values; at most log safe presence/feature status.
- Validate URLs, environment names, time zones, feature flags, and numeric limits.
- Treat missing/invalid integration configuration as an unavailable capability, not as a reason to fabricate a healthy connection.

## 4. Environment responsibilities

| Environment | Purpose | Data/integrations |
|---|---|---|
| Local development | Individual development and unit/component work | Local or dedicated Supabase project; mocked/provider sandbox integrations only. |
| CI | Repeatable lint/typecheck/test/build validation | Ephemeral/test configuration; no production secrets. |
| Preview | Review a branch/PR behavior | Isolated or controlled staging data; external callbacks disabled or sandboxed unless explicitly approved. |
| Staging | Integration and release validation | Dedicated staging Supabase/provider apps and test accounts. |
| Production | Real user workloads | Production project, managed secrets, monitoring, approved provider applications. |

## 5. Callback and URL configuration

Future auth/integration callbacks must use environment-specific allowlisted URLs. No wildcard callback or localhost URL belongs in production configuration. Provider configuration must distinguish authentication callbacks from calendar/NutriTrack data callbacks.

## 6. Secret lifecycle

- Provision secrets through the approved secret manager.
- Rotate/revoke on compromise, personnel/role change, provider policy, or scheduled review.
- Avoid storing long-lived tokens when a short-lived/revocable mechanism is available.
- Remove retired variables after dependent code is removed and environments are verified.
- Document ownership and recovery for encryption/signing keys before production use.

## 7. Local development defaults

Local development should be able to run core documentation/validation/unit work without external provider credentials. Integration features should be disabled, mocked, or sandboxed explicitly. A missing optional provider variable must not make Tasks or Today unusable.

## 8. Phase boundary

No `.env.local`, provider credential, secret manager configuration, framework configuration, or application code was created.
