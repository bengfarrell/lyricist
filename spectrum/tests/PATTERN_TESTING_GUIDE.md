# Spectrum Pattern Testing Framework

Comprehensive, reusable testing framework for validating Adobe Spectrum Design System compliance in Lit + Spectrum Web Components applications.

---

## Overview

This testing framework validates that elements marked with `data-spectrum-pattern` attributes follow Spectrum Design System guidelines for:

- ✅ **Structure** - Proper HTML element types and hierarchy
- ✅ **Styles** - Correct CSS properties (colors, spacing, sizing)
- ✅ **Accessibility** - ARIA roles, labels, and states
- ✅ **Attributes** - Required attributes for each pattern
- ✅ **Behavior** - Interactive states (hover, focus, disabled, selected)

**Key Feature:** These tests are **generic** and work with any Lit + Spectrum Web Components application, not just this specific app.

---

## Architecture

### Core Files

```
spectrum/tests/
├── pattern-specs.ts              # Pattern specifications
├── pattern-helpers.ts            # Validation utilities
├── spectrum-patterns.spec.ts     # Main test suite
└── PATTERN_TESTING_GUIDE.md      # This file
```

### How It Works

1. **Pattern Specs** (`pattern-specs.ts`)
   - Defines expected structure for each Spectrum pattern
   - Specifies required CSS properties, ARIA attributes, element types
   - Based on Adobe Spectrum Design System guidelines

2. **Pattern Helpers** (`pattern-helpers.ts`)
   - Queries elements by `data-spectrum-pattern` attribute
   - Validates elements against specs
   - Generates violation reports
   - Works with both Light DOM and Shadow DOM

3. **Test Suite** (`spectrum-patterns.spec.ts`)
   - Playwright tests that validate all patterns
   - Grouped by pattern category (buttons, forms, dialogs, etc.)
   - Provides detailed error messages and statistics

---

## Running the Tests

### Prerequisites

1. Dev server must be running:
   ```bash
   npm run dev
   ```

2. App must be accessible (default: `http://localhost:5173`)

### Run All Pattern Tests

```bash
npm run test:spectrum
```

### Run Specific Test Group

```bash
# Button patterns only
npm run test:spectrum -- --grep "Button Patterns"

# Form patterns only
npm run test:spectrum -- --grep "Form Patterns"

# Dialog patterns only
npm run test:spectrum -- --grep "Dialog Patterns"
```

### Debug Mode

```bash
# Run with UI for debugging
npm run test:spectrum:ui

# Run with headed browser
npm run test:spectrum:headed

# Debug specific test
npm run test:spectrum:debug
```

---

## Pattern Specifications

### Anatomy of a Pattern Spec

```typescript
export const BUTTON_PATTERNS: Record<string, PatternSpec> = {
  'button-accent': {
    // Human-readable name
    name: 'Button (Accent)',
    
    // Description
    description: 'Accent button - call-to-action emphasis',
    
    // Allowed HTML elements
    allowedElements: ['button', 'sp-button'],
    
    // Required attributes
    requiredAttributes: ['variant="accent"'],
    
    // CSS properties to validate
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ],
    
    // ARIA requirements
    ariaRequirements: {
      requiredLabels: ['aria-label', 'textContent', 'title']
    },
    
    // Custom validation function (optional)
    structureValidation: (element) => {
      // Custom validation logic
      return { valid: true, errors: [], warnings: [] };
    }
  }
};
```

### Supported Pattern Categories

- **Buttons** - Standard, primary, accent, secondary, negative, disabled, pending
- **Action Buttons** - Standard, quiet, selected
- **Action Groups** - Horizontal, vertical
- **Forms** - Form container, form item, field label, textfield, help text
- **Dialogs** - Dialog, modal, overlay, heading, content, footer
- **Menus** - Menu container, menu item, section heading
- **Lists** - List, list item, selectable item
- **Tabs** - Tab container, tab item, selected tab
- **States** - Hover, focus, active, disabled, selected
- **Popovers** - Popover, open state

**Total: 50+ pattern specifications**

---

## Example Test Output

### Successful Validation

