"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Checkbox, Input, Progress } from "@/components/ui";
import { Cluster } from "@/components/layout";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface TodayTask {
  id: number;
  title: string;
  completed: boolean;
}

interface CurrentMomentProps {
  greeting: string;
  todayLabel: string;
  timeLabel: string;
  timeOfDay: TimeOfDay;
  isPreparing: boolean;
  sessionContext: string;
  planningStyle: string;
  daySummary: string;
}

export function CurrentMoment({ greeting, todayLabel, timeLabel, timeOfDay, isPreparing, sessionContext, planningStyle, daySummary }: CurrentMomentProps) {
  return (
    <header className="dayly-product-greeting">
      <div className="dayly-product-greeting__date">
        <p className="dayly-product-eyebrow"><span className="dayly-product-time-mark" data-time-of-day={timeOfDay} aria-hidden="true" />{todayLabel}</p>
        {timeLabel ? <span className="dayly-product-time">{timeLabel}</span> : null}
      </div>
      <div className="dayly-product-greeting__copy">
        <h1>{greeting}</h1>
        <p>{daySummary}</p>
      </div>
      <div className="dayly-product-context-line" aria-label="Planning context">
        {isPreparing ? <span className="dayly-product-skeleton dayly-product-skeleton--context" aria-hidden="true" /> : <><span>{sessionContext}</span><strong>{planningStyle}</strong></>}
      </div>
    </header>
  );
}

export function TodayLoadingCue({ isPreparing }: { isPreparing: boolean }) {
  return (
    <div className="dayly-product-loading-cue" data-visible={isPreparing || undefined} role={isPreparing ? "status" : undefined} aria-live="polite">
      {isPreparing ? <><span className="dayly-product-skeleton dayly-product-skeleton--short" aria-hidden="true" /> <span>Preparing your day</span></> : null}
    </div>
  );
}

export function NextUsefulAction({ nextTask, onComplete }: { nextTask?: TodayTask; onComplete: (id: number) => void }) {
  return (
    <section className="dayly-product-focus-lane" aria-labelledby="next-action-heading">
      <div className="dayly-product-focus-lane__label">
        <p className="dayly-product-eyebrow">Next</p>
        <span>{nextTask ? "A clear place to begin" : "Start with one useful step"}</span>
      </div>
      <div className="dayly-product-focus-lane__row">
        <div className="dayly-product-focus-lane__copy">
          <h2 id="next-action-heading">{nextTask?.title ?? "Choose one thing to move forward."}</h2>
          <p>{nextTask ? "Open · preview session" : "You can organize it later."}</p>
        </div>
        {nextTask ? (
          <Cluster className="dayly-product-focus-lane__actions">
            <Button aria-label="Complete task" className="dayly-product-focus-lane__action" size="sm" variant="ghost" onClick={() => onComplete(nextTask.id)}>
              <span className="dayly-product-action-label">Complete task</span><span aria-hidden="true">→</span>
            </Button>
            <Link className="dayly-product-text-link" href="#today-plan">Open in plan →</Link>
          </Cluster>
        ) : <Link className="dayly-product-text-link dayly-product-focus-lane__action" href="#today-plan">Add first task →</Link>}
      </div>
    </section>
  );
}

interface TodayPlanProps {
  tasks: TodayTask[];
  openTasks: TodayTask[];
  completedTasks: TodayTask[];
  newTaskId: number | null;
  progressLabel: string;
  taskTitle: string;
  notice: string;
  onTaskTitleChange: (value: string) => void;
  onAddTask: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleTask: (id: number, completed: boolean) => void;
}

function TaskRow({ task, index, isNew, onToggle }: { task: TodayTask; index: number; isNew: boolean; onToggle: (id: number, completed: boolean) => void }) {
  return (
    <div className="dayly-product-task-row" data-completed={task.completed || undefined} data-new={isNew || undefined}>
      <span className="dayly-product-task-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Checkbox label={task.title} checked={task.completed} onChange={(event) => onToggle(task.id, event.target.checked)} description={task.completed ? "Completed" : "Open"} />
      <span className="dayly-product-task-arrow" aria-hidden="true">→</span>
    </div>
  );
}

export function TodayPlan({ tasks, openTasks, completedTasks, newTaskId, progressLabel, taskTitle, notice, onTaskTitleChange, onAddTask, onToggleTask }: TodayPlanProps) {
  return (
    <section className="dayly-product-plan" id="today-plan" aria-labelledby="plan-heading">
      <header className="dayly-product-section-heading">
        <h2 id="plan-heading">Today</h2>
        <span className="dayly-product-plan__count">{openTasks.length} {openTasks.length === 1 ? "open task" : "open tasks"}</span>
      </header>
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
          {openTasks.map((task, index) => <TaskRow key={task.id} task={task} index={index} isNew={newTaskId === task.id} onToggle={onToggleTask} />)}
          {completedTasks.length > 0 ? <><p className="dayly-product-list-label">Completed</p>{completedTasks.map((task, index) => <TaskRow key={task.id} task={task} index={openTasks.length + index} isNew={newTaskId === task.id} onToggle={onToggleTask} />)}</> : null}
        </div>
      )}

      <div className="dayly-product-progress" aria-labelledby="progress-heading">
        <div className="dayly-product-progress__summary">
          <strong id="progress-heading">{progressLabel}</strong>
          <span>{tasks.length === 0 ? "Ready when you are" : "A quiet measure of what has moved."}</span>
        </div>
        <Progress value={completedTasks.length} max={Math.max(tasks.length, 1)} label={`Today progress: ${progressLabel}`} />
      </div>

      <form className="dayly-product-capture" onSubmit={onAddTask}>
        <Input id="today-task-title" label="Add a task" value={taskTitle} onChange={(event) => onTaskTitleChange(event.target.value)} placeholder="Something useful, in a few words" />
        <Button aria-label="Add to Today" type="submit" size="sm" variant="ghost">Add</Button>
      </form>
      <p className="dayly-product-live-note" role="status" aria-live="polite">{notice}</p>
    </section>
  );
}

export function SupportingContext({ sessionContext, planningStyle, hasPlanningContext }: { sessionContext: string; planningStyle: string; hasPlanningContext: boolean }) {
  return (
    <aside className="dayly-product-aside" aria-label="Supporting context">
      <section className="dayly-product-support-section" aria-labelledby="upcoming-heading">
        <p className="dayly-product-eyebrow">Coming up</p>
        <h2 id="upcoming-heading">Nothing scheduled yet.</h2>
        <p>Commitments will appear here when you add them.</p>
      </section>
      <section className="dayly-product-support-section" aria-labelledby="context-heading">
        <p className="dayly-product-eyebrow">A day with room</p>
        <h2 id="context-heading">Keep the next step realistic.</h2>
        <p>{hasPlanningContext ? `${sessionContext} · ${planningStyle}.` : "Set a little context when you are ready; Dayly will not assume you have unlimited time."}</p>
        <Link className="dayly-product-text-link" href="/onboarding">{hasPlanningContext ? "Adjust planning context" : "Set planning context"}</Link>
      </section>
    </aside>
  );
}
