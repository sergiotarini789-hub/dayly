"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Input, SearchInput, Select, Switch } from "@/components/ui";
import { AddTaskForm, ActionLink, ProductSurface, SurfaceBadge, SurfaceContextBlock, SurfaceEmptyState, SurfaceSection, SurfaceSectionHeader, TaskTrail, useProductTasks } from "./product-primitives";

const todayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

export function TasksExperience() {
  const { tasks, notice, newTaskId, addTask, toggleTask } = useProductTasks();
  const [view, setView] = React.useState<"today" | "upcoming" | "completed">("today");
  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const visibleTasks = view === "completed" ? completedTasks : view === "today" ? openTasks : [];
  return (
    <ProductSurface activeId="tasks" title="Tasks" eyebrow="Make room for what matters" description="A clear place for the work you want to carry, without turning the day into a backlog.">
      <div className="dayly-surface-summary-line"><span>{openTasks.length === 0 ? "Nothing open" : `${openTasks.length} open ${openTasks.length === 1 ? "task" : "tasks"}`}</span><span>{todayLabel}</span></div>
      <div className="dayly-task-views" role="tablist" aria-label="Task views">
        {(["today", "upcoming", "completed"] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)}>{item}<span>{item === "today" ? openTasks.length : item === "completed" ? completedTasks.length : 0}</span></button>)}
      </div>
      <SurfaceSection className="dayly-task-surface-flow">
        <SurfaceSectionHeader title={view === "today" ? "Today" : view === "upcoming" ? "Upcoming" : "Completed"} description={view === "today" ? "Small, actionable, and ready to move." : view === "upcoming" ? "Work with a real future date will appear here." : "Finished work stays visible and can be reopened."} actions={<ActionLink href="/today">Return to Today →</ActionLink>} />
        {visibleTasks.length > 0 ? <TaskTrail tasks={visibleTasks} newTaskId={newTaskId} onToggle={toggleTask} /> : <SurfaceEmptyState title={view === "today" ? "Your task list is clear." : view === "upcoming" ? "Nothing is waiting around the corner." : "Nothing completed in this session yet."} description={view === "today" ? "Capture one useful step when it arrives. You can keep the rest of the day open." : view === "upcoming" ? "Add dates only when timing helps you decide. Unscheduled work can stay in Today." : "Completed tasks remain visible here, ready to reopen if needed."} action={view === "today" ? <ActionLink href="#task-capture">Add a task →</ActionLink> : undefined} />}
        <div id="task-capture"><AddTaskForm onAdd={addTask} label="Add something to today" /></div>
        <p className="dayly-surface-live-note" role="status" aria-live="polite">{notice}</p>
      </SurfaceSection>
      <div className="dayly-surface-context-grid">
        <SurfaceContextBlock label="How to use this space" title="Capture before you organize."><p>Add the title first. Projects, dates, and detail can wait until they help.</p></SurfaceContextBlock>
        <SurfaceContextBlock label="A useful connection" title="The next task can begin in Today."><p>Today keeps the immediate step in view; this list gives the rest of your work a home.</p><ActionLink href="/today">Open Today →</ActionLink></SurfaceContextBlock>
      </div>
    </ProductSurface>
  );
}

interface ProjectItem { id: number; title: string; outcome: string; }
export function ProjectsExperience() {
  const [projects, setProjects] = React.useState<ProjectItem[]>([]);
  const [title, setTitle] = React.useState("");
  const [outcome, setOutcome] = React.useState("");
  const [notice, setNotice] = React.useState("");
  function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setProjects((current) => [...current, { id: Date.now(), title: nextTitle, outcome: outcome.trim() || "Outcome to be defined" }]);
    setTitle("");
    setOutcome("");
    setNotice(`“${nextTitle}” added for this preview session.`);
  }
  return (
    <ProductSurface activeId="projects" title="Projects" eyebrow="Keep outcomes in view" description="A project is a meaningful direction, not another place to collect every task.">
      <SurfaceSection className="dayly-project-surface-flow">
        <SurfaceSectionHeader title="Your projects" description="Start with the outcome. Add tasks when the next step is clear." />
        {projects.length > 0 ? <><div className="dayly-project-list-head" aria-hidden="true"><span>Project</span><span>Outcome</span><span>Next move</span></div><div className="dayly-project-list">{projects.map((project) => <article className="dayly-project-row" key={project.id}><div><p className="dayly-product-eyebrow">In progress</p><h2>{project.title}</h2></div><p>{project.outcome}</p><ActionLink href="/tasks">Add a task →</ActionLink></article>)}</div></> : <SurfaceEmptyState title="No projects are shaping the day yet." description="Create a project when a task belongs to a larger outcome. Keep one-off work in Tasks." />}
        <form className="dayly-project-capture" onSubmit={addProject}>
          <Input label="Project name" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Something you want to move forward" />
          <Input label="Outcome" value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="What will be different when it is done?" />
          <Button type="submit" size="sm" variant="ghost">Add project</Button>
        </form>
        <p className="dayly-surface-live-note" role="status" aria-live="polite">{notice}</p>
      </SurfaceSection>
      <div className="dayly-surface-context-grid"><SurfaceContextBlock label="Keep it useful" title="Projects are for direction."><p>Use a project when the outcome deserves more than one next step. Dayly keeps the work connected without adding ceremony.</p></SurfaceContextBlock><SurfaceContextBlock label="Next" title="Choose one move in Today."><p>Projects become useful when they can hand you a clear next action.</p><ActionLink href="/today">Go to Today →</ActionLink></SurfaceContextBlock></div>
    </ProductSurface>
  );
}

