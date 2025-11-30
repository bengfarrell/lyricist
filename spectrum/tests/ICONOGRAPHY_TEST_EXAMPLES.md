# Iconography Test Examples

This document shows what the iconography tests will catch and how to fix violations.

---

## Test Output Examples

### Example 1: Emoji Icons Detected

```
❌ Found emoji/symbol icons that should be replaced with Spectrum Web Components icons:

📁 src/app-navbar/index.ts
   Line 118:15 - Settings gear emoji
   Found: "⚙️"
   Context: >⚙️</sp-action-button>
   ✅ Replace with: <sp-icon-settings slot="icon"></sp-icon-settings>
   📦 Import: import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

📁 src/floating-strip/index.ts
   Line 234:12 - Dice emoji
   Found: "🎲"
   Context: >🎲</sp-action-button>
   ✅ Replace with: <sp-icon-data-refresh slot="icon"></sp-icon-data-refresh>
   📦 Import: import '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js';

📁 src/lyric-line/index.ts
   Line 671:89 - Plus in circle symbol
   Found: "⊕"
   Context: <button class="action-btn duplicate-btn">⊕</button>
   ✅ Replace with: <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
   📦 Import: import '@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js';

📊 Total violations: 3
📁 Files affected: 3
```

### Example 2: Missing Icon Imports

```
❌ Found icon usage without proper imports:

📁 src/file-modal/index.ts
   Missing: import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';

📁 src/edit-modal/index.ts
   Missing: import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
```

### Example 3: Missing slot="icon"

```
❌ Found icons without slot="icon" attribute:

📁 src/app-navbar/index.ts:115
   <sp-icon-settings></sp-icon-settings>
   ✅ Add: slot="icon"

📁 src/lyric-line/index.ts:672
   <sp-icon-duplicate></sp-icon-duplicate>
   ✅ Add: slot="icon"
```

### Example 4: Missing Accessibility Labels

```
⚠️  Icon-only buttons should have aria-label or title for accessibility:

📁 src/floating-strip/index.ts:245
   <sp-action-button @click=${this._rollDice}>
   ✅ Add: aria-label="Roll dice for random word combo" or title="Roll Dice"

📁 src/left-panel/index.ts:439
   <sp-action-button quiet @click=${(e: Event) => ...}>
   ✅ Add: aria-label="Remove word" or title="Remove"
```

---

## How Tests Scan Your Code

### What Gets Flagged

The tests scan all component files for these patterns:

1. **Emoji in HTML content**
   ```typescript
   <sp-action-button>⚙️</sp-action-button>  // ❌ Flagged
   ```

2. **Unicode symbols in buttons**
   ```typescript
   <button>×</button>  // ❌ Flagged
   <button>⊕</button>  // ❌ Flagged
   ```

3. **Icons without imports**
   ```typescript
   // In template:
   <sp-icon-settings slot="icon"></sp-icon-settings>  // ❌ If no import
   
   // Missing at top of file:
   import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
   ```

4. **Icons without slot="icon"**
   ```typescript
   <sp-action-button>
     <sp-icon-close></sp-icon-close>  // ❌ Missing slot="icon"
   </sp-action-button>
   ```

### What Gets Ignored

1. **Text content** (not icon usage)
   ```typescript
   <p>Click the ⚙️ button</p>  // ✅ Allowed (descriptive text)
   ```

2. **Comments**
   ```typescript
   // Use ⚙️ for settings  // ✅ Allowed (comment)
   ```

3. **String attributes**
   ```typescript
   title="Click ⚙️ to open settings"  // ✅ Allowed (descriptive)
   aria-label="Settings (⚙️)"  // ✅ Allowed (label)
   ```

---

## Fix Examples

### Fix 1: Replace Settings Emoji

**Before:**
```typescript
// src/app-navbar/index.ts
import { LitElement, html } from 'lit';
import '@spectrum-web-components/action-button/sp-action-button.js';

export class AppNavbar extends LitElement {
  render() {
    return html`
      <sp-action-button @click=${this.handleSettings}>
        ⚙️
      </sp-action-button>
    `;
  }
}
```

**After:**
```typescript
// src/app-navbar/index.ts
import { LitElement, html } from 'lit';
import '@spectrum-web-components/action-button/sp-action-button.js';
// ✅ Add icon import
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

export class AppNavbar extends LitElement {
  render() {
    return html`
      <sp-action-button 
        @click=${this.handleSettings}
        aria-label="Open settings"
        title="Settings"
      >
        <sp-icon-settings slot="icon"></sp-icon-settings>
      </sp-action-button>
    `;
  }
}
```

**Changes:**
1. ✅ Added icon import
2. ✅ Replaced emoji with `<sp-icon-settings>`
3. ✅ Added `slot="icon"`
4. ✅ Added `aria-label` for accessibility
5. ✅ Added `title` for tooltip

---

### Fix 2: Replace Multiple Icons

**Before:**
```typescript
// src/lyric-line/index.ts
render() {
  return html`
    <div class="lyric-line">
      <sp-action-button quiet @click=${this._handleDuplicate} title="Duplicate">
        ⊕
      </sp-action-button>
      <sp-action-button quiet @click=${this._handleToggleChordSection}>
        ${this.hasChordSection ? '−' : '♪'}
      </sp-action-button>
      <sp-action-button quiet @click=${this._handleDelete} title="Delete">
        ×
      </sp-action-button>
    </div>
  `;
}
```

