# Spectrum Integration Tests

This folder contains integration tests specifically for verifying proper Spectrum Web Components integration and CSS token usage.

## Test Files

### `css-tokens.spec.ts`
Verifies that the application properly uses Spectrum CSS custom properties (design tokens) instead of hard-coded values.

**Tests:**
1. **Static Styles Analysis** - Scans component CSS files for hard-coded values
2. **Runtime Styles Verification** - Uses Playwright to inspect computed styles in Shadow DOM
3. **Token Availability** - Ensures Spectrum tokens are accessible throughout the component tree
4. **Theme Context** - Verifies proper `<sp-theme>` wrapper configuration

## Running the Tests

**First, start the dev server in a separate terminal:**
```bash
npm run dev
```

**Then run the tests:**
```bash
# Run all Spectrum tests
npm run test:spectrum

# Run in UI mode for debugging
npm run test:spectrum:ui

# Run with headed browser
npm run test:spectrum:headed
```

## What These Tests Check

### ✅ Hard-coded Values
- **Colors**: Hex codes (`#667eea`) and RGB values that should use `--spectrum-*-color-*` tokens
- **Sizes**: Pixel values for fonts, spacing, and components that should use `--spectrum-component-height-*` tokens
- **Border Radius**: Hard-coded radius values that should use `--spectrum-corner-radius-*`

### ✅ Spectrum Token Usage
- Verifies components use CSS custom properties
- Checks token availability in Shadow DOM
- Ensures proper theme inheritance

### ✅ Runtime Verification
- Uses `page.evaluate()` to access Shadow DOM
- Inspects computed styles on Spectrum components
- Validates theme context propagation

## Example Violations

**❌ Bad - Hard-coded color:**
```css
.button {
  background: #667eea;
  color: #ffffff;
}
```

**✅ Good - Using Spectrum tokens:**
```css
.button {
  background: var(--spectrum-accent-background-color-default);
  color: var(--spectrum-neutral-content-color-default);
}
```

**❌ Bad - Hard-coded sizing:**
```css
.text {
  font-size: 14px;
  padding: 12px;
}
```

**✅ Good - Using Spectrum tokens:**
```css
.text {
  font-size: var(--spectrum-font-size-100);
  padding: var(--spectrum-spacing-200);
}
```

## Allowed Exceptions

Some hard-coded values are allowed:
- **Layout values**: `0px`, `1px`, `2px`, `100%`, `auto`
- **Color keywords**: `transparent`, `inherit`, `currentColor`
- **Transform values**: `translate()`, `rotate()`, `scale()`

## Shadow DOM Testing

These tests use Playwright's ability to pierce Shadow DOM boundaries:

```typescript
// Access nested Shadow DOM
const tokenValue = await page.evaluate(() => {
  const app = document.querySelector('lyricist-app');
  const header = app?.shadowRoot?.querySelector('app-header');
  const button = header?.shadowRoot?.querySelector('sp-button');
  const styles = window.getComputedStyle(button);
  return styles.getPropertyValue('--spectrum-accent-background-color-default');
});
```

## Continuous Integration

These tests should be run as part of CI to catch:
- New hard-coded values being introduced
- Missing Spectrum token usage
- Theme configuration issues
- Shadow DOM style leakage

## Migration Strategy

When fixing hard-coded values:
1. Run tests to identify violations
2. Look up appropriate Spectrum token in [Spectrum Token Documentation](https://opensource.adobe.com/spectrum-css/)
3. Replace hard-coded value with CSS custom property
4. Re-run tests to verify fix
5. Check visual regression to ensure no breaking changes

## Resources

- [Spectrum CSS Tokens](https://opensource.adobe.com/spectrum-css/preview/tokens.html)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Our Setup Guide](../spectrum-web-components-setup.md)
- [Playwright Shadow DOM Solution](../../cursor/PLAYWRIGHT_SHADOW_DOM_SOLUTION.md)

