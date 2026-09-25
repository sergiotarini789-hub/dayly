import * as React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, Dialog, DialogClose, DialogContent, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Drawer, DrawerContent, DrawerTrigger, Popover, PopoverContent, PopoverTrigger, ToastProvider, ToastViewport, Tooltip, useToast } from "@/components/ui";

function ToastDemo() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: "Saved", description: "The action completed.", variant: "success" })}>Notify</Button>;
}

describe("core overlay primitives", () => {
  it("opens a dialog, manages focus, and closes on Escape", async () => {
    render(<Dialog><DialogTrigger>Open dialog</DialogTrigger><DialogContent title="Example dialog" description="A labelled dialog"><p>Content</p><DialogClose>Close</DialogClose></DialogContent></Dialog>);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Example dialog" })).toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { name: "Example dialog" });
    expect(within(dialog).getByRole("button", { name: "Close dialog" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("provides a responsive drawer foundation with dialog semantics", () => {
    render(<Drawer><DrawerTrigger>Open sheet</DrawerTrigger><DrawerContent title="Sheet title"><p>Sheet content</p></DrawerContent></Drawer>);
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(screen.getByRole("dialog", { name: "Sheet title" })).toBeInTheDocument();
  });

  it("removes an overlay immediately when reduced motion is preferred", async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn().mockReturnValue({ matches: true, media: "(prefers-reduced-motion: reduce)" }) });
    try {
      render(<Dialog><DialogTrigger>Open reduced dialog</DialogTrigger><DialogContent title="Reduced dialog"><p>Content</p></DialogContent></Dialog>);
      const trigger = screen.getByRole("button", { name: "Open reduced dialog" });
      fireEvent.click(trigger);
      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => expect(document.querySelector(".dayly-dialog")).not.toBeInTheDocument());
      expect(trigger).toHaveFocus();
    } finally {
      Object.defineProperty(window, "matchMedia", { configurable: true, value: originalMatchMedia });
    }
  });

  it("dismisses popovers with Escape", async () => {
    render(<Popover><PopoverTrigger>Open popover</PopoverTrigger><PopoverContent><p>Popover body</p></PopoverContent></Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Popover body");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open popover" })).toHaveFocus();
  });

  it("supports menu keyboard navigation and disabled items", async () => {
    render(<DropdownMenu><DropdownMenuTrigger>Open menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>First</DropdownMenuItem><DropdownMenuItem disabled>Unavailable</DropdownMenuItem><DropdownMenuItem>Last</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("menu");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Last" })).toHaveFocus();
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
  });

  it("shows a tooltip on focus without making it the only label", async () => {
    render(<Tooltip content="Supplemental help"><Button aria-label="Helpful action">Action</Button></Tooltip>);
    const button = screen.getByRole("button", { name: "Helpful action" });
    fireEvent.focus(button);
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("Supplemental help"), { timeout: 600 });
  });

  it("announces toast notifications and supports dismissal", () => {
    render(<ToastProvider><ToastDemo /><ToastViewport /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });
});
