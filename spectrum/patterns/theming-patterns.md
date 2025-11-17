# Theming patterns

Spectrum CSS uses a context-based theming system built on CSS custom properties. Themes control the overall appearance of components and can be nested to create different visual contexts.

**Reference:** [Theming - Spectrum](https://spectrum.adobe.com/page/theming/)

## Theme anatomy

A complete Spectrum CSS theme consists of three parts:

1. **System** - The design system (Spectrum, Express, Legacy)
2. **Scale** - The size scale (Medium, Large)
3. **Color** - The color scheme (Light, Dark)

## Theme classes

### Base spectrum class

**CSS class:**
- `.spectrum`

**Guidelines:**
- Always present on the root element
- Provides base design tokens
- Required for all Spectrum CSS components

### Color themes

**CSS classes:**
- `.spectrum--light` (default) - Light color scheme
- `.spectrum--dark` - Dark color scheme

**Guidelines:**
- Applied to root `<html>` or container element
- Switches component colors for readability
- Can be nested for mixed-theme contexts
- Other color themes are being deprecated

**Custom properties affected:**
```css
--spectrum-background-base-color
--spectrum-background-layer-1-color
--spectrum-background-layer-2-color
--spectrum-gray-50
--spectrum-gray-100
/* ... and many more color tokens */
```

### Scale themes

**CSS classes:**
- `.spectrum--medium` (default) - Medium scale
- `.spectrum--large` - Large scale

**Guidelines:**
- Controls overall component sizing
- Medium is default for desktop applications
- Large for better touch targets and readability
- Applied at same level as color theme

**Custom properties affected:**
```css
--spectrum-component-height-75
--spectrum-component-height-100
--spectrum-font-size-75
--spectrum-font-size-100
/* ... and many more sizing tokens */
```

### System variants

**CSS classes:**
- `.spectrum--express` - Express design language
- `.spectrum--legacy` - Legacy Spectrum design (deprecated)

**Guidelines:**
- Optional, added to `.spectrum` class
- Express has unique styling characteristics
- Legacy should not be used in new projects
- Add to existing `.spectrum` classes, don't replace

## Basic usage

### Single theme context

```html
<!DOCTYPE html>
<html class="spectrum spectrum--medium spectrum--light">
<head>
  <title>My App</title>
  <link rel="stylesheet" href="@spectrum-css/bundle/dist/spectrum-core.css">
</head>
<body>
  <!-- All components use light medium theme -->
</body>
</html>
```

### Dark theme

```html
<html class="spectrum spectrum--medium spectrum--dark">
  <!-- All components use dark medium theme -->
</html>
```

### Large scale

```html
<html class="spectrum spectrum--large spectrum--light">
  <!-- All components use large light theme -->
</html>
```

### Express system

```html
<html class="spectrum spectrum--medium spectrum--light spectrum--express">
  <!-- All components use Express design language in light medium theme -->
</html>
```

## Nested themes

CSS custom properties cascade, allowing nested theme contexts.

### Dark section in light app

```html
<html class="spectrum spectrum--medium spectrum--light">
<body>
  <!-- Light themed content -->
  <main>
    <!-- More light content -->
  </main>

  <aside class="spectrum spectrum--dark">
    <!-- Dark themed sidebar -->
    <button class="spectrum-Button">
      <!-- This button will be dark themed -->
    </button>
  </aside>
</body>
</html>
```

### Light modal over dark app

```html
<html class="spectrum spectrum--medium spectrum--dark">
<body>
  <!-- Dark themed main content -->

  <div class="spectrum-Modal is-open">
    <div class="spectrum spectrum--light">
      <!-- Light themed modal content -->
      <div class="spectrum-Dialog">
        <!-- Dialog and its components will be light themed -->
      </div>
    </div>
  </div>
</body>
</html>
```

### Multiple nested contexts

```html
<div class="spectrum spectrum--light">
  <div class="spectrum-Card">
    <!-- Light themed card -->

    <div class="spectrum spectrum--dark">
      <!-- Dark themed section within light card -->
      <div class="spectrum-Well">
        <!-- Dark well -->

        <div class="spectrum spectrum--light">
          <!-- Light section within dark section -->
          <button class="spectrum-Button">Light button</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Dynamic theme switching

### JavaScript theme toggling

```javascript
// Get root element
const root = document.documentElement;

// Toggle between light and dark
function toggleTheme() {
  const isDark = root.classList.contains('spectrum--dark');

  if (isDark) {
    root.classList.remove('spectrum--dark');
    root.classList.add('spectrum--light');
  } else {
    root.classList.remove('spectrum--light');
    root.classList.add('spectrum--dark');
  }
}

// Set specific theme
function setTheme(color) {
  root.classList.remove('spectrum--light', 'spectrum--dark');
  root.classList.add(`spectrum--${color}`);
}

// Listen for system preference changes
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
  setTheme(e.matches ? 'dark' : 'light');
});
```

### Respecting system preferences

```javascript
// Initialize theme based on system preference
function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.documentElement;

  // Check for saved preference first
  const savedTheme = localStorage.getItem('spectrum-theme');

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

