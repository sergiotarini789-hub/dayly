# Dayly Core Components

**Phase:** 1C — Core UI Component System
**Status:** In progress
**Implementation:** [`src/components/ui/`](../../src/components/ui/)
**Showcase:** [`src/showcase/ComponentShowcase.tsx`](../../src/showcase/ComponentShowcase.tsx), available at `/showcase` during development only

## Purpose and boundary

This document records the reusable, domain-agnostic component foundation delivered for PHASE 1C. Components consume the reviewed PHASE 1B token system and provide semantic structure, typed composition APIs, predictable states, and accessible interaction behavior.

The system does **not** contain Today, Tasks, Projects, Calendar, Habits, Focus, Analytics, Search, Settings, authentication, persistence, API calls, integrations, domain entities, or feature-specific business logic. PHASE 1D layout work is also outside this layer.

## Architecture

The implementation is intentionally split into small layers rather than a monolithic library:

| Layer | File | Responsibility |
|---|---|---|
| Shared utilities | [`utils.ts`](../../src/components/ui/utils.ts) | Class composition, controllable state, ref composition, Escape listeners, focus restoration, and focusable-element discovery. |
| Primitives | [`primitives.tsx`](../../src/components/ui/primitives.tsx) | Native controls, visual primitives, feedback states, navigation/data foundations, and form field associations. |
| Navigation compositions | [`navigation.tsx`](../../src/components/ui/navigation.tsx) | Tabs, collapsible disclosure, and accordion state/keyboard behavior. |
| Overlay compositions | [`overlays.tsx`](../../src/components/ui/overlays.tsx) | Dialog/sheet focus scope, popover, tooltip, menu, toast provider, and portal behavior. |
| Styles | [`components.css`](../../src/styles/components.css) | Token-driven component states, responsive adaptations, focus-visible treatment, and reduced-motion rules. |
| Public API | [`index.ts`](../../src/components/ui/index.ts) | Single barrel entry point for consumers. |
| Tests | `primitives.test.tsx`, `overlays.test.tsx` | User-observable RTL coverage for roles, names, state, keyboard interaction, focus, loading, errors, and dismissal. |

Components use `React.forwardRef` where a consumer needs to focus or measure the underlying control. Props extend the relevant React/HTML element props and add only semantic component options. Controlled and uncontrolled state are supported for stateful groups and overlays where useful.

## Implemented inventory

### Actions and form primitives

- `Button` — primary, secondary, ghost, outline, destructive, link, and icon variants; small/medium/large sizes; loading, disabled, full-width, and leading/trailing composition.
- `IconButton` — dedicated compact action API with a type-level accessible name requirement through `aria-label` or `aria-labelledby`; optional supplemental tooltip and loading state.
- `Input` and `SearchInput` — native inputs with labels, descriptions, errors, success messages, required state, loading state, and `aria-describedby`/`aria-invalid` association.
- `Textarea` — native multiline input with the same field messaging contract plus optional character-count presentation.
- `Select` — native select foundation with typed options, disabled options, field messaging, and native keyboard behavior.
- `Combobox` — searchable/filterable input/list foundation with selected and disabled options, loading and empty states, keyboard navigation, and an accessible listbox relationship.
- `Checkbox` — native checkbox semantics, optional indeterminate state, label/description/error association, and disabled support.
- `Switch` — native checkbox input exposed with switch semantics and the same field messaging contract.
- `RadioGroup` and `RadioItem` — native radio inputs with controlled/uncontrolled group state, vertical/horizontal presentation, and keyboard selection through browser semantics.

### Visual and status primitives

- `Badge` — neutral, primary, success, warning, danger, and info semantic variants.
- `Avatar` — image, initials, and fallback content with small/medium/large sizes.
- `Card` / `Surface` — composable surfaces with default, elevated, outlined, interactive, selected, and disabled states.
- `Separator` — semantic horizontal or vertical separator.
- `Progress` — determinate and indeterminate progress with an accessible label and optional visible value.
- `Spinner` — status-labelled loading indicator that can be marked decorative when paired with an existing accessible label.
- `Skeleton` — text, rectangular, avatar, and row placeholders with motion controlled by reduced-motion preferences.
- `Alert` — information, success, warning, and danger callouts with optional actions and dismissal.
- `EmptyState` and `ErrorState` — composable explanatory states with primary/recovery actions; they do not encode a product domain.

### Navigation and data foundations

