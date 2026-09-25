"use client";

import * as React from "react";
import Link from "next/link";
import { AppTopBar, ApplicationShell, Cluster, PageContainer, Panel, SectionHeader } from "@/components/layout";
import { Badge, Button, Checkbox, Input, Separator } from "@/components/ui";

interface PreviewTask {
  id: number;
  title: string;
  completed: boolean;
}

function formatToday(date: Date) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

export function TodayExperience() {
  const [tasks, setTasks] = React.useState<PreviewTask[]>([]);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [notice, setNotice] = React.useState("Today is ready for your first useful step.");
  const [todayLabel, setTodayLabel] = React.useState("Today");

  React.useEffect(() => {
    setTodayLabel(formatToday(new Date()));
    const firstTask = new URLSearchParams(window.location.search).get("firstTask")?.trim();
    if (firstTask) {
      setTasks([{ id: Date.now(), title: firstTask, completed: false }]);
      setNotice(`“${firstTask}” was added for this preview session. Changes remain in memory only.`);
      window.history.replaceState(null, "", "/today");
    }
  }, []);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) {
      setNotice("Add a short task title before saving.");
      return;
    }
    setTasks((current) => [...current, { id: Date.now(), title, completed: false }]);
    setTaskTitle("");
    setNotice(`“${title}” is on your day. This preview keeps changes in memory only.`);
  }

  function toggleTask(id: number, completed: boolean) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed } : task));
    setNotice(completed ? "Task marked complete for this preview session." : "Task reopened.");
  }

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <ApplicationShell
      initialActiveNavigationId="today"
      topBar={<AppTopBar title="Today" aria-label="Today application bar" right={<Link className="dayly-product-top-link" href="/onboarding">Planning preferences</Link>} />}
    >
      <div className="dayly-product-page">
        <PageContainer width="wide">
          <header className="dayly-product-header">
            <div className="dayly-product-header__copy">
              <Badge variant="primary">{todayLabel}</Badge>
              <h1>Make room for what matters.</h1>
              <p>Today brings your next decision, available context, and useful actions into one calm place.</p>
            </div>
            <div className="dayly-product-header__context" aria-label="Preview context">
              <span className="dayly-product-header__context-label">Personal day</span>
              <strong>{tasks.length === 0 ? "A clear start" : `${openTasks.length} open ${openTasks.length === 1 ? "task" : "tasks"}`}</strong>
              <span>Preview changes are kept in memory only.</span>
            </div>
          </header>

          <div className="dayly-product-grid">
            <div className="dayly-product-main">
              <section className="dayly-product-next" aria-labelledby="next-action-heading">
                <div>
                  <span className="dayly-product-eyebrow">Next useful step</span>
                  <h2 id="next-action-heading">{openTasks[0]?.title ?? "Choose one thing to move forward."}</h2>
                  <p>{openTasks[0] ? "Keep the first step visible, then adjust the plan as the day changes." : "Start with a task that can be captured in a few words. You can organize it later."}</p>
                </div>
                {openTasks[0] ? <Button className="dayly-product-next__action" onClick={() => toggleTask(openTasks[0].id, true)}>Complete next task</Button> : <Link className="dayly-button dayly-product-next__action" data-variant="primary" href="#quick-add">Add first task</Link>}
              </section>

              <Panel className="dayly-product-capture" variant="elevated" id="quick-add">
                <div className="dayly-product-section-heading">
                  <div>
                    <span className="dayly-product-eyebrow">Quick capture</span>
                    <h2>Add something actionable</h2>
                  </div>
                  <Badge variant="info">Task</Badge>
                </div>
                <form className="dayly-product-capture__form" onSubmit={addTask}>
                  <Input id="today-task-title" label="Task title" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="What needs doing?" description="A title is enough for now. Organization can come later." />
                  <Button type="submit">Add to Today</Button>
                </form>
                <p className="dayly-product-live-note" role="status" aria-live="polite">{notice}</p>
              </Panel>

              <section className="dayly-product-agenda" aria-labelledby="agenda-heading">
                <SectionHeader headingId="agenda-heading" title="Your day" description="A focused list of what is known and what still needs a decision." actions={<Link className="dayly-product-text-link" href="/onboarding">Set planning context</Link>} />
                {tasks.length === 0 ? (
                  <div className="dayly-product-empty" role="status">
                    <span className="dayly-product-empty__marker" aria-hidden="true">○</span>
                    <div>
                      <h3>No tasks on Today yet</h3>
                      <p>Your day is not behind. Add one useful task, or set basic availability before planning time.</p>
                      <Cluster><Link className="dayly-button" data-variant="outline" href="#quick-add">Add a task</Link><Link className="dayly-product-text-link" href="/onboarding">Set up availability</Link></Cluster>
                    </div>
                  </div>
                ) : (
                  <div className="dayly-product-task-list" aria-label="Today tasks">
                    {openTasks.map((task) => <Checkbox key={task.id} label={task.title} checked={task.completed} onChange={(event) => toggleTask(task.id, event.target.checked)} description="Open task · preview session" />)}
                    {completedTasks.length > 0 ? <><Separator /><p className="dayly-product-list-label">Completed today</p>{completedTasks.map((task) => <Checkbox key={task.id} label={task.title} checked={task.completed} onChange={(event) => toggleTask(task.id, event.target.checked)} description="Completed in preview session" />)}</> : null}
                  </div>
                )}
              </section>
            </div>

            <aside className="dayly-product-aside" aria-label="Today context">
              <section className="dayly-product-context-block" aria-labelledby="time-context-heading">
                <SectionHeader headingId="time-context-heading" title="Time context" description="Planning is more useful when it reflects the time you actually have." />
                <div className="dayly-product-context-value"><span>Availability</span><strong>Not configured</strong></div>
                <p>Set a simple planning window so future scheduling can respect your day instead of assuming unlimited time.</p>
                <Link className="dayly-button dayly-product-context-action" data-variant="secondary" href="/onboarding">Configure availability</Link>
              </section>
              <section className="dayly-product-context-block" aria-labelledby="coming-next-heading">
                <SectionHeader headingId="coming-next-heading" title="Coming next" description="Commitments will appear here when you add them." />
                <div className="dayly-product-empty dayly-product-empty--small"><span className="dayly-product-empty__marker" aria-hidden="true">—</span><p>No scheduled commitments yet.</p></div>
              </section>
              <section className="dayly-product-context-block dayly-product-context-block--quiet" aria-labelledby="focus-heading">
                <SectionHeader headingId="focus-heading" title="Focus" description="Start a focused session when you are ready to work." />
                <p className="dayly-product-muted">Choose a task first and Dayly can keep intention and actual time distinct.</p>
              </section>
            </aside>
          </div>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}
