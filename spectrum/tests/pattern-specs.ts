/**
 * Spectrum Pattern Specifications
 * 
 * Defines the expected structure, styles, and behavior for each Spectrum UI pattern.
 * These specs are based on Adobe Spectrum Design System guidelines.
 * 
 * @see https://spectrum.adobe.com/
 */

export interface PatternSpec {
  name: string;
  description: string;
  requiredAttributes?: string[];
  requiredChildren?: string[];
  allowedElements?: string[];
  cssProperties?: CSSPropertySpec[];
  ariaRequirements?: AriaSpec;
  structureValidation?: (element: Element) => ValidationResult;
  styleValidation?: (element: Element, computedStyle: CSSStyleDeclaration) => ValidationResult;
}

export interface CSSPropertySpec {
  property: string;
  expectedValue?: string | string[];
  expectedPattern?: RegExp;
  tokenSource?: string; // e.g., "spectrum-button-background-color"
  context?: string; // When this rule applies (e.g., "hover", "disabled")
}

export interface AriaSpec {
  requiredRoles?: string[];
  requiredLabels?: string[]; // aria-label, aria-labelledby, etc.
  requiredStates?: string[]; // aria-checked, aria-selected, etc.
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Spectrum Button Patterns
 */
export const BUTTON_PATTERNS: Record<string, PatternSpec> = {
  'button': {
    name: 'Button (Standard)',
    description: 'Standard Spectrum button',
    allowedElements: ['button', 'sp-button'],
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' },
      { property: 'border-radius', tokenSource: 'spectrum-button-border-radius' },
      { property: 'padding', tokenSource: 'spectrum-button-padding' }
    ],
    ariaRequirements: {
      requiredLabels: ['aria-label', 'textContent', 'title']
    }
  },
  
  'button-primary': {
    name: 'Button (Primary)',
    description: 'Primary action button - highest emphasis',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['variant="primary"'], // For sp-button
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  },
  
  'button-accent': {
    name: 'Button (Accent)',
    description: 'Accent button - call-to-action emphasis',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['variant="accent"'], // For sp-button
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  },
  
  'button-secondary': {
    name: 'Button (Secondary)',
    description: 'Secondary button - medium emphasis',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['variant="secondary"'], // For sp-button
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  },
  
  'button-negative': {
    name: 'Button (Negative)',
    description: 'Destructive action button',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['variant="negative"'], // For sp-button
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  },
  
  'button-disabled': {
    name: 'Button (Disabled)',
    description: 'Button in disabled state',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['disabled'],
    cssProperties: [
      { property: 'cursor', expectedValue: ['not-allowed', 'default'] },
      { property: 'pointer-events', expectedValue: 'none' }
    ],
    ariaRequirements: {
      requiredStates: ['aria-disabled="true"', 'disabled']
    }
  },
  
  'button-pending': {
    name: 'Button (Pending)',
    description: 'Button showing loading/pending state',
    allowedElements: ['button', 'sp-button'],
    requiredAttributes: ['pending'], // For sp-button
    ariaRequirements: {
      requiredStates: ['aria-busy="true"']
    }
  }
};

/**
 * Spectrum Action Button Patterns
 */
export const ACTION_BUTTON_PATTERNS: Record<string, PatternSpec> = {
  'action-button': {
    name: 'Action Button',
    description: 'Compact action button, typically icon-only',
    allowedElements: ['button', 'sp-action-button'],
    ariaRequirements: {
      requiredLabels: ['aria-label', 'title']
    }
  },
  
  'action-button-quiet': {
    name: 'Action Button (Quiet)',
    description: 'Subdued action button, visible on hover',
    allowedElements: ['button', 'sp-action-button'],
    requiredAttributes: ['quiet'],
    ariaRequirements: {
      requiredLabels: ['aria-label', 'title']
    }
  },
  
  'action-button-selected': {
    name: 'Action Button (Selected)',
    description: 'Action button in selected state',
    allowedElements: ['button', 'sp-action-button'],
    requiredAttributes: ['selected', 'aria-pressed="true"'],
    ariaRequirements: {
      requiredStates: ['selected', 'aria-pressed="true"']
    }
  }
};

/**
 * Spectrum Action Group Patterns
 */