```
✅ All patterns validated successfully!

📊 Found 127 elements with data-spectrum-pattern

📈 Pattern usage statistics:
   button-accent: 15
   action-button-quiet: 23
   textfield: 12
   dialog: 3
   menu-item: 18
   ...
```

### With Violations

```
❌ Found Spectrum pattern violations:

📦 Pattern: button-accent
   Found 2 element(s) with issues

   🔍 Element: sp-button.save-btn
      Tag: <sp-button>
      ❌ Errors:
         - [attribute] Missing required attribute: variant
         - [aria] Missing accessibility label. Should have one of: aria-label, textContent, title
      
   🔍 Element: button#submit
      Tag: <button>
      ⚠️  Warnings:
         - [style] Property 'cursor' might use hard-coded value '14px' instead of token 'spectrum-font-size-100'

📦 Pattern: action-button-quiet
   Found 1 element(s) with issues

   🔍 Element: shadowRoot → sp-action-button.close
      Tag: <sp-action-button>
      ❌ Errors:
         - [aria] Missing accessibility label. Should have one of: aria-label, title

📊 Summary:
   Total violations: 3 elements
   Errors: 3
   Warnings: 1
   Patterns affected: 2
```

---

## Adding New Pattern Specs

### Step 1: Define the Pattern

Add to appropriate category in `pattern-specs.ts`:

```typescript
export const MY_PATTERNS: Record<string, PatternSpec> = {
  'my-custom-pattern': {
    name: 'My Custom Pattern',
    description: 'Description of what this pattern represents',
    allowedElements: ['div', 'section'],
    requiredAttributes: ['role="region"'],
    cssProperties: [
      { 
        property: 'display', 
        expectedValue: 'flex' 
      },
      { 
        property: 'gap', 
        tokenSource: 'spectrum-spacing-100' 
      }
    ],
    ariaRequirements: {
      requiredLabels: ['aria-label']
    }
  }
};

// Add to ALL_PATTERN_SPECS
export const ALL_PATTERN_SPECS: Record<string, PatternSpec> = {
  ...BUTTON_PATTERNS,
  ...MY_PATTERNS,  // ← Add your patterns
  // ... other patterns
};
```

### Step 2: Create Test Group (Optional)

Add to `spectrum-patterns.spec.ts`:

```typescript
test.describe('My Custom Patterns', () => {
  test('should validate my custom pattern', async ({ page }) => {
    const violations: PatternViolation[] = [];
    
    for (const [shortcode, spec] of Object.entries(MY_PATTERNS)) {
      const elements = await findElementsByPattern(page, shortcode);
      
      for (const element of elements) {
        const violation = await validatePattern(page, element, spec);
        if (violation) {
          violations.push(violation);
        }
      }
    }
    
    if (violations.length > 0) {
      const report = formatViolationReport(violations);
      expect(violations, report).toHaveLength(0);
    }
  });
});
```

### Step 3: Use in Your App

```html
<div 
  class="my-component"
  data-spectrum-pattern="my-custom-pattern"
  role="region"
  aria-label="My Component"
>
  <!-- content -->
</div>
```

---

## Advanced Validation

### Custom Structure Validation

For complex validation logic:

```typescript
{
  'action-group-horizontal': {
    name: 'Action Group (Horizontal)',
    structureValidation: (element) => {
      const children = Array.from(element.children);
      
      // Check that children are action buttons
      const hasActionButtons = children.some(child => 
        child.tagName.toLowerCase() === 'sp-action-button' || 
        child.hasAttribute('data-spectrum-pattern') && 
        child.getAttribute('data-spectrum-pattern')?.includes('action-button')
      );
      
      return {
        valid: hasActionButtons,
        errors: hasActionButtons ? [] : ['Action group must contain action buttons'],
        warnings: []
      };
    }
  }
}
```

### CSS Token Validation

Check if CSS uses design tokens:

```typescript
cssProperties: [
  {
    property: 'font-size',
    tokenSource: 'spectrum-font-size-100'
  }
]
```

If the value is hard-coded (e.g., `14px`), a warning is generated suggesting to use the token.

### Context-Specific Validation

Validate properties in specific contexts:

