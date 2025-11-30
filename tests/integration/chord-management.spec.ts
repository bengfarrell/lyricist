import { test, expect } from '@playwright/test';
import { setupPage, addLyricLine, getLyricsPanelText } from './test-helpers';

test.describe('Chord Management', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('should add lyrics and display them', async ({ page }) => {
    // Add a lyric line
    await addLyricLine(page, 'Amazing grace how sweet the sound');
    
    // Verify line is visible in panel
    const lyrics = await getLyricsPanelText(page);
    
    expect(lyrics).toContain('Amazing grace how sweet the sound');
  });

  test('should create and save a multi-line song', async ({ page }) => {
    // Set song name through the store (song name input is in edit-modal)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      if (store) {
        store.songName = 'Test Song';
      }
    });
    
    // Add multiple lines
    const lines = [
      'Amazing grace how sweet the sound',
      'That saved a wretch like me',
      'I once was lost but now am found',
      'Was blind but now I see'
    ];
    
    for (const line of lines) {
      await addLyricLine(page, line);
    }
    
    // Open file modal and save
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const navbar = app?.shadowRoot?.querySelector('app-navbar');
      const titleBtn = navbar?.shadowRoot?.querySelector('.navbar-title') as HTMLElement;
      titleBtn?.click();
    });
    await page.waitForTimeout(300);
    
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const modal = app?.shadowRoot?.querySelector('file-modal');
      const saveBtn = modal?.shadowRoot?.querySelector('sp-button[title="Save song"]') as HTMLElement;
      saveBtn?.click();
    });
    await page.waitForTimeout(500);
    
    // Verify all lines in lyrics panel
    const lyricsText = await getLyricsPanelText(page);
    
    for (const line of lines) {
      expect(lyricsText).toContain(line);
    }
  });

  test('should move chord with keyboard arrows when active', async ({ page }) => {
    // Add a lyric line
    await addLyricLine(page, 'Wake up to the sunrise glow');
    
    // Enable chord section and add a chord
    const { chordPosition: initialPosition } = await page.evaluate(async () => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      
      if (!lyricLine) throw new Error('Lyric line not found');
      
      // Hover over the lyric line to show buttons
      lyricLine.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      // Click the chord toggle button (sp-action-button:nth-of-type(2))
      const chordToggleBtn = lyricLine.shadowRoot?.querySelector('.lyric-line sp-action-button:nth-of-type(2)') as HTMLElement;
      if (!chordToggleBtn) throw new Error('Chord toggle button not found');
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
    
    // Click the chord marker to make it active using pointerdown event
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lyricLine = canvas?.shadowRoot?.querySelector('lyric-line');
      const chordMarker = lyricLine?.shadowRoot?.querySelector('.chord-marker') as HTMLElement;
      
      // Dispatch pointerdown event (not mousedown) to activate the chord
      chordMarker?.dispatchEvent(new PointerEvent('pointerdown', { 
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse'
      }));
      
      // Also dispatch pointerup to complete the interaction
      chordMarker?.dispatchEvent(new PointerEvent('pointerup', { 
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse'
      }));
    });
    
    await page.waitForTimeout(200);
    
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
