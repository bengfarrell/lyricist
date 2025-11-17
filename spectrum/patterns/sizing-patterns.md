# Sizing patterns

Spectrum CSS components use a consistent sizing system across the design system. Most components are available in four sizes that create visual hierarchy and accommodate different use cases.

## Size scale

### Standard size options

Most components support four sizes:
- **S (Small)**: `--sizeS` class modifier
- **M (Medium)**: Default, no modifier needed
- **L (Large)**: `--sizeL` class modifier
- **XL (Extra Large)**: `--sizeXL` class modifier

### Extended size options

Some components (like Action Button) support an additional extra-small size:
- **XS (Extra Small)**: `--sizeXS` class modifier

## Token system

Spectrum uses a numeric token system for sizing:
- 75: Small
- 100: Medium (base/default)
- 200: Large
- 300: Extra Large
- Additional scales for specific needs (50, 125, 400, 500, 600)

### Component height tokens

```css
--spectrum-component-height-75    /* Small */
--spectrum-component-height-100   /* Medium */
--spectrum-component-height-200   /* Large */
--spectrum-component-height-300   /* Extra Large */
```

### Font size tokens

```css
--spectrum-font-size-75    /* Small */
--spectrum-font-size-100   /* Medium */
--spectrum-font-size-200   /* Large */
--spectrum-font-size-300   /* Extra Large */
```

### Icon size tokens

```css
--spectrum-workflow-icon-size-75    /* Small */
--spectrum-workflow-icon-size-100   /* Medium */
--spectrum-workflow-icon-size-200   /* Large */
--spectrum-workflow-icon-size-300   /* Extra Large */
```

### Spacing and padding tokens

```css
/* Edge to visual (with icon) */
--spectrum-component-edge-to-visual-75
--spectrum-component-edge-to-visual-100
--spectrum-component-edge-to-visual-200
--spectrum-component-edge-to-visual-300

/* Edge to visual (icon only) */
--spectrum-component-edge-to-visual-only-75
--spectrum-component-edge-to-visual-only-100
--spectrum-component-edge-to-visual-only-200
--spectrum-component-edge-to-visual-only-300

/* Edge to text */
--spectrum-component-edge-to-text-75
--spectrum-component-edge-to-text-100
--spectrum-component-edge-to-text-200
--spectrum-component-edge-to-text-300

/* Text to visual */
--spectrum-text-to-visual-75
--spectrum-text-to-visual-100
--spectrum-text-to-visual-200
--spectrum-text-to-visual-300
```

## Component-specific sizing

### Buttons

**CSS classes:**
```css
.spectrum-Button--sizeS
.spectrum-Button              /* Medium, default */
.spectrum-Button--sizeL
.spectrum-Button--sizeXL
```

**Affected properties:**
- Height
- Font size
- Padding (edge to text, edge to visual)
- Icon size
- Spacing between icon and text

### Action buttons

**CSS classes:**
```css
.spectrum-ActionButton--sizeXS   /* Additional extra-small size */
.spectrum-ActionButton--sizeS
.spectrum-ActionButton           /* Medium, default */
.spectrum-ActionButton--sizeL
.spectrum-ActionButton--sizeXL
```

### Form components

Field labels, text fields, pickers, and other form components follow the same sizing pattern.

**CSS classes:**
```css
.spectrum-FieldLabel--sizeS
.spectrum-FieldLabel--sizeM
.spectrum-FieldLabel--sizeL
.spectrum-FieldLabel--sizeXL
```

**Note:** Small and medium field labels have the same font size but different padding when used as side labels.

### Menus

**CSS classes:**
```css
.spectrum-Menu--sizeS
.spectrum-Menu--sizeM
.spectrum-Menu--sizeL
.spectrum-Menu--sizeXL
```

**Guidelines:**
- Menu size should match its trigger component size
- Menu item height scales with size
- Internal components (icons, switches) should match menu size

## Sizing guidelines

### When to use each size

**Small (S):**
- Compact interfaces with space constraints
- Inline controls within dense content
- Secondary actions in toolbars
- Mobile interfaces where space is limited

**Medium (M) - Default:**
- Most common use case
- Primary controls
- General page content
- Balanced between size and usability

**Large (L):**
- Prominent actions requiring emphasis
- Interfaces with generous spacing
- Better for touch targets
- Marketing or landing pages

