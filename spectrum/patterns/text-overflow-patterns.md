# Text overflow patterns

Text overflow patterns define how text behaves when it exceeds the available space in a component. Spectrum CSS provides consistent approaches for wrapping, truncation, and overflow handling across components.

## Default behaviors

### Text wrapping (default)
Most Spectrum CSS components allow text to wrap to multiple lines by default.

**Components with wrapping:**
- Buttons
- Menu items
- Field labels
- Help text
- Dialog content
- Most text-based components

**Guidelines:**
- Maintains full content readability
- Height of component increases to accommodate text
- Preferred for accessibility
- Best for most use cases

**Custom properties:**
```css
--spectrum-line-height
--spectrum-text-line-height
```

### Single-line (no wrapping)
Some components are designed to stay on a single line.

**Components:**
- Tabs (labels typically single-line)
- Breadcrumb items
- Tags
- Badges

## Wrapping patterns

### Button text wrapping

When button text exceeds horizontal space, it wraps by default.

**Alignment behavior:**
- **Without icon:** Text center-aligned
- **With icon:** Text aligned start (left in LTR), icon remains vertically top-aligned

**HTML structure:**
```html
<button class="spectrum-Button">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-Button-label">
    This is a longer button label that will wrap to multiple lines
  </span>
</button>
```

**Guidelines:**
- Default and recommended behavior
- Maintains accessibility
- Works well with responsive layouts
- Icon stays top-aligned when text wraps

### Menu item wrapping

Menu items wrap by default when labels are long.

**Wrapping elements:**
- **Label:** Wraps to multiple lines
- **Description:** Always wraps (no truncation option)
- **Header:** Wraps to multiple lines

**Non-wrapping elements:**
- **Value:** Typically short, positioned at end

**Guidelines:**
- Full content always readable
- Component height expands as needed
- Description text always wraps

### Field label wrapping

Field labels wrap when text is too long.

**Example:**
```html
<label class="spectrum-FieldLabel" style="max-width: 200px;">
  This is a longer field label that will wrap to the next line
  <svg class="spectrum-FieldLabel-requiredIcon">
    <use xlink:href="#spectrum-icon-Asterisk" />
  </svg>
</label>
```

**Guidelines:**
- Asterisk stays with text (no space in markup)
- Wrapping maintains readability
- Works for both top and side labels

## Truncation patterns

### Menu item label truncation

Menu item labels can be truncated with ellipsis when space is constrained.

**CSS class:**
- `.spectrum-Menu-itemLabel--truncate`

**Requirements:**
- Menu must have set `inline-size` or `max-inline-size`
- Or menu must be constrained by parent element width

**HTML structure:**
```html
<div class="spectrum-Menu" style="max-inline-size: 200px;">
  <div class="spectrum-Menu-item">
    <span class="spectrum-Menu-itemLabel spectrum-Menu-itemLabel--truncate">
      This is a very long menu item label that will be truncated
    </span>
  </div>
</div>
```

**Guidelines:**
- Use sparingly; wrapping is usually better
- Show full text in tooltip on hover
- Truncation only works on labels and headers, not descriptions
- Requires setting explicit width constraint

**Custom properties:**
```css
--spectrum-menu-item-label-text-overflow: ellipsis;
--spectrum-menu-item-label-white-space: nowrap;
--spectrum-menu-item-label-overflow: hidden;
```

### Menu section header truncation

Section headers can also be truncated.

**CSS class:**
- `.spectrum-Menu-sectionHeading--truncate`

**Guidelines:**
- Same requirements as label truncation
- Consider wrapping for better accessibility
- Provide tooltip with full text

### Button text no-wrap

Buttons can be set to disable wrapping.

**CSS class:**
- `.spectrum-Button--noWrap`

**Behavior:**
- Text stays on one line
- Button width expands until max-width
- Overflowing text shows ellipsis

**HTML structure:**
```html
<button class="spectrum-Button spectrum-Button--noWrap" style="max-width: 200px;">
  <span class="spectrum-Button-label">
    This text will not wrap but will show ellipsis instead
  </span>
</button>
```

**Guidelines:**
- Not part of official design spec
- Use with care and consideration
- Set `max-width` to prevent excessive expansion
- Consider readability and accessibility
- May cause usability issues with long labels

**Custom properties:**
```css
--spectrum-button-label-text-overflow: ellipsis;
--spectrum-button-label-white-space: nowrap;
--spectrum-button-label-overflow: hidden;
```

## Tooltip pattern for truncated text

When text is truncated, always provide full text in a tooltip.

**Pattern:**
```html
<div
  class="spectrum-Menu-item"
  title="Full text that appears in tooltip"
>
  <span class="spectrum-Menu-itemLabel spectrum-Menu-itemLabel--truncate">
    Truncated text...
  </span>
</div>
```

**Implementation considerations:**
- Use native `title` attribute for simple tooltips
- Consider Spectrum Tooltip component for richer experiences
- Show tooltip on hover and focus
- Ensure tooltip is accessible to keyboard and screen reader users

