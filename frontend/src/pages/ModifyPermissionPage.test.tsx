import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ModifyPermissionPage from "./ModifyPermissionPage";

vi.mock("@/components/UserPermissionContent", () => ({
  UserPermissionContent: () => <div>UserPermissionContent</div>,
}));

describe("ModifyPermissionPage", () => {
  it("renders UserPermissionContent", () => {
    render(<ModifyPermissionPage />);
    expect(screen.getByText("UserPermissionContent")).toBeInTheDocument();
  });
});
