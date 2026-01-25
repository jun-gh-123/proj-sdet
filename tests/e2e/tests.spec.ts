import { test, expect } from "@playwright/test";

const timestamp = Date.now();
const name = `user${timestamp}`;
const email = `${name}@${timestamp}mail.com`;
const reUserDetailsPath = new RegExp(`/users\\?email=${email}$`);

test("Root Page", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Project SDET/);

  // Expect h1 and link with certain values to be visible
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText("Learn SDET things");

  const link = page.getByRole("link", { name: "View All Users" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "./users");
});

test.describe.serial("Users Functionality", () => {
  test("Create New User", async ({ page }) => {
    await page.goto("/");

    // Click the get started link.
    await page.getByRole("link", { name: "Create New User" }).click();

    // fill out and submit form
    await page.fill("#name", name);
    await page.fill("#email", email);
    await page.click("#submit-create-user");

    // check user details page
    await expect(page).toHaveURL(reUserDetailsPath);
    await expect(page.locator("#name")).toHaveValue(name);
    await expect(page.getByText(email, { exact: true })).toBeVisible();

    // check all users page
    await page.goto("/users");
    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(email, { exact: true })).toBeVisible();

    // check link works
    await page.getByText(email).click();
    await expect(page).toHaveURL(reUserDetailsPath);
  });

  test("Change Name", async ({ page }) => {
    await page.goto(`/users?email=${email}`);

    // assign new name and submit
    const newName = name + 2;
    await page.fill("#name", newName);
    await page.click("#submit-change-name");

    // check newName is visible in users details
    await expect(page).toHaveURL(reUserDetailsPath);
    await expect(page.locator("#name")).toHaveValue(newName);

    // check newName is visible in all users page
    await page.goto(`/users`);
    await expect(page.getByText(newName, { exact: true })).toBeVisible();
  });

  test("Delete User", async ({ page }) => {
    await page.goto(`/users?email=${email}`);

    // submit user delete request
    await page.click("#submit-user-delete");

    // check redirect to all users and user is gone
    await expect(page).toHaveURL(/users/);
    await expect(page.getByText(name, { exact: true })).not.toBeVisible();
    await expect(page.getByText(email, { exact: true })).not.toBeVisible();

    // check user not found in user details
    await page.goto(`/users?email=${email}`);
    await expect(page.getByText("User Not Found")).toBeVisible();
  });
});
