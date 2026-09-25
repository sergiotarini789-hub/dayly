import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OnboardingExperience, TodayExperience } from "@/components/product";

afterEach(() => window.history.replaceState(null, "", "/"));

describe("product-facing foundations", () => {
  it("guides a first Today action and keeps an in-memory task usable", () => {
    render(<TodayExperience />);
    expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening)/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Give the day a beginning." })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Add a task" }), { target: { value: "Review the day" } });
    fireEvent.click(screen.getByRole("button", { name: "Add to Today" }));

    const task = screen.getByRole("checkbox", { name: /Review the day/ });
    expect(task).not.toBeChecked();
    expect(screen.queryByRole("heading", { name: "Give the day a beginning." })).not.toBeInTheDocument();
    fireEvent.click(task);
    expect(task).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Task marked complete");
  });

  it("uses onboarding session context to personalize Today without persistence", () => {
    window.history.replaceState(null, "", "/today?name=Sam&availability=flexible&planningStyle=deep");
    render(<TodayExperience />);

    expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening), Sam/ })).toBeInTheDocument();
    expect(screen.getByText("Flexible time")).toBeInTheDocument();
    expect(screen.getByText("Deep work first")).toBeInTheDocument();
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
