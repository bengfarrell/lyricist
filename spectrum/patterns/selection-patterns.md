# Selection patterns

Selection patterns define how users choose one or more items from a set of options. Spectrum CSS provides various components and patterns for different selection scenarios.

## Selection modes

### No selection (actions only)
Items trigger immediate actions without persistent selection state.

**Use cases:**
- Action menus (Edit, Copy, Delete)
- Navigation menus
- Command buttons
- One-off actions

**ARIA roles:**
- `role="menu"` with `role="menuitem"`
- `role="listbox"` with `role="option"` (for non-menu contexts)

**Guidelines:**
- No selection indicator needed
- Focus and hover states only
- Each item performs an action immediately
- No persistent visual state after action

### Single selection
Only one item can be selected at a time; selecting a new item deselects the previous.

**Use cases:**
- Radio button groups
- Single-select menus
- Tab groups
- Mutually exclusive options
- Filter selections where only one can apply

**Visual indicators:**
- **Radio buttons:** Filled circle
- **Menu items:** Checkmark icon
- **Tabs:** Underline or background highlight
- **Pickers:** Selected item shows in button/field

**CSS classes:**
- `.is-selected` on the selected item

**ARIA attributes:**
- `role="radiogroup"` for radio buttons
- `role="listbox"` with `aria-selected="true"` for menus
- `aria-checked="true"` for radio buttons

**Guidelines:**
- One item typically selected at all times (optional in some cases)
- Clear visual distinction between selected and unselected
- Clicking another item deselects current selection
- Provide default selection when appropriate

### Multiple selection
Multiple items can be selected simultaneously.

**Use cases:**
- Checkbox groups
- Multi-select menus
- Item lists where multiple can be chosen
- Feature toggles
- Filter selections where multiple can apply

**Visual indicators:**
- **Checkboxes:** Checkmark in box
- **Menu items with checkboxes:** Checkbox before label
- **Menu items with switches:** Switch component

**CSS classes:**
- `.is-selected` or `.is-checked` on selected items

**ARIA attributes:**
- `role="group"` for checkbox groups
- `role="listbox"` with `aria-multiselectable="true"` and `aria-selected="true"`
- `aria-checked="true"` for checkboxes

**Guidelines:**
- Zero or more items can be selected
- Each item toggles independently
- Clear indication of which items are selected
- Consider "select all" / "deselect all" for large lists

## Selection indicators

### Checkmark (single selection)
Standard indicator for single-select menus and lists.

**CSS structure:**
```html
<div class="spectrum-Menu-item is-selected">
  <span class="spectrum-Menu-checkmark">
    <svg class="spectrum-Icon spectrum-Icon--sizeM">
      <use xlink:href="#spectrum-icon-Checkmark" />
    </svg>
  </span>
  <span class="spectrum-Menu-itemLabel">Selected item</span>
</div>
```

**Custom properties:**
```css
--spectrum-menu-item-checkmark-color
--spectrum-menu-item-checkmark-size
```

**Guidelines:**
- Appears in start position (before label)
- Only visible on selected items
- Size scales with menu size
- Uses Checkmark icon from icon set

### Checkbox (multiple selection)
Shows selection state for each item independently.

**CSS structure:**
```html
<label class="spectrum-Checkbox">
  <input type="checkbox" class="spectrum-Checkbox-input" checked>
  <span class="spectrum-Checkbox-box">
    <svg class="spectrum-Icon spectrum-Icon--sizeM">
      <use xlink:href="#spectrum-icon-Checkmark" />
    </svg>
  </span>
  <span class="spectrum-Checkbox-label">Option label</span>
</label>
```

**States:**
- **Unchecked:** Empty box
- **Checked:** Checkmark in box
- **Indeterminate:** Dash in box (for partial selection)

**Custom properties:**
```css
--spectrum-checkbox-control-color-default
--spectrum-checkbox-control-color-hover
--spectrum-checkbox-control-color-selected
```

### Switch (multiple selection with actions)
Alternative to checkboxes in menus, emphasizes on/off state.

**Use cases:**
- Settings menus
- Feature toggles
- Menu items representing states rather than selections

**CSS structure:**
```html
<div class="spectrum-Menu-item">
  <span class="spectrum-Menu-itemLabel">
    <span class="spectrum-Menu-itemLabel-text">Show rulers</span>
  </span>
  <label class="spectrum-Switch">
    <input type="checkbox" class="spectrum-Switch-input" checked>
    <span class="spectrum-Switch-switch"></span>
  </label>
</div>
```

**Guidelines:**
- Size of switch should match menu size
- Appears in end position (after label)
- Better for settings/preferences than selections
- Provides stronger "on/off" metaphor than checkbox

### Radio button (single selection)
Visual indicator for mutually exclusive options.

**CSS structure:**
```html
<label class="spectrum-Radio">
  <input type="radio" class="spectrum-Radio-input" name="group" checked>
  <span class="spectrum-Radio-button"></span>
  <span class="spectrum-Radio-label">Option label</span>
</label>
```

