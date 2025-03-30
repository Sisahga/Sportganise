import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PersonalInformationPage from "./PersonalInformationPage";

vi.mock("@/components/PersonalInformationContent", () => ({
  PersonalInformationContent: () => <div>PersonalInformationContent</div>,
}));

describe("PersonalInformationPage", () => {
  it("renders PersonalInformationContent", () => {
    render(<PersonalInformationPage />);
    expect(screen.getByText("PersonalInformationContent")).toBeInTheDocument();
  });
});
