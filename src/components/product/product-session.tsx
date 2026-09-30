"use client";

import * as React from "react";

export interface SessionTask { id: number; title: string; completed: boolean; context?: string; }
export interface SessionProject { id: number; title: string; outcome: string; }
export interface SessionHabit { id: number; title: string; rhythm: string; completed: boolean; }
export interface SessionCommitment { id: number; title: string; time: string; }
export type FocusState = "ready" | "active" | "paused" | "finished";

interface ProductSessionValue {
  tasks: SessionTask[];
  projects: SessionProject[];
  habits: SessionHabit[];
  commitments: SessionCommitment[];
  newTaskId: number | null;
  notice: string;
  addTask: (title: string) => void;
  toggleTask: (id: number, completed: boolean) => void;
  addProject: (title: string, outcome: string) => void;
  addHabit: (title: string) => void;
  toggleHabit: (id: number) => void;
  addCommitment: (title: string, time: string) => void;
  focusState: FocusState;
  focusSeconds: number;
  focusSessions: number;
  startFocus: () => void;
  pauseFocus: () => void;
  finishFocus: () => void;
  resetFocus: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
}

const ProductSessionContext = React.createContext<ProductSessionValue | null>(null);
let sessionId = 0;
function nextId() { sessionId += 1; return Date.now() + sessionId; }

export function ProductSessionProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<SessionTask[]>([]);
  const [projects, setProjects] = React.useState<SessionProject[]>([]);
  const [habits, setHabits] = React.useState<SessionHabit[]>([]);
  const [commitments, setCommitments] = React.useState<SessionCommitment[]>([]);
  const [newTaskId, setNewTaskId] = React.useState<number | null>(null);
  const [notice, setNotice] = React.useState("Today is ready for your first useful step.");
  const [focusState, setFocusState] = React.useState<FocusState>("ready");
  const [focusSeconds, setFocusSeconds] = React.useState(0);
  const [focusSessions, setFocusSessions] = React.useState(0);
  const [theme, setTheme] = React.useState("system");
  const [timeZone, setTimeZone] = React.useState("local");
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");

  React.useEffect(() => {
    if (newTaskId === null) return;
    const timeout = window.setTimeout(() => setNewTaskId(null), 520);
    return () => window.clearTimeout(timeout);
  }, [newTaskId]);

  React.useEffect(() => {
    if (focusState !== "active") return;
    const interval = window.setInterval(() => setFocusSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(interval);
  }, [focusState]);

  React.useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

  React.useEffect(() => {
    if (reduceMotion) document.documentElement.dataset.reduceMotion = "true";
    else delete document.documentElement.dataset.reduceMotion;
  }, [reduceMotion]);

  const value = React.useMemo<ProductSessionValue>(() => ({
    tasks, projects, habits, commitments, newTaskId, notice,
    addTask(title) {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      const id = nextId();
      setTasks((current) => [...current, { id, title: cleanTitle, completed: false }]);
      setNewTaskId(id);
      setNotice(`“${cleanTitle}” added for this preview session.`);
    },
    toggleTask(id, completed) {
      setTasks((current) => current.map((task) => task.id === id ? { ...task, completed } : task));
      setNotice(completed ? "Task marked complete." : "Task reopened.");
    },
    addProject(title, outcome) {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      setProjects((current) => [...current, { id: nextId(), title: cleanTitle, outcome: outcome.trim() || "Outcome to be defined" }]);
    },
    addHabit(title) {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      setHabits((current) => [...current, { id: nextId(), title: cleanTitle, rhythm: "Daily rhythm", completed: false }]);
    },
    toggleHabit(id) { setHabits((current) => current.map((habit) => habit.id === id ? { ...habit, completed: !habit.completed } : habit)); },
    addCommitment(title, time) {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      setCommitments((current) => [...current, { id: nextId(), title: cleanTitle, time }].sort((a, b) => a.time.localeCompare(b.time)));
    },
    focusState, focusSeconds, focusSessions,
    startFocus() { setFocusState("active"); },
    pauseFocus() { setFocusState("paused"); },
    finishFocus() { setFocusState("finished"); setFocusSessions((count) => count + 1); },
    resetFocus() { setFocusSeconds(0); setFocusState("ready"); },
    theme, setTheme, timeZone, setTimeZone, reduceMotion, setReduceMotion, displayName, setDisplayName,
  }), [tasks, projects, habits, commitments, newTaskId, notice, focusState, focusSeconds, focusSessions, theme, timeZone, reduceMotion, displayName]);

  return <ProductSessionContext.Provider value={value}>{children}</ProductSessionContext.Provider>;
}

export function useProductSession() {
  const context = React.useContext(ProductSessionContext);
  if (!context) throw new Error("useProductSession must be used within ProductSessionProvider");
  return context;
}
