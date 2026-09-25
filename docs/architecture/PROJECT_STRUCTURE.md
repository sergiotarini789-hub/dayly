# Dayly Intended Project Structure

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md), [`ENGINEERING_RULES.md`](ENGINEERING_RULES.md)

> This is an intended repository layout for future implementation. It is documentation only; no application directories, source files, migrations, or dependencies are created in PHASE 0E.

## 1. Structure decision

Dayly will use a hybrid **App Router + feature-oriented domain/application** structure:

- `src/app` owns Next.js route composition and route-level metadata/loading/error boundaries.
- `src/features` owns feature-facing UI composition and feature-specific interaction components.
- `src/domain` owns pure domain concepts and rules.
- `src/server` owns application services, repositories, persistence adapters, and server-only orchestration.
- `src/integrations` owns provider adapters and normalization boundaries.
- `src/components` owns genuinely shared presentation components, not feature business logic.
- `src/lib` owns small cross-cutting utilities with no hidden feature ownership.
- `tests` mirrors domain/application/component/e2e/contract boundaries.
- `docs` remains the source of architectural and product decisions.

The structure avoids both extremes: a route-only codebase with business logic in pages, and a framework-agnostic abstraction maze before the first feature exists.

## 2. Intended repository tree

```text
/
├── docs/
│   ├── product/
│   ├── ux/
│   ├── architecture/
│   └── decisions/
├── public/
│   └── static assets only
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── layout and public routes
│   │   ├── (app)/
│   │   │   ├── today/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── calendar/
│   │   │   ├── habits/
│   │   │   ├── focus/
│   │   │   ├── analytics/
│   │   │   ├── search/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   └── v1/ future Route Handlers/webhooks only
│   │   ├── layout.tsx
│   │   ├── loading.tsx / error.tsx where route-appropriate
│   │   └── globals.css
│   ├── features/
│   │   ├── today/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── calendar/
│   │   ├── habits/
│   │   ├── focus/
│   │   ├── analytics/
│   │   ├── search/
│   │   ├── notifications/
│   │   └── users/
│   ├── components/
│   │   ├── ui/
│   │   ├── navigation/
│   │   ├── forms/
│   │   ├── feedback/
│   │   └── overlays/
│   ├── domain/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── calendar/
│   │   ├── habits/
│   │   ├── focus/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   ├── search/
│   │   ├── integrations/
│   │   └── users/
│   ├── server/
│   │   ├── application/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── calendar/
│   │   │   ├── habits/
│   │   │   ├── focus/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   ├── search/
│   │   │   ├── integrations/
│   │   │   └── users/
│   │   ├── repositories/
│   │   │   ├── postgres/
│   │   │   └── in-memory/ test adapters where useful
│   │   ├── db/
│   │   │   ├── client/ server-only clients
│   │   │   ├── mappers/
│   │   │   └── transactions/
│   │   ├── auth/
│   │   ├── jobs/ future workers only
│   │   └── observability/
│   ├── integrations/
│   │   ├── calendar/
│   │   │   ├── contract/
│   │   │   ├── google/
│   │   │   ├── apple/
│   │   │   └── outlook/
│   │   ├── nutritrack/
│   │   └── shared/
│   └── lib/
│       ├── validation/
│       ├── dates/
│       ├── ids/
│       ├── result/
│       └── config/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── component/
│   ├── e2e/
│   ├── contract/
│   ├── fixtures/
│   └── helpers/
├── supabase/
│   ├── migrations/ future reviewed migrations only
│   └── seed/ future development/reference seed only
├── .env.example
├── .env.local ignored and developer-specific
├── next.config.*
├── package.json
├── tsconfig.json
└── test/build configuration files
```

The tree is a target, not a reason to create empty directories before implementation.

## 3. Directory responsibilities

### 3.1 `src/app`

