"use client";

import * as React from "react";
import Link from "next/link";
import { AppTopBar, ApplicationShell, Cluster, PageContainer, SectionHeader } from "@/components/layout";
import { Button, Checkbox, Input, Progress } from "@/components/ui";

interface PreviewTask {
  id: number;
  title: string;
  completed: boolean;
}

interface PreviewSession {
  displayName: string;
  timeZone: string;
  availability: string;
  planningStyle: string;
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

const EMPTY_SESSION: PreviewSession = { displayName: "", timeZone: "", availability: "", planningStyle: "" };

const AVAILABILITY_LABELS: Record<string, string> = {
  standard: "A standard workday",
  flexible: "Flexible time",
  unknown: "Availability to be decided",
};

const PLANNING_STYLE_LABELS: Record<string, string> = {
  balanced: "Balanced planning",
  gentle: "A gentle start",
  deep: "Deep work first",
};

function formatToday(date: Date) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
}

function getTimeOfDay(date: Date): TimeOfDay {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function formatGreeting(date: Date, displayName: string) {
  const timeOfDay = getTimeOfDay(date);
  const salutation = timeOfDay === "morning" ? "Good morning" : timeOfDay === "afternoon" ? "Good afternoon" : timeOfDay === "evening" ? "Good evening" : "Good night";
  return displayName ? `${salutation}, ${displayName}` : salutation;
}

function formatDaySummary(taskCount: number, openTaskCount: number) {
  if (taskCount === 0) return "A small start is enough today.";
  if (openTaskCount === 0) return "You have moved everything planned today.";
  return `${openTaskCount} ${openTaskCount === 1 ? "thing" : "things"} worth moving forward today.`;
}

function readPreviewSession(params: URLSearchParams): PreviewSession {
  return {
    displayName: params.get("name")?.trim() ?? "",
    timeZone: params.get("timeZone")?.trim() ?? "",
    availability: params.get("availability")?.trim() ?? "",
    planningStyle: params.get("planningStyle")?.trim() ?? "",
  };
}

export function TodayExperience() {
  const [tasks, setTasks] = React.useState<PreviewTask[]>([]);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [notice, setNotice] = React.useState("Today is ready for your first useful step.");
  const [todayLabel, setTodayLabel] = React.useState("Today");
  const [timeLabel, setTimeLabel] = React.useState("");
  const [greeting, setGreeting] = React.useState("Good morning");
  const [timeOfDay, setTimeOfDay] = React.useState<TimeOfDay>("morning");
  const [session, setSession] = React.useState<PreviewSession>(EMPTY_SESSION);
  const [newTaskId, setNewTaskId] = React.useState<number | null>(null);
  const [isPreparing, setIsPreparing] = React.useState(true);

  React.useEffect(() => {
    const now = new Date();
    const params = new URLSearchParams(window.location.search);
    const nextSession = readPreviewSession(params);
    const firstTask = params.get("firstTask")?.trim();

    setTodayLabel(formatToday(now));
    setTimeLabel(formatTime(now));
    setTimeOfDay(getTimeOfDay(now));
    setGreeting(formatGreeting(now, nextSession.displayName));
    setSession(nextSession);
    if (firstTask) {
      const id = Date.now();
      setTasks([{ id, title: firstTask, completed: false }]);
      setNewTaskId(id);
      setNotice(`“${firstTask}” was added for this preview session. Changes remain in memory only.`);
    }
    setIsPreparing(false);
    if (window.location.search) window.history.replaceState(null, "", "/today");
  }, []);

  React.useEffect(() => {
    if (newTaskId === null) return;
    const timeoutId = window.setTimeout(() => setNewTaskId(null), 720);
    return () => window.clearTimeout(timeoutId);
  }, [newTaskId]);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) {
      setNotice("Add a short task title before saving.");
      return;
    }
    const id = Date.now();
    setTasks((current) => [...current, { id, title, completed: false }]);
    setNewTaskId(id);
    setTaskTitle("");
    setNotice(`“${title}” is part of today. This preview keeps changes in memory only.`);
  }

  function toggleTask(id: number, completed: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed } : task));
    setNotice(completed ? "Task marked complete for this preview session." : "Task reopened.");
  }

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const nextTask = openTasks[0];
  const sessionContext = session.availability ? AVAILABILITY_LABELS[session.availability] : "Planning context not set";
  const planningStyle = session.planningStyle ? PLANNING_STYLE_LABELS[session.planningStyle] : "Choose a pace that fits";
  const progressLabel = tasks.length === 0 ? "0 of 0 complete" : `${completedTasks.length} of ${tasks.length} complete`;
  const daySummary = formatDaySummary(tasks.length, openTasks.length);

  return (
    <ApplicationShell
      className="dayly-product-shell"
      initialActiveNavigationId="today"
      topBar={<AppTopBar title="Today" aria-label="Today application bar" right={<Link className="dayly-product-top-link" href="/onboarding">Personalize</Link>} />}
    >
      <div className="dayly-product-page" data-ready={!isPreparing || undefined} data-time-of-day={timeOfDay}>
        <PageContainer width="default">
          <header className="dayly-product-greeting">
            <div className="dayly-product-greeting__copy">
              <p className="dayly-product-eyebrow"><span className="dayly-product-time-mark" data-time-of-day={timeOfDay} aria-hidden="true" />{todayLabel}{timeLabel ? ` · ${timeLabel}` : ""}</p>
              <h1>{greeting}</h1>
              <p>{daySummary}</p>
            </div>
            <div className="dayly-product-context-line" aria-label="Planning context">
              {isPreparing ? <span className="dayly-product-skeleton dayly-product-skeleton--context" aria-hidden="true" /> : <><span>{sessionContext}</span><strong>{planningStyle}</strong></>}
            </div>
          </header>

          <div className="dayly-product-loading-cue" data-visible={isPreparing || undefined} role={isPreparing ? "status" : undefined} aria-live="polite">
            {isPreparing ? <><span className="dayly-product-skeleton dayly-product-skeleton--short" aria-hidden="true" /> <span>Preparing your day</span></> : null}
          </div>

          <section className="dayly-product-focus-lane" aria-labelledby="next-action-heading">
            <div className="dayly-product-focus-lane__copy">
              <p className="dayly-product-eyebrow">Next</p>
              <h2 id="next-action-heading">{nextTask?.title ?? "Choose one thing to move forward."}</h2>
              <p>{nextTask ? "A clear place to begin. The rest of the day can follow." : "Start with a task that can be captured in a few words. You can organize it later."}</p>
            </div>
            {nextTask ? <Cluster className="dayly-product-focus-lane__actions"><Button className="dayly-product-focus-lane__action" onClick={() => toggleTask(nextTask.id, true)}>Complete task</Button><Link className="dayly-product-text-link" href="#today-plan">Open in plan →</Link></Cluster> : <Link className="dayly-button dayly-product-focus-lane__action" data-variant="primary" href="#today-plan">Add first task</Link>}
          </section>

          <section className="dayly-product-progress" aria-labelledby="progress-heading">
            <SectionHeader headingId="progress-heading" title="Your progress" description={tasks.length === 0 ? "One useful action is enough to begin." : "A small, visible measure of what has moved."} actions={<strong className="dayly-product-progress__value">{progressLabel}</strong>} />
            <Progress value={completedTasks.length} max={Math.max(tasks.length, 1)} label={`Today progress: ${progressLabel}`} />
          </section>

          <section className="dayly-product-plan" id="today-plan" aria-labelledby="plan-heading">
            <div className="dayly-product-section-heading">
              <div>
                <p className="dayly-product-eyebrow">Today</p>
                <h2 id="plan-heading">What matters today</h2>
              </div>
              <span className="dayly-product-plan__count">{openTasks.length} {openTasks.length === 1 ? "open task" : "open tasks"}</span>
            </div>
            {tasks.length === 0 ? (
              <div className="dayly-product-empty" role="status">
                <span className="dayly-product-empty__marker" aria-hidden="true">01</span>
                <div>
                  <h3>Give the day a beginning.</h3>
                  <p>Your first task will become the next useful step, not another empty list to manage.</p>
                </div>
              </div>
            ) : (
              <div className="dayly-product-task-list" aria-label="Today tasks">
                {openTasks.map((task, index) => <div className="dayly-product-task-row" data-completed={task.completed || undefined} data-new={newTaskId === task.id || undefined} key={task.id}><span className="dayly-product-task-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><Checkbox label={task.title} checked={task.completed} onChange={(event) => toggleTask(task.id, event.target.checked)} description="Open · preview session" /></div>)}
                {completedTasks.length > 0 ? <><p className="dayly-product-list-label">Completed</p>{completedTasks.map((task, index) => <div className="dayly-product-task-row" data-completed="true" data-new={newTaskId === task.id || undefined} key={task.id}><span className="dayly-product-task-index" aria-hidden="true">{String(openTasks.length + index + 1).padStart(2, "0")}</span><Checkbox label={task.title} checked={task.completed} onChange={(event) => toggleTask(task.id, event.target.checked)} description="Completed · preview session" /></div>)}</> : null}
              </div>
            )}
            <form className="dayly-product-capture" onSubmit={addTask}>
              <Input id="today-task-title" label="Add a task" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Something useful, in a few words" />
              <Button type="submit">Add to Today</Button>
            </form>
            <p className="dayly-product-live-note" role="status" aria-live="polite">{notice}</p>
          </section>

          <div className="dayly-product-support-grid">
            <section className="dayly-product-support-section" aria-labelledby="upcoming-heading">
              <SectionHeader headingId="upcoming-heading" title="Coming up" description="Commitments will appear here when you add them." />
              <div className="dayly-product-quiet-state"><span aria-hidden="true">—</span><p>No upcoming commitments yet.</p></div>
            </section>
            <section className="dayly-product-support-section" aria-labelledby="context-heading">
              <SectionHeader headingId="context-heading" title="A day with room" description="Planning context helps the next step stay realistic." />
              <p className="dayly-product-context-copy">{session.availability ? `${sessionContext} · ${planningStyle}.` : "Set a little context when you are ready; Dayly will not assume you have unlimited time."}</p>
              <Link className="dayly-product-text-link" href="/onboarding">{session.availability ? "Adjust planning context" : "Set planning context"}</Link>
            </section>
          </div>

          <p className="dayly-product-disclosure">Preview session only · tasks and setup changes stay in memory and are not saved.</p>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}
