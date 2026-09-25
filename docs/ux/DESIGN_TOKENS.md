# Dayly Design Token Foundation

**Phase:** 1B — Design Tokens & Theme Foundation
**Status:** Foundation implemented; consumed by PHASE 1C and PHASE 1D
**Implementation:** [`src/styles/tokens.css`](../../src/styles/tokens.css)
**Validation:** [`src/lib/design-system/validate-tokens.mjs`](../../src/lib/design-system/validate-tokens.mjs)

This document is the implementation contract for the conceptual architecture defined in PHASE 1A. The token foundation contains no application screens, feature components, business logic, or feature-specific styling.

## 1. Token architecture

Dayly uses three layers:

```text
Primitive tokens
      ↓
Semantic tokens
      ↓
Future component tokens
```

### 1.1 Primitive tokens

Primitive values live in `src/styles/tokens.css` under names such as:

```text
--primitive-color-neutral-50
--primitive-color-indigo-600
--primitive-font-size-body
--primitive-space-4
--primitive-radius-md
--primitive-shadow-sm
--primitive-duration-fast
--primitive-breakpoint-tablet
--primitive-z-modal
```

They describe raw palette, typography, spacing, shape, elevation, motion, responsive, and layer values. Future feature components should not consume them directly.

### 1.2 Semantic runtime tokens

Semantic tokens describe meaning and are exposed as CSS custom properties:

```text
--color-background
--color-surface
--color-surface-elevated
--color-text-primary
--color-text-secondary
--color-text-muted
--color-border
--color-primary
--color-success
--color-warning
--color-danger
--color-info
--color-focus
```

Theme values are held by private `--dayly-*` backing variables and surfaced through the public semantic aliases. This keeps the runtime theme layer separate from the Tailwind `@theme inline` bridge without recursive custom-property references.

### 1.3 Component tokens

The PHASE 1B foundation remains feature-neutral, while PHASE 1C core components and PHASE 1D layout primitives consume its semantic contract. A component or layout relationship may introduce a token only if an existing semantic token cannot express it. For example, the application shell uses `--layout-sidebar-width` and `--layout-content-max-default` for reusable structure; it must not introduce page-specific spacing or feature-specific hex values.

Component tokens must:

- map to semantic tokens wherever possible;
- describe a reusable relationship rather than a one-off visual adjustment;
- remain local to the component contract;
- avoid duplicating semantic meanings or creating feature palettes.

## 2. CSS runtime and theme selection

The runtime stylesheet is `src/styles/tokens.css`. It:

1. imports Tailwind CSS v4;
2. defines primitive values;
3. maps primitive values into semantic light-theme backing values;
4. provides explicit dark-theme values through `html[data-theme="dark"]`;
5. provides an independent dark mapping from `prefers-color-scheme: dark` when no explicit theme is set;
6. exposes semantic names to Tailwind through `@theme inline`;
7. provides the shared `dark:` variant through `@custom-variant dark`;
8. declares the global focus-visible token treatment and reduced-motion overrides.

Theme behavior is therefore:

```text
Tailwind utility
      ↓
@theme inline semantic name
      ↓
--dayly-* semantic backing variable
      ↓
light or dark theme value
      ↓
primitive value
```

The system preference is the default. Future user preference storage can set `data-theme="light"` or `data-theme="dark"` without changing component styles.

## 3. Color tokens

### 3.1 Neutral and surface tokens

| Token | Light direction | Dark direction |
|---|---|---|
| `background` | Slate 50 reading canvas | Slate 950 charcoal/ink canvas |
| `surface` | White primary surface | Slate 900 surface |
| `surface-elevated` | White with elevation | Slate 800 elevated surface |
| `surface-hover` | Slate 100 | Slate 700 |
| `surface-selected` | Indigo 50 | Indigo 900 |
| `border` | Slate 300 | Slate 700 |
| `border-subtle` | Slate 200 | Slate 800 |
| `border-strong` | Slate 400 | Slate 500 |
| `text-primary` | Slate 900 | Slate 50 |
| `text-secondary` | Slate 700 | Slate 200 |
| `text-muted` | Slate 600 | Slate 400 |
| `text-disabled` | Slate 500 | Slate 500 |

Public names are `--color-background`, `--color-surface`, `--color-surface-elevated`, `--color-surface-hover`, `--color-surface-selected`, `--color-border`, `--color-border-subtle`, `--color-border-strong`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, and `--color-text-disabled`.

### 3.2 Brand and semantic state tokens

The implemented brand direction is restrained blue-indigo:

```text
--color-primary
--color-primary-hover
--color-primary-active
--color-primary-subtle
--color-primary-foreground
```

State tokens are available in the same structure where a foreground or subtle surface is needed:

```text
--color-success
--color-success-subtle
--color-success-foreground
--color-warning
--color-warning-subtle
--color-warning-foreground
--color-danger
--color-danger-subtle
--color-danger-foreground
--color-info
--color-info-subtle
--color-info-foreground
--color-focus
```

Light and dark values are selected independently. Dark semantic accents use lighter, lower-saturation foregrounds and darker subtle surfaces; they are not inverted light values.

