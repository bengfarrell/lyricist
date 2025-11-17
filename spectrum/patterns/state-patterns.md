# State patterns

Interactive components in Spectrum CSS have multiple states that provide visual feedback to users. Consistent state implementation creates predictable and accessible interfaces.

## Common interactive states

### Default state
The initial, resting state of a component before any user interaction.

**Implementation:**
- Base component classes with no state modifiers
- Default custom property values apply

### Hover state
Indicates an interactive element is under the pointer.

**CSS implementation:**
```css
.spectrum-Button:hover {
  /* Hover styles automatically applied */
}
```

**For documentation/examples:**
- `.is-hovered` class for static demonstrations

**Custom properties:**
```css
--spectrum-{component}-background-color-hover
--spectrum-{component}-border-color-hover
--spectrum-{component}-content-color-hover
```

**Guidelines:**
- Subtle change from default (typically slight color shift)
- Indicates interactivity and clickability
- Should be immediately obvious but not distracting
- Must meet contrast requirements

### Focus state
Shows which element currently has keyboard focus.

**CSS implementation:**
```css
.spectrum-Button:focus-visible {
  /* Focus styles automatically applied */
}
```

**For documentation/examples:**
- `.is-focused` class for static demonstrations

**Custom properties:**
```css
--spectrum-{component}-background-color-focus
--spectrum-{component}-border-color-focus
--spectrum-{component}-content-color-focus
--spectrum-focus-indicator-color
--spectrum-focus-indicator-gap
--spectrum-focus-indicator-thickness
```

**Guidelines:**
- Must be clearly visible and distinguishable
- Typically uses focus indicator (outline or ring)
- Should work in High Contrast Mode
- Use `:focus-visible` to avoid showing focus on mouse click
- Required for accessibility compliance

### Active/pressed state
Indicates a component is currently being activated (mouse button down or key pressed).

**CSS implementation:**
```css
.spectrum-Button:active {
  /* Active styles automatically applied */
}
```

**For documentation/examples:**
- `.is-active` class for static demonstrations

**Custom properties:**
```css
--spectrum-{component}-background-color-down
--spectrum-{component}-border-color-down
--spectrum-{component}-content-color-down
```

**Guidelines:**
- More pronounced than hover (darker/lighter)
- Provides immediate tactile feedback
- Brief state during click/tap
- Helps users understand their interaction registered

### Disabled state
Shows a component exists but is not currently interactive.

**HTML attribute:**
```html
<button class="spectrum-Button" disabled>Disabled</button>
```

**CSS class:**
- `.is-disabled` (for non-form elements)

**Custom properties:**
```css
--spectrum-{component}-background-color-disabled
--spectrum-{component}-border-color-disabled
--spectrum-{component}-content-color-disabled
--spectrum-disabled-content-color
--spectrum-disabled-background-color
```

**Guidelines:**
- Reduced opacity or desaturated colors
- No hover, focus, or active states
- Should remain readable (not too faint)
- Communicates potential availability later
- Use `disabled` attribute for form elements
- Use `aria-disabled="true"` for other elements
- Typically prevents interaction via CSS `pointer-events: none`

## Selection states

### Selected state
Indicates a component is currently selected (for toggleable controls).

**CSS class:**
- `.is-selected`

**ARIA attribute:**
- `aria-selected="true"` (for appropriate contexts)

**Custom properties:**
```css
--spectrum-{component}-background-color-selected
--spectrum-{component}-border-color-selected
--spectrum-{component}-content-color-selected
```

**Guidelines:**
- Clear visual distinction from unselected state
- Often uses accent color or checkmark
- Maintains hover/focus states when selected
- Common for action buttons, menu items, tabs, etc.

**Examples:**
- Selected action button in a toolbar
- Checked checkbox or radio button
- Active tab in tab group
- Selected menu item in single-select menu

### Checked state
Similar to selected, specifically for checkboxes and radio buttons.

**HTML attribute:**
```html
<input type="checkbox" class="spectrum-Checkbox-input" checked>
```

**CSS class:**
- `.is-checked` (for custom implementations)

**Guidelines:**
- Shows checkmark or filled indicator
- Binary state (checked/unchecked)
- Distinct from indeterminate state

### Indeterminate state
For checkboxes that represent a partial selection.

**HTML property:**
```javascript
checkboxElement.indeterminate = true;
```

**CSS class:**
- `.is-indeterminate`

**Guidelines:**
- Used for parent checkboxes when children are partially selected
- Shows dash or minus indicator instead of checkmark
- Cannot be set via HTML attribute (JavaScript only)

## Loading and progress states

### Pending state
Indicates an action is in progress.

**CSS class:**
- `.is-pending`

**HTML attribute:**
- `[pending]` (alternative)

**Guidelines:**
- Shows indeterminate progress indicator
- Label and icon typically hidden
- Component should also be disabled
- Use for short-duration actions (< 10 seconds)
- For longer operations, use separate progress indicator

**Custom properties:**
```css
--spectrum-{component}-animation-duration
```

**Example (Button):**
```html
<button class="spectrum-Button is-pending" disabled>
  <div class="spectrum-Button-label">Save</div>
  <div class="spectrum-ProgressCircle spectrum-ProgressCircle--indeterminate spectrum-ProgressCircle--overBackground">
    <!-- progress circle SVG -->
  </div>
</button>
```

## Validation states

### Invalid/error state
Indicates component contains an error or invalid value.

**CSS class:**
- `.is-invalid`

**ARIA attributes:**
```html
<input
  class="spectrum-Textfield is-invalid"
  aria-invalid="true"
  aria-describedby="error-message"
>
<div id="error-message" class="spectrum-HelpText spectrum-HelpText--negative">
  Please enter a valid email address
</div>
```

