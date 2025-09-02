import { test, expect } from '@playwright/test';

test.describe('Battle Scene', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the lyrics selection screen
    await page.goto('/rapgenerator/');
    await page.getByRole('button', { name: /start/i }).click();
    await expect(page.getByText('歌詞を4つ選択してください')).toBeVisible();

    // Select the first 4 lyrics to enable the start button
    // The buttons are identified by their text content.
    await page.getByRole('button', { name: /俺のフロウは/ }).click();
    await page.getByRole('button', { name: /ここは俺のステージ/ }).click();
    await page.getByRole('button', { name: /お前のスキルじゃ/ }).click();
    await page.getByRole('button', { name: /韻を踏むのは/ }).click();

    // Start the battle
    await page.getByRole('button', { name: 'バトル開始' }).click();

    // Wait for the battle scene to load
    await expect(page.getByText('Turn: 1/4')).toBeVisible();
  });

  test('initial layout', async ({ page }) => {
    await page.screenshot({ path: 'test-results/battle-scene-initial.png', fullPage: true });
  });

  test('pre-activation state', async ({ page }) => {
    // Wait for the player's turn
    await expect(page.getByText('YOUR TURN: SELECT!')).toBeVisible({ timeout: 10000 });

    // Click the first word button (assuming '最強' is from the first lyric selected)
    await page.getByRole('button', { name: '最強' }).click();

    // Check that the activate button is visible
    await expect(page.getByRole('button', { name: 'ACTIVATE!' })).toBeVisible();

    await page.screenshot({ path: 'test-results/battle-scene-pre-activation.png', fullPage: true });
  });

  test('post-activation state', async ({ page }) => {
    // Wait for the player's turn
    await expect(page.getByText('YOUR TURN: SELECT!')).toBeVisible({ timeout: 10000 });

    // Select a word
    await page.getByRole('button', { name: '最強' }).click();

    // Click the activate button
    await page.getByRole('button', { name: 'ACTIVATE!' }).click();

    // Check that the feedback is visible
    await expect(page.getByText(/PERFECT|GREAT|GOOD|MISS/i)).toBeVisible();

    await page.screenshot({ path: 'test-results/battle-scene-post-activation.png', fullPage: true });
  });
});
