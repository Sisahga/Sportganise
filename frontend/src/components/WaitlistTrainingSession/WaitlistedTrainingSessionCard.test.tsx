import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { vi } from "vitest";

vi.mock("@/utils/calculateEndTime", () => ({
  calculateEndTime: () => "11:00 AM",
}));

interface ProgramAttachments {
  programId: number;
  attachmentUrl: string;
}

export interface ProgramDetails {
  programAttachments: ProgramAttachments[];
  programId: number;
  recurrenceId: number;
  programType: string;
  title: string;
  description: string;
  capacity: number;
  occurrenceDate: Date;
  durationMins: number;
  expiryDate: Date;
  frequency: string;
  location: string;
  visibility: string;
  author: string;
  cancelled: boolean;
  reccurenceDate: Date;
}

const dummyProgramDetails: ProgramDetails = {
  programAttachments: [],
  programId: 1,
  recurrenceId: 1,
  programType: "Yoga",
  title: "Sample Training Session",
  description: "This is a test session description.",
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

describe("WaitlistedTrainingSessionCard", () => {
  const onSelectTrainingMock = vi.fn();

  beforeEach(() => {
    onSelectTrainingMock.mockReset();
  });

  it("renders all expected information", () => {
    render(
      <WaitlistedTrainingSessionCard
        programDetails={dummyProgramDetails}
        onSelectTraining={onSelectTrainingMock}
      />,
    );
    expect(screen.getByText("Coach Benjamin Luijan")).toBeInTheDocument();
    expect(screen.getByText(dummyProgramDetails.title)).toBeInTheDocument();
    const expectedDate = dummyProgramDetails.occurrenceDate.toDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
    const expectedTime = dummyProgramDetails.occurrenceDate.toLocaleTimeString(
      "en-CA",
      {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
    expect(screen.getByText("11:00 AM")).toBeInTheDocument();
    expect(
      screen.getByText(`${dummyProgramDetails.durationMins} min`),
    ).toBeInTheDocument();
    expect(screen.getByText(dummyProgramDetails.location)).toBeInTheDocument();
    expect(
      screen.getByText(dummyProgramDetails.description),
    ).toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();
  });

  it("calls onSelectTraining when the Card is clicked", async () => {
    render(
      <WaitlistedTrainingSessionCard
        programDetails={dummyProgramDetails}
        onSelectTraining={onSelectTrainingMock}
      />,
    );
    await userEvent.click(screen.getByText(dummyProgramDetails.title));
    expect(onSelectTrainingMock).toHaveBeenCalledWith(dummyProgramDetails);
  });

  it("calls onSelectTraining when the 'View details' button is clicked", async () => {
    render(
      <WaitlistedTrainingSessionCard
        programDetails={dummyProgramDetails}
        onSelectTraining={onSelectTrainingMock}
      />,
    );
    const viewDetailsButton = screen.getByText("View details");
    await userEvent.click(viewDetailsButton);
    expect(onSelectTrainingMock).toHaveBeenCalledWith(dummyProgramDetails);
  });

  it("renders null if no programDetails provided", () => {
    const { container } = render(
      <WaitlistedTrainingSessionCard
        // @ts-expect-error testing behavior with missing programDetails
        programDetails={null}
        onSelectTraining={onSelectTrainingMock}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