export const ACTION_GROUP_PATTERNS: Record<string, PatternSpec> = {
  'action-group-horizontal': {
    name: 'Action Group (Horizontal)',
    description: 'Horizontal group of action buttons',
    allowedElements: ['div', 'sp-action-group'],
    structureValidation: (element) => {
      const children = Array.from(element.children);
      const hasActionButtons = children.some(child => 
        child.tagName.toLowerCase() === 'sp-action-button' || 
        child.hasAttribute('data-spectrum-pattern') && 
        child.getAttribute('data-spectrum-pattern')?.includes('action-button')
      );
      
      return {
        valid: hasActionButtons,
        errors: hasActionButtons ? [] : ['Action group must contain action buttons'],
        warnings: []
      };
    }
  },
  
  'action-group-vertical': {
    name: 'Action Group (Vertical)',
    description: 'Vertical group of action buttons',
    allowedElements: ['div', 'sp-action-group'],
    requiredAttributes: ['vertical']
  }
};

/**
 * Spectrum Form Patterns
 */
export const FORM_PATTERNS: Record<string, PatternSpec> = {
  'form': {
    name: 'Form',
    description: 'Form container with proper spacing and layout',
    allowedElements: ['form', 'div'],
    structureValidation: (element) => {
      const hasFormElements = Array.from(element.querySelectorAll('input, textarea, select, sp-textfield, sp-picker')).length > 0;
      
      return {
        valid: hasFormElements,
        errors: hasFormElements ? [] : ['Form must contain form elements'],
        warnings: []
      };
    }
  },
  
  'form-item': {
    name: 'Form Item',
    description: 'Individual form field container',
    allowedElements: ['div'],
    structureValidation: (element) => {
      const hasLabel = element.querySelector('label, sp-field-label, [data-spectrum-pattern*="field-label"]');
      const hasInput = element.querySelector('input, textarea, select, sp-textfield, sp-picker');
      
      return {
        valid: true,
        errors: [],
        warnings: [
          !hasLabel ? 'Form item should have a label' : null,
          !hasInput ? 'Form item should have an input element' : null
        ].filter(Boolean) as string[]
      };
    }
  },
  
  'field-label': {
    name: 'Field Label',
    description: 'Label for form fields',
    allowedElements: ['label', 'sp-field-label'],
    ariaRequirements: {
      requiredLabels: ['for', 'id'] // Label should be associated with input
    }
  },
  
  'textfield': {
    name: 'Text Field',
    description: 'Text input field',
    allowedElements: ['input', 'sp-textfield'],
    ariaRequirements: {
      requiredLabels: ['aria-label', 'aria-labelledby', 'label']
    }
  },
  
  'textfield-invalid': {
    name: 'Text Field (Invalid)',
    description: 'Text field in error state',
    allowedElements: ['input', 'sp-textfield'],
    requiredAttributes: ['invalid', 'aria-invalid="true"'],
    ariaRequirements: {
      requiredStates: ['aria-invalid="true"']
    }
  },
  
  'help-text': {
    name: 'Help Text',
    description: 'Descriptive text for form fields',
    allowedElements: ['div', 'span', 'p', 'sp-help-text'],
    cssProperties: [
      { property: 'font-size', tokenSource: 'spectrum-font-size-75' }
    ]
  },
  
  'help-text-negative': {
    name: 'Help Text (Error)',
    description: 'Error message for form fields',
    allowedElements: ['div', 'span', 'p', 'sp-help-text'],
    cssProperties: [
      { property: 'font-size', tokenSource: 'spectrum-font-size-75' }
    ],
    ariaRequirements: {
      requiredRoles: ['alert']
    }
  }
};

/**
 * Spectrum Dialog Patterns
 */
