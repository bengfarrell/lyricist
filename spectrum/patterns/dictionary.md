# Spectrum Pattern Dictionary

A comprehensive reference of Spectrum CSS UI patterns with assigned shortcodes for use with `data-spectrum-pattern` attributes.

## Usage

```html
<button class="spectrum-Button spectrum-Button--accent" data-spectrum-pattern="button-accent">
  Save
</button>
```

---

## Button Patterns

### Button Variants
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Accent button (fill) | `button-accent` | `.spectrum-Button .spectrum-Button--accent .spectrum-Button--fill` |
| Accent button (outline) | `button-accent-outline` | `.spectrum-Button .spectrum-Button--accent .spectrum-Button--outline` |
| Primary button (fill) | `button-primary` | `.spectrum-Button .spectrum-Button--primary .spectrum-Button--fill` |
| Primary button (outline) | `button-primary-outline` | `.spectrum-Button .spectrum-Button--primary .spectrum-Button--outline` |
| Secondary button (fill) | `button-secondary` | `.spectrum-Button .spectrum-Button--secondary .spectrum-Button--fill` |
| Secondary button (outline) | `button-secondary-outline` | `.spectrum-Button .spectrum-Button--secondary .spectrum-Button--outline` |
| Negative button | `button-negative` | `.spectrum-Button .spectrum-Button--negative` |

### Button Sizes
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Small button | `button-s` | `.spectrum-Button .spectrum-Button--sizeS` |
| Medium button | `button-m` | `.spectrum-Button` |
| Large button | `button-l` | `.spectrum-Button .spectrum-Button--sizeL` |
| Extra large button | `button-xl` | `.spectrum-Button .spectrum-Button--sizeXL` |

### Button States
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Pending button | `button-pending` | `.spectrum-Button .is-pending [disabled]` |
| Disabled button | `button-disabled` | `.spectrum-Button [disabled]` |

### Button Modifiers
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| No-wrap button | `button-nowrap` | `.spectrum-Button .spectrum-Button--noWrap` |
| Static white button | `button-static-white` | `.spectrum-Button .spectrum-Button--staticWhite` |
| Static black button | `button-static-black` | `.spectrum-Button .spectrum-Button--staticBlack` |

---

## Action Button Patterns

### Action Button Variants
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Standard action button | `action-button-standard` | `.spectrum-ActionButton` |
| Quiet action button | `action-button-quiet` | `.spectrum-ActionButton .spectrum-ActionButton--quiet` |
| Emphasized action button | `action-button-emphasized` | `.spectrum-ActionButton .spectrum-ActionButton--emphasized` |
| Emphasized quiet action button | `action-button-emphasized-quiet` | `.spectrum-ActionButton .spectrum-ActionButton--emphasized .spectrum-ActionButton--quiet` |

### Action Button Sizes
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Extra small action button | `action-button-xs` | `.spectrum-ActionButton .spectrum-ActionButton--sizeXS` |
| Small action button | `action-button-s` | `.spectrum-ActionButton .spectrum-ActionButton--sizeS` |
| Medium action button | `action-button-m` | `.spectrum-ActionButton` |
| Large action button | `action-button-l` | `.spectrum-ActionButton .spectrum-ActionButton--sizeL` |
| Extra large action button | `action-button-xl` | `.spectrum-ActionButton .spectrum-ActionButton--sizeXL` |

### Action Button States
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Selected action button | `action-button-selected` | `.spectrum-ActionButton .is-selected` |
| Disabled action button | `action-button-disabled` | `.spectrum-ActionButton [disabled]` |

### Action Button Modifiers
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Static white action button | `action-button-static-white` | `.spectrum-ActionButton .spectrum-ActionButton--staticWhite` |
| Static black action button | `action-button-static-black` | `.spectrum-ActionButton .spectrum-ActionButton--staticBlack` |

---

## Action Group Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Horizontal action group | `action-group-horizontal` | `.spectrum-ActionGroup` |
| Vertical action group | `action-group-vertical` | `.spectrum-ActionGroup .spectrum-ActionGroup--vertical` |
| Compact action group | `action-group-compact` | `.spectrum-ActionGroup .spectrum-ActionGroup--compact` |
| Justified action group | `action-group-justified` | `.spectrum-ActionGroup .spectrum-ActionGroup--justified` |

---

## Form Patterns

