import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Filters from "./Filters";

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

describe("Filters component", () => {
  let occurrenceDate: string | undefined;
  let setOccurrenceDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  let type: string;
  let setType: React.Dispatch<React.SetStateAction<string>>;
  let sortOption: string;
  let setSortOption: React.Dispatch<React.SetStateAction<string>>;
  let sortDir: string;
  let setSortDir: React.Dispatch<React.SetStateAction<string>>;
  let sortBy: string;
  let setSortBy: React.Dispatch<React.SetStateAction<string>>;
  let postsPerPage: number;
  let setPostsPerPage: React.Dispatch<React.SetStateAction<number>>;
  let handleClearFilters: () => void;
  let handleApplyFilters: () => void;

  beforeEach(() => {
    occurrenceDate = undefined;
    type = "";
    sortOption = "latest";
    sortDir = "desc";
    sortBy = "";
    postsPerPage = 10;
    setOccurrenceDate = vi.fn();
    setType = vi.fn();
    setSortOption = vi.fn();
    setSortDir = vi.fn();
    setSortBy = vi.fn();
    setPostsPerPage = vi.fn();
    handleClearFilters = vi.fn();
    handleApplyFilters = vi.fn();
  });

  it("renders the filter trigger button", () => {
    render(
      <Filters
        occurrenceDate={occurrenceDate}
        setOccurrenceDate={setOccurrenceDate}
        type={type}
        setType={setType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDir={sortDir}
        setSortDir={setSortDir}
        sortBy={sortBy}
        setSortBy={setSortBy}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
      />,
    );

    // The trigger button is the first button rendered (contains the Filter icon)
    const triggerButton = screen.getByRole("button");
    expect(triggerButton).toBeInTheDocument();
  });

  it("opens the drawer when trigger button is clicked", async () => {
    render(
      <Filters
        occurrenceDate={occurrenceDate}
        setOccurrenceDate={setOccurrenceDate}
        type={type}
        setType={setType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDir={sortDir}
        setSortDir={setSortDir}
        sortBy={sortBy}
        setSortBy={setSortBy}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
      />,
    );

    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText("Filter Options")).toBeInTheDocument();
    });
  });

  it('calls handleClearFilters when the "Clear all" button is clicked', async () => {
    render(
      <Filters
        occurrenceDate={occurrenceDate}
        setOccurrenceDate={setOccurrenceDate}
        type={type}
        setType={setType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDir={sortDir}
        setSortDir={setSortDir}
        sortBy={sortBy}
        setSortBy={setSortBy}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
      />,
    );

    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText("Filter Options")).toBeInTheDocument();
    });

    const clearButton = screen.getByRole("button", { name: /Clear all/i });
    fireEvent.click(clearButton);
    expect(handleClearFilters).toHaveBeenCalled();
  });

  it('calls handleApplyFilters when the "Apply filter" button is clicked', async () => {
    render(
      <Filters
        occurrenceDate={occurrenceDate}
        setOccurrenceDate={setOccurrenceDate}
        type={type}
        setType={setType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortDir={sortDir}
        setSortDir={setSortDir}
        sortBy={sortBy}
        setSortBy={setSortBy}
        postsPerPage={postsPerPage}
        setPostsPerPage={setPostsPerPage}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
      />,
    );

    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText("Filter Options")).toBeInTheDocument();
    });

    const applyButton = screen.getByRole("button", { name: /Apply filter/i });
    fireEvent.click(applyButton);
    expect(handleApplyFilters).toHaveBeenCalled();
  });
});
