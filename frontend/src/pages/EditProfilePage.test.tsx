import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditProfilePage from "./EditProfilePage";

vi.mock("@/components/EditProfileContent", () => ({
  EditProfileContent: () => <div>EditProfileContent</div>,
}));

describe("EditProfilePage", () => {
  it("renders EditProfileContent", () => {
    render(<EditProfilePage />);
    expect(screen.getByText("EditProfileContent")).toBeInTheDocument();
  });
});