### Form Layouts
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Form container | `form-container` | `.spectrum-Form` |
| Top label form | `form-label-top` | `.spectrum-Form .spectrum-Form--labelPositionTop` |
| Side label form | `form-label-side` | `.spectrum-Form .spectrum-Form--labelPositionSide` |
| Form item | `form-item` | `.spectrum-Form-item` |

### Field Labels
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Field label | `field-label` | `.spectrum-FieldLabel` |
| Field label small | `field-label-s` | `.spectrum-FieldLabel .spectrum-FieldLabel--sizeS` |
| Field label medium | `field-label-m` | `.spectrum-FieldLabel .spectrum-FieldLabel--sizeM` |
| Field label large | `field-label-l` | `.spectrum-FieldLabel .spectrum-FieldLabel--sizeL` |
| Field label extra large | `field-label-xl` | `.spectrum-FieldLabel .spectrum-FieldLabel--sizeXL` |
| Left-aligned field label | `field-label-left` | `.spectrum-FieldLabel .spectrum-FieldLabel--left` |
| Right-aligned field label | `field-label-right` | `.spectrum-FieldLabel .spectrum-FieldLabel--right` |
| Disabled field label | `field-label-disabled` | `.spectrum-FieldLabel .is-disabled` |

### Text Fields
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Text field | `textfield` | `.spectrum-Textfield` |
| Text field small | `textfield-s` | `.spectrum-Textfield .spectrum-Textfield--sizeS` |
| Text field medium | `textfield-m` | `.spectrum-Textfield .spectrum-Textfield--sizeM` |
| Text field large | `textfield-l` | `.spectrum-Textfield .spectrum-Textfield--sizeL` |
| Text field extra large | `textfield-xl` | `.spectrum-Textfield .spectrum-Textfield--sizeXL` |
| Invalid text field | `textfield-invalid` | `.spectrum-Textfield .is-invalid` |
| Valid text field | `textfield-valid` | `.spectrum-Textfield .is-valid` |
| Disabled text field | `textfield-disabled` | `.spectrum-Textfield [disabled]` |
| Readonly text field | `textfield-readonly` | `.spectrum-Textfield [readonly]` |

### Help Text
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Help text | `help-text` | `.spectrum-HelpText` |
| Help text small | `help-text-s` | `.spectrum-HelpText .spectrum-HelpText--sizeS` |
| Help text medium | `help-text-m` | `.spectrum-HelpText .spectrum-HelpText--sizeM` |
| Help text large | `help-text-l` | `.spectrum-HelpText .spectrum-HelpText--sizeL` |
| Help text extra large | `help-text-xl` | `.spectrum-HelpText .spectrum-HelpText--sizeXL` |
| Negative help text | `help-text-negative` | `.spectrum-HelpText .spectrum-HelpText--negative` |

### Field Groups
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Horizontal field group | `field-group-horizontal` | `.spectrum-FieldGroup .spectrum-FieldGroup--horizontal` |
| Vertical field group | `field-group-vertical` | `.spectrum-FieldGroup .spectrum-FieldGroup--vertical` |

---

## Overlay Patterns

### Modal
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Modal | `modal` | `.spectrum-Modal` |
| Open modal | `modal-open` | `.spectrum-Modal .is-open` |
| Responsive modal | `modal-responsive` | `.spectrum-Modal .spectrum-Modal--responsive` |
| Fullscreen modal | `modal-fullscreen` | `.spectrum-Modal .spectrum-Modal--fullscreen` |
| Fullscreen takeover modal | `modal-fullscreen-takeover` | `.spectrum-Modal .spectrum-Modal--fullscreenTakeover` |

### Dialog
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Dialog | `dialog` | `.spectrum-Dialog` |
| Dialog small | `dialog-s` | `.spectrum-Dialog .spectrum-Dialog--sizeS` |
| Dialog medium | `dialog-m` | `.spectrum-Dialog .spectrum-Dialog--sizeM` |
| Dialog large | `dialog-l` | `.spectrum-Dialog .spectrum-Dialog--sizeL` |
| Fullscreen dialog | `dialog-fullscreen` | `.spectrum-Dialog .spectrum-Dialog--fullscreen` |
| Fullscreen takeover dialog | `dialog-fullscreen-takeover` | `.spectrum-Dialog .spectrum-Dialog--fullscreenTakeover` |
| Dialog heading | `dialog-heading` | `.spectrum-Dialog-heading` |
| Dialog content | `dialog-content` | `.spectrum-Dialog-content` |
| Dialog footer | `dialog-footer` | `.spectrum-Dialog-footer` |
| Dialog close button | `dialog-close` | `.spectrum-Dialog-closeButton` |