**Extra Large (XL):**
- Hero actions on landing pages
- Kiosks or public displays
- Accessibility considerations requiring larger targets
- Marketing and promotional interfaces

### Consistency rules

1. **Match related components:**
   - Button and adjacent field label should be same size
   - Menu should match its trigger button
   - Icons should match their containing component

2. **Maintain hierarchy:**
   - Use larger sizes for more important actions
   - Primary actions can be larger than secondary
   - Don't mix too many different sizes in one area

3. **Group consistency:**
   - All buttons in a button group should be same size
   - Form fields in same form should generally be same size
   - Menu items in same menu should be same size

4. **Context-appropriate:**
   - Dense data tables might use small size throughout
   - Simple forms might use medium consistently
   - Landing pages might use large or extra large

## Responsive sizing

### Breakpoint considerations

While Spectrum CSS doesn't dictate breakpoints, common patterns include:

- **Mobile (<768px):**
  - Consider defaulting to medium or large for better touch targets
  - Extra large often too big for narrow viewports
  - Small can work for toolbars and action bars

- **Tablet (768px-1024px):**
  - Medium is typical default
  - Large works for primary actions
  - Small acceptable for dense toolbars

- **Desktop (>1024px):**
  - All sizes appropriate depending on use case
  - Most common: Medium with selective Large for emphasis
  - Small works well for dense productivity tools

### Implementing responsive sizing

```css
/* Example: Responsive button sizing */
.my-button {
  @media (max-width: 768px) {
    /* Use large on mobile for better touch targets */
    @extend .spectrum-Button--sizeL;
  }

  @media (min-width: 769px) {
    /* Use medium on desktop */
    /* Default, no class needed */
  }
}
```

## Custom sizing

If standard sizes don't meet your needs, you can override size-related custom properties:

```css
.my-custom-button {
  /* Override specific sizing properties */
  --spectrum-button-sized-height: 48px;
  --spectrum-button-sized-font-size: 16px;
  --spectrum-button-intended-icon-size: 20px;
}
```

**Caution:** Custom sizing should be used sparingly and only when absolutely necessary. Standard sizes ensure consistency and accessibility.

## Accessibility considerations

- **Touch targets:** Ensure interactive elements are at least 44x44px (iOS) or 48x48px (Android)
  - Small size may be too small for touch on mobile
  - Consider Medium or Large for mobile interfaces

- **Visual acuity:** Larger sizes can help users with low vision
  - Font sizes scale with component size
  - More padding provides better visual separation

- **Motor control:** Larger components are easier to click/tap
  - Large and Extra Large better for users with motor impairments
  - Consider context and user needs

## Testing size consistency

When implementing designs:
1. Verify all related components use consistent sizing
2. Check that icons match their container size
3. Ensure spacing scales appropriately
4. Test responsive behavior at various viewports
5. Validate touch targets on mobile devices

## Common patterns

### Button group with consistent sizing
```html
<div class="spectrum-ButtonGroup">
  <button class="spectrum-Button spectrum-Button--sizeM">Option 1</button>
  <button class="spectrum-Button spectrum-Button--sizeM">Option 2</button>
  <button class="spectrum-Button spectrum-Button--sizeM">Option 3</button>
</div>
```

### Form with consistent field sizing
```html
<form class="spectrum-Form">
  <div class="spectrum-Form-item">
    <label class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Name</label>
    <input class="spectrum-Textfield spectrum-Textfield--sizeM" />
  </div>
  <div class="spectrum-Form-item">
    <label class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Email</label>
    <input class="spectrum-Textfield spectrum-Textfield--sizeM" />
  </div>
</form>
```

### Hierarchical sizing for emphasis
```html
<div class="dialog-footer">
  <!-- Primary action larger for emphasis -->
  <button class="spectrum-Button spectrum-Button--accent spectrum-Button--sizeL">
    Continue
  </button>
  <!-- Secondary action standard size -->
  <button class="spectrum-Button spectrum-Button--secondary spectrum-Button--sizeM">
    Cancel
  </button>
</div>
```

## Related patterns

- [Button patterns](./button-patterns.md)
- [Form patterns](./form-patterns.md)
- [Menu patterns](./menu-patterns.md)
