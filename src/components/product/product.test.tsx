import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CalendarExperience, FocusExperience, HabitsExperience, OnboardingExperience, ProductSessionProvider, ProjectsExperience, SearchExperience, SettingsExperience, TasksExperience, TodayExperience } from "@/components/product";

afterEach(() => {
  window.history.replaceState(null, "", "/");
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.reduceMotion;
});

function renderProduct(node: React.ReactNode) {
  return render(<ProductSessionProvider>{node}</ProductSessionProvider>);
}

function SessionRouteFixture() {
  const [route, setRoute] = React.useState<"today" | "tasks">("today");
  return <ProductSessionProvider><button onClick={() => setRoute(route === "today" ? "tasks" : "today")}>Open {route === "today" ? "Tasks" : "Today"} fixture</button>{route === "today" ? <TodayExperience /> : <TasksExperience />}</ProductSessionProvider>;
}

describe("product-facing foundations", () => {
  it("guides a first Today action and keeps an in-memory task usable", () => {
    renderProduct(<TodayExperience />);
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
    expect(screen.getByRole("button", { name: "Add task" })).toHaveAttribute("aria-expanded", "false");
  });

  it("uses onboarding session context to personalize Today without persistence", () => {
    window.history.replaceState(null, "", "/today?name=Sam&availability=flexible&planningStyle=deep");
    renderProduct(<TodayExperience />);

    expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening|night), Sam/ })).toBeInTheDocument();
    expect(screen.getByText("Flexible time")).toBeInTheDocument();
    expect(screen.getByText("Deep work first")).toBeInTheDocument();
  });

  it("keeps the product surfaces useful without inventing persisted data", () => {
    renderProduct(<TasksExperience />);
    expect(screen.getByRole("heading", { name: "Tasks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your task list is clear." })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Add something to today" }), { target: { value: "Make room for the important thing" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const task = screen.getByRole("checkbox", { name: /Make room for the important thing/ });
    fireEvent.click(task);
    expect(task).toBeChecked();

    renderProduct(<FocusExperience />);
    expect(screen.getByRole("heading", { name: "Choose one thing to stay with." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start focus" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    renderProduct(<SearchExperience />);
    const search = screen.getByRole("searchbox", { name: "Search Dayly" });
    expect(search).toHaveFocus();
    fireEvent.change(search, { target: { value: "unknown" } });
    expect(screen.getByRole("heading", { name: "Nothing matches “unknown”." })).toBeInTheDocument();
    search.blur();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(search).toHaveFocus();
  });

  it("keeps session work available when moving between Today and Tasks", () => {
    render(<SessionRouteFixture />);
    fireEvent.click(screen.getByRole("button", { name: "Add your first task →" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Add a task" }), { target: { value: "Carry context forward" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to Today" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Tasks fixture" }));
    const sharedTask = screen.getByRole("checkbox", { name: /Carry context forward/ });
    expect(sharedTask).not.toBeChecked();
    fireEvent.click(sharedTask);
    fireEvent.click(screen.getByRole("button", { name: "Open Today fixture" }));
    expect(screen.getByRole("checkbox", { name: /Carry context forward/ })).toBeChecked();
    expect(screen.getByText("1 / 1 complete")).toBeInTheDocument();
  });

  it("moves empty-state actions directly to their capture controls", () => {
    const view = renderProduct(<TasksExperience />);
    fireEvent.click(screen.getByRole("button", { name: "Add a task →" }));
    expect(screen.getByRole("textbox", { name: "Add something to today" })).toHaveFocus();

    view.rerender(<ProductSessionProvider><CalendarExperience /></ProductSessionProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Add a commitment →" }));
    expect(screen.getByRole("textbox", { name: "Commitment" })).toHaveFocus();

    view.rerender(<ProductSessionProvider><HabitsExperience /></ProductSessionProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Add your first habit →" }));
    expect(screen.getByRole("textbox", { name: "Add a habit" })).toHaveFocus();
  });

  it("dismisses the project editor without retaining an abandoned draft", () => {
    renderProduct(<ProjectsExperience />);
    fireEvent.click(screen.getByRole("button", { name: "New project +" }));
    const name = screen.getByRole("textbox", { name: "Project name" });
    fireEvent.change(name, { target: { value: "Abandoned draft" } });
    fireEvent.keyDown(name, { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Project name" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "New project +" }));
    expect(screen.getByRole("textbox", { name: "Project name" })).toHaveValue("");
  });

  it("keeps project, calendar, habit, focus, search, and setting interactions coherent", () => {
    const view = renderProduct(<ProjectsExperience />);
    fireEvent.click(screen.getByRole("button", { name: "New project +" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Project name" }), { target: { value: "Launch the calm plan" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Outcome" }), { target: { value: "A clear next release" } });
    fireEvent.click(screen.getByRole("button", { name: "Add project" }));
    expect(screen.getByRole("heading", { name: "Launch the calm plan" })).toBeInTheDocument();

    view.rerender(<ProductSessionProvider><CalendarExperience /></ProductSessionProvider>);
    fireEvent.change(screen.getByRole("textbox", { name: "Commitment" }), { target: { value: "Planning call" } });
    fireEvent.click(screen.getByRole("button", { name: "Add time" }));
    expect(screen.getByText("Planning call")).toBeInTheDocument();

    view.rerender(<ProductSessionProvider><HabitsExperience /></ProductSessionProvider>);
    fireEvent.change(screen.getByRole("textbox", { name: "Add a habit" }), { target: { value: "Review tomorrow" } });
    fireEvent.click(screen.getByRole("button", { name: "Add habit" }));
    fireEvent.click(screen.getByRole("button", { name: "Complete Review tomorrow" }));
    expect(screen.getByText("Kept today")).toBeInTheDocument();

    view.rerender(<ProductSessionProvider><FocusExperience /></ProductSessionProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Start focus" }));
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    fireEvent.click(screen.getByRole("button", { name: "Complete" }));
    expect(screen.getByText("Session complete")).toBeInTheDocument();

    view.rerender(<ProductSessionProvider><SearchExperience /></ProductSessionProvider>);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search Dayly" }), { target: { value: "calm plan" } });
    expect(screen.getByText("Launch the calm plan")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("searchbox", { name: "Search Dayly" })).toHaveValue("");

    view.rerender(<ProductSessionProvider><SettingsExperience /></ProductSessionProvider>);
    fireEvent.change(screen.getByRole("combobox", { name: "Theme" }), { target: { value: "dark" } });
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
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
