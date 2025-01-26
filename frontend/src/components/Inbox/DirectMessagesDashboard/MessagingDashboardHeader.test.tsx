// MessagingDashboardHeader.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import MessagingDashboardHeader from "./MessagingDashboardHeader";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: typeof import("react-router-dom") =
    await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MessagingDashboardHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MessagingDashboardHeader />
      </BrowserRouter>,
    );

  it("renders the back button, title, and add new message button", () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeTruthy();

    const title = screen.getByText(/messages/i);
    expect(title).toBeTruthy();

    const addButton = screen.getByRole("button", { name: /add new message/i });
    expect(addButton).toBeTruthy();
  });

  it("navigates to home page when back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to create DM channel page when add new message button is clicked", () => {
    renderComponent();

    const addButton = screen.getByRole("button", { name: /add new message/i });
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pages/CreateDmChannelPage");
  });
});
