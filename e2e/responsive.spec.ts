import { expect, test } from '@playwright/test';

/**
 * The page must never scroll sideways. We disable the root `overflow-x: clip`
 * safety net so this asserts the *layout* is clean, not merely masked.
 */
const WIDTHS = [320, 360, 390, 414, 640, 768, 834, 1024, 1100, 1280, 1440, 1920];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.addStyleTag({ content: 'html,body{overflow-x:visible!important}' });
    await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty({ timeout: 20_000 });
    await page.locator('.editions__strip').waitFor({ timeout: 20_000 });
    for (let y = 0; y < 14_000; y += 800) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(20);
    }
    const toggle = page.getByRole('button', { name: 'Menú' });
    if (await toggle.isVisible()) await toggle.click();

    const result = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('body *')) {
        if (getComputedStyle(el).position === 'fixed' || el.classList.contains('sr-only')) continue;
        let p = el.parentElement;
        let clipped = false;
        while (p && p !== document.body) {
          if (getComputedStyle(p).overflowX !== 'visible') {
            clipped = true;
            break;
          }
          p = p.parentElement;
        }
        if (clipped) continue;
        const b = el.getBoundingClientRect();
        if (b.width && b.right > vw + 0.5) offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
      }
      return { vw, sw: document.documentElement.scrollWidth, offenders: [...new Set(offenders)].slice(0, 5) };
    });
    expect(result.offenders, `elements past the viewport at ${width}px`).toEqual([]);
    expect(result.sw, `scrollWidth at ${width}px`).toBeLessThanOrEqual(result.vw);
  });
}
