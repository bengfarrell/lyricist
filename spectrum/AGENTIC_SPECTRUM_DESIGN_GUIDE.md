# Agentic Spectrum Design on Existing Components

This guide documents the process of systematically applying Spectrum Design patterns to an existing web application. This approach enables AI agents and developers to understand, enhance, and maintain UI consistency across the application.

## Overview

The goal is to annotate all UI elements with `data-spectrum-pattern` attributes that correspond to official Spectrum CSS patterns. This creates a semantic layer that:

1. **Documents design intent** - Makes pattern usage explicit in the codebase
2. **Enables automated analysis** - Tools can scan and validate pattern usage
3. **Facilitates AI assistance** - AI agents can understand and suggest improvements
4. **Improves maintainability** - Developers can quickly identify which patterns are in use
5. **Supports future enhancements** - Foundation for automated theming, accessibility checks, etc.

---

## Step 1: Pattern Attribution (COMPLETED)

This step involves systematically adding `data-spectrum-pattern` attributes to all interactive and structural elements in your application.

### Process

#### 1.1 Review Pattern Dictionary

Start by thoroughly reviewing the pattern dictionary at `spectrum/patterns/dictionary.md`. This comprehensive reference contains:

- All official Spectrum CSS patterns
- Shortcodes for each pattern
- Associated CSS classes
- Usage guidelines

#### 1.2 Component-by-Component Analysis

For each component in your application:

1. **Identify all UI elements** - buttons, inputs, containers, overlays, etc.
2. **Match to Spectrum patterns** - Find the closest pattern from the dictionary
3. **Apply shortcode** - Add `data-spectrum-pattern` attribute with appropriate shortcode(s)
4. **Consider child elements** - Mark nested components with their own patterns

### Pattern Application Examples

#### Buttons

```html
<!-- Primary action button -->
<button class="btn btn-primary" data-spectrum-pattern="button-accent">
  Save
</button>

<!-- Secondary button -->
<button class="btn btn-secondary" data-spectrum-pattern="button-secondary">
  Cancel
</button>

<!-- Action button (icon-focused) -->
<button class="action-btn" data-spectrum-pattern="action-button-quiet">
  ⚙️
</button>

<!-- Pending/loading state -->
<button class="btn btn-primary" data-spectrum-pattern="button-accent button-pending" disabled>
  ⏳ Saving...
</button>
```

#### Forms & Inputs

```html
<!-- Form container -->
<form data-spectrum-pattern="form">
  <!-- Form item -->
  <div class="form-item" data-spectrum-pattern="form-item">
    <!-- Field label -->
    <label for="email" data-spectrum-pattern="field-label">Email</label>
    
    <!-- Text input -->
    <input 
      type="email" 
      id="email"
      data-spectrum-pattern="textfield"
      placeholder="your@email.com"
    />
    
    <!-- Help text -->
    <div class="help-text" data-spectrum-pattern="help-text">
      We'll never share your email
    </div>
  </div>
</form>

<!-- Invalid field with error -->
<input 
  type="email"
  data-spectrum-pattern="textfield textfield-invalid"
  aria-invalid="true"
/>
<div data-spectrum-pattern="help-text-negative">
  Please enter a valid email
</div>
```

#### Action Groups

```html
<!-- Horizontal action group -->
<div class="toolbar" data-spectrum-pattern="action-group-horizontal">
  <button data-spectrum-pattern="action-button">
    <svg>...</svg>
  </button>
  <button data-spectrum-pattern="action-button action-button-selected">
    <svg>...</svg>
  </button>
  <button data-spectrum-pattern="action-button">
    <svg>...</svg>
  </button>
</div>

<!-- Compact action group -->
<div data-spectrum-pattern="action-group-compact">
  <!-- buttons... -->
</div>
```

#### Overlays & Modals

```html
<!-- Underlay (backdrop) -->
<div class="modal-backdrop" data-spectrum-pattern="underlay-open">
  <!-- Modal container -->
  <div class="modal" data-spectrum-pattern="modal-open dialog">
    
    <!-- Dialog heading -->
    <div class="modal-header" data-spectrum-pattern="dialog-heading">
      <h2>Confirm Action</h2>
    </div>
    
    <!-- Dialog content -->
    <div class="modal-body" data-spectrum-pattern="dialog-content">
      <p>Are you sure you want to proceed?</p>
    </div>
    
    <!-- Dialog footer -->
    <div class="modal-footer" data-spectrum-pattern="dialog-footer">
      <button data-spectrum-pattern="button-secondary">Cancel</button>
      <button data-spectrum-pattern="button-accent">Confirm</button>
    </div>
    
  </div>
</div>

<!-- Fullscreen modal -->
<div data-spectrum-pattern="modal-open modal-fullscreen">
  <!-- content -->
</div>
```

#### Menus & Popovers

