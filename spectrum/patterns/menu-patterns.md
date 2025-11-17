# Menu patterns

Menus are used for creating lists of actions, options, or selections. They often appear in popovers and can include various elements such as menu items, dividers, and headers.

## Menu item anatomy

A complete menu item can include:
- Icon (optional)
- Label (required)
- Description (optional)
- Value/keyboard shortcut (optional)
- Checkmark or switch for selection
- Drill-in chevron for submenus

**CSS classes:**
- `.spectrum-Menu`
- `.spectrum-Menu-item`
- `.spectrum-Menu-itemLabel`
- `.spectrum-Menu-description`
- `.spectrum-Menu-value`

**Custom properties:**
```css
--spectrum-menu-item-background-color-default
--spectrum-menu-item-background-color-hover
--spectrum-menu-item-background-color-focus
--spectrum-menu-item-background-color-selected
--spectrum-menu-item-color-default
--spectrum-menu-item-color-hover
--spectrum-menu-item-color-selected
```

## Selection modes

### No selection (default)
Menu items perform actions on press without persistent selection state.

**CSS classes:**
- No additional classes needed
- `role="listbox"` on menu
- `role="option"` on items (or `role="menuitem"`)

**Guidelines:**
- Use for action menus
- Each item triggers an immediate action
- No visual selection indicator needed

### Single selection
Only one menu item can be selected at a time. Shows a checkmark next to the selected item.

**CSS classes:**
- `.is-selected` on the selected menu item

**ARIA attributes:**
- `aria-selected="true"` on selected item
- `role="listbox"` on menu
- `role="option"` on items

**Guidelines:**
- Use for mutually exclusive options
- One item should typically be selected
- Checkmark appears in the start position

**Custom properties:**
```css
--spectrum-menu-item-checkmark-color
```

### Multiple selection
Multiple menu items can be selected. Shows checkboxes or switches next to items.

**CSS classes:**
- `.is-selected` on selected items
- `.spectrum-Menu-checkmark` for checkbox indicator

**For switches (hasActions pattern):**
- Include `.spectrum-Switch` component

**Guidelines:**
- Use when multiple options can be active simultaneously
- Consider switches for settings-style menus
- Consider checkboxes for item selection

## Submenu patterns

### Drill-in submenu
A chevron indicates a submenu is available. Common in desktop contexts.

**CSS classes:**
- `.spectrum-Menu-chevron` on the chevron icon element

**Guidelines:**
- Chevron appears at the end of the menu item
- Submenu typically opens to the side in a new popover
- Can also be used with collapsible pattern

### Tray submenu
Used when menu is displayed in a tray (mobile contexts). Submenu replaces tray content.

**CSS classes:**
- `.spectrum-Menu--traySubmenu`
- `.spectrum-Menu-back` for back button

**Guidelines:**
- Back button shows parent menu item label
- Submenu takes over the full tray space
- Back arrow sizes scale with menu size (s:200, m:300, l:400, xl:500)

**Structure:**
```html
<div role="listbox" class="spectrum-Menu spectrum-Menu--traySubmenu">
  <div class="spectrum-Menu-back">
    <svg class="spectrum-Icon"><!-- back arrow --></svg>
    <span class="spectrum-Menu-backLabel">Parent Menu Item</span>
  </div>
  <!-- submenu items -->
</div>
```

### Collapsible submenu
Displays submenus in a nested, collapsed format within the parent menu.

**CSS classes:**
- `.spectrum-Menu-collapsible`
- `.is-open` when expanded

**Guidelines:**
- Use for both popover and tray containers
- Prevents scrolling issues in trays by setting fixed height
- Items expand/collapse in place

## Menu sections

### Dividers
Visual separators between groups of related menu items.

**CSS classes:**
- `.spectrum-Menu-divider`

**HTML structure:**
```html
<li role="separator" class="spectrum-Menu-divider"></li>
```

**Guidelines:**
- Use to separate logical groups of actions
- Appears between menu sections
- No additional spacing needed (handled by component)

### Section headers
Descriptive labels for menu sections.

**CSS classes:**
- `.spectrum-Menu-sectionHeading`

