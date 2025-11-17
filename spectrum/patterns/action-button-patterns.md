# Action button patterns

Action buttons represent actions a user can take. They're more flexible than regular buttons and commonly used in toolbars, action groups, and for toggleable controls.

## Action button anatomy

An action button can contain:
- Icon (optional but common)
- Label (optional, can be hidden for icon-only buttons)
- Hold icon (optional, indicates additional options on press-and-hold)

**CSS classes:**
- `.spectrum-ActionButton`
- `.spectrum-ActionButton-label`
- `.spectrum-ActionButton-hold` (for hold icon)

**Custom properties:**
```css
--spectrum-actionbutton-background-color-default
--spectrum-actionbutton-background-color-hover
--spectrum-actionbutton-background-color-focus
--spectrum-actionbutton-background-color-selected
--spectrum-actionbutton-content-color-default
--spectrum-actionbutton-border-color-default
```

## Variants

### Standard (default)
Has visible background and border.

**Guidelines:**
- Default action button style
- Most common for general use
- Clear clickable affordance
- Works in most contexts

**Example:**
```html
<button class="spectrum-ActionButton">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>
```

### Quiet
No visible background until interacted with.

**CSS class:**
- `.spectrum-ActionButton--quiet`

**Guidelines:**
- Reduces visual noise
- Best in clear layouts (toolbars, tables, grids)
- Too many quiet buttons in small space can be hard to read
- Hover reveals background

**Example:**
```html
<button class="spectrum-ActionButton spectrum-ActionButton--quiet">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>
```

**Custom properties:**
```css
--spectrum-actionbutton-quiet-background-color-default
--spectrum-actionbutton-quiet-border-color-default
```

### Emphasized
Selected state uses accent color for prominence.

**CSS class:**
- `.spectrum-ActionButton--emphasized`

**Guidelines:**
- Use to draw attention to selected state
- Optimal for toolbars where selection should stand out
- Can combine with quiet for subtle emphasis
- Blue/accent background when selected

**Example:**
```html
<button class="spectrum-ActionButton spectrum-ActionButton--emphasized is-selected">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Bold</span>
</button>
```

**Custom properties:**
```css
--spectrum-actionbutton-emphasized-background-color-selected
--spectrum-actionbutton-emphasized-border-color-selected
```

### Emphasized quiet
Combines quiet and emphasized characteristics.

**CSS classes:**
- `.spectrum-ActionButton--emphasized`
- `.spectrum-ActionButton--quiet`

**Guidelines:**
- No background by default
- Selected state shows accent color
- Good balance between subtle and prominent
- Common in toolbars and action groups

**Example:**
```html
<button class="spectrum-ActionButton spectrum-ActionButton--emphasized spectrum-ActionButton--quiet is-selected">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Bold</span>
</button>
```

## Icon and label combinations

### Icon with label
Most accessible and clear option.

**Guidelines:**
- Icon should reinforce action, not decorate
- Icon precedes label in markup
- Label clearly describes action

**HTML structure:**
```html
<button class="spectrum-ActionButton">
  <svg class="spectrum-Icon spectrum-Icon--sizeM">
    <use xlink:href="#spectrum-icon-Edit" />
  </svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>
```

### Icon only (hidden label)
Label is visually hidden but available to screen readers.

**CSS class:**
- Apply visually-hidden utility to label (implementation-specific)

**Guidelines:**
- Use only for universally understood icons
- Label appears in tooltip on hover
- Maintains accessibility via hidden label
- Common in toolbars with space constraints

**HTML structure:**
```html
<button class="spectrum-ActionButton" aria-label="Edit" title="Edit">
  <svg class="spectrum-Icon spectrum-Icon--sizeM">
    <use xlink:href="#spectrum-icon-Edit" />
  </svg>
</button>
```

### Label only (no icon)
Less common, but valid.

**Guidelines:**
- Use when icon would not add clarity
- Action is self-explanatory via text
- More like a regular button

**HTML structure:**
```html
<button class="spectrum-ActionButton">
  <span class="spectrum-ActionButton-label">More Options</span>
</button>
```

## Hold icon

Indicates that pressing and holding the button reveals additional options or a menu.

