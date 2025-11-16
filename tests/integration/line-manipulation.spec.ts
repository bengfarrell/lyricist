import { test, expect } from '@playwright/test';

// Helper function to fill lyric input inside shadow DOM
async function fillLyricInput(page: any, text: string) {
  await page.evaluate((textValue: string) => {
    const app = document.querySelector('lyricist-app');
    const controls = app?.shadowRoot?.querySelector('app-controls');
    const input = controls?.shadowRoot?.querySelector('.lyric-input') as HTMLInputElement;
    if (input) {
      input.value = textValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, text);
}

test.describe('Line Manipulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('app-controls');
    await page.waitForSelector('lyrics-panel');
    
    await page.waitForTimeout(300);
  });

  test('should add lyric lines', async ({ page }) => {
    // Add a line
    await fillLyricInput(page, 'Test line');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(300);
    
    // Verify line exists in panel
    const lyrics = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
    });
    
    expect(lyrics).toContain('Test line');
  });

  test('should load sample song', async ({ page }) => {
    // Click load sample button
    await page.getByRole('button', { name: 'Load Sample' }).click();
    await page.waitForTimeout(500);
    
    // Verify sample song loaded
    const songNameInput = page.locator('input[placeholder="Song Name"]');
    const songName = await songNameInput.inputValue();
    expect(songName).toMatch(/Sample/i);
    
    // Verify sample lyrics appear
    const hasLyrics = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      const lyrics = panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
      return lyrics.length > 100;
    });
    
    expect(hasLyrics).toBe(true);
  });

  test('should display lyrics in the panel', async ({ page }) => {
    // Add multiple lines
    const lines = ['First line', 'Second line', 'Third line'];
    
    for (const line of lines) {
      await fillLyricInput(page, line);
      await page.getByRole('button', { name: 'Add Line' }).click();
      await page.waitForTimeout(200);
    }
    
    // Verify all lines appear in lyrics panel
    const lyricsText = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
    });
    
    for (const line of lines) {
      expect(lyricsText).toContain(line);
    }
  });
});
