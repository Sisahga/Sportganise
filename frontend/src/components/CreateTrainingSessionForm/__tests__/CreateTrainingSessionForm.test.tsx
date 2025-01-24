import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import CreateTrainingSessionForm from "../CreateTrainingSessionForm";

test("renders title field", () => {
  render(<CreateTrainingSessionForm />);
  const title = screen.getByPlaceholderText("Name the event");
  expect(title.parentNode).not.toBeNull();
});

test("renders type field", () => {
  render(<CreateTrainingSessionForm />);
  const type = screen.getByText("Type of Event");
  expect(type.parentNode).not.toBeNull();
});

test("renders occurrence date field", () => {
  render(<CreateTrainingSessionForm />);
  const startDateButton = screen.getByText("Pick a date");
  expect(startDateButton).toBeTruthy();
});

test("renders occurrence date button click field", () => {
  render(<CreateTrainingSessionForm />);
  const startDateButton = screen.getByText("Start Date");
  fireEvent.click(startDateButton);
  expect(document.body.contains(startDateButton)).toBe(true);
});