### 3.3 Productivity tokens

The foundation defines semantic base, subtle, and foreground tokens for:

```text
--color-task
--color-scheduled-task
--color-calendar-event
--color-external-event
--color-habit
--color-focus
--color-overdue
--color-completed
```

Each also has `-subtle` and `-foreground` forms. They are intentionally paired with labels, icons, geometry, patterns, or source markers. Color is never the only signal for ownership, completion, overdue state, external provenance, or Focus.

### 3.4 Chart/data visualization tokens

The future analytics palette is exposed as `--color-chart-1` through `--color-chart-8`, with independent light and dark values. Chart use must also provide:

- a legend or direct series label;
- order, marker, line style, pattern, or text alternatives where color alone would be ambiguous;
- a period and definition for derived values;
- enough contrast against the theme surface.

These tokens do not create charts or select a charting library. The final chart language remains a future UX/product decision.

## 4. Typography

The implementation uses a platform-first interface stack so Dayly has no font download or dependency requirement during the foundation phase:

```text
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Numeric and timer contexts may use:

```text
ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace
```

This is a deliberate baseline rather than a branded web-font commitment. A future font choice can replace the primitive family token without changing semantic type names.

| Token | Size | Line height | Intended use |
|---|---:|---:|---|
| `display` | 32px | 1.15 | Restrained date/context orientation |
| `h1` | 28px | 1.25 | Page heading |
| `h2` | 22px | 1.25 | Section heading |
| `h3` | 18px | 1.25 | Local heading |
| `body` | 16px | 1.5 | Primary reading text and item titles |
| `body-small` | 14px | 1.5 | Supporting content |
| `label` | 14px | 1.35 | Controls, tabs, state/source labels |
| `caption` | 12px | 1.4 | Dense metadata that remains accessible |
| `numeric` | 24px | 1.25 | Timer/count context with a unit or label |

Weight tokens are `regular` 400, `medium` 500, and `semibold` 600. Letter spacing is near-normal; labels and captions use only a small positive adjustment. The scale avoids oversized dashboard headings and tiny metadata.

## 5. Spacing

The implementation uses a 4px composable rhythm:

| Token | Value | Typical relationship |
|---|---:|---|
| `space-0` | 0px | Reset/no gap |
| `space-1` | 4px | Icon/label or tight metadata gap |
| `space-2` | 8px | Compact control/row gap |
| `space-3` | 12px | Related content gap |
| `space-4` | 16px | Standard padding and field gap |
| `space-5` | 20px | Comfortable local grouping |
| `space-6` | 24px | Section or panel interior gap |
| `space-8` | 32px | Page section gap |
| `space-10` | 40px | Large composition separation |
| `space-12` | 48px | Major orientation separation |
| `space-16` | 64px | Wide desktop composition space |

Tailwind utilities use the corresponding `spacing-*` bridge. Feature code should not introduce arbitrary spacing values when an existing token expresses the relationship.

## 6. Radius, borders, and elevation

### Radius

The implemented radius scale is:

```text
--radius-none = 0
--radius-sm   = 4px
--radius-md   = 8px
--radius-lg   = 12px
--radius-xl   = 16px
--radius-full = 9999px
```

`md` is the default for controls and moderate surfaces. `full` is primarily for badges and status markers, not every button. Calendar blocks retain functional rectangular geometry.

### Borders

```text
--border-width-hairline = 1px
--border-width-default  = 1px
--border-width-strong   = 2px
--color-border          = semantic default border
--color-border-subtle   = semantic low-contrast border
--color-border-strong   = semantic stronger boundary
```

Borders identify inputs, selected boundaries, focus-adjacent context, and meaningful separation. They do not outline every page region.

### Elevation

```text
--shadow-none
--shadow-sm
--shadow-md
--shadow-lg
--shadow-overlay
```

Surface color, contrast, spacing, and typography establish hierarchy first. Shadows are restrained and are reserved for raised panels, popovers, dialogs, and overlays. Dark theme shadows are independently reduced and use black alpha rather than a light-theme inversion.

## 7. Motion

Motion values implement the PHASE 1A categories:

| Token | Value | Use |
|---|---:|---|
| `instant` | 80ms | Immediate pressed/focus affordance |
| `fast` | 160ms | Hover, selection, small disclosure |
| `normal` | 240ms | Local content and ordinary layer transitions |
| `slow` | 360ms | Emphasis transitions only; not routine actions |

Easing tokens are:

```text
--ease-standard  = cubic-bezier(0.2, 0, 0, 1)
--ease-emphasized = cubic-bezier(0.2, 0.8, 0.2, 1)
--ease-entrance  = cubic-bezier(0, 0, 0.2, 1)
--ease-exit      = cubic-bezier(0.4, 0, 1, 1)
```

When `prefers-reduced-motion: reduce` is active, duration tokens become 1ms, easing becomes linear, and motion distances become zero. This preserves state transitions without decorative movement. Timer meaning remains textual and numeric.

## 8. Responsive and layer tokens

Responsive bands are intentionally few:

```text
--breakpoint-mobile  = 20rem (320px)
--breakpoint-tablet  = 48rem (768px)
--breakpoint-desktop = 64rem (1024px)
--breakpoint-wide    = 90rem (1440px)
```

They correspond to the approved mobile, tablet, desktop, and wide-desktop composition bands. They do not authorize a scaled-down desktop layout on mobile.

The PHASE 1D shell adds these semantic layout values:

```text
--layout-sidebar-width              = 16rem
--layout-sidebar-rail-width         = 4.5rem
--layout-top-bar-height             = 4rem
--layout-mobile-navigation-height   = 4rem
--layout-content-max-narrow         = 42rem
--layout-content-max-default        = 72rem
--layout-content-max-wide           = 90rem
--layout-page-gutter                = space-6
```

These values describe reusable shell/content relationships. Mobile gutters and safe-area padding remain responsive composition rules; they do not create additional breakpoints.

Layer values are:

```text
--z-base       = 0
--z-sticky     = 10
--z-navigation = 20
--z-dropdown   = 30
--z-popover    = 40
--z-modal      = 50
--z-toast      = 60
```

Future components consume these names rather than introducing arbitrary z-index values.

## 9. Focus, controls, and density

### Focus

The global foundation provides:

```text
--focus-ring-color
--focus-ring-width  = 3px
--focus-ring-offset = 2px
--focus-ring-inset  = 0px
```

The `:focus-visible` rule uses a visible outline in both themes. Focus is not dependent on hover or color alone and is used by the core components, application shell, layout primitives, and future controls.

### Control dimensions

These are semantic dimensions, not controls:

```text
--control-height-button       = 40px
--control-height-input        = 40px
--control-size-icon-button    = 40px
--control-size-touch-target   = 44px
--control-size-checkbox       = 20px
--control-width-switch        = 40px
--control-height-switch       = 24px
--control-height-select       = 40px
```

They provide desktop precision while preserving a 44px touch target for mobile interaction. Future controls must still provide labels, states, and keyboard behavior.

### Density foundation

The default is **focused**. The stylesheet defines foundation values for all three PHASE 1A concepts without exposing a user-selectable density preference:

```text
--density-compact-row-min-height      = 40px
--density-focused-row-min-height      = 44px
--density-comfortable-row-min-height  = 48px
--density-compact-control-height      = 36px
--density-focused-control-height      = 40px
--density-comfortable-control-height  = 44px
```

The default control aliases resolve to focused density. A future density setting requires a product decision and must preserve touch, focus, and large-text requirements.

## 10. Tailwind CSS v4 integration

`src/styles/tokens.css` uses the Tailwind v4 CSS-first model:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--dayly-color-background);
  --font-sans: var(--font-family-interface);
  --spacing-4: var(--space-4);
  --transition-duration-fast: var(--dayly-duration-fast);
}
```

