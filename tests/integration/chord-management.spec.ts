import { test, expect } from '@playwright/test';

test.describe('Chord Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('app-controls');
    await page.waitForSelector('lyrics-panel');
    
    await page.waitForTimeout(300);
  });

  test('should add lyrics and display them', async ({ page }) => {
    const lyricInput = page.locator('input[placeholder*="lyrics"]');
    
    // Add a lyric line
    await lyricInput.fill('Amazing grace how sweet the sound');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(300);
    
    // Verify line is visible in panel
    const lyrics = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
    });
    
    expect(lyrics).toContain('Amazing grace how sweet the sound');
  });

  test('should create and save a multi-line song', async ({ page }) => {
    const lyricInput = page.locator('input[placeholder*="lyrics"]');
    const songNameInput = page.locator('input[placeholder="Song Name"]');
    
    // Set song name
    await songNameInput.fill('Test Song');
    
    // Add multiple lines
    const lines = [
      'Amazing grace how sweet the sound',
      'That saved a wretch like me',
      'I once was lost but now am found',
      'Was blind but now I see'
    ];
    
    for (const line of lines) {
      await lyricInput.fill(line);
      await page.getByRole('button', { name: 'Add Line' }).click();
      await page.waitForTimeout(200);
    }
    
    // Save the song
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    
    // Verify save confirmation
    await expect(page.getByRole('button', { name: /Saved/i })).toBeVisible({ timeout: 2000 });
    
    // Verify all lines in lyrics panel
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
