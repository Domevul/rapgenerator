import { test, expect } from '@playwright/test';

test('lyrics selection screen layout', async ({ page }) => {
  await page.goto('/rapgenerator/');

  // Assuming there is a main menu scene with a start button
  // The text locator is case-insensitive
  await page.getByRole('button', { name: /start/i }).click();

  // Wait for the lyrics selection scene to load by checking for its title
  await expect(page.getByText('歌詞を4つ選択してください')).toBeVisible();

  // Take a screenshot for visual verification
  await page.screenshot({ path: 'test-results/lyrics-select-scene.png', fullPage: true });
});