- Defines route/layout boundaries for the App Router.
- Composes feature UI and calls server-side application boundaries.
- Owns route-level loading, error, metadata, and not-found handling.
- Does not contain repository queries, provider SDK calls, or domain rule implementations.

### 3.2 `src/features`

- Organizes user-facing feature composition around the approved UX modules.
- Contains feature components, form models, view-specific adapters, and client interaction composition.
- May call typed application services through approved server boundaries.
- Does not own database persistence or cross-feature business rules.

### 3.3 `src/domain`

- Contains entities/value semantics, pure rules, domain errors, and module ports where necessary.
- Has no imports from React, Next.js, Supabase, provider SDKs, browser APIs, or environment configuration.
- Is unit-testable without a database or network.

### 3.4 `src/server/application`

- Contains named use cases and query services.
- Resolves actor/authorization context, validates DTOs, coordinates repositories, and maps errors.
- Is the public server-side entry boundary for feature operations.
- Does not become a generic “utils” folder or hide provider-specific branches.

### 3.5 `src/server/repositories` and `src/server/db`

- Own PostgreSQL/Supabase implementation and record mapping.
- Keep server-only clients and service-role access isolated.
- Expose repository interfaces to application services.
- Do not return raw Supabase response types to the presentation layer.

### 3.6 `src/integrations`

- Implements provider adapters only after the relevant provider contract and security review.
- Normalizes provider data, maps errors, handles provider pagination/cursors, and declares capabilities.
- Does not mutate core records without application-service authorization and ownership checks.

### 3.7 `src/components`

- Contains shared presentational patterns: navigation, UI primitives, forms, feedback, and overlays.
- Must remain domain-light. A reusable `TaskRow` may accept a typed view model, but must not query Tasks itself.

### 3.8 `src/lib`

- Contains narrow cross-cutting helpers such as date/time formatting, validation setup, ID handling, Result types, and configuration parsing.
- A helper belongs here only if it has no feature-specific ownership.

### 3.9 `tests`

Tests are organized by behavior and layer. A test may use a fixture/helper but must not import private production internals merely to assert implementation shape.

## 4. Import/dependency rules

Allowed direction:

```text
app → features/components → application services → domain ports
                                      ↓
                              repositories/integrations
```

Rules:

- Domain never imports `app`, `features`, `components`, `server`, or provider SDKs.
- Features never import repository implementations or Supabase clients.
- Components never import feature repositories or perform data fetching as a hidden side effect.
- Integrations never import another provider adapter's internals.
- Analytics consumes read/query ports and does not mutate source domains.
- Shared utilities cannot import feature modules.
- Use explicit public module interfaces; do not reach through another module's private files.
- Circular dependencies fail review even if the language/compiler can resolve them.

## 5. Naming and file rules

- Name modules after product concepts, not provider brands.
- Use `*.server.*` or an equivalent server-only boundary where framework conventions require it.
- Keep client components explicitly marked and small.
- Use `*.schema.*` for runtime validation schemas, `*.dto.*` for transport shapes, `*.repository.*` for persistence boundaries, and `*.service.*` for use cases when those suffixes improve discovery.
- Avoid files named `utils.ts` or `helpers.ts` without a narrow ownership qualifier.
- Co-locate a feature's user-facing tests where helpful, while keeping cross-layer tests under `tests/`.

## 6. Future migration/configuration locations

- Supabase migrations belong under `supabase/migrations` only after a later implementation phase.
- Seed/reference scripts belong under `supabase/seed` and must declare whether data is development, test, or production reference data.
- Environment templates remain at the repository root; values never belong in source.
- Generated types are generated into an explicitly ignored/generated location and are not hand-edited.

## 7. Structure decisions deferred

- Whether every feature uses a separate package boundary.
- Whether background jobs live in this repository or a separate worker repository.
- Exact route-group names and public/authenticated route split.
- Exact Supabase generated-type location and generation command.
- Whether integration adapters are deployed with the web app or a worker.

These do not change the domain and ownership contracts.
