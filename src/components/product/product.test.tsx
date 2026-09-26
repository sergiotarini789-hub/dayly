import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FocusExperience, OnboardingExperience, SearchExperience, TasksExperience, TodayExperience } from "@/components/product";

afterEach(() => window.history.replaceState(null, "", "/"));

describe("product-facing foundations", () => {
  it("guides a first Today action and keeps an in-memory task usable", () => {
    render(<TodayExperience />);
    expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening|night)/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Give the day a beginning." })).toBeInTheDocument();
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add your first task →" }));
    const composer = screen.getByRole("textbox", { name: "Add a task" });
    expect(composer).toHaveFocus();
    fireEvent.change(composer, { target: { value: "Review the day" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to Today" }));

    const task = screen.getByRole("checkbox", { name: /Review the day/ });
    expect(task).not.toBeChecked();
    expect(screen.getByRole("heading", { name: "Review the day" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complete task" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open in plan →" })).toHaveAttribute("href", "#today-plan");
    expect(screen.queryByRole("heading", { name: "Give the day a beginning." })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Complete task" }));
    const completedTask = screen.getByRole("checkbox", { name: /Review the day/ });
    expect(completedTask).toBeChecked();
    expect(screen.getByText("1 / 1 complete")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Task marked complete");

    fireEvent.click(completedTask);
    const reopenedTask = screen.getByRole("checkbox", { name: /Review the day/ });
    expect(reopenedTask).not.toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Task reopened");

    fireEvent.change(composer, { target: { value: "Call brother" } });
    fireEvent.submit(composer.closest("form")!);
    expect(screen.getByRole("checkbox", { name: /Call brother/ })).toBeInTheDocument();
    expect(composer).toHaveFocus();
    fireEvent.keyDown(composer, { key: "Escape" });
    expect(composer).not.toHaveFocus();
    expect(screen.getByRole("button", { name: "Add a task" })).toHaveAttribute("aria-expanded", "false");
  });

  it("uses onboarding session context to personalize Today without persistence", () => {
    window.history.replaceState(null, "", "/today?name=Sam&availability=flexible&planningStyle=deep");
    render(<TodayExperience />);

    expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening|night), Sam/ })).toBeInTheDocument();
    expect(screen.getByText("Flexible time")).toBeInTheDocument();
    expect(screen.getByText("Deep work first")).toBeInTheDocument();
  });

  it("keeps the product surfaces useful without inventing persisted data", () => {
    render(<TasksExperience />);
    expect(screen.getByRole("heading", { name: "Tasks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your task list is clear." })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Add something to today" }), { target: { value: "Make room for the important thing" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const task = screen.getByRole("checkbox", { name: /Make room for the important thing/ });
    fireEvent.click(task);
    expect(task).toBeChecked();

    render(<FocusExperience />);
    expect(screen.getByRole("heading", { name: "Choose one thing to stay with." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start focus" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    render(<SearchExperience />);
    const search = screen.getByRole("searchbox", { name: "Search Dayly" });
    expect(search).toHaveFocus();
    fireEvent.change(search, { target: { value: "unknown" } });
    expect(screen.getByRole("heading", { name: "Nothing matches “unknown”." })).toBeInTheDocument();
    search.blur();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(search).toHaveFocus();
  });

  it("keeps onboarding lightweight and keyboard-operable across steps", () => {
    render(<OnboardingExperience />);
    expect(screen.getByRole("heading", { name: "Set up a day that fits you." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Understand the day, then choose what matters." })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Step 1 of 4" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("heading", { name: "Give Today some context." })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Step 2 of 4" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Balanced day/ })).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("heading", { name: "Make the space feel like yours." })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Step 3 of 4" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Display name" }), { target: { value: "Alex" } });
  });
});