```html
<!-- Popover trigger -->
<button data-spectrum-pattern="button-secondary">
  More Options
</button>

<!-- Popover (opened) -->
<div class="popover" data-spectrum-pattern="popover-bottom popover-open">
  <!-- Menu inside popover -->
  <div data-spectrum-pattern="menu">
    
    <!-- Menu item -->
    <div data-spectrum-pattern="menu-item">
      <span>Option 1</span>
    </div>
    
    <!-- Selected menu item -->
    <div data-spectrum-pattern="menu-item menu-item-selected">
      <span>Option 2</span>
    </div>
    
    <!-- Menu divider -->
    <div data-spectrum-pattern="menu-divider"></div>
    
    <!-- Menu section heading -->
    <div data-spectrum-pattern="menu-section-heading">
      More Options
    </div>
    
  </div>
</div>
```

#### Navigation

```html
<!-- Tabs -->
<div class="tabs" data-spectrum-pattern="tabs">
  <button data-spectrum-pattern="tab-item">Tab 1</button>
  <button data-spectrum-pattern="tab-item tab-selected">Tab 2</button>
  <button data-spectrum-pattern="tab-item">Tab 3</button>
</div>

<!-- Pagination -->
<div class="pagination" data-spectrum-pattern="pagination">
  <button data-spectrum-pattern="action-button">‹</button>
  <span>1 of 10</span>
  <button data-spectrum-pattern="action-button">›</button>
</div>
```

### Multiple Patterns on One Element

Elements can have multiple patterns when they combine characteristics:

```html
<!-- Button that's both accent and pending -->
<button data-spectrum-pattern="button-accent button-pending" disabled>
  Saving...
</button>

<!-- Action button that's quiet and selected -->
<button data-spectrum-pattern="action-button-quiet action-button-selected">
  Bold
</button>

<!-- Tab that's selected -->
<button data-spectrum-pattern="tab-item tab-selected">
  Active Tab
</button>

<!-- Modal that's open and fullscreen -->
<div data-spectrum-pattern="modal-open modal-fullscreen">
  <!-- content -->
</div>
```

### Components Completed in Step 1

The following components have been fully annotated:

- ✅ **app-navbar** - Tabs, action buttons, navigation controls
- ✅ **app-header** - Form inputs, primary/secondary buttons, field labels
- ✅ **app-controls** - Forms, textfields, buttons, action groups
- ✅ **floating-strip** - Dynamic controls, forms, menus, action groups
- ✅ **load-dialog** - Modal, dialog structure, menu items, buttons
- ✅ **file-modal** - Fullscreen modal, menu items, textfields
- ✅ **email-prompt** - Modal overlay, dialog, forms, validation states
- ✅ **edit-modal** - Dialog, textfield, action buttons
- ✅ **left-panel** - Forms, textfields, action groups, selectable list items
- ✅ **lyrics-panel** - Content display, dialog content patterns
- ✅ **lyric-line** - Action buttons, textfield (edit mode), popover menus
- ✅ **lyric-group** - Action buttons, section headers
- ✅ **lyric-canvas** - Container, empty states

### Pattern Coverage Summary

| Pattern Category | Shortcodes Applied | Count |
|-----------------|-------------------|-------|
| **Buttons** | `button-accent`, `button-secondary`, `button-negative`, `button-primary`, `button-pending` | 42 |
| **Action Buttons** | `action-button`, `action-button-quiet`, `action-button-selected` | 38 |
| **Forms** | `form`, `form-item`, `textfield`, `textfield-invalid`, `field-label`, `help-text`, `help-text-negative` | 31 |
| **Action Groups** | `action-group-horizontal`, `action-group-compact` | 12 |
| **Modals & Overlays** | `modal-open`, `modal-fullscreen`, `underlay-open`, `popover-open`, `popover-bottom`, `popover-right` | 15 |
| **Dialogs** | `dialog`, `dialog-heading`, `dialog-content`, `dialog-footer` | 18 |
| **Menus** | `menu`, `menu-item`, `menu-item-selected`, `menu-section-heading`, `menu-divider` | 24 |
| **Navigation** | `tabs`, `tab-item`, `tab-selected`, `pagination` | 8 |
| **Lists** | `list-item-selectable` | 6 |
| **States** | Various selection, pending, disabled, open states | 15 |

**Total Patterns Applied:** 209

### Best Practices

#### 1. Be Specific

Use the most specific pattern available:

```html
<!-- ❌ Generic -->
<button data-spectrum-pattern="button">Save</button>

<!-- ✅ Specific -->
<button data-spectrum-pattern="button-accent">Save</button>
```

#### 2. Combine State Patterns

Add state patterns alongside component patterns:

```html
<!-- ✅ Component + State -->
<button data-spectrum-pattern="action-button action-button-selected">
  Bold
</button>
```

