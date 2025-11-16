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
    // Add a lyric line
    await fillLyricInput(page, 'Amazing grace how sweet the sound');
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
      await fillLyricInput(page, line);
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

  test('should move chord with keyboard arrows when active', async ({ page }) => {
    // Add a lyric line
    await fillLyricInput(page, 'Wake up to the sunrise glow');
    await page.getByRole('button', { name: 'Add Line' }).click();
    await page.waitForTimeout(300);
    
    // Enable chord section and add a chord
    const { chordPosition: initialPosition } = await page.evaluate(async () => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      
      if (!lyricLine) throw new Error('Lyric line not found');
      
      // Click the chord toggle button to enable chord section
      const chordToggleBtn = lyricLine.shadowRoot?.querySelector('.chord-toggle-btn') as HTMLElement;
      chordToggleBtn?.click();
      
      // Wait a bit for chord section to appear
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Click the chord section to add a chord
      const chordSection = lyricLine.shadowRoot?.querySelector('.chord-section') as HTMLElement;
      if (!chordSection) throw new Error('Chord section not found');
      
      // Click in the middle to add a chord
      const rect = chordSection.getBoundingClientRect();
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        clientX: rect.left + rect.width * 0.5,
        clientY: rect.top + rect.height * 0.5
      });
      chordSection.dispatchEvent(clickEvent);
      
      // Wait for chord picker to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Select a chord (G)
      const chordOption = lyricLine.shadowRoot?.querySelector('.chord-option') as HTMLElement;
      chordOption?.click();
      
      // Wait for chord to be added
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get initial chord position directly from the lyric-line component
      const canvasEl = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLineEl = canvasEl?.shadowRoot?.querySelector('lyric-line');
      const chords = (lyricLineEl as any)?.chords || [];
      
      return { chordPosition: chords[0]?.position || 0 };
    });
    
    // Click the chord marker to make it active
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      const chordMarker = lyricLine?.shadowRoot?.querySelector('.chord-marker') as HTMLElement;
      chordMarker?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      chordMarker?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    
    await page.waitForTimeout(100);
    
    // Press right arrow key multiple times by dispatching keyboard events directly to document
    // Add small delays between key presses to let the app process each one
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    await page.waitForTimeout(50);
    
    // Get new position
    const { chordPosition: newPosition } = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      
      // Get chords directly from the lyric-line component
      const chords = (lyricLine as any)?.chords || [];
      
      return { chordPosition: chords[0]?.position || 0 };
    });
    
    // Verify chord moved (3 presses * 0.5% = 1.5% to the right)
    expect(newPosition).toBeGreaterThan(initialPosition);
    expect(newPosition).toBeCloseTo(initialPosition + 1.5, 0);
    
    // Press left arrow key twice
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    });
    await page.waitForTimeout(50);
    
    // Get final position
    const { chordPosition: finalPosition } = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      
      // Get chords directly from the lyric-line component
      const chords = (lyricLine as any)?.chords || [];
      
      return { chordPosition: chords[0]?.position || 0 };
    });
    
    // Verify chord moved back (2 presses * 0.5% = 1.0% to the left)
    expect(finalPosition).toBeLessThan(newPosition);
    expect(finalPosition).toBeCloseTo(newPosition - 1.0, 0);
  });
});
