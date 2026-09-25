# Dayly Product Surface Implementation

**Phase:** 1F — Product-facing onboarding and Today preview
**Status:** Completed
**Scope:** Frontend-only, in-memory preview
**Source of truth:** [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md), [`SCREEN_MAP.md`](SCREEN_MAP.md), [`USER_FLOWS.md`](USER_FLOWS.md), and [`UX_PRINCIPLES.md`](UX_PRINCIPLES.md)

> This document records the bounded PHASE 1F implementation. It does not authorize persistence, backend services, authentication, integrations, or the next phase.

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
- status messaging that explains local preview behavior.

No server loading, offline sync, provider permission, or remote error state is simulated because this phase has no remote boundary. The implemented states are first use/empty, populated, completion success, validation feedback for a missing title, and local preview disclosure.

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

## Deliberate non-goals

PHASE 1F does not implement task records, scheduling, calendar data, habits, focus timers, analytics, settings persistence, authentication, database access, API routes, provider integrations, fake server behavior, or PHASE 1G work. Those boundaries remain governed by the product and architecture specifications.
