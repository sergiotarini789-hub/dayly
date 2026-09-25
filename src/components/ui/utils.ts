import * as React from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = (isControlled ? value : internalValue) as T;

  const setValue = React.useCallback(
    (nextValue: React.SetStateAction<T>) => {
      const resolved = typeof nextValue === "function" ? (nextValue as (previous: T) => T)(currentValue) : nextValue;
      if (!isControlled) setInternalValue(resolved);
      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

export function useEscapeKey(enabled: boolean, onEscape: () => void) {
  React.useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
}

export function useFocusRestore(open: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previousFocus = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return;
    }
    if (previousFocus.current && document.contains(previousFocus.current)) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [open, containerRef]);
}

export function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function readMotionDuration(tokenName: string): number {
  if (typeof document === "undefined") return 0;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
  const numericValue = Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) return 0;
  return value.endsWith("s") && !value.endsWith("ms") ? numericValue * 1000 : numericValue;
}

export type MotionDurationToken = "--duration-instant" | "--duration-fast" | "--duration-normal" | "--duration-slow";

export interface PresenceState {
  present: boolean;
  state: "open" | "closed";
  onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => void;
}

export function usePresence(open: boolean, durationToken: MotionDurationToken = "--duration-fast"): PresenceState {
  const [present, setPresent] = React.useState(open);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      setExiting(false);
      return;
    }
    if (!present) return;

    setExiting(true);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const duration = reducedMotion ? 0 : readMotionDuration(durationToken);
    if (duration === 0) {
      setPresent(false);
      return;
    }
    const timeout = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timeout);
  }, [durationToken, open, present]);

  const onAnimationEnd = React.useCallback((event: React.AnimationEvent<HTMLElement>) => {
    if (!open && exiting && event.target === event.currentTarget) setPresent(false);
  }, [exiting, open]);

  return { present: open || present, state: open || !exiting ? "open" : "closed", onAnimationEnd };
}
