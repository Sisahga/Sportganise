import { render } from "@testing-library/react";
import UserSkeleton from "./UserSkeleton";

describe("UserSkeleton", () => {
  it("renders a container with the correct classes", () => {
    const { container } = render(<UserSkeleton />);
    expect(container.firstChild).toHaveClass("p-4", "space-y-4");
  });

  it("renders 5 skeleton items", () => {
    const { container } = render(<UserSkeleton />);
    const skeletonItems = container.querySelectorAll(".bg-placeholder-colour");
    expect(skeletonItems.length).toBe(5);
  });

  it("renders each skeleton item with a circle and text placeholders", () => {
    const { container } = render(<UserSkeleton />);
    const skeletonItems = container.querySelectorAll(".bg-placeholder-colour");
    skeletonItems.forEach((item) => {
      const circle = item.querySelector(
        ".h-10.w-10.rounded-full.animate-skeleton",
      );
      expect(circle).toBeTruthy();
      const textPlaceholder1 = item.querySelector(
        ".h-4.w-1\\/3.animate-skeleton.rounded-sm",
      );
      expect(textPlaceholder1).toBeTruthy();
      const textPlaceholder2 = item.querySelector(
        ".h-3.w-1\\/4.animate-skeleton.rounded-sm",
      );
      expect(textPlaceholder2).toBeTruthy();
    });
  });
});
