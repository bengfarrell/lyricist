import { test, expect } from '@playwright/test';
import { setupPage, addLyricLine, getLyricsPanelText } from './test-helpers';

test.describe('Line Manipulation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('should add lyric lines', async ({ page }) => {
    // Add a line
    await addLyricLine(page, 'Test line');
    
    // Verify line exists in panel
    const lyrics = await getLyricsPanelText(page);
    
    expect(lyrics).toContain('Test line');
  });

  test('should display lyrics in the panel', async ({ page }) => {
    // Add multiple lines
    const lines = ['First line', 'Second line', 'Third line'];
    
    for (const line of lines) {
      await addLyricLine(page, line);
    }
    
    // Verify all lines appear in lyrics panel
    const lyricsText = await getLyricsPanelText(page);
    
    for (const line of lines) {
      expect(lyricsText).toContain(line);
    }
  });
});
