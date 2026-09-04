import { expect, test } from '@playwright/test';
test('renders the account book shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '대시보드' })).toBeVisible();
});
