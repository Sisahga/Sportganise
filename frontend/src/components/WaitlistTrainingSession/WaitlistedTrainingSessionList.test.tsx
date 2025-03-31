import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import WaitlistedTrainingSessionList from "./WaitlistedTrainingSessionList";
import { ProgramDetails } from "@/types/trainingSessionDetails";

const dummyProgramDetails: ProgramDetails = {
  programAttachments: [],
  programId: 1,
  recurrenceId: 1,
  programType: "yoga",
  title: "Sample Session",
  description: "Session description",
  capacity: 20,
  occurrenceDate: new Date("2023-03-01T10:00:00Z"),
  durationMins: 60,
  expiryDate: new Date("2023-03-01T12:00:00Z"),
  frequency: "Weekly",
  location: "Test Location",
  visibility: "Public",
  author: "Coach Benjamin Luijan",
  cancelled: false,
  reccurenceDate: new Date("2023-03-08T10:00:00Z"),
};

let waitlistProgramsReturn = {
  data: [] as ProgramDetails[],
  error: null as string | null,
  loading: false,
  waitlistPrograms: vi.fn(),
};

vi.mock("@/hooks/useWaitlistPrograms", () => ({
  default: () => waitlistProgramsReturn,
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => ({ accountId: 123, type: "ADMIN" }),
}));

describe("WaitlistedTrainingSessionList", () => {
  beforeEach(() => {
    waitlistProgramsReturn = {
      data: [],
      error: null,
      loading: false,
      waitlistPrograms: vi.fn(),
    };
  });

  it("renders error message when error is present", () => {
    waitlistProgramsReturn.error = "Some error";
    render(<WaitlistedTrainingSessionList onSelectTraining={vi.fn()} />);
    expect(
      screen.getByText("Error loading waitlist programs"),
    ).toBeInTheDocument();
  });

  it("renders loader when loading is true", () => {
    waitlistProgramsReturn.loading = true;
    const { container } = render(
      <WaitlistedTrainingSessionList onSelectTraining={vi.fn()} />,
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders 'No waitlisted programs available' when data is empty", () => {
    waitlistProgramsReturn.data = [];
    render(<WaitlistedTrainingSessionList onSelectTraining={vi.fn()} />);
    expect(
      screen.getByText("No waitlisted programs available"),
    ).toBeInTheDocument();
  });

  it("renders waitlisted programs when data is available", async () => {
    waitlistProgramsReturn.data = [dummyProgramDetails];
    render(<WaitlistedTrainingSessionList onSelectTraining={vi.fn()} />);
    expect(screen.getByText("Available Sessions")).toBeInTheDocument();
    expect(screen.getByText(dummyProgramDetails.title)).toBeInTheDocument();
  });

  it("calls waitlistPrograms with the correct accountId", async () => {
    const waitlistProgramsMock = vi.fn();
    waitlistProgramsReturn.waitlistPrograms = waitlistProgramsMock;
    render(<WaitlistedTrainingSessionList onSelectTraining={vi.fn()} />);
    await waitFor(() => {
      expect(waitlistProgramsMock).toHaveBeenCalledWith(123);
    });
  });
});
