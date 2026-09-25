# Dayly Layout System

**Phase:** 1D — Layout System & Application Shell
**Status:** In progress
**Implementation:** [`src/components/layout/`](../../src/components/layout/), [`src/styles/layout.css`](../../src/styles/layout.css)
**Showcase:** Development-only `/showcase`

## Scope and boundary

PHASE 1D establishes the application-level composition layer for Dayly. It provides the responsive shell, navigation frame, page containers, generic layout primitives, panel behavior, and structural foundations for future routes.

It deliberately does **not** implement Today, Tasks, Projects, Calendar functionality, Habits, Focus, Analytics, Search, Settings, authentication, database access, API routes, integrations, domain records, or business logic. The calendar foundation contains slots only; it does not render events, tasks, recurrence, drag/drop, or scheduling rules. PHASE 1E interaction and motion behavior is implemented in the shared UI/layout system and documented separately in [`INTERACTION_SYSTEM.md`](INTERACTION_SYSTEM.md).

## Application shell

`ApplicationShell` is the route-compatible composition boundary:

```text
ApplicationShell
├── skip-to-content link
├── shell frame
│   ├── responsive navigation
│   │   ├── desktop sidebar
│   │   └── mobile More surface/bottom navigation
│   └── shell content
│       ├── AppTopBar slot
│       └── main#dayly-main-content
└── safe-area-aware mobile navigation
```

The shell owns viewport height, the primary content scroll region, navigation placement, and breakpoint composition. It does not own records, data fetching, or feature state. A route supplies the `children` and can supply a generic `topBar` composition.

`AppTopBar` has explicit `left`, `center`, `right`, and `title` slots. This reserves space for future contextual controls without implementing notifications, profiles, search, or account behavior.

## Navigation

### One navigation registry

[`navigation.ts`](../../src/components/layout/navigation.ts) is the single source of truth for the approved nine destinations:

```text
Today · Tasks · Projects · Calendar · Habits · Focus · Analytics · Search · Settings
```

`ResponsiveNavigation` maps that registry into desktop, tablet, and mobile compositions. It does not duplicate labels, routes, or active-state logic.

Desktop/sidebar behavior:

- semantic `aside` and labelled `nav` landmarks;
- icon plus label for the expanded sidebar;
- active destination exposed with `aria-current="page"`;
- hover and focus-visible states from the token system;
- expanded/collapsed state with an accessible toggle;
- collapsed rail retains icon labels through accessible names and titles.

Mobile behavior:

- persistent primary destinations are Today, Tasks, Calendar, Focus, and More;
- Projects, Habits, Analytics, Search, and Settings are derived into the More surface;
- More uses the existing accessible dialog/focus foundation rather than a second overlay implementation;
- all destination links remain keyboard-focusable and have visible text labels;
- the bottom navigation reserves the device safe area.

### Tablet hybrid strategy

The approved breakpoints are used without new breakpoint values:

| Band | CSS behavior | Navigation rationale |
|---|---|---|
| Mobile: below `48rem` | No sidebar; fixed bottom navigation with five items; stacked page layouts. | Prioritizes frequent destinations and thumb reach instead of shrinking desktop navigation. |
| Tablet: `48rem` through below `64rem` | Landscape uses an icon rail; portrait uses the mobile bottom navigation model. | Landscape has enough width for persistent orientation but not a full labelled sidebar. Portrait preserves touch-first composition. |
| Desktop: `64rem` through below `90rem` | Expanded sidebar by default, with user-controlled collapse to an icon rail. | Persistent full navigation and list/detail compositions are readable. |
| Wide desktop: `90rem` and above | Desktop shell remains stable; content gutters increase and wide containers can use their approved max width. | Extra space improves reading and planning surfaces without stretching every panel. |

The static media-query lengths mirror the approved PHASE 1B breakpoint bridge so CSS and Tailwind utilities remain compatible.

## Page containers and headers

`PageContainer` supports semantic widths:

- `narrow` — comfortable reading and focused forms;
- `default` — standard application content;
- `wide` — productivity and multi-panel content;
- `full` — a consumer-owned full-bleed region.

The container can be centered or flow-aligned. Max widths live in layout tokens rather than in route components.

`PageHeader` provides generic `eyebrow`, `title`, `description`, `primaryActions`, `secondaryActions`, and children slots. On mobile it becomes a vertical composition and keeps actions reachable below the heading rather than relying on a horizontal squeeze.

`Section` and `SectionHeader` provide reusable orientation and action slots. They do not decide whether content represents a task, project, metric, event, or setting.

## Layout primitives

The composition API is intentionally small and composable:

