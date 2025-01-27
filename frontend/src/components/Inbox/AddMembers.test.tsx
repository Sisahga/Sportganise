import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import AddMembers from "./AddMembers";
import { AddMembersDialogProps } from "@/types/dmchannels";

vi.mock("@/hooks/useAccountDetailsDirectMessaging", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    users: [
      {
        accountId: 1,
        firstName: "John",
        lastName: "Doe",
        pictureUrl: "",
        phone: "123-456-7890",
        type: "player",
        selected: false,
      },
      {
        accountId: 2,
        firstName: "Jane",
        lastName: "Smith",
        pictureUrl: "",
        phone: "987-654-3210",
        type: "coach",
        selected: false,
      },
    ],
  })),
}));

describe("AddMembers Component", () => {
  const mockProps: AddMembersDialogProps = {
    selectedUsers: [],
    setSelectedUsers: vi.fn(),
    submitButtonLabel: "Add Members",
    createFunction: vi.fn(),
    currentUserId: 1,
    excludedMembers: [],
  };

  it("renders the AddMembers component", () => {
    render(<AddMembers {...mockProps} />);
    expect(
      screen.getByPlaceholderText("Search for a player"),
    ).toBeInTheDocument();
  });

  it("filters users based on the search query", () => {
    render(<AddMembers {...mockProps} />);
    const input = screen.getByPlaceholderText("Search for a player");
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("allows toggling user selection", () => {
    const setSelectedUsers = vi.fn();
    render(<AddMembers {...mockProps} setSelectedUsers={setSelectedUsers} />);
    const input = screen.getByPlaceholderText("Search for a player");
    fireEvent.change(input, { target: { value: "Jane" } });
    const userButton = screen.getByText("Jane Smith").closest("button");
    if (userButton) {
      fireEvent.click(userButton);
    }
    expect(setSelectedUsers).toHaveBeenCalledWith(expect.any(Function));
  });

  it("disables the submit button when no users are selected", () => {
    render(<AddMembers {...mockProps} />);
    const submitButton = screen.queryByText("Add Members");
    expect(submitButton).not.toBeInTheDocument();
  });

  it("enables the submit button when users are selected", () => {
    render(
      <AddMembers
        {...mockProps}
        selectedUsers={[
          {
            accountId: 2,
            firstName: "Jane",
            lastName: "Smith",
            pictureUrl: "",
            phone: "987-654-3210",
            type: "coach",
            selected: true,
          },
        ]}
      />,
    );
    const submitButton = screen.getByText("Add Members");
    expect(submitButton).toBeInTheDocument();
  });

  it("calls createFunction when the submit button is clicked", () => {
    const createFunction = vi.fn();
    render(
      <AddMembers
        {...mockProps}
        selectedUsers={[
          {
            accountId: 2,
            firstName: "Jane",
            lastName: "Smith",
            pictureUrl: "",
            phone: "987-654-3210",
            type: "coach",
            selected: true,
          },
        ]}
        createFunction={createFunction}
      />,
    );
    const submitButton = screen.getByText("Add Members");
    fireEvent.click(submitButton);
    expect(createFunction).toHaveBeenCalled();
  });
});