export function CalendarExperience() {
  return (
    <ProductSurface activeId="calendar" title="Calendar" eyebrow="See the shape of the day" description="A lightweight place for commitments and planned time, without an enterprise schedule taking over.">
      <div className="dayly-calendar-dayline"><span className="dayly-calendar-dayline__dot" aria-hidden="true" /><div><p className="dayly-product-eyebrow">Today</p><h2>{todayLabel}</h2></div><SurfaceBadge variant="info">Local time</SurfaceBadge></div>
      <div className="dayly-calendar-timeline" aria-label="Today's open time">
        {[
          "08:00", "10:00", "12:00", "14:00", "16:00", "18:00",
        ].map((time) => <div className="dayly-calendar-timeline__slot" key={time}><time>{time}</time><span aria-hidden="true" /></div>)}
        <p className="dayly-calendar-timeline__note">No commitments added · open time remains visible</p>
      </div>
      <SurfaceSection className="dayly-calendar-surface-flow"><SurfaceSectionHeader title="A little room" description="Your commitments will appear here when you add them." /><SurfaceEmptyState eyebrow="Nothing scheduled" title="The day has space around it." description="Add a commitment when it is real. Dayly keeps fixed time distinct from flexible work." action={<ActionLink href="/today">Plan a next step →</ActionLink>} /></SurfaceSection>
      <div className="dayly-surface-context-grid"><SurfaceContextBlock label="Time context" title="No availability is being assumed."><p>Set a planning rhythm in onboarding when you want Today to use your available time.</p><ActionLink href="/onboarding">Set planning context →</ActionLink></SurfaceContextBlock><SurfaceContextBlock label="Coming up" title="Nothing later yet."><p>Empty space is useful information. Keep it open until a commitment is known.</p></SurfaceContextBlock></div>
    </ProductSurface>
  );
}

interface Habit { id: number; title: string; rhythm: string; completed: boolean; }
export function HabitsExperience() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [title, setTitle] = React.useState("");
  function addHabit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const next = title.trim(); if (!next) return; setHabits((current) => [...current, { id: Date.now(), title: next, rhythm: "Daily rhythm", completed: false }]); setTitle(""); }
  return (
    <ProductSurface activeId="habits" title="Habits" eyebrow="Build a rhythm, not a score" description="Small recurring actions belong here. The point is to notice the pattern, not perform for a dashboard.">
      <SurfaceSection className="dayly-habits-surface-flow"><SurfaceSectionHeader title="Your rhythm" description="One repeatable action is enough to begin." />{habits.length > 0 ? <div className="dayly-habit-list">{habits.map((habit) => <div className="dayly-habit-row" data-completed={habit.completed || undefined} key={habit.id}><button type="button" className="dayly-habit-marker" aria-label={`${habit.completed ? "Reopen" : "Complete"} ${habit.title}`} onClick={() => setHabits((current) => current.map((item) => item.id === habit.id ? { ...item, completed: !item.completed } : item))}>{habit.completed ? "✓" : "○"}</button><div><h2>{habit.title}</h2><p>{habit.completed ? "Kept today" : habit.rhythm}</p></div><SurfaceBadge variant={habit.completed ? "success" : "neutral"}>{habit.completed ? "Done" : "Today"}</SurfaceBadge></div>)}</div> : <SurfaceEmptyState title="No rhythm is being tracked yet." description="Add a habit when it supports the person you want to be. Keep the first version simple." />}
        <form className="dayly-habit-capture" onSubmit={addHabit}><Input label="Add a habit" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Something worth repeating" /><Button type="submit" size="sm" variant="ghost">Add habit</Button></form>
      </SurfaceSection>
      <div className="dayly-surface-context-grid"><SurfaceContextBlock label="A calmer measure" title="Consistency is the signal."><p>Dayly will eventually help you see your rhythm over time. This preview does not invent a streak.</p></SurfaceContextBlock><SurfaceContextBlock label="Today" title="Habits can support the next step."><p>Keep recurring actions visible without making them compete with the work that matters right now.</p><ActionLink href="/today">Open Today →</ActionLink></SurfaceContextBlock></div>
    </ProductSurface>
  );
}

