import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BlockedUsersListPage from "./BlockedUserListPage";

vi.mock("@/components/BlockedUserList", () => ({
  BlockedUsersList: () => <div>BlockedUsersList</div>,
}));

describe("BlockedUsersListPage", () => {
  it("renders BlockedUsersList", () => {
    render(<BlockedUsersListPage />);
    expect(screen.getByText("BlockedUsersList")).toBeInTheDocument();
  });
});
