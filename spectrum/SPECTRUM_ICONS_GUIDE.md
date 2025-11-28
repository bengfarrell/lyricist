# Spectrum Icons Guide

Complete guide for replacing emoji/symbols with Spectrum Web Components icons in your application.

---

## Why Use Spectrum Icons?

### Current Problem: Emoji & Text Symbols

Your app currently uses emojis and Unicode symbols as icons:

```typescript
<sp-action-button>⚙️</sp-action-button>  // Settings
<sp-action-button>🎲</sp-action-button>  // Random
<sp-action-button>×</sp-action-button>   // Close
```

**Issues with this approach:**
- ❌ Inconsistent rendering across platforms (iOS, Android, Windows, Mac)
- ❌ Pixel-based (don't scale cleanly)
- ❌ Poor accessibility (screen readers can't interpret)
- ❌ Don't adapt to theme (light/dark mode)
- ❌ Limited design control (size, color)

### Solution: Spectrum Icons

```typescript
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

<sp-action-button>
  <sp-icon-settings slot="icon"></sp-icon-settings>
</sp-action-button>
```

**Benefits:**
- ✅ Consistent across all platforms
- ✅ Scalable vector graphics (crisp at any size)
- ✅ Proper ARIA labels for accessibility
- ✅ Theme-aware (adapts to light/dark)
- ✅ Full design system integration

---

## Icon Replacement Map

### Current Icons → Spectrum Equivalents

| Current | Description | Spectrum Icon | Import |
|---------|-------------|---------------|--------|
| ⚙️ | Settings | `sp-icon-settings` | `@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js` |
| 🎲 | Random/Dice | `sp-icon-data-refresh` | `@spectrum-web-components/icons-workflow/icons/sp-icon-data-refresh.js` |
| ⊕ | Duplicate | `sp-icon-duplicate` | `@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js` |
| × | Close/Delete | `sp-icon-close` | `@spectrum-web-components/icons-workflow/icons/sp-icon-close.js` |
| ♪ | Chord/Music | `sp-icon-music` | `@spectrum-web-components/icons-workflow/icons/sp-icon-music.js` |
| − | Remove | `sp-icon-remove` | `@spectrum-web-components/icons-workflow/icons/sp-icon-remove.js` |
| ⊟ | Ungroup | `sp-icon-ungroup` | `@spectrum-web-components/icons-workflow/icons/sp-icon-ungroup.js` |
| 📋 | Copy | `sp-icon-copy` | `@spectrum-web-components/icons-workflow/icons/sp-icon-copy.js` |
| 📥 | Import | `sp-icon-import` | `@spectrum-web-components/icons-workflow/icons/sp-icon-import.js` |
| 📤 | Export | `sp-icon-export` | `@spectrum-web-components/icons-workflow/icons/sp-icon-export.js` |
| 📝 | Edit/Lyrics | `sp-icon-edit` | `@spectrum-web-components/icons-workflow/icons/sp-icon-edit.js` |
| 🎵 | Music | `sp-icon-music` | `@spectrum-web-components/icons-workflow/icons/sp-icon-music.js` |
| ‹ | Previous | `sp-icon-chevron-left` | `@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-left.js` |
| › | Next | `sp-icon-chevron-right` | `@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-right.js` |
| ◧ | Align Left | `sp-icon-align-left` | `@spectrum-web-components/icons-workflow/icons/sp-icon-align-left.js` |
| ◨ | Align Right | `sp-icon-align-right` | `@spectrum-web-components/icons-workflow/icons/sp-icon-align-right.js` |
| ◫ | Align Center | `sp-icon-align-center` | `@spectrum-web-components/icons-workflow/icons/sp-icon-align-center.js` |
| ◩ | Align Top | `sp-icon-align-top` | `@spectrum-web-components/icons-workflow/icons/sp-icon-align-top.js` |
| ◪ | Align Bottom | `sp-icon-align-bottom` | `@spectrum-web-components/icons-workflow/icons/sp-icon-align-bottom.js` |

---

## How to Replace Icons

### Step 1: Import the Icon

At the top of your component file:

```typescript
import { LitElement, html } from 'lit';
// ... other imports

// ✅ Add Spectrum icon imports
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js';
```

### Step 2: Replace in Template

**Before (Emoji):**
```typescript
render() {
  return html`
    <sp-action-button @click=${this.handleSettings}>
      ⚙️
    </sp-action-button>
  `;
}
```

**After (Spectrum Icon):**
```typescript
render() {
  return html`
    <sp-action-button @click=${this.handleSettings}>
      <sp-icon-settings slot="icon"></sp-icon-settings>
    </sp-action-button>
  `;
}
```

**Key points:**
- ✅ Use `slot="icon"` for proper positioning
- ✅ Self-closing tag: `<sp-icon-name slot="icon"></sp-icon-name>`
- ✅ Keep ARIA labels for accessibility

---

## Complete Example: app-navbar.ts

### Before

```typescript
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

### After

```typescript
import { LitElement, html } from 'lit';
import '@spectrum-web-components/action-button/sp-action-button.js';
// ✅ Add icon import
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';

export class AppNavbar extends LitElement {
  render() {
    return html`
      <sp-action-button 
        @click=${this.handleSettings}
        aria-label="Settings"
      >
        <sp-icon-settings slot="icon"></sp-icon-settings>
      </sp-action-button>
    `;
  }
}
```

---

## Icon Usage Patterns

### Pattern 1: Icon-Only Button

```typescript
<sp-action-button 
  aria-label="Duplicate line"
  title="Duplicate"
>
  <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
</sp-action-button>
```

**Important:** Always include `aria-label` or `title` for accessibility!

### Pattern 2: Icon + Text Button

```typescript
<sp-button variant="secondary">
  <sp-icon-copy slot="icon"></sp-icon-copy>
  Copy to Clipboard
</sp-button>
```

### Pattern 3: Quiet Action Button

```typescript
<sp-action-button 
  quiet
  @click=${this.handleClose}
  aria-label="Close"
>
  <sp-icon-close slot="icon"></sp-icon-close>
</sp-action-button>
```

### Pattern 4: Selected State

```typescript
<sp-action-button 
  ?selected=${this.isActive}
  aria-label="Align left"
>
  <sp-icon-align-left slot="icon"></sp-icon-align-left>
</sp-action-button>
```

---

## Finding the Right Icon

### 1. Browse the Icon Library

**Official Spectrum Icons Workflow:**
https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/

### 2. Search by Category

Common categories:
- **Actions:** copy, duplicate, delete, edit, add, remove
- **Navigation:** chevron-left, chevron-right, arrow-up, arrow-down
- **Media:** play, pause, music, volume
- **Files:** save, open, import, export, download, upload
- **UI:** settings, menu, close, search, filter
- **Alignment:** align-left, align-right, align-center, align-top, align-bottom

### 3. Use the Icon Search

The Spectrum site has a search feature - just type what you're looking for!

### 4. Not Sure? Common Mappings:

| Need | Use |
|------|-----|
| Delete/Remove | `sp-icon-close` or `sp-icon-delete` |
| Add/Create | `sp-icon-add` |
| Edit | `sp-icon-edit` |
| Settings | `sp-icon-settings` |
| Menu | `sp-icon-more` (three dots) |
| Random/Shuffle | `sp-icon-data-refresh` |
| Copy | `sp-icon-copy` |
| Download | `sp-icon-download` |
| Upload | `sp-icon-upload` |
| Back | `sp-icon-chevron-left` |
| Forward | `sp-icon-chevron-right` |

---

## Testing Your Icons

### Run the Iconography Tests

```bash
npm run test:spectrum
```

This will:
1. ✅ Scan all components for emoji/symbol usage
2. ✅ Report violations with suggested Spectrum icons
3. ✅ Check that used icons have proper imports
4. ✅ Verify `slot="icon"` is used correctly
5. ✅ Check for accessibility (aria-label/title)

### Example Test Output

```
❌ Found emoji/symbol icons that should be replaced:

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

📊 Total violations: 2
📁 Files affected: 2
```

---

## Migration Checklist

Use this checklist to systematically replace icons:

### app-navbar
- [ ] Settings button (⚙️) → `sp-icon-settings`
- [ ] Alignment buttons (◧◨◩◪) → `sp-icon-align-*`

### app-controls
- [ ] Dice button (🎲) → `sp-icon-data-refresh`

### floating-strip
- [ ] Dice button (🎲) → `sp-icon-data-refresh`
- [ ] Navigation (‹›) → `sp-icon-chevron-*`
- [ ] Copy button (📋) → `sp-icon-copy`

### file-modal
- [ ] Close button (×) → `sp-icon-close`
- [ ] Copy button (📋) → `sp-icon-copy`

### load-dialog
- [ ] Import button (📥) → `sp-icon-import`
- [ ] Export button (📤) → `sp-icon-export`

### edit-modal
- [ ] Close button (×) → `sp-icon-close`

### lyric-line
- [ ] Duplicate button (⊕) → `sp-icon-duplicate`
- [ ] Chord toggle (♪/−) → `sp-icon-music` / `sp-icon-remove`
- [ ] Delete button (×) → `sp-icon-close`

### lyric-group
- [ ] Duplicate button (⊕) → `sp-icon-duplicate`
- [ ] Ungroup button (⊟) → `sp-icon-ungroup`
- [ ] Delete button (×) → `sp-icon-close`

### left-panel
- [ ] Remove buttons (×) → `sp-icon-close`

---

## Accessibility Best Practices

### Always Provide Labels

**Bad (no label):**
```typescript
<sp-action-button>
  <sp-icon-settings slot="icon"></sp-icon-settings>
</sp-action-button>
```

**Good (with aria-label):**
```typescript
<sp-action-button aria-label="Open settings">
  <sp-icon-settings slot="icon"></sp-icon-settings>
</sp-action-button>
```

### Use Descriptive Labels

**Bad (generic):**
```typescript
aria-label="Button"
```

**Good (specific):**
```typescript
aria-label="Duplicate this lyric line"
```

### Title for Tooltips

Combine both for best UX:

```typescript
<sp-action-button 
  aria-label="Duplicate lyric line"
  title="Duplicate"
>
  <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
</sp-action-button>
```

---

## Common Issues & Solutions

### Issue: Icon Not Showing

**Symptoms:** Button is empty, no icon visible

**Cause:** Import missing or incorrect

**Solution:**
1. Check import path is correct
2. Ensure import is at top of file
3. Clear cache and reload (Ctrl+Shift+R)

### Issue: Icon Too Large/Small

**Symptoms:** Icon doesn't fit in button

**Cause:** Default sizing may not match your layout

**Solution:**
Use CSS custom properties:
```css
sp-action-button {
  --spectrum-icon-size: 18px;
}
```

### Issue: Icon Wrong Color

**Symptoms:** Icon doesn't match button color

**Cause:** Theme tokens not loading properly

**Cause:** Ensure `<sp-theme>` is wrapping your app

### Issue: "sp-icon-X has already been used"

**Symptoms:** Console error about duplicate registration

**Cause:** Icon imported multiple times

**Solution:** 
- Import icons in component files, not globally
- Each component imports only what it needs

---

## Icon Size Reference

Spectrum icons adapt to context, but you can customize:

```css
/* Small (16px) - compact UIs */
sp-action-button {
  --spectrum-icon-size: 16px;
}

/* Medium (18px) - default */
sp-action-button {
  --spectrum-icon-size: 18px;
}

/* Large (24px) - prominent actions */
sp-button {
  --spectrum-icon-size: 24px;
}
```

---

## Next Steps

1. **Run the tests** to see current icon violations:
   ```bash
   npm run test:spectrum
   ```

2. **Start with high-impact icons**:
   - Settings (visible in navbar)
   - Primary actions (duplicate, delete)
   - Navigation (arrows, close)

3. **Work through one component at a time**:
   - Add imports
   - Replace icons
   - Test visually
   - Run tests again

4. **Verify accessibility**:
   - All icon-only buttons have labels
   - Screen reader announces correctly
   - Keyboard navigation works

---

## Resources

- **Icon Library:** https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/
- **Icon Package:** https://www.npmjs.com/package/@spectrum-web-components/icons-workflow
- **Action Button Docs:** https://opensource.adobe.com/spectrum-web-components/components/action-button/
- **Button Docs:** https://opensource.adobe.com/spectrum-web-components/components/button/

---

*Last Updated: November 27, 2024*

