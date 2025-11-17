# Form patterns

The form component provides structure and spacing for form fields, creating consistent layouts for data entry interfaces.

## Label positioning

### Top labels (stacked layout)
The default layout with labels positioned above form fields.

**CSS classes:**
- `.spectrum-Form`
- `.spectrum-Form--labelPositionTop` (default)
- `.spectrum-FieldLabel` (default, left-aligned)

**Guidelines:**
- Most common form layout
- Best for forms with varying field widths
- Easier to scan vertically
- Works well on narrow viewports

**Structure:**
```html
<form class="spectrum-Form">
  <div class="spectrum-Form-item">
    <label class="spectrum-FieldLabel" for="field-id">Label</label>
    <input class="spectrum-Textfield" id="field-id" />
  </div>
</form>
```

### Side labels (two-column layout)
Labels positioned to the left of form fields, creating a two-column layout.

**CSS classes:**
- `.spectrum-Form`
- `.spectrum-Form--labelPositionSide`
- `.spectrum-FieldLabel--left` or `.spectrum-FieldLabel--right`

**Guidelines:**
- Use when horizontal space is available
- Creates more compact vertical layout
- Label alignment affects visual balance

#### Left-aligned side labels

**CSS classes:**
- `.spectrum-FieldLabel--left` (default for side labels)

**Guidelines:**
- Easier to scan labels
- More natural reading flow
- Creates ragged right edge for labels

#### Right-aligned side labels

**CSS classes:**
- `.spectrum-FieldLabel--right`

**Guidelines:**
- Creates stronger visual connection between label and field
- More compact visual appearance
- Can be harder to scan long label lists

**Custom properties:**
```css
--spectrum-fieldlabel-min-width
--spectrum-fieldlabel-side-margin-inline-end
```

## Field label anatomy

### Basic field label

**CSS classes:**
- `.spectrum-FieldLabel`
- `.spectrum-FieldLabel--sizeS` / `--sizeM` / `--sizeL` / `--sizeXL`

**Custom properties:**
```css
--spectrum-field-label-color
--spectrum-field-label-font-size
--spectrum-field-label-font-weight
--spectrum-field-label-line-height
```

### Required field indicator

**Guidelines:**
- Display asterisk (*) or "(required)" text
- Asterisk preferred for compact layouts
- No space should exist between label text and asterisk in markup
- Indicate at form level what required fields mean

**HTML structure:**
```html
<label class="spectrum-FieldLabel" for="field-id">
  Label
  <svg class="spectrum-FieldLabel-requiredIcon">
    <use xlink:href="#spectrum-icon-Asterisk" />
  </svg>
</label>
```

**Custom properties:**
```css
--spectrum-field-label-asterisk-color
--spectrum-field-label-asterisk-gap
```

### Disabled state

**CSS classes:**
- `.is-disabled` on field label

**Custom properties:**
```css
--spectrum-field-label-color-disabled
```

## Form item spacing

**CSS classes:**
- `.spectrum-Form-item`

**Custom properties:**
```css
--spectrum-spacing-300 /* default spacing between form items */
```

**Guidelines:**
- Consistent vertical spacing between form fields
- Maintains visual rhythm
- Creates clear separation between fields

## Field groups

Field groups allow multiple related inputs to be grouped together.

**CSS classes:**
- `.spectrum-FieldGroup`
- `.spectrum-FieldGroup--horizontal` or `.spectrum-FieldGroup--vertical`
- `.spectrum-FieldGroup-item`

**Use cases:**
- Related checkboxes or radio buttons
- Multiple inputs for a single concept (e.g., date/time)
- Options that should be considered together

**Structure:**
```html
<div class="spectrum-FieldGroup spectrum-FieldGroup--horizontal">
  <div class="spectrum-FieldGroup-item">
    <!-- checkbox or radio -->
  </div>
  <div class="spectrum-FieldGroup-item">
    <!-- checkbox or radio -->
  </div>
</div>
```

## Help text

Provides additional context or instructions for a form field.

**CSS classes:**
- `.spectrum-HelpText`
- `.spectrum-HelpText--sizeS` / `--sizeM` / `--sizeL` / `--sizeXL`
- `.spectrum-HelpText--negative` (for error messages)

**Custom properties:**
```css
--spectrum-help-text-color
--spectrum-help-text-font-size
--spectrum-help-text-line-height
--spectrum-help-text-color-negative
```

**Guidelines:**
- Position below the input field
- Use neutral help text for instructions
- Use negative variant for error messages
- Keep text concise and actionable

## Validation patterns

### Error state

**Guidelines:**
- Mark field as invalid with appropriate classes
- Display error message using help text
- Use negative color variant
- Ensure error is accessible to screen readers

**CSS classes:**
- `.is-invalid` on input
- `.spectrum-HelpText--negative`

### Success state

**CSS classes:**
- `.is-valid` on input

**Custom properties:**
```css
--spectrum-field-border-color-error
--spectrum-field-border-color-success
```

## Accessibility

- Associate labels with inputs using `for` and `id` attributes
- Use `aria-describedby` to connect help text with inputs
- Mark required fields with `required` attribute and visual indicator
- Provide clear error messages with `aria-invalid` and `aria-errormessage`
- Ensure logical tab order
- Group related fields with `<fieldset>` and `<legend>` when appropriate
- Maintain sufficient color contrast for all states

## Common patterns

### Login form
```html
<form class="spectrum-Form">
  <div class="spectrum-Form-item">
    <label class="spectrum-FieldLabel" for="email">Email</label>
    <input type="email" class="spectrum-Textfield" id="email" />
  </div>
  <div class="spectrum-Form-item">
    <label class="spectrum-FieldLabel" for="password">Password</label>
    <input type="password" class="spectrum-Textfield" id="password" />
  </div>
</form>
```

### Registration form with mixed inputs
- Text fields for name and email
- Picker for country selection
- Field group for checkboxes (interests)
- Stepper for numeric input (age)

### Settings form with side labels
- Right-aligned labels for compact appearance
- Switch components for toggle settings
- Sectioned with dividers for organization

## Related patterns

- [Text overflow patterns](./text-overflow-patterns.md)
- [State patterns](./state-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
