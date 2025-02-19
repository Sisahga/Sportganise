import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InviteModal, { Member } from "./InviteModal"; // Adjust the import path if necessary
import { vi } from "vitest";

describe("InviteModal Component", () => {
  const mockMembers: Member[] = [
    {
      id: "1",
      name: "Walter White",
      email: "walter@example.com",
      role: "Coach",
    },
    {
      id: "2",
      name: "Jesse Pinkman",
      email: "jesse@example.com",
      role: "Player",
    },
    { id: "3", name: "Saul Goodman", email: "saul@example.com", role: "Admin" },
  ];

  const mockOnClose = vi.fn();
  const mockSetSelectedMembers = vi.fn();

  it("renders the modal with the correct title and members", () => {
    render(
      <InviteModal
        open={true}
        onClose={mockOnClose}
        members={mockMembers}
        selectedMembers={[]}
        setSelectedMembers={mockSetSelectedMembers}
      />,
    );

    expect(screen.getByText("Select Members")).toBeInTheDocument();
    expect(screen.getByText("Walter White")).toBeInTheDocument();
    expect(screen.getByText("Jesse Pinkman")).toBeInTheDocument();
    expect(screen.getByText("Saul Goodman")).toBeInTheDocument();
  });

  it("filters members based on search input", () => {
    render(
      <InviteModal
        open={true}
        onClose={mockOnClose}
        members={mockMembers}
        selectedMembers={[]}
        setSelectedMembers={mockSetSelectedMembers}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search members...");
    fireEvent.change(searchInput, { target: { value: "Jesse" } });

    expect(screen.getByText("Jesse Pinkman")).toBeInTheDocument();
    expect(screen.queryByText("Walter White")).not.toBeInTheDocument();
    expect(screen.queryByText("Saul Goodman")).not.toBeInTheDocument();
  });

  it("selects and deselects a member", () => {
    render(
      <InviteModal
        open={true}
        onClose={mockOnClose}
        members={mockMembers}
        selectedMembers={["2"]}
        setSelectedMembers={mockSetSelectedMembers}
      />,
    );

    const checkbox = screen.getByLabelText("Invite Jesse Pinkman");
    fireEvent.click(checkbox);
    expect(mockSetSelectedMembers).toHaveBeenCalled();
  });

  it("closes the modal when the Done button is clicked", () => {
    render(
      <InviteModal
        open={true}
        onClose={mockOnClose}
        members={mockMembers}
        selectedMembers={[]}
        setSelectedMembers={mockSetSelectedMembers}
      />,
    );

    fireEvent.click(screen.getByText("Done"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
