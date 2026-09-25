import * as React from "react";
import { createPortal } from "react-dom";
import { cn, getFocusableElements, useControllableState, useEscapeKey, useFocusRestore } from "./utils";
import { IconButton, Spinner } from "./primitives";

function Portal({ children }: { children: React.ReactNode }) {
  return typeof document === "undefined" ? null : createPortal(children, document.body);
}

function useOverlayFocus(open: boolean, ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useFocusRestore(open, ref);
  useEscapeKey(open, onClose);
  React.useEffect(() => {
    if (!open || !ref.current) return;
    const container = ref.current;
    const focusable = getFocusableElements(container);
    (container.querySelector<HTMLElement>("[data-autofocus]") ?? focusable[0] ?? container).focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = getFocusableElements(container);
      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open, ref]);
}

interface OverlayRootContextValue { open: boolean; setOpen: (open: boolean) => void; }

function createOverlayRoot(defaultOpen: boolean, open: boolean | undefined, onOpenChange?: (open: boolean) => void) {
  return useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
}

const DialogContext = React.createContext<OverlayRootContextValue | null>(null);

export interface DialogProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; }
export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) { const [currentOpen, setCurrentOpen] = createOverlayRoot(defaultOpen, open, onOpenChange); return <DialogContext.Provider value={{ open: currentOpen, setOpen: setCurrentOpen }}>{children}</DialogContext.Provider>; }

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger({ className, onClick, ...props }, ref) { const context = React.useContext(DialogContext); if (!context) throw new Error("DialogTrigger must be used inside Dialog"); return <button {...props} ref={ref} type="button" className={cn("dayly-dialog-trigger", className)} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) { event.currentTarget.focus(); context.setOpen(true); } }} />; });
export function DialogClose({ className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { const context = React.useContext(DialogContext); if (!context) throw new Error("DialogClose must be used inside Dialog"); return <button {...props} type="button" className={cn("dayly-dialog-close", className)} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) context.setOpen(false); }} />; }

export interface DialogContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  closeLabel?: string;
}
export function DialogContent({ title, description, closeLabel = "Close dialog", className, children, ...props }: DialogContentProps) {
  const context = React.useContext(DialogContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  if (!context) throw new Error("DialogContent must be used inside Dialog");
  const close = React.useCallback(() => context.setOpen(false), [context]);
  useOverlayFocus(context.open, contentRef, close);
  if (!context.open) return null;
  return <Portal><div className="dayly-overlay" data-state="open"><button className="dayly-overlay__scrim" aria-label={closeLabel} tabIndex={-1} onClick={close} /><div {...props} ref={contentRef} className={cn("dayly-dialog", className)} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}><div className="dayly-dialog__header"><h2 id={titleId} className="dayly-dialog__title">{title}</h2><button type="button" className="dayly-dialog__close" aria-label={closeLabel} onClick={close}>×</button></div>{description ? <p id={descriptionId} className="dayly-dialog__description">{description}</p> : null}<div className="dayly-dialog__body">{children}</div></div></div></Portal>;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h2 {...props} className={cn("dayly-dialog__title", className)} />; }
export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p {...props} className={cn("dayly-dialog__description", className)} />; }

interface TooltipState { open: boolean; setOpen: (open: boolean) => void; }
const TooltipContext = React.createContext<TooltipState | null>(null);
export interface TooltipProps { content: React.ReactNode; children: React.ReactElement; delay?: number; }
export function Tooltip({ content, children, delay = 400 }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const show = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(true), delay); };
  const hide = () => { window.clearTimeout(timer.current); setOpen(false); };
  const tooltipId = React.useId();
  const child = React.cloneElement(children, { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, "aria-describedby": open ? tooltipId : undefined } as Partial<React.ReactElement>);
  return <TooltipContext.Provider value={{ open, setOpen }}><span className="dayly-tooltip-wrap">{child}{open ? <span className="dayly-tooltip" role="tooltip" id={tooltipId}>{content}</span> : null}</span></TooltipContext.Provider>;
}

const PopoverContext = React.createContext<OverlayRootContextValue | null>(null);
export interface PopoverProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; }
export function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) { const [currentOpen, setCurrentOpen] = createOverlayRoot(defaultOpen, open, onOpenChange); return <PopoverContext.Provider value={{ open: currentOpen, setOpen: setCurrentOpen }}>{children}</PopoverContext.Provider>; }
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function PopoverTrigger({ className, onClick, ...props }, ref) { const context = React.useContext(PopoverContext); if (!context) throw new Error("PopoverTrigger must be used inside Popover"); return <button {...props} ref={ref} type="button" className={cn("dayly-popover-trigger", className)} aria-expanded={context.open} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) { event.currentTarget.focus(); context.setOpen(!context.open); } }} />; });

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> { side?: "top" | "right" | "bottom" | "left"; align?: "start" | "center" | "end"; }
export function PopoverContent({ side = "bottom", align = "center", className, children, ...props }: PopoverContentProps) {
  const context = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLElement | null>(null);
  if (!context) throw new Error("PopoverContent must be used inside Popover");
  const close = React.useCallback(() => context.setOpen(false), [context]);
  useEscapeKey(context.open, close);
  React.useEffect(() => {
    if (!context.open) return;
    const current = document.activeElement;
    trigger.current = current instanceof HTMLElement ? current : null;
    contentRef.current?.focus();
    return () => trigger.current?.focus();
  }, [context.open]);
  if (!context.open) return null;
  return <Portal><div {...props} ref={contentRef} className={cn("dayly-popover", className)} data-side={side} data-align={align} role="dialog" tabIndex={-1}>{children}</div></Portal>;
}

