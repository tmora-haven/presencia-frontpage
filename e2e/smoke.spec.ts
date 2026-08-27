import { expect, test } from '@playwright/test';

/**
 * Structural smoke test against the live site. Deliberately asserts only
 * *shape* (masthead, a hero, at least one rail) — never specific headlines —
 * so daily news changes cannot make it flaky.
 */
test('frontpage renders live content from the WordPress API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty({ timeout: 20_000 });
  await expect(page.getByRole('heading', { name: 'Regionales' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('region').filter({ hasText: 'Ver todo' }).first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // Every external link must be hardened.
  const unsafe = await page.locator('a[target="_blank"]:not([rel~="noopener"])').count();
  expect(unsafe).toBe(0);
});
