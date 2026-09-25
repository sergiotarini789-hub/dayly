"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioItem,
  SearchInput,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Surface,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToast,
} from "@/components/ui";
import "./showcase.css";

function ShowcaseActions() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const { toast } = useToast();
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }
  return <div className="showcase-actions"><Button variant="outline" onClick={toggleTheme}>Use {theme === "light" ? "dark" : "light"} theme</Button><Button onClick={() => toast({ title: "Toast created", description: "This is a non-blocking UI confirmation.", variant: "success", action: { label: "Undo", onClick: () => undefined } })}>Show toast</Button></div>;
}

function ButtonSection() {
  return <section className="showcase-section" aria-labelledby="buttons-heading"><h2 id="buttons-heading">Buttons and controls</h2><div className="showcase-row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="outline">Outline</Button><Button variant="destructive">Destructive</Button><Button variant="link">Link</Button><Button loading>Loading</Button><IconButton aria-label="Add item" tooltip="Add item">＋</IconButton><IconButton aria-label="More options" variant="outline">⋯</IconButton></div><div className="showcase-row"><Button size="sm">Compact</Button><Button>Focused default</Button><Button size="lg">Comfortable</Button><Button fullWidth variant="secondary">Full width</Button></div></section>;
}

function FormSection() {
  const [checked, setChecked] = React.useState(true);
  const [switchOn, setSwitchOn] = React.useState(false);
  const [radio, setRadio] = React.useState("one");
  return <section className="showcase-section" aria-labelledby="forms-heading"><h2 id="forms-heading">Forms</h2><div className="showcase-grid showcase-grid--forms"><Input label="Label" description="Supporting description" placeholder="Type something" required /><SearchInput label="Search foundation" placeholder="Search" /><Input label="Error state" value="Needs attention" readOnly error="Explain how to fix this value." /><Input label="Success state" value="Looks good" readOnly success="This value is ready." /><Textarea label="Multiline input" description="Resize is available when more room is needed." placeholder="Write a note" characterCount="0 / 240" /><Select label="Native select" options={[{ value: "one", label: "First option" }, { value: "two", label: "Second option" }, { value: "three", label: "Disabled option", disabled: true }]} /><Combobox label="Combobox" options={[{ value: "one", label: "First option" }, { value: "two", label: "Second option" }, { value: "three", label: "Disabled option", disabled: true }]} placeholder="Filter options" /><div className="showcase-control-stack"><Checkbox label="Checkbox" description="Native checkbox semantics" checked={checked} onChange={(event) => setChecked(event.target.checked)} /><Checkbox label="Indeterminate checkbox" indeterminate /><Switch label="Switch" description="Native switch semantics" checked={switchOn} onChange={(event) => setSwitchOn(event.target.checked)} /><RadioGroup name="showcase-radio" value={radio} onValueChange={setRadio}><RadioItem value="one" label="Radio one" /><RadioItem value="two" label="Radio two" description="Keyboard arrow navigation is native." /><RadioItem value="three" label="Disabled radio" disabled /></RadioGroup></div></div></section>;
}

function FeedbackSection() {
  return <section className="showcase-section" aria-labelledby="feedback-heading"><h2 id="feedback-heading">Feedback and data display</h2><div className="showcase-grid"><div className="showcase-stack"><div className="showcase-row"><Badge>Neutral</Badge><Badge variant="primary">Primary</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="danger">Danger</Badge><Badge variant="info">Info</Badge></div><div className="showcase-row"><Avatar initials="DK" size="sm" /><Avatar initials="UI" /><Avatar fallback="?" size="lg" /></div><Progress value={62} label="Example progress" showValue /><Progress label="Loading progress" /><div className="showcase-row"><Spinner size="sm" /><Spinner /><Spinner size="lg" /><Skeleton variant="text" /><Skeleton variant="avatar" /><Skeleton variant="row" /></div></div><div className="showcase-stack"><Alert title="Information" description="A calm, non-blocking message." /><Alert variant="success" title="Success" description="The UI state can be announced without a feature domain." /><Alert variant="warning" title="Warning" description="Warnings are not communicated by color alone." action={<Button size="sm" variant="outline">Review</Button>} /><Alert variant="danger" title="Error" description="The affected scope and recovery action are visible." /></div></div><div className="showcase-grid showcase-grid--states"><EmptyState icon="○" title="Nothing here yet" description="Empty states explain the next useful action." action={<Button>Create example</Button>} /><ErrorState title="Could not load example" description="The state remains recoverable." retryAction={<Button>Retry</Button>} secondaryAction={<Button variant="ghost">Dismiss</Button>} /></div></section>;
}

