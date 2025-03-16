import { test, expect } from "@playwright/test";

test("ensure backend responds", async () => {
  const res = await fetch("http://localhost/api/health/ping");
  console.log(res);
  expect(res.status).toBe(200);
});

test("should start at login page", async ({ page }) => {
  await page.goto("/");

  await page.waitForURL("/login");

  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});

test("should sign up", async ({ page }) => {
  // Navigate to Sign Up page
  await page.goto("/");
  await page.waitForURL("/login");
  await page.getByRole("link", { name: "Sign Up" }).click();
  await page.waitForURL("/signup");

  // Fill in Sign Up form
  const email = `test-${Date.now()}@onibad.com`;
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Phone" }).fill("1112223333");
  await page.getByRole("textbox", { name: "Password" }).fill("Password!123");
  await page.getByRole("textbox", { name: "First Name" }).fill("test");
  await page.getByRole("textbox", { name: "Last Name" }).fill("test");
  await page.getByRole("textbox", { name: "Address" }).fill("test");
  await page.getByRole("textbox", { name: "Postal Code" }).fill("test");
  await page.getByRole("textbox", { name: "City" }).fill("test");
  await page.getByRole("textbox", { name: "Province" }).fill("test");
  await page.getByRole("textbox", { name: "Country" }).fill("test");
  await page.getByRole("button", { name: "Sign Up" }).click();

  // Should be redirected to email verification page
  await page.waitForURL("/verificationcode");
  await expect(page.getByText("Email Verification")).toBeVisible();
});
