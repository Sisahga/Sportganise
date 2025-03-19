import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router";
import DeleteRequest from "./DeleteRequest.tsx";
import { DeleteChannelRequestMemberStatus } from "@/types/deleteRequest.ts";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual: typeof import("react-router") =
    await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// TODO: fix test.
describe.skip("DeleteRequest", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <DeleteRequest
          deleteRequest={null}
          deleteRequestActive={false}
          currentUserId={1}
          currentUserApproverStatus={DeleteChannelRequestMemberStatus.PENDING}
          setDeleteRequestActive={vi.fn()}
          websocketRef={null}
          setDeleteRequest={vi.fn()}
        />
      </BrowserRouter>,
    );

  it("renders the Delete Request button", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", {
      name: /delete request/i,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("opens the drawer when Delete Request button is clicked", () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", {
      name: /delete request/i,
    });
    fireEvent.click(deleteButton);
    const drawerTitle = screen.getByRole("heading", {
      name: /delete request/i,
    });
    expect(drawerTitle).toBeInTheDocument();
  });

  it("displays the correct requested by and members", async () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", {
      name: /delete request/i,
    });
    fireEvent.click(deleteButton);

    const description = await screen.findByTestId("description");
    expect(description).toHaveTextContent(
      /jane doe requested to delete the channel\./i,
    );

    const john = screen.getByText(/john/i);
    const mary = screen.getByText(/mary/i);
    const joe = screen.getByText(/joe/i);
    const jeff = screen.getByText(/jeff/i);

    expect(john).toBeInTheDocument();
    expect(mary).toBeInTheDocument();
    expect(joe).toBeInTheDocument();
    expect(jeff).toBeInTheDocument();

    const approvedBadges = screen.getAllByText(/approved/i);
    expect(approvedBadges).toHaveLength(3);

    const pendingBadges = screen.getAllByText(/pending/i);
    expect(pendingBadges).toHaveLength(1);
  });

  it("approves a member and shows the approval message", async () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", {
      name: /delete request/i,
    });
    fireEvent.click(deleteButton);

    const approveButton = screen.getByRole("button", { name: /approve/i });
    fireEvent.click(approveButton);

    const approvalMessage = await screen.findByText(
      /you approved the request!/i,
    );
    expect(approvalMessage).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-state", "closed");

    const jeffName = screen.getByText(/jeff/i);
    const jeffRow = jeffName.closest("div");
    expect(jeffRow).toBeInTheDocument();

    if (jeffRow) {
      const jeffBadge = within(jeffRow).getByText(/approved/i);
      expect(jeffBadge).toBeInTheDocument();
    } else {
      throw new Error("Jeff's row not found");
    }
  });

  it("closes the drawer when Close button is clicked", async () => {
    renderComponent();
    const deleteButton = screen.getByRole("button", {
      name: /delete request/i,
    });
    fireEvent.click(deleteButton);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-state", "closed");
    });
  });
});
