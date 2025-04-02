import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TrainingPlanContent from "./TrainingPlanContent";
import { BrowserRouter } from "react-router";

// Partial mock for react-router's useNavigate
const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock cookies service
const getCookiesMock = vi.fn();
const getAccountIdCookieMock = vi.fn();
vi.mock("@/services/cookiesService", () => ({
  getCookies: () => getCookiesMock(),
  getAccountIdCookie: (cookies: unknown) => getAccountIdCookieMock(cookies),
}));

// Create a training plans mock function
const trainingPlansMock = vi.fn();
vi.mock("@/hooks/useTrainingPlans", () => ({
  default: (accountId: number | null | undefined) => {
    if (!accountId) {
      return {
        myTrainingPlans: [],
        sharedTrainingPlans: [],
        loading: false,
        error: null,
      };
    }
    return trainingPlansMock(accountId);
  },
}));

// Mock TrainingPlanTable component
vi.mock("./Table/TrainingPlanTable.tsx", () => ({
  default: () => <div data-testid="training-plan-table">TrainingPlanTable</div>,
}));

// Mock AddTrainingPlanButton component
vi.mock("@/components/TrainingPlan", () => ({
  AddTrainingPlanButton: () => (
    <div data-testid="add-training-plan-button">AddTrainingPlanButton</div>
  ),
}));

describe.skip("TrainingPlanContent", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    getCookiesMock.mockReset();
    getAccountIdCookieMock.mockReset();
    trainingPlansMock.mockReset();
  });

  it("renders error message if accountId is null", async () => {
    getCookiesMock.mockReturnValue({}); // No cookies available
    getAccountIdCookieMock.mockReturnValue(null);
    render(
      <BrowserRouter>
        <TrainingPlanContent />
      </BrowserRouter>,
    );
    expect(await screen.findByText(/An error occurred!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Could not find your Account!/i),
    ).toBeInTheDocument();
  });

  it('navigates to "/" if cookies type is GENERAL or PLAYER', async () => {
    getCookiesMock.mockReturnValue({ accountId: 1, type: "PLAYER" });
    getAccountIdCookieMock.mockReturnValue(1);
    trainingPlansMock.mockReturnValue({
      myTrainingPlans: [],
      sharedTrainingPlans: [],
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <TrainingPlanContent />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows loader when loading is true", async () => {
    getCookiesMock.mockReturnValue({ accountId: 1, type: "ADMIN" });
    getAccountIdCookieMock.mockReturnValue(1);
    trainingPlansMock.mockReturnValue({
      myTrainingPlans: [],
      sharedTrainingPlans: [],
      loading: true,
      error: null,
    });
    const { container } = render(
      <BrowserRouter>
        <TrainingPlanContent />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  it("shows error message when error is present", async () => {
    getCookiesMock.mockReturnValue({ accountId: 1, type: "ADMIN" });
    getAccountIdCookieMock.mockReturnValue(1);
    trainingPlansMock.mockReturnValue({
      myTrainingPlans: [],
      sharedTrainingPlans: [],
      loading: false,
      error: "Error! Could not get training plans.",
    });
    render(
      <BrowserRouter>
        <TrainingPlanContent />
      </BrowserRouter>,
    );
    expect(
      await screen.findByText(/Error! Could not get training plans\./i),
    ).toBeInTheDocument();
  });

  it("renders TrainingPlanTable and AddTrainingPlanButton when data is loaded", async () => {
    getCookiesMock.mockReturnValue({ accountId: 1, type: "ADMIN" });
    getAccountIdCookieMock.mockReturnValue(1);
    const myPlans = [{ id: 1, title: "Plan 1" }];
    const sharedPlans = [{ id: 2, title: "Plan 2" }];
    trainingPlansMock.mockReturnValue({
      myTrainingPlans: myPlans,
      sharedTrainingPlans: sharedPlans,
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <TrainingPlanContent />
      </BrowserRouter>,
    );
    expect(
      await screen.findByTestId("training-plan-table"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("add-training-plan-button")).toBeInTheDocument();
    expect(screen.getByText(/Training Plan/i)).toBeInTheDocument();
  });
});
