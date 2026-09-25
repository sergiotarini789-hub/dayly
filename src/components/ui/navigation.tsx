import * as React from "react";
import { cn, useControllableState } from "./utils";

interface TabsContextValue {
  value: string;
  baseId: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function Tabs({ value, defaultValue, onValueChange, orientation = "horizontal", className, children, ...props }: TabsProps) {
  const generatedId = React.useId();
  const [currentValue, setCurrentValue] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return <TabsContext.Provider value={{ value: currentValue, baseId: `dayly-tabs-${generatedId}`, onValueChange: setCurrentValue, orientation }}><div {...props} className={cn("dayly-tabs", className)} data-orientation={orientation}>{children}</div></TabsContext.Provider>;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
export function TabsList({ className, ...props }: TabsListProps) { return <div {...props} className={cn("dayly-tabs__list", className)} role="tablist" />; }

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { value: string; }
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger({ value, className, disabled, onKeyDown, ...props }, ref) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");
  const selected = context.value === value;
  const orientation = context.orientation;
  const triggerId = `${context.baseId}-trigger-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const triggers = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []).filter((trigger) => !trigger.disabled);
    const currentIndex = triggers.indexOf(event.currentTarget);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || (orientation === "vertical" && event.key === "ArrowDown")) nextIndex = (currentIndex + 1) % triggers.length;
    if (event.key === "ArrowLeft" || (orientation === "vertical" && event.key === "ArrowUp")) nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = triggers.length - 1;
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      triggers[nextIndex]?.focus();
      triggers[nextIndex]?.click();
    }
  }
  return <button {...props} ref={ref} type="button" className={cn("dayly-tabs__trigger", className)} role="tab" id={triggerId} aria-selected={selected} aria-controls={panelId} tabIndex={selected ? 0 : -1} disabled={disabled} data-selected={selected || undefined} onClick={() => context.onValueChange(value)} onKeyDown={handleKeyDown} />;
});

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> { value: string; }
export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");
  const selected = context.value === value;
  return <div {...props} className={cn("dayly-tabs__content", className)} role="tabpanel" id={`${context.baseId}-panel-${value}`} aria-labelledby={`${context.baseId}-trigger-${value}`} hidden={!selected} tabIndex={0} />;
}

interface CollapsibleContextValue { open: boolean; setOpen: (open: boolean) => void; contentId: string; }
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function Collapsible({ open, defaultOpen = false, onOpenChange, className, children, ...props }: CollapsibleProps) {
  const generatedId = React.useId();
  const [currentOpen, setCurrentOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  return <CollapsibleContext.Provider value={{ open: currentOpen, setOpen: setCurrentOpen, contentId: `dayly-collapsible-${generatedId}` }}><div {...props} className={cn("dayly-collapsible", className)} data-open={currentOpen || undefined}>{children}</div></CollapsibleContext.Provider>;
}

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(function CollapsibleTrigger({ className, onClick, ...props }, ref) {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error("CollapsibleTrigger must be used inside Collapsible");
  return <button {...props} ref={ref} type="button" className={cn("dayly-collapsible__trigger", className)} aria-expanded={context.open} aria-controls={context.contentId} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) context.setOpen(!context.open); }} />;
});

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) { const context = React.useContext(CollapsibleContext); if (!context) throw new Error("CollapsibleContent must be used inside Collapsible"); return <div {...props} className={cn("dayly-collapsible__content", className)} id={context.contentId} hidden={!context.open} />; }

interface AccordionContextValue { openItems: string[]; toggle: (value: string) => void; multiple: boolean; }
const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}
export function Accordion({ type = "single", value, defaultValue = type === "multiple" ? [] : "", onValueChange, className, children, ...props }: AccordionProps) {
  const multiple = type === "multiple";
  const normalizedDefault = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
  const normalizedValue = Array.isArray(value) ? value : value ? [value] : value === "" ? [] : undefined;
  const [openItems, setOpenItems] = useControllableState({ value: normalizedValue, defaultValue: normalizedDefault, onChange: (next) => onValueChange?.(multiple ? next : next[0] ?? "") });
  function toggle(item: string) { setOpenItems((items) => items.includes(item) ? items.filter((valueItem) => valueItem !== item) : multiple ? [...items, item] : [item]); }
  return <AccordionContext.Provider value={{ openItems, toggle, multiple }}><div {...props} className={cn("dayly-accordion", className)} data-multiple={multiple || undefined}>{children}</div></AccordionContext.Provider>;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> { value: string; }
export function AccordionItem({ value, className, ...props }: AccordionItemProps) { return <AccordionItemContext.Provider value={value}><div {...props} className={cn("dayly-accordion__item", className)} /> </AccordionItemContext.Provider>; }
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function AccordionTrigger({ className, onClick, ...props }, ref) {
  const accordion = React.useContext(AccordionContext);
  const value = React.useContext(AccordionItemContext);
  if (!accordion || !value) throw new Error("AccordionTrigger must be used inside AccordionItem");
  const contentId = `dayly-accordion-content-${value}`;
  const open = accordion.openItems.includes(value);
  return <button {...props} ref={ref} type="button" className={cn("dayly-accordion__trigger", className)} aria-expanded={open} aria-controls={contentId} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) accordion.toggle(value); }} />;
});
export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { const accordion = React.useContext(AccordionContext); const value = React.useContext(AccordionItemContext); if (!accordion || !value) throw new Error("AccordionContent must be used inside AccordionItem"); const open = accordion.openItems.includes(value); return <div {...props} className={cn("dayly-accordion__content", className)} id={`dayly-accordion-content-${value}`} role="region" hidden={!open} />; }
