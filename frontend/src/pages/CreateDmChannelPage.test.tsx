import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateDmChannelPage from "./CreateDmChannelPage";

vi.mock(
  "@/components/Inbox/CreateChannel/CreateDirectMessageChannel.tsx",
  () => ({
    default: () => <div>CreateDirectMessagingChannel</div>,
  }),
);

describe("CreateDmChannelPage", () => {
  it("renders CreateDirectMessagingChannel component", () => {
    render(<CreateDmChannelPage />);
    expect(
      screen.getByText("CreateDirectMessagingChannel"),
    ).toBeInTheDocument();
  });
});