This makes future semantic utilities available without a JavaScript Tailwind config or raw literals:

```text
bg-background
bg-surface
bg-surface-selected
text-text-primary
text-text-secondary
text-success
bg-task
border-border
rounded-md
shadow-overlay
duration-fast
mobile:...
dark:...
```

The public token names remain usable directly in CSS as well. The `dark:` variant is scoped to `[data-theme="dark"]`; system preference still controls the default CSS values when no explicit theme is set.

## 11. Governance

1. Feature components consume semantic tokens or semantic Tailwind utilities.
2. Raw color values are allowed only in the primitive palette and primitive shadow definitions.
3. Primitive tokens are not normally consumed directly by feature components.
4. New semantic tokens require a new product meaning and a validation/test update.
5. Component tokens require a demonstrated reusable local relationship.
6. Themes may override semantic backing values without changing component code.
7. Color, icon, pattern, label, or structure must be combined for state meaning; color is never sufficient by itself.
8. A token is not created merely to preserve an arbitrary one-off measurement.
9. Deprecated tokens need a migration note and are not silently repurposed.
10. Accessibility, contrast, reduced motion, localization, and responsive behavior are part of token review.

## 12. Validation

Run the dependency-free validator from the repository root:

```bash
node src/lib/design-system/validate-tokens.mjs
```

It verifies:

- required primitive and semantic tokens exist;
- explicit light and dark semantic backing values exist;
- the Tailwind v4 CSS-first bridge exists;
- system-theme and reduced-motion hooks exist;
- focus tokens exist;
- semantic names are not duplicated within the light token block;
- key text/foreground pairings meet a 4.5:1 WCAG AA contrast assumption and chart series meet a 3:1 graphical contrast assumption.

The validator is intentionally small and does not replace browser-level accessibility testing or a real Tailwind build once the application scaffold exists.

## 13. Phase boundary

PHASE 1B creates the shared visual foundation only. It does not create:

- buttons, inputs, switches, selects, dialogs, cards, rows, navigation, pages, charts, or other feature components;
- application screens or routes;
- task, Calendar, Habit, Focus, Dashboard, Analytics, authentication, persistence, API, integration, or business logic;
- a full user-selectable theme or density preference system;
- a charting library, icon library, font dependency, or other unnecessary dependency.

Future open decisions include whether a branded font, custom user themes, custom accent colors, user-customizable calendar colors, selectable density presets, or a final chart language should be added. None is required for this foundation.
