# Static color patterns

Static colors are used when components need to be placed on colored backgrounds, images, or dynamic content where the background color is not controlled by the theme. Static color variants do not change shades based on the color theme (light or dark mode).

## When to use static colors

**Use static colors when:**
- Placing components over photography or images
- Components appear on video backgrounds
- Overlaying UI on user-generated content with unknown colors
- Marketing pages with custom branded backgrounds
- Gradient or colored backgrounds that don't follow theme

**Do not use when:**
- On standard theme backgrounds (use default variants)
- When theme-aware colors provide sufficient contrast
- For semantic colors (success, error, warning)

## Static color variants

### Static white

For use on dark backgrounds or visuals.

**CSS classes:**
- `.spectrum-Button--staticWhite`
- `.spectrum-ActionButton--staticWhite`
- Other components: `--staticWhite` pattern

**Guidelines:**
- Maintains white/light appearance regardless of theme
- Provides consistent contrast on dark backgrounds
- Use when background is predominantly dark (< 50% luminosity)

**Custom properties:**
```css
--spectrum-static-white-background-color-default
--spectrum-static-white-border-color-default
--spectrum-static-white-content-color-default
--mod-button-static-content-color
--mod-actionbutton-content-color-default
```

### Static black

For use on light backgrounds or visuals.

**CSS classes:**
- `.spectrum-Button--staticBlack`
- `.spectrum-ActionButton--staticBlack`
- Other components: `--staticBlack` pattern

**Guidelines:**
- Maintains black/dark appearance regardless of theme
- Provides consistent contrast on light backgrounds
- Use when background is predominantly light (> 50% luminosity)

**Custom properties:**
```css
--spectrum-static-black-background-color-default
--spectrum-static-black-border-color-default
--spectrum-static-black-content-color-default
```

## Components with static color support

### Buttons

Both fill and outline treatments work with static colors.

**Fill treatment:**
```html
<!-- On dark background -->
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--staticWhite">
  Click me
</button>

<!-- On light background -->
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--staticBlack">
  Click me
</button>
```

**Outline treatment:**
```html
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--outline spectrum-Button--staticWhite">
  Click me
</button>
```

**Variants supporting static colors:**
- Primary
- Secondary

**Note:** Accent and Negative variants typically don't use static colors as their semantic meaning should remain consistent.

### Action buttons

Static colors work with both standard and quiet action buttons.

```html
<!-- Standard on dark background -->
<button class="spectrum-ActionButton spectrum-ActionButton--staticWhite">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>

<!-- Quiet on dark background -->
<button class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-ActionButton--staticWhite">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Edit</span>
</button>
```

**Custom property for selected state:**
```css
--mod-actionbutton-content-color-default
```

Use this to set text/icon color when action button is selected.

## Implementation patterns

### Hero section with image background

```html
<div class="hero" style="background-image: url('dark-image.jpg');">
  <h1>Welcome</h1>
  <p>Get started with our product</p>
  <button class="spectrum-Button spectrum-Button--accent spectrum-Button--sizeL spectrum-Button--staticWhite">
    Sign up now
  </button>
</div>
```

### Card with colored background

```html
<div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <h2>Premium Plan</h2>
  <p>$29 per month</p>
  <button class="spectrum-Button spectrum-Button--primary spectrum-Button--staticWhite">
    Upgrade
  </button>
</div>
```

### Video overlay controls

```html
<div class="video-container">
  <video src="video.mp4"></video>
  <div class="video-controls">
    <button class="spectrum-ActionButton spectrum-ActionButton--staticWhite spectrum-ActionButton--quiet">
      <svg class="spectrum-Icon"><!-- play icon --></svg>
    </button>
    <button class="spectrum-ActionButton spectrum-ActionButton--staticWhite spectrum-ActionButton--quiet">
      <svg class="spectrum-Icon"><!-- volume icon --></svg>
    </button>
  </div>
</div>
```

### User-generated content overlay

```html
<div class="user-photo" style="background-image: url('user-photo.jpg');">
  <div class="photo-actions">
    <button class="spectrum-ActionButton spectrum-ActionButton--staticWhite">
      <svg class="spectrum-Icon"><!-- edit icon --></svg>
      <span class="spectrum-ActionButton-label">Edit</span>
    </button>
    <button class="spectrum-ActionButton spectrum-ActionButton--staticWhite">
      <svg class="spectrum-Icon"><!-- delete icon --></svg>
      <span class="spectrum-ActionButton-label">Delete</span>
    </button>
  </div>
</div>
```

