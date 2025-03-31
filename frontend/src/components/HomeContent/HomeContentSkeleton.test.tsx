import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomeContentSkeleton from "./HomeContentSkeleton";

describe("HomeContentSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<HomeContentSkeleton />);
    expect(container).toBeTruthy();
  });

  it("renders the expected number of skeleton elements", () => {
    const { container } = render(<HomeContentSkeleton />);
    const skeletonElements = container.querySelectorAll(".animate-skeleton");
    expect(skeletonElements.length).toBe(39);
  });
});
