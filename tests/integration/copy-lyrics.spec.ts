import { test, expect } from '@playwright/test';
import { setupPage, addLyricLine } from './test-helpers';

test.describe('Copy Lyrics', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('should copy formatted lyrics to clipboard', async ({ page }) => {
    // Grant clipboard permissions first
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Add some lyric lines
    await addLyricLine(page, 'First verse here');
    await addLyricLine(page, 'Second verse here');
    await addLyricLine(page, 'Third verse here');
    
    // Switch to lyrics panel to make sure we're in the right context
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const navbar = app?.shadowRoot?.querySelector('app-navbar');
      const lyricsTab = Array.from(navbar?.shadowRoot?.querySelectorAll('.navbar-tab') || [])
        .find(tab => tab.textContent?.trim() === 'Lyrics') as HTMLElement;
      lyricsTab?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Click copy button in floating-strip
    const copyResult = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const copyBtn = floatingStrip?.shadowRoot?.querySelector('sp-button[title="Copy all lyrics"]') as HTMLElement;
      copyBtn?.click();
      return !!copyBtn;
    });
    
    expect(copyResult).toBe(true);
    await page.waitForTimeout(500);
    
    // Verify clipboard contains the lyrics
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('First verse here');
    expect(clipboardText).toContain('Second verse here');
    expect(clipboardText).toContain('Third verse here');
  });
});
