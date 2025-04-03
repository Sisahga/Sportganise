if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UserPermissionContent from "./UserPermissionContent";

interface User {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string;
  type: string;
}

interface FetchPermissionsReturn {
  data: User[];
  loading: boolean;
  error: string | null;
  setData: React.Dispatch<React.SetStateAction<User[]>>;
}

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => ({ type: "ADMIN" }),
}));

const mockData: User[] = [
  {
    accountId: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    pictureUrl: "",
    type: "PLAYER",
  },
  {
    accountId: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    pictureUrl: "",
    type: "COACH",
  },
  {
    accountId: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    pictureUrl: "",
    type: "GENERAL",
  },
  {
    accountId: "4",
    firstName: "Bob",
    lastName: "Brown",
    email: "bob@example.com",
    pictureUrl: "",
    type: "PLAYER",
  },
  {
    accountId: "5",
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie@example.com",
    pictureUrl: "",
    type: "ADMIN",
  },
  {
    accountId: "6",
    firstName: "Eve",
    lastName: "White",
    email: "eve@example.com",
    pictureUrl: "",
    type: "PLAYER",
  },
];

let fetchPermissionsMockReturn: FetchPermissionsReturn = {
  data: mockData,
  loading: false,
  error: null,
  setData: vi.fn(),
};

vi.mock("@/hooks/useFetchPermissions", () => ({
  default: () => fetchPermissionsMockReturn,
}));

const updateUserRoleMock = vi.fn();
vi.mock("@/hooks/useModifyPermissions", () => ({
  default: () => ({
    updateUserRole: updateUserRoleMock,
  }),
}));

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe.skip("UserPermissionContent", () => {
  beforeEach(() => {
    fetchPermissionsMockReturn = {
      data: mockData,
      loading: false,
      error: null,
      setData: vi.fn(),
    };
    updateUserRoleMock.mockReset();
    toastMock.mockReset();
  });

  it("renders loading state", () => {
    fetchPermissionsMockReturn.loading = true;
    render(<UserPermissionContent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    fetchPermissionsMockReturn.loading = false;
    fetchPermissionsMockReturn.error = "Error occurred";
    render(<UserPermissionContent />);
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("renders user cards with pagination (first page shows 5 users)", () => {
    render(<UserPermissionContent />);
    mockData.slice(0, 5).forEach((user) => {
      expect(
        screen.getByText(new RegExp(`${user.firstName} ${user.lastName}`)),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText("Eve White")).not.toBeInTheDocument();
  });

  it("navigates to page 2 when pagination is used", async () => {
    render(<UserPermissionContent />);
    const page2Button = screen.getByText("2");
    await userEvent.click(page2Button);
    await waitFor(() => {
      expect(screen.getByText("Eve White")).toBeInTheDocument();
    });
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("opens modify dialog and shows user info", async () => {
    render(<UserPermissionContent />);
    const modifyButtons = screen.getAllByText("Modify");
    await userEvent.click(modifyButtons[0]);
    expect(
      await screen.findByText(/Modify permissions for John Doe/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
  });

  it("shows toast when no role change is made", async () => {
    render(<UserPermissionContent />);
    const modifyButtons = screen.getAllByText("Modify");
    await userEvent.click(modifyButtons[0]);
    await screen.findByText(/Modify permissions for John Doe/);
    const saveButton = screen.getByText("Save Changes");
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: "No Changes",
        description: "The selected role is the same as the current role.",
        variant: "destructive",
      });
    });
  });

  it("opens alert dialog on role change and confirms update", async () => {
    render(<UserPermissionContent />);
    const modifyButtons = screen.getAllByText("Modify");
    await userEvent.click(modifyButtons[0]);
    await screen.findByText(/Modify permissions for John Doe/);
    const selectTrigger = screen.getByTestId("select-trigger");
    await userEvent.click(selectTrigger);
    const adminOption = await screen.findByText("Admin");
    await userEvent.click(adminOption);
    const saveButton = screen.getByText("Save Changes");
    await userEvent.click(saveButton);
    expect(await screen.findByText("Confirm Role Change")).toBeInTheDocument();
    const yesButton = screen.getByText("Yes");
    await userEvent.click(yesButton);
    await waitFor(() => {
      expect(updateUserRoleMock).toHaveBeenCalledWith(
        expect.objectContaining({ accountId: "1" }),
        "ADMIN",
      );
    });
  });

  it("cancels role change in alert dialog", async () => {
    render(<UserPermissionContent />);
    const modifyButtons = screen.getAllByText("Modify");
    await userEvent.click(modifyButtons[0]);
    await screen.findByText(/Modify permissions for John Doe/);
    const selectTrigger = screen.getByTestId("select-trigger");
    await userEvent.click(selectTrigger);
    const adminOption = await screen.findByText("Admin");
    await userEvent.click(adminOption);
    const saveButton = screen.getByText("Save Changes");
    await userEvent.click(saveButton);
    expect(await screen.findByText("Confirm Role Change")).toBeInTheDocument();
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    expect(updateUserRoleMock).not.toHaveBeenCalled();
  });
});
