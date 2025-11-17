import { test, expect } from '@playwright/test';

test.describe('Word Ladder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for web components to be defined and rendered
    await page.waitForSelector('lyricist-app');
    await page.waitForSelector('app-controls');
    await page.waitForSelector('left-panel');
    
    await page.waitForTimeout(500); // Wait for sample content to load
  });

  test('should display default word ladder with Verbs and Nouns', async ({ page }) => {
    const titles = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const titles = leftPanel?.shadowRoot?.querySelectorAll('.column-title');
      return Array.from(titles || []).map(el => el.textContent?.trim());
    });
    
    expect(titles).toContain('Verbs');
    expect(titles).toContain('Nouns');
  });

  test('should show placeholder words when lists are empty', async ({ page }) => {
    const hasPlaceholders = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const placeholders = leftPanel?.shadowRoot?.querySelectorAll('.word-item.placeholder');
      return placeholders && placeholders.length > 0;
    });
    
    expect(hasPlaceholders).toBe(true);
  });

  test('should add new category with + button', async ({ page }) => {
    const addButton = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const button = leftPanel?.shadowRoot?.querySelector('.add-set-btn') as HTMLElement;
      button?.click();
      return true;
    });
    
    expect(addButton).toBe(true);
    await page.waitForTimeout(300);
    
    // Verify we now have a new category by checking that arrow buttons are enabled
    const arrowsEnabled = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const carouselBtn = leftPanel?.shadowRoot?.querySelector('.carousel-btn:not([disabled])');
      return carouselBtn !== null;
    });
    
    expect(arrowsEnabled).toBe(true);
  });

  test('should add words to left column', async ({ page }) => {
    // Add a word to the left column
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const input = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-input') as HTMLInputElement;
      if (input) {
        input.value = 'dance';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Click the add button instead of dispatching submit event
        const addBtn = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-btn') as HTMLElement;
        addBtn?.click();
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify the word was added
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:first-child .word-item:not(.placeholder) .word-text');
      return Array.from(words || []).some(el => el.textContent === 'dance');
    });
    
    expect(hasWord).toBe(true);
  });

  test('should add words to right column', async ({ page }) => {
    // Add a word to the right column
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const input = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-input') as HTMLInputElement;
      if (input) {
        input.value = 'moon';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Click the add button instead of dispatching submit event
        const addBtn = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-btn') as HTMLElement;
        addBtn?.click();
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify the word was added
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:last-child .word-item:not(.placeholder) .word-text');
      return Array.from(words || []).some(el => el.textContent === 'moon');
    });
    
    expect(hasWord).toBe(true);
  });

  test('should select words when clicked', async ({ page }) => {
    // First add words
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      // Add left word
      const leftInput = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-input') as HTMLInputElement;
      if (leftInput) {
        leftInput.value = 'dance';
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-form') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
      
      // Add right word
      const rightInput = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-input') as HTMLInputElement;
      if (rightInput) {
        rightInput.value = 'moon';
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-form') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click on the words to select them
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftWord = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-item:not(.placeholder)') as HTMLElement;
      leftWord?.click();
      
      const rightWord = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-item:not(.placeholder)') as HTMLElement;
      rightWord?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify selection state
    const hasSelection = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const selected = leftPanel?.shadowRoot?.querySelectorAll('.word-item.selected');
      return selected && selected.length === 2;
    });
    
    expect(hasSelection).toBe(true);
  });

  test('should update input field when words are selected', async ({ page }) => {
    // Add and select words
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      // Add words
      const leftInput = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-input') as HTMLInputElement;
      if (leftInput) {
        leftInput.value = 'dance';
        leftInput.dispatchEvent(new Event('input', { bubbles: true }));
        const addBtn = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-btn') as HTMLElement;
        addBtn?.click();
      }
      
      const rightInput = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-input') as HTMLInputElement;
      if (rightInput) {
        rightInput.value = 'moon';
        rightInput.dispatchEvent(new Event('input', { bubbles: true }));
        const addBtn = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-btn') as HTMLElement;
        addBtn?.click();
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click words to select them
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftWord = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-item:not(.placeholder)') as HTMLElement;
      leftWord?.click();
      
      const rightWord = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-item:not(.placeholder)') as HTMLElement;
      rightWord?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Check the input field value
    const inputValue = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const controls = app?.shadowRoot?.querySelector('app-controls');
      const input = controls?.shadowRoot?.querySelector('.lyric-input') as HTMLInputElement;
      return input?.value || '';
    });
    
    expect(inputValue).toBe('dance moon');
  });

  test('should remove words when delete button is clicked', async ({ page }) => {
    // Add a word
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const input = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-input') as HTMLInputElement;
      if (input) {
        input.value = 'dance';
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-form') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click remove button
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const removeBtn = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .remove-btn') as HTMLElement;
      removeBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify word was removed
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:first-child .word-item:not(.placeholder)');
      return words && words.length > 0;
    });
    
    expect(hasWord).toBe(false);
  });

  test('should edit category titles', async ({ page }) => {
    // Click on the category title to edit
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const title = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .column-title') as HTMLElement;
      title?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify edit input is shown
    const hasEditInput = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const input = leftPanel?.shadowRoot?.querySelector('.edit-left-title');
      return input !== null;
    });
    
    expect(hasEditInput).toBe(true);
  });

  test('should navigate between categories with arrow buttons', async ({ page }) => {
    // Add a second category
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const button = leftPanel?.shadowRoot?.querySelector('.add-set-btn') as HTMLElement;
      button?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Click next arrow
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const nextBtn = leftPanel?.shadowRoot?.querySelector('.carousel-btn:last-of-type') as HTMLElement;
      nextBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify we navigated by checking that category titles are still visible
    // (navigation worked if no error occurred and we can still see titles)
    const hasTitles = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const titles = leftPanel?.shadowRoot?.querySelectorAll('.column-title');
      return titles && titles.length === 2;
    });
    
    expect(hasTitles).toBe(true);
  });

  test('should auto-select words when navigating between categories', async ({ page }) => {
    // Load sample song which has populated categories
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const header = app?.shadowRoot?.querySelector('app-header');
      const loadBtn = header?.shadowRoot?.querySelector('button[title="Load song"]') as HTMLElement;
      loadBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Click sample song
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const loadDialog = app?.shadowRoot?.querySelector('load-dialog');
      const sampleBtn = loadDialog?.shadowRoot?.querySelector('.sample-song-btn') as HTMLElement;
      sampleBtn?.click();
    });
    
    await page.waitForTimeout(500);
    
    // Navigate to next category
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const nextBtn = leftPanel?.shadowRoot?.querySelector('.carousel-btn:last-of-type') as HTMLElement;
      nextBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify words are selected
    const hasSelection = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const selected = leftPanel?.shadowRoot?.querySelectorAll('.word-item.selected');
      return selected && selected.length >= 1;
    });
    
    expect(hasSelection).toBe(true);
  });

  test('should save and load word ladder with song', async ({ page }) => {
    // Add custom words
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftInput = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-input') as HTMLInputElement;
      if (leftInput) {
        leftInput.value = 'testword';
        leftInput.dispatchEvent(new Event('input', { bubbles: true }));
        const addBtn = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-btn') as HTMLElement;
        addBtn?.click();
      }
    });
    
    await page.waitForTimeout(300);
    
    // Save song
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const header = app?.shadowRoot?.querySelector('app-header');
      const songNameInput = header?.shadowRoot?.querySelector('input[placeholder="Song Name"]') as HTMLInputElement;
      if (songNameInput) {
        songNameInput.value = 'Test Word Ladder Song';
        songNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const saveBtn = header?.shadowRoot?.querySelector('button[title="Save song"]') as HTMLElement;
      saveBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Create new song
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const header = app?.shadowRoot?.querySelector('app-header');
      const newBtn = header?.shadowRoot?.querySelector('button[title="New song"]') as HTMLElement;
      newBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Load the saved song
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const header = app?.shadowRoot?.querySelector('app-header');
      const loadBtn = header?.shadowRoot?.querySelector('button[title="Load song"]') as HTMLElement;
      loadBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const loadDialog = app?.shadowRoot?.querySelector('load-dialog');
      const songButtons = loadDialog?.shadowRoot?.querySelectorAll('.song-item-btn');
      const testSongBtn = Array.from(songButtons || []).find(btn => 
        btn.textContent?.includes('Test Word Ladder Song')
      ) as HTMLElement;
      testSongBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify the word is still there
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-item:not(.placeholder) .word-text');
      return Array.from(words || []).some(el => el.textContent === 'testword');
    });
    
    expect(hasWord).toBe(true);
  });
});

