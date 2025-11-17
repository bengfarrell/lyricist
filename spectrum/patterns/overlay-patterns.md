# Overlay patterns

Overlays display content on top of the main interface, including modals, popovers, dialogs, and trays. They provide focus and context for specific tasks or information.

## Modal

A modal is a base component using `position: fixed` that displays content on top of the current page. It's typically used by other components like Dialog.

**CSS classes:**
- `.spectrum-Modal`
- `.is-open`

**Variants:**
- `.spectrum-Modal--responsive` (default) - Fills screen on small viewports
- `.spectrum-Modal--fullscreen` - Fills almost all screen space with outer margin
- `.spectrum-Modal--fullscreenTakeover` - Fills entire screen space

**Custom properties:**
```css
--spectrum-modal-background-color
--spectrum-modal-confirm-border-radius
--spectrum-modal-fullscreen-margin
--spectrum-modal-max-height
--spectrum-modal-max-width
```

**Guidelines:**
- Usually paired with Underlay component for backdrop
- Animation controlled via `--spectrum-modal-animation-distance`
- Use Dialog component for complete modal experiences
- Position handling should be done by implementation

## Popover

Displays transient content (menus, options, additional actions) that appears when clicking/tapping a source.

**CSS classes:**
- `.spectrum-Popover`
- `.is-open`

**Custom properties:**
```css
--spectrum-popover-background-color
--spectrum-popover-border-color
--spectrum-popover-border-width
--spectrum-popover-corner-radius
--spectrum-popover-shadow
--spectrum-popover-animation-distance
--spectrum-popover-filter
```

### Positioning

22 available positions using a two-term naming convention: first term is popover position, second is source position.

**Position classes:**

Top/Bottom:
- `.spectrum-Popover--top`
- `.spectrum-Popover--top-left`
- `.spectrum-Popover--top-right`
- `.spectrum-Popover--top-start`
- `.spectrum-Popover--top-end`
- `.spectrum-Popover--bottom`
- `.spectrum-Popover--bottom-left`
- `.spectrum-Popover--bottom-right`
- `.spectrum-Popover--bottom-start`
- `.spectrum-Popover--bottom-end`

Left/Right:
- `.spectrum-Popover--left`
- `.spectrum-Popover--left-top`
- `.spectrum-Popover--left-bottom`
- `.spectrum-Popover--right`
- `.spectrum-Popover--right-top`
- `.spectrum-Popover--right-bottom`

Logical (Start/End):
- `.spectrum-Popover--start`
- `.spectrum-Popover--start-top`
- `.spectrum-Popover--start-bottom`
- `.spectrum-Popover--end`
- `.spectrum-Popover--end-top`
- `.spectrum-Popover--end-bottom`

**Guidelines:**
- Use logical properties (start/end) for better RTL support
- Position and distance should be handled by implementation
- When `.is-open`, popover animates from `--spectrum-popover-animation-distance`

### Tips

Popovers can optionally display a pointing tip/arrow to indicate their source.

**CSS classes:**
- `.spectrum-Popover--withTip`

**Guidelines:**
- Use tip when source doesn't have distinct down state
- Don't use tip when source has visual down state (e.g., selected button)
- Two SVG variants: one for top/bottom, one for sides
- CSS handles flipping tips based on position

**Tip positioning:**

Default tip positioning:
- Centered on edge for top/bottom/left/right/start/end
- Distance from corner equals corner radius for other positions

Custom tip centering with source:
```css
/* Center tip with a 100px wide source */
--spectrum-popover-pointer-edge-offset: 50px;
```

### Nested popovers

Popovers can be nested within other popovers for submenu-style interactions.

**Guidelines:**
- Typically positioned to the side of parent popover
- Common for hierarchical menu structures
- Ensure proper z-index management in implementation

### Content types

Popovers can contain different content:
- **Menu popovers**: Most common, for action lists
- **Dialog popovers**: For more complex content with dialog structure
- **Custom content**: Any valid HTML content

## Dialog

Complete modal experiences with headers, content, and footers. Uses Modal as base.

**CSS classes:**
- `.spectrum-Dialog`
- `.spectrum-Dialog--sizeS` / `--sizeM` / `--sizeL` / `--fullscreen` / `--fullscreenTakeover`

**Components:**
- `.spectrum-Dialog-heading`
- `.spectrum-Dialog-content`
- `.spectrum-Dialog-footer`
- `.spectrum-Dialog-closeButton`

**Custom properties:**
```css
--spectrum-dialog-padding
--spectrum-dialog-gap
--spectrum-dialog-min-width
```

**Guidelines:**
- Use for focused tasks requiring user input
- Include clear title in heading
- Provide obvious way to close (close button or cancel action)
- Keep content focused on single task
- Footer typically contains action buttons

## Alert dialog