function NavigationSection() {
  const [page, setPage] = React.useState(2);
  return <section className="showcase-section" aria-labelledby="navigation-heading"><h2 id="navigation-heading">Navigation and data foundations</h2><Breadcrumbs items={[{ label: "Showcase", href: "/showcase" }, { label: "Foundations", current: true }]} /><Separator /><Tabs defaultValue="first"><TabsList><TabsTrigger value="first">First tab</TabsTrigger><TabsTrigger value="second">Second tab</TabsTrigger><TabsTrigger value="disabled" disabled>Disabled tab</TabsTrigger></TabsList><TabsContent value="first">Tab content is associated with its selected tab.</TabsContent><TabsContent value="second">Keyboard arrows move between tabs.</TabsContent><TabsContent value="disabled">Unavailable content.</TabsContent></Tabs><Collapsible defaultOpen><CollapsibleTrigger>Collapsible section <span aria-hidden="true">⌄</span></CollapsibleTrigger><CollapsibleContent>Collapsible content is hidden from assistive technology while closed.</CollapsibleContent></Collapsible><Accordion type="single" defaultValue="one"><AccordionItem value="one"><AccordionTrigger>Accordion item one <span aria-hidden="true">⌄</span></AccordionTrigger><AccordionContent>Use an accordion only when progressive disclosure helps comprehension.</AccordionContent></AccordionItem><AccordionItem value="two"><AccordionTrigger>Accordion item two <span aria-hidden="true">⌄</span></AccordionTrigger><AccordionContent>Not every expandable region needs this pattern.</AccordionContent></AccordionItem></Accordion><Table caption="Presentational table"><TableHeader><TableRow><TableHead>Label</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow selected><TableCell>Selected row</TableCell><TableCell><Badge variant="success">Ready</Badge></TableCell></TableRow><TableRow><TableCell>Second row</TableCell><TableCell><Badge>Neutral</Badge></TableCell></TableRow></TableBody></Table><Pagination page={page} pageCount={5} onPageChange={setPage} /></section>;
}

function OverlaySection() {
  return <section className="showcase-section" aria-labelledby="overlays-heading"><h2 id="overlays-heading">Overlays</h2><div className="showcase-row"><Tooltip content="Tooltips are supplemental"><Button variant="outline">Hover or focus</Button></Tooltip><Popover><PopoverTrigger>Open popover</PopoverTrigger><PopoverContent><strong>Popover content</strong><p>Dismiss with Escape or by choosing another action.</p></PopoverContent></Popover><DropdownMenu><DropdownMenuTrigger>Open menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Regular action</DropdownMenuItem><DropdownMenuItem disabled>Disabled action</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem destructive>Destructive action</DropdownMenuItem></DropdownMenuContent></DropdownMenu><Dialog><DialogTrigger>Open dialog</DialogTrigger><DialogContent title="Dialog title" description="Dialogs have a labelled focus scope and Escape dismissal."><p>Dialog content is intentionally domain-agnostic.</p><DialogClose className="dayly-button" data-variant="secondary">Close dialog</DialogClose></DialogContent></Dialog><Drawer><DrawerTrigger>Open sheet</DrawerTrigger><DrawerContent title="Responsive sheet" description="The same foundation can adapt from a bottom sheet to a side sheet."><p>Use sheets for focused contextual work on smaller screens.</p><DialogClose className="dayly-button" data-variant="primary">Close sheet</DialogClose></DrawerContent></Drawer></div></section>;
}

function ShowcaseContent() {
  return <main className="showcase-shell"><header className="showcase-header"><div><Badge variant="primary">Development only</Badge><h1>Dayly Core UI</h1><p>Reusable, domain-agnostic primitives for calm, accessible, information-rich interfaces.</p></div><ShowcaseActions /></header><div className="showcase-callout"><Alert variant="info" title="Scope boundary" description="This showcase demonstrates components only. It contains no product pages, domain records, persistence, API calls, or feature logic." /></div><ButtonSection /><FormSection /><FeedbackSection /><NavigationSection /><OverlaySection /></main>;
}

export function ComponentShowcase() {
  return <ToastProvider><ShowcaseContent /><div className="showcase-toast-anchor"><ToastViewport /></div></ToastProvider>;
}
