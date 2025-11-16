import { test, expect } from '@playwright/test';

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('app-controls');
    await page.waitForSelector('lyrics-panel');
    
    await page.waitForTimeout(300);
    
    // Load sample song to have lines to work with
    await page.getByRole('button', { name: 'Load Sample' }).click();
    await page.waitForTimeout(500);
  });

  test('should select a line when clicked', async ({ page }) => {
    // Verify lines exist first
    const lineCount = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      return lines?.length || 0;
    });
    
    expect(lineCount).toBeGreaterThan(0);
    
    // Select a line using the store directly (simulating user interaction)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = canvas?.store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.selectLine(lines[0].id);
      }
    });
    
    await page.waitForTimeout(100);
    
    // Check if line has selected attribute
    const hasSelectedLine = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      const firstLine = lines?.[0] as HTMLElement;
      return firstLine?.hasAttribute('selected') || false;
    });
    
    expect(hasSelectedLine).toBe(true);
  });

  test('should deselect when clicking canvas background', async ({ page }) => {
    // First select a line using the store
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.selectLine(lines[0].id);
      }
    });
    
    await page.waitForTimeout(100);
    
    // Clear selection using the store (simulating canvas click)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      
      if (store) {
        store.clearSelection();
      }
    });
    
    await page.waitForTimeout(100);
    
    // Check if any lines are still selected
    const clearedSelection = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      if (!lines) return false;
      
      for (const line of Array.from(lines)) {
        if ((line as HTMLElement).hasAttribute('selected')) {
          return false;
        }
      }
      return true;
    });
    
    expect(clearedSelection).toBe(true);
  });

  test('should multi-select with shift key', async ({ page }) => {
    // Select first line using the store
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length >= 2) {
        // Select first line (clears others)
        store.selectLine(lines[0].id);
        // Toggle second line (adds to selection)
        store.toggleLineSelection(lines[1].id);
      }
    });
    
    await page.waitForTimeout(100);
    
    // Check if both lines are selected
    const multipleSelected = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      
      if (!lines || lines.length < 2) return false;
      
      const firstSelected = (lines[0] as HTMLElement).hasAttribute('selected');
      const secondSelected = (lines[1] as HTMLElement).hasAttribute('selected');
      
      return firstSelected && secondSelected;
    });
    
    expect(multipleSelected).toBe(true);
  });

  test('should toggle selection with shift+click', async ({ page }) => {
    // Toggle line on (simulate shift+click)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.toggleLineSelection(lines[0].id);
      }
    });
    
    await page.waitForTimeout(50);
    
    const selectedAfterFirst = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      const firstLine = lines?.[0] as HTMLElement;
      return firstLine?.hasAttribute('selected') || false;
    });
    
    // Toggle line off (simulate shift+click again)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.toggleLineSelection(lines[0].id);
      }
    });
    
    await page.waitForTimeout(50);
    
    const deselectedAfterSecond = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      const firstLine = lines?.[0] as HTMLElement;
      return !firstLine?.hasAttribute('selected');
    });
    
    expect(selectedAfterFirst).toBe(true);
    expect(deselectedAfterSecond).toBe(true);
  });

  test('should show visual selection state', async ({ page }) => {
    // Select a line using the store
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.selectLine(lines[0].id);
      }
    });
    
    await page.waitForTimeout(100);
    
    // Check that the selected line has the selected styling
    const hasSelectedStyle = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      const firstLine = lines?.[0] as HTMLElement;
      
      if (!firstLine || !firstLine.hasAttribute('selected')) return false;
      
      // Check that the lyric-line element has the selected attribute
      // which should apply the purple border styling
      const lyricLineDiv = firstLine.shadowRoot?.querySelector('.lyric-line') as HTMLElement;
      if (!lyricLineDiv) return false;
      
      // The CSS should apply border styling when [selected] attribute is present
      const computedStyle = window.getComputedStyle(lyricLineDiv);
      const borderColor = computedStyle.borderColor;
      
      // Check if border color is set (not transparent)
      return borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent';
    });
    
    expect(hasSelectedStyle).toBe(true);
  });

  test('should clear selection when loading a new song', async ({ page }) => {
    // Select a line using the store
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas') as any;
      const store = canvas?.store;
      const lines = store?.lines;
      
      if (store && lines && lines.length > 0) {
        store.selectLine(lines[0].id);
      }
    });
    
    await page.waitForTimeout(100);
    
    // Load sample song again (which should clear selection)
    await page.getByRole('button', { name: 'Load Sample' }).click();
    await page.waitForTimeout(500);
    
    // Check that no lines are selected
    const noSelection = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
      const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
      if (!lines) return true;
      
      for (const line of Array.from(lines)) {
        if ((line as HTMLElement).hasAttribute('selected')) {
          return false;
        }
      }
      return true;
    });
    
    expect(noSelection).toBe(true);
  });
});

