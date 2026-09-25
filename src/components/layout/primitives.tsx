import * as React from "react";
import { cn } from "@/components/ui";

export type PageContainerWidth = "narrow" | "default" | "wide" | "full";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: PageContainerWidth;
  centered?: boolean;
}

export function PageContainer({ width = "default", centered = true, className, ...props }: PageContainerProps) {
  return <div {...props} className={cn("dayly-page-container", className)} data-width={width} data-centered={centered || undefined} />;
}

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, primaryActions, secondaryActions, className, children, ...props }: PageHeaderProps) {
  return (
    <header {...props} className={cn("dayly-page-header", className)}>
      <div className="dayly-page-header__copy">
        {eyebrow ? <div className="dayly-page-header__eyebrow">{eyebrow}</div> : null}
        <h1 className="dayly-page-header__title">{title}</h1>
        {description ? <p className="dayly-page-header__description">{description}</p> : null}
        {children}
      </div>
      {primaryActions || secondaryActions ? (
        <div className="dayly-page-header__actions">
          {secondaryActions ? <div className="dayly-page-header__secondary-actions">{secondaryActions}</div> : null}
          {primaryActions ? <div className="dayly-page-header__primary-actions">{primaryActions}</div> : null}
        </div>
      ) : null}
    </header>
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

export function Section({ as = "section", className, ...props }: SectionProps) {
  const Element = as;
  return <Element {...props} className={cn("dayly-layout-section", className)} />;
}

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function SectionHeader({ title, description, actions, className, ...props }: SectionHeaderProps) {
  return (
    <header {...props} className={cn("dayly-section-header", className)}>
      <div className="dayly-section-header__copy">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="dayly-section-header__actions">{actions}</div> : null}
    </header>
  );
}

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
}

export function Stack({ gap = "md", className, ...props }: LayoutProps) {
  return <div {...props} className={cn("dayly-layout-stack", className)} data-gap={gap} />;
}

export function Cluster({ gap = "sm", className, ...props }: LayoutProps) {
  return <div {...props} className={cn("dayly-layout-cluster", className)} data-gap={gap} />;
}

export function LayoutGrid({ gap = "md", className, ...props }: LayoutProps) {
  return <div {...props} className={cn("dayly-layout-grid", className)} data-gap={gap} />;
}

export function TwoColumn({ gap = "lg", className, ...props }: LayoutProps) {
  return <div {...props} className={cn("dayly-layout-two-column", className)} data-gap={gap} />;
}

export function ThreeColumn({ gap = "md", className, ...props }: LayoutProps) {
  return <div {...props} className={cn("dayly-layout-three-column", className)} data-gap={gap} />;
}

export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "start" | "end";
  gap?: "sm" | "md" | "lg";
}

export function SplitPane({ side = "start", gap = "md", className, ...props }: SplitPaneProps) {
  return <div {...props} className={cn("dayly-layout-split-pane", className)} data-side={side} data-gap={gap} />;
}

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "elevated" | "bordered";
  scrollable?: boolean;
  sticky?: boolean;
}

export function Panel({ variant = "standard", scrollable = false, sticky = false, className, ...props }: PanelProps) {
  return <div {...props} className={cn("dayly-panel", className)} data-variant={variant} data-scrollable={scrollable || undefined} data-sticky={sticky || undefined} />;
}

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
}

export function DashboardGrid({ gap = "md", className, ...props }: DashboardGridProps) {
  return <div {...props} className={cn("dayly-dashboard-grid", className)} data-gap={gap} />;
}

export interface MasterDetailProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  list: React.ReactNode;
  detail?: React.ReactNode;
  listLabel?: string;
  detailLabel?: string;
}

export function MasterDetail({ list, detail, listLabel = "List", detailLabel = "Detail", className, ...props }: MasterDetailProps) {
  return (
    <div {...props} className={cn("dayly-master-detail", className)} data-detail-present={detail ? "true" : undefined}>
      <section className="dayly-master-detail__list" aria-label={listLabel}>{list}</section>
      {detail ? <section className="dayly-master-detail__detail" aria-label={detailLabel}>{detail}</section> : null}
    </div>
  );
}

export interface MotionListProps extends React.HTMLAttributes<HTMLUListElement> {
  label?: string;
}

export function MotionList({ label, className, ...props }: MotionListProps) {
  return <ul {...props} className={cn("dayly-motion-list", className)} aria-label={label} />;
}

export interface MotionListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  motionState?: "enter" | "exit" | "move";
  selected?: boolean;
}

export function MotionListItem({ motionState, selected = false, className, ...props }: MotionListItemProps) {
  return <li {...props} className={cn("dayly-motion-list__item", className)} data-motion-state={motionState} data-selected={selected || undefined} aria-current={selected ? "true" : undefined} />;
}

export interface CalendarShellProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  body: React.ReactNode;
}

export function CalendarShell({ header, body, className, ...props }: CalendarShellProps) {
  return (
    <div {...props} className={cn("dayly-calendar-shell", className)}>
      {header ? <header className="dayly-calendar-shell__header">{header}</header> : null}
      <div className="dayly-calendar-shell__body">{body}</div>
    </div>
  );
}

export interface TimelineContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  scrollable?: boolean;
}

export function TimelineContainer({ label = "Timeline", scrollable = true, className, ...props }: TimelineContainerProps) {
  return <div {...props} className={cn("dayly-timeline-container", className)} data-scrollable={scrollable || undefined} role="region" aria-label={label} />;
}

export interface AppTopBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  title?: React.ReactNode;
}

export function AppTopBar({ left, center, right, title, className, ...props }: AppTopBarProps) {
  return (
    <header {...props} className={cn("dayly-top-bar", className)}>
      <div className="dayly-top-bar__slot dayly-top-bar__slot--left">{left}</div>
      <div className="dayly-top-bar__slot dayly-top-bar__slot--center">{center ?? (title ? <span className="dayly-top-bar__title">{title}</span> : null)}</div>
      <div className="dayly-top-bar__slot dayly-top-bar__slot--right">{right}</div>
    </header>
  );
}
