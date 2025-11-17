# Integration Test Fixes for Word Ladder Feature

## Problem

After implementing the word ladder feature, the integration tests started failing with errors like:
```
Error: locator.fill: Test ended.
Call log:
  - waiting for locator('input[placeholder*="lyrics"]')
```

## Root Cause

The tests were using `input[placeholder*="lyrics"]` to locate the lyric input field. However, with the word ladder feature:

- The placeholder text is now **dynamically generated** from the selected word ladder words
- Examples: `"dance moon"`, `"verbs nouns"`, `"run table"`, etc.
- The placeholder no longer contains the word "lyrics"

## Solution

Updated all integration test files to use a **helper function** that accesses the input field via its stable CSS class instead of its dynamic placeholder:

```typescript
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
```

## Files Updated

1. **`tests/integration/line-manipulation.spec.ts`**
   - Added `fillLyricInput()` helper
   - Replaced `page.locator('input[placeholder*="lyrics"]')` with helper

2. **`tests/integration/chord-management.spec.ts`**
   - Added `fillLyricInput()` helper
   - Updated 3 test cases that add lyric lines

3. **`tests/integration/copy-lyrics.spec.ts`**
   - Added `fillLyricInput()` helper
   - Updated lyric input usage

4. **`tests/integration/song-workflow.spec.ts`**
   - Added `fillLyricInput()` helper
   - Updated 3 test cases across create/save/delete workflows

## Benefits

- ✅ **More Stable**: Uses CSS class selector instead of dynamic placeholder
- ✅ **Shadow DOM Aware**: Properly navigates through web component shadow roots
- ✅ **Reusable**: Helper function can be used across all tests
- ✅ **Maintainable**: Changes to placeholder logic won't break tests

## Testing

Run integration tests with:
```bash
npm run test:integration
```

All integration tests should now pass with the dynamic word ladder placeholders.

