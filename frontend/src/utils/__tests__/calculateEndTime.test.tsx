import { test, expect } from "vitest";
import { calculateEndTime } from "../calculateEndTime";

test("calculate correct end time", () => {
  const mockOccurenceDate = new Date("2024-07-01T10:00:00Z");
  const mockDurationMins = 120;
  expect(
    calculateEndTime(mockOccurenceDate, mockDurationMins) === "12:00 p.m.",
  );
});

test("calculate end time string type returned correctly", () => {
  const mockOccurenceDate = new Date("2024-07-01T10:00:00Z");
  const mockDurationMins = 120;
  expect(typeof calculateEndTime(mockOccurenceDate, mockDurationMins)).toBe(
    "string",
  );
});
