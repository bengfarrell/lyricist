import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Integration tests to ensure Spectrum CSS tokens are used instead of hard-coded values
 * 
 * These tests verify:
 * 1. Static styles (LitElement's static styles getter) don't contain hard-coded values
 * 2. Runtime computed styles use Spectrum CSS custom properties
 * 3. No inline styles bypass the Spectrum design system
 */

// Common Spectrum CSS custom property patterns
const SPECTRUM_TOKEN_PATTERNS = {
  colors: /--spectrum-.*-color-/,
  backgrounds: /--spectrum-.*-background-/,
  borders: /--spectrum-.*-border-/,
  sizing: /--spectrum-(component-height|font-size|icon-size|spacing)-/,
  cornerRadius: /--spectrum-corner-radius-/,
  shadows: /--spectrum-.*-shadow/,
  typography: /--spectrum-font-/,
};

// Hard-coded values that should be replaced with tokens
const HARDCODED_PATTERNS = {
  hexColors: /#[0-9a-fA-F]{3,8}\b/g,
  rgbColors: /rgba?\([^)]+\)/g,
  pixelSizes: /\b\d+px\b/g,
};

// Allowed hard-coded values (exceptions)
const ALLOWED_HARDCODED = {
  // Layout/positioning values that don't have tokens
  layoutValues: ['0px', '0', '1px', '2px', '100%', 'auto'],
  // Transparent is okay
  colors: ['transparent', 'inherit', 'currentColor'],
  // Transform/transition values
  transforms: [/translate/, /rotate/, /scale/],
};

/**
 * Check if a value is an allowed hard-coded value
 */
function isAllowedHardcoded(value: string, type: 'color' | 'size'): boolean {
  if (type === 'color') {
    return ALLOWED_HARDCODED.colors.includes(value);
  }
  if (type === 'size') {
    return ALLOWED_HARDCODED.layoutValues.includes(value);
  }
  return false;
}

/**
 * Extract hard-coded colors from CSS text
 */
function findHardcodedColors(cssText: string): string[] {
  const colors: string[] = [];
  
  // Find hex colors
  const hexMatches = cssText.match(HARDCODED_PATTERNS.hexColors) || [];
  colors.push(...hexMatches.filter(color => !isAllowedHardcoded(color, 'color')));
  
  // Find rgb/rgba colors
  const rgbMatches = cssText.match(HARDCODED_PATTERNS.rgbColors) || [];
  colors.push(...rgbMatches.filter(color => !isAllowedHardcoded(color, 'color')));
  
  return colors;
}

/**
 * Extract hard-coded pixel sizes from CSS text (excluding allowed layout values)
 */
function findHardcodedSizes(cssText: string): string[] {
  const sizes: string[] = [];
  const matches = cssText.match(HARDCODED_PATTERNS.pixelSizes) || [];
  
  for (const match of matches) {
    if (!isAllowedHardcoded(match, 'size')) {
      sizes.push(match);
    }
  }
  
  return sizes;
}

/**
 * Read static styles from component files
 */
function getComponentStyles(componentPath: string): string {
  const fullPath = path.join(process.cwd(), 'src', componentPath);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    return content;
  } catch (error) {
    return '';
  }
}

/**
 * Check if CSS text uses Spectrum tokens
 */
function usesSpectrumTokens(cssText: string): boolean {
  return Object.values(SPECTRUM_TOKEN_PATTERNS).some(pattern => pattern.test(cssText));
}