- `Breadcrumbs` — semantic navigation trail with current item and bounded collapsed items.
- `Pagination` — labelled navigation with previous/next controls, current-page state, and bounded sibling pages.
- `Tabs` — labelled tablist/tab/tabpanel relationships, controlled/uncontrolled selection, horizontal/vertical orientation, disabled tabs, and arrow/Home/End keyboard navigation.
- `Collapsible` — button disclosure with `aria-expanded`, `aria-controls`, and hidden content semantics.
- `Accordion` — single or multiple disclosure modes using the same semantic disclosure pattern.
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` — presentational table foundation with optional caption and selected-row metadata. Sorting, pagination data fetching, column definitions, and domain logic remain consumer-owned.

### Overlays and transient feedback

- `Tooltip` — supplemental hover/focus help; it is never the only accessible name for an essential action.
- `Popover` — non-modal local content with trigger state, portal rendering, Escape dismissal, and focus return.
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, and `DropdownMenuSeparator` — menu roles, disabled items, keyboard movement, Escape dismissal, and explicit destructive styling.
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, and `DialogClose` — labelled modal semantics, initial focus, keyboard focus containment, Escape/scrim/close-button dismissal, and trigger focus restoration.
- `Drawer` / `DrawerContent` / `DrawerTrigger` / `DrawerClose` — dialog-based sheet foundation with bottom/left/right variants and responsive full-width/mobile behavior.
- `ToastProvider`, `useToast`, `ToastViewport`, and `Toast` — live-region announcements, semantic status/alert roles, optional action, six-second timeout, and explicit dismissal.

No date or time display primitive was added. The approved component inventory does not justify a generic formatter at this layer; date/time presentation will remain owned by a future domain-neutral consumer until a concrete need and format contract are approved.

## Shared contracts

### Semantic variants and states

Variants describe meaning rather than product entities. For example, `danger` communicates a recovery or consequence state, while `success` communicates completion. Every status also has text, structure, an action, or an accessible announcement; color is not the only signal.

Interactive controls expose native disabled semantics. Loading controls use `disabled`, `aria-busy`, and a layout-stable content wrapper. Errors use `aria-invalid`, an associated message, and `role="alert"` where immediate announcement is appropriate. Empty and error states keep a visible recovery path.

### Accessibility behavior

- Native buttons, links, inputs, selects, textareas, checkboxes, radios, tables, separators, and disclosure relationships are preferred over recreated semantics.
- Labels are associated with controls through generated or supplied IDs. Descriptions and errors are joined into `aria-describedby`.
- Icon-only actions require a type-level accessible name. Tooltip content is supplemental.
- Tabs, menus, listboxes, dialogs, and sheets expose roles, names, relationships, and state attributes.
- Dialogs and sheets dismiss with Escape, contain Tab focus while open, and restore focus to their trigger. Popovers and menus support Escape dismissal.
- Touch-sized controls, overflow-safe containers, and responsive sheet behavior are defined in token-driven CSS.
- Focus indicators use the PHASE 1B focus tokens and `:focus-visible`; no component uses color alone to communicate focus or status.

### Theme, motion, and responsive behavior

All component styling is in [`components.css`](../../src/styles/components.css) and consumes semantic or primitive variables from [`tokens.css`](../../src/styles/tokens.css). Components do not introduce raw colors, arbitrary spacing, or feature-specific values.

The implementation supports the light/dark token themes demonstrated in the showcase. Transitions and skeleton motion use the approved motion tokens and are disabled or minimized under `prefers-reduced-motion`. Mobile behavior is first-class: button rows wrap, form grids collapse, menus and sheets remain usable without hover, and wide table content can scroll without forcing page width.

## Development showcase

`/showcase` is a development-only route and is not product UI. It demonstrates:

- every major primitive and semantic variant;
- disabled, loading, success, warning, error, empty, and indeterminate states;
- native labels/descriptions and keyboard-oriented controls;
- tabs, collapsible/accordion, breadcrumbs, pagination, table, menus, popover, tooltip, dialog, drawer, and toast;
- light/dark theme switching;
- responsive wrapping and narrow-screen behavior;
- a visible scope boundary confirming the absence of domain logic.

The showcase imports the same barrel API as a product consumer, making accidental feature-specific coupling easier to detect.

## Validation

The PHASE 1C component validation set remains part of the PHASE 1E interaction-system validation:

```text
npm test
npm run typecheck
npm run build
```

The tests prioritize user-observable roles, accessible names, state attributes, keyboard movement, disabled behavior, form errors, focus handling, and overlay dismissal. The build validates the Next app and the development showcase route without Tailwind breakpoint optimizer warnings.