Specialized dialog for important messages requiring user acknowledgment or decision.

**CSS classes:**
- `.spectrum-AlertDialog`
- `.spectrum-AlertDialog--information`
- `.spectrum-AlertDialog--warning`
- `.spectrum-AlertDialog--error`

**Guidelines:**
- Use for critical communications
- Typically includes icon indicating severity
- Keep message concise and clear
- Provide clear action buttons
- Use appropriate variant for message type

## Tray

Mobile-optimized overlay that slides up from the bottom of the screen.

**CSS classes:**
- `.spectrum-Tray`
- `.is-open`

**Guidelines:**
- Primarily for mobile viewports
- Contains menus, forms, or other content
- Should be dismissible
- Consider fixed height for menus with collapsible sections

## Underlay

Backdrop that appears behind overlays to focus user attention and block interaction with underlying content.

**CSS classes:**
- `.spectrum-Underlay`
- `.is-open`

**Custom properties:**
```css
--spectrum-underlay-background-color
```

**Guidelines:**
- Used with modals, dialogs, and other blocking overlays
- Clicking underlay typically dismisses overlay (implementation-specific)
- Provides visual separation between layers
- Prevents interaction with main content

## Overlay patterns by use case

### Action menu overlay
```html
<!-- Button trigger -->
<button class="spectrum-ActionButton is-selected">
  Actions
</button>

<!-- Popover with menu -->
<div class="spectrum-Popover is-open spectrum-Popover--bottom">
  <div class="spectrum-Menu" role="listbox">
    <!-- menu items -->
  </div>
</div>
```

### Confirmation dialog overlay
```html
<!-- Underlay -->
<div class="spectrum-Underlay is-open"></div>

<!-- Modal with dialog -->
<div class="spectrum-Modal is-open">
  <div class="spectrum-Dialog">
    <h2 class="spectrum-Dialog-heading">Confirm delete</h2>
    <div class="spectrum-Dialog-content">
      Are you sure you want to delete this item?
    </div>
    <div class="spectrum-Dialog-footer">
      <button class="spectrum-Button spectrum-Button--secondary">Cancel</button>
      <button class="spectrum-Button spectrum-Button--negative">Delete</button>
    </div>
  </div>
</div>
```

### Contextual help overlay
```html
<button class="spectrum-HelpButton">
  <svg class="spectrum-Icon"><!-- info icon --></svg>
</button>

<div class="spectrum-Popover spectrum-Popover--withTip spectrum-Popover--bottom is-open">
  <div class="spectrum-Dialog spectrum-Dialog--sizeS">
    <h3 class="spectrum-Dialog-heading">Help topic</h3>
    <div class="spectrum-Dialog-content">
      Helpful information about this feature...
    </div>
  </div>
</div>
```

## Z-index management

Overlays require careful z-index management:
- Base page content: z-index 0
- Popover: Higher z-index
- Modal + Underlay: Highest z-index
- Nested popovers: Incrementing z-index

**Custom properties:**
```css
--spectrum-drop-shadow-z-index
--spectrum-popover-z-index
--spectrum-modal-z-index
```

## Animation and transitions

Overlays should animate when opening/closing for smooth user experience.

**Custom properties:**
```css
--spectrum-animation-duration-100
--spectrum-animation-ease-in-out
--spectrum-popover-animation-distance
--spectrum-modal-animation-distance
```

**Guidelines:**
- Fade in underlay
- Slide/fade modals from animation distance
- Popover slides from animation distance based on position
- Keep animations short (100-200ms)

## Accessibility

- Trap focus within modal overlays
- Return focus to trigger when closing
- Support Escape key to dismiss
- Use appropriate ARIA roles and attributes
- `aria-modal="true"` for modal dialogs
- `aria-haspopup` on triggers
- `aria-expanded` to indicate open state
- Announce overlay opening to screen readers
- Ensure close button is keyboard accessible
- Provide clear focus indicators
- Don't nest modal overlays

## Best practices

### When to use modals vs. popovers

**Use modals when:**
- Requiring user decision before continuing
- Displaying critical information
- Multi-step processes requiring focus
- Forms with significant input

**Use popovers when:**
- Showing additional options or actions
- Providing contextual help
- Displaying tooltips or small info
- Non-blocking supplementary content

### Performance considerations
- Lazy load overlay content when possible
- Remove from DOM when closed if not frequently used
- Minimize underlay opacity transitions
- Use CSS transforms for better performance

### Responsive behavior
- Convert popovers to trays on mobile when appropriate
- Use fullscreen modals on small viewports
- Ensure touch targets are adequate
- Consider gesture-based dismissal on mobile

## Related patterns

- [Menu patterns](./menu-patterns.md)
- [Button patterns](./button-patterns.md)
- [State patterns](./state-patterns.md)
