import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ForumPage from "./ForumPage";

vi.mock("@/components/ForumContent", () => ({
  ForumContent: () => <div>ForumContent</div>,
}));

describe("ForumPage", () => {
  it("renders ForumContent", () => {
    render(<ForumPage />);
    expect(screen.getByText("ForumContent")).toBeInTheDocument();
  });
});
