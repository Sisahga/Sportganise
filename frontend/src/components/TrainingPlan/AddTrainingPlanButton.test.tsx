/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTrainingPlanButton from "./AddTrainingPlanButton";

describe("AddTrainingPlanButton", () => {
  it("renders the trigger button", () => {
    render(<AddTrainingPlanButton />);
    const triggerButton = screen.getByLabelText(/add new item/i);
    expect(triggerButton).to.exist;
    expect(document.body.contains(triggerButton)).to.be.true;
  });

  it("opens the sheet when the trigger is clicked", async () => {
    render(<AddTrainingPlanButton />);
    const triggerButton = screen.getByLabelText(/add new item/i);
    fireEvent.click(triggerButton);

    const sheetTitle = await screen.findByText(/upload training plan\(s\)/i);
    const sheetDescription = await screen.findByText(
      /you can upload one or many files\./i,
    );

    expect(sheetTitle).to.exist;
    expect(sheetDescription).to.exist;
  });
});
