import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import RegisteredPlayer from "../RegisteredPlayer";
import "@testing-library/jest-dom";
import type { Attendees } from "@/types/trainingSessionDetails";

// Mock the usePersonalInformation hook
vi.mock("@/hooks/usePersonalInformation", () => ({
  usePersonalInformation: vi.fn().mockReturnValue({
    data: null,
    loading: true,
    error: null,
  }),
}));

test("displays loading", () => {
  // Create mock attendee data
  const mockAttendee: Attendees = {
    accountId: 4,
    programId: 1,
    confirmedDate: null,
    participantType: "Subscribed",
    confirmed: false,
    rank: null,
  };

  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/pages/ViewTrainingSessionPage",
          state: { programDetails: { programId: 1 } },
        },
      ]}
    >
      <RegisteredPlayer accountAttendee={mockAttendee} onRefresh={() => {}} />
    </MemoryRouter>,
  );

  // Check if "Loading..." text is present
  const loading = screen.getByText("Loading...");
  expect(loading).toBeInTheDocument();
});
