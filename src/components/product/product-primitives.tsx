"use client";

import * as React from "react";
import Link from "next/link";
import { AppTopBar, ApplicationShell, PageContainer, PageHeader, SectionHeader } from "@/components/layout";
import type { AppNavigationId } from "@/components/layout/navigation";
import { Badge, Button, Checkbox, Input } from "@/components/ui";

export interface ProductSurfaceProps {
  activeId: AppNavigationId;
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  topBarRight?: React.ReactNode;
}

const SURFACE_RAIL_CONTENT: Record<AppNavigationId, { label: string; title: string; copy: string; href: string; hrefLabel: string }> = {
  today: { label: "Workspace", title: "Start with what is next.", copy: "Today keeps the next useful move close, while the rest of the day can stay open.", href: "/today", hrefLabel: "Stay in Today →" },
  tasks: { label: "A useful boundary", title: "Capture before you organize.", copy: "A task only needs a clear title to earn a place. Detail can wait until it helps.", href: "/today", hrefLabel: "Open Today →" },
  projects: { label: "Direction", title: "Keep outcomes visible.", copy: "Projects hold a meaningful direction. Tasks remain the small moves that carry it forward.", href: "/tasks", hrefLabel: "See Tasks →" },
  calendar: { label: "Planning context", title: "Fixed time stays distinct.", copy: "Leave open space open until a commitment is real. Flexible work belongs in Today.", href: "/onboarding", hrefLabel: "Set a rhythm →" },
  habits: { label: "Keep it human", title: "Notice the rhythm.", copy: "A repeatable action is enough to begin. This space does not turn consistency into a score.", href: "/today", hrefLabel: "Return to Today →" },
  focus: { label: "A quieter mode", title: "One intention is enough.", copy: "Focus reduces the surface area of the day so the work in front of you can have your attention.", href: "/tasks", hrefLabel: "Choose from Tasks →" },
  analytics: { label: "Evidence", title: "Patterns, not pressure.", copy: "Useful summaries should come from real activity and improve the next decision. Nothing is invented here.", href: "/today", hrefLabel: "Make progress →" },
  search: { label: "Find your way back", title: "Search by the next step.", copy: "Names, outcomes, and useful words are easier to return to than a pile of filters.", href: "/tasks", hrefLabel: "Open Tasks →" },
  settings: { label: "Preview boundary", title: "The space stays yours.", copy: "Preferences apply to this session only. No account, integration, or persistent record is created.", href: "/onboarding", hrefLabel: "Revisit setup →" },
};

function SurfaceRail({ activeId }: { activeId: AppNavigationId }) {
  const content = SURFACE_RAIL_CONTENT[activeId];
  return (
    <aside className="dayly-surface-rail" aria-label={`${content.label} context`}>
      <p className="dayly-product-eyebrow">{content.label}</p>
      <h2>{content.title}</h2>
      <p>{content.copy}</p>
      <Link className="dayly-product-text-link" href={content.href}>{content.hrefLabel}</Link>
    </aside>
  );
}

export function ProductSurface({ activeId, title, eyebrow, description, children, className, topBarRight }: ProductSurfaceProps) {
  return (
    <ApplicationShell
      className="dayly-product-shell"
      initialActiveNavigationId={activeId}
      topBar={<AppTopBar title={title} aria-label={`${title} application bar`} right={topBarRight ?? <Link className="dayly-product-top-link" href="/onboarding">Personalize</Link>} />}
    >
      <div className={`dayly-surface-page dayly-surface-page--${activeId}${className ? ` ${className}` : ""}`} data-surface={activeId}>
        <PageContainer width="wide">
          <PageHeader eyebrow={eyebrow} title={title} description={description} />
          <div className={`dayly-surface-workspace dayly-surface-workspace--${activeId}`}>
            <div className="dayly-surface-primary">{children}</div>
            <SurfaceRail activeId={activeId} />
          </div>
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

export function TaskTrail({ tasks, onToggle, newTaskId }: { tasks: ProductTask[]; onToggle: (id: number, completed: boolean) => void; newTaskId?: number | null }) {
  return (
    <ol className="dayly-surface-task-trail" aria-label="Tasks">
      {tasks.map((task, index) => (
        <li className="dayly-surface-task-row" data-completed={task.completed || undefined} data-new={newTaskId === task.id || undefined} key={task.id}>
          <span className="dayly-surface-task-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <Checkbox label={task.title} description={task.completed ? "Moved today" : task.context ?? "Open · today"} checked={task.completed} onChange={(event) => onToggle(task.id, event.target.checked)} />
          <span className="dayly-surface-task-arrow" aria-hidden="true">→</span>
        </li>
      ))}
    </ol>
  );
}

export function AddTaskForm({ onAdd, label = "Add a task", buttonLabel = "Add" }: { onAdd: (title: string) => void; label?: string; buttonLabel?: string }) {
  const [value, setValue] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);
  function revealForm() {
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ block: "center", behavior: "auto" }));
  }
  React.useEffect(() => {
    const viewport = window.visualViewport;
    const keepVisible = () => {
      if (formRef.current?.contains(document.activeElement)) revealForm();
    };
    viewport?.addEventListener("resize", keepVisible);
    return () => viewport?.removeEventListener("resize", keepVisible);
  }, []);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
  }
  return (
    <form ref={formRef} className="dayly-surface-capture" onSubmit={submit}>
      <Input label={label} value={value} onChange={(event) => setValue(event.target.value)} onFocus={revealForm} autoComplete="off" enterKeyHint="done" placeholder="What needs to move forward?" />
      <Button type="submit" size="sm" variant="ghost" disabled={!value.trim()} aria-label={buttonLabel}>{buttonLabel}</Button>
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
  const [newTaskId, setNewTaskId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (newTaskId === null) return;
    const timeoutId = window.setTimeout(() => setNewTaskId(null), 520);
    return () => window.clearTimeout(timeoutId);
  }, [newTaskId]);

  function addTask(title: string) {
    const id = Date.now();
    setTasks((current) => [...current, { id, title, completed: false }]);
    setNewTaskId(id);
    setNotice(`“${title}” added for this preview session.`);
  }

  function toggleTask(id: number, completed: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed } : task));
    setNotice(completed ? "Task marked complete." : "Task reopened.");
  }

  return { tasks, notice, newTaskId, addTask, toggleTask };
}
