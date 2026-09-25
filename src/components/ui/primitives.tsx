import * as React from "react";
import { cn, useControllableState } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline" | "link" | "icon";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    disabled,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cn("dayly-button", className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className="dayly-button__content">
        {iconLeft ? <span className="dayly-button__icon" aria-hidden="true">{iconLeft}</span> : null}
        <span>{children}</span>
        {iconRight ? <span className="dayly-button__icon" aria-hidden="true">{iconRight}</span> : null}
      </span>
      {loading ? <Spinner size="sm" className="dayly-button__spinner" aria-hidden="true" /> : null}
    </button>
  );
});

export type AccessibleIconName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & AccessibleIconName & {
  size?: ControlSize;
  variant?: Exclude<ButtonVariant, "link" | "icon"> | "icon";
  loading?: boolean;
  tooltip?: string;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, size = "md", variant = "ghost", loading = false, disabled, tooltip, type = "button", ...props },
  ref,
) {
  const accessibleLabel = props["aria-label"] ?? tooltip;
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cn("dayly-icon-button", className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-label={accessibleLabel}
      aria-busy={loading || undefined}
      title={tooltip}
    >
      {loading ? <Spinner size="sm" aria-hidden="true" /> : props.children}
    </button>
  );
});

interface FieldShellProps {
  id: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  success?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FieldShell({ id, label, description, error, success, required, children, className }: FieldShellProps) {
  const descriptionId = `${id}-description`;
  const messageId = `${id}-message`;
  return (
    <div className={cn("dayly-field", className)} data-invalid={error ? "true" : undefined}>
      {label ? (
        <label className="dayly-field__label" htmlFor={id}>
          <span>{label}</span>
          {required ? <span className="dayly-field__required">Required</span> : null}
        </label>
      ) : null}
      {description ? <p className="dayly-field__description" id={descriptionId}>{description}</p> : null}
      {children}
      {error ? <p className="dayly-field__message dayly-field__message--error" id={messageId} role="alert">{error}</p> : null}
      {!error && success ? <p className="dayly-field__message dayly-field__message--success" id={messageId}>{success}</p> : null}
    </div>
  );
}

function describedBy(id: string, description?: React.ReactNode, error?: React.ReactNode, success?: React.ReactNode, existing?: string) {
  const ids = [
    description ? `${id}-description` : null,
    error || success ? `${id}-message` : null,
    existing,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  success?: React.ReactNode;
  loading?: boolean;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { id: providedId, className, label, description, error, success, loading, required, disabled, "aria-describedby": existingDescribedBy, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-input-${generatedId}`;
  return (
    <FieldShell id={id} label={label} description={description} error={error} success={success} required={required}>
      <div className="dayly-control-wrap">
        <input
          {...props}
          ref={ref}
          id={id}
          className={cn("dayly-input", className)}
          disabled={disabled || loading}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, description, error, success, existingDescribedBy)}
          aria-busy={loading || undefined}
        />
        {loading ? <Spinner size="sm" className="dayly-control-spinner" /> : null}
      </div>
    </FieldShell>
  );
});

export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function SearchInput(props, ref) {
  return <Input {...props} ref={ref} type="search" />;
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  success?: React.ReactNode;
  characterCount?: React.ReactNode;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id: providedId, className, label, description, error, success, characterCount, required, "aria-describedby": existingDescribedBy, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-textarea-${generatedId}`;
  return (
    <FieldShell id={id} label={label} description={description} error={error} success={success} required={required}>
      <textarea
        {...props}
        ref={ref}
        id={id}
        className={cn("dayly-textarea", className)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, description, error, success, existingDescribedBy)}
      />
      {characterCount ? <div className="dayly-field__count">{characterCount}</div> : null}
    </FieldShell>
  );
});

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  success?: React.ReactNode;
  options?: SelectOption[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id: providedId, className, label, description, error, success, options, loading, emptyMessage = "No options available", required, disabled, children, "aria-describedby": existingDescribedBy, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-select-${generatedId}`;
  return (
    <FieldShell id={id} label={label} description={description} error={error} success={success} required={required}>
      <select
        {...props}
        ref={ref}
        id={id}
        className={cn("dayly-select", className)}
        disabled={disabled || loading}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, description, error, success, existingDescribedBy)}
        aria-busy={loading || undefined}
      >
        {loading ? <option value="">Loading…</option> : null}
        {!loading && options && options.length === 0 ? <option value="">{emptyMessage}</option> : null}
        {options?.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        {children}
      </select>
    </FieldShell>
  );
});

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  success?: React.ReactNode;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Combobox({
  id: providedId,
  label,
  description,
  error,
  success,
  options,
  value,
  defaultValue = "",
  onValueChange,
  inputValue,
  defaultInputValue,
  onInputValueChange,
  placeholder = "Choose an option",
  loading = false,
  emptyMessage = "No results",
  disabled = false,
  required = false,
  className,
}: ComboboxProps) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-combobox-${generatedId}`;
  const listId = `${id}-listbox`;
  const [currentValue, setCurrentValue] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const selectedOption = options.find((option) => option.value === currentValue);
  const [currentInputValue, setCurrentInputValue] = useControllableState({
    value: inputValue,
    defaultValue: defaultInputValue ?? selectedOption?.label ?? "",
    onChange: onInputValueChange,
  });
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const described = describedBy(id, description, error, success);
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(currentInputValue.toLowerCase()));
  const enabledOptions = filteredOptions.filter((option) => !option.disabled);

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentInputValue(options.find((option) => option.value === value)?.label ?? "");
    }
  }, [options, setCurrentInputValue, value]);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return;
    setCurrentValue(option.value);
    setCurrentInputValue(option.label);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, enabledOptions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && enabledOptions[activeIndex]) {
      event.preventDefault();
      selectOption(enabledOptions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <FieldShell id={id} label={label} description={description} error={error} success={success} required={required} className={className}>
      <div className="dayly-combobox" ref={containerRef}>
        <input
          ref={inputRef}
          id={id}
          className="dayly-input dayly-combobox__input"
          value={currentInputValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          aria-busy={loading || undefined}
          onChange={(event) => {
            setCurrentInputValue(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {open ? (
          <div className="dayly-combobox__list" id={listId} role="listbox" aria-label={typeof label === "string" ? label : "Options"}>
            {loading ? <div className="dayly-combobox__status" role="status"><Spinner size="sm" /> Loading…</div> : null}
            {!loading && filteredOptions.length === 0 ? <div className="dayly-combobox__status" role="status">{emptyMessage}</div> : null}
            {!loading ? filteredOptions.map((option) => {
              const optionIndex = enabledOptions.indexOf(option);
              return (
                <button
                  type="button"
                  key={option.value}
                  id={`${listId}-option-${optionIndex}`}
                  className="dayly-combobox__option"
                  role="option"
                  aria-selected={option.value === currentValue}
                  aria-disabled={option.disabled || undefined}
                  data-active={optionIndex === activeIndex || undefined}
                  disabled={option.disabled}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </button>
              );
            }) : null}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id: providedId, className, label, description, error, indeterminate = false, disabled, ...props },
  forwardedRef,
) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-checkbox-${generatedId}`;
  const internalRef = React.useRef<HTMLInputElement>(null);
  const ref = (node: HTMLInputElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  React.useEffect(() => {
    if (internalRef.current) internalRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-message` : undefined;
  return (
    <div className={cn("dayly-check-field", className)} data-invalid={error ? "true" : undefined}>
      <label className="dayly-check-label" htmlFor={id}>
        <input
          {...props}
          ref={ref}
          id={id}
          type="checkbox"
          className="dayly-visually-hidden dayly-check-input"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        />
        <span className="dayly-check-box" aria-hidden="true" />
        <span className="dayly-check-copy">
          {label ? <span className="dayly-check-label__text">{label}</span> : null}
          {description ? <span className="dayly-check-description" id={descriptionId}>{description}</span> : null}
          {error ? <span className="dayly-field__message dayly-field__message--error" id={errorId}>{error}</span> : null}
        </span>
      </label>
    </div>
  );
});

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { id: providedId, className, label, description, disabled, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId ?? `dayly-switch-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  return (
    <label className={cn("dayly-switch-field", className)} htmlFor={id}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="dayly-visually-hidden dayly-switch-input"
        disabled={disabled}
        aria-describedby={descriptionId}
      />
      <span className="dayly-switch-track" aria-hidden="true"><span className="dayly-switch-thumb" /></span>
      <span className="dayly-switch-copy">
        {label ? <span className="dayly-switch-label">{label}</span> : null}
        {description ? <span className="dayly-switch-description" id={descriptionId}>{description}</span> : null}
      </span>
    </label>
  );
});

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function RadioGroup({ name: providedName, value, defaultValue, onValueChange, disabled, orientation = "vertical", className, children, ...props }: RadioGroupProps) {
  const generatedId = React.useId();
  const name = providedName ?? `dayly-radio-${generatedId}`;
  const [currentValue, setCurrentValue] = useControllableState({ value, defaultValue: defaultValue ?? "", onChange: onValueChange });
  return (
    <RadioGroupContext.Provider value={{ name, value: currentValue, disabled, onValueChange: setCurrentValue }}>
      <div {...props} className={cn("dayly-radio-group", className)} data-orientation={orientation} role="radiogroup">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name"> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(function RadioItem(
  { value, id: providedId, className, label, description, disabled, ...props },
  ref,
) {
  const context = React.useContext(RadioGroupContext);
  if (!context) throw new Error("RadioItem must be used inside RadioGroup");
  const generatedId = React.useId();
  const id = providedId ?? `dayly-radio-item-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const isDisabled = disabled || context.disabled;
  return (
    <label className={cn("dayly-radio-item", className)} htmlFor={id}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="radio"
        name={context.name}
        value={value}
        checked={context.value === value}
        onChange={() => context.onValueChange(String(value))}
        disabled={isDisabled}
        aria-describedby={descriptionId}
        className="dayly-visually-hidden dayly-radio-input"
      />
      <span className="dayly-radio-circle" aria-hidden="true" />
      <span className="dayly-radio-copy">
        <span className="dayly-radio-label">{label}</span>
        {description ? <span className="dayly-radio-description" id={descriptionId}>{description}</span> : null}
      </span>
    </label>
  );
});

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({ variant = "neutral", size = "md", className, ...props }: BadgeProps) {
  return <span {...props} className={cn("dayly-badge", className)} data-variant={variant} data-size={size} />;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  fallback?: React.ReactNode;
}

export function Avatar({ src, alt = "", initials, fallback, size = "md", className, ...props }: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);
  return (
    <span {...props} className={cn("dayly-avatar", className)} data-size={size}>
      {src && !imageFailed ? <img src={src} alt={alt} onError={() => setImageFailed(true)} /> : initials ? <span aria-hidden="true">{initials}</span> : fallback ?? <span aria-hidden="true">?</span>}
    </span>
  );
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export function Card({ variant = "default", interactive = false, selected = false, disabled = false, className, ...props }: CardProps) {
  return <div {...props} className={cn("dayly-card", className)} data-variant={variant} data-interactive={interactive || undefined} data-selected={selected || undefined} data-disabled={disabled || undefined} aria-disabled={disabled || undefined} />;
}

export const Surface = Card;

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
  return <div {...props} className={cn("dayly-separator", className)} data-orientation={orientation} role="separator" aria-orientation={orientation} />;
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export function Progress({ value, max = 100, label = "Progress", showValue = false, className, ...props }: ProgressProps) {
  const boundedValue = value === undefined ? undefined : Math.min(Math.max(value, 0), max);
  return (
    <div className={cn("dayly-progress-group", className)} {...props}>
      <div className="dayly-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={boundedValue} aria-valuetext={boundedValue === undefined ? "Loading" : `${boundedValue} of ${max}`} data-indeterminate={boundedValue === undefined || undefined}>
        <span className="dayly-progress__bar" style={boundedValue === undefined ? undefined : { inlineSize: `${(boundedValue / max) * 100}%` }} />
      </div>
      {showValue ? <span className="dayly-progress__value">{boundedValue === undefined ? "Loading" : `${boundedValue}%`}</span> : null}
    </div>
  );
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return <span {...props} className={cn("dayly-spinner", className)} data-size={size} role="status" aria-label={label} />;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "text" | "rectangular" | "avatar" | "row";
  width?: string;
  height?: string;
}

export function Skeleton({ variant = "rectangular", width, height, className, style, ...props }: SkeletonProps) {
  return <span {...props} className={cn("dayly-skeleton", className)} data-variant={variant} aria-hidden="true" style={{ ...style, inlineSize: width, blockSize: height }} />;
}

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({ variant = "info", title, description, action, dismissible, onDismiss, className, children, ...props }: AlertProps) {
  const role = variant === "danger" ? "alert" : "status";
  return (
    <div {...props} className={cn("dayly-alert", className)} data-variant={variant} role={role}>
      <div className="dayly-alert__copy">
        {title ? <strong className="dayly-alert__title">{title}</strong> : null}
        {description ? <span className="dayly-alert__description">{description}</span> : null}
        {children}
      </div>
      {action ? <div className="dayly-alert__action">{action}</div> : null}
      {dismissible ? <IconButton aria-label="Dismiss message" size="sm" onClick={onDismiss}>×</IconButton> : null}
    </div>
  );
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return <div {...props} className={cn("dayly-state dayly-empty-state", className)}>{icon ? <div className="dayly-state__icon" aria-hidden="true">{icon}</div> : null}<h2>{title}</h2>{description ? <p>{description}</p> : null}{action ? <div className="dayly-state__action">{action}</div> : null}</div>;
}

export interface ErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  retryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function ErrorState({ title, description, retryAction, secondaryAction, className, ...props }: ErrorStateProps) {
  return <div {...props} className={cn("dayly-state dayly-error-state", className)} role="alert"><div className="dayly-state__icon" aria-hidden="true">!</div><h2>{title}</h2>{description ? <p>{description}</p> : null}<div className="dayly-state__actions">{retryAction}{secondaryAction}</div></div>;
}

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  maxItems?: number;
}

export function Breadcrumbs({ items, maxItems = 4, className, ...props }: BreadcrumbsProps) {
  const visibleItems = items.length > maxItems ? [items[0], { label: "…" }, ...items.slice(-maxItems + 1)] : items;
  return <nav {...props} className={cn("dayly-breadcrumbs", className)} aria-label="Breadcrumb"><ol>{visibleItems.map((item, index) => <li key={`${String(item.label)}-${index}`}>{item.href && !item.current ? <a href={item.href}>{item.label}</a> : <span aria-current={item.current ? "page" : undefined}>{item.label}</span>}{index < visibleItems.length - 1 ? <span className="dayly-breadcrumbs__separator" aria-hidden="true">/</span> : null}</li>)}</ol></nav>;
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function paginationItems(page: number, pageCount: number, siblingCount: number) {
  const items: Array<number | "ellipsis"> = [];
  const start = Math.max(2, page - siblingCount);
  const end = Math.min(pageCount - 1, page + siblingCount);
  items.push(1);
  if (start > 2) items.push("ellipsis");
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < pageCount - 1) items.push("ellipsis");
  if (pageCount > 1) items.push(pageCount);
  return items;
}

export function Pagination({ page, pageCount, onPageChange, siblingCount = 1, className, ...props }: PaginationProps) {
  if (pageCount < 2) return null;
  return <nav {...props} className={cn("dayly-pagination", className)} aria-label="Pagination"><button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Previous</button><ol>{paginationItems(page, pageCount, siblingCount).map((item, index) => item === "ellipsis" ? <li key={`ellipsis-${index}`}><span aria-hidden="true">…</span></li> : <li key={item}><button type="button" aria-current={item === page ? "page" : undefined} onClick={() => onPageChange(item)}>{item}</button></li>)}</ol><button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount}>Next</button></nav>;
}

export function Table({ caption, children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { caption?: React.ReactNode }) {
  return <div className="dayly-table-wrap"><table {...props} className={cn("dayly-table", className)}>{caption ? <caption>{caption}</caption> : null}{children}</table></div>;
}
export const TableHeader = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />;
export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />;
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> { selected?: boolean; }
export function TableRow({ selected, className, ...props }: TableRowProps) { return <tr {...props} className={cn(className)} data-selected={selected || undefined} aria-selected={selected || undefined} />; }
export const TableHead = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} />;
export const TableCell = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />;