## Width constraints

### Explicit width setting

Set specific width for predictable truncation:

```css
.my-menu {
  inline-size: 250px;
}

.my-button {
  max-inline-size: 200px;
}
```

### Parent-constrained width

Components inherit width constraints from parents:

```html
<div style="max-width: 300px;">
  <div class="spectrum-Menu">
    <!-- Menu items will be constrained to 300px -->
  </div>
</div>
```

### Responsive width

Use responsive units for flexible layouts:

```css
.my-menu {
  max-inline-size: min(400px, 90vw);
}
```

## Multi-line text considerations

### Line clamping

While not built into Spectrum CSS, you can implement line clamping:

```css
.my-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Guidelines:**
- Use sparingly
- Consider accessibility impact
- Provide way to access full content
- Not suitable for critical information

### Scrollable text

For large amounts of text in constrained space:

```css
.my-content {
  max-block-size: 300px;
  overflow-y: auto;
}
```

**Use cases:**
- Dialog content areas
- Menu items with long descriptions (rare)
- Help text panels

## Accessibility considerations

### Prefer wrapping over truncation
- Wrapping maintains full content accessibility
- Truncated text requires additional interaction (hover) to read
- Screen readers may miss truncated content if not handled properly

### Provide alternatives for truncated text
- Include `title` attribute for native tooltip
- Or use Spectrum Tooltip component
- Ensure full text is programmatically available
- Consider `aria-label` if visible text is truncated

### Keyboard accessibility
- Truncated items must still be keyboard accessible
- Tooltips should appear on focus, not just hover
- Ensure truncated text doesn't hide critical information

### Screen reader considerations
- Screen readers typically read full text even if visually truncated
- Test with actual screen readers
- Consider using `aria-label` with full text

## Responsive behavior

### Mobile considerations
- Longer labels are more likely on narrow viewports
- Consider allowing more wrapping on mobile
- Touch targets should remain adequate size even with wrapping
- Truncation may be necessary to maintain usable interface

### Breakpoint strategies

```css
/* Mobile: Allow wrapping */
@media (max-width: 768px) {
  .my-button {
    /* Remove no-wrap if applied */
    white-space: normal;
  }
}

/* Desktop: Can use truncation with larger space */
@media (min-width: 769px) {
  .my-menu {
    max-inline-size: 400px;
  }

  .my-menu-item-label {
    /* Apply truncation if needed */
    @extend .spectrum-Menu-itemLabel--truncate;
  }
}
```

## Best practices

### When to wrap (recommended)
- Default choice for most components
- Better for accessibility
- Works well with responsive layouts
- Maintains full content readability
- Accommodates translation and localization

### When to truncate
- Constrained layouts (sidebars, toolbars)
- Known short content that occasionally exceeds space
- When full text is available via tooltip or other means
- User interface chrome where space is premium
- Data tables with many columns

### When to use no-wrap
- Tags and badges (by design single-line)
- Breadcrumbs (typically short)
- Tabs (usually short labels)
- Icon-only buttons with hidden labels
- Very rarely for regular buttons (not recommended)

## Testing overflow behavior

### Test with various content lengths
- Short labels (1-2 words)
- Medium labels (3-5 words)
- Long labels (full sentences)
- Very long labels (paragraphs)

### Test with different languages
- German tends to have longer words
- Asian languages may have different wrapping rules
- RTL languages (Arabic, Hebrew)

### Test at various viewport sizes
- Mobile (320px - 480px)
- Tablet (768px - 1024px)
- Desktop (1280px+)

### Test with increased text size
- Users may increase browser font size
- Zoom levels (100%, 125%, 150%, 200%)
- Ensure text still readable when scaled

## Common patterns

### Menu with truncation
```html
<div class="spectrum-Menu" style="max-inline-size: 200px;">
  <div class="spectrum-Menu-item" title="Full item name here">
    <span class="spectrum-Menu-itemLabel spectrum-Menu-itemLabel--truncate">
      Very long item name that gets truncated
    </span>
  </div>
</div>
```

### Button with wrapping (default)
```html
<button class="spectrum-Button" style="max-width: 200px;">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-Button-label">
    This longer button label will wrap to multiple lines
  </span>
</button>
```

### Field label with wrapping
```html
<label class="spectrum-FieldLabel" style="max-width: 200px;">
  This longer field label will wrap to accommodate the full text
  <svg class="spectrum-FieldLabel-requiredIcon">
    <use xlink:href="#spectrum-icon-Asterisk" />
  </svg>
</label>
```

### Dialog with scrollable content
```html
<div class="spectrum-Dialog">
  <h2 class="spectrum-Dialog-heading">Dialog Title</h2>
  <div class="spectrum-Dialog-content" style="max-height: 400px; overflow-y: auto;">
    <!-- Long content that scrolls -->
  </div>
</div>
```

## Related patterns

- [Button patterns](./button-patterns.md)
- [Menu patterns](./menu-patterns.md)
- [Form patterns](./form-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