### Alert Dialog
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Alert dialog | `alert-dialog` | `.spectrum-AlertDialog` |
| Information alert | `alert-dialog-info` | `.spectrum-AlertDialog .spectrum-AlertDialog--information` |
| Warning alert | `alert-dialog-warning` | `.spectrum-AlertDialog .spectrum-AlertDialog--warning` |
| Error alert | `alert-dialog-error` | `.spectrum-AlertDialog .spectrum-AlertDialog--error` |

### Popover
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Popover | `popover` | `.spectrum-Popover` |
| Open popover | `popover-open` | `.spectrum-Popover .is-open` |
| Popover with tip | `popover-with-tip` | `.spectrum-Popover .spectrum-Popover--withTip` |

### Popover Positions
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Top popover | `popover-top` | `.spectrum-Popover .spectrum-Popover--top` |
| Top-left popover | `popover-top-left` | `.spectrum-Popover .spectrum-Popover--top-left` |
| Top-right popover | `popover-top-right` | `.spectrum-Popover .spectrum-Popover--top-right` |
| Top-start popover | `popover-top-start` | `.spectrum-Popover .spectrum-Popover--top-start` |
| Top-end popover | `popover-top-end` | `.spectrum-Popover .spectrum-Popover--top-end` |
| Bottom popover | `popover-bottom` | `.spectrum-Popover .spectrum-Popover--bottom` |
| Bottom-left popover | `popover-bottom-left` | `.spectrum-Popover .spectrum-Popover--bottom-left` |
| Bottom-right popover | `popover-bottom-right` | `.spectrum-Popover .spectrum-Popover--bottom-right` |
| Bottom-start popover | `popover-bottom-start` | `.spectrum-Popover .spectrum-Popover--bottom-start` |
| Bottom-end popover | `popover-bottom-end` | `.spectrum-Popover .spectrum-Popover--bottom-end` |
| Left popover | `popover-left` | `.spectrum-Popover .spectrum-Popover--left` |
| Left-top popover | `popover-left-top` | `.spectrum-Popover .spectrum-Popover--left-top` |
| Left-bottom popover | `popover-left-bottom` | `.spectrum-Popover .spectrum-Popover--left-bottom` |
| Right popover | `popover-right` | `.spectrum-Popover .spectrum-Popover--right` |
| Right-top popover | `popover-right-top` | `.spectrum-Popover .spectrum-Popover--right-top` |
| Right-bottom popover | `popover-right-bottom` | `.spectrum-Popover .spectrum-Popover--right-bottom` |
| Start popover | `popover-start` | `.spectrum-Popover .spectrum-Popover--start` |
| Start-top popover | `popover-start-top` | `.spectrum-Popover .spectrum-Popover--start-top` |
| Start-bottom popover | `popover-start-bottom` | `.spectrum-Popover .spectrum-Popover--start-bottom` |
| End popover | `popover-end` | `.spectrum-Popover .spectrum-Popover--end` |
| End-top popover | `popover-end-top` | `.spectrum-Popover .spectrum-Popover--end-top` |
| End-bottom popover | `popover-end-bottom` | `.spectrum-Popover .spectrum-Popover--end-bottom` |

### Tray
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Tray | `tray` | `.spectrum-Tray` |
| Open tray | `tray-open` | `.spectrum-Tray .is-open` |

### Underlay
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Underlay | `underlay` | `.spectrum-Underlay` |
| Open underlay | `underlay-open` | `.spectrum-Underlay .is-open` |

---

## Menu Patterns

### Menu Base
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Menu | `menu` | `.spectrum-Menu` |
| Menu small | `menu-s` | `.spectrum-Menu .spectrum-Menu--sizeS` |
| Menu medium | `menu-m` | `.spectrum-Menu .spectrum-Menu--sizeM` |
| Menu large | `menu-l` | `.spectrum-Menu .spectrum-Menu--sizeL` |
| Menu extra large | `menu-xl` | `.spectrum-Menu .spectrum-Menu--sizeXL` |
| Tray submenu | `menu-tray-submenu` | `.spectrum-Menu .spectrum-Menu--traySubmenu` |