function setTheme(color) {
  const root = document.documentElement;
  root.classList.remove('spectrum--light', 'spectrum--dark');
  root.classList.add(`spectrum--${color}`);

  // Save preference
  localStorage.setItem('spectrum-theme', color);
}

// Initialize on page load
initTheme();
```

## Color system

### Base colors

Spectrum provides a comprehensive color palette accessible via custom properties.

**Color families:**
- Gray, Silver
- Blue, Indigo, Purple, Fuchsia, Magenta, Pink
- Red, Orange, Yellow, Chartreuse
- Green, Celery, Seafoam, Turquoise, Cyan
- Brown, Cinnamon

**Color values (per family):**
```css
--spectrum-{color}-50   /* Lightest */
--spectrum-{color}-100
--spectrum-{color}-200
--spectrum-{color}-300
--spectrum-{color}-400
--spectrum-{color}-500
--spectrum-{color}-600
--spectrum-{color}-700
--spectrum-{color}-800
--spectrum-{color}-900  /* Darkest */
```

**Example:**
```css
--spectrum-blue-400
--spectrum-red-600
--spectrum-gray-800
```

### Semantic color tokens

Semantic tokens provide meaning-based colors that adapt to themes.

**Background colors:**
```css
--spectrum-background-base-color
--spectrum-background-layer-1-color
--spectrum-background-layer-2-color
```

**Content colors:**
```css
--spectrum-neutral-content-color-default
--spectrum-neutral-content-color-hover
--spectrum-neutral-content-color-down
--spectrum-neutral-content-color-key-focus
```

**Accent colors:**
```css
--spectrum-accent-background-color-default
--spectrum-accent-background-color-hover
--spectrum-accent-background-color-down
--spectrum-accent-content-color-default
```

**Status colors:**
```css
--spectrum-negative-background-color-default
--spectrum-negative-color-default
--spectrum-positive-color-default
--spectrum-notice-color-default
--spectrum-informative-color-default
```

**Disabled colors:**
```css
--spectrum-disabled-background-color
--spectrum-disabled-content-color
--spectrum-disabled-border-color
```

### Transparent colors

**Transparent black:**
```css
--spectrum-transparent-black-100
--spectrum-transparent-black-200
--spectrum-transparent-black-300
--spectrum-transparent-black-400
--spectrum-transparent-black-500
--spectrum-transparent-black-600
--spectrum-transparent-black-700
--spectrum-transparent-black-800
--spectrum-transparent-black-900
```

**Transparent white:**
```css
--spectrum-transparent-white-100
--spectrum-transparent-white-200
--spectrum-transparent-white-300
--spectrum-transparent-white-400
--spectrum-transparent-white-500
--spectrum-transparent-white-600
--spectrum-transparent-white-700
--spectrum-transparent-white-800
--spectrum-transparent-white-900
```

**Use cases:**
- Overlays and scrims
- Semi-transparent backgrounds
- Layering effects
- Subtle dividers

## Customizing themes

### Overriding tokens

You can override design tokens in context to customize appearance:

```css
.my-custom-context {
  /* Change accent color */
  --spectrum-accent-background-color-default: #7B16FF;
  --spectrum-accent-background-color-hover: #6B14E6;
  --spectrum-accent-background-color-down: #5C12CC;

  /* Change corner radius globally */
  --spectrum-corner-radius-100: 8px;

  /* Change default font */
  --spectrum-font-family: "Custom Font", sans-serif;
}
```

### Component-specific overrides

Override tokens for specific components:

```css
/* Custom button colors */
.my-special-button {
  --spectrum-button-background-color-default: #FF6B6B;
  --spectrum-button-background-color-hover: #FF5252;
  --spectrum-button-content-color-default: white;
}
```

### Creating custom themes

```css
/* Custom "midnight" theme */
.spectrum--midnight {
  /* Override background colors */
  --spectrum-background-base-color: #0a0e27;
  --spectrum-background-layer-1-color: #141b3d;
  --spectrum-background-layer-2-color: #1e2749;

  /* Override text colors */
  --spectrum-neutral-content-color-default: #e0e6ff;
  --spectrum-heading-color: #ffffff;

  /* Custom accent */
  --spectrum-accent-background-color-default: #00d4ff;
}
```

```html
<html class="spectrum spectrum--medium spectrum--midnight">
  <!-- Components use custom midnight theme -->
