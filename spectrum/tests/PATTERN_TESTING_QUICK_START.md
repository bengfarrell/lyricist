# Pattern Testing - Quick Start

**TL;DR:** Framework ready, comprehensive, generic, reusable - validates Spectrum Design System compliance.

---

## What It Does

Validates that elements with `data-spectrum-pattern` attributes follow Spectrum guidelines:

```html
<sp-button 
  variant="accent"
  data-spectrum-pattern="button-accent"
  aria-label="Save"
>
  Save
</sp-button>
```

**Checks:**
- ✅ Structure (element type, hierarchy)
- ✅ Styles (CSS properties, tokens)
- ✅ Accessibility (ARIA roles, labels, states)
- ✅ Attributes (required attributes, values)

---

## Quick Commands

```bash
# Run all pattern tests
npm run test:spectrum

# Run specific category
npm run test:spectrum -- --grep "Button Patterns"

# Debug mode with UI
npm run test:spectrum:ui

# Headed browser
npm run test:spectrum:headed
```

---

## Pattern Examples

### Button Patterns
```html
<sp-button variant="accent" data-spectrum-pattern="button-accent">Save</sp-button>
<sp-button variant="primary" data-spectrum-pattern="button-primary">Submit</sp-button>
<sp-button variant="secondary" data-spectrum-pattern="button-secondary">Cancel</sp-button>
<sp-button variant="negative" data-spectrum-pattern="button-negative">Delete</sp-button>
<sp-button disabled data-spectrum-pattern="button button-disabled">Disabled</sp-button>
```

### Action Button Patterns
```html
<sp-action-button aria-label="Settings" data-spectrum-pattern="action-button">
  <sp-icon-settings slot="icon"></sp-icon-settings>
</sp-action-button>

<sp-action-button quiet aria-label="Close" data-spectrum-pattern="action-button-quiet">
  <sp-icon-close slot="icon"></sp-icon-close>
</sp-action-button>

<sp-action-button selected aria-label="Bold" data-spectrum-pattern="action-button action-button-selected">
  <sp-icon-text-bold slot="icon"></sp-icon-text-bold>
</sp-action-button>
```

### Form Patterns
```html
<form data-spectrum-pattern="form">
  <div data-spectrum-pattern="form-item">
    <label data-spectrum-pattern="field-label" for="name">Name</label>
    <sp-textfield 
      id="name"
      data-spectrum-pattern="textfield"
      placeholder="Enter your name"
    ></sp-textfield>
  </div>
  
  <div data-spectrum-pattern="form-item">
    <label data-spectrum-pattern="field-label" for="email">Email</label>
    <sp-textfield 
      id="email"
      type="email"
      data-spectrum-pattern="textfield"
      invalid
    ></sp-textfield>
    <span data-spectrum-pattern="help-text-negative" role="alert">
      Invalid email address
    </span>
  </div>
</form>
```

### Dialog Patterns
```html
<div role="dialog" aria-modal="true" aria-label="Confirm Delete" data-spectrum-pattern="modal dialog">
  <h2 data-spectrum-pattern="dialog-heading">Confirm Delete</h2>
  
  <div data-spectrum-pattern="dialog-content">
    <p>Are you sure you want to delete this item?</p>
  </div>
  
  <div data-spectrum-pattern="dialog-footer">
    <sp-button variant="secondary" data-spectrum-pattern="button-secondary">Cancel</sp-button>
    <sp-button variant="negative" data-spectrum-pattern="button-negative">Delete</sp-button>
  </div>
</div>
```

---

## Files Created

```
spectrum/tests/
├── pattern-specs.ts                 # 50+ pattern specifications
├── pattern-helpers.ts               # Validation utilities (generic)
├── spectrum-patterns.spec.ts        # Main test suite
├── PATTERN_TESTING_GUIDE.md         # Complete documentation (50 pages)
├── PATTERN_TESTING_QUICK_START.md   # This file
└── README.md                        # Updated with pattern tests
```

---

## Test Output Examples

### ✅ Success
```
✅ All patterns validated successfully!

📊 Found 127 elements with data-spectrum-pattern

📈 Pattern usage statistics:
   button-accent: 15
   action-button-quiet: 23
   textfield: 12
```

### ❌ Violations
```
❌ Found Spectrum pattern violations:

📦 Pattern: button-accent
   🔍 Element: sp-button.save-btn
      ❌ Errors:
         - [attribute] Missing required attribute: variant
         - [aria] Missing accessibility label

📊 Summary:
   Total violations: 1 elements
   Errors: 2
```

---

## Common Patterns

### Buttons (7 patterns)
- `button` - Standard button
- `button-primary` - Important action
- `button-accent` - Call-to-action
- `button-secondary` - Secondary action
- `button-negative` - Destructive
- `button-disabled` - Disabled state
- `button-pending` - Loading state

### Action Buttons (3 patterns)
- `action-button` - Compact button
- `action-button-quiet` - Subdued
- `action-button-selected` - Selected

### Forms (7 patterns)
- `form` - Form container
- `form-item` - Field container
- `field-label` - Field label
- `textfield` - Text input
- `textfield-invalid` - Error state
- `help-text` - Helper text
- `help-text-negative` - Error message

### Dialogs (8 patterns)
- `dialog` - Dialog container
- `modal` - Modal dialog
- `modal-overlay` - Overlay backdrop
- `underlay` - Dialog underlay
- `dialog-heading` - Title
- `dialog-content` - Body
- `dialog-footer` - Actions
- `dialog-close` - Close button