**CSS class:**
- `.spectrum-ActionButton-hold`

**HTML structure:**
```html
<button class="spectrum-ActionButton">
  <span class="spectrum-ActionButton-hold">
    <svg class="spectrum-Icon spectrum-Icon--sizeS">
      <use xlink:href="#spectrum-icon-CornerTriangle" />
    </svg>
  </span>
  <svg class="spectrum-Icon spectrum-Icon--sizeM">
    <use xlink:href="#spectrum-icon-Edit" />
  </svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>
```

**Guidelines:**
- Hold icon appears before workflow icon in markup
- Indicates press-and-hold for submenu
- Size scales with button (uses smaller icon)
- Used to switch between related actions

## Sizing

Action buttons come in five sizes (including extra-small).

**Size classes:**
- `.spectrum-ActionButton--sizeXS` - Extra small
- `.spectrum-ActionButton--sizeS` - Small
- `.spectrum-ActionButton` (no modifier) - Medium (default)
- `.spectrum-ActionButton--sizeL` - Large
- `.spectrum-ActionButton--sizeXL` - Extra large

**Guidelines:**
- Medium is default and most common
- Match size to context (toolbar, panel, etc.)
- Use consistent sizing within action groups
- Extra small useful for very dense interfaces

**Size-specific custom properties:**
```css
--spectrum-actionbutton-height
--spectrum-actionbutton-icon-size
--spectrum-actionbutton-edge-to-visual
--spectrum-actionbutton-padding-label-to-icon
--spectrum-actionbutton-font-size
```

## Static colors

Action buttons support static colors for use on colored backgrounds.

**CSS classes:**
- `.spectrum-ActionButton--staticWhite` - For dark backgrounds
- `.spectrum-ActionButton--staticBlack` - For light backgrounds

**Guidelines:**
- Use when background color is not theme-controlled
- Works with both standard and quiet variants
- Selected state color controlled via custom property

**Custom property for selected state:**
```css
--mod-actionbutton-content-color-default
```

**Example:**
```html
<div style="background: #0D66D0; padding: 20px;">
  <button class="spectrum-ActionButton spectrum-ActionButton--staticWhite">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-ActionButton-label">Edit</span>
  </button>
</div>
```

## Selection behavior

Action buttons can act as toggle buttons.

**CSS class:**
- `.is-selected`

**ARIA attribute:**
- `aria-pressed="true"` (for toggle buttons)

**Guidelines:**
- Use for toggleable states (Bold, Italic, view modes)
- Selected state clearly visible
- Works with emphasized for accent color
- Can combine multiple selected in action group

**Example:**
```html
<!-- Unselected -->
<button class="spectrum-ActionButton" aria-pressed="false">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Bold</span>
</button>

<!-- Selected -->
<button class="spectrum-ActionButton is-selected" aria-pressed="true">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Bold</span>
</button>

<!-- Selected and emphasized -->
<button class="spectrum-ActionButton spectrum-ActionButton--emphasized is-selected" aria-pressed="true">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Bold</span>
</button>
```

## Popup indication

When action button triggers a popup, indicate with appropriate ARIA attribute.

**ARIA attribute:**
- `aria-haspopup="true"` (generic popup)
- `aria-haspopup="menu"` (menu popup)
- `aria-haspopup="dialog"` (dialog popup)
- `aria-haspopup="listbox"` (listbox popup)

**Example:**
```html
<button
  class="spectrum-ActionButton"
  aria-haspopup="menu"
  aria-expanded="false"
>
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">More Actions</span>
</button>
```

## Action groups

Action buttons are commonly used in groups.

**CSS classes:**
- `.spectrum-ActionGroup`
- `.spectrum-ActionGroup--compact` (reduced spacing)
- `.spectrum-ActionGroup--vertical` (stacked layout)
- `.spectrum-ActionGroup--justified` (equal width items)

### Horizontal action group
```html
<div class="spectrum-ActionGroup">
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton is-selected">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
</div>
```

### Vertical action group
```html
<div class="spectrum-ActionGroup spectrum-ActionGroup--vertical">
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-ActionButton-label">Option 1</span>
  </button>
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-ActionButton-label">Option 2</span>
  </button>
</div>
```

