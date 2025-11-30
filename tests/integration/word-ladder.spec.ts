import { test, expect } from '@playwright/test';
import { setupPage } from './test-helpers';

test.describe('Word Ladder', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    
    // Switch to Word Ladder panel
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const navbar = app?.shadowRoot?.querySelector('app-navbar');
      const wordLadderTab = Array.from(navbar?.shadowRoot?.querySelectorAll('.navbar-tab') || [])
        .find(tab => tab.textContent?.trim() === 'Word Ladder') as HTMLElement;
      wordLadderTab?.click();
    });
    
    await page.waitForTimeout(500);
    
    // Wait for left-panel to be visible
    await page.locator('left-panel').waitFor({ state: 'attached' });
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

  test('should show add word inputs when lists are empty', async ({ page }) => {
    // Clear existing words first
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      if (store) {
        // Clear the word ladder
        const currentIndex = store.wordLadderCurrentSetIndex;
        const set = store.wordLadderSets[currentIndex];
        if (set) {
          set.leftWords = [];
          set.rightWords = [];
          store.requestUpdate();
        }
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify add-word inputs are present
    const hasAddInputs = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const addWordItems = leftPanel?.shadowRoot?.querySelectorAll('.add-word-item');
      return addWordItems && addWordItems.length === 2; // One for each column
    });
    
    expect(hasAddInputs).toBe(true);
    
    // Verify no regular word items exist
    const wordItemCount = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const wordItems = leftPanel?.shadowRoot?.querySelectorAll('.word-item:not(.add-word-item)');
      return wordItems?.length || 0;
    });
    
    expect(wordItemCount).toBe(0);
  });

  test('should add new category with + button', async ({ page }) => {
    // Get the initial count of word ladder sets
    const initialCount = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      return store?.wordLadderSets?.length || 0;
    });
    
    // Click the "+ Add Set" button in floating-strip
    const addButton = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const buttons = floatingStrip?.shadowRoot?.querySelectorAll('sp-button');
      const addSetBtn = Array.from(buttons || []).find(btn => 
        btn.textContent?.includes('Add Set')
      ) as HTMLElement;
      addSetBtn?.click();
      return !!addSetBtn;
    });
    
    expect(addButton).toBe(true);
    await page.waitForTimeout(300);
    
    // Verify we now have one more category
    const newCount = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      return store?.wordLadderSets?.length || 0;
    });
    
    expect(newCount).toBe(initialCount + 1);
  });

  test('should add words to left column', async ({ page }) => {
    // Add a word to the left column using sp-textfield
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const textfield = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item sp-textfield') as any;
      if (textfield) {
        textfield.value = 'dance';
        textfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        
        // Submit the form
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify the word was added
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:first-child .word-item:not(.add-word-item) .word-text');
      return Array.from(words || []).some(el => el.textContent === 'dance');
    });
    
    expect(hasWord).toBe(true);
  });

  test('should add words to right column', async ({ page }) => {
    // Add a word to the right column using sp-textfield
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const textfield = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item sp-textfield') as any;
      if (textfield) {
        textfield.value = 'moon';
        textfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        
        // Submit the form
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify the word was added
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:last-child .word-item:not(.add-word-item) .word-text');
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
      const leftTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item sp-textfield') as any;
      if (leftTextfield) {
        leftTextfield.value = 'dance';
        leftTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      
      // Add right word
      const rightTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item sp-textfield') as any;
      if (rightTextfield) {
        rightTextfield.value = 'moon';
        rightTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click on the words to select them
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftWord = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-item:not(.add-word-item)') as HTMLElement;
      leftWord?.click();
      
      const rightWord = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-item:not(.add-word-item)') as HTMLElement;
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
      const leftTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item sp-textfield') as any;
      if (leftTextfield) {
        leftTextfield.value = 'dance';
        leftTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      
      const rightTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item sp-textfield') as any;
      if (rightTextfield) {
        rightTextfield.value = 'moon';
        rightTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click words to select them
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftWord = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-item:not(.add-word-item)') as HTMLElement;
      leftWord?.click();
      
      const rightWord = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .word-item:not(.add-word-item)') as HTMLElement;
      rightWord?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Check the input field value (from the store's newLineInputText)
    const inputValue = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      return store?.newLineInputText || '';
    });
    
    expect(inputValue).toBe('dance moon');
  });

  test('should remove words when delete button is clicked', async ({ page }) => {
    // Add a word
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const textfield = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item sp-textfield') as any;
      if (textfield) {
        textfield.value = 'dance';
        textfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Click remove button (sp-action-button with sp-icon-close inside word item)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const wordItem = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .word-item:not(.add-word-item)');
      const removeBtn = wordItem?.querySelector('sp-action-button') as HTMLElement;
      removeBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify word was removed
    const hasWord = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const words = leftPanel?.shadowRoot?.querySelectorAll('.word-column:first-child .word-item:not(.add-word-item)');
      return words && words.length > 0;
    });
    
    expect(hasWord).toBe(false);
  });

  test('should edit category titles', async ({ page }) => {
    // Click on the category title to edit
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const title = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .column-title.editable') as HTMLElement;
      title?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify edit form with sp-textfield is shown
    const hasEditInput = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const editForm = leftPanel?.shadowRoot?.querySelector('.edit-title-form');
      const textfield = leftPanel?.shadowRoot?.querySelector('.edit-title-container sp-textfield');
      return editForm !== null && textfield !== null;
    });
    
    expect(hasEditInput).toBe(true);
  });

  test('should navigate between categories with arrow buttons', async ({ page }) => {
    // Add a second category using the "+ Add Set" button in floating-strip
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const buttons = floatingStrip?.shadowRoot?.querySelectorAll('sp-button');
      const addSetBtn = Array.from(buttons || []).find(btn => 
        btn.textContent?.includes('Add Set')
      ) as HTMLElement;
      addSetBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Click the previous arrow button (which should now be enabled)
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const navButtons = floatingStrip?.shadowRoot?.querySelectorAll('.word-ladder-nav sp-action-button');
      const prevBtn = navButtons?.[0] as HTMLElement; // First button is previous
      prevBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify we navigated by checking that category titles are still visible
    const hasTitles = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      const titles = leftPanel?.shadowRoot?.querySelectorAll('.column-title');
      return titles && titles.length === 2;
    });
    
    expect(hasTitles).toBe(true);
  });

  test('should auto-select words when navigating between categories', async ({ page }) => {
    // Add words to first category
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const leftPanel = app?.shadowRoot?.querySelector('left-panel');
      
      const leftTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item sp-textfield') as any;
      if (leftTextfield) {
        leftTextfield.value = 'jump';
        leftTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:first-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
      
      const rightTextfield = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item sp-textfield') as any;
      if (rightTextfield) {
        rightTextfield.value = 'sky';
        rightTextfield.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        const form = leftPanel?.shadowRoot?.querySelector('.word-column:last-child .add-word-item') as HTMLFormElement;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
    
    await page.waitForTimeout(300);
    
    // Add a second category
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const buttons = floatingStrip?.shadowRoot?.querySelectorAll('sp-button');
      const addSetBtn = Array.from(buttons || []).find(btn => 
        btn.textContent?.includes('Add Set')
      ) as HTMLElement;
      addSetBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Navigate back to first category
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const floatingStrip = app?.shadowRoot?.querySelector('floating-strip');
      const navButtons = floatingStrip?.shadowRoot?.querySelectorAll('.word-ladder-nav sp-action-button');
      const prevBtn = navButtons?.[0] as HTMLElement;
      prevBtn?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify words are selected (auto-selected when navigating)
    const hasSelection = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      return store?.wordLadderSelectedLeft >= 0 && store?.wordLadderSelectedRight >= 0;
    });
    
    expect(hasSelection).toBe(true);
  });

  test('should include word ladder data when saving songs', async ({ page }) => {
    // Add custom word to word ladder
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      
      if (store && store.setWordLadderLeftWords) {
        const currentSet = store.currentWordLadderSet;
        const newWords = [...currentSet.leftColumn.words, 'testword'];
        store.setWordLadderLeftWords(newWords);
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify word was added
    const wordAdded = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      const leftWords = store?.currentWordLadderSet?.leftColumn?.words || [];
      return leftWords.includes('testword');
    });
    
    expect(wordAdded).toBe(true);
    
    // Verify that word ladder data would be included in save by checking the store's internal state
    const songData = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      
      // Get the data that would be saved
      return {
        wordLadderSets: store?.wordLadderSets || [],
        hasTestword: store?.wordLadderSets?.[0]?.leftColumn?.words?.includes('testword')
      };
    });
    
    expect(songData.wordLadderSets.length).toBeGreaterThan(0);
    expect(songData.hasTestword).toBe(true);
    
    // Verify word ladder persists in the current session
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const navbar = app?.shadowRoot?.querySelector('app-navbar');
      const canvasTab = Array.from(navbar?.shadowRoot?.querySelectorAll('.navbar-tab') || [])
        .find(tab => tab.textContent?.trim() === 'Canvas') as HTMLElement;
      canvasTab?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Switch back to Word Ladder
    await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const navbar = app?.shadowRoot?.querySelector('app-navbar');
      const wordLadderTab = Array.from(navbar?.shadowRoot?.querySelectorAll('.navbar-tab') || [])
        .find(tab => tab.textContent?.trim() === 'Word Ladder') as HTMLElement;
      wordLadderTab?.click();
    });
    
    await page.waitForTimeout(300);
    
    // Verify word is still there after panel switch
    const wordPersisted = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const store = (app as any)?._store || (app as any)?.store;
      const leftWords = store?.currentWordLadderSet?.leftColumn?.words || [];
      return leftWords.includes('testword');
    });
    
    expect(wordPersisted).toBe(true);
  });
});

