# Playwright Shadow DOM Solution ✅

## The Problem

LitElement web components use Shadow DOM, which encapsulates their internal structure. Playwright's semantic locators (`getByLabel`, `getByPlaceholder`, `getByText`) **do not reliably pierce shadow DOM** in all cases, especially with nested components.

## The Solution

Use a **hybrid approach**:

### 1. CSS Selectors for Form Inputs
```typescript
// ✅ Works - CSS selectors CAN pierce shadow DOM
const lyricInput = page.locator('input[placeholder*="lyrics"]');
const songNameInput = page.locator('input[placeholder="Song Name"]');

await lyricInput.fill('My lyrics');
await songNameInput.fill('My Song');
```

### 2. getByRole for Buttons
```typescript
// ✅ Works - Buttons are accessible at the top level
await page.getByRole('button', { name: 'Add Line' }).click();
await page.getByRole('button', { name: 'Save' }).click();
```

### 3. page.evaluate() for Verification
```typescript
// ✅ Works - Direct DOM access in browser context
const lyrics = await page.evaluate(() => {
  const app = document.querySelector('lyricist-app');
  const panel = app?.shadowRoot?.querySelector('lyrics-panel');
  return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
});

expect(lyrics).toContain('My lyrics');
```

## What Doesn't Work

❌ **These DON'T pierce shadow DOM reliably:**
- `page.getByLabel('...')`  
- `page.getByPlaceholder('...')`
- `page.getByText('...')` (for assertions)
- `page.locator('#id')` (ID selectors)

## Example Test

```typescript
test('should add lyrics', async ({ page }) => {
  await page.goto('/');
  
  // Fill input using CSS selector
  const lyricInput = page.locator('input[placeholder*="lyrics"]');
  await lyricInput.fill('Test line');
  
  // Click button using getByRole
  await page.getByRole('button', { name: 'Add Line' }).click();
  await page.waitForTimeout(300);
  
  // Verify using evaluate
  const hasLine = await page.evaluate(() => {
    const app = document.querySelector('lyricist-app');
    const panel = app?.shadowRoot?.querySelector('lyrics-panel');
    const lyrics = panel?.shadowRoot?.querySelector('.lyrics-text');
    return (lyrics?.textContent || '').includes('Test line');
  });
  
  expect(hasLine).toBe(true);
});
```

## Why This Works

1. **CSS Selectors**: Playwright's `locator()` with CSS selectors can traverse shadow boundaries
2. **getByRole**: ARIA roles are exposed at the document level, so Playwright can find them
3. **evaluate()**: Runs JavaScript in the browser context where you have full DOM access, including shadowRoot

## Benefits

- ✅ No need for `data-testid` attributes
- ✅ Tests real user interactions
- ✅ Works with any shadow DOM depth
- ✅ Reliable and fast

## Accessibility Note

We still added proper `<label>` elements with `for` attributes for screen reader accessibility, even though Playwright doesn't use them. This is the right thing to do for real users!

