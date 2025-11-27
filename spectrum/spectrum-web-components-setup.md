# Spectrum Web Components Setup Guide

This guide documents the proper setup for Adobe Spectrum Web Components to work seamlessly with Figma MCP integration.

## Prerequisites

- Node.js project with Lit and TypeScript
- Figma MCP integration already configured
- Established View/ReactiveController pattern

## Step-by-Step Setup

### 1. Install Required Packages

```bash
npm install @spectrum-web-components/bundle```

### 2. Configure Main Application File

In your main application file (e.g., `src/main.ts`), add these imports at the top:

```typescript
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/spectrum-two/core.js';
import '@spectrum-web-components/theme/src/spectrum-two/themes-core-tokens.js';
```

### 3. Set Up Icons (Required)

Spectrum icons are essential for most components and require their own setup:

**Important**: Icons must be imported individually in each component that uses them. You cannot import the entire icons package globally.

**Icon Search**: Find available icons at the [official Spectrum Icons Workflow page](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/). This is the definitive resource for discovering and understanding available icons.

### 4. Wrap Application with sp-theme

In your main application's render method, wrap the entire DOM tree:

```typescript
return html`
  <sp-theme scale="medium" color="light" system="spectrum-two">
    <!-- Your entire application content -->
    <app-header></app-header>
    <div class="app-container">
      <!-- ... rest of your app ... -->
    </div>
  </sp-theme>
`;
```

### 5. Component Implementation Pattern

For each component that uses Spectrum components, follow this pattern:

```typescript
// Import only the specific components you need for this component
import '@spectrum-web-components/[component-name]/sp-[component-name].js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-[icon-name].js';
// ... other specific imports as needed

// Use the components in your render method
render() {
  return html`
    <sp-[component-name] [attributes]>
      <sp-icon-[icon-name] slot="icon"></sp-icon-[icon-name]>
    </sp-[component-name]>
  `;
}
```

**Examples:**
- For buttons: `import '@spectrum-web-components/button/sp-button.js';`
- For action buttons: `import '@spectrum-web-components/action-button/sp-action-button.js';`
- For icons: `import '@spectrum-web-components/icons-workflow/icons/sp-icon-menu-hamburger.js';`

**Key**: Only import what you actually use in each component to avoid conflicts and keep bundles lean.

## Key Principles

### ✅ Do This
- Import theme fragments in main.ts for global CSS variables
- Wrap entire app with `<sp-theme>` in main.ts
- Import individual components in each component file
- Keep component styles local to each component
- Use established View/ReactiveController pattern

### ❌ Don't Do This
- Import the bundle (`@spectrum-web-components/bundle/elements.js`)
- Wrap individual components with `<sp-theme>`
- Import theme fragments in component files
- Mix bundle and individual imports (causes conflicts)

## Common Issues & Solutions

### Issue: "sp-underlay has already been used with this registry"
**Cause**: Multiple imports of the same component
**Solution**: Use only individual component imports, never the bundle

### Issue: "system/color/scale fragment has not been loaded"
**Cause**: Missing theme fragment imports
**Solution**: Import theme fragments in main.ts, not in components

### Issue: Icons not displaying
**Cause**: Missing workflow icons import
**Solution**: Import `@spectrum-web-components/icons-workflow` and use specific icon imports

## File Structure

```
src/
├── main.ts                           # Theme imports + sp-theme wrapper
├── components/
│   └── app-header/
│       ├── app-header.ts             # Individual component imports
│       └── app-header-controller.ts
```

## Testing Your Setup

1. Build the project: `npm run build`
2. Start dev server: `npm run dev`
3. Check browser console for theme warnings
4. Verify Spectrum components render correctly
5. Confirm CSS variables are available in dev tools

## Future Figma MCP Usage

Once configured, you can:
- Use Figma MCP to import new designs
- Add new Spectrum components by importing individual packages
- Maintain consistent theming across all components
- Avoid reconfiguration for each new design
- See [this Figma help article](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server) for instructions on setting up Figma MCP

## Troubleshooting

If you encounter issues:
1. Check that theme fragments are imported in main.ts
2. Verify no bundle imports exist
3. Ensure sp-theme wrapper is only in main.ts
4. Confirm individual component imports are correct
5. Check that all required packages are installed

This setup ensures a stable foundation for Spectrum Web Components that won't require reconfiguration when adding new Figma MCP designs. 