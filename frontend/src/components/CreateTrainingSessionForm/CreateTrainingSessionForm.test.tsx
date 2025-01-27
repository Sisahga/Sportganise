import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import userEvent from "@testing-library/user-event";
import CreateTrainingSessionForm from "./CreateTrainingSessionForm";
import { RouterProvider, createMemoryRouter } from "react-router";

// Mock implementations
const mockNavigate = vi.fn();
const mockCreateTrainingSession = vi.fn();
let mockError: Error | null = null;
const mockToast = vi.fn();

// Mock react-router with all actual exports and overridden useNavigate
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock other dependencies as needed
vi.mock("@/hooks/useCreateTrainingSession", () => ({
  default: () => ({
    createTrainingSession: mockCreateTrainingSession,
    error: mockError,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
    dismiss: vi.fn(),
    toasts: [],
  }),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => mockCookiesValue,
}));

// Define mockCookiesValue outside the describe block if needed
interface CookiesValue {
  accountId: number | null;
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string;
  phone: string;
  organisationIds: number[];
}

let mockCookiesValue: CookiesValue = {
  accountId: 1,
  type: "ADMIN",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  pictureUrl: "http://example.com/john.jpg",
  phone: "123-456-7890",
  organisationIds: [42],
};

describe("CreateTrainingSessionForm", () => {
  beforeAll(() => {
    // Mock ResizeObserver if necessary
    class ResizeObserver {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      observe(_: Element): void {}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      unobserve(_: Element): void {}
      disconnect(): void {}
    }
    Object.defineProperty(global, "ResizeObserver", {
      writable: true,
      configurable: true,
      value: ResizeObserver,
    });

    // Mock scrollIntoView if necessary
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mockCookiesValue and mockError before each test
    mockCookiesValue = {
      accountId: 1,
      type: "ADMIN",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      pictureUrl: "http://example.com/john.jpg",
      phone: "123-456-7890",
      organisationIds: [42],
    };
    mockError = null;

    // Mock window.matchMedia if necessary
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(
        (query: string): MediaQueryList => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })
      ),
    });
  });

  function renderComponent() {
    const routes = [
      {
        path: "/create",
        element: <CreateTrainingSessionForm />,
      },
      {
        path: "/",
        element: <div>Home Page</div>, // Mock home page for redirection
      },
    ];
    const router = createMemoryRouter(routes, { initialEntries: ["/create"] });

    return render(<RouterProvider router={router} />);
  }

  it("renders the form correctly", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: "Create New Event" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Complete the form and submit/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Type of Event/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Pick a start date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Pick an end date/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Location/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Recurring event/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Visibility/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Attachment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Attendance Capacity/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Create new Event/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("redirects to home if user is not authenticated or is GENERAL", () => {
    mockCookiesValue.accountId = null;
    mockCookiesValue.type = "GENERAL";
    renderComponent();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("submits the form successfully", async () => {
    mockCreateTrainingSession.mockResolvedValue({ success: true });
    renderComponent();

    await userEvent.type(screen.getByLabelText(/Title/i), "Test Event");

    await userEvent.click(
      screen.getByRole("combobox", { name: /Type of Event/i })
    );
    await userEvent.click(screen.getByText("Training Session"));

    const pickStartDateButton = screen.getByRole("button", {
      name: /Pick a start date/i,
    });
    await userEvent.click(pickStartDateButton);

    const startDateDialog = await screen.findByRole("dialog");
    expect(startDateDialog).toBeInTheDocument();

    const startDateButton = within(startDateDialog).getByRole("gridcell", {
      name: "25",
    });
    await userEvent.click(startDateButton);

    const pickEndDateButton = screen.getByRole("button", {
      name: /Pick an end date/i,
    });
    await userEvent.click(pickEndDateButton);

    const endDateDialog = await screen.findByRole("dialog");
    expect(endDateDialog).toBeInTheDocument();

    const endDateButton = within(endDateDialog).getByRole("gridcell", {
      name: "26",
    });
    await userEvent.click(endDateButton);

    await userEvent.type(screen.getByLabelText(/Start Time/i), "10:00");
    await userEvent.type(screen.getByLabelText(/End Time/i), "12:00");

    await userEvent.click(screen.getByRole("combobox", { name: /Location/i }));
    await userEvent.click(screen.getByText("Centre de loisirs St-Denis"));

    await userEvent.click(screen.getByLabelText(/Recurring event/i));

    await userEvent.click(
      screen.getByRole("combobox", { name: /Visibility/i })
    );
    await userEvent.click(screen.getByText("Public"));

    await userEvent.type(
      screen.getByLabelText(/Description/i),
      "This is a test event."
    );

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    await userEvent.upload(fileInput, file);

    await userEvent.type(screen.getByLabelText(/Attendance Capacity/i), "100");

    await userEvent.click(
      screen.getByRole("button", { name: /Create new Event/i })
    );

    await waitFor(() => {
      expect(mockCreateTrainingSession).toHaveBeenCalledWith(
        1,
        expect.any(FormData)
      );
      expect(mockToast).toHaveBeenCalledWith({
        title: "Form submitted successfully ✔",
        description: "Event was added to your calendar.",
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it("handles form submission error", async () => {
    mockCreateTrainingSession.mockResolvedValue(null);
    renderComponent();

    await userEvent.type(screen.getByLabelText(/Title/i), "Test Event");

    await userEvent.click(
      screen.getByRole("combobox", { name: /Type of Event/i })
    );
    await userEvent.click(screen.getByText("Training Session"));

    const pickStartDateButton = screen.getByRole("button", {
      name: /Pick a start date/i,
    });
    await userEvent.click(pickStartDateButton);

    const startDateDialog = await screen.findByRole("dialog");
    expect(startDateDialog).toBeInTheDocument();

    const startDateButton = within(startDateDialog).getByRole("gridcell", {
      name: "25",
    });
    await userEvent.click(startDateButton);

    const pickEndDateButton = screen.getByRole("button", {
      name: /Pick an end date/i,
    });
    await userEvent.click(pickEndDateButton);

    const endDateDialog = await screen.findByRole("dialog");
    expect(endDateDialog).toBeInTheDocument();

    const endDateButton = within(endDateDialog).getByRole("gridcell", {
      name: "26",
    });
    await userEvent.click(endDateButton);

    await userEvent.type(screen.getByLabelText(/Start Time/i), "10:00");
    await userEvent.type(screen.getByLabelText(/End Time/i), "12:00");

    await userEvent.click(screen.getByRole("combobox", { name: /Location/i }));
    await userEvent.click(screen.getByText("Centre de loisirs St-Denis"));

    await userEvent.click(screen.getByLabelText(/Recurring event/i));

    await userEvent.click(
      screen.getByRole("combobox", { name: /Visibility/i })
    );
    await userEvent.click(screen.getByText("Public"));

    await userEvent.type(
      screen.getByLabelText(/Description/i),
      "This is a test event."
    );

    await userEvent.type(screen.getByLabelText(/Attendance Capacity/i), "100");

    await userEvent.click(
      screen.getByRole("button", { name: /Create new Event/i })
    );

    await waitFor(() => {
      expect(mockCreateTrainingSession).toHaveBeenCalledWith(
        1,
        expect.any(FormData)
      );
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description:
          "There was a problem with your request. Event was not created.",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("disables the submit button while loading", async () => {
    let resolvePromise!: (value: { success: boolean }) => void;
    const promise = new Promise<{ success: boolean }>((resolve) => {
      resolvePromise = resolve;
    });
    mockCreateTrainingSession.mockReturnValue(promise);

    renderComponent();

    await userEvent.type(screen.getByLabelText(/Title/i), "Test Event");

    await userEvent.click(
      screen.getByRole("combobox", { name: /Type of Event/i })
    );
    await userEvent.click(screen.getByText("Training Session"));

    const pickStartDateButton = screen.getByRole("button", {
      name: /Pick a start date/i,
    });
    await userEvent.click(pickStartDateButton);

    const startDateDialog = await screen.findByRole("dialog");
    expect(startDateDialog).toBeInTheDocument();

    const startDateButton = within(startDateDialog).getByRole("gridcell", {
      name: "25",
    });
    await userEvent.click(startDateButton);

    const pickEndDateButton = screen.getByRole("button", {
      name: /Pick an end date/i,
    });
    await userEvent.click(pickEndDateButton);

    const endDateDialog = await screen.findByRole("dialog");
    expect(endDateDialog).toBeInTheDocument();

    const endDateButton = within(endDateDialog).getByRole("gridcell", {
      name: "26",
    });
    await userEvent.click(endDateButton);

    await userEvent.type(screen.getByLabelText(/Start Time/i), "10:00");
    await userEvent.type(screen.getByLabelText(/End Time/i), "12:00");

    await userEvent.click(screen.getByRole("combobox", { name: /Location/i }));
    await userEvent.click(screen.getByText("Centre de loisirs St-Denis"));

    await userEvent.click(screen.getByLabelText(/Recurring event/i));

    await userEvent.click(
      screen.getByRole("combobox", { name: /Visibility/i })
    );
    await userEvent.click(screen.getByText("Public"));

    await userEvent.type(
      screen.getByLabelText(/Description/i),
      "This is a test event."
    );

    await userEvent.type(screen.getByLabelText(/Attendance Capacity/i), "100");

    await userEvent.click(
      screen.getByRole("button", { name: /Create new Event/i })
    );

    const creatingButton = await screen.findByRole("button", {
      name: /Creating Event/i,
    });
    expect(creatingButton).toBeDisabled();

    resolvePromise({ success: true });

    await waitFor(() => {
      expect(mockCreateTrainingSession).toHaveBeenCalledWith(
        1,
        expect.any(FormData)
      );
      expect(mockToast).toHaveBeenCalledWith({
        title: "Form submitted successfully ✔",
        description: "Event was added to your calendar.",
      });
      expect(mockNavigate).toHaveBeenCalledWith(-1);
      expect(
        screen.queryByRole("button", { name: /Creating Event/i })
      ).not.toBeInTheDocument();
    });
  });

  it("shows validation errors when required fields are missing", async () => {
    renderComponent();
    await userEvent.click(
      screen.getByRole("button", { name: /Create new Event/i })
    );

    await waitFor(() => {
      const requiredErrors = screen.getAllByText(/Required/i);
      const numberOfFields = 8; // Adjust based on actual required fields
      expect(requiredErrors.length).toBeGreaterThanOrEqual(numberOfFields);
    });
  });

  it("navigates back when Cancel is clicked", async () => {
    renderComponent();
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