### States (5 patterns)
- `hover` - Hover state
- `focus` - Focus state
- `active` - Active state
- `disabled` - Disabled state
- `selected` - Selected state

**Total: 43 patterns defined** (extensible)

---

## Key Features

### 1. Generic & Reusable
Works with **any** Lit + Spectrum Web Components app - not coupled to your specific application.

### 2. Comprehensive
Validates structure, styles, ARIA, attributes, and custom logic for each pattern.

### 3. Shadow DOM Support
Automatically queries both Light DOM and Shadow DOM.

### 4. Detailed Reports
Clear error messages with actionable suggestions.

### 5. Extensible
Easy to add custom patterns and validation rules.

---

## Adding New Patterns

```typescript
// 1. Define in pattern-specs.ts
export const MY_PATTERNS: Record<string, PatternSpec> = {
  'my-pattern': {
    name: 'My Pattern',
    description: 'Description',
    allowedElements: ['div'],
    cssProperties: [
      { property: 'display', expectedValue: 'flex' }
    ],
    ariaRequirements: {
      requiredLabels: ['aria-label']
    }
  }
};

// 2. Add to ALL_PATTERN_SPECS
export const ALL_PATTERN_SPECS = {
  ...BUTTON_PATTERNS,
  ...MY_PATTERNS  // Add here
};

// 3. Use in HTML
<div data-spectrum-pattern="my-pattern" aria-label="My Component">
  Content
</div>

// 4. Tests automatically validate it!
```

---

## Multiple Patterns

Elements can have multiple patterns:

```html
<sp-button 
  variant="accent"
  disabled
  data-spectrum-pattern="button-accent button-disabled"
>
  Save
</sp-button>
```

---

## Validation Types

| Type | What It Checks | Severity |
|------|---------------|----------|
| **Structure** | Element type, hierarchy, children | Error |
| **Attributes** | Required attributes, values | Error |
| **Styles** | CSS properties, design tokens | Error/Warning |
| **ARIA** | Roles, labels, states | Error/Warning |
| **Custom** | Pattern-specific validation | Error/Warning |

---

## Best Practices

### 1. Use Correct Shortcodes
```html
<!-- ✅ Good: From dictionary -->
<sp-button variant="accent" data-spectrum-pattern="button-accent">

<!-- ❌ Bad: Custom shortcode -->
<sp-button data-spectrum-pattern="my-save-button">
```

### 2. Include Accessibility
```html
<!-- ✅ Good: Has aria-label -->
<sp-action-button quiet aria-label="Close" data-spectrum-pattern="action-button-quiet">
  <sp-icon-close slot="icon"></sp-icon-close>
</sp-action-button>

<!-- ❌ Bad: Missing label -->
<sp-action-button quiet data-spectrum-pattern="action-button-quiet">
  <sp-icon-close slot="icon"></sp-icon-close>
</sp-action-button>
```

### 3. Match Pattern to State
```html
<!-- ✅ Good: Disabled state marked -->
<sp-button disabled data-spectrum-pattern="button button-disabled">

<!-- ❌ Bad: State not marked -->
<sp-button disabled data-spectrum-pattern="button">
```

### 4. Hierarchical Patterns
```html
<!-- ✅ Good: Proper hierarchy -->
<div data-spectrum-pattern="form">
  <div data-spectrum-pattern="form-item">
    <label data-spectrum-pattern="field-label">Name</label>
    <sp-textfield data-spectrum-pattern="textfield"></sp-textfield>
  </div>
</div>
```

---

## When to Use

### Use Pattern Tests When:
- ✅ Building new features
- ✅ Refactoring UI
- ✅ Adding accessibility
- ✅ Ensuring consistency
- ✅ Before deployment
- ✅ In CI/CD pipeline

### Don't Use Pattern Tests When:
- ❌ Element doesn't follow Spectrum pattern
- ❌ Custom, app-specific component
- ❌ No Spectrum equivalent exists

---

## Troubleshooting

### Tests Can't Find Elements
```typescript
// Increase timeout in test file
await page.waitForSelector('[data-spectrum-pattern]', { 
  timeout: 30000 
});
```

### Too Many Failures
```bash
# Start with one category
npm run test:spectrum -- --grep "Button Patterns"

# Fix incrementally
```

### Unknown Pattern Warning
```
⚠️  Found unknown pattern shortcodes:
   my-custom-pattern
```

**Solution:** Add pattern spec or use standard shortcode

---

## Next Steps

### Phase 1: Discovery
```bash
npm run test:spectrum -- --grep "should find all pattern elements"
```

See what patterns you're using and statistics.

### Phase 2: Validation
```bash
npm run test:spectrum -- --grep "Button Patterns"
```

Validate one category at a time.

### Phase 3: Comprehensive
```bash
npm run test:spectrum
```

Run all tests and fix all violations.

---

## Documentation

- **[PATTERN_TESTING_GUIDE.md](./PATTERN_TESTING_GUIDE.md)** - Complete 50-page guide
- **[PATTERN_TESTING_SUMMARY.md](../PATTERN_TESTING_SUMMARY.md)** - Executive summary
- **[pattern-specs.ts](./pattern-specs.ts)** - All pattern specs
- **[pattern-helpers.ts](./pattern-helpers.ts)** - Validation utilities

---

## Resources

- [Spectrum Design System](https://spectrum.adobe.com/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Pattern Dictionary](../dictionary.md)

---

**Status:** ✅ Ready to use  
**Coverage:** 43 patterns defined  
**Documentation:** Complete  

🚀 **Start validating your patterns today!**