interface MenuContextValue { open: boolean; setOpen: (open: boolean) => void; contentId: string; }
const MenuContext = React.createContext<MenuContextValue | null>(null);
export interface DropdownMenuProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; }
export function DropdownMenu({ open, defaultOpen = false, onOpenChange, children }: DropdownMenuProps) { const generatedId = React.useId(); const [currentOpen, setCurrentOpen] = createOverlayRoot(defaultOpen, open, onOpenChange); return <MenuContext.Provider value={{ open: currentOpen, setOpen: setCurrentOpen, contentId: `dayly-menu-${generatedId}` }}>{children}</MenuContext.Provider>; }
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function DropdownMenuTrigger({ className, onClick, ...props }, ref) { const context = React.useContext(MenuContext); if (!context) throw new Error("DropdownMenuTrigger must be used inside DropdownMenu"); return <button {...props} ref={ref} type="button" className={cn("dayly-menu-trigger", className)} aria-haspopup="menu" aria-expanded={context.open} aria-controls={context.contentId} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) { event.currentTarget.focus(); context.setOpen(!context.open); } }} />; });

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> { label?: string; }
export function DropdownMenuContent({ label = "Menu", className, children, ...props }: DropdownMenuContentProps) {
  const context = React.useContext(MenuContext);
  const ref = React.useRef<HTMLDivElement>(null);
  if (!context) throw new Error("DropdownMenuContent must be used inside DropdownMenu");
  const close = React.useCallback(() => context.setOpen(false), [context]);
  useEscapeKey(context.open, close);
  React.useEffect(() => { if (context.open) ref.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus(); }, [context.open]);
  if (!context.open) return null;
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); const next = event.key === "ArrowDown" ? (currentIndex + 1) % items.length : (currentIndex - 1 + items.length) % items.length; items[next]?.focus(); }
    if (event.key === "Home") { event.preventDefault(); items[0]?.focus(); }
    if (event.key === "End") { event.preventDefault(); items[items.length - 1]?.focus(); }
  }
  return <Portal><div {...props} ref={ref} id={context.contentId} className={cn("dayly-menu", className)} role="menu" aria-label={label} tabIndex={-1} onKeyDown={onKeyDown}>{children}</div></Portal>;
}
export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { destructive?: boolean; }
export function DropdownMenuItem({ destructive, disabled, className, onClick, ...props }: DropdownMenuItemProps) { const context = React.useContext(MenuContext); if (!context) throw new Error("DropdownMenuItem must be used inside DropdownMenu"); return <button {...props} type="button" className={cn("dayly-menu-item", className)} role="menuitem" aria-disabled={disabled || undefined} data-destructive={destructive || undefined} disabled={disabled} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented && !disabled) context.setOpen(false); }} />; }
export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={cn("dayly-menu-separator", className)} role="separator" />; }

export interface DrawerContentProps extends DialogContentProps { side?: "bottom" | "left" | "right"; }
export const Drawer = Dialog;
export const DrawerTrigger = DialogTrigger;
export const DrawerClose = DialogClose;
export function DrawerContent({ side = "bottom", className, ...props }: DrawerContentProps) { return <DialogContent {...props} className={cn("dayly-drawer", className)} data-side={side} />; }

export interface ToastItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: AlertVariant;
  action?: { label: string; onClick: () => void };
}
type AlertVariant = "info" | "success" | "warning" | "danger";
interface ToastContextValue { toast: (item: Omit<ToastItem, "id">) => string; dismiss: (id: string) => void; items: ToastItem[]; }
const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const dismiss = React.useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setItems((current) => [...current, { ...item, id }]);
    window.setTimeout(() => dismiss(id), 6000);
    return id;
  }, [dismiss]);
  return <ToastContext.Provider value={{ toast, dismiss, items }}>{children}</ToastContext.Provider>;
}
export function useToast() { const context = React.useContext(ToastContext); if (!context) throw new Error("useToast must be used inside ToastProvider"); return context; }
export function ToastViewport({ className }: { className?: string }) { const context = useToast(); return <div className={cn("dayly-toast-viewport", className)} aria-live="polite" aria-relevant="additions"><div>{context.items.map((item) => <Toast key={item.id} item={item} onDismiss={() => context.dismiss(item.id)} />)}</div></div>; }
export function Toast({ item, onDismiss }: { item: ToastItem; onDismiss?: () => void }) { const role = item.variant === "danger" ? "alert" : "status"; return <div className="dayly-toast" data-variant={item.variant ?? "info"} role={role}><div className="dayly-toast__copy"><strong>{item.title}</strong>{item.description ? <span>{item.description}</span> : null}</div>{item.action ? <button type="button" onClick={() => { item.action?.onClick(); onDismiss?.(); }}>{item.action.label}</button> : null}<IconButton aria-label="Dismiss notification" size="sm" onClick={onDismiss}>×</IconButton></div>; }

export { Spinner };
