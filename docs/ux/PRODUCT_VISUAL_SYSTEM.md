# Dayly Product Visual System

**Phase:** 1F — Product visual redesign
**Status:** Implemented
**Scope:** Frontend-only product surface; no new product domains or persistence

This visual system supersedes the initial PHASE 1F dashboard-like composition. It keeps the existing tokens, shell, controls, motion foundations, and information architecture, but gives the real product surface a distinct mobile-first visual language. `/showcase` remains the development reference for the underlying system and is not the product visual target.

## 1. Visual principles

1. **Today is a quiet editorial surface.** Lead with context, one next action, progress, and only then supporting detail.
2. **Typography carries hierarchy.** Use scale, weight, measure, and whitespace before adding borders, badges, or containers.
3. **One focal moment per view.** The next useful action may have a soft tonal emphasis, but it should not become a dashboard hero card.
4. **Calm density.** Keep important information visible while allowing generous separation between decisions.
5. **Neutral first, accent second.** Use the existing primary color for focus, progress, selected navigation, and completion—not as a page-wide fill.
6. **Surfaces are structural, not decorative.** Prefer the page canvas, hairline separators, and tonal bands over card grids and shadows.
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

The default product surface is transparent on the page canvas. Use:

- hairline separators for task groups and supporting sections;
- one soft tonal focus lane for the next action;
- a quiet onboarding form surface without a floating card shell;
- subtle elevation only for existing overlays and the floating mobile navigation.

Avoid repeated bordered panels, badge clusters, shadowed cards, and large colored hero blocks.

## 6. Motion principles

- Page and section entrances use a short rise/fade with existing `--duration-fast` and `--ease-entrance`.
- Task completion uses a restrained row fade/strike transition and updates progress smoothly.
- Progress bars interpolate their width rather than using a spinner.
- Existing dialogs/drawers keep the shared overlay transitions.
- Buttons and navigation retain short press/hover feedback.
- `prefers-reduced-motion: reduce` disables product keyframes and leaves state changes immediate.

Motion communicates hierarchy or state change; it never delays a local action.

## 7. Mobile navigation strategy

At widths below the tablet breakpoint, Today uses the existing five-destination bottom navigation with a compact floating treatment: Today, Tasks, Calendar, Focus, and More. The bar is safe-area aware, keeps touch targets at the existing contract, and uses a quiet selected state. The desktop sidebar remains the same registry and information model, but the product shell removes unnecessary chrome and uses the same selected-state language.

## 8. Today information hierarchy

```text
Current context and greeting
  ↓
Next useful action
  ↓
Progress toward today
  ↓
Today's tasks and quick capture
  ↓
Upcoming commitments
  ↓
Planning context and session-only guidance
```

The first viewport must answer: where am I, what matters today, what should I do next, and how is the day progressing. Empty states should point to one useful action without making the user scan a collection of empty modules.