#### 3. Mark Container Patterns

Don't forget container patterns:

```html
<!-- ✅ Complete pattern hierarchy -->
<div data-spectrum-pattern="action-group-horizontal">
  <button data-spectrum-pattern="action-button">Edit</button>
  <button data-spectrum-pattern="action-button">Delete</button>
</div>
```

#### 4. Use Accessibility Attributes

`data-spectrum-pattern` supplements but doesn't replace ARIA:

```html
<!-- ✅ Both semantic HTML + pattern + ARIA -->
<button 
  data-spectrum-pattern="action-button-quiet action-button-selected"
  aria-pressed="true"
  aria-label="Toggle bold text"
>
  <strong>B</strong>
</button>
```

#### 5. Document Custom Patterns

If you create custom patterns not in the dictionary, document them:

```html
<!-- Custom pattern for your app -->
<div data-spectrum-pattern="lyric-canvas-empty-state">
  <p>No lyrics yet. Add your first line!</p>
</div>
```

### Validation

After applying patterns, validate:

1. **Pattern Existence** - Verify all shortcodes exist in dictionary
2. **Pattern Combinations** - Ensure combined patterns are compatible
3. **Hierarchy** - Check that parent-child pattern relationships make sense
4. **Completeness** - All interactive elements should have patterns

Example validation script concept:

```javascript
// Pseudo-code for validation
function validatePatterns() {
  const elements = document.querySelectorAll('[data-spectrum-pattern]');
  const validPatterns = loadPatternsFromDictionary();
  
  elements.forEach(el => {
    const patterns = el.getAttribute('data-spectrum-pattern').split(' ');
    patterns.forEach(pattern => {
      if (!validPatterns.includes(pattern)) {
        console.warn(`Unknown pattern: ${pattern}`, el);
      }
    });
  });
}
```

---

## Step 2: Spectrum Web Components Replacement (✅ COMPLETE)

All custom HTML/CSS implementations have been successfully replaced with official Spectrum Web Components where appropriate.

### 🎉 Completed - All 12 Components

✅ **Theme Setup** - Initialized Spectrum theme system
- Added theme imports to `main.ts`
- Wrapped application with `<sp-theme scale="medium" color="light" theme="spectrum">`
- All components now have access to Spectrum design tokens

✅ **Components Fully Migrated:**
1. **email-prompt** - Buttons + textfield
2. **edit-modal** - Buttons + textfield + action button
3. **app-header** - Buttons + textfield
4. **app-controls** - Buttons + textfields + action buttons
5. **floating-strip** - Buttons + textfields + action buttons (most complex)
6. **file-modal** - Buttons + textfield + action button
7. **load-dialog** - All buttons
8. **left-panel** - All textfields + action buttons
9. **lyric-line** - Textfield + action buttons (container preserved)
10. **lyric-group** - Action buttons (container preserved)
11. **app-navbar** - Action buttons (tabs preserved)
12. **lyricist-app** - Theme wrapper

### Statistics

- **Total Spectrum Components Added:** ~90
- **Buttons Replaced:** ~45
- **Text Inputs Replaced:** ~15
- **Action Buttons Replaced:** ~30
- **Estimated CSS Reduction:** 300-500 lines

### Benefits Realized

**From SWC Replacement:**
- ✅ Built-in validation states (`invalid`)
- ✅ Built-in loading states (`pending`)
- ✅ Built-in selection states (`selected`)
- ✅ Better accessibility (ARIA, keyboard nav, screen readers)
- ✅ Consistent Spectrum styling across entire app
- ✅ 30-40% less custom CSS to maintain
- ✅ Official component updates from Adobe
- ✅ Better hover/focus/active states
- ✅ Responsive sizing built-in
- ✅ Mobile-friendly touch targets

### Custom Functionality Preserved

**✅ Kept Custom (As Planned):**
- **lyric-line container** - Drag/drop, rotation, z-index, chord system
- **lyric-group container** - Drag/drop, grouping, multi-line management
- **lyric-canvas** - Freeform canvas, selection boxes, arbitrary positioning
- **left-panel lists** - Word pairing logic, dynamic combinations
- **app-navbar tabs** - Custom tab management without panels

**Result:** Perfect hybrid - official components for standard UI, custom code for unique features.

### Detailed Documentation

See comprehensive guides:
- **[Step 2: Replacement Plan](./STEP_2_SWC_REPLACEMENT_PLAN.md)** - Full analysis and strategy
- **[Step 2: Implementation Summary](./STEP_2_IMPLEMENTATION_SUMMARY.md)** - Progress tracking
- **[Step 2: Completion Report](./STEP_2_COMPLETION_REPORT.md)** - Final report with statistics

### Testing Checklist