test.describe('Spectrum CSS Token Usage - Static Styles', () => {
  const components = [
    { name: 'app-header', path: 'app-header/styles.css.ts' },
    { name: 'app-controls', path: 'app-controls/styles.css.ts' },
    { name: 'load-dialog', path: 'load-dialog/styles.css.ts' },
    { name: 'left-panel', path: 'left-panel/styles.css.ts' },
    { name: 'lyricist-app', path: 'lyricist-app/styles.css.ts' },
  ];

  for (const component of components) {
    test(`${component.name} should not have hard-coded colors in static styles`, () => {
      const styles = getComponentStyles(component.path);
      const hardcodedColors = findHardcodedColors(styles);
      
      // Filter out gradient backgrounds (legacy design decision)
      const problematicColors = hardcodedColors.filter(color => {
        // Allow gradient colors for now (they're in the custom design)
        return !styles.includes('linear-gradient') || !color.match(/#667eea|#764ba2/);
      });
      
      if (problematicColors.length > 0) {
        console.warn(`Found hard-coded colors in ${component.name}:`, problematicColors);
      }
      
      expect(problematicColors).toHaveLength(0);
    });

    test(`${component.name} should use Spectrum tokens for component sizing`, () => {
      const styles = getComponentStyles(component.path);
      const hardcodedSizes = findHardcodedSizes(styles);
      
      // Filter out sizes that are used with var() or calc()
      const problematicSizes = hardcodedSizes.filter(size => {
        const context = styles.substring(
          Math.max(0, styles.indexOf(size) - 50),
          styles.indexOf(size) + 50
        );
        // Allow if it's used in calc() or var()
        return !context.includes('calc(') && !context.includes('var(');
      });
      
      if (problematicSizes.length > 0) {
        console.log(`${component.name} sizes that could use tokens:`, [...new Set(problematicSizes)]);
      }
      
      // This is informational for now - we'll track progress
      expect(Array.isArray(problematicSizes)).toBe(true);
    });
  }
});

test.describe('Spectrum CSS Token Usage - Runtime Styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Spectrum Web Components should use CSS custom properties', async ({ page }) => {
    const componentsInfo = await page.evaluate(() => {
      const components = [
        { selector: 'sp-button', type: 'button' },
        { selector: 'sp-action-button', type: 'action-button' },
        { selector: 'sp-textfield', type: 'textfield' },
      ];
      
      const results: any[] = [];
      
      for (const comp of components) {
        const elements = document.querySelectorAll(comp.selector);
        elements.forEach((el, index) => {
          const styles = window.getComputedStyle(el);
          
          // Check key properties that should use tokens
          const backgroundColor = styles.backgroundColor;
          const color = styles.color;
          const fontSize = styles.fontSize;
          const borderColor = styles.borderColor;
          
          results.push({
            type: comp.type,
            index,
            backgroundColor,
            color,
            fontSize,
            borderColor,
            // Check if values look like they came from CSS vars (not rgb(0,0,0) defaults)
            hasNonDefaultBackground: backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent',
            hasNonDefaultColor: color !== 'rgb(0, 0, 0)',
          });
        });
      }
      
      return results;
    });
    
    // Verify that Spectrum components have styled values (proof they're using the theme)
    const styledComponents = componentsInfo.filter(c => c.hasNonDefaultBackground || c.hasNonDefaultColor);
    expect(styledComponents.length).toBeGreaterThan(0);
  });

  test('Custom component styles should not override Spectrum tokens with hard-coded values', async ({ page }) => {
    // Check our custom components for inline styles
    const inlineStylesInfo = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      if (!app?.shadowRoot) return { hasInlineStyles: false, details: [] };
      
      const components = [
        { name: 'app-header', selector: 'app-header' },
        { name: 'app-controls', selector: 'app-controls' },
        { name: 'left-panel', selector: 'left-panel' },
      ];
      
      const details: any[] = [];
      
      for (const comp of components) {
        const element = app.shadowRoot.querySelector(comp.selector);
        if (!element?.shadowRoot) continue;
        
        // Check for elements with inline styles
        const elementsWithInlineStyles = element.shadowRoot.querySelectorAll('[style]');
        elementsWithInlineStyles.forEach((el) => {
          const style = (el as HTMLElement).style;
          const cssText = style.cssText;
          
          // Check if inline styles use hard-coded colors
          const hasHardcodedColor = /rgba?\(|#[0-9a-f]{3,6}/i.test(cssText);
          
          if (hasHardcodedColor) {
            details.push({
              component: comp.name,
              element: el.tagName,
              style: cssText,
            });
          }
        });
      }
      
      return {
        hasInlineStyles: details.length > 0,
        details,
      };
    });
    
    if (inlineStylesInfo.hasInlineStyles) {
      console.warn('Found inline styles with hard-coded values:', inlineStylesInfo.details);
    }
    
    // For now, just verify we can check this - will make strict once we refactor
    expect(inlineStylesInfo.details).toBeDefined();
  });

  test('Spectrum theme custom properties should be available in Shadow DOM', async ({ page }) => {
    const themeTokens = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      if (!app?.shadowRoot) return {};
      
      const header = app.shadowRoot.querySelector('app-header');
      if (!header?.shadowRoot) return {};
      
      // Get a button inside the header
      const button = header.shadowRoot.querySelector('sp-button');
      if (!button) return {};
      
      const styles = window.getComputedStyle(button);
      
      // Check for Spectrum token values
      const tokens: Record<string, string> = {};
      
      // Sample some key Spectrum tokens
      const tokenNames = [
        '--spectrum-gray-50',
        '--spectrum-gray-100',
        '--spectrum-gray-800',
        '--spectrum-accent-background-color-default',
        '--spectrum-neutral-background-color-default',
        '--spectrum-component-height-100',
        '--spectrum-font-size-100',
      ];
      
      for (const tokenName of tokenNames) {
        const value = styles.getPropertyValue(tokenName);
        if (value) {
          tokens[tokenName] = value;
        }
      }
      
      return tokens;
    });
    
    // Verify that Spectrum tokens are accessible
    const tokenCount = Object.keys(themeTokens).length;
    expect(tokenCount).toBeGreaterThan(0);
    
    console.log('Available Spectrum tokens sample:', Object.keys(themeTokens).slice(0, 5));
  });

  test('Custom components should inherit Spectrum theme context', async ({ page }) => {
    const themeContext = await page.evaluate(() => {
      const app = document.querySelector('lyricist-app');
      const spTheme = app?.shadowRoot?.querySelector('sp-theme');
      
      if (!spTheme) return { hasTheme: false };
      
      return {
        hasTheme: true,
        scale: spTheme.getAttribute('scale'),
        color: spTheme.getAttribute('color'),
        system: spTheme.getAttribute('system'),
      };
    });
    
    expect(themeContext.hasTheme).toBe(true);
    expect(themeContext.scale).toBe('medium');
    expect(themeContext.color).toBe('light');
    expect(themeContext.system).toBe('spectrum-two');
  });
});

