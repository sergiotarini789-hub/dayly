import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, Checkbox, Combobox, Input, Progress, RadioGroup, RadioItem, Select, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui";

describe("core form primitives", () => {
  it("keeps button loading state accessible and layout-stable", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".dayly-button__content")).toHaveTextContent("Save");
    expect(button).toHaveAttribute("data-loading", "true");
  });

  it("associates input labels, descriptions, and errors", () => {
    render(<Input label="Display name" description="Shown to other people" error="Use at least two characters." />);
    const input = screen.getByRole("textbox", { name: "Display name" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Shown to other people Use at least two characters.");
  });

  it("supports a native indeterminate checkbox and switch semantics", () => {
    render(<><Checkbox label="Partial selection" indeterminate /><Switch label="Enable option" /></>);
    const checkbox = screen.getByRole("checkbox", { name: "Partial selection" }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(screen.getByRole("switch", { name: "Enable option" })).toBeInTheDocument();
  });

  it("supports radio grouping and keyboard selection through native semantics", () => {
    render(<RadioGroup name="choice" defaultValue="one"><RadioItem value="one" label="One" /><RadioItem value="two" label="Two" /></RadioGroup>);
    const one = screen.getByRole("radio", { name: "One" });
    const two = screen.getByRole("radio", { name: "Two" });
    expect(one).toBeChecked();
    fireEvent.click(two);
    expect(two).toBeChecked();
  });

  it("supports combobox filtering and keyboard selection", () => {
    render(<Combobox label="Choose" options={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]} />);
    const input = screen.getByRole("combobox", { name: "Choose" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Bet" } });
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("Beta");
  });

  it("renders determinate and indeterminate progress semantics", () => {
    const { rerender } = render(<Progress value={40} max={80} label="Completion" />);
    expect(screen.getByRole("progressbar", { name: "Completion" })).toHaveAttribute("aria-valuenow", "40");
    rerender(<Progress label="Loading" />);
    expect(screen.getByRole("progressbar", { name: "Loading" })).not.toHaveAttribute("aria-valuenow");
  });

  it("keeps native select and textarea labels available", () => {
    render(<><Select label="Category" options={[{ value: "a", label: "A" }]} /><Textarea label="Notes" /></>);
    expect(screen.getByRole("combobox", { name: "Category" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("supports tab selection with the tab role", () => {
    render(<Tabs defaultValue="one"><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">One content</TabsContent><TabsContent value="two">Two content</TabsContent></Tabs>);
    const secondTab = screen.getByRole("tab", { name: "Two" });
    expect(screen.getByRole("tabpanel")).toHaveTextContent("One content");
    fireEvent.click(secondTab);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Two content");
  });
});