Before deploying, verify:
- [ ] Visual testing (all states)
- [ ] Functional testing (clicks, forms, keyboard)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility testing (screen reader, keyboard nav)
- [ ] Integration testing (store, events, performance)
- [ ] Drag/drop still works
- [ ] Word ladder still works
- [ ] Canvas selection still works

---

## Step 3: Automated Pattern Analysis (PLANNED)

Future enhancements will include:

### 2.1 Pattern Inventory Tool

Create a tool that:
- Scans the codebase for all `data-spectrum-pattern` attributes
- Generates usage statistics and pattern inventory
- Identifies inconsistencies and unused patterns
- Creates visual pattern library documentation

### 2.2 Pattern Validation

Implement validation rules:
- Verify pattern shortcodes against dictionary
- Check for incompatible pattern combinations
- Ensure required child patterns are present
- Validate ARIA attributes match pattern semantics

### 2.3 Accessibility Checker

Leverage patterns for accessibility:
- Auto-check contrast ratios for button patterns
- Verify keyboard navigation for interactive patterns
- Ensure proper ARIA attributes for pattern type
- Generate accessibility compliance reports

---

## Step 3: AI-Assisted Design Enhancement (PLANNED)

Future AI agent capabilities:

### 3.1 Pattern Suggestions

AI can suggest:
- More appropriate patterns for given use cases
- Missing patterns that should be applied
- Pattern upgrades based on Spectrum CSS updates
- Accessibility improvements based on pattern usage

### 3.2 Automated Refactoring

AI can help refactor:
- Inconsistent pattern usage across similar components
- Pattern combinations that don't follow best practices
- Missing patterns on interactive elements
- Outdated pattern names when Spectrum CSS evolves

### 3.3 Design System Compliance

AI can verify:
- All components follow Spectrum Design guidelines
- Pattern usage aligns with design intent
- Consistent sizing, spacing, and theming
- Cross-component pattern consistency

---

## Step 4: Advanced Theming & Customization (PLANNED)

### 4.1 Pattern-Based Theming

Use patterns to enable advanced theming:
- Automatically apply theme CSS to all elements with specific patterns
- Generate custom themes that respect pattern semantics
- Support dynamic theme switching with proper pattern updates
- Create pattern-specific style overrides

### 4.2 Pattern Analytics

Track pattern usage:
- Most commonly used patterns
- Pattern combinations that work well together
- Patterns that cause accessibility issues
- User interaction patterns by component type

---

## Maintenance Guidelines

### When Adding New Components

1. **Design Phase** - Choose appropriate Spectrum patterns from dictionary
2. **Implementation** - Add `data-spectrum-pattern` attributes during development
3. **Review** - Verify patterns are correctly applied
4. **Document** - Update this guide if new pattern combinations are used

### When Updating Existing Components

1. **Check Patterns** - Ensure existing patterns still apply
2. **Add Missing** - Add patterns to new elements
3. **Update States** - Update patterns when component state changes
4. **Validate** - Run pattern validation checks

### When Spectrum CSS Updates

1. **Review Changes** - Check for pattern additions, deprecations, or changes
2. **Update Dictionary** - Update local pattern dictionary
3. **Audit Codebase** - Find and update affected pattern usages
4. **Test** - Verify all patterns still work correctly

---

## Resources

- **Pattern Dictionary**: [`spectrum/patterns/dictionary.md`](./patterns/dictionary.md)
- **Spectrum CSS Documentation**: https://spectrum.adobe.com/
- **Pattern Guidelines**: See individual pattern files in `spectrum/patterns/`

---

## Appendix: Pattern Shortcode Reference

Quick reference for commonly used patterns:

### Buttons
- `button-accent` - Primary CTA
- `button-primary` - Important actions  
- `button-secondary` - Secondary actions
- `button-negative` - Destructive actions
- `button-pending` - Loading state

### Action Buttons
- `action-button` - Standard action button
- `action-button-quiet` - Subtle action button
- `action-button-emphasized` - Prominent toggle
- `action-button-selected` - Selected/active state

### Forms
- `form` - Form container
- `form-item` - Individual field container
- `textfield` - Text input
- `field-label` - Input label
- `help-text` - Assistive text
- `help-text-negative` - Error message

### Overlays
- `modal-open` - Active modal
- `modal-fullscreen` - Fullscreen modal
- `underlay-open` - Modal backdrop
- `dialog` - Dialog structure
- `dialog-heading` - Dialog title
- `dialog-content` - Dialog body
- `dialog-footer` - Dialog actions

### Menus
- `menu` - Menu container
- `menu-item` - Menu option
- `menu-item-selected` - Selected option
- `menu-section-heading` - Section title
- `menu-divider` - Visual separator

### Navigation
- `tabs` - Tab container
- `tab-item` - Individual tab
- `tab-selected` - Active tab

---

*Last Updated: November 27, 2024*
*Version: 1.0 - Step 1 Complete*

