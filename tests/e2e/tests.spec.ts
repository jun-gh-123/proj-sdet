import { test, expect } from "@playwright/test";

import seed_vals from "../db/seed_vals.json";

test("Base Page", async ({ page }) => {
  await page.goto("http://app:3000");

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

test("View All Users link", async ({ page }) => {
  await page.goto("http://app:3000");

  // Click the get started link.
  await page.getByRole("link", { name: "View All Users" }).click();

  // Expects page to have a h1 with text 'All Users'
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText("All Users");

  // wait for table to render
  const table = page.locator("#users-table");
  await expect(table).toBeVisible();

  // check for each seeded user to be visible in table
  for (const user of seed_vals.users) {
    await expect(table.getByText(user.name, { exact: true })).toBeVisible();
    await expect(table.getByText(user.email, { exact: true })).toBeVisible();
  }
});
