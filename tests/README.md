# Test Suite Documentation

## Overview

This project has two types of tests:
- **Unit Tests** (Vitest): Test components and business logic in isolation
- **Integration Tests** (Playwright): Test user workflows in a real browser

## Running Tests

```bash
# Unit tests
npm test                    # Run once
npm test -- --watch         # Watch mode
npm run test:ui             # Visual UI
npm run test:coverage       # With coverage report

# Integration tests (Playwright)
npm run test:integration            # Headless (default)
npm run test:integration:headed     # See the browser
npm run test:integration:ui         # Interactive UI mode
npm run test:integration:debug      # Debug mode with dev tools
```

## Test Coverage

### Unit Tests (83 tests)
- ✅ Storage service (10 tests)
- ✅ Song store state management (29 tests)
- ✅ Lyrics panel component (8 tests)
- ✅ App header component (12 tests)
- ✅ Load dialog component (14 tests)
- ✅ Integration workflows (10 tests)

### Playwright Integration Tests (10 tests)
- ✅ Song workflow: create, save, load, delete (3 tests)
- ✅ Chord management: add lyrics, multi-line songs (2 tests)
- ✅ Copy lyrics: clipboard functionality (2 tests)
- ✅ Line manipulation: add lines, sample song (3 tests)

## Shadow DOM in Playwright

Our LitElement web components use Shadow DOM. Playwright's semantic locators don't reliably pierce shadow DOM, so we use a hybrid approach:

### ✅ What Works

1. **CSS selectors for inputs**:
```typescript
const lyricInput = page.locator('input[placeholder*="lyrics"]');
await lyricInput.fill('My lyrics');
```

2. **getByRole for buttons**:
```typescript
await page.getByRole('button', { name: 'Save', exact: true }).click();
```

3. **page.evaluate() for verification**:
```typescript
const lyrics = await page.evaluate(() => {
  const app = document.querySelector('lyricist-app');
  const panel = app?.shadowRoot?.querySelector('lyrics-panel');
  return panel?.shadowRoot?.querySelector('.lyrics-text')?.textContent || '';
});
expect(lyrics).toContain('My lyrics');
```

### ❌ What Doesn't Work

- `getByLabel()` - Can't pierce shadow DOM reliably
- `getByPlaceholder()` - Can't pierce shadow DOM reliably
- `getByText()` - Can't pierce shadow DOM for assertions

See `PLAYWRIGHT_SHADOW_DOM_SOLUTION.md` for detailed explanation.

## Accessibility

Despite Playwright limitations, we've added proper accessibility features:
- `<label>` elements with `for` attributes for all inputs
- Labels are visually hidden but available to screen readers
- Proper semantic HTML throughout

## Test Philosophy

**Unit tests** verify that individual pieces work correctly in isolation.

**Playwright tests** verify that real user workflows work end-to-end in an actual browser.

Together, they provide comprehensive coverage of functionality and user experience.
