import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import NotificationSettings from "./NotificationSettingsContent";

describe("NotificationSettings", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("renders Notification Settings header and description", () => {
    render(
      <MemoryRouter>
        <NotificationSettings />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Notification Settings/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Choose how you want to receive notifications/i),
    ).toBeInTheDocument();
  });

  it("renders notification channels with default values", () => {
    render(
      <MemoryRouter>
        <NotificationSettings />
      </MemoryRouter>,
    );

    // Email should be checked by default, Phone should not be.
    const emailCheckbox = screen.getByLabelText("Email");
    const phoneCheckbox = screen.getByLabelText("Phone");

    expect(emailCheckbox).toBeChecked();
    expect(phoneCheckbox).not.toBeChecked();

    // With at least one channel selected, notification preferences should be visible.
    expect(screen.getByText(/Notification preferences/i)).toBeInTheDocument();
  });

  it("toggles notification channel and displays warning when none selected", () => {
    render(
      <MemoryRouter>
        <NotificationSettings />
      </MemoryRouter>,
    );

    const emailCheckbox = screen.getByLabelText("Email");

    // Toggle off Email.
    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).not.toBeChecked();

    // Both Email and Phone are off, so a warning should appear.
    expect(
      screen.getByText(
        /Select at least one notification method to configure your notifications/i,
      ),
    ).toBeInTheDocument();

    // Notification preferences section should not be rendered.
    expect(
      screen.queryByText(/Notification preferences/i),
    ).not.toBeInTheDocument();
  });

  it("toggles a notification preference switch", () => {
    render(
      <MemoryRouter>
        <NotificationSettings />
      </MemoryRouter>,
    );

    // Locate the "Training Sessions" label.
    const trainingLabel = screen.getByText("Training Sessions");
    // Traverse to the parent container that holds both the label and the switch.
    const optionContainer = trainingLabel.parentElement?.parentElement;
    expect(optionContainer).toBeInTheDocument();

    // Within this container, get the element with role "switch".
    const trainingSwitch = within(optionContainer!).getByRole("switch");
    // It should be checked initially.
    expect(trainingSwitch).toHaveAttribute("aria-checked", "true");

    // Toggle the switch.
    fireEvent.click(trainingSwitch);

    // It should now be unchecked.
    expect(trainingSwitch).toHaveAttribute("aria-checked", "false");
  });
});
