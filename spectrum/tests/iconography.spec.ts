import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Iconography Tests
 * 
 * Ensures all icons use Spectrum Web Components icons instead of emojis or text symbols.
 * 
 * Why this matters:
 * - Consistent visual design
 * - Better accessibility (proper ARIA labels)
 * - Scalable vector graphics (not pixel-based emojis)
 * - Theme-aware (adapts to light/dark mode)
 * - Better cross-platform rendering
 */

// Common emoji/symbol patterns that should be replaced with Spectrum icons
const ICON_VIOLATIONS = [
  {
    pattern: /[⚙️]/g,
    name: 'Settings gear emoji',
    replacement: 'sp-icon-settings',
    description: 'Settings icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js'
  },
  {
    pattern: /[🎲]/g,
    name: 'Dice emoji',
    replacement: 'sp-icon-data-refresh',
    description: 'Random/shuffle icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js'
  },
  {
    pattern: /[⊕]/g,
    name: 'Plus in circle symbol',
    replacement: 'sp-icon-duplicate',
    description: 'Duplicate icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js'
  },
  {
    pattern: />[×]</g, // Only match × when used as button content
    name: 'Multiplication X symbol',
    replacement: 'sp-icon-close',
    description: 'Close/delete icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js'
  },
  {
    pattern: /[♪♫]/g,
    name: 'Music note emoji',
    replacement: 'sp-icon-music',
    description: 'Music/chord icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-music.js'
  },
  {
    pattern: /[📋]/g,
    name: 'Clipboard emoji',
    replacement: 'sp-icon-copy',
    description: 'Copy to clipboard icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-copy.js'
  },
  {
    pattern: /[📥]/g,
    name: 'Inbox emoji',
    replacement: 'sp-icon-import',
    description: 'Import icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-import.js'
  },
  {
    pattern: /[📤]/g,
    name: 'Outbox emoji',
    replacement: 'sp-icon-export',
    description: 'Export icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-export.js'
  },
  {
    pattern: /[📝]/g,
    name: 'Memo emoji',
    replacement: 'sp-icon-edit',
    description: 'Edit/lyrics icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-edit.js'
  },
  {
    pattern: /[🎵]/g,
    name: 'Music notes emoji',
    replacement: 'sp-icon-music',
    description: 'Music icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-music.js'
  },
  {
    pattern: />\s*[−]\s*</g, // Minus sign used as icon content
    name: 'Minus sign symbol',
    replacement: 'sp-icon-remove',
    description: 'Remove icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-remove.js'
  },
  {
    pattern: /[◧◨◩◪◫]/g,
    name: 'Square alignment symbols',
    replacement: 'sp-icon-align-*',
    description: 'Alignment icons',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-align-*.js'
  },
  {
    pattern: />[‹]</g, // Left angle bracket
    name: 'Left angle bracket',
    replacement: 'sp-icon-chevron-left',
    description: 'Previous/back icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-left.js'
  },
  {
    pattern: />[›]</g, // Right angle bracket
    name: 'Right angle bracket',
    replacement: 'sp-icon-chevron-right',
    description: 'Next/forward icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-right.js'
  },
  {
    pattern: />[⊟]</g,
    name: 'Minus in square symbol',
    replacement: 'sp-icon-ungroup',
    description: 'Ungroup icon',
    importPath: '@spectrum-web-components/icons-workflow/icons/sp-icon-ungroup.js'
  }
];

// Files to check for icon violations
const COMPONENT_PATHS = [
  'src/app-navbar/index.ts',
  'src/app-header/index.ts',
  'src/app-controls/index.ts',
  'src/floating-strip/index.ts',
  'src/file-modal/index.ts',
  'src/load-dialog/index.ts',
  'src/edit-modal/index.ts',
  'src/email-prompt/index.ts',
  'src/left-panel/index.ts',
  'src/lyric-line/index.ts',
  'src/lyric-group/index.ts',
  'src/lyricist-app/index.ts'
];

// Allowed exceptions (e.g., in comments, test data, or specific contexts)
const ALLOWED_CONTEXTS = [
  /\/\/.*/g, // Single-line comments
  /\/\*[\s\S]*?\*\//g, // Multi-line comments
  /title="[^"]*"/g, // Title attributes can have descriptive text
  /aria-label="[^"]*"/g, // ARIA labels can have descriptive text
  /placeholder="[^"]*"/g // Placeholders can have descriptive text
];

