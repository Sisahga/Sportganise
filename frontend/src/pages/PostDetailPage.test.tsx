import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostDetailPage from "./PostDetailPage";

vi.mock("@/components/PostsContent", () => ({
  PostsContent: () => <div>PostsContent</div>,
}));

describe("PostDetailPage", () => {
  it("renders PostsContent", () => {
    render(<PostDetailPage />);
    expect(screen.getByText("PostsContent")).toBeInTheDocument();
  });
});
