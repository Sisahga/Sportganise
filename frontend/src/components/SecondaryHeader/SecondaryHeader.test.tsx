import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import SecondaryHeader from "./SecondaryHeader";

describe("SecondaryHeader", () => {
  it("renders a header with a back button and logo image", () => {
    render(
      <MemoryRouter>
        <SecondaryHeader />
      </MemoryRouter>,
    );
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeTruthy();
    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toBeTruthy();
    expect(logoImage.getAttribute("src")).toContain("Logo.png");
  });
});