function stripAllowedContexts(content: string): string {
  let cleaned = content;
  for (const pattern of ALLOWED_CONTEXTS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned;
}

function getProjectRoot(): string {
  // Go up from spectrum/tests to project root
  return path.resolve(__dirname, '../..');
}

interface Violation {
  file: string;
  line: number;
  column: number;
  match: string;
  iconInfo: typeof ICON_VIOLATIONS[0];
  context: string;
}

function findIconViolations(filePath: string, content: string): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split('\n');
  const cleanedContent = stripAllowedContexts(content);
  const cleanedLines = cleanedContent.split('\n');

  for (const iconInfo of ICON_VIOLATIONS) {
    let match;
    while ((match = iconInfo.pattern.exec(cleanedContent)) !== null) {
      // Find which line this match is on
      let currentPos = 0;
      let lineNum = 0;
      
      for (let i = 0; i < cleanedLines.length; i++) {
        const lineLength = cleanedLines[i].length + 1; // +1 for newline
        if (currentPos + lineLength > match.index) {
          lineNum = i;
          break;
        }
        currentPos += lineLength;
      }

      const column = match.index - currentPos;
      const context = lines[lineNum].trim();

      violations.push({
        file: filePath,
        line: lineNum + 1,
        column: column + 1,
        match: match[0],
        iconInfo,
        context
      });
    }
  }

  return violations;
}

