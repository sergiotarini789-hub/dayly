# Dayly Product Visual System

**Phase:** 1G — Product experience & motion
**Status:** Implemented
**Scope:** Frontend-only product surface; no new product domains or persistence

This visual system supersedes the initial PHASE 1F/1G dashboard-like composition and records the complete product presentation redesign. It keeps the existing tokens, shell contracts, controls, motion foundations, and navigation registry, while recomposing `/`, `/today`, and `/onboarding` as one calm, mobile-first personal daily companion. `/showcase` remains the development reference for the underlying system and is not the product visual target.

## 1. Visual principles

1. **Today is a quiet editorial surface.** Lead with context, one next action, progress, and only then supporting detail.
2. **Typography carries hierarchy.** Use scale, weight, measure, and whitespace before adding borders, badges, or containers.
3. **One focal moment per view.** The next useful action gets typographic emphasis and one restrained accent rule, never a dashboard hero card.
4. **Calm density.** Keep important information visible while allowing generous separation between decisions.
5. **Neutral first, accent second.** Use the existing primary color for focus, progress, selected navigation, and completion—not as a page-wide fill.
6. **Surfaces are structural, not decorative.** Prefer the page canvas, hairline separators, alignment, and rhythm over cards, grids, and shadows.
7. **Personal context is visible and honest.** Use onboarding/session values when present and label all preview-only state clearly.
8. **Mobile is the source composition.** Desktop adds measure and breathing room to the same hierarchy; it does not introduce an admin dashboard layout.

## 2. Typography scale

Use the existing semantic typography tokens with product-specific roles:

| Role | Token treatment | Use |
|---|---|---|
| Display greeting | `--font-size-display` with a responsive clamp | One Today greeting or onboarding title. |
| Section title | `--font-size-h2` | Plan, progress, upcoming, and setup sections. |
| Supporting title | `--font-size-h3` | Task group labels and small context headings. |
| Body | `--font-size-body` and `--font-size-body-small` | Explanatory copy and task metadata. |
| Eyebrow | `--font-size-caption`, semibold, tracked | Date, context, and section labels. |

Headlines use a tight measure and slightly negative tracking only for the display greeting. Body copy stays at the existing accessible line height.

## 3. Spacing system

Keep the existing 4px rhythm. Product composition uses:

- `--space-2` to `--space-3` for task rows and control groups;
- `--space-4` to `--space-6` for section separation and mobile page gutters;
- `--space-8` to `--space-12` for desktop breathing room and onboarding rhythm;
- safe-area-aware bottom padding wherever the mobile navigation is fixed.

Mobile sections should feel separated by whitespace and hairlines, not by stacked boxes. Desktop increases section gaps and measure without changing ordering.

## 4. Color and token strategy

Product styling consumes semantic tokens from `src/styles/tokens.css` only. The background and text remain neutral; `--color-primary` is reserved for the next action, progress, focus rings, and selected navigation. `--color-success` supports completion feedback, while warning/info colors remain contextual. No new raw color literals are introduced in product CSS. Light/dark themes inherit the same hierarchy, contrast, and accent restraint.

## 5. Surface and card strategy

The default Today surface is transparent on the page canvas. Use:

- hairline separators for the task list, progress line, and supporting context;
- one small accent rule and generous spacing to distinguish the next action;
- compact task rows with typography and alignment doing most of the work;
- a quiet onboarding form surface without a floating card shell;
- the existing mobile navigation as a lightweight safe-area bar, not a floating card.

Avoid repeated bordered panels, badge clusters, shadowed cards, gradients, and large colored hero blocks.

## 6. Motion principles

- The current moment and primary Today composition enter as two meaningful groups rather than animating every element independently.
- Task entry uses a short horizontal arrival; completion uses success feedback, a transformed/muted row, and a smoothly updated progress line.
- Progress interpolates through the existing primitive rather than introducing a loading widget.
- Onboarding step content changes use the same short entrance family; dialogs/drawers keep shared overlay transitions.
- Buttons, rows, and navigation retain short press, hover, and focus feedback.
- `prefers-reduced-motion: reduce` removes product keyframes and leaves state changes immediate.

Motion communicates hierarchy or state change; it never delays a local action.

### PHASE 1G motion and experience additions

- Boot readiness uses a small, non-blocking preparation cue; content remains usable without waiting on a fake remote state.
- Current moment and the primary Today flow use a restrained two-stage reveal from reusable product timing aliases.
- Task addition uses a short row arrival; completion uses a success transition, transformed/muted copy, and progress update through the existing semantic primitive.
- The next-action surface exposes a direct completion action and an in-page plan link through typography and one accent rule, not a widget shell.
- Time-of-day context uses existing semantic warning, focus, and info tokens for a small marker and accent treatment; it does not introduce gradients or a large hero.
- Onboarding, task rows, controls, and navigation continue using shared primitives, so focus, keyboard, touch-target, and reduced-motion behavior stays centralized.

## 7. Mobile navigation strategy

At widths below the tablet breakpoint, product routes use the existing five-destination bottom navigation as a flat, safe-area-aware bar: Today, Tasks, Focus, Calendar, and More. It keeps the existing touch-target contract, uses a quiet selected state, and never becomes a floating card. The desktop sidebar uses the same registry with small groups for Start, Plan, Focus, Review, and Tools; group labels disappear when the rail collapses.

## 8. Today information hierarchy

```text
Current context and greeting
  ↓
Next useful action
  ↓
Today's task rows and quick capture
  ↓
Quiet daily progress
  ↓
Upcoming commitments
  ↓
Planning context and session-only guidance
```

The first viewport must answer: where am I, what matters today, what should I do next, and how is the day progressing. Empty states should point to one useful action without making the user scan a collection of empty modules.
