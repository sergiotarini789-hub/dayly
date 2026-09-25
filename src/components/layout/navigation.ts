export type AppNavigationId =
  | "today"
  | "tasks"
  | "projects"
  | "calendar"
  | "habits"
  | "focus"
  | "analytics"
  | "search"
  | "settings";

export interface AppNavigationItem {
  readonly id: AppNavigationId;
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly description: string;
}

export const APP_NAVIGATION_ITEMS = [
  { id: "today", label: "Today", href: "/today", icon: "◷", description: "Current day overview" },
  { id: "tasks", label: "Tasks", href: "/tasks", icon: "✓", description: "Actionable work" },
  { id: "projects", label: "Projects", href: "/projects", icon: "▣", description: "Outcome-oriented work" },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: "▦", description: "Time and commitments" },
  { id: "habits", label: "Habits", href: "/habits", icon: "↻", description: "Recurring behaviors" },
  { id: "focus", label: "Focus", href: "/focus", icon: "◉", description: "Intentional work sessions" },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "▥", description: "Derived evidence" },
  { id: "search", label: "Search", href: "/search", icon: "⌕", description: "Find across Dayly" },
  { id: "settings", label: "Settings", href: "/settings", icon: "⚙", description: "Preferences and account" },
] as const satisfies readonly AppNavigationItem[];

export const MOBILE_PRIMARY_NAVIGATION_IDS = ["today", "tasks", "focus", "calendar"] as const satisfies readonly AppNavigationId[];

export function isMobilePrimaryNavigationItem(item: AppNavigationItem): boolean {
  return MOBILE_PRIMARY_NAVIGATION_IDS.includes(item.id as (typeof MOBILE_PRIMARY_NAVIGATION_IDS)[number]);
}