export function FocusExperience() {
  const [focusState, setFocusState] = React.useState<"ready" | "active" | "paused" | "finished">("ready");
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => { if (focusState !== "active") return; const interval = window.setInterval(() => setSeconds((current) => current + 1), 1000); return () => window.clearInterval(interval); }, [focusState]);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <ProductSurface activeId="focus" title="Focus" eyebrow="A quieter mode" description="Step away from the list for a moment. Keep one intention close and let the rest wait.">
      <SurfaceSection className="dayly-focus-mode" data-state={focusState}><div className="dayly-focus-mode__topline"><p className="dayly-product-eyebrow">{focusState === "active" ? "In focus" : focusState === "finished" ? "Session complete" : "Ready when you are"}</p><SurfaceBadge variant={focusState === "active" ? "primary" : focusState === "finished" ? "success" : "neutral"}>{focusState === "active" ? "Working" : focusState === "paused" ? "Paused" : focusState === "finished" ? "Finished" : "No timer"}</SurfaceBadge></div><div className="dayly-focus-mode__clock"><span className="dayly-focus-mode__orbit" aria-hidden="true" /><div className="dayly-focus-mode__timer" role="timer" aria-live="polite">{time}</div><span>{focusState === "active" ? "elapsed · open session" : focusState === "paused" ? "your place is held" : focusState === "finished" ? "session closed" : "open-ended focus"}</span></div><h2>{focusState === "finished" ? "That time belongs to you." : "Choose one thing to stay with."}</h2><p>{focusState === "ready" ? "There is no task selected in this preview yet. Start a session when you know what deserves your attention." : focusState === "paused" ? "Your place is held. Return when you are ready." : focusState === "active" ? "The rest of Dayly can wait." : "A focused session is recorded locally for this preview."}</p><div className="dayly-focus-mode__actions">{focusState === "active" ? <Button variant="ghost" onClick={() => setFocusState("paused")}>Pause</Button> : focusState === "paused" ? <Button onClick={() => setFocusState("active")}>Continue</Button> : focusState === "finished" ? <Button variant="ghost" onClick={() => { setSeconds(0); setFocusState("ready"); }}>New session</Button> : <Button onClick={() => setFocusState("active")}>Start focus</Button>}{focusState === "active" || focusState === "paused" ? <Button variant="ghost" onClick={() => setFocusState("finished")}>Finish</Button> : null}<ActionLink href="/tasks">Choose from Tasks →</ActionLink></div></SurfaceSection>
      <div className="dayly-surface-context-grid"><SurfaceContextBlock label="Mode" title="Less information, more presence."><p>Focus is deliberately not another progress dashboard. It gives one task the room to be done.</p></SurfaceContextBlock><SurfaceContextBlock label="After" title="Finish deliberately."><p>When the session ends, return to Today and decide what comes next.</p><ActionLink href="/today">Return to Today →</ActionLink></SurfaceContextBlock></div>
    </ProductSurface>
  );
}

export function AnalyticsExperience() {
  return <ProductSurface activeId="analytics" title="Analytics" eyebrow="Learn from the pattern" description="Quiet evidence for better planning. Nothing here is fabricated while the preview is running locally."><SurfaceSection className="dayly-analytics-surface-flow"><SurfaceSectionHeader title="Your signal will appear here" description="Once there is real Dayly activity, this space can show useful patterns without turning them into scores." /><div className="dayly-analytics-empty-visual" role="img" aria-label="Activity visualization waiting for real Dayly activity"><div className="dayly-analytics-empty-visual__grid" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span key={index} />)}</div><div className="dayly-analytics-empty-visual__message"><strong>No activity to plot yet</strong><span>Real tasks and focus sessions will shape this view.</span></div></div><SurfaceEmptyState eyebrow="No history yet" title="There is nothing to summarize yet." description="Complete a few real tasks and sessions first. Dayly will keep the evidence close to the decisions it can improve." action={<ActionLink href="/today">Make a little progress →</ActionLink>} /></SurfaceSection><div className="dayly-surface-context-grid"><SurfaceContextBlock label="What belongs here" title="Patterns, not pressure."><p>Useful summaries might compare planned and completed work or show when your rhythm has room.</p></SurfaceContextBlock><SurfaceContextBlock label="A boundary" title="No invented metrics."><p>This preview stays honest: an empty chart is better than a confident fiction.</p></SurfaceContextBlock></div></ProductSurface>;
}

