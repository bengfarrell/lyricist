import { test, expect } from '@playwright/test';

test.describe('Copy Lyrics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('lyrics-panel');
    
    await page.waitForTimeout(300);
  });

  test('should copy formatted lyrics to clipboard', async ({ page }) => {
    const lyricInput = page.locator('input[placeholder*="lyrics"]');
    
    // Add some lyric lines
    await lyricInput.fill('First verse here');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    await lyricInput.fill('Second verse here');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Click copy button (use evaluate as it's in shadow DOM)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      const copyBtn = panel?.shadowRoot?.querySelector('.copy-lyrics-btn') as HTMLButtonElement;
      copyBtn?.click();
    });
    await page.waitForTimeout(300);
    
    // Verify clipboard contains the lyrics
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('First verse here');
    expect(clipboardText).toContain('Second verse here');
  });

  test('should copy lyrics with sample song', async ({ page }) => {
    // Load sample song
    await page.getByRole('button', { name: 'Load Sample' }).click();
    await page.waitForTimeout(500);
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Copy lyrics (use evaluate as it's in shadow DOM)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      const copyBtn = panel?.shadowRoot?.querySelector('.copy-lyrics-btn') as HTMLButtonElement;
      copyBtn?.click();
    });
    await page.waitForTimeout(300);
    
    // Verify clipboard has content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.length).toBeGreaterThan(50); // Sample song should have substantial content
  });
});
