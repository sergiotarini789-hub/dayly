"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppTopBar, ApplicationShell, PageContainer } from "@/components/layout";
import type { AppNavigationId } from "@/components/layout/navigation";

const ROUTE_META: Record<string, { id: AppNavigationId; title: string; eyebrow: string; lines: number }> = {
  "/": { id: "today", title: "Today", eyebrow: "Your day, taking shape", lines: 4 },
  "/today": { id: "today", title: "Today", eyebrow: "Your day, taking shape", lines: 4 },
  "/tasks": { id: "tasks", title: "Tasks", eyebrow: "Make room for what matters", lines: 5 },
  "/projects": { id: "projects", title: "Projects", eyebrow: "Keep outcomes in view", lines: 3 },
  "/calendar": { id: "calendar", title: "Calendar", eyebrow: "See the shape of the day", lines: 4 },
  "/habits": { id: "habits", title: "Habits", eyebrow: "Build a rhythm, not a score", lines: 3 },
  "/focus": { id: "focus", title: "Focus", eyebrow: "A quieter mode", lines: 2 },
  "/analytics": { id: "analytics", title: "Analytics", eyebrow: "Learn from the pattern", lines: 3 },
  "/search": { id: "search", title: "Search", eyebrow: "Find your way back in", lines: 2 },
  "/settings": { id: "settings", title: "Settings", eyebrow: "Make the space fit", lines: 3 },
};

function getRouteMeta(pathname: string | null) {
  if (pathname?.startsWith("/onboarding")) return null;
  return ROUTE_META[pathname ?? "/"] ?? ROUTE_META["/"];
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`dayly-route-skeleton__block${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}

function ProductLoadingSkeleton({ meta }: { meta: NonNullable<ReturnType<typeof getRouteMeta>> }) {
  return (
    <ApplicationShell
      className="dayly-product-shell dayly-product-shell--loading"
      initialActiveNavigationId={meta.id}
      topBar={<AppTopBar title={meta.title} aria-label={`${meta.title} loading bar`} />}
    >
      <div className={`dayly-surface-page dayly-surface-page--${meta.id} dayly-route-loading`} aria-busy="true" aria-label={`Loading ${meta.title}`}>
        <PageContainer width="wide">
          <div className="dayly-route-loading__heading">
            <SkeletonBlock className="dayly-route-skeleton__eyebrow" />
            <SkeletonBlock className="dayly-route-skeleton__title" />
            <SkeletonBlock className="dayly-route-skeleton__description" />
          </div>
          <div className="dayly-route-loading__workspace">
            <div className="dayly-route-loading__primary">
              <SkeletonBlock className="dayly-route-skeleton__rule" />
              {Array.from({ length: meta.lines }, (_, index) => <SkeletonBlock key={index} className={index === 0 ? "dayly-route-skeleton__feature" : "dayly-route-skeleton__row"} />)}
            </div>
            <aside className="dayly-route-loading__rail" aria-hidden="true">
              <SkeletonBlock className="dayly-route-skeleton__rail-title" />
              <SkeletonBlock className="dayly-route-skeleton__rail-copy" />
              <SkeletonBlock className="dayly-route-skeleton__rail-copy dayly-route-skeleton__rail-copy--short" />
            </aside>
          </div>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}

function OnboardingLoadingSkeleton() {
  return (
    <main className="dayly-onboarding dayly-route-loading dayly-route-loading--onboarding" aria-busy="true" aria-label="Loading onboarding">
      <div className="dayly-onboarding__shell">
        <header className="dayly-onboarding__topbar"><SkeletonBlock className="dayly-route-skeleton__brand" /><SkeletonBlock className="dayly-route-skeleton__back" /></header>
        <div className="dayly-onboarding__layout">
          <section className="dayly-route-loading__onboarding-intro"><SkeletonBlock className="dayly-route-skeleton__eyebrow" /><SkeletonBlock className="dayly-route-skeleton__onboarding-title" /><SkeletonBlock className="dayly-route-skeleton__description" /></section>
          <section className="dayly-route-loading__onboarding-form"><SkeletonBlock className="dayly-route-skeleton__rule" /><SkeletonBlock className="dayly-route-skeleton__feature" /><SkeletonBlock className="dayly-route-skeleton__row" /><SkeletonBlock className="dayly-route-skeleton__action" /></section>
        </div>
      </div>
    </main>
  );
}

export function ProductRouteLoading() {
  const pathname = usePathname();
  const meta = getRouteMeta(pathname);
  return meta ? <ProductLoadingSkeleton meta={meta} /> : <OnboardingLoadingSkeleton />;
}
