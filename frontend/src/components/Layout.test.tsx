import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, it, expect, vi } from "vitest";

vi.mock("./HeaderNav", () => ({
  HeaderNav: () => <div data-testid="header-nav">HeaderNav</div>,
}));

vi.mock("./FooterNav", () => ({
  FooterNav: () => <div data-testid="footer-nav">FooterNav</div>,
}));

vi.mock("@/components/ui/toaster", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

import Layout from "./Layout";

const renderLayoutWithPath = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<Layout />} />
      </Routes>
    </MemoryRouter>,
  );

describe("Layout component", () => {
  it("hides header and footer, and applies no top margin and full width for /login", () => {
    renderLayoutWithPath("/login");
    expect(screen.queryByTestId("header-nav")).to.equal(null);
    expect(screen.queryByTestId("footer-nav")).to.equal(null);
    const mainEl = document.querySelector("main");
    expect(mainEl?.classList.contains("mt-0")).to.equal(true);
    expect(mainEl?.classList.contains("mx-0")).to.equal(true);
  });

  it("renders header and footer, applies medium top margin and full width for /pages/DirectMessagesDashboard", () => {
    renderLayoutWithPath("/pages/DirectMessagesDashboard");
    expect(screen.getByTestId("header-nav")).to.not.equal(null);
    expect(screen.getByTestId("footer-nav")).to.not.equal(null);
    const mainEl = document.querySelector("main");
    expect(mainEl?.classList.contains("mt-28")).to.equal(true);
    expect(mainEl?.classList.contains("mx-0")).to.equal(true);
  });

  it("renders header and footer, applies default top margin and horizontal margin for non-special paths", () => {
    renderLayoutWithPath("/random");
    expect(screen.getByTestId("header-nav")).to.not.equal(null);
    expect(screen.getByTestId("footer-nav")).to.not.equal(null);
    const mainEl = document.querySelector("main");
    expect(mainEl?.classList.contains("mt-40")).to.equal(true);
    expect(mainEl?.classList.contains("mx-6")).to.equal(true);
  });
});
