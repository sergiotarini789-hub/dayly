"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui";
import {
  APP_NAVIGATION_ITEMS,
  isMobilePrimaryNavigationItem,
  type AppNavigationId,
  type AppNavigationItem,
} from "./navigation";

export interface ResponsiveNavigationProps {
  initialActiveId?: AppNavigationId;
  onNavigate?: (id: AppNavigationId) => void;
}

const DESKTOP_NAVIGATION_GROUPS: ReadonlyArray<{ label: string; ids: readonly AppNavigationId[] }> = [
  { label: "Start", ids: ["today"] },
  { label: "Plan", ids: ["tasks", "projects", "calendar", "habits"] },
  { label: "Focus", ids: ["focus"] },
  { label: "Review", ids: ["analytics"] },
  { label: "Tools", ids: ["search", "settings"] },
];

function NavigationLink({ item, active, pending, onSelect, compact = false }: { item: AppNavigationItem; active: boolean; pending: boolean; onSelect: (id: AppNavigationId) => void; compact?: boolean }) {
  return (
    <Link
      className="dayly-navigation-link"
      href={item.href}
      prefetch
      aria-current={active ? "page" : undefined}
      aria-label={compact ? `${item.label}: ${item.description}` : undefined}
      aria-busy={pending || undefined}
      title={compact ? item.label : undefined}
      data-active={active || undefined}
      data-pending={pending || undefined}
      onClick={(event) => {
        if (!active) onSelect(item.id);
        if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) event.preventDefault();
      }}
    >
      <span className="dayly-navigation-link__icon" aria-hidden="true">{item.icon}</span>
      <span className="dayly-navigation-link__label">{item.label}</span>
      {pending ? <span className="dayly-navigation-link__pending" aria-hidden="true" /> : null}
    </Link>
  );
}

export function ResponsiveNavigation({ initialActiveId = "today", onNavigate }: ResponsiveNavigationProps) {
  const [activeId, setActiveId] = React.useState<AppNavigationId>(initialActiveId);
  const [pendingId, setPendingId] = React.useState<AppNavigationId | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  function selectNavigationItem(id: AppNavigationId) {
    setActiveId(id);
    setPendingId(id);
    onNavigate?.(id);
  }

  const mobilePrimaryItems = APP_NAVIGATION_ITEMS.filter(isMobilePrimaryNavigationItem);
  const mobileMoreItems = APP_NAVIGATION_ITEMS.filter((item) => !isMobilePrimaryNavigationItem(item));

  return (
    <>
      <div className="dayly-navigation-progress" data-visible={pendingId !== null || undefined} aria-hidden="true"><span /></div>
      {pendingId ? <p className="dayly-visually-hidden" role="status" aria-live="polite">Opening {APP_NAVIGATION_ITEMS.find((item) => item.id === pendingId)?.label}</p> : null}
      <aside className="dayly-sidebar" data-collapsed={sidebarCollapsed || undefined} aria-label="Dayly application navigation">
        <div className="dayly-sidebar__brand">
          <Link href="/" prefetch aria-label="Dayly home">
            <span className="dayly-sidebar__mark" aria-hidden="true">D</span>
            <span className="dayly-sidebar__brand-label">Dayly</span>
          </Link>
        </div>
        <nav className="dayly-sidebar__nav" aria-label="Primary navigation">
          <div className="dayly-sidebar__nav-groups">
            {DESKTOP_NAVIGATION_GROUPS.map((group) => {
              const items = APP_NAVIGATION_ITEMS.filter((item) => group.ids.includes(item.id));
              return (
                <section className="dayly-sidebar__nav-group" key={group.label} aria-labelledby={`navigation-group-${group.label.toLowerCase()}`}>
                  <p className="dayly-sidebar__group-label" id={`navigation-group-${group.label.toLowerCase()}`}>{group.label}</p>
                  <ul>
                    {items.map((item) => <li key={item.id}><NavigationLink item={item} active={activeId === item.id} pending={pendingId === item.id} onSelect={selectNavigationItem} compact={sidebarCollapsed} /></li>)}
                  </ul>
                </section>
              );
            })}
          </div>
        </nav>
        <button
          className="dayly-sidebar__collapse"
          type="button"
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          onClick={() => setSidebarCollapsed((current) => !current)}
        >
          <span aria-hidden="true">{sidebarCollapsed ? "→" : "←"}</span>
          <span className="dayly-navigation-link__label">{sidebarCollapsed ? "Expand" : "Collapse"}</span>
        </button>
      </aside>

      <nav className="dayly-mobile-nav" aria-label="Mobile primary navigation">
        <ul>
          {mobilePrimaryItems.map((item) => (
            <li key={item.id}>
              <NavigationLink item={item} active={activeId === item.id} pending={pendingId === item.id} onSelect={selectNavigationItem} />
            </li>
          ))}
          <li>
            <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
              <DialogTrigger className="dayly-mobile-nav__trigger" aria-haspopup="dialog" aria-expanded={moreOpen}>
                <span className="dayly-navigation-link__icon" aria-hidden="true">⋯</span>
                <span className="dayly-navigation-link__label">More</span>
              </DialogTrigger>
              <DialogContent title="More navigation" description="Lower-frequency Dayly destinations." className="dayly-more-dialog">
                <nav aria-label="More navigation options">
                  <ul className="dayly-more-nav-list">
                    {mobileMoreItems.map((item) => (
                      <li key={item.id}>
                        <NavigationLink
                          item={item}
                          active={activeId === item.id}
                          pending={pendingId === item.id}
                          onSelect={(id) => {
                            selectNavigationItem(id);
                            setMoreOpen(false);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </>
  );
}