### Compact action group
```html
<div class="spectrum-ActionGroup spectrum-ActionGroup--compact">
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
</div>
```

## Common use cases

### Toolbar actions
```html
<div class="toolbar">
  <div class="spectrum-ActionGroup spectrum-ActionGroup--compact">
    <button class="spectrum-ActionButton spectrum-ActionButton--quiet" title="Undo">
      <svg class="spectrum-Icon"><!-- undo icon --></svg>
    </button>
    <button class="spectrum-ActionButton spectrum-ActionButton--quiet" title="Redo">
      <svg class="spectrum-Icon"><!-- redo icon --></svg>
    </button>
  </div>
  <div class="spectrum-ActionGroup spectrum-ActionGroup--compact">
    <button class="spectrum-ActionButton spectrum-ActionButton--emphasized spectrum-ActionButton--quiet"
            aria-pressed="false" title="Bold">
      <svg class="spectrum-Icon"><!-- bold icon --></svg>
    </button>
    <button class="spectrum-ActionButton spectrum-ActionButton--emphasized spectrum-ActionButton--quiet"
            aria-pressed="false" title="Italic">
      <svg class="spectrum-Icon"><!-- italic icon --></svg>
    </button>
  </div>
</div>
```

### View switcher
```html
<div class="spectrum-ActionGroup" role="radiogroup" aria-label="View mode">
  <button class="spectrum-ActionButton spectrum-ActionButton--emphasized is-selected"
          role="radio" aria-checked="true" title="Grid view">
    <svg class="spectrum-Icon"><!-- grid icon --></svg>
  </button>
  <button class="spectrum-ActionButton spectrum-ActionButton--emphasized"
          role="radio" aria-checked="false" title="List view">
    <svg class="spectrum-Icon"><!-- list icon --></svg>
  </button>
</div>
```

### Action menu trigger
```html
<button
  class="spectrum-ActionButton"
  aria-haspopup="menu"
  aria-expanded="false"
>
  <svg class="spectrum-Icon"><!-- more icon --></svg>
  <span class="spectrum-ActionButton-label">More Actions</span>
</button>
```

### Card actions
```html
<div class="card-actions">
  <button class="spectrum-ActionButton spectrum-ActionButton--quiet">
    <svg class="spectrum-Icon"><!-- edit icon --></svg>
    <span class="spectrum-ActionButton-label">Edit</span>
  </button>
  <button class="spectrum-ActionButton spectrum-ActionButton--quiet">
    <svg class="spectrum-Icon"><!-- delete icon --></svg>
    <span class="spectrum-ActionButton-label">Delete</span>
  </button>
</div>
```

## Accessibility

- Use semantic `<button>` element
- Include descriptive label (visible or via `aria-label`)
- Use `aria-pressed` for toggle buttons
- Use `aria-haspopup` when triggering popups
- Use `aria-expanded` to indicate popup state
- Ensure adequate touch target size (minimum 44x44px)
- Provide tooltips for icon-only buttons
- Use appropriate `role` in action groups (`radiogroup` for single-select)
- Maintain clear focus indicators
- Test with keyboard navigation and screen readers

## Best practices

### When to use action buttons vs. regular buttons
**Action buttons:**
- Toolbar actions
- Icon-focused controls
- Toggleable states
- Action groups
- Quiet actions in dense layouts

**Regular buttons:**
- Primary calls-to-action
- Form submissions
- Dialog actions
- Emphasized actions needing full button treatment

### Icon selection
- Use workflow icons (18px size intended)
- Choose universally recognized icons
- Don't use decorative icons
- Maintain consistency across similar actions
- Test icon recognition with users

### Grouping and spacing
- Group related actions together
- Use compact groups in tight spaces
- Separate action groups with dividers when needed
- Maintain consistent sizing within groups

### Selection states
- Make selection clearly visible
- Use emphasized for important toggles
- Consider quiet emphasized for subtle selection
- Don't mix too many selected states in one group

## Related patterns

- [Button patterns](./button-patterns.md)
- [Selection patterns](./selection-patterns.md)
- [State patterns](./state-patterns.md)
- [Static color patterns](./static-color-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
