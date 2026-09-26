import * as React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplicationShell, MotionList, MotionListItem, PageContainer, PageHeader, Panel } from "@/components/layout";

function ShellFixture() {
  return <ApplicationShell topBar={<header>Fixture top bar</header>}><PageContainer width="narrow"><PageHeader title="Fixture page" description="A layout composition test." /><Panel>Content region</Panel></PageContainer></ApplicationShell>;
}

describe("Dayly layout system", () => {
  it("provides an application main landmark and skip link", () => {
    render(<ShellFixture />);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#dayly-main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "dayly-main-content");
    expect(screen.getByRole("heading", { name: "Fixture page", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Content region")).toBeInTheDocument();
  });

  it("tracks active navigation and supports desktop sidebar collapse", () => {
    render(<ShellFixture />);
    const sidebar = screen.getByRole("complementary", { name: "Dayly application navigation" });
    const tasksLink = within(sidebar).getByRole("link", { name: "Tasks" });
    expect(within(sidebar).getByRole("link", { name: "Today" })).toHaveAttribute("aria-current", "page");
    fireEvent.click(tasksLink);
    expect(tasksLink).toHaveAttribute("aria-current", "page");
    expect(tasksLink).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Opening Tasks");
    expect(document.querySelector(".dayly-navigation-progress")).toHaveAttribute("data-visible", "true");
    const collapse = within(sidebar).getByRole("button", { name: "Collapse navigation" });
    fireEvent.click(collapse);
    expect(collapse).toHaveAttribute("aria-expanded", "false");
    expect(collapse).toHaveAccessibleName("Expand navigation");
  });

  it("opens the mobile More surface and selects a lower-frequency destination", async () => {
    render(<ShellFixture />);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    const dialog = screen.getByRole("dialog", { name: "More navigation" });
    expect(within(dialog).getByRole("link", { name: "Projects" })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("link", { name: "Projects" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "More navigation" })).not.toBeInTheDocument());
    const sidebar = screen.getByRole("complementary", { name: "Dayly application navigation" });
    expect(within(sidebar).getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps page containers and panels composition-friendly", () => {
    render(<ShellFixture />);
    expect(document.querySelector(".dayly-page-container[data-width='narrow']")).toBeInTheDocument();
    expect(document.querySelector(".dayly-panel[data-variant='standard']")).toHaveTextContent("Content region");
  });

  it("exposes generic list motion states without coupling to a domain", () => {
    render(<MotionList label="Placeholder list"><MotionListItem motionState="enter" selected>Selected placeholder</MotionListItem><MotionListItem motionState="move">Available placeholder</MotionListItem></MotionList>);
    expect(screen.getByRole("list", { name: "Placeholder list" })).toBeInTheDocument();
    expect(screen.getByText("Selected placeholder")).toHaveAttribute("data-motion-state", "enter");
    expect(screen.getByText("Selected placeholder")).toHaveAttribute("aria-current", "true");
  });
});