```typescript
cssProperties: [
  {
    property: 'background-color',
    expectedValue: 'rgb(0, 0, 0)',
    context: 'hover'  // Only check on hover
  }
]
```

---

## Querying Patterns

### Find All Pattern Elements

```typescript
import { findAllPatternElements } from './pattern-helpers';

const elements = await findAllPatternElements(page);
// Returns: PatternElement[]
```

### Find Elements by Pattern

```typescript
import { findElementsByPattern } from './pattern-helpers';

const buttons = await findElementsByPattern(page, 'button-accent');
// Returns: PatternElement[]
```

### Get Pattern Statistics

```typescript
import { getPatternStatistics } from './pattern-helpers';

const stats = await getPatternStatistics(page);
// Returns: { 'button-accent': 5, 'textfield': 3, ... }
```

---

## Shadow DOM Support

The framework automatically handles Shadow DOM:

```typescript
// Queries both Light DOM and Shadow DOM
<my-component>
  #shadow-root
    <sp-button data-spectrum-pattern="button-accent">
      Click Me
    </sp-button>
</my-component>
```

Elements in Shadow DOM are prefixed with `shadowRoot →` in reports.

---

## Validation Types

### 1. Structure Validation

**Checks:**
- Correct HTML element type
- Proper element hierarchy
- Required child elements
- Parent-child relationships

**Example:**
```typescript
// Dialog must contain heading and content
structureValidation: (element) => {
  const hasHeading = element.querySelector('[data-spectrum-pattern*="dialog-heading"]');
  const hasContent = element.querySelector('[data-spectrum-pattern*="dialog-content"]');
  
  return {
    valid: true,
    errors: [],
    warnings: [
      !hasHeading ? 'Dialog should have a heading' : null,
      !hasContent ? 'Dialog should have content' : null
    ].filter(Boolean)
  };
}
```

### 2. Style Validation

**Checks:**
- CSS property values
- Design token usage
- Hard-coded values vs. tokens

**Example:**
```typescript
cssProperties: [
  { property: 'cursor', expectedValue: 'pointer' },
  { property: 'font-size', tokenSource: 'spectrum-font-size-100' }
]
```

### 3. ARIA Validation

**Checks:**
- ARIA roles
- ARIA labels (aria-label, aria-labelledby)
- ARIA states (aria-selected, aria-pressed, aria-disabled)

**Example:**
```typescript
ariaRequirements: {
  requiredRoles: ['dialog'],
  requiredLabels: ['aria-label', 'aria-labelledby'],
  requiredStates: ['aria-modal="true"']
}
```

### 4. Attribute Validation

**Checks:**
- Required attributes exist
- Attribute values match expected
- Spectrum Web Component properties

**Example:**
```typescript
requiredAttributes: [
  'variant="accent"',  // Must have variant="accent"
  'disabled'            // Must have disabled attribute
]
```

---

## Testing Strategy

### 1. Pattern Discovery

First, understand what patterns are in your app:

```bash
npm run test:spectrum -- --grep "should find all pattern elements"
```

This shows:
- Total pattern elements
- Usage statistics
- Most common patterns

### 2. Comprehensive Validation

Run full validation:

```bash
npm run test:spectrum -- --grep "should validate all patterns comprehensively"
```

This validates every pattern element against its spec.

### 3. Category-Specific Testing

Focus on specific pattern categories:

```bash
# Buttons only
npm run test:spectrum -- --grep "Button Patterns"

# Forms only
npm run test:spectrum -- --grep "Form Patterns"
```

### 4. Accessibility Focus

Test just accessibility:

```bash
npm run test:spectrum -- --grep "accessibility labels"
```

---

## Best Practices

### 1. Mark Patterns Consistently

```html
<!-- ✅ Good: Use shortcodes from dictionary -->
<sp-button 
  variant="accent"
  data-spectrum-pattern="button-accent"
>
  Save
</sp-button>

<!-- ❌ Bad: Custom/unknown shortcode -->
<sp-button data-spectrum-pattern="my-custom-save-button">
```

### 2. Multiple Patterns on One Element

```html
<!-- Element can have multiple patterns -->
<sp-button 
  variant="accent"
  disabled
  data-spectrum-pattern="button-accent button-disabled"
>
  Save
</sp-button>
```

