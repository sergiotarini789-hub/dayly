"use client";

import * as React from "react";
import Link from "next/link";
import { AppTopBar, ApplicationShell, PageContainer } from "@/components/layout";
import { CurrentMoment, NextUsefulAction, SupportingContext, TodayLoadingCue, TodayPlan, type TimeOfDay, type TodayTask } from "./today-sections";

interface PreviewSession {
  displayName: string;
  timeZone: string;
  availability: string;
  planningStyle: string;
}

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
  return displayName ? `${salutation}, ${displayName}.` : `${salutation}.`;
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
  const [tasks, setTasks] = React.useState<TodayTask[]>([]);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [notice, setNotice] = React.useState("Today is ready for your first useful step.");
  const [todayLabel, setTodayLabel] = React.useState("Today");
  const [timeLabel, setTimeLabel] = React.useState("");
  const [greeting, setGreeting] = React.useState("Good morning.");
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
  const hasPlanningContext = Boolean(session.availability || session.planningStyle);
  const sessionContext = session.availability ? AVAILABILITY_LABELS[session.availability] ?? "Planning context set" : "Planning context not set";
  const planningStyle = session.planningStyle ? PLANNING_STYLE_LABELS[session.planningStyle] ?? "Choose a pace that fits" : "Choose a pace that fits";
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
          <CurrentMoment greeting={greeting} todayLabel={todayLabel} timeLabel={timeLabel} timeOfDay={timeOfDay} isPreparing={isPreparing} sessionContext={sessionContext} planningStyle={planningStyle} daySummary={daySummary} />
          <TodayLoadingCue isPreparing={isPreparing} />
          <div className="dayly-product-layout">
            <div className="dayly-product-primary">
              <NextUsefulAction nextTask={nextTask} onComplete={(id) => toggleTask(id, true)} />
              <TodayPlan tasks={tasks} openTasks={openTasks} completedTasks={completedTasks} newTaskId={newTaskId} progressLabel={progressLabel} taskTitle={taskTitle} notice={notice} onTaskTitleChange={setTaskTitle} onAddTask={addTask} onToggleTask={toggleTask} />
            </div>
            <SupportingContext sessionContext={sessionContext} planningStyle={planningStyle} hasPlanningContext={hasPlanningContext} />
          </div>
          <p className="dayly-product-disclosure">Preview session only · tasks and setup changes stay in memory and are not saved.</p>
        </PageContainer>
      </div>
    </ApplicationShell>
  );
}
