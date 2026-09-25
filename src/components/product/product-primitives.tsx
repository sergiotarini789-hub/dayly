"use client";

import * as React from "react";
import Link from "next/link";
import { AppTopBar, ApplicationShell, PageContainer, PageHeader, SectionHeader } from "@/components/layout";
import { Badge, Button, Checkbox, Input } from "@/components/ui";
import type { AppNavigationId } from "@/components/layout/navigation";

export interface ProductSurfaceProps {
  activeId: AppNavigationId;
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  topBarRight?: React.ReactNode;
}

export function ProductSurface({ activeId, title, eyebrow, description, children, className, topBarRight }: ProductSurfaceProps) {
  return (
    <ApplicationShell
      className="dayly-product-shell"
      initialActiveNavigationId={activeId}
      topBar={<AppTopBar title={title} aria-label={`${title} application bar`} right={topBarRight ?? <Link className="dayly-product-top-link" href="/onboarding">Personalize</Link>} />}
    >
      <div className={`dayly-surface-page dayly-surface-page--${activeId}${className ? ` ${className}` : ""}`} data-surface={activeId}>
        <PageContainer width="default">
          <PageHeader eyebrow={eyebrow} title={title} description={description} />
          {children}
          <p className="dayly-product-disclosure">Preview session only · changes stay in memory and are not saved.</p>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}

export function SurfaceSection({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section {...props} className={`dayly-surface-section${className ? ` ${className}` : ""}`}>{children}</section>;
}

export function SurfaceSectionHeader({ title, description, actions, headingId, className, ...props }: React.ComponentProps<typeof SectionHeader>) {
  return <SectionHeader {...props} title={title} description={description} actions={actions} headingId={headingId} className={`dayly-surface-section__header${className ? ` ${className}` : ""}`} />;
}

export function SurfaceEmptyState({ eyebrow = "Nothing here yet", title, description, action, className, ...props }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`dayly-surface-empty${className ? ` ${className}` : ""}`}>
      <span className="dayly-surface-empty__mark" aria-hidden="true">—</span>
      <div className="dayly-surface-empty__copy">
        <p className="dayly-product-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        {action ? <div className="dayly-surface-empty__action">{action}</div> : null}
      </div>
    </div>
  );
}

export function SurfaceContextBlock({ label, title, children, className }: { label: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`dayly-surface-context${className ? ` ${className}` : ""}`}>
      <p className="dayly-product-eyebrow">{label}</p>
      <h2>{title}</h2>
      <div className="dayly-surface-context__body">{children}</div>
    </section>
  );
}

export interface ProductTask {
  id: number;
  title: string;
  completed: boolean;
  context?: string;
}

export function TaskTrail({ tasks, onToggle }: { tasks: ProductTask[]; onToggle: (id: number, completed: boolean) => void }) {
  return (
    <ol className="dayly-surface-task-trail" aria-label="Tasks">
      {tasks.map((task, index) => (
        <li className="dayly-surface-task-row" data-completed={task.completed || undefined} key={task.id}>
          <span className="dayly-surface-task-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <Checkbox label={task.title} description={task.completed ? "Completed" : task.context ?? "Open"} checked={task.completed} onChange={(event) => onToggle(task.id, event.target.checked)} />
          <span className="dayly-surface-task-arrow" aria-hidden="true">→</span>
        </li>
      ))}
    </ol>
  );
}

export function AddTaskForm({ onAdd, label = "Add a task", buttonLabel = "Add" }: { onAdd: (title: string) => void; label?: string; buttonLabel?: string }) {
  const [value, setValue] = React.useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
  }
  return (
    <form className="dayly-surface-capture" onSubmit={submit}>
      <Input label={label} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Something useful, in a few words" />
      <Button type="submit" size="sm" variant="ghost">{buttonLabel}</Button>
    </form>
  );
}

export function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="dayly-product-text-link" href={href}>{children}</Link>;
}

export function SurfaceBadge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: "neutral" | "primary" | "success" | "warning" | "info" }) {
  return <Badge variant={variant} size="sm">{children}</Badge>;
}

export function useProductTasks(initial: ProductTask[] = []) {
  const [tasks, setTasks] = React.useState<ProductTask[]>(initial);
  const [notice, setNotice] = React.useState("");

  function addTask(title: string) {
    setTasks((current) => [...current, { id: Date.now(), title, completed: false }]);
    setNotice(`“${title}” added for this preview session.`);
  }

  function toggleTask(id: number, completed: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed } : task));
    setNotice(completed ? "Task marked complete." : "Task reopened.");
  }

  return { tasks, notice, addTask, toggleTask };
}