export const DIALOG_PATTERNS: Record<string, PatternSpec> = {
  'dialog': {
    name: 'Dialog',
    description: 'Dialog container',
    allowedElements: ['div', 'sp-dialog'],
    ariaRequirements: {
      requiredRoles: ['dialog'],
      requiredLabels: ['aria-label', 'aria-labelledby']
    },
    structureValidation: (element) => {
      const hasHeading = element.querySelector('[data-spectrum-pattern*="dialog-heading"]');
      const hasContent = element.querySelector('[data-spectrum-pattern*="dialog-content"]');
      
      return {
        valid: true,
        errors: [],
        warnings: [
          !hasHeading ? 'Dialog should have a heading' : null,
          !hasContent ? 'Dialog should have content' : null
        ].filter(Boolean) as string[]
      };
    }
  },
  
  'dialog-heading': {
    name: 'Dialog Heading',
    description: 'Dialog title/heading',
    allowedElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'],
    cssProperties: [
      { property: 'font-weight', expectedValue: ['600', '700', 'bold'] }
    ]
  },
  
  'dialog-content': {
    name: 'Dialog Content',
    description: 'Dialog main content area',
    allowedElements: ['div', 'section']
  },
  
  'dialog-footer': {
    name: 'Dialog Footer',
    description: 'Dialog actions footer',
    allowedElements: ['div', 'footer'],
    structureValidation: (element) => {
      const hasButtons = element.querySelectorAll('button, sp-button').length > 0;
      
      return {
        valid: true,
        errors: [],
        warnings: hasButtons ? [] : ['Dialog footer should contain action buttons']
      };
    }
  },
  
  'dialog-close': {
    name: 'Dialog Close Button',
    description: 'Close button for dialog',
    allowedElements: ['button', 'sp-action-button'],
    ariaRequirements: {
      requiredLabels: ['aria-label="Close"', 'title="Close"']
    }
  },
  
  'modal': {
    name: 'Modal',
    description: 'Modal dialog (blocks interaction)',
    allowedElements: ['div', 'sp-dialog'],
    ariaRequirements: {
      requiredRoles: ['dialog'],
      requiredStates: ['aria-modal="true"']
    }
  },
  
  'modal-overlay': {
    name: 'Modal Overlay',
    description: 'Dark overlay behind modal',
    allowedElements: ['div'],
    cssProperties: [
      { property: 'position', expectedValue: 'fixed' },
      { property: 'z-index', expectedPattern: /\d+/ }
    ]
  },
  
  'underlay': {
    name: 'Underlay',
    description: 'Overlay backdrop for dialogs',
    allowedElements: ['div', 'sp-underlay'],
    cssProperties: [
      { property: 'position', expectedValue: 'fixed' }
    ]
  }
};

/**
 * Spectrum Menu Patterns
 */
export const MENU_PATTERNS: Record<string, PatternSpec> = {
  'menu': {
    name: 'Menu',
    description: 'Menu container',
    allowedElements: ['div', 'ul', 'sp-menu'],
    ariaRequirements: {
      requiredRoles: ['menu', 'listbox']
    },
    structureValidation: (element) => {
      const hasMenuItems = element.querySelectorAll('[data-spectrum-pattern*="menu-item"]').length > 0;
      
      return {
        valid: hasMenuItems,
        errors: hasMenuItems ? [] : ['Menu must contain menu items'],
        warnings: []
      };
    }
  },
  
  'menu-item': {
    name: 'Menu Item',
    description: 'Individual menu item',
    allowedElements: ['button', 'div', 'li', 'sp-menu-item'],
    ariaRequirements: {
      requiredRoles: ['menuitem', 'option']
    },
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  },
  
  'menu-item-selectable': {
    name: 'Menu Item (Selectable)',
    description: 'Selectable menu item',
    allowedElements: ['button', 'div', 'li', 'sp-menu-item'],
    ariaRequirements: {
      requiredStates: ['aria-selected']
    }
  },
  
  'menu-section-heading': {
    name: 'Menu Section Heading',
    description: 'Heading for menu section',
    allowedElements: ['div', 'span', 'h3', 'h4'],
    cssProperties: [
      { property: 'font-weight', expectedValue: ['600', '700', 'bold'] },
      { property: 'font-size', tokenSource: 'spectrum-font-size-75' }
    ]
  }
};

/**
 * Spectrum List Patterns
 */