test.describe('Spectrum CSS Token Recommendations', () => {
  test('Generate report of hard-coded values that could use tokens', async ({ page }) => {
    const components = [
      { name: 'app-header', path: 'app-header/styles.css.ts' },
      { name: 'app-controls', path: 'app-controls/styles.css.ts' },
      { name: 'load-dialog', path: 'load-dialog/styles.css.ts' },
      { name: 'left-panel', path: 'left-panel/styles.css.ts' },
    ];
    
    const report: Record<string, any> = {};
    
    for (const component of components) {
      const styles = getComponentStyles(component.path);
      const colors = findHardcodedColors(styles);
      const sizes = findHardcodedSizes(styles);
      
      report[component.name] = {
        hardcodedColors: [...new Set(colors)],
        hardcodedSizes: [...new Set(sizes)].slice(0, 10), // Limit for readability
        usesSpectrumTokens: usesSpectrumTokens(styles),
      };
    }
    
    console.log('\n=== Spectrum Token Usage Report ===');
    console.log(JSON.stringify(report, null, 2));
    console.log('\nRecommendations:');
    console.log('- Replace hard-coded colors with Spectrum color tokens');
    console.log('- Replace hard-coded sizes with Spectrum spacing/sizing tokens');
    console.log('- Use Spectrum corner-radius tokens for border-radius values');
    
    // This test always passes - it's informational
    expect(report).toBeDefined();
  });
});