### 3. Hierarchical Patterns

```html
<!-- Parent and children can have different patterns -->
<div data-spectrum-pattern="form">
  <div data-spectrum-pattern="form-item">
    <label data-spectrum-pattern="field-label">Name</label>
    <sp-textfield data-spectrum-pattern="textfield"></sp-textfield>
  </div>
</div>
```

### 4. State Patterns

```html
<!-- Add state patterns when state changes -->
<sp-action-button
  ?selected=${this.isActive}
  data-spectrum-pattern="action-button ${this.isActive ? 'action-button-selected' : ''}"
>
```

---

## Extending for Your App

While these tests are generic, you can extend them:

### 1. Add App-Specific Patterns

```typescript
// my-app-patterns.ts
export const MY_APP_PATTERNS: Record<string, PatternSpec> = {
  'lyric-line': {
    name: 'Lyric Line',
    description: 'Draggable lyric line component',
    allowedElements: ['lyric-line'],
    structureValidation: (element) => {
      // Your custom validation
    }
  }
};
```

### 2. Custom Test Configuration

```typescript
// my-app.spec.ts
import { MY_APP_PATTERNS } from './my-app-patterns';

test('should validate app-specific patterns', async ({ page }) => {
  // Use same validation helpers with your patterns
});
```

### 3. Environment-Specific URLs

```typescript
test.beforeEach(async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:5173';
  await page.goto(baseURL);
});
```

---

## Troubleshooting

### Test Can't Find Pattern Elements

**Problem:** `findAllPatternElements` returns empty array

**Solutions:**
1. Ensure dev server is running
2. Check that URL is correct
3. Verify elements have `data-spectrum-pattern` attribute
4. Increase timeout: `await page.waitForSelector('[data-spectrum-pattern]', { timeout: 30000 })`

### False Positives

**Problem:** Test reports violations for valid patterns

**Solutions:**
1. Check if pattern spec is too strict
2. Verify element actually follows Spectrum guidelines
3. Add conditional validation if needed
4. Use warnings instead of errors for soft requirements

### Shadow DOM Issues

**Problem:** Can't find elements in Shadow DOM

**Solution:** The framework automatically handles Shadow DOM, but ensure your custom components expose the elements properly.

### Performance Issues

**Problem:** Tests are slow

**Solutions:**
1. Run specific test groups instead of all tests
2. Reduce number of elements being tested
3. Use `--workers=1` for debugging (parallel execution can be confusing)

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Spectrum Pattern Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      # Start dev server in background
      - run: npm run dev &
      - run: npx wait-on http://localhost:5173
      
      # Run pattern tests
      - run: npm run test:spectrum:ci
```

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:spectrum -- --grep 'should have valid pattern shortcodes'"
    }
  }
}
```

---

## Future Enhancements

Potential additions to this framework:

1. **Visual Regression Testing** - Screenshot comparison
2. **Performance Metrics** - Measure render times
3. **Interaction Testing** - Validate hover/focus/click behaviors
4. **Theme Testing** - Validate light/dark mode
5. **Responsive Testing** - Check patterns at different viewport sizes
6. **Report Generation** - HTML/JSON reports
7. **Pattern Linting** - VS Code extension for real-time validation

---

## Resources

### Adobe Spectrum

- [Spectrum Design System](https://spectrum.adobe.com/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Spectrum CSS](https://opensource.adobe.com/spectrum-css/)

### Project Documentation

- [Pattern Specs](./pattern-specs.ts) - All pattern specifications
- [Pattern Helpers](./pattern-helpers.ts) - Validation utilities
- [Test Suite](./spectrum-patterns.spec.ts) - Main tests
- [Dictionary](../dictionary.md) - Pattern shortcodes reference

---

## Contributing

To add patterns or improve validation:

1. Add pattern spec to `pattern-specs.ts`
2. Update `ALL_PATTERN_SPECS` to include new patterns
3. Add tests to `spectrum-patterns.spec.ts` (optional)
4. Document the pattern in this guide
5. Run tests to ensure they work

---

*Framework created for generic Spectrum Web Components validation*
*Last Updated: November 27, 2024*

