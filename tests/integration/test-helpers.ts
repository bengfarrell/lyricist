import { Page } from '@playwright/test';

/**
 * Set up the page and dismiss email prompt for all integration tests
 */
export async function setupPage(page: Page) {
  // Set localStorage to skip email prompt before loading
  await page.addInitScript(() => {
    localStorage.setItem('lyricist-user-email', 'test@example.com');
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Wait for app to load
  await page.waitForSelector('lyricist-app');
  
  // Wait for main components
  await page.waitForSelector('app-navbar');
  await page.waitForSelector('floating-strip, app-controls');
  await page.waitForSelector('lyric-canvas');
  
  // Additional wait for shadow DOM initialization
  await page.waitForTimeout(500);
}

/**
 * Add a lyric line using either floating-strip (desktop) or app-controls (mobile)
 */
export async function addLyricLine(page: Page, text: string) {
  // Set the input value directly through the store
  await page.evaluate((textValue: string) => {
    const app = document.querySelector('lyricist-app');
    const store = (app as any)?._store || (app as any)?.store;
    if (store && store.setNewLineInputText) {
      store.setNewLineInputText(textValue);
    }
  }, text);
  
  await page.waitForTimeout(100);
  
  // Click Add Lyric button
  const addButton = page.getByRole('button', { name: 'Add Lyric' });
  await addButton.click();
  await page.waitForTimeout(300);
}

/**
 * Get lyric lines from canvas
 */
export async function getLyricLines(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const app = document.querySelector('lyricist-app');
    const canvas = app?.shadowRoot?.querySelector('lyric-canvas');
    const lines = canvas?.shadowRoot?.querySelectorAll('lyric-line');
    
    return Array.from(lines || []).map(line => {
      const textEl = line.shadowRoot?.querySelector('.line-text');
      return textEl?.textContent?.trim() || '';
    });
  });
}

/**
 * Get lyrics text from panel
 */
export async function getLyricsPanelText(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const app = document.querySelector('lyricist-app');
    const panel = app?.shadowRoot?.querySelector('lyrics-panel');
    return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
  });
}

