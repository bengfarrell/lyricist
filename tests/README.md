# Test Suite Documentation

## Overview

This project has two types of tests:
- **Unit Tests** (Vitest): Located in `tests/unit/` - Test components and business logic in isolation
- **Integration Tests** (Playwright): Located in `tests/integration/` - Test user workflows in a real browser

## Running Tests

```bash
# Unit tests (Vitest)
npm run test:ci             # Run once (CI mode)
npm test                    # Run once (interactive)
npm test -- --watch         # Watch mode
npm run test:ui             # Visual UI
npm run test:coverage       # With coverage report

# Integration tests (Playwright)
npm run test:integration:ci         # CI mode with line reporter
npm run test:integration            # Headless (default)
npm run test:integration:headed     # See the browser
npm run test:integration:ui         # Interactive UI mode
npm run test:integration:debug      # Debug mode with dev tools
```

## Important: Integration Test Behavior

**Playwright integration tests take 10-30 seconds to start** because they:

1. **Start the Vite dev server** (`npm run dev`) in the background
2. **Wait for the server** to be available at `http://localhost:5173` (up to 120s timeout)
3. **Launch a browser** (Chromium by default)
4. **Then run the tests**

### When Running from Command Line

⚠️ **Do NOT use `tail` or `head` on Playwright commands** - they will appear to hang because:
- The initial startup is quiet (minimal output)
- `tail` waits for the command to complete before showing output
- The tests are actually working, just not producing visible output yet

✅ **Instead, use:**
```bash
# Let output stream naturally
npm run test:integration:ci

# Or set a reasonable timeout if needed
timeout 60s npm run test:integration:ci

# Or check if server starts properly first
npm run dev  # In one terminal
npm run test:integration  # In another terminal
```

### Before Running Tests

If you recently modified TypeScript files, **rebuild first**:
```bash
# The source files are TypeScript, but tests import .js files
npx tsc  # Compile TypeScript to JavaScript
npm run test:ci  # Then run tests
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
