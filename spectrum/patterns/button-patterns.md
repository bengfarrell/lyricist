# Button patterns

Buttons allow users to perform an action or navigate to another page. They have multiple styles for various needs and are ideal for calling attention to where a user needs to do something to move forward in a flow.

## Button variants

### Accent (emphasized)
The accent button communicates strong emphasis and is reserved for encouraging critical actions.

**Guidelines:**
- Use only for the most important action on the page
- Generally, only one accent button should appear per view
- Reserved for actions that move the user forward in a flow

**CSS classes:**
- `.spectrum-Button`
- `.spectrum-Button--accent` (variant)
- `.spectrum-Button--fill` (treatment, default)
- `.spectrum-Button--outline` (treatment, alternative)

**Key custom properties:**
```css
--spectrum-button-background-color-default
--spectrum-button-background-color-hover
--spectrum-button-background-color-down
--spectrum-button-background-color-key-focus
--spectrum-button-content-color-default
--spectrum-button-border-color-default
```

### Primary
The primary button is for medium emphasis. Use it when the action requires less prominence, or if there are multiple primary actions of the same importance.

**Guidelines:**
- Use for important but not critical actions
- Can have multiple primary buttons in the same view
- Available in both fill and outline treatments

**CSS classes:**
- `.spectrum-Button`
- `.spectrum-Button--primary`
- `.spectrum-Button--fill` or `.spectrum-Button--outline`

### Secondary
The secondary button is for low emphasis. It's paired with other button types to surface less prominent actions.

**Guidelines:**
- Should never be the only button in a group
- Use for less important actions
- Available in both fill and outline treatments

**CSS classes:**
- `.spectrum-Button`
- `.spectrum-Button--secondary`
- `.spectrum-Button--fill` or `.spectrum-Button--outline`

### Negative
The negative button emphasizes actions that can be destructive or have negative consequences.

**Guidelines:**
- Use sparingly for destructive actions
- Examples: Delete, Remove, Uninstall
- Clearly communicates potential data loss or irreversible actions

**CSS classes:**
- `.spectrum-Button`
- `.spectrum-Button--negative`

## Sizing

Buttons come in four sizes. The medium size is the default and most frequently used option.

**Size classes:**
- `.spectrum-Button--sizeS` - Small
- `.spectrum-Button` (no modifier) - Medium (default)
- `.spectrum-Button--sizeL` - Large
- `.spectrum-Button--sizeXL` - Extra large

**Size-specific custom properties:**
```css
--spectrum-button-sized-height
--spectrum-button-sized-font-size
--spectrum-button-sized-edge-to-visual
--spectrum-button-sized-edge-to-text
--spectrum-button-sized-padding-label-to-icon
--spectrum-button-intended-icon-size
```

**Sizing tokens by size:**

Small (s):
- `--spectrum-component-height-75`
- `--spectrum-font-size-75`
- `--spectrum-workflow-icon-size-75`

Medium (m):
- `--spectrum-component-height-100`
- `--spectrum-font-size-100`
- `--spectrum-workflow-icon-size-100`

Large (l):
- `--spectrum-component-height-200`
- `--spectrum-font-size-200`
- `--spectrum-workflow-icon-size-200`

Extra Large (xl):
- `--spectrum-component-height-300`
- `--spectrum-font-size-300`
- `--spectrum-workflow-icon-size-300`

## Static colors

When a button needs to be placed on top of a colored background or visual, use static color variants. Static color buttons do not change shades depending on the color theme.

**Use cases:**
- Buttons on images or photography
- Buttons on colored backgrounds
- Overlay content with dynamic backgrounds

**CSS classes:**
- `.spectrum-Button--staticWhite` - For dark backgrounds
- `.spectrum-Button--staticBlack` - For light backgrounds

**Custom properties:**
```css
--mod-button-static-content-color
```

## Button states

### Pending
Indicates a quick progress action is taking place. The label and icon disappear and a progress circle appears.

**Guidelines:**
- Shows indeterminate progress only
- Button should have the `disabled` attribute when pending
- Use for short-duration actions (< 10 seconds)

**CSS classes:**
- `.is-pending` (on parent container, recommended)
- or `[pending]` attribute

### Disabled
Shows that an action exists but is not currently available.

**Guidelines:**
- Maintains layout continuity
- Communicates that an action may become available later
- Should include appropriate ARIA attributes

**CSS classes:**
- `[disabled]` attribute
- `.is-disabled` class

**Custom properties:**
```css
--spectrum-button-content-color-disabled
--spectrum-button-background-color-disabled
--spectrum-button-border-color-disabled
```

## Text overflow behavior

### Default wrapping
When button text is too long for the horizontal space available, it wraps to form another line.

**Guidelines:**
- When no icon is present, text is center-aligned
- When icon is present, text is aligned start (left in LTR)
- Icon remains vertically aligned at the top when text wraps

### Disable wrapping
Text will not wrap and button width expands until maximum width is reached.

**CSS classes:**
- `.spectrum-Button--noWrap`

**Guidelines:**
- Not part of official design spec - use with care
- Overflowing text shows ellipsis (...)
- Consider readability and overflow behavior
- Should set a `max-width` to prevent excessive expansion

## Icon usage

**Guidelines:**
- Icons should not be decorative
- Use only when necessary and with strong association to label
- Icon should precede label text in markup
- For icon-only buttons, label can be hidden with `.spectrum-Button-label` visually hidden

**Custom properties:**
```css
--spectrum-button-sized-padding-label-to-icon
--spectrum-button-intended-icon-size
--spectrum-button-sized-top-to-icon
```

## Accessibility

- Use semantic `<button>` element
- Include descriptive labels
- Provide focus indicators (handled by Spectrum CSS)
- Use `disabled` attribute, not just styling
- For icon-only buttons, ensure label is available to screen readers
- Include `aria-label` or visually hidden text when label is not visible

## Related patterns

- [Action button patterns](./action-button-patterns.md)
- [State patterns](./state-patterns.md)
- [Static color patterns](./static-color-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
