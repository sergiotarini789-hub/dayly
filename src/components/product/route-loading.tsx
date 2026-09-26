"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppTopBar, ApplicationShell, PageContainer } from "@/components/layout";
import type { AppNavigationId } from "@/components/layout/navigation";

const ROUTE_META: Record<string, { id: AppNavigationId; title: string; eyebrow: string }> = {
  "/": { id: "today", title: "Today", eyebrow: "Your day, taking shape" },
  "/today": { id: "today", title: "Today", eyebrow: "Your day, taking shape" },
  "/tasks": { id: "tasks", title: "Tasks", eyebrow: "Make room for what matters" },
  "/projects": { id: "projects", title: "Projects", eyebrow: "Keep outcomes in view" },
  "/calendar": { id: "calendar", title: "Calendar", eyebrow: "See the shape of the day" },
  "/habits": { id: "habits", title: "Habits", eyebrow: "Build a rhythm, not a score" },
  "/focus": { id: "focus", title: "Focus", eyebrow: "A quieter mode" },
  "/analytics": { id: "analytics", title: "Analytics", eyebrow: "Learn from the pattern" },
  "/search": { id: "search", title: "Search", eyebrow: "Find your way back in" },
  "/settings": { id: "settings", title: "Settings", eyebrow: "Make the space fit" },
};

function getRouteMeta(pathname: string | null) {
  if (pathname?.startsWith("/onboarding")) return null;
  return ROUTE_META[pathname ?? "/"] ?? ROUTE_META["/"];
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`dayly-route-skeleton__block${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}

function Rows({ count = 4 }: { count?: number }) {
  return <div className="dayly-route-skeleton__rows">{Array.from({ length: count }, (_, index) => <SkeletonBlock key={index} className="dayly-route-skeleton__row" />)}</div>;
}

function RouteSkeletonBody({ id }: { id: AppNavigationId }) {
  if (id === "today") return <><div className="dayly-route-skeleton__moment"><SkeletonBlock className="dayly-route-skeleton__moment-copy" /><SkeletonBlock className="dayly-route-skeleton__pulse" /></div><SkeletonBlock className="dayly-route-skeleton__feature dayly-route-skeleton__feature--today" /><Rows count={3} /></>;
  if (id === "tasks") return <><div className="dayly-route-skeleton__toolbar"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div><SkeletonBlock className="dayly-route-skeleton__capture" /><Rows count={5} /></>;
  if (id === "projects") return <><div className="dayly-route-skeleton__table-head"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div><Rows count={4} /><SkeletonBlock className="dayly-route-skeleton__capture" /></>;
  if (id === "calendar") return <><div className="dayly-route-skeleton__calendar-head"><SkeletonBlock /><SkeletonBlock /></div><div className="dayly-route-skeleton__calendar-grid">{Array.from({ length: 6 }, (_, index) => <SkeletonBlock key={index} />)}</div><Rows count={2} /></>;
  if (id === "habits") return <><SkeletonBlock className="dayly-route-skeleton__capture" /><Rows count={4} /></>;
  if (id === "focus") return <div className="dayly-route-skeleton__focus"><SkeletonBlock className="dayly-route-skeleton__focus-ring" /><SkeletonBlock className="dayly-route-skeleton__focus-title" /><SkeletonBlock className="dayly-route-skeleton__focus-action" /></div>;
  if (id === "analytics") return <><div className="dayly-route-skeleton__metrics">{Array.from({ length: 3 }, (_, index) => <SkeletonBlock key={index} />)}</div><SkeletonBlock className="dayly-route-skeleton__chart" /></>;
  if (id === "search") return <><SkeletonBlock className="dayly-route-skeleton__search" /><div className="dayly-route-skeleton__suggestions"><Rows count={3} /></div></>;
  if (id === "settings") return <div className="dayly-route-skeleton__settings">{Array.from({ length: 3 }, (_, group) => <div key={group}><SkeletonBlock className="dayly-route-skeleton__settings-title" /><Rows count={3} /></div>)}</div>;
  return <><SkeletonBlock className="dayly-route-skeleton__feature" /><Rows /></>;
}

function ProductLoadingSkeleton({ meta }: { meta: NonNullable<ReturnType<typeof getRouteMeta>> }) {
  return (
    <ApplicationShell className="dayly-product-shell dayly-product-shell--loading" initialActiveNavigationId={meta.id} topBar={<AppTopBar title={meta.title} aria-label={`${meta.title} loading bar`} />}>
      <div className={`dayly-surface-page dayly-surface-page--${meta.id} dayly-route-loading`} data-loading-route={meta.id} aria-busy="true" aria-label={`Loading ${meta.title}`}>
        <PageContainer width="wide">
          <div className="dayly-route-loading__heading"><SkeletonBlock className="dayly-route-skeleton__eyebrow" /><SkeletonBlock className="dayly-route-skeleton__title" /><SkeletonBlock className="dayly-route-skeleton__description" /></div>
          <div className="dayly-route-loading__workspace">
            <div className="dayly-route-loading__primary"><RouteSkeletonBody id={meta.id} /></div>
            <aside className="dayly-route-loading__rail" aria-hidden="true"><SkeletonBlock className="dayly-route-skeleton__rail-title" /><SkeletonBlock className="dayly-route-skeleton__rail-copy" /><SkeletonBlock className="dayly-route-skeleton__rail-copy dayly-route-skeleton__rail-copy--short" /><SkeletonBlock className="dayly-route-skeleton__rule" /><SkeletonBlock className="dayly-route-skeleton__rail-copy" /></aside>
          </div>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}

function OnboardingLoadingSkeleton() {
  return <main className="dayly-onboarding dayly-route-loading dayly-route-loading--onboarding" aria-busy="true" aria-label="Loading onboarding"><div className="dayly-onboarding__shell"><header className="dayly-onboarding__topbar"><SkeletonBlock className="dayly-route-skeleton__brand" /><SkeletonBlock className="dayly-route-skeleton__back" /></header><div className="dayly-onboarding__layout"><section className="dayly-route-loading__onboarding-intro"><SkeletonBlock className="dayly-route-skeleton__eyebrow" /><SkeletonBlock className="dayly-route-skeleton__onboarding-title" /><SkeletonBlock className="dayly-route-skeleton__description" /></section><section className="dayly-route-loading__onboarding-form"><SkeletonBlock className="dayly-route-skeleton__rule" /><SkeletonBlock className="dayly-route-skeleton__feature" /><SkeletonBlock className="dayly-route-skeleton__row" /><SkeletonBlock className="dayly-route-skeleton__action" /></section></div></div></main>;
}

export function ProductRouteLoading() {
  const pathname = usePathname();
  const meta = getRouteMeta(pathname);
  return meta ? <ProductLoadingSkeleton meta={meta} /> : <OnboardingLoadingSkeleton />;
}