### Menu Items
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Menu item | `menu-item` | `.spectrum-Menu-item` |
| Selected menu item | `menu-item-selected` | `.spectrum-Menu-item .is-selected` |
| Disabled menu item | `menu-item-disabled` | `.spectrum-Menu-item .is-disabled` |
| Focused menu item | `menu-item-focused` | `.spectrum-Menu-item .is-focused` |
| Active menu item | `menu-item-active` | `.spectrum-Menu-item .is-active` |

### Menu Components
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Menu item label | `menu-item-label` | `.spectrum-Menu-itemLabel` |
| Truncated menu item label | `menu-item-label-truncate` | `.spectrum-Menu-itemLabel .spectrum-Menu-itemLabel--truncate` |
| Menu description | `menu-description` | `.spectrum-Menu-description` |
| Menu value | `menu-value` | `.spectrum-Menu-value` |
| Menu checkmark | `menu-checkmark` | `.spectrum-Menu-checkmark` |
| Menu chevron | `menu-chevron` | `.spectrum-Menu-chevron` |
| Menu divider | `menu-divider` | `.spectrum-Menu-divider` |
| Menu section heading | `menu-section-heading` | `.spectrum-Menu-sectionHeading` |
| Menu back button | `menu-back` | `.spectrum-Menu-back` |
| Menu collapsible | `menu-collapsible` | `.spectrum-Menu-collapsible` |
| Open menu collapsible | `menu-collapsible-open` | `.spectrum-Menu-collapsible .is-open` |

---

## Navigation Patterns

### Breadcrumbs
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Breadcrumbs | `breadcrumbs` | `.spectrum-Breadcrumbs` |
| Breadcrumb item | `breadcrumb-item` | `.spectrum-Breadcrumbs-item` |

### Pagination
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Pagination | `pagination` | `.spectrum-Pagination` |

### Side Navigation
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Side nav | `side-nav` | `.spectrum-SideNav` |
| Side nav item | `side-nav-item` | `.spectrum-SideNav-item` |
| Selected side nav item | `side-nav-item-selected` | `.spectrum-SideNav-item .is-selected` |

### Tabs
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Tabs | `tabs` | `.spectrum-Tabs` |
| Tab item | `tab-item` | `.spectrum-Tabs-item` |
| Selected tab | `tab-selected` | `.spectrum-Tabs-item .is-selected` |

---

## State Patterns

### Interactive States
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Hover state | `state-hover` | Applied via `:hover` or `.is-hovered` |
| Focus state | `state-focus` | Applied via `:focus-visible` or `.is-focused` |
| Active state | `state-active` | Applied via `:active` or `.is-active` |
| Disabled state | `state-disabled` | Applied via `[disabled]` or `.is-disabled` |

### Selection States
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Selected state | `state-selected` | Applied via `.is-selected` |
| Checked state | `state-checked` | Applied via `[checked]` or `.is-checked` |
| Indeterminate state | `state-indeterminate` | Applied via `.is-indeterminate` |

### Loading States
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Pending state | `state-pending` | Applied via `.is-pending` |

### Validation States
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Invalid state | `state-invalid` | Applied via `.is-invalid` |
| Valid state | `state-valid` | Applied via `.is-valid` |

### Open/Closed States
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Open state | `state-open` | Applied via `.is-open` |
| Closed state | `state-closed` | Default state (no class) |

### Readonly State
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Readonly state | `state-readonly` | Applied via `[readonly]` or `.is-readonly` |

---

## Sizing Patterns

### Size Scales
| Pattern | Shortcode | Token Value |
|---------|-----------|-------------|
| Extra small size | `size-xs` | 75 scale |
| Small size | `size-s` | 75 scale |
| Medium size | `size-m` | 100 scale (default) |
| Large size | `size-l` | 200 scale |
| Extra large size | `size-xl` | 300 scale |

---

## Static Color Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Static white | `static-white` | `.spectrum-{Component}--staticWhite` |
| Static black | `static-black` | `.spectrum-{Component}--staticBlack` |

---

## Theming Patterns

### Base Theme
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Spectrum base | `theme-spectrum` | `.spectrum` |

### Color Themes
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Light theme | `theme-light` | `.spectrum--light` |
| Dark theme | `theme-dark` | `.spectrum--dark` |

### Scale Themes
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Medium scale | `theme-scale-medium` | `.spectrum--medium` |
| Large scale | `theme-scale-large` | `.spectrum--large` |

