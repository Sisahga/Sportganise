import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import FooterNav from "./FooterNav";

describe("FooterNav", () => {
  it("renders all navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <FooterNav />
      </MemoryRouter>,
    );
    const labels = ["Home", "Calendar", "Alerts", "Inbox", "Profile"];
    labels.forEach((label) => {
      const element = screen.getByText(label);
      expect(document.body.contains(element)).toBe(true);
    });
  });

  it("highlights the active route for '/'", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <FooterNav />
      </MemoryRouter>,
    );
    // For the '/' path, the "Home" route should be active.
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink?.classList.contains("text-secondaryColour")).toBe(true);
    expect(homeLink?.classList.contains("bg-textPlaceholderColour")).toBe(true);

    // Other links should be inactive.
    const calendarLink = screen.getByText("Calendar").closest("a");
    expect(calendarLink?.classList.contains("text-primaryColour")).toBe(true);
    expect(calendarLink?.classList.contains("bg-textPlaceholderColour")).toBe(
      false,
    );
  });

  it("highlights the active route for '/pages/CalendarPage'", () => {
    render(
      <MemoryRouter initialEntries={["/pages/CalendarPage"]}>
        <FooterNav />
      </MemoryRouter>,
    );
    // For '/pages/CalendarPage', the "Calendar" route should be active.
    const calendarLink = screen.getByText("Calendar").closest("a");
    expect(calendarLink?.classList.contains("text-secondaryColour")).toBe(true);
    expect(calendarLink?.classList.contains("bg-textPlaceholderColour")).toBe(
      true,
    );

    // "Home" should be inactive.
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink?.classList.contains("text-primaryColour")).toBe(true);
    expect(homeLink?.classList.contains("bg-textPlaceholderColour")).toBe(
      false,
    );
  });

  it("renders links with correct hrefs", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <FooterNav />
      </MemoryRouter>,
    );

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink?.getAttribute("href")).toBe("/");

    const calendarLink = screen.getByText("Calendar").closest("a");
    expect(calendarLink?.getAttribute("href")).toBe("/pages/CalendarPage");

    const alertsLink = screen.getByText("Alerts").closest("a");
    expect(alertsLink?.getAttribute("href")).toBe("/pages/NotificationsPage");

    const inboxLink = screen.getByText("Inbox").closest("a");
    expect(inboxLink?.getAttribute("href")).toBe(
      "/pages/DirectMessagesDashboard",
    );

    const profileLink = screen.getByText("Profile").closest("a");
    expect(profileLink?.getAttribute("href")).toBe("/pages/ProfilePage");
  });
});