**Custom properties:**
```css
--spectrum-radio-button-control-color-default
--spectrum-radio-button-control-color-selected
```

**Guidelines:**
- All radio buttons in group share same `name` attribute
- Only one can be selected at a time
- Typically used in forms rather than menus
- Selecting one automatically deselects others

## Selection in specific components

### Menu selection

**No selection:**
```html
<div role="menu" class="spectrum-Menu">
  <div role="menuitem" class="spectrum-Menu-item">Edit</div>
  <div role="menuitem" class="spectrum-Menu-item">Copy</div>
  <div role="menuitem" class="spectrum-Menu-item">Delete</div>
</div>
```

**Single selection:**
```html
<div role="listbox" class="spectrum-Menu">
  <div role="option" class="spectrum-Menu-item is-selected" aria-selected="true">
    <span class="spectrum-Menu-checkmark">
      <svg class="spectrum-Icon"><!-- checkmark --></svg>
    </span>
    <span class="spectrum-Menu-itemLabel">Option 1</span>
  </div>
  <div role="option" class="spectrum-Menu-item" aria-selected="false">
    <span class="spectrum-Menu-itemLabel">Option 2</span>
  </div>
</div>
```

**Multiple selection with checkboxes:**
```html
<div role="listbox" class="spectrum-Menu" aria-multiselectable="true">
  <div role="option" class="spectrum-Menu-item is-selected" aria-selected="true">
    <span class="spectrum-Menu-checkmark">
      <svg class="spectrum-Icon"><!-- checkbox checked --></svg>
    </span>
    <span class="spectrum-Menu-itemLabel">Option 1</span>
  </div>
  <div role="option" class="spectrum-Menu-item" aria-selected="false">
    <span class="spectrum-Menu-checkmark">
      <svg class="spectrum-Icon"><!-- checkbox unchecked --></svg>
    </span>
    <span class="spectrum-Menu-itemLabel">Option 2</span>
  </div>
</div>
```

**Multiple selection with switches:**
```html
<div role="listbox" class="spectrum-Menu" aria-multiselectable="true">
  <div role="option" class="spectrum-Menu-item" aria-selected="true">
    <span class="spectrum-Menu-itemLabel">Show grid</span>
    <label class="spectrum-Switch">
      <input type="checkbox" class="spectrum-Switch-input" checked>
      <span class="spectrum-Switch-switch"></span>
    </label>
  </div>
</div>
```

### Action button selection

Action buttons can act as toggle buttons:

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
```

**Guidelines:**
- Use `.is-selected` class for selected state
- Add `aria-pressed` for toggle buttons
- Selected state typically uses accent color or prominent background

### Action group selection

Groups of action buttons with selection behavior:

**Single selection:**
```html
<div class="spectrum-ActionGroup" role="radiogroup">
  <button class="spectrum-ActionButton" role="radio" aria-checked="false">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton is-selected" role="radio" aria-checked="true">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton" role="radio" aria-checked="false">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
</div>
```

**Multiple selection:**
```html
<div class="spectrum-ActionGroup">
  <button class="spectrum-ActionButton is-selected" aria-pressed="true">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton" aria-pressed="false">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
  <button class="spectrum-ActionButton is-selected" aria-pressed="true">
    <svg class="spectrum-Icon"><!-- icon --></svg>
  </button>
</div>
```

### Tabs selection

Tabs always use single selection:

```html
<div class="spectrum-Tabs" role="tablist">
  <div class="spectrum-Tabs-item" role="tab" aria-selected="false" tabindex="-1">
    <span class="spectrum-Tabs-itemLabel">Tab 1</span>
  </div>
  <div class="spectrum-Tabs-item is-selected" role="tab" aria-selected="true" tabindex="0">
    <span class="spectrum-Tabs-itemLabel">Tab 2</span>
  </div>
  <div class="spectrum-Tabs-item" role="tab" aria-selected="false" tabindex="-1">
    <span class="spectrum-Tabs-itemLabel">Tab 3</span>
  </div>
  <div class="spectrum-Tabs-selectionIndicator"></div>
