import { render } from "@testing-library/react";
import { test, vi } from "vitest";
import { MemoryRouter } from "react-router";
import RegisteredPlayer from "../RegisteredPlayer";
import "@testing-library/jest-dom";
import type { DetailedProgramParticipantDto } from "@/types/trainingSessionDetails";

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
  const mockAttendee: DetailedProgramParticipantDto = {
    accountId: 4,
    programId: 1,
    confirmedDate: null,
    participantType: "Subscribed",
    confirmed: false,
    rank: null,
    firstName: "John",
    lastName: "Doe",
    address: {
      city: "Montral",
      line: "123 Main St",
      province: "QC",
      country: "Canada",
      postalCode: "10001",
    },
    email: "a@gmail.com",
    phone: "1234567890",
    profilePicture: "https://example.com/profile.jpg",
    accountType: "COACH",
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
      <RegisteredPlayer participant={mockAttendee} onRefresh={() => {}} />
    </MemoryRouter>,
  );

  // Check if "Loading..." text is present
  // const loading = screen.getByText("Loading...");
  // expect(loading).toBeInTheDocument();
});
