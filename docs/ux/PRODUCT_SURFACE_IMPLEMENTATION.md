# Dayly Product Surface Implementation

**Phase:** 1G — Product experience & motion pass
**Status:** Completed
**Scope:** Frontend-only, in-memory preview
**Source of truth:** [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md), [`SCREEN_MAP.md`](SCREEN_MAP.md), [`USER_FLOWS.md`](USER_FLOWS.md), and [`UX_PRINCIPLES.md`](UX_PRINCIPLES.md)

> This document records the bounded PHASE 1F product surface and its incremental PHASE 1G experience pass. It does not authorize persistence, backend services, authentication, integrations, or PHASE 1H work.

## Routes and responsibilities

| Route | Responsibility | State boundary |
|---|---|---|
| `/` | Product launch route; renders Today. | Local React state only. |
| `/today` | Explicit Today destination; renders the same Today experience as `/`. | Local React state only. |
| `/onboarding` | Focused first-use setup: welcome, planning context, optional profile, and optional first task. | Local React state only; completion navigates to Today without persistence. |
| `/showcase` | Development-only design-system reference. | Separate from product-facing workflow. |

## Onboarding behavior

The flow is intentionally short and follows the approved first-launch sequence:

```text
Welcome
  ↓ Continue
Planning context
  ↓ Continue
Optional profile / display name
  ↓ Continue
First task or Do this later
  ↓ Go to Today
Today first-use state
```

Time zone, typical availability, planning style, display name, and the first task remain in component state for the current preview session. There is no account, save request, API, database record, integration permission, or persistence claim. Every step has a visible progress cue, a back path, and a clear optionality explanation where appropriate.

## Today behavior

Today is composed as one daily decision surface rather than a dashboard of unrelated cards:

- date and local context orientation;
- a next-useful-step prompt;
- quick capture with title-only task creation;
- first-use empty state with one primary action and an onboarding path;
- in-memory open and completed task states;
- explicit checkbox completion and reopen behavior;
- planning context, coming-next, and focus guidance that are visibly unconfigured rather than fabricated;
- status messaging that explains local preview behavior;
- a direct Next action with complete and in-page plan affordances;
- task-aware greeting context, time-of-day marker, explicit zero-progress copy, and open/completed task descriptions;
- non-blocking boot/readiness cue and task-entry feedback that remain local and removable under reduced motion.

No server loading, offline sync, provider permission, or remote error state is simulated because this phase has no remote boundary. The implemented states are first use/empty, populated, completion success, reopen, validation feedback for a missing title, local preview disclosure, and a short client-only preparation cue.

## Foundation and accessibility contract

The product routes reuse the existing `ApplicationShell`, responsive navigation, page/layout primitives, semantic controls, light/dark tokens, focus treatment, and reduced-motion foundation. Product-specific composition lives in [`src/components/product/`](../../src/components/product/) and styles live in [`src/styles/product.css`](../../src/styles/product.css).

The implementation preserves:

- one meaningful `h1` per product screen;
- native form controls with labels and descriptions;
- live status messaging for local actions;
- keyboard-operable buttons, links, radios, selects, and checkboxes;
- visible task completion and reopen actions;
- responsive desktop, tablet, and mobile composition without a dense empty-card grid;
- explicit temporary/local language wherever a user could otherwise infer persistence.

Validation is covered by [`src/components/product/product.test.tsx`](../../src/components/product/product.test.tsx), the existing component/layout tests, typecheck, production build, and `git diff --check`.

## Product visual redesign

The initial PHASE 1F dashboard-like composition was refined into the mobile-first editorial system documented in [`PRODUCT_VISUAL_SYSTEM.md`](PRODUCT_VISUAL_SYSTEM.md). Today now leads with greeting/context, one next useful action, progress, a low-chrome task plan, upcoming items, and supporting planning context. The redesign removes repeated elevated cards and heavy hero treatment, adds personalized session context from onboarding, refines the shared product shell and compact bottom navigation, and adds restrained entrance, completion, progress, and skeleton transitions while preserving reduced-motion behavior.

## PHASE 1G experience contract

PHASE 1G treats `/` and `/today` as the same personal daily companion surface and preserves the hierarchy: greeting/time context, next useful action, progress, Today tasks, upcoming, then supporting context. It extends the existing product CSS with reusable entrance, task-entry, completion, control, navigation, focus, success, safe-area, and reduced-motion behavior. Mobile remains the source composition; tablet and desktop add measure and breathing room without introducing a dashboard grid, oversized hero, gradients, decorative illustrations, or new domains.

All state remains frontend-only and session/in-memory. The onboarding query handoff is still cleaned from the URL, task changes remain disclosed as temporary, the navigation registry and interaction primitives are unchanged, and `/showcase` remains untouched.

## Deliberate non-goals

PHASE 1F/1G does not implement task records, scheduling, calendar data, habits, focus timers, analytics, settings persistence, authentication, database access, API routes, provider integrations, fake server behavior, or PHASE 1H work. Those boundaries remain governed by the product and architecture specifications.