**After:**
```typescript
// src/lyric-line/index.ts
// ✅ Add all needed icon imports
import '@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-music.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-remove.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';

render() {
  return html`
    <div class="lyric-line">
      <sp-action-button 
        quiet 
        @click=${this._handleDuplicate} 
        aria-label="Duplicate lyric line"
        title="Duplicate"
      >
        <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
      </sp-action-button>
      
      <sp-action-button 
        quiet 
        @click=${this._handleToggleChordSection}
        aria-label="${this.hasChordSection ? 'Hide chords' : 'Add chords'}"
        title="${this.hasChordSection ? 'Hide chords' : 'Add chords'}"
      >
        ${this.hasChordSection 
          ? html`<sp-icon-remove slot="icon"></sp-icon-remove>`
          : html`<sp-icon-music slot="icon"></sp-icon-music>`
        }
      </sp-action-button>
      
      <sp-action-button 
        quiet 
        @click=${this._handleDelete}
        aria-label="Delete lyric line"
        title="Delete"
      >
        <sp-icon-close slot="icon"></sp-icon-close>
      </sp-action-button>
    </div>
  `;
}
```

**Changes:**
1. ✅ Imported 4 icons (duplicate, music, remove, close)
2. ✅ Replaced all emoji/symbols
3. ✅ Added `slot="icon"` to all
4. ✅ Added aria-labels
5. ✅ Used conditional rendering for toggle button

---

### Fix 3: Alignment Icons

**Before:**
```typescript
// src/floating-strip/index.ts
<div class="alignment-buttons">
  <sp-action-button @click=${() => this._alignItems('left')} title="Align left">
    ◧
  </sp-action-button>
  <sp-action-button @click=${() => this._alignItems('center')} title="Align center">
    ◫
  </sp-action-button>
  <sp-action-button @click=${() => this._alignItems('right')} title="Align right">
    ◨
  </sp-action-button>
</div>
```

**After:**
```typescript
// src/floating-strip/index.ts
// ✅ Add icon imports
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-left.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-center.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-right.js';

<div class="alignment-buttons">
  <sp-action-button 
    @click=${() => this._alignItems('left')} 
    aria-label="Align items to the left"
    title="Align left"
  >
    <sp-icon-align-left slot="icon"></sp-icon-align-left>
  </sp-action-button>
  
  <sp-action-button 
    @click=${() => this._alignItems('center')}
    aria-label="Align items to center"
    title="Align center"
  >
    <sp-icon-align-center slot="icon"></sp-icon-align-center>
  </sp-action-button>
  
  <sp-action-button 
    @click=${() => this._alignItems('right')}
    aria-label="Align items to the right"
    title="Align right"
  >
    <sp-icon-align-right slot="icon"></sp-icon-align-right>
  </sp-action-button>
</div>
```

---

## Running the Tests

### Initial Run (Expect Failures)

Since your app currently uses emoji/symbols, the first run will show all violations:

```bash
npm run test:spectrum
```

Expected output: **Multiple failures with detailed fix suggestions**

### After Fixing One Component

Fix icons in one component, then re-run:

```bash
npm run test:spectrum
```

You should see fewer violations.

### Final Run (All Fixed)

Once all icons are replaced:

```bash
npm run test:spectrum
```

Expected output: **All tests passing ✅**

---

## Common Patterns by Component

### app-navbar
```typescript
// Imports needed:
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-left.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-right.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-top.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-bottom.js';

// Replacements:
⚙️ → <sp-icon-settings slot="icon"></sp-icon-settings>
◧ → <sp-icon-align-left slot="icon"></sp-icon-align-left>
◨ → <sp-icon-align-right slot="icon"></sp-icon-align-right>
◩ → <sp-icon-align-top slot="icon"></sp-icon-align-top>
◪ → <sp-icon-align-bottom slot="icon"></sp-icon-align-bottom>
```

### floating-strip
```typescript
// Imports needed:
import '@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-copy.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-left.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-right.js';

// Replacements:
🎲 → <sp-icon-data-refresh slot="icon"></sp-icon-data-refresh>
📋 → <sp-icon-copy slot="icon"></sp-icon-copy>
‹ → <sp-icon-chevron-left slot="icon"></sp-icon-chevron-left>
› → <sp-icon-chevron-right slot="icon"></sp-icon-chevron-right>
```

### load-dialog
```typescript
// Imports needed:
import '@spectrum-web-components/icons-workflow/icons/sp-icon-import.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-export.js';

// Replacements:
📥 → <sp-icon-import slot="icon"></sp-icon-import>
📤 → <sp-icon-export slot="icon"></sp-icon-export>
```

### lyric-line & lyric-group
```typescript
// Imports needed:
import '@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-music.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-remove.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-ungroup.js';

// Replacements:
⊕ → <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
× → <sp-icon-close slot="icon"></sp-icon-close>
♪ → <sp-icon-music slot="icon"></sp-icon-music>
− → <sp-icon-remove slot="icon"></sp-icon-remove>
⊟ → <sp-icon-ungroup slot="icon"></sp-icon-ungroup>
```

---

## Testing After Migration

Once you've fixed all violations, run these checks:

### 1. Automated Tests Pass
```bash
npm run test:spectrum
```
All iconography tests should pass.

### 2. Visual Inspection
- Open the app in browser
- Check all icons render correctly
- Verify proper size and alignment
- Test hover/focus states

### 3. Accessibility Check
- Use screen reader to announce buttons
- Tab through all interactive elements
- Verify tooltips appear on hover

### 4. Cross-Browser Test
- Chrome (primary)
- Safari
- Firefox
- Edge

### 5. Dark Mode Test
- Switch theme to dark
- Verify icons adapt correctly
- Check visibility and contrast

---

*This document will be updated as you progress through the icon migration.*


