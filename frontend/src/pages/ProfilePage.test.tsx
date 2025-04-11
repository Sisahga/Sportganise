import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfilePage from "./ProfilePage";

vi.mock("@/components/ProfileContent", () => ({
  ProfileContent: () => <div>Mocked ProfileContent</div>,
}));

describe("ProfilePage", () => {
  it("renders the ProfileContent component", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Mocked ProfileContent")).toBeInTheDocument();
  });
});
