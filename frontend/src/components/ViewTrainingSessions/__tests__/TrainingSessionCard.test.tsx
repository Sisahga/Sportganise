import { fireEvent, render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TrainingSessionCard from "../TrainingSessionCard";
import { Attendees, ProgramDetails } from "@/types/trainingSessionDetails";
import { calculateEndTime } from "@/utils/calculateEndTime";

const MockProgramDetails: ProgramDetails = {
  programId: 1,
  programType: "Training",
  title: "Example Title",
  description: "Example Description",
  capacity: 10,
  occurrenceDate: new Date("2024-07-01T10:00:00Z"),
  durationMins: 120,
  expiryDate: new Date("2024-08-01T12:00:00Z"),
  frequency: "Weekly",
  location: "123 Random St.",
  visibility: "Public",
  programAttachments: [
    {
      programId: 1,
      attachmentUrl: "attachmentUrl.pdf",
    },
  ],
  recurring: true,
};
const MockAttendees: Attendees[] = [
  {
    accountId: 2,
    programId: 1,
    rank: null,
    confirmedDate: new Date(),
    confirmed: true,
  },
];

test("renders title correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const title = screen.getByText("Training");
  expect(document.body.contains(title)).toBe(true);
});

test("renders occurrence date correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const date = screen.getByText("Mon Jul 01 2024");
  expect(document.body.contains(date)).toBe(true);
});

test("renders start time correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const startTime = screen.getByText(
    MockProgramDetails.occurrenceDate.toLocaleTimeString("en-CA", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  expect(document.body.contains(startTime)).toBe(true);
});

test("renders end time correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const endTime = screen.getByText(
    calculateEndTime(
      MockProgramDetails.occurrenceDate,
      MockProgramDetails.durationMins,
    ),
  );
  expect(document.body.contains(endTime)).toBe(true);
});

test("renders duration mins correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const duration = screen.getByText("120");
  expect(document.body.contains(duration)).toBe(true);
});

test("renders description correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const desc = screen.getByText("Example Description");
  expect(document.body.contains(desc)).toBe(true);
});

test("renders description correctly", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const desc = screen.getByText("Example Description");
  expect(document.body.contains(desc)).toBe(true);
});

test("renders view more button", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const viewMore = screen.getByRole("button");
  expect(document.body.contains(viewMore)).toBe(true);
});

const mockHandleNavigation = vi.fn();
vi.mock("handleNavigation", () => ({
  handleNavigation: mockHandleNavigation,
}));

test("click view more button", () => {
  render(
    <TrainingSessionCard
      programDetails={MockProgramDetails}
      attendees={MockAttendees}
    />,
  );
  const viewMore = screen.getByText("View details");
  expect(document.body.contains(viewMore)).toBe(true);
  fireEvent.click(viewMore);
  expect(mockHandleNavigation).toHaveBeenCalledWith(
    "/pages/ViewTrainingSessionPage",
    {
      programDetails: MockProgramDetails,
      attendees: MockAttendees,
    },
  );
});
