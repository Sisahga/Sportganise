/* eslint-disable react-hooks/rules-of-hooks */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useForm } from "react-hook-form";

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockCreateTrainingSession = vi.fn();
vi.mock("../../hooks/useCreateTrainingSession", () => ({
  default: () => ({
    createTrainingSession: mockCreateTrainingSession,
    error: null,
  }),
}));

vi.mock("../../hooks/useFormHandler", () => {
  return {
    default: () => {
      const form = useForm({
        defaultValues: {
          title: "Test Program",
          type: "TRAINING",
          startDate: new Date("2023-01-01"),
          frequency: "ONCE",
          startTime: "10:00",
          endTime: "11:00",
          location: "CENTRE_DE_LOISIRS_ST_DENIS",
          visibility: "public",
          description: "Test description",
          capacity: 10,
          attachment: [],
        },
      });
      return { form };
    },
  };
});

const privateFormMock = () => {
  const form = useForm({
    defaultValues: {
      title: "Test Program",
      type: "TRAINING",
      startDate: new Date("2023-01-01"),
      frequency: "ONCE",
      startTime: "10:00",
      endTime: "11:00",
      location: "CENTRE_DE_LOISIRS_ST_DENIS",
      visibility: "private",
      description: "Test description",
      capacity: 10,
      attachment: [],
    },
  });
  return { form };
};

vi.mock("../../hooks/usePlayers", () => ({
  default: () => ({
    players: [
      {
        accountId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        type: "PLAYER",
      },
    ],
    loading: false,
    error: null,
  }),
}));

const mockToast = vi.fn();
vi.mock("../../hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockInvite = vi.fn();
vi.mock("../../hooks/useInviteToPrivateEvent", () => ({
  useInviteToPrivateEvent: () => ({ invite: mockInvite }),
}));

vi.mock("../../services/cookiesService", () => ({
  getCookies: () => ({ type: "ADMIN" }),
  getAccountIdCookie: () => 1,
}));

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useWatch: vi.fn().mockImplementation(({ name }) => {
      if (name === "frequency") return "ONCE";
      return undefined;
    }),
  };
});

import CreateTrainingSessionForm from "./CreateTrainingSessionForm";

describe("CreateTrainingSessionForm", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateTrainingSession.mockClear();
    mockToast.mockClear();
    mockInvite.mockClear();
  });

  it("renders loading state when players are loading", async () => {
    vi.resetModules();
    vi.doMock("../../hooks/usePlayers", () => ({
      default: () => ({
        players: [],
        loading: true,
        error: null,
      }),
    }));
    const module = await import("./CreateTrainingSessionForm");
    const Component = module.default;
    render(<Component />);
    expect(screen.getByText("Loading players...")).toBeInTheDocument();
  });

  it("renders error state when players error", async () => {
    vi.resetModules();
    vi.doMock("../../hooks/usePlayers", () => ({
      default: () => ({
        players: [],
        loading: false,
        error: true,
      }),
    }));
    const module = await import("./CreateTrainingSessionForm");
    const Component = module.default;
    render(<Component />);
    expect(screen.getByText("Error loading players")).toBeInTheDocument();
  });

  it("renders form when players are loaded", () => {
    render(<CreateTrainingSessionForm />);
    const headings = screen.getAllByText(/Create New Program/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it("submits the form successfully for a public event", async () => {
    mockCreateTrainingSession.mockResolvedValue({ data: { programId: 1 } });
    render(<CreateTrainingSessionForm />);
    const submitButton = screen.getByRole("button", {
      name: /Create new Program/i,
    });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockCreateTrainingSession).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "success",
          title: "Form submitted successfully ✔",
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it("shows a validation error when visibility is private and no members are selected", async () => {
    vi.resetModules();
    vi.doMock("../../hooks/useFormHandler", () => ({
      default: () => privateFormMock(),
    }));
    vi.doMock("../../hooks/usePlayers", () => ({
      default: () => ({
        players: [
          {
            accountId: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            type: "PLAYER",
          },
        ],
        loading: false,
        error: null,
      }),
    }));
    const module = await import("./CreateTrainingSessionForm");
    const Component = module.default;
    render(<Component />);
    const submitButton = screen.getByRole("button", {
      name: /Create new Program/i,
    });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "destructive",
          title: "Validation Error",
          description: "Please select at least one member for a private event.",
        }),
      );
      expect(mockCreateTrainingSession).not.toHaveBeenCalled();
    });
  });
});