export function SearchExperience() {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  const destinations = [
    { href: "/today", label: "Today", copy: "Return to the current moment" },
    { href: "/tasks", label: "Tasks", copy: "Capture or revisit an action" },
    { href: "/projects", label: "Projects", copy: "Find a larger outcome" },
  ].filter((item) => !query || `${item.label} ${item.copy}`.toLowerCase().includes(query.toLowerCase()));
  return <ProductSurface activeId="search" title="Search" eyebrow="Find your way back in" description="A fast command surface for the things you have already captured in Dayly."><SurfaceSection className="dayly-search-surface-flow"><form className="dayly-search-command" role="search" onSubmit={(event) => event.preventDefault()}><SearchInput ref={inputRef} label="Search Dayly" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, projects, and notes" /></form><div className="dayly-search-hint"><span className="dayly-search-hint__key">⌘ K</span><p>{query ? `${destinations.length} nearby ${destinations.length === 1 ? "destination" : "destinations"}` : "Type to search this preview, or move to a nearby workspace."}</p></div>{destinations.length > 0 ? <section className="dayly-search-results" aria-label={query ? "Search results" : "Suggested destinations"}><p className="dayly-product-eyebrow">{query ? "Matching destinations" : "Move quickly"}</p>{destinations.map((item) => <Link key={item.href} href={item.href} className="dayly-search-result"><span><strong>{item.label}</strong><small>{item.copy}</small></span><span aria-hidden="true">→</span></Link>)}</section> : <SurfaceEmptyState eyebrow="No matches in this preview" title={`Nothing matches “${query}”.`} description="Try a route name or a broader phrase. Session content is intentionally not persisted between routes." />}</SurfaceSection><div className="dayly-surface-context-grid"><SurfaceContextBlock label="Try a phrase" title="Search by the next step."><p>Names, outcomes, and useful words are easier to find than a pile of filters.</p></SurfaceContextBlock><SurfaceContextBlock label="Keyboard" title="Keep moving quickly."><p>Press Command or Control K to return focus to search without reaching for the pointer.</p></SurfaceContextBlock></div></ProductSurface>;
}

export function SettingsExperience() {
  const [theme, setTheme] = React.useState("system");
  const [timeZone, setTimeZone] = React.useState("local");
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    return () => { delete document.documentElement.dataset.theme; };
  }, [theme]);

  React.useEffect(() => {
    if (reduceMotion) document.documentElement.dataset.reduceMotion = "true";
    else delete document.documentElement.dataset.reduceMotion;
    return () => { delete document.documentElement.dataset.reduceMotion; };
  }, [reduceMotion]);

  return <ProductSurface activeId="settings" title="Settings" eyebrow="Make the space fit" description="A few choices for how Dayly looks, plans, and respects your attention."><div className="dayly-settings-grid">
    <SurfaceSection className="dayly-settings-group"><SurfaceSectionHeader title="Profile" description="How Dayly addresses you in this session." /><Input label="Display name" placeholder="Your name" /></SurfaceSection>
    <SurfaceSection className="dayly-settings-group"><SurfaceSectionHeader title="Appearance" description="Keep the interface calm in the moments you use it most." /><Select label="Theme" value={theme} onChange={(event) => setTheme(event.target.value)} options={[{ value: "system", label: "Use system preference" }, { value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} /></SurfaceSection>
    <SurfaceSection className="dayly-settings-group"><SurfaceSectionHeader title="Planning" description="Shape the daily context without adding process." /><Select label="Time zone" value={timeZone} onChange={(event) => setTimeZone(event.target.value)} options={[{ value: "local", label: "Use my local time zone" }, { value: "utc", label: "UTC" }]} /><Link className="dayly-product-text-link" href="/onboarding">Revisit personal setup →</Link></SurfaceSection>
    <SurfaceSection className="dayly-settings-group"><SurfaceSectionHeader title="Notifications" description="Quiet by default, available when a reminder helps." /><Switch label="Daily planning reminder" description="Keep reminders off unless you deliberately enable them." /></SurfaceSection>
    <SurfaceSection className="dayly-settings-group"><SurfaceSectionHeader title="Accessibility" description="Choose how movement and confirmation are presented." /><Switch label="Reduce motion" description="Prefer immediate state changes without non-essential movement." checked={reduceMotion} onChange={(event) => setReduceMotion(event.target.checked)} /><Switch label="Confirm before leaving focus" defaultChecked description="Keep an intentional pause before ending active work." /></SurfaceSection>
    <SurfaceSection className="dayly-settings-group dayly-settings-group--integrations"><SurfaceSectionHeader title="Integrations" description="Connections are intentionally unavailable in this frontend preview." /><div className="dayly-settings-integration"><span aria-hidden="true">↗</span><div><strong>No connected services</strong><p>Dayly does not create an account, sync data, or contact an external service.</p></div><SurfaceBadge>Preview only</SurfaceBadge></div><p className="dayly-settings-note">Changes stay in memory and reset when this preview session ends.</p></SurfaceSection>
  </div></ProductSurface>;
}