</html>
```

## Typography theming

### Font families

```css
--spectrum-sans-font-family-stack  /* Adobe Clean */
--spectrum-serif-font-family-stack /* Adobe Clean Serif */
--spectrum-code-font-family-stack  /* Source Code Pro */
--spectrum-cjk-font-family-stack   /* Adobe Clean Han Japanese */
```

### Localized fonts

```css
--spectrum-font-family-ar  /* Arabic - Myriad Arabic */
--spectrum-font-family-he  /* Hebrew - Myriad Hebrew */
```

### Font sizes

```css
--spectrum-font-size-50   /* 11px */
--spectrum-font-size-75   /* 12px */
--spectrum-font-size-100  /* 14px */
--spectrum-font-size-200  /* 16px */
--spectrum-font-size-300  /* 18px */
--spectrum-font-size-400  /* 20px */
--spectrum-font-size-500  /* 22px */
--spectrum-font-size-600  /* 25px */
--spectrum-font-size-700  /* 28px */
--spectrum-font-size-800  /* 32px */
--spectrum-font-size-900  /* 36px */
--spectrum-font-size-1000 /* 40px */
/* continues to 1300 */
```

## Animation theming

### Animation durations

```css
--spectrum-animation-duration-0      /* 0ms - instant */
--spectrum-animation-duration-100    /* 130ms */
--spectrum-animation-duration-200    /* 160ms */
--spectrum-animation-duration-300    /* 190ms */
--spectrum-animation-duration-400    /* 220ms */
--spectrum-animation-duration-500    /* 250ms */
--spectrum-animation-duration-600    /* 300ms */
--spectrum-animation-duration-700    /* 350ms */
--spectrum-animation-duration-800    /* 400ms */
--spectrum-animation-duration-900    /* 450ms */
--spectrum-animation-duration-1000   /* 500ms */
--spectrum-animation-duration-2000   /* 1000ms */
--spectrum-animation-duration-4000   /* 2000ms */
--spectrum-animation-duration-6000   /* 3000ms */
```

### Animation easings

```css
--spectrum-animation-linear
--spectrum-animation-ease-in-out
--spectrum-animation-ease-in
--spectrum-animation-ease-out
--spectrum-animation-ease-linear
```

## Best practices

### Theme selection

**Choose light theme when:**
- Application is content-focused
- Used in well-lit environments
- Users prefer traditional appearance
- High contrast not required

**Choose dark theme when:**
- Application is media/creative focused
- Used in low-light environments
- Reducing eye strain for extended use
- User preference indicates dark mode

**Choose large scale when:**
- Target audience needs better readability
- Touch interface is primary input
- Accessibility is a priority
- Mobile or tablet focused

### Performance considerations

- Theme switches should be instant (no transitions on root)
- Avoid inline style overrides; use classes
- Minimize custom token overrides for maintainability
- Cache theme preference in localStorage

### Accessibility

- Respect system color scheme preferences
- Provide theme switcher if custom themes used
- Ensure sufficient contrast in custom themes
- Test components in all supported themes
- Support Windows High Contrast Mode
- Maintain focus indicators in all themes

### Maintenance

- Use semantic tokens rather than direct color values
- Document custom theme overrides
- Test theme switching thoroughly
- Keep custom themes minimal
- Follow Spectrum token naming conventions

## Common patterns

### Theme switcher component

```html
<div class="theme-switcher">
  <button
    class="spectrum-ActionButton"
    onclick="setTheme('light')"
    aria-label="Light theme"
  >
    <svg class="spectrum-Icon"><!-- sun icon --></svg>
  </button>
  <button
    class="spectrum-ActionButton"
    onclick="setTheme('dark')"
    aria-label="Dark theme"
  >
    <svg class="spectrum-Icon"><!-- moon icon --></svg>
  </button>
</div>
```

### Persistent theme preference

```javascript
// Save theme preference
function setTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('spectrum--light', 'spectrum--dark');
  root.classList.add(`spectrum--${theme}`);
  localStorage.setItem('theme', theme);
}

// Load saved preference
function loadTheme() {
  const saved = localStorage.getItem('theme');
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = saved || systemPreference;
  setTheme(theme);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadTheme);
```

### Branded color customization

```css
/* Override accent colors for branding */
.branded-app {
  --spectrum-accent-background-color-default: var(--brand-primary);
  --spectrum-accent-background-color-hover: var(--brand-primary-hover);
  --spectrum-accent-background-color-down: var(--brand-primary-active);
  --spectrum-accent-content-color-default: var(--brand-primary-contrast);
}

:root {
  --brand-primary: #7B16FF;
  --brand-primary-hover: #6B14E6;
  --brand-primary-active: #5C12CC;
  --brand-primary-contrast: #FFFFFF;
}
```

## Related patterns

- [Static color patterns](./static-color-patterns.md)
- [Sizing patterns](./sizing-patterns.md)
- [State patterns](./state-patterns.md)