## Choosing between static white and black

### Contrast calculation

Ideally, calculate background luminosity to determine which static color to use:

1. **Dark backgrounds (luminosity < 50%):** Use static white
2. **Light backgrounds (luminosity > 50%):** Use static black
3. **Variable backgrounds:** Choose based on average or predominant color

### Visual testing

Always test static color choices:
- Ensure sufficient contrast (WCAG AA minimum: 4.5:1 for text, 3:1 for UI components)
- Test with actual background images/colors
- Verify in both light and dark system themes
- Test all interactive states (hover, focus, active, disabled)

### Complex backgrounds

For backgrounds with both light and dark regions:
- Add semi-transparent scrim behind buttons for consistent contrast
- Use drop shadows to improve legibility
- Consider relocating controls to more consistent background area

```html
<!-- Button with scrim background -->
<div class="button-container">
  <div class="scrim"></div>
  <button class="spectrum-Button spectrum-Button--primary spectrum-Button--staticWhite">
    Action
  </button>
</div>

<style>
.button-container {
  position: relative;
}

.scrim {
  position: absolute;
  inset: -8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  z-index: 0;
}

button {
  position: relative;
  z-index: 1;
}
</style>
```

## Interactive states

Static color components maintain appropriate interactive states:

### Hover state
Lightens static white or darkens static black slightly to indicate interactivity.

**Custom properties:**
```css
--spectrum-static-white-background-color-hover
--spectrum-static-black-background-color-hover
```

### Focus state
Maintains visible focus indicator while preserving static color appearance.

**Custom properties:**
```css
--spectrum-static-white-focus-indicator-color
--spectrum-static-black-focus-indicator-color
```

### Active/pressed state
Provides tactile feedback with further color shift.

**Custom properties:**
```css
--spectrum-static-white-background-color-down
--spectrum-static-black-background-color-down
```

### Disabled state
Reduces opacity while maintaining static color base.

**Custom properties:**
```css
--spectrum-static-white-content-color-disabled
--spectrum-static-black-content-color-disabled
```

## Combining with other patterns

### Static colors with sizing
```html
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--staticWhite spectrum-Button--sizeL">
  Large static button
</button>
```

### Static colors with button treatments
```html
<!-- Fill treatment (default) -->
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--fill spectrum-Button--staticWhite">
  Filled
</button>

<!-- Outline treatment -->
<button class="spectrum-Button spectrum-Button--primary spectrum-Button--outline spectrum-Button--staticWhite">
  Outline
</button>
```

### Static colors with quiet action buttons
```html
<button class="spectrum-ActionButton spectrum-ActionButton--quiet spectrum-ActionButton--staticWhite">
  <svg class="spectrum-Icon"><!-- icon --></svg>
  <span class="spectrum-ActionButton-label">Action</span>
</button>
```

## Accessibility considerations

### Contrast requirements

WCAG 2.1 Level AA requires:
- **Normal text (< 18pt):** 4.5:1 contrast ratio
- **Large text (≥ 18pt or 14pt bold):** 3:1 contrast ratio
- **UI components:** 3:1 contrast ratio

Always verify contrast between static color components and their backgrounds.

### Focus indicators

Ensure focus indicators remain visible:
- May need custom focus color for complex backgrounds
- Test with keyboard navigation
- Verify in Windows High Contrast Mode

### Color blindness

Static color choices should work for color-blind users:
- Don't rely solely on color to convey information
- Maintain sufficient luminosity contrast
- Test with color blindness simulators

## Best practices

1. **Test thoroughly:** Always test static colors with actual background content
2. **Maintain consistency:** Use same static color variant across related controls
3. **Provide fallbacks:** Ensure usability if background image fails to load
4. **Consider motion:** If background has motion/video, ensure controls remain legible throughout
5. **Avoid overuse:** Reserve for truly necessary cases; theme-aware colors are preferable when possible
6. **Document choices:** Note why static colors were chosen for future maintainers

## Common mistakes to avoid

- Using static colors on theme backgrounds (unnecessary and breaks theme consistency)
- Inconsistent static color choices across related components
- Insufficient contrast testing
- Forgetting to test all interactive states
- Using static colors for semantic buttons (negative, accent) that should maintain meaning
- Not providing adequate background scrim for complex backgrounds

## Related patterns

- [Button patterns](./button-patterns.md)
- [State patterns](./state-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
