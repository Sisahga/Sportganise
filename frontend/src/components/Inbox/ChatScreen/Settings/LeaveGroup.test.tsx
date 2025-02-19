import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import log from "loglevel";
import { LeaveGroupDialog } from "./LeaveGroup";

describe("LeaveGroupDialog", () => {
  const onCloseMock = vi.fn();
  const onLeaveMock = vi.fn();
  let logInfoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    logInfoSpy = vi.spyOn(log, "info");
  });

  afterEach(() => {
    vi.resetAllMocks();
    logInfoSpy.mockRestore();
  });

  it("does not render the dialog if isOpen is false", () => {
    render(
      <LeaveGroupDialog
        isOpen={false}
        onClose={onCloseMock}
        onLeave={onLeaveMock}
      />,
    );
    expect(
      screen.queryByText(
        /Are you sure you want to leave the group\? You will no longer have access/i,
      ),
    ).not.toBeInTheDocument();
    expect(logInfoSpy).not.toHaveBeenCalledWith("LeaveGroupDialog opened");
  });

  it("renders the dialog if isOpen is true", () => {
    render(
      <LeaveGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        onLeave={onLeaveMock}
      />,
    );
    expect(
      screen.getByText(
        /Are you sure you want to leave the group\? You will no longer have access/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Leave Group/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(logInfoSpy).toHaveBeenCalledWith("LeaveGroupDialog opened");
  });

  it("calls onLeave when the 'Leave Group' button is clicked", () => {
    render(
      <LeaveGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        onLeave={onLeaveMock}
      />,
    );
    const leaveButton = screen.getByRole("button", { name: /leave group/i });
    fireEvent.click(leaveButton);
    expect(onLeaveMock).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith("Leave group action confirmed");
  });

  it("calls onClose when 'Cancel' is clicked", () => {
    render(
      <LeaveGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        onLeave={onLeaveMock}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith("Leave group action canceled");
  });
});
