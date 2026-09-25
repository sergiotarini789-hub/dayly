import * as React from "react";
import { cn } from "@/components/ui";
import { AppTopBar } from "./primitives";
import { ResponsiveNavigation } from "./responsive-navigation";
import type { AppNavigationId } from "./navigation";

export interface ApplicationShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  initialActiveNavigationId?: AppNavigationId;
  topBar?: React.ReactNode;
  skipLinkLabel?: string;
}

export function ApplicationShell({ children, initialActiveNavigationId = "today", topBar, skipLinkLabel = "Skip to main content", className, ...props }: ApplicationShellProps) {
  return (
    <div {...props} className={cn("dayly-application-shell", className)}>
      <a className="dayly-skip-link" href="#dayly-main-content">{skipLinkLabel}</a>
      <div className="dayly-shell-frame">
        <ResponsiveNavigation initialActiveId={initialActiveNavigationId} />
        <div className="dayly-shell-content">
          {topBar ?? <AppTopBar title="Dayly" aria-label="Application top bar" />}
          <main className="dayly-shell-main" id="dayly-main-content" tabIndex={-1}>{children}</main>
        </div>
      </div>
    </div>
  );
}