export const LIST_PATTERNS: Record<string, PatternSpec> = {
  'list': {
    name: 'List',
    description: 'List container',
    allowedElements: ['ul', 'ol', 'div'],
    ariaRequirements: {
      requiredRoles: ['list', 'listbox']
    }
  },
  
  'list-item': {
    name: 'List Item',
    description: 'List item',
    allowedElements: ['li', 'div'],
    ariaRequirements: {
      requiredRoles: ['listitem']
    }
  },
  
  'list-item-selectable': {
    name: 'List Item (Selectable)',
    description: 'Selectable list item',
    allowedElements: ['li', 'div', 'button'],
    ariaRequirements: {
      requiredStates: ['aria-selected']
    },
    cssProperties: [
      { property: 'cursor', expectedValue: 'pointer' }
    ]
  }
};

/**
 * Spectrum Tabs Patterns
 */
export const TAB_PATTERNS: Record<string, PatternSpec> = {
  'tabs': {
    name: 'Tabs',
    description: 'Tab navigation container',
    allowedElements: ['div', 'sp-tabs'],
    ariaRequirements: {
      requiredRoles: ['tablist']
    }
  },
  
  'tab-item': {
    name: 'Tab',
    description: 'Individual tab button',
    allowedElements: ['button', 'sp-tab'],
    ariaRequirements: {
      requiredRoles: ['tab'],
      requiredStates: ['aria-selected']
    }
  },
  
  'tab-selected': {
    name: 'Tab (Selected)',
    description: 'Selected tab',
    allowedElements: ['button', 'sp-tab'],
    requiredAttributes: ['aria-selected="true"', 'selected'],
    ariaRequirements: {
      requiredStates: ['aria-selected="true"']
    }
  }
};

/**
 * Spectrum State Patterns
 */
export const STATE_PATTERNS: Record<string, PatternSpec> = {
  'hover': {
    name: 'Hover State',
    description: 'Element in hover state',
    allowedElements: ['*'] // Any element
  },
  
  'focus': {
    name: 'Focus State',
    description: 'Element in focus state',
    allowedElements: ['*'],
    cssProperties: [
      { property: 'outline', expectedPattern: /.*/ }, // Should have outline or focus-visible
    ]
  },
  
  'active': {
    name: 'Active State',
    description: 'Element in active/pressed state',
    allowedElements: ['*']
  },
  
  'disabled': {
    name: 'Disabled State',
    description: 'Element in disabled state',
    allowedElements: ['*'],
    requiredAttributes: ['disabled', 'aria-disabled="true"'],
    cssProperties: [
      { property: 'cursor', expectedValue: ['not-allowed', 'default'] }
    ]
  },
  
  'selected': {
    name: 'Selected State',
    description: 'Element in selected state',
    allowedElements: ['*'],
    ariaRequirements: {
      requiredStates: ['aria-selected="true"', 'selected', 'aria-pressed="true"']
    }
  }
};

/**
 * Spectrum Popover Patterns
 */
export const POPOVER_PATTERNS: Record<string, PatternSpec> = {
  'popover': {
    name: 'Popover',
    description: 'Popover container',
    allowedElements: ['div', 'sp-popover'],
    ariaRequirements: {
      requiredRoles: ['dialog', 'menu']
    }
  },
  
  'popover-open': {
    name: 'Popover (Open)',
    description: 'Visible popover',
    allowedElements: ['div', 'sp-popover'],
    cssProperties: [
      { property: 'display', expectedValue: ['block', 'flex', 'grid'] },
      { property: 'visibility', expectedValue: 'visible' }
    ]
  }
};

/**
 * All Pattern Specs Combined
 */
export const ALL_PATTERN_SPECS: Record<string, PatternSpec> = {
  ...BUTTON_PATTERNS,
  ...ACTION_BUTTON_PATTERNS,
  ...ACTION_GROUP_PATTERNS,
  ...FORM_PATTERNS,
  ...DIALOG_PATTERNS,
  ...MENU_PATTERNS,
  ...LIST_PATTERNS,
  ...TAB_PATTERNS,
  ...STATE_PATTERNS,
  ...POPOVER_PATTERNS
};

/**
 * Helper to get pattern spec by shortcode
 */
export function getPatternSpec(shortcode: string): PatternSpec | undefined {
  return ALL_PATTERN_SPECS[shortcode];
}

/**
 * Helper to get all pattern shortcodes
 */
export function getAllPatternShortcodes(): string[] {
  return Object.keys(ALL_PATTERN_SPECS);
}

