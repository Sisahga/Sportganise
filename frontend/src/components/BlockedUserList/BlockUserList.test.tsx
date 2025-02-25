import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import BlockedUsersList from "./BlockedUserList";

describe("BlockedUsersList", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("renders the initial list of blocked users", () => {
    render(
      <MemoryRouter>
        <BlockedUsersList />
      </MemoryRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("opens the unblock dialog when an Unblock button is clicked", async () => {
    render(
      <MemoryRouter>
        <BlockedUsersList />
      </MemoryRouter>,
    );

    const unblockButtons = screen.getAllByText(/Unblock/);
    fireEvent.click(unblockButtons[0]);

    expect(
      await screen.findByText("Are you sure you want to unblock this user?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This will allow John Doe to interact with you again."),
    ).toBeInTheDocument();
  });

  it("removes a user after confirming unblock", async () => {
    render(
      <MemoryRouter>
        <BlockedUsersList />
      </MemoryRouter>,
    );

    const unblockButtons = screen.getAllByText(/Unblock/);
    fireEvent.click(unblockButtons[0]);

    const confirmButton = await screen.findByText("Unblock User");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("closes the dialog when Cancel is clicked", async () => {
    render(
      <MemoryRouter>
        <BlockedUsersList />
      </MemoryRouter>,
    );

    const unblockButtons = screen.getAllByText(/Unblock/);
    fireEvent.click(unblockButtons[0]);

    const cancelButton = await screen.findByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to unblock this user?"),
      ).not.toBeInTheDocument();
    });
  });

  it("displays 'No blocked users' when all users have been unblocked", async () => {
    render(
      <MemoryRouter>
        <BlockedUsersList />
      </MemoryRouter>,
    );

    // Unblock John Doe
    const unblockButtons = screen.getAllByText(/Unblock/);
    fireEvent.click(unblockButtons[0]);
    let confirmButton = await screen.findByText("Unblock User");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });

    // Unblock Jane Smith
    const remainingButton = screen.getByText("Unblock");
    fireEvent.click(remainingButton);
    confirmButton = await screen.findByText("Unblock User");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No blocked users")).toBeInTheDocument();
  });
});
