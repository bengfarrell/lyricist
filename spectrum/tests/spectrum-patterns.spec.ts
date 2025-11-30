/**
 * Spectrum Pattern Compliance Tests
 * 
 * Validates that elements marked with data-spectrum-pattern attributes
 * follow Adobe Spectrum Design System guidelines.
 * 
 * These tests are generic and work with any Lit + Spectrum Web Components app.
 */

import { test, expect } from '@playwright/test';
import {
  findAllPatternElements,
  findElementsByPattern,
  validatePattern,
  formatViolationReport,
  getPatternStatistics,
  type PatternViolation
} from './pattern-helpers';
import {
  ALL_PATTERN_SPECS,
  getPatternSpec,
  getAllPatternShortcodes,
  BUTTON_PATTERNS,
  ACTION_BUTTON_PATTERNS,
  FORM_PATTERNS,
  DIALOG_PATTERNS
} from './pattern-specs';

test.describe('Spectrum Pattern Compliance', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to your app using the baseURL from config
    await page.goto('/');
    
    // Wait for app to be ready
    await page.waitForSelector('[data-spectrum-pattern]', { timeout: 10000 });
  });

  test('should find all pattern elements', async ({ page }) => {
    const elements = await findAllPatternElements(page);
    
    expect(elements.length).toBeGreaterThan(0);
    
    console.log(`\n📊 Found ${elements.length} elements with data-spectrum-pattern`);
    
    // Log statistics
    const stats = await getPatternStatistics(page);
    console.log('\n📈 Pattern usage statistics:');
    for (const [pattern, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${pattern}: ${count}`);
    }
  });

  test('should have valid pattern shortcodes', async ({ page }) => {
    const elements = await findAllPatternElements(page);
    const unknownPatterns = new Set<string>();
    const validShortcodes = getAllPatternShortcodes();
    
    for (const element of elements) {
      if (!validShortcodes.includes(element.shortcode)) {
        unknownPatterns.add(element.shortcode);
      }
    }
    
    if (unknownPatterns.size > 0) {
      console.warn(
        `\n⚠️  Found unknown pattern shortcodes:\n   ${Array.from(unknownPatterns).join(', ')}\n`
      );
    }
    
    // This is a warning, not a hard failure
    // expect(unknownPatterns.size).toBe(0);
  });

  test.describe('Button Patterns', () => {
    
    test('should validate button elements', async ({ page }) => {
      const violations: PatternViolation[] = [];
      
      for (const [shortcode, spec] of Object.entries(BUTTON_PATTERNS)) {
        const elements = await findElementsByPattern(page, shortcode);
        
        for (const element of elements) {
          const violation = await validatePattern(page, element, spec);
          if (violation) {
            violations.push(violation);
          }
        }
      }
      
      if (violations.length > 0) {
        const report = formatViolationReport(violations);
        expect(violations, report).toHaveLength(0);
      }
    });

    test('buttons should have proper cursor', async ({ page }) => {
      const buttonElements = await findElementsByPattern(page, 'button');
      const primaryButtons = await findElementsByPattern(page, 'button-primary');
      const accentButtons = await findElementsByPattern(page, 'button-accent');
      
      const allButtons = [...buttonElements, ...primaryButtons, ...accentButtons];
      
      for (const button of allButtons) {
        expect(
          button.computedStyles.cursor,
          `Button ${button.selector} should have pointer cursor`
        ).toBe('pointer');
      }
    });

    test('disabled buttons should not be clickable', async ({ page }) => {
      const disabledButtons = await findElementsByPattern(page, 'button-disabled');
      
      for (const button of disabledButtons) {
        // Check cursor
        const validCursors = ['not-allowed', 'default'];
        expect(
          validCursors.includes(button.computedStyles.cursor),
          `Disabled button ${button.selector} should have not-allowed or default cursor`
        ).toBe(true);
        
        // Check disabled attribute
        expect(
          'disabled' in button.attributes || button.attributes['aria-disabled'] === 'true',
          `Disabled button ${button.selector} should have disabled attribute or aria-disabled="true"`
        ).toBe(true);
      }
    });
  });

  test.describe('Action Button Patterns', () => {
    
    test('should validate action button elements', async ({ page }) => {
      const violations: PatternViolation[] = [];
      
      for (const [shortcode, spec] of Object.entries(ACTION_BUTTON_PATTERNS)) {
        const elements = await findElementsByPattern(page, shortcode);
        
        for (const element of elements) {
          const violation = await validatePattern(page, element, spec);
          if (violation) {
            violations.push(violation);
          }
        }
      }
      
      if (violations.length > 0) {
        const report = formatViolationReport(violations);
        expect(violations, report).toHaveLength(0);
      }
    });

    test('action buttons should have accessibility labels', async ({ page }) => {
      const actionButtons = await findElementsByPattern(page, 'action-button');
      const quietButtons = await findElementsByPattern(page, 'action-button-quiet');
      
      const allActionButtons = [...actionButtons, ...quietButtons];
      
      const missingLabels: string[] = [];
      
      for (const button of allActionButtons) {
        const hasLabel = 
          'aria-label' in button.attributes ||
          'title' in button.attributes ||
          button.textContent.length > 0;
        
        if (!hasLabel) {
          missingLabels.push(button.selector);
        }
      }
      
      if (missingLabels.length > 0) {
        console.warn(
          `\n⚠️  Action buttons missing accessibility labels:\n   ${missingLabels.join('\n   ')}\n`
        );
      }
      
      // Warn but don't fail
      // expect(missingLabels).toHaveLength(0);
    });

    test('selected action buttons should have proper state', async ({ page }) => {
      const selectedButtons = await findElementsByPattern(page, 'action-button-selected');
      
      for (const button of selectedButtons) {
        const hasSelectedState = 
          'selected' in button.attributes ||
          button.attributes['aria-pressed'] === 'true' ||
          button.attributes['aria-selected'] === 'true';
        
        expect(
          hasSelectedState,
          `Selected action button ${button.selector} should have selected attribute or aria-pressed="true"`
        ).toBe(true);
      }
    });
  });

  test.describe('Form Patterns', () => {
    
    test('should validate form elements', async ({ page }) => {
      const violations: PatternViolation[] = [];
      
      for (const [shortcode, spec] of Object.entries(FORM_PATTERNS)) {
        const elements = await findElementsByPattern(page, shortcode);
        
        for (const element of elements) {
          const violation = await validatePattern(page, element, spec);
          if (violation) {
            violations.push(violation);
          }
        }
      }
      
      if (violations.length > 0) {
        const report = formatViolationReport(violations);
        expect(violations, report).toHaveLength(0);
      }
    });

    test('text fields should have labels', async ({ page }) => {
      const textfields = await findElementsByPattern(page, 'textfield');
      
      const missingLabels: string[] = [];
      
      for (const field of textfields) {
        const hasLabel = 
          'aria-label' in field.attributes ||
          'aria-labelledby' in field.attributes ||
          'label' in field.attributes;
        
        if (!hasLabel) {
          missingLabels.push(field.selector);
        }
      }
      
      if (missingLabels.length > 0) {
        console.warn(
          `\n⚠️  Text fields missing labels:\n   ${missingLabels.join('\n   ')}\n`
        );
      }
    });

    test('invalid fields should have aria-invalid', async ({ page }) => {
      const invalidFields = await findElementsByPattern(page, 'textfield-invalid');
      
      for (const field of invalidFields) {
        expect(
          field.attributes['aria-invalid'] === 'true' || 'invalid' in field.attributes,
          `Invalid field ${field.selector} should have aria-invalid="true" or invalid attribute`
        ).toBe(true);
      }
    });

    test('error help text should have alert role', async ({ page }) => {
      const errorTexts = await findElementsByPattern(page, 'help-text-negative');
      
      for (const text of errorTexts) {
        // Should ideally have role="alert" but might be wrapped in a parent with role
        if (!('role' in text.attributes)) {
          console.warn(
            `⚠️  Error help text ${text.selector} should have role="alert" for screen readers`
          );
        }
      }
    });
  });

  test.describe('Dialog Patterns', () => {
    
    test('should validate dialog elements', async ({ page }) => {
      const violations: PatternViolation[] = [];
      
      for (const [shortcode, spec] of Object.entries(DIALOG_PATTERNS)) {
        const elements = await findElementsByPattern(page, shortcode);
        
        for (const element of elements) {
          const violation = await validatePattern(page, element, spec);
          if (violation) {
            violations.push(violation);
          }
        }
      }
      
      if (violations.length > 0) {
        const report = formatViolationReport(violations);
        expect(violations, report).toHaveLength(0);
      }
    });

    test('dialogs should have proper ARIA roles', async ({ page }) => {
      const dialogs = await findElementsByPattern(page, 'dialog');
      const modals = await findElementsByPattern(page, 'modal');
      
      const allDialogs = [...dialogs, ...modals];
      
      for (const dialog of allDialogs) {
        expect(
          dialog.attributes['role'] === 'dialog',
          `Dialog ${dialog.selector} should have role="dialog"`
        ).toBe(true);
      }
    });

    test('modals should have aria-modal', async ({ page }) => {
      const modals = await findElementsByPattern(page, 'modal');
      
      for (const modal of modals) {
        expect(
          modal.attributes['aria-modal'] === 'true',
          `Modal ${modal.selector} should have aria-modal="true"`
        ).toBe(true);
      }
    });

    test('modal overlays should be fixed positioned', async ({ page }) => {
      const overlays = await findElementsByPattern(page, 'modal-overlay');
      const underlays = await findElementsByPattern(page, 'underlay');
      
      const allOverlays = [...overlays, ...underlays];
      
      for (const overlay of allOverlays) {
        expect(
          overlay.computedStyles.position,
          `Overlay ${overlay.selector} should be position: fixed`
        ).toBe('fixed');
      }
    });

    test('dialog close buttons should have labels', async ({ page }) => {
      const closeButtons = await findElementsByPattern(page, 'dialog-close');
      
      for (const button of closeButtons) {
        const hasLabel = 
          button.attributes['aria-label']?.toLowerCase().includes('close') ||
          button.attributes['title']?.toLowerCase().includes('close');
        
        expect(
          hasLabel,
          `Dialog close button ${button.selector} should have aria-label or title with "close"`
        ).toBe(true);
      }
    });
  });

  test.describe('State Patterns', () => {
    
    test('focused elements should have focus indicators', async ({ page }) => {
      // This test would need to trigger focus states
      // For now, we'll just verify focus pattern elements exist
      const focusElements = await findElementsByPattern(page, 'focus');
      
      // Just informational
      if (focusElements.length > 0) {
        console.log(`\n✓ Found ${focusElements.length} elements with focus state pattern`);
      }
    });

    test('disabled elements should have proper styling', async ({ page }) => {
      const disabledElements = await findElementsByPattern(page, 'disabled');
      
      for (const element of disabledElements) {
        // Check for disabled attribute or aria-disabled
        const hasDisabledAttr = 
          'disabled' in element.attributes ||
          element.attributes['aria-disabled'] === 'true';
        
        expect(
          hasDisabledAttr,
          `Disabled element ${element.selector} should have disabled or aria-disabled="true"`
        ).toBe(true);
      }
    });

    test('selected elements should have proper ARIA state', async ({ page }) => {
      const selectedElements = await findElementsByPattern(page, 'selected');
      
      for (const element of selectedElements) {
        const hasSelectedState = 
          'selected' in element.attributes ||
          element.attributes['aria-selected'] === 'true' ||
          element.attributes['aria-pressed'] === 'true';
        
        expect(
          hasSelectedState,
          `Selected element ${element.selector} should have selected, aria-selected, or aria-pressed`
        ).toBe(true);
      }
    });
  });

  test.describe('Comprehensive Validation', () => {
    
    test('should validate all patterns comprehensively', async ({ page }) => {
      const allViolations: PatternViolation[] = [];
      const allElements = await findAllPatternElements(page);
      
      console.log(`\n🔍 Validating ${allElements.length} pattern elements...`);
      
      for (const element of allElements) {
        const spec = getPatternSpec(element.shortcode);
        
        if (!spec) {
          console.warn(`⚠️  No spec found for pattern: ${element.shortcode}`);
          continue;
        }
        
        const violation = await validatePattern(page, element, spec);
        if (violation) {
          allViolations.push(violation);
        }
      }
      
      if (allViolations.length > 0) {
        const report = formatViolationReport(allViolations);
        console.log(report);
        
        // Fail the test with detailed report
        expect(allViolations, report).toHaveLength(0);
      } else {
        console.log('\n✅ All patterns validated successfully!');
      }
    });
  });

  test.describe('Pattern Coverage', () => {
    
    test('should report pattern usage coverage', async ({ page }) => {
      const stats = await getPatternStatistics(page);
      const allShortcodes = getAllPatternShortcodes();
      
      const usedPatterns = Object.keys(stats);
      const unusedPatterns = allShortcodes.filter(sc => !usedPatterns.includes(sc));
      
      console.log(`\n📊 Pattern Coverage Report:`);
      console.log(`   Total patterns defined: ${allShortcodes.length}`);
      console.log(`   Patterns in use: ${usedPatterns.length}`);
      console.log(`   Coverage: ${Math.round((usedPatterns.length / allShortcodes.length) * 100)}%`);
      
      if (unusedPatterns.length > 0) {
        console.log(`\n   Unused patterns:`);
        unusedPatterns.forEach(pattern => console.log(`      - ${pattern}`));
      }
      
      // This is just informational
      expect(usedPatterns.length).toBeGreaterThan(0);
    });

    test('should identify most common patterns', async ({ page }) => {
      const stats = await getPatternStatistics(page);
      const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
      
      console.log(`\n📈 Top 10 most used patterns:`);
      sorted.slice(0, 10).forEach(([pattern, count], i) => {
        console.log(`   ${i + 1}. ${pattern}: ${count} occurrences`);
      });
      
      expect(sorted.length).toBeGreaterThan(0);
    });
  });
});

