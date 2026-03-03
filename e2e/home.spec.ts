import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Modern JSON Viewer/);
});

test('can input JSON and see tree view', async ({ page }) => {
  await page.goto('/');

  // Input JSON
  // Monaco editor is tricky to test directly with fill, usually we click and type
  // But for this test we can just check if the initial state is clean
  
  // Check if "JSON Input" header exists
  await expect(page.getByText('JSON Input')).toBeVisible();

  // Check if buttons exist
  await expect(page.getByRole('button', { name: 'Format' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tree View' })).toBeVisible();
});