</div>
```

**Guidelines:**
- Exactly one tab is always selected
- Selection indicator (underline) animates between tabs
- Selected tab has `tabindex="0"`, others have `tabindex="-1"`

## Keyboard interaction

### Single selection lists/menus
- **Arrow Up/Down:** Move focus between items
- **Enter/Space:** Select focused item
- **Home/End:** Move to first/last item

### Multiple selection lists/menus
- **Arrow Up/Down:** Move focus between items
- **Space:** Toggle selection of focused item
- **Ctrl+A:** Select all (when supported)
- **Shift+Arrow:** Extend selection (when supported)

### Radio button groups
- **Arrow keys:** Move selection to next/previous option
- **Tab:** Enter/exit radio group

### Checkbox groups
- **Tab:** Move between checkboxes
- **Space:** Toggle focused checkbox

### Tab lists
- **Arrow Left/Right:** Move selection (automatic) or focus (manual)
- **Home/End:** First/last tab
- **Enter/Space:** Select focused tab (if manual activation)

## Accessibility

### ARIA attributes

**For single selection:**
- `role="radiogroup"` (radio buttons)
- `role="listbox"` (menus/lists)
- `role="tablist"` (tabs)
- `aria-selected="true"` on selected item
- `aria-checked="true"` for radio buttons

**For multiple selection:**
- `role="group"` (checkboxes)
- `role="listbox"` with `aria-multiselectable="true"` (menus/lists)
- `aria-selected="true"` on selected items
- `aria-checked="true"` for checkboxes

### Focus management
- Maintain roving tabindex for lists (only one focusable item)
- Selected item typically receives focus when entering group
- Ensure keyboard users can reach and operate all selections

### Screen reader announcements
- State changes should be announced
- Include selection count for multi-select ("3 of 10 items selected")
- Use `aria-live` regions for dynamic updates when appropriate

### Visual indicators
- Don't rely solely on color to show selection
- Use shape, icon, or position changes
- Ensure sufficient contrast for all states
- Provide clear focus indicators

## Best practices

### Choosing selection mode
- **No selection:** Actions that complete immediately
- **Single selection:** Mutually exclusive options, one must/should be chosen
- **Multiple selection:** Independent options, any combination valid

### Visual clarity
- Make selection state obviously different from default
- Maintain consistency across similar components
- Use established patterns (checkmarks, checkboxes, etc.)
- Test in various color themes and High Contrast Mode

### Performance
- For large lists, consider virtual scrolling
- Debounce selection handlers when appropriate
- Don't block UI for selection actions

### User feedback
- Provide immediate visual feedback on selection
- Consider bulk actions for multi-select lists
- Show selection count when multiple items selected
- Allow easy deselection

## Common patterns

### Settings menu (switches)
```html
<div class="spectrum-Menu" role="listbox" aria-multiselectable="true">
  <div class="spectrum-Menu-item" role="option">
    <span class="spectrum-Menu-itemLabel">Snap to grid</span>
    <label class="spectrum-Switch">
      <input type="checkbox" class="spectrum-Switch-input" checked>
      <span class="spectrum-Switch-switch"></span>
    </label>
  </div>
  <div class="spectrum-Menu-item" role="option">
    <span class="spectrum-Menu-itemLabel">Show rulers</span>
    <label class="spectrum-Switch">
      <input type="checkbox" class="spectrum-Switch-input">
      <span class="spectrum-Switch-switch"></span>
    </label>
  </div>
</div>
```

### Filter options (checkboxes)
```html
<fieldset class="spectrum-Fieldset">
  <legend class="spectrum-FieldLabel">Filter by category</legend>
  <label class="spectrum-Checkbox">
    <input type="checkbox" class="spectrum-Checkbox-input" checked>
    <span class="spectrum-Checkbox-box">
      <svg class="spectrum-Icon"><!-- checkmark --></svg>
    </span>
    <span class="spectrum-Checkbox-label">Documents</span>
  </label>
  <label class="spectrum-Checkbox">
    <input type="checkbox" class="spectrum-Checkbox-input" checked>
    <span class="spectrum-Checkbox-box">
      <svg class="spectrum-Icon"><!-- checkmark --></svg>
    </span>
    <span class="spectrum-Checkbox-label">Images</span>
  </label>
  <label class="spectrum-Checkbox">
    <input type="checkbox" class="spectrum-Checkbox-input">
    <span class="spectrum-Checkbox-box">
      <svg class="spectrum-Icon"><!-- checkmark --></svg>
    </span>
    <span class="spectrum-Checkbox-label">Videos</span>
  </label>
</fieldset>
```

### Sort order selector (radio buttons)
```html
<fieldset class="spectrum-Fieldset" role="radiogroup">
  <legend class="spectrum-FieldLabel">Sort by</legend>
  <label class="spectrum-Radio">
    <input type="radio" class="spectrum-Radio-input" name="sort" value="name" checked>
    <span class="spectrum-Radio-button"></span>
    <span class="spectrum-Radio-label">Name</span>
  </label>
  <label class="spectrum-Radio">
    <input type="radio" class="spectrum-Radio-input" name="sort" value="date">
    <span class="spectrum-Radio-button"></span>
    <span class="spectrum-Radio-label">Date modified</span>
  </label>
  <label class="spectrum-Radio">
    <input type="radio" class="spectrum-Radio-input" name="sort" value="size">
    <span class="spectrum-Radio-button"></span>
    <span class="spectrum-Radio-label">File size</span>
  </label>
</fieldset>
```

## Related patterns

- [Menu patterns](./menu-patterns.md)
- [State patterns](./state-patterns.md)
- [Form patterns](./form-patterns.md)
