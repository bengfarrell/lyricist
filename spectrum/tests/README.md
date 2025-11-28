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

### `iconography.spec.ts`
Ensures all icons use Spectrum Web Components icons instead of emoji or text symbols.

**Tests:**
1. **Icon Violations** - Scans components for emoji/symbols that should be Spectrum icons
2. **Import Verification** - Checks that used icons have proper imports
3. **Slot Usage** - Verifies icons use `slot="icon"` in buttons
4. **Accessibility** - Checks for aria-label/title on icon-only buttons

**Why this matters:**
- Consistent cross-platform rendering (no emoji inconsistencies)
- Scalable vector graphics (crisp at any size)
- Better accessibility with proper ARIA labels
- Theme-aware (adapts to light/dark mode)

See **[SPECTRUM_ICONS_GUIDE.md](../SPECTRUM_ICONS_GUIDE.md)** for complete migration guide.

### `spectrum-patterns.spec.ts` 🆕
**Comprehensive pattern compliance testing framework** - validates that elements marked with `data-spectrum-pattern` attributes follow Spectrum Design System guidelines.

**Framework Components:**
- **pattern-specs.ts** - 50+ pattern specifications (structure, styles, ARIA)
- **pattern-helpers.ts** - Generic validation utilities (works with any Lit app)
- **spectrum-patterns.spec.ts** - Main test suite with detailed reporting

**What It Validates:**
1. **Structure** - Proper HTML element types and hierarchy
2. **Styles** - CSS properties (cursor, colors, spacing, tokens)
3. **Accessibility** - ARIA roles, labels, states
4. **Attributes** - Required attributes for each pattern
5. **Behavior** - Interactive states (disabled, selected, focus)

**Pattern Categories Covered:**
- Buttons (standard, primary, accent, negative, disabled, pending)
- Action Buttons (standard, quiet, selected)
- Action Groups (horizontal, vertical)
- Forms (containers, labels, textfields, help text, validation)
- Dialogs (modals, overlays, headings, content, footer)
- Menus (containers, items, sections)
- Lists (containers, items, selectable)
- Tabs (containers, items, selected states)
- States (hover, focus, active, disabled, selected)
- Popovers (standard, open states)

**Key Features:**
- 🎯 **Generic & Reusable** - Works with any Lit + Spectrum Web Components app
- 🔍 **Shadow DOM Support** - Automatically queries Light and Shadow DOM
- 📊 **Detailed Reporting** - Shows violations with context and suggestions
- 📈 **Usage Statistics** - Reports pattern usage and coverage
- ⚙️ **Extensible** - Easy to add custom patterns and validation rules

See **[PATTERN_TESTING_GUIDE.md](./PATTERN_TESTING_GUIDE.md)** for complete documentation.

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

### Spectrum Design System
- [Spectrum CSS Tokens](https://opensource.adobe.com/spectrum-css/preview/tokens.html)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Spectrum Icons Workflow](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/)

### Project Documentation
- [Spectrum Setup Guide](../spectrum-web-components-setup.md)
- [Spectrum Icons Guide](../SPECTRUM_ICONS_GUIDE.md)
- [Step 2: SWC Replacement Plan](../STEP_2_SWC_REPLACEMENT_PLAN.md)
- [Agentic Spectrum Design Guide](../AGENTIC_SPECTRUM_DESIGN_GUIDE.md)

### Technical References
- [Playwright Shadow DOM Solution](../../cursor/PLAYWRIGHT_SHADOW_DOM_SOLUTION.md)

