# Spectrum CSS UI patterns

This directory contains documentation for common UI patterns implemented with Spectrum CSS. These patterns represent best practices and guidelines for building consistent, accessible user interfaces.

## Pattern categories

### Component patterns
- [Button patterns](./button-patterns.md) - Variants, emphasis, and button states
- [Action button patterns](./action-button-patterns.md) - Action buttons, toolbars, and toggles
- [Form patterns](./form-patterns.md) - Field layouts, labels, and form structure
- [Menu patterns](./menu-patterns.md) - Selections, submenus, and menu items
- [Overlay patterns](./overlay-patterns.md) - Modals, popovers, dialogs, and positioning
- [Navigation patterns](./navigation-patterns.md) - Breadcrumbs, pagination, side nav, and tree view

### Layout and structure patterns
- [Sizing patterns](./sizing-patterns.md) - Consistent sizing across components
- [Static color patterns](./static-color-patterns.md) - Usage on colored backgrounds
- [Theming patterns](./theming-patterns.md) - Color schemes, scales, and customization

### Interaction patterns
- [State patterns](./state-patterns.md) - Interactive states and feedback
- [Selection patterns](./selection-patterns.md) - Single and multi-select behaviors
- [Text overflow patterns](./text-overflow-patterns.md) - Truncation and wrapping strategies

## Design Tokens Reference

**📋 [`../tokens.json`](../tokens.json)** - Complete Spectrum design token definitions

This JSON file contains **all official Spectrum design tokens** with their exact values. Use this as the authoritative source when:
- Replacing hard-coded CSS values
- Finding the correct token for a specific pixel value
- Understanding token naming conventions
- Implementing new Spectrum-compliant styles

**Example token lookups:**
- Spacing: `8px` = `--spectrum-spacing-100`
- Border radius: `4px` = `--spectrum-corner-radius-75`
- Colors: `rgb(41,41,41)` = `--spectrum-gray-800`

## About patterns

UI patterns in Spectrum CSS can be:
- **Component-based**: Specific implementations using individual components
- **Compositional**: Combinations of multiple components working together
- **Behavioral**: General usage guidelines that apply across the design system

Each pattern document includes:
- Guidelines and rules for implementation
- Associated CSS classes and modifiers
- Design tokens and CSS custom properties
- Examples and use cases
- Accessibility considerations

## Usage

Reference these patterns when building interfaces with Spectrum CSS to ensure:
- Consistency across your application
- Proper implementation of design system principles
- Accessible user experiences
- Maintainable code that follows established conventions