**HTML structure:**
```html
<li role="presentation" class="spectrum-Menu-sectionHeading" id="section-id">
  Section Title
</li>
```

**Guidelines:**
- Use when sections differ in functionality
- Reference via `aria-labelledby` on menu items
- Headers can wrap when text is long

## Sizing

Menus come in four sizes that should correspond to the size of their trigger component.

**Size classes:**
- `.spectrum-Menu--sizeS`
- `.spectrum-Menu--sizeM` (default)
- `.spectrum-Menu--sizeL`
- `.spectrum-Menu--sizeXL`

**Guidelines:**
- Match menu size to trigger button size
- Match internal components (switches, icons) to same size
- Consistent sizing creates visual harmony

**Size-specific custom properties:**
```css
--spectrum-menu-item-height
--spectrum-menu-item-font-size
--spectrum-menu-icon-size
```

## Text overflow

### Default wrapping
Menu item labels and descriptions wrap to multiple lines when needed.

**Guidelines:**
- Default behavior for all text content
- Descriptions always wrap (no truncation option)
- Maintains readability

### Truncation
Labels and headings can be truncated with ellipsis.

**CSS classes:**
- `.spectrum-Menu-itemLabel--truncate`

**Guidelines:**
- Requires set `inline-size` or `max-inline-size` on menu
- Show full text in tooltip on hover
- Use sparingly; wrapping is often better for accessibility
- Descriptions cannot be truncated

## Menu item states

### Disabled
Shows an option exists but is not currently available.

**CSS classes:**
- `.is-disabled`
- `[aria-disabled="true"]`

**Custom properties:**
```css
--spectrum-menu-item-color-disabled
--spectrum-menu-item-background-color-disabled
```

### Focused
Shows keyboard focus or hover state.

**CSS classes:**
- `.is-focused` (for documentation/examples)
- Automatically styled via `:focus` and `:hover`

### Active
Shows pressed state.

**CSS classes:**
- `.is-active` (for documentation/examples)
- Automatically styled via `:active`

## Common patterns

### Action menu
```html
<div role="listbox" class="spectrum-Menu">
  <div role="option" class="spectrum-Menu-item">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-Menu-itemLabel">Edit</span>
  </div>
  <div role="option" class="spectrum-Menu-item">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-Menu-itemLabel">Copy</span>
  </div>
  <div role="option" class="spectrum-Menu-item">
    <svg class="spectrum-Icon"><!-- icon --></svg>
    <span class="spectrum-Menu-itemLabel">Delete</span>
  </div>
</div>
```

### Selection menu with sections
```html
<div role="listbox" class="spectrum-Menu">
  <div role="presentation" class="spectrum-Menu-sectionHeading" id="tools-heading">
    Tools
  </div>
  <div role="option" class="spectrum-Menu-item is-selected" aria-labelledby="tools-heading">
    <span class="spectrum-Menu-checkmark">
      <svg class="spectrum-Icon"><!-- checkmark --></svg>
    </span>
    <span class="spectrum-Menu-itemLabel">Marquee</span>
  </div>
  <!-- more items -->
  <li role="separator" class="spectrum-Menu-divider"></li>
  <!-- next section -->
</div>
```

### Menu with values and descriptions
```html
<div role="option" class="spectrum-Menu-item">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-Menu-itemLabel">
    <div class="spectrum-Menu-itemLabel-text">Copy</div>
    <div class="spectrum-Menu-description">Copy to clipboard</div>
  </span>
  <span class="spectrum-Menu-value">⌘ C</span>
</div>
```

## Accessibility

- Use appropriate ARIA roles (`listbox`/`option` or `menu`/`menuitem`)
- Implement keyboard navigation (arrow keys, Enter, Escape)
- Announce selection state with `aria-selected`
- Use `aria-disabled` for disabled items
- Connect sections with `aria-labelledby`
- Provide focus indicators
- Ensure sufficient color contrast
- Make sure menu items are easily clickable (adequate height)

## Related patterns

- [Selection patterns](./selection-patterns.md)
- [Overlay patterns](./overlay-patterns.md)
- [Text overflow patterns](./text-overflow-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
- [State patterns](./state-patterns.md)
