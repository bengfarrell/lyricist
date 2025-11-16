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

test.describe('Song Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('app-header');
    await page.waitForSelector('app-controls');
    await page.waitForSelector('lyric-canvas');
    await page.waitForSelector('lyrics-panel');
    
    // Additional wait for shadow DOM to be ready
    await page.waitForTimeout(300);
  });

  test('should create, edit, and save a complete song', async ({ page }) => {
    const songNameInput = page.locator('input[placeholder="Song Name"]');
    
    // Set song name
    await songNameInput.fill('My Test Song');
    
    // Add first lyric line
    await fillLyricInput(page, 'First line of lyrics');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    // Add second lyric line
    await fillLyricInput(page, 'Second line of lyrics');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    // Verify lines appear in lyrics panel
    const lyrics = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
    });
    
    expect(lyrics).toContain('First line of lyrics');
    expect(lyrics).toContain('Second line of lyrics');
    
    // Save the song
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    
    // Verify save feedback
    const saveButton = page.getByRole('button', { name: /Saved/i });
    await expect(saveButton).toBeVisible({ timeout: 2000 });
  });

  test('should save and load a song', async ({ page }) => {
    const songNameInput = page.locator('input[placeholder="Song Name"]');
    
    // Create and save a song
    await songNameInput.fill('Saved Song');
    
    await fillLyricInput(page, 'Line one');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    await fillLyricInput(page, 'Line two');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    
    // Start a new song
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'New' }).click();
    await page.waitForTimeout(300);
    
    // Verify canvas is empty
    const linesAfterNew = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      return canvas?.shadowRoot?.querySelectorAll('lyric-line').length || 0;
    });
    expect(linesAfterNew).toBe(0);
    
    // Open load dialog
    await page.getByRole('button', { name: 'Load', exact: true }).click();
    await page.waitForTimeout(300);
    
    // Verify saved song appears and load it
    const songLoaded = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const dialog = app?.shadowRoot?.querySelector('load-dialog');
      const songItem = dialog?.shadowRoot?.querySelector('.song-item');
      const songName = songItem?.textContent || '';
      
      if (songName.includes('Saved Song')) {
        (songItem as HTMLElement)?.click();
        return true;
      }
      return false;
    });
    
    expect(songLoaded).toBe(true);
    await page.waitForTimeout(300);
    
    // Verify song is loaded
    const loadedSongName = await songNameInput.inputValue();
    expect(loadedSongName).toBe('Saved Song');
    
    const loadedLyrics = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const panel = app?.shadowRoot?.querySelector('lyrics-panel');
      return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
    });
    
    expect(loadedLyrics).toContain('Line one');
    expect(loadedLyrics).toContain('Line two');
  });

  test('should delete a saved song', async ({ page }) => {
    const songNameInput = page.locator('input[placeholder="Song Name"]');
    
    // Create and save a song
    await songNameInput.fill('Song to Delete');
    await fillLyricInput(page, 'Test line');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(200);
    
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    
    // Open load dialog
    await page.getByRole('button', { name: 'Load', exact: true }).click();
    await page.waitForTimeout(300);
    
    // Delete the song
    page.once('dialog', dialog => dialog.accept());
    const deleted = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const dialog = app?.shadowRoot?.querySelector('load-dialog');
      const deleteBtn = dialog?.shadowRoot?.querySelector('.btn-danger') as HTMLButtonElement;
      
      if (deleteBtn) {
        deleteBtn.click();
        return true;
      }
      return false;
    });
    
    expect(deleted).toBe(true);
    await page.waitForTimeout(300);
    
    // Verify song is removed
    const hasEmptyMessage = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const dialog = app?.shadowRoot?.querySelector('load-dialog');
      const empty = dialog?.shadowRoot?.querySelector('.empty-message');
      return empty?.textContent?.includes('No saved songs') || false;
    });
    
    expect(hasEmptyMessage).toBe(true);
  });
});
