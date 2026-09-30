"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppTopBar, ApplicationShell } from "@/components/layout";
import type { AppNavigationId } from "@/components/layout/navigation";

const ROUTES: Record<string, { id: AppNavigationId; title: string }> = {
  "/": { id: "today", title: "Today" },
  "/today": { id: "today", title: "Today" },
  "/tasks": { id: "tasks", title: "Tasks" },
  "/projects": { id: "projects", title: "Projects" },
  "/calendar": { id: "calendar", title: "Calendar" },
  "/habits": { id: "habits", title: "Habits" },
  "/focus": { id: "focus", title: "Focus" },
  "/analytics": { id: "analytics", title: "Analytics" },
  "/search": { id: "search", title: "Search" },
  "/settings": { id: "settings", title: "Settings" },
};

export function ProductApplicationFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = ROUTES[pathname];
  if (!route) return children;

  return (
    <ApplicationShell
      className="dayly-product-shell"
      initialActiveNavigationId={route.id}
      topBar={<AppTopBar title={route.title} aria-label={`${route.title} application bar`} right={<Link className="dayly-product-top-link" href="/onboarding" prefetch>Personalize</Link>} />}
    >
      {children}
    </ApplicationShell>
  );
}
