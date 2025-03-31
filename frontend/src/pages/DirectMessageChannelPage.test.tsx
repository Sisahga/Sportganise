import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DirectMessageChannelPage from "./DirectMessageChannelPage";

vi.mock("@/components/Inbox/ChatScreen/ChatScreen.tsx", () => ({
  default: () => <div>ChatScreen</div>,
}));

describe("DirectMessageChannelPage", () => {
  it("renders ChatScreen", () => {
    render(<DirectMessageChannelPage />);
    expect(screen.getByText("ChatScreen")).toBeInTheDocument();
  });
});
