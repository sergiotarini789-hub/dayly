"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout";
import { useProductSession } from "./product-session";
import { CurrentMoment, NextUsefulAction, SupportingContext, TodayLoadingCue, TodayPlan, TodayWorkspaceRail, type TimeOfDay, type TodayTask } from "./today-sections";

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

function formatDaySummary(taskCount: number, openTaskCount: number, planningStyle: string, availability: string) {
  if (taskCount === 0) return planningStyle === "gentle" ? "A lighter day. One useful step is enough." : "A small start is enough today.";
  if (openTaskCount === 0) return "Everything planned. Keep the pace comfortable.";
  if (openTaskCount === 1) return "One last thing worth finishing.";
  if (planningStyle === "deep") return `${openTaskCount} things worth moving forward. Protect a clear stretch for focus.`;
  if (availability === "flexible") return `${openTaskCount} things worth moving forward, with room to choose the pace.`;
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
  const { tasks, addTask: addSessionTask, toggleTask: toggleSessionTask, newTaskId, notice, displayName } = useProductSession();
  const [taskTitle, setTaskTitle] = React.useState("");
  const [todayLabel, setTodayLabel] = React.useState("Today");
  const [timeLabel, setTimeLabel] = React.useState("");
  const [greeting, setGreeting] = React.useState("Good morning.");
  const [timeOfDay, setTimeOfDay] = React.useState<TimeOfDay>("morning");
  const [session, setSession] = React.useState<PreviewSession>(EMPTY_SESSION);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(true);

  React.useEffect(() => {
    const now = new Date();
    const params = new URLSearchParams(window.location.search);
    const nextSession = readPreviewSession(params);
    const firstTask = params.get("firstTask")?.trim();

    setTodayLabel(formatToday(now));
    setTimeLabel(formatTime(now));
    setTimeOfDay(getTimeOfDay(now));
    setGreeting(formatGreeting(now, nextSession.displayName || displayName));
    setSession(nextSession);
    if (firstTask) addSessionTask(firstTask);
    setIsPreparing(false);
    if (window.location.search) window.history.replaceState(null, "", "/today");
  }, []);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;
    addSessionTask(title);
    setComposerOpen(true);
    setTaskTitle("");
  }

  function toggleTask(id: number, completed: boolean) {
    toggleSessionTask(id, completed);
  }

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const nextTask = openTasks[0];
  const hasPlanningContext = Boolean(session.availability || session.planningStyle);
  const sessionContext = session.availability ? AVAILABILITY_LABELS[session.availability] ?? "Planning context set" : "Planning context not set";
  const planningStyle = session.planningStyle ? PLANNING_STYLE_LABELS[session.planningStyle] ?? "Choose a pace that fits" : "Choose a pace that fits";
  const progressLabel = tasks.length === 0 ? "No tasks yet" : `${completedTasks.length} / ${tasks.length} complete`;
  const daySummary = formatDaySummary(tasks.length, openTasks.length, session.planningStyle, session.availability);

  return (
    <div className="dayly-product-page" data-ready={!isPreparing || undefined} data-time-of-day={timeOfDay}>
      <PageContainer width="wide">
          <div className="dayly-product-workspace">
            <div className="dayly-product-primary">
              <CurrentMoment greeting={greeting} todayLabel={todayLabel} timeLabel={timeLabel} timeOfDay={timeOfDay} isPreparing={isPreparing} sessionContext={sessionContext} planningStyle={planningStyle} daySummary={daySummary} completedCount={completedTasks.length} taskCount={tasks.length} progressLabel={progressLabel} />
              <div className="dayly-product-canvas">
                <TodayLoadingCue isPreparing={isPreparing} />
                <NextUsefulAction nextTask={nextTask} onComplete={(id) => toggleTask(id, true)} onStartTask={() => setComposerOpen(true)} />
                <TodayPlan tasks={tasks} openTasks={openTasks} completedTasks={completedTasks} newTaskId={newTaskId} taskTitle={taskTitle} notice={notice} composerOpen={composerOpen} onComposerOpenChange={setComposerOpen} onTaskTitleChange={setTaskTitle} onAddTask={addTask} onToggleTask={toggleTask} />
                <SupportingContext sessionContext={sessionContext} planningStyle={planningStyle} availability={session.availability ? AVAILABILITY_LABELS[session.availability] ?? "Availability set" : "Availability not set"} hasPlanningContext={hasPlanningContext} />
              </div>
            </div>
            <TodayWorkspaceRail completedCount={completedTasks.length} taskCount={tasks.length} nextTask={nextTask} hasPlanningContext={hasPlanningContext} sessionContext={sessionContext} planningStyle={planningStyle} />
          </div>
        <p className="dayly-product-disclosure">Preview session only · tasks and setup changes stay in memory and are not saved.</p>
      </PageContainer>
    </div>
  );
}