| Primitive | Purpose |
|---|---|
| `Stack` | Vertical rhythm with small/medium/large token gaps. |
| `Cluster` | Wrapping inline controls and metadata. |
| `LayoutGrid` | Auto-fit generic grid for content of similar weight. |
| `TwoColumn` | Two equal flexible columns that stack on mobile. |
| `ThreeColumn` | Three flexible columns that become one column on mobile. |
| `SplitPane` | Unequal list/content regions with start/end side control. |
| `Panel` | Standard, elevated, or bordered generic surface; optional local scrolling/sticky behavior. |
| `DashboardGrid` | Responsive multi-column foundation with one-column mobile fallback. |
| `MasterDetail` | Generic list/detail structure that stacks on narrow screens. |
| `CalendarShell` | Header/body structural slots only. |
| `TimelineContainer` | Labelled, optionally bounded timeline region without temporal data semantics. |

Consumers compose children inside these primitives. There are no page-specific spacing props, feature-specific variants, domain records, or large configuration objects.

## Panel and scroll system

The shell uses one primary content scroll region:

1. the viewport is fixed to the application shell height;
2. the shell frame keeps navigation and top bar stable;
3. `main#dayly-main-content` owns page scrolling;
4. panels become local scroll containers only when `scrollable` is explicitly requested and the region is bounded;
5. timelines may opt into a bounded local scroll region because temporal axes need a stable header/body relationship;
6. mobile navigation is fixed and main content receives safe-area-aware bottom padding.

This avoids nested scrolling by default. `Panel[scrollable]` and `TimelineContainer[scrollable]` are structural escape hatches, not defaults for every card.

Sticky regions use normal grid/flex placement first. The top bar is stable through the shell row; sticky panels are opt-in and remain within their content context. Absolute positioning is limited to the skip link, safe-area navigation bar, and overlay-like navigation surface.

## Layout tokens

PHASE 1D adds only justified semantic layout tokens to [`tokens.css`](../../src/styles/tokens.css):

| Token | Purpose |
|---|---|
| `--layout-sidebar-width` | Expanded desktop sidebar width. |
| `--layout-sidebar-rail-width` | Collapsed desktop/tablet rail width. |
| `--layout-top-bar-height` | Shared top bar rhythm. |
| `--layout-mobile-navigation-height` | Bottom navigation control region. |
| `--layout-content-max-narrow` | Reading-width and focused panel ceiling. |
| `--layout-content-max-default` | Standard destination content ceiling. |
| `--layout-content-max-wide` | Multi-panel productivity content ceiling. |
| `--layout-page-gutter` | Default shell content gutter. |

The mobile gutter, wide-desktop gutter, control heights, spacing, colors, borders, layers, and motion continue to use existing PHASE 1B tokens.

## Accessibility

- `ApplicationShell` exposes a skip-to-content link before navigation.
- The shell provides `aside`, labelled `nav`, `header`, and `main` landmarks.
- Navigation state uses `aria-current="page"`; sidebar collapse uses `aria-expanded` and an accessible label.
- Collapsed and tablet rail labels remain available to assistive technology even when visually hidden.
- The mobile More surface reuses the tested dialog focus, Escape dismissal, and trigger focus restoration behavior.
- Native links and buttons preserve logical keyboard tab order. No destination is available only through hover, drag, swipe, or a pointer-only gesture.
- Focus-visible treatment comes from the PHASE 1B token foundation.
- The top bar and page header expose heading structure without depending on visual placement.
- Reduced motion disables shell scrolling animation and navigation transitions; component-level motion remains governed by the shared reduced-motion tokens.
- Status and hierarchy use text, landmarks, labels, surfaces, and structure in addition to color.

## Showcase

The development-only `/showcase` route now renders the application shell around representative layout content and the existing core component showcase. It demonstrates:

- expanded desktop sidebar and collapsible rail;
- tablet landscape rail and tablet portrait/mobile composition through CSS media queries;
- mobile bottom navigation and More destination surface;
- top bar slots;
- page header and semantic content widths;
- stack, cluster, grid, two-column, three-column, split-pane, dashboard grid, and panel variants;
- generic master/detail composition;
- calendar header/body and timeline structural slots;
- primary content scrolling, bounded panel scrolling, safe-area padding, light/dark themes, and reduced motion.

All labels and content are placeholders. The showcase does not create product routes, records, actions, persistence, or feature logic.

## Forbidden layout patterns

- Do not hardcode product pages, feature names, or entity fields into layout components.
- Do not create a second navigation definition for mobile, tablet, or desktop.
- Do not add arbitrary breakpoints or route-specific spacing values.
- Do not turn every panel into a nested scroll container.
- Do not couple shell state to domain data or query parameters.
- Do not use absolute positioning for primary page structure when grid/flex can solve it.
- Do not add layout framework dependencies for these primitives.
- Do not treat the layout showcase as a production dashboard.
- Do not start product functionality or PHASE 1F accessibility/UX hardening from this layer.
