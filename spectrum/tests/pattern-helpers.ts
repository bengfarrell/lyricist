/**
 * Pattern Validation Helpers
 * 
 * Utility functions for querying and validating Spectrum UI patterns.
 * These are generic helpers that work with any Lit + Spectrum Web Components app.
 */

import type { Page } from '@playwright/test';
import type { PatternSpec, ValidationResult, CSSPropertySpec } from './pattern-specs';

export interface PatternElement {
  shortcode: string;
  tagName: string;
  attributes: Record<string, string>;
  textContent: string;
  computedStyles: Record<string, string>;
  selector: string;
  hasChildren: boolean;
}

export interface PatternViolation {
  shortcode: string;
  element: PatternElement;
  violations: {
    type: 'structure' | 'style' | 'aria' | 'attribute';
    severity: 'error' | 'warning';
    message: string;
    expected?: string;
    actual?: string;
  }[];
}

/**
 * Query all elements with data-spectrum-pattern attribute
 */
export async function findAllPatternElements(page: Page): Promise<PatternElement[]> {
  return await page.evaluate(() => {
    const elements: PatternElement[] = [];
    const nodeIterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          const element = node as Element;
          // Check in light DOM
          if (element.hasAttribute('data-spectrum-pattern')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          // Check in shadow DOM
          if (element.shadowRoot) {
            const shadowElements = element.shadowRoot.querySelectorAll('[data-spectrum-pattern]');
            if (shadowElements.length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let currentNode;
    while ((currentNode = nodeIterator.nextNode())) {
      const element = currentNode as Element;
      
      // Helper to process an element
      const processElement = (el: Element, inShadowRoot = false) => {
        const shortcodes = el.getAttribute('data-spectrum-pattern')?.split(' ') || [];
        const computedStyle = window.getComputedStyle(el);
        
        // Build selector
        let selector = el.tagName.toLowerCase();
        if (el.id) selector += `#${el.id}`;
        if (el.className) selector += `.${Array.from(el.classList).join('.')}`;
        if (inShadowRoot) selector = 'shadowRoot → ' + selector;
        
        // Get all attributes
        const attributes: Record<string, string> = {};
        for (const attr of Array.from(el.attributes)) {
          attributes[attr.name] = attr.value;
        }
        
        // Get relevant computed styles
        const computedStyles: Record<string, string> = {};
        const stylesToCapture = [
          'display', 'position', 'cursor', 'pointer-events',
          'color', 'background-color', 'border-color',
          'font-size', 'font-weight', 'line-height',
          'padding', 'margin', 'border-radius',
          'width', 'height', 'min-width', 'min-height',
          'z-index', 'opacity', 'visibility',
          'flex-direction', 'justify-content', 'align-items',
          'gap', 'outline'
        ];
        
        for (const prop of stylesToCapture) {
          computedStyles[prop] = computedStyle.getPropertyValue(prop);
        }
        
        shortcodes.forEach(shortcode => {
          elements.push({
            shortcode: shortcode.trim(),
            tagName: el.tagName.toLowerCase(),
            attributes,
            textContent: el.textContent?.trim() || '',
            computedStyles,
            selector,
            hasChildren: el.children.length > 0
          });
        });
      };
      
      // Process element in light DOM
      if (element.hasAttribute('data-spectrum-pattern')) {
        processElement(element);
      }
      
      // Process elements in shadow DOM
      if (element.shadowRoot) {
        const shadowElements = element.shadowRoot.querySelectorAll('[data-spectrum-pattern]');
        shadowElements.forEach(shadowEl => processElement(shadowEl, true));
      }
    }
    
    return elements;
  });
}

/**
 * Query elements by specific pattern shortcode
 */
export async function findElementsByPattern(
  page: Page,
  shortcode: string
): Promise<PatternElement[]> {
  const allElements = await findAllPatternElements(page);
  return allElements.filter(el => el.shortcode === shortcode);
}

/**
 * Validate CSS properties against spec
 */
export function validateCSSProperties(
  element: PatternElement,
  specs: CSSPropertySpec[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const spec of specs) {
    const actualValue = element.computedStyles[spec.property];
    
    if (!actualValue) {
      warnings.push(`Property '${spec.property}' not found in computed styles`);
      continue;
    }
    
    // Check expected value
    if (spec.expectedValue) {
      const expected = Array.isArray(spec.expectedValue) 
        ? spec.expectedValue 
        : [spec.expectedValue];
      
      if (!expected.some(exp => actualValue === exp || actualValue.includes(exp))) {
        errors.push(
          `Property '${spec.property}' has value '${actualValue}', expected one of: ${expected.join(', ')}`
        );
      }
    }
    
    // Check expected pattern
    if (spec.expectedPattern) {
      if (!spec.expectedPattern.test(actualValue)) {
        errors.push(
          `Property '${spec.property}' has value '${actualValue}', doesn't match pattern ${spec.expectedPattern}`
        );
      }
    }
    
    // Check token source (informational)
    if (spec.tokenSource) {
      // This would require checking if the value comes from a CSS custom property
      // For now, we'll just warn if the value looks hard-coded
      if (actualValue.match(/^#[0-9a-f]{3,6}$/i) || actualValue.match(/^\d+px$/)) {
        warnings.push(
          `Property '${spec.property}' might use hard-coded value '${actualValue}' instead of token '${spec.tokenSource}'`
        );
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate required attributes
 */
export function validateAttributes(
  element: PatternElement,
  requiredAttributes: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const reqAttr of requiredAttributes) {
    // Handle attribute with value (e.g., 'variant="accent"')
    if (reqAttr.includes('=')) {
      const [attrName, expectedValue] = reqAttr.split('=').map(s => s.trim().replace(/['"]/g, ''));
      const actualValue = element.attributes[attrName];
      
      if (!actualValue) {
        errors.push(`Missing required attribute: ${attrName}`);
      } else if (actualValue !== expectedValue) {
        errors.push(
          `Attribute '${attrName}' has value '${actualValue}', expected '${expectedValue}'`
        );
      }
    } else {
      // Just check if attribute exists
      if (!(reqAttr in element.attributes)) {
        errors.push(`Missing required attribute: ${reqAttr}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate ARIA requirements
 */
export function validateAria(
  element: PatternElement,
  spec: PatternSpec
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!spec.ariaRequirements) {
    return { valid: true, errors: [], warnings: [] };
  }
  
  const { requiredRoles, requiredLabels, requiredStates } = spec.ariaRequirements;
  
  // Check required roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(role => element.attributes['role'] === role);
    if (!hasRole) {
      errors.push(
        `Missing required ARIA role. Expected one of: ${requiredRoles.join(', ')}`
      );
    }
  }
  
  // Check required labels
  if (requiredLabels && requiredLabels.length > 0) {
    const hasLabel = requiredLabels.some(label => {
      // Check for attribute-based labels
      if (label.startsWith('aria-')) {
        return label in element.attributes;
      }
      // Check for specific attributes
      if (label === 'textContent') {
        return element.textContent.length > 0;
      }
      return label in element.attributes;
    });
    
    if (!hasLabel) {
      warnings.push(
        `Missing accessibility label. Should have one of: ${requiredLabels.join(', ')}`
      );
    }
  }
  
  // Check required states
  if (requiredStates && requiredStates.length > 0) {
    const hasState = requiredStates.some(state => {
      if (state.includes('=')) {
        const [attrName, expectedValue] = state.split('=').map(s => s.trim().replace(/['"]/g, ''));
        return element.attributes[attrName] === expectedValue;
      }
      return state in element.attributes;
    });
    
    if (!hasState) {
      errors.push(
        `Missing required ARIA state. Expected one of: ${requiredStates.join(', ')}`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate element tag name
 */
export function validateTagName(
  element: PatternElement,
  allowedElements: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (allowedElements.includes('*')) {
    return { valid: true, errors: [], warnings: [] };
  }
  
  const isAllowed = allowedElements.some(tag => 
    element.tagName === tag || element.tagName === `sp-${tag}`
  );
  
  if (!isAllowed) {
    errors.push(
      `Invalid element type '${element.tagName}'. Expected one of: ${allowedElements.join(', ')}`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate an element against its pattern spec
 */
export async function validatePattern(
  page: Page,
  element: PatternElement,
  spec: PatternSpec
): Promise<PatternViolation | null> {
  const violations: PatternViolation['violations'] = [];
  
  // Validate tag name
  if (spec.allowedElements) {
    const tagResult = validateTagName(element, spec.allowedElements);
    if (!tagResult.valid) {
      violations.push(...tagResult.errors.map(msg => ({
        type: 'structure' as const,
        severity: 'error' as const,
        message: msg
      })));
    }
  }
  
  // Validate required attributes
  if (spec.requiredAttributes) {
    const attrResult = validateAttributes(element, spec.requiredAttributes);
    if (!attrResult.valid || attrResult.warnings.length > 0) {
      violations.push(
        ...attrResult.errors.map(msg => ({
          type: 'attribute' as const,
          severity: 'error' as const,
          message: msg
        })),
        ...attrResult.warnings.map(msg => ({
          type: 'attribute' as const,
          severity: 'warning' as const,
          message: msg
        }))
      );
    }
  }
  
  // Validate CSS properties
  if (spec.cssProperties) {
    const cssResult = validateCSSProperties(element, spec.cssProperties);
    if (!cssResult.valid || cssResult.warnings.length > 0) {
      violations.push(
        ...cssResult.errors.map(msg => ({
          type: 'style' as const,
          severity: 'error' as const,
          message: msg
        })),
        ...cssResult.warnings.map(msg => ({
          type: 'style' as const,
          severity: 'warning' as const,
          message: msg
        }))
      );
    }
  }
  
  // Validate ARIA
  if (spec.ariaRequirements) {
    const ariaResult = validateAria(element, spec);
    if (!ariaResult.valid || ariaResult.warnings.length > 0) {
      violations.push(
        ...ariaResult.errors.map(msg => ({
          type: 'aria' as const,
          severity: 'error' as const,
          message: msg
        })),
        ...ariaResult.warnings.map(msg => ({
          type: 'aria' as const,
          severity: 'warning' as const,
          message: msg
        }))
      );
    }
  }
  
  // Run custom structure validation if provided
  if (spec.structureValidation) {
    // Note: This requires running in page context
    const structureResult = await page.evaluate(
      ({ selector, validation }) => {
        const element = document.querySelector(selector);
        if (!element) return { valid: false, errors: ['Element not found'], warnings: [] };
        
        // Execute the validation function
        try {
          const validationFn = new Function('element', `return (${validation})(element);`);
          return validationFn(element);
        } catch (e) {
          return { valid: false, errors: [`Validation error: ${e}`], warnings: [] };
        }
      },
      { 
        selector: element.selector,
        validation: spec.structureValidation.toString()
      }
    );
    
    if (!structureResult.valid || structureResult.warnings.length > 0) {
      violations.push(
        ...structureResult.errors.map(msg => ({
          type: 'structure' as const,
          severity: 'error' as const,
          message: msg
        })),
        ...structureResult.warnings.map(msg => ({
          type: 'structure' as const,
          severity: 'warning' as const,
          message: msg
        }))
      );
    }
  }
  
  // Return violation only if there are issues
  if (violations.length === 0) {
    return null;
  }
  
  return {
    shortcode: element.shortcode,
    element,
    violations
  };
}

/**
 * Format violation report as human-readable string
 */
export function formatViolationReport(violations: PatternViolation[]): string {
  if (violations.length === 0) {
    return '✅ No pattern violations found!';
  }
  
  let report = '\n\n❌ Found Spectrum pattern violations:\n\n';
  
  // Group by shortcode
  const byShortcode = violations.reduce((acc, v) => {
    if (!acc[v.shortcode]) acc[v.shortcode] = [];
    acc[v.shortcode].push(v);
    return acc;
  }, {} as Record<string, PatternViolation[]>);
  
  for (const [shortcode, shortcodeViolations] of Object.entries(byShortcode)) {
    report += `\n📦 Pattern: ${shortcode}\n`;
    report += `   Found ${shortcodeViolations.length} element(s) with issues\n\n`;
    
    for (const violation of shortcodeViolations) {
      report += `   🔍 Element: ${violation.element.selector}\n`;
      report += `      Tag: <${violation.element.tagName}>\n`;
      
      const errors = violation.violations.filter(v => v.severity === 'error');
      const warnings = violation.violations.filter(v => v.severity === 'warning');
      
      if (errors.length > 0) {
        report += `      ❌ Errors:\n`;
        errors.forEach(err => {
          report += `         - [${err.type}] ${err.message}\n`;
        });
      }
      
      if (warnings.length > 0) {
        report += `      ⚠️  Warnings:\n`;
        warnings.forEach(warn => {
          report += `         - [${warn.type}] ${warn.message}\n`;
        });
      }
      
      report += '\n';
    }
  }
  
  const totalErrors = violations.reduce(
    (sum, v) => sum + v.violations.filter(vv => vv.severity === 'error').length,
    0
  );
  const totalWarnings = violations.reduce(
    (sum, v) => sum + v.violations.filter(vv => vv.severity === 'warning').length,
    0
  );
  
  report += `\n📊 Summary:\n`;
  report += `   Total violations: ${violations.length} elements\n`;
  report += `   Errors: ${totalErrors}\n`;
  report += `   Warnings: ${totalWarnings}\n`;
  report += `   Patterns affected: ${Object.keys(byShortcode).length}\n\n`;
  
  return report;
}

/**
 * Get statistics about pattern usage
 */
export async function getPatternStatistics(page: Page): Promise<Record<string, number>> {
  const allElements = await findAllPatternElements(page);
  const stats: Record<string, number> = {};
  
  for (const element of allElements) {
    stats[element.shortcode] = (stats[element.shortcode] || 0) + 1;
  }
  
  return stats;
}

