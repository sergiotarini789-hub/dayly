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