**Custom properties:**
```css
--spectrum-{component}-border-color-error
--spectrum-{component}-border-color-error-hover
--spectrum-{component}-border-color-error-focus
```

**Guidelines:**
- Use negative/error color for border and text
- Provide clear error message
- Associate error message with input via `aria-describedby`
- Validate on blur or submit, not on every keystroke
- Show what's wrong and how to fix it

### Valid/success state
Indicates component contains valid value (use sparingly).

**CSS class:**
- `.is-valid`

**Custom properties:**
```css
--spectrum-{component}-border-color-success
```

**Guidelines:**
- Use success color for border
- Often unnecessary; absence of error is sufficient
- Consider for important validations (password strength, username availability)
- Don't distract with excessive success indicators

## Open/closed states

### Open state
Indicates expandable content is currently visible.

**CSS class:**
- `.is-open`

**ARIA attribute:**
- `aria-expanded="true"`

**Guidelines:**
- Used for dropdowns, accordions, disclosures, overlays
- Often animates transition
- Associated with rotation of chevron/arrow icon
- Pair with `aria-expanded` for accessibility

**Examples:**
- Open accordion item
- Expanded dropdown menu
- Visible modal dialog
- Shown popover

### Closed state
Default state for expandable/collapsible content.

**ARIA attribute:**
- `aria-expanded="false"`

**Guidelines:**
- Content hidden or collapsed
- Icon typically points right or down
- No `.is-open` class present

## Read-only state

Indicates component displays data but doesn't accept input.

**HTML attribute:**
```html
<input class="spectrum-Textfield" readonly value="Read-only value">
```

**CSS class:**
- `.is-readonly` (for custom implementations)

**ARIA attribute:**
- `aria-readonly="true"`

**Guidelines:**
- Different from disabled (focusable and readable)
- Often used for displaying computed or locked values
- Should be clearly distinguishable from editable fields
- Typically maintains default styling but prevents editing

## State combinations

Some components can have multiple states simultaneously:

### Disabled + selected
```html
<button class="spectrum-ActionButton is-selected" disabled>
  <span class="spectrum-ActionButton-label">Selected but disabled</span>
</button>
```

### Focused + selected
- Action button that's selected and currently has keyboard focus
- Tab that's active and focused

### Invalid + focused
```html
<input
  class="spectrum-Textfield is-invalid"
  aria-invalid="true"
>
```

### Hover + selected
- Selected action button being hovered
- Checked checkbox being hovered

## State priority and specificity

When multiple states apply, CSS specificity determines appearance:

1. **Disabled:** Overrides all other states (highest priority)
2. **Invalid/Error:** Takes precedence over default states
3. **Active/Pressed:** Appears during click
4. **Focus:** Shows when element has keyboard focus
5. **Hover:** Shows when pointer is over element
6. **Selected/Checked:** Persistent toggle state
7. **Default:** Base state when no other states apply

## Best practices

### Visual feedback timing
- **Hover:** Immediate (0ms delay)
- **Focus:** Immediate when focused
- **Active:** Immediate during press
- **Pending:** Show after brief delay (200-300ms) to avoid flicker for fast actions

### State persistence
- **Transient states:** Hover, focus, active (disappear when condition ends)
- **Persistent states:** Selected, checked, disabled, invalid, open (remain until explicitly changed)

### Accessibility
- Always use semantic HTML attributes (`disabled`, `checked`, `readonly`)
- Include appropriate ARIA attributes (`aria-selected`, `aria-expanded`, `aria-invalid`, `aria-disabled`)
- Ensure states are perceivable by screen readers
- Don't rely solely on color to indicate state
- Maintain sufficient contrast in all states
- Ensure focus indicators are always visible

### Testing states
1. Test all interactive states (hover, focus, active)
2. Verify disabled state prevents interaction
3. Check selected state is clearly visible
4. Ensure error states are obvious and helpful
5. Test state combinations that can occur
6. Verify keyboard navigation works correctly
7. Test in High Contrast Mode
8. Use screen reader to verify state announcements

## Common patterns

### Button with all states
```html
<!-- Default -->
<button class="spectrum-Button spectrum-Button--accent">Default</button>

<!-- Hover (automatic on :hover) -->
<button class="spectrum-Button spectrum-Button--accent">Hover me</button>

<!-- Focus (automatic on :focus) -->
<button class="spectrum-Button spectrum-Button--accent">Focus me</button>

<!-- Disabled -->
<button class="spectrum-Button spectrum-Button--accent" disabled>Disabled</button>

<!-- Pending -->
<button class="spectrum-Button spectrum-Button--accent is-pending" disabled>
  <span class="spectrum-Button-label">Pending</span>
  <!-- progress circle -->
</button>
```

### Toggle button (action button)
```html
<!-- Unselected -->
<button class="spectrum-ActionButton">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Toggle</span>
</button>

<!-- Selected -->
<button class="spectrum-ActionButton is-selected">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Toggle</span>
</button>
```

### Form field with validation
```html
<!-- Valid input -->
<input
  class="spectrum-Textfield"
  type="email"
  value="user@example.com"
>

<!-- Invalid input -->
<input
  class="spectrum-Textfield is-invalid"
  type="email"
  value="invalid-email"
  aria-invalid="true"
  aria-describedby="email-error"
>
<div id="email-error" class="spectrum-HelpText spectrum-HelpText--negative">
  Please enter a valid email address
</div>
```

## Related patterns

- [Button patterns](./button-patterns.md)
- [Form patterns](./form-patterns.md)
- [Selection patterns](./selection-patterns.md)
- [Menu patterns](./menu-patterns.md)
