import { vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/usePrograms", () => ({
  default: vi.fn(),
}));

vi.mock("@/components/HeaderNav", () => ({
  HeaderNav: () => <div>HeaderNav</div>,
}));

vi.mock("@/components/FooterNav", () => ({
  FooterNav: () => <div>FooterNav</div>,
}));

vi.mock(
  "@/components/WaitlistTrainingSession/WaitlistTrainingSession.tsx",
  () => ({
    default: ({
      onSelectTraining,
    }: {
      onSelectTraining: (program: any) => void;
    }) => (
      <div>
        WaitlistedTrainingSession
        <button
          onClick={() =>
            onSelectTraining({
              programDetails: { programId: "1", name: "Program 1" },
            })
          }
        >
          Select Training
        </button>
      </div>
    ),
  }),
);

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router";
import WaitlistTrainingSessionPage from "./WaitlistTrainingSessionPage";
import usePrograms from "@/hooks/usePrograms";

const mUsePrograms = vi.mocked(usePrograms);

describe("WaitlistTrainingSessionPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mUsePrograms.mockReset();
  });

  it("renders header, footer, and WaitlistedTrainingSession components", () => {
    mUsePrograms.mockReturnValue({ programs: [] } as any);

    render(
      <BrowserRouter>
        <WaitlistTrainingSessionPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("HeaderNav")).toBeTruthy();
    expect(screen.getByText("FooterNav")).toBeTruthy();
    expect(screen.getByText("WaitlistedTrainingSession")).toBeTruthy();
  });

  it("navigates with full program details when a matching program is found", () => {
    const matchingProgram = {
      programDetails: { programId: "1", name: "Program 1" },
      attendees: ["Attendee1"],
    };
    mUsePrograms.mockReturnValue({ programs: [matchingProgram] } as any);

    render(
      <BrowserRouter>
        <WaitlistTrainingSessionPage />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Select Training"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/pages/ViewTrainingSessionPage",
      {
        state: {
          programDetails: matchingProgram.programDetails,
          attendees: matchingProgram.attendees,
        },
      },
    );
  });

  it("navigates with empty attendees when no matching program is found", () => {
    mUsePrograms.mockReturnValue({ programs: [] } as any);

    render(
      <BrowserRouter>
        <WaitlistTrainingSessionPage />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Select Training"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/pages/ViewTrainingSessionPage",
      {
        state: {
          programDetails: { programId: "1", name: "Program 1" },
          attendees: [],
        },
      },
    );
  });
});