### System Variants
| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Express system | `theme-express` | `.spectrum--express` |
| Legacy system | `theme-legacy` | `.spectrum--legacy` (deprecated) |

---

## Text Overflow Patterns

| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Default wrapping | `text-wrap` | Default behavior, text wraps to multiple lines |
| Truncation with ellipsis | `text-truncate` | Text truncated with `...` |
| No wrap | `text-nowrap` | Text doesn't wrap |

---

## Selection Patterns

| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Single selection | `selection-single` | Only one item can be selected |
| Multiple selection | `selection-multiple` | Multiple items can be selected |
| No selection | `selection-none` | Items trigger actions, no persistent selection |

---

## Icon Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Icon | `icon` | `.spectrum-Icon` |
| Icon small | `icon-s` | `.spectrum-Icon .spectrum-Icon--sizeS` |
| Icon medium | `icon-m` | `.spectrum-Icon .spectrum-Icon--sizeM` |
| Icon large | `icon-l` | `.spectrum-Icon .spectrum-Icon--sizeL` |
| Icon extra large | `icon-xl` | `.spectrum-Icon .spectrum-Icon--sizeXL` |
| Icon extra extra large | `icon-xxl` | `.spectrum-Icon .spectrum-Icon--sizeXXL` |

---

## Progress Indicators

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Progress circle | `progress-circle` | `.spectrum-ProgressCircle` |
| Indeterminate progress | `progress-indeterminate` | `.spectrum-ProgressCircle--indeterminate` |
| Progress over background | `progress-over-background` | `.spectrum-ProgressCircle--overBackground` |

---

## Checkbox & Radio Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Checkbox | `checkbox` | `.spectrum-Checkbox` |
| Checkbox small | `checkbox-s` | `.spectrum-Checkbox .spectrum-Checkbox--sizeS` |
| Checkbox medium | `checkbox-m` | `.spectrum-Checkbox .spectrum-Checkbox--sizeM` |
| Checkbox large | `checkbox-l` | `.spectrum-Checkbox .spectrum-Checkbox--sizeL` |
| Checkbox extra large | `checkbox-xl` | `.spectrum-Checkbox .spectrum-Checkbox--sizeXL` |
| Radio button | `radio` | `.spectrum-Radio` |
| Radio small | `radio-s` | `.spectrum-Radio .spectrum-Radio--sizeS` |
| Radio medium | `radio-m` | `.spectrum-Radio .spectrum-Radio--sizeM` |
| Radio large | `radio-l` | `.spectrum-Radio .spectrum-Radio--sizeL` |
| Radio extra large | `radio-xl` | `.spectrum-Radio .spectrum-Radio--sizeXL` |

---

## Switch Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Switch | `switch` | `.spectrum-Switch` |
| Switch small | `switch-s` | `.spectrum-Switch .spectrum-Switch--sizeS` |
| Switch medium | `switch-m` | `.spectrum-Switch .spectrum-Switch--sizeM` |
| Switch large | `switch-l` | `.spectrum-Switch .spectrum-Switch--sizeL` |
| Switch extra large | `switch-xl` | `.spectrum-Switch .spectrum-Switch--sizeXL` |

---

## Card Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Card | `card` | `.spectrum-Card` |

---

## Well Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Well | `well` | `.spectrum-Well` |

---

## Divider Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Divider | `divider` | `.spectrum-Divider` |
| Vertical divider | `divider-vertical` | `.spectrum-Divider .spectrum-Divider--vertical` |
| Horizontal divider | `divider-horizontal` | `.spectrum-Divider .spectrum-Divider--horizontal` |
| Small divider | `divider-s` | `.spectrum-Divider .spectrum-Divider--sizeS` |
| Medium divider | `divider-m` | `.spectrum-Divider .spectrum-Divider--sizeM` |
| Large divider | `divider-l` | `.spectrum-Divider .spectrum-Divider--sizeL` |

---

## Badge Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Badge | `badge` | `.spectrum-Badge` |
| Neutral badge | `badge-neutral` | `.spectrum-Badge .spectrum-Badge--neutral` |
| Informative badge | `badge-info` | `.spectrum-Badge .spectrum-Badge--informative` |
| Positive badge | `badge-positive` | `.spectrum-Badge .spectrum-Badge--positive` |
| Negative badge | `badge-negative` | `.spectrum-Badge .spectrum-Badge--negative` |