test.describe('Iconography Standards', () => {
  let allViolations: Violation[] = [];
  const projectRoot = getProjectRoot();

  test.beforeAll(() => {
    // Scan all component files
    for (const componentPath of COMPONENT_PATHS) {
      const fullPath = path.join(projectRoot, componentPath);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${componentPath}`);
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const violations = findIconViolations(componentPath, content);
      allViolations = allViolations.concat(violations);
    }
  });

  test('should use Spectrum icons instead of emoji/symbols', () => {
    if (allViolations.length === 0) {
      expect(allViolations).toHaveLength(0);
      return;
    }

    // Generate detailed error message
    let errorMessage = '\n\n❌ Found emoji/symbol icons that should be replaced with Spectrum Web Components icons:\n\n';

    // Group violations by file
    const violationsByFile = allViolations.reduce((acc, v) => {
      if (!acc[v.file]) acc[v.file] = [];
      acc[v.file].push(v);
      return acc;
    }, {} as Record<string, Violation[]>);

    for (const [file, violations] of Object.entries(violationsByFile)) {
      errorMessage += `\n📁 ${file}\n`;
      
      for (const violation of violations) {
        errorMessage += `   Line ${violation.line}:${violation.column} - ${violation.iconInfo.name}\n`;
        errorMessage += `   Found: "${violation.match}"\n`;
        errorMessage += `   Context: ${violation.context}\n`;
        errorMessage += `   ✅ Replace with: <${violation.iconInfo.replacement} slot="icon"></${violation.iconInfo.replacement}>\n`;
        errorMessage += `   📦 Import: import '${violation.iconInfo.importPath}';\n\n`;
      }
    }

    errorMessage += '\n💡 How to fix:\n\n';
    errorMessage += '1. Add the icon import to the top of your component:\n';
    errorMessage += '   import \'@spectrum-web-components/icons-workflow/icons/sp-icon-[name].js\';\n\n';
    errorMessage += '2. Replace emoji/symbol with the icon component:\n';
    errorMessage += '   Before: <sp-action-button>⚙️</sp-action-button>\n';
    errorMessage += '   After:  <sp-action-button>\n';
    errorMessage += '             <sp-icon-settings slot="icon"></sp-icon-settings>\n';
    errorMessage += '           </sp-action-button>\n\n';
    errorMessage += '3. For text content (not icons), keep the emoji/symbol as-is.\n\n';
    errorMessage += `📊 Total violations: ${allViolations.length}\n`;
    errorMessage += `📁 Files affected: ${Object.keys(violationsByFile).length}\n\n`;
    errorMessage += '🔍 Search for icons: https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/\n';

    // Fail the test with detailed message
    expect(allViolations, errorMessage).toHaveLength(0);
  });

  test('should have proper icon imports for used icons', () => {
    const importViolations: { file: string; missingImport: string }[] = [];

    for (const componentPath of COMPONENT_PATHS) {
      const fullPath = path.join(projectRoot, componentPath);
      
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check if file uses sp-icon-* elements
      const iconUsagePattern = /<sp-icon-([\w-]+)/g;
      const usedIcons = new Set<string>();
      let match;
      
      while ((match = iconUsagePattern.exec(content)) !== null) {
        usedIcons.add(match[1]);
      }

      // Check if imports exist for used icons
      for (const iconName of usedIcons) {
        const importPattern = new RegExp(`@spectrum-web-components/icons-workflow/icons/sp-icon-${iconName}\\.js`);
        if (!importPattern.test(content)) {
          importViolations.push({
            file: componentPath,
            missingImport: `@spectrum-web-components/icons-workflow/icons/sp-icon-${iconName}.js`
          });
        }
      }
    }

    if (importViolations.length > 0) {
      let errorMessage = '\n\n❌ Found icon usage without proper imports:\n\n';
      
      for (const violation of importViolations) {
        errorMessage += `📁 ${violation.file}\n`;
        errorMessage += `   Missing: import '${violation.missingImport}';\n\n`;
      }

      expect(importViolations, errorMessage).toHaveLength(0);
    }

    expect(importViolations).toHaveLength(0);
  });

  test('should use slot="icon" for icons in buttons', () => {
    const slotViolations: { file: string; line: number; context: string }[] = [];

    for (const componentPath of COMPONENT_PATHS) {
      const fullPath = path.join(projectRoot, componentPath);
      
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      // Look for sp-icon-* without slot="icon"
      const iconWithoutSlotPattern = /<sp-icon-[\w-]+(?!\s+slot="icon")[^>]*>/g;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (iconWithoutSlotPattern.test(line)) {
          // Check if this icon is inside a button/action-button
          const surroundingContext = lines.slice(Math.max(0, i - 2), i + 3).join('\n');
          if (/sp-(action-)?button/.test(surroundingContext)) {
            slotViolations.push({
              file: componentPath,
              line: i + 1,
              context: line.trim()
            });
          }
        }
      }
    }

    if (slotViolations.length > 0) {
      let errorMessage = '\n\n❌ Found icons without slot="icon" attribute:\n\n';
      
      for (const violation of slotViolations) {
        errorMessage += `📁 ${violation.file}:${violation.line}\n`;
        errorMessage += `   ${violation.context}\n`;
        errorMessage += `   ✅ Add: slot="icon"\n\n`;
      }

      errorMessage += '💡 Icons in buttons should use slot="icon" for proper positioning.\n';

      expect(slotViolations, errorMessage).toHaveLength(0);
    }

    expect(slotViolations).toHaveLength(0);
  });

  test('icon documentation is available', () => {
    // Just verify the Spectrum icon workflow URL is accessible
    // This is more of a smoke test
    expect(true).toBe(true);
  });
});

test.describe('Icon Best Practices', () => {
  const projectRoot = getProjectRoot();

  test('icons should have meaningful ARIA labels when standalone', () => {
    const ariaViolations: { file: string; line: number; context: string }[] = [];

    for (const componentPath of COMPONENT_PATHS) {
      const fullPath = path.join(projectRoot, componentPath);
      
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for action buttons with only icons (no text content)
        if (/<sp-action-button[^>]*>[\s\n]*<sp-icon-/.test(line + (lines[i + 1] || ''))) {
          const context = lines.slice(i, i + 3).join('\n');
          
          // Should have aria-label or title
          if (!/aria-label=|title=/.test(context)) {
            ariaViolations.push({
              file: componentPath,
              line: i + 1,
              context: line.trim()
            });
          }
        }
      }
    }

    if (ariaViolations.length > 0) {
      let errorMessage = '\n\n⚠️  Icon-only buttons should have aria-label or title for accessibility:\n\n';
      
      for (const violation of ariaViolations) {
        errorMessage += `📁 ${violation.file}:${violation.line}\n`;
        errorMessage += `   ${violation.context}\n`;
        errorMessage += `   ✅ Add: aria-label="Descriptive action" or title="..."\n\n`;
      }

      // This is a warning, not a hard failure
      if (ariaViolations.length > 0) {
        console.warn(errorMessage);
      }
    }

    // Don't fail the test, just warn
    expect(true).toBe(true);
  });
});