---

## Tag Patterns

| Pattern | Shortcode | CSS Classes |
|---------|-----------|-------------|
| Tag | `tag` | `.spectrum-Tag` |
| Tag small | `tag-s` | `.spectrum-Tag .spectrum-Tag--sizeS` |
| Tag medium | `tag-m` | `.spectrum-Tag .spectrum-Tag--sizeM` |
| Tag large | `tag-l` | `.spectrum-Tag .spectrum-Tag--sizeL` |

---

## Composite Patterns

### Form Pattern Combinations
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Login form | `form-login` | Email + password fields with submit button |
| Registration form | `form-registration` | Multiple fields with validation |
| Settings form | `form-settings` | Side labels with switches and sections |

### Toolbar Pattern
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Action toolbar | `toolbar-actions` | Compact action group with quiet buttons |
| Format toolbar | `toolbar-format` | Emphasized quiet buttons for formatting |
| View switcher | `toolbar-view-switcher` | Radio group of action buttons |

### Dialog Patterns
| Pattern | Shortcode | Description |
|---------|-----------|-------------|
| Confirmation dialog | `dialog-confirm` | Dialog with message and cancel/confirm buttons |
| Destructive confirmation | `dialog-destructive` | Confirmation with negative action button |
| Information dialog | `dialog-info` | Simple dialog with informative content |

---

## Usage Examples

### Basic Button
```html
<button 
  class="spectrum-Button spectrum-Button--accent spectrum-Button--fill"
  data-spectrum-pattern="button-accent"
>
  Save Changes
</button>
```

### Action Toolbar
```html
<div 
  class="spectrum-ActionGroup spectrum-ActionGroup--compact"
  data-spectrum-pattern="action-group-compact"
>
  <button 
    class="spectrum-ActionButton spectrum-ActionButton--quiet"
    data-spectrum-pattern="action-button-quiet"
  >
    <svg class="spectrum-Icon" data-spectrum-pattern="icon-m">...</svg>
  </button>
</div>
```

### Form Field
```html
<div class="spectrum-Form-item" data-spectrum-pattern="form-item">
  <label 
    class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
    data-spectrum-pattern="field-label-m"
    for="email"
  >
    Email
  </label>
  <input 
    type="email"
    class="spectrum-Textfield spectrum-Textfield--sizeM"
    data-spectrum-pattern="textfield-m"
    id="email"
  />
  <div 
    class="spectrum-HelpText"
    data-spectrum-pattern="help-text"
  >
    Enter your email address
  </div>
</div>
```

### Modal Dialog
```html
<div class="spectrum-Underlay is-open" data-spectrum-pattern="underlay-open"></div>
<div class="spectrum-Modal is-open" data-spectrum-pattern="modal-open">
  <div class="spectrum-Dialog" data-spectrum-pattern="dialog">
    <h2 class="spectrum-Dialog-heading" data-spectrum-pattern="dialog-heading">
      Confirm Action
    </h2>
    <div class="spectrum-Dialog-content" data-spectrum-pattern="dialog-content">
      Are you sure you want to proceed?
    </div>
    <div class="spectrum-Dialog-footer" data-spectrum-pattern="dialog-footer">
      <button 
        class="spectrum-Button spectrum-Button--secondary"
        data-spectrum-pattern="button-secondary"
      >
        Cancel
      </button>
      <button 
        class="spectrum-Button spectrum-Button--accent"
        data-spectrum-pattern="button-accent"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## Pattern Naming Convention

Shortcodes follow this structure:
- **Component type** (e.g., `button`, `menu`, `action-button`)
- **Variant/modifier** (e.g., `accent`, `quiet`, `emphasized`)
- **Size** (e.g., `s`, `m`, `l`, `xl`)
- **State** (e.g., `selected`, `disabled`, `open`)

Combined with hyphens: `{component}-{variant}-{size}-{state}`

Examples:
- `button-accent` (component + variant)
- `action-button-quiet` (component + variant)
- `menu-item-selected` (component + state)
- `textfield-m` (component + size)
- `dialog-s` (component + size)

---

## Notes

- All patterns assume proper Spectrum CSS is loaded
- Multiple patterns can be applied to a single element
- Data attributes are for identification and documentation, not styling
- Use CSS classes for actual styling implementation
- Patterns can be nested (e.g., `button-accent` inside `dialog-footer`)

