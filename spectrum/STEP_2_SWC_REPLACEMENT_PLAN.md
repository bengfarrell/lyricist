# Step 2: Spectrum Web Components Replacement Plan

## Overview

This document provides a comprehensive plan to replace custom HTML/CSS implementations with official Spectrum Web Components (SWC). This upgrade will provide:

- ✅ **Better Accessibility** - ARIA attributes and keyboard navigation built-in
- ✅ **Consistent Styling** - Official Spectrum design system
- ✅ **Easier Maintenance** - Updates come from Adobe
- ✅ **Reduced Custom CSS** - Less styling code to maintain
- ✅ **Standards-Based** - Web Components work everywhere

---

## Setup Requirements

### 1. Initialize Spectrum Theme

**File:** `src/main.ts`

Add theme imports and wrap the app:

```typescript
import './lyricist-app';
import { registerSW } from 'virtual:pwa-register';

// ✅ ADD THESE IMPORTS
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/theme-dark.js';

// Register service worker...
const updateSW = registerSW({...});
```

### 2. Wrap Application

**File:** `src/lyricist-app/index.ts`

```typescript
render() {
  return html`
    <sp-theme scale="medium" color="light" theme="spectrum">
      <div class="container">
        <!-- All existing content -->
      </div>
    </sp-theme>
  `;
}
```

---

## Component Replacement Analysis

### ✅ Can Replace Immediately (No Functionality Loss)

These components can be replaced directly with SWC equivalents:

#### 1. **Buttons** → `<sp-button>`

**Current:**
```html
<button class="btn btn-primary" data-spectrum-pattern="button-accent">
  Save
</button>
```

**Replace with:**
```html
<sp-button variant="accent" data-spectrum-pattern="button-accent">
  Save
</sp-button>
```

**Variants:**
- `variant="accent"` → Primary CTA
- `variant="primary"` → Important actions
- `variant="secondary"` → Secondary actions
- `variant="negative"` → Destructive actions

**Import:** `import '@spectrum-web-components/button/sp-button.js';`

**Components affected:**
- ✅ app-header (Save, Load, New buttons)
- ✅ app-controls (Add Line, Create Section buttons)
- ✅ floating-strip (Add Lyric, Create buttons)
- ✅ load-dialog (Close, Delete buttons)
- ✅ file-modal (Save, New, Load buttons)
- ✅ email-prompt (Submit, Skip buttons)
- ✅ edit-modal (Save, Cancel buttons)

---

#### 2. **Action Buttons** → `<sp-action-button>`

**Current:**
```html
<button class="action-btn" data-spectrum-pattern="action-button-quiet">
  ⚙️
</button>
```

**Replace with:**
```html
<sp-action-button quiet data-spectrum-pattern="action-button-quiet">
  <sp-icon-settings slot="icon"></sp-icon-settings>
</sp-action-button>
```

**Modifiers:**
- `quiet` → No background until hover
- `emphasized` → Accent color when selected
- `selected` → Selected state
- `disabled` → Disabled state

**Import:** 
- `import '@spectrum-web-components/action-button/sp-action-button.js';`
- `import '@spectrum-web-components/icons-workflow/icons/sp-icon-[name].js';`

**Components affected:**
- ✅ app-navbar (Settings, alignment buttons)
- ✅ floating-strip (Dice button, alignment buttons)
- ✅ left-panel (Remove word buttons)
- ✅ lyric-line (Duplicate, Delete, Chord toggle)
- ✅ lyric-group (Duplicate, Delete, Ungroup)

---

#### 3. **Text Fields** → `<sp-textfield>`

**Current:**
```html
<input 
  type="text" 
  class="lyric-input"
  data-spectrum-pattern="textfield"
  placeholder="Enter lyrics..."
/>
```

**Replace with:**
```html
<sp-textfield 
  data-spectrum-pattern="textfield"
  placeholder="Enter lyrics..."
></sp-textfield>
```

**Modifiers:**
- `invalid` → Error state
- `valid` → Success state  
- `disabled` → Disabled state
- `readonly` → Read-only state
- `quiet` → No border until focus

**Import:** `import '@spectrum-web-components/textfield/sp-textfield.js';`

**Components affected:**
- ✅ app-header (Song name input)
- ✅ app-controls (Lyric input, custom section input)
- ✅ floating-strip (Lyric input, custom section input)
- ✅ file-modal (Song name input)
- ✅ email-prompt (Email input)
- ✅ edit-modal (Lyric edit input)
- ✅ left-panel (Word inputs, title edit inputs)
- ✅ lyric-line (Text edit input)

---

#### 4. **Dialogs** → `<sp-dialog-wrapper>` + `<sp-dialog>`

**Current:**
```html
<div class="modal-backdrop" data-spectrum-pattern="underlay-open">
  <div class="modal" data-spectrum-pattern="modal-open dialog">
    <div class="modal-header" data-spectrum-pattern="dialog-heading">
      <h2>Title</h2>
    </div>
    <div class="modal-body" data-spectrum-pattern="dialog-content">
      Content
    </div>
    <div class="modal-footer" data-spectrum-pattern="dialog-footer">
      <sp-button>OK</sp-button>
    </div>
  </div>
</div>
```

**Replace with:**
```html
<sp-dialog-wrapper 
  ?open=${this.showDialog}
  headline="Title"
  dismissable
  @close=${this.handleClose}
>
  <div>Content</div>
  <sp-button slot="button" variant="accent" @click=${this.handleOK}>
    OK
  </sp-button>
  <sp-button slot="button" @click=${this.handleClose}>
    Cancel
  </sp-button>
</sp-dialog-wrapper>
```

**Import:** 
- `import '@spectrum-web-components/dialog/sp-dialog.js';`
- `import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';`

**Components affected:**
- ✅ email-prompt (Settings dialog)
- ✅ edit-modal (Edit lyric dialog)
- ⚠️ load-dialog (Would need adjustment - see below)
- ⚠️ file-modal (Fullscreen - may keep custom)

---

#### 5. **Action Groups** → `<sp-action-group>`

**Current:**
```html
<div class="toolbar" data-spectrum-pattern="action-group-horizontal">
  <button data-spectrum-pattern="action-button">Edit</button>
  <button data-spectrum-pattern="action-button">Delete</button>
</div>
```

**Replace with:**
```html
<sp-action-group 
  compact 
  data-spectrum-pattern="action-group-horizontal"
>
  <sp-action-button>Edit</sp-action-button>
  <sp-action-button>Delete</sp-action-button>
</sp-action-group>
```

**Modifiers:**
- `compact` → Reduced spacing
- `vertical` → Vertical layout
- `justified` → Equal width items
- `selects="single"` → Radio behavior
- `selects="multiple"` → Checkbox behavior

**Import:** `import '@spectrum-web-components/action-group/sp-action-group.js';`

**Components affected:**
- ✅ app-navbar (Alignment buttons)
- ✅ app-controls (Section buttons)
- ✅ floating-strip (Alignment buttons, section buttons)
- ✅ left-panel (Suggestion chips)

---

#### 6. **Menus** → `<sp-menu>` + `<sp-menu-item>`

**Current:**
```html
<div class="section-picker-panel" data-spectrum-pattern="menu">
  <button class="section-bubble" data-spectrum-pattern="menu-item">
    Verse
  </button>
</div>
```

**Replace with:**
```html
<sp-menu data-spectrum-pattern="menu">
  <sp-menu-item data-spectrum-pattern="menu-item" @click=${this.handleVerse}>
    Verse
  </sp-menu-item>
</sp-menu>
```

**Import:** 
- `import '@spectrum-web-components/menu/sp-menu.js';`
- `import '@spectrum-web-components/menu/sp-menu-item.js';`
- `import '@spectrum-web-components/menu/sp-menu-divider.js';` (for dividers)

**Components affected:**
- ✅ floating-strip (Section picker menu)
- ✅ file-modal (Document picker - if converted)
- ⚠️ lyric-line (Chord picker - see concerns below)

---

### ⚠️ Replace with Caution (Possible Functionality Impact)

These components could be replaced but need careful consideration:

#### 7. **Tabs** → `<sp-tabs>` + `<sp-tab>`

**Current:**
```html
<div class="navbar-tabs" data-spectrum-pattern="tabs">
  <button class="navbar-tab active" data-spectrum-pattern="tab-item tab-selected">
    Canvas
  </button>
</div>
```

**Replace with:**
```html
<sp-tabs 
  selected="canvas"
  @change=${this.handleTabChange}
  data-spectrum-pattern="tabs"
>
  <sp-tab label="Word Ladder" value="word-ladder"></sp-tab>
  <sp-tab label="Canvas" value="canvas"></sp-tab>
  <sp-tab label="Lyrics" value="lyrics"></sp-tab>
  <sp-tab-panel value="word-ladder">
    <!-- Content -->
  </sp-tab-panel>
</sp-tabs>
```

**⚠️ Considerations:**
- SWC tabs include tab panels which your current implementation doesn't use
- You're managing panel visibility separately via `currentPanel` state
- **Recommendation:** Keep custom tabs OR restructure to use tab panels

**Import:** 
- `import '@spectrum-web-components/tabs/sp-tabs.js';`
- `import '@spectrum-web-components/tabs/sp-tab.js';`

**Components affected:**
- ⚠️ app-navbar (Navigation tabs)

---

#### 8. **Popovers** → `<sp-popover>` + `<sp-overlay>`

**Current:**
```html
<div class="chord-picker" data-spectrum-pattern="popover-right popover-open">
  <!-- Menu content -->
</div>
```

**Replace with:**
```html
<sp-overlay 
  ?open=${this.showChordPicker}
  type="manual"
  placement="right"
>
  <sp-popover data-spectrum-pattern="popover-right">
    <sp-menu>
      <!-- Chord options -->
    </sp-menu>
  </sp-popover>
</sp-overlay>
```

**⚠️ Considerations:**
- SWC overlays use different positioning logic
- Your chord picker has complex positioning relative to canvas
- **Recommendation:** Keep custom popover OR significantly refactor positioning

**Import:** 
- `import '@spectrum-web-components/overlay/overlay-trigger.js';`
- `import '@spectrum-web-components/popover/sp-popover.js';`

**Components affected:**
- ⚠️ lyric-line (Chord picker popover)
- ⚠️ floating-strip (Section picker popover)

---

### ❌ Don't Replace (Would Lose Critical Functionality)

These components should **NOT** be replaced because they have custom functionality that SWC doesn't support:

#### 9. **Draggable Elements** (lyric-line, lyric-group)

**Why NOT to replace:**
- ❌ SWC has no draggable component
- ❌ Custom drag logic is core to the app
- ❌ Position tracking, rotation, z-index management
- ❌ Selection box interactions
- ❌ Chord marker dragging

**Recommendation:** Keep custom components, use SWC for buttons inside them

---

#### 10. **Canvas Container** (lyric-canvas)

**Why NOT to replace:**
- ❌ No SWC equivalent for freeform canvas
- ❌ Custom drag-and-drop system
- ❌ Selection box drawing
- ❌ Position-based rendering

**Recommendation:** Keep custom, use SWC for empty state content

---

#### 11. **Custom Layouts** (floating-strip, app-navbar, file-modal)

**Why NOT to replace main structure:**
- ❌ Unique positioning logic (floating strip)
- ❌ Custom responsive behavior
- ❌ App-specific layout requirements

**Recommendation:** Replace buttons/inputs inside, keep container structure

---

#### 12. **Word Ladder Lists** (left-panel)

**Why NOT to replace:**
- ❌ Custom word selection/pairing logic
- ❌ Dynamic word combination display
- ❌ Edit-in-place behavior

**Recommendation:** Replace individual inputs/buttons, keep list structure

---

## Implementation Priority

### Phase 1: Low-Risk Replacements (Start Here)

1. ✅ **Basic Buttons** - Replace all `<button>` with `<sp-button>`
2. ✅ **Text Inputs** - Replace `<input>` with `<sp-textfield>`
3. ✅ **Simple Dialogs** - Replace email-prompt and edit-modal

**Estimated Impact:** Low risk, high benefit

### Phase 2: Medium Complexity

4. ✅ **Action Buttons** - Replace icon buttons with `<sp-action-button>`
5. ✅ **Action Groups** - Replace button groups
6. ✅ **Simple Menus** - Replace section picker menu

**Estimated Impact:** Medium risk, medium benefit

### Phase 3: High Complexity (Optional)

7. ⚠️ **Tabs** - Consider if tab panel structure fits
8. ⚠️ **Popovers** - Evaluate positioning requirements
9. ⚠️ **Load Dialog** - Complex list + actions

**Estimated Impact:** Higher risk, medium benefit

---

## Benefits of Each Replacement

### Buttons → sp-button

**Gains:**
- ✅ Built-in focus states
- ✅ Consistent hover/active animations
- ✅ Proper disabled styling
- ✅ Loading state support (`pending` attribute)
- ✅ Reduced custom CSS

**No Losses:** Direct replacement

---

### Text Fields → sp-textfield

**Gains:**
- ✅ Built-in validation states
- ✅ Helper text support
- ✅ Label association
- ✅ Character counter
- ✅ Better accessibility

**No Losses:** Direct replacement

---

### Action Buttons → sp-action-button

**Gains:**
- ✅ Built-in selection states
- ✅ Icon slot management
- ✅ Quiet variant styling
- ✅ Hold gesture support
- ✅ Better touch targets

**Potential Loss:** Custom icon styling may need adjustment

---

### Dialogs → sp-dialog-wrapper

**Gains:**
- ✅ Focus trapping
- ✅ Escape key handling
- ✅ Backdrop click handling
- ✅ Modal accessibility
- ✅ Responsive sizing

**Potential Loss:** More rigid structure, less layout flexibility

---

### Menus → sp-menu

**Gains:**
- ✅ Keyboard navigation (arrow keys)
- ✅ Type-ahead search
- ✅ Selection management
- ✅ Dividers and sections
- ✅ Better accessibility

**Potential Loss:** Custom menu item styling harder

---

## CSS Cleanup Opportunities

After replacing components, you can remove:

```css
/* Can DELETE these after replacement */
.btn { ... }
.btn-primary { ... }
.btn-secondary { ... }
.action-btn { ... }
.lyric-input { ... }
.email-input { ... }
.modal-backdrop { ... }
.dialog { ... }
```

**Estimated reduction:** 30-40% less custom CSS

---

## Implementation Example: email-prompt

### Before (Custom):

```typescript
<div class="overlay" data-spectrum-pattern="underlay-open">
  <div class="dialog" data-spectrum-pattern="modal-open dialog">
    <div class="header">
      <h2>Set Up Cloud Sync</h2>
    </div>
    <form @submit=${this._handleSubmit}>
      <input type="email" class="email-input" />
      <button class="btn btn-primary">Enable Sync</button>
      <button class="btn btn-secondary">Skip</button>
    </form>
  </div>
</div>
```

### After (Spectrum Web Components):

```typescript
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';

<sp-dialog-wrapper
  ?open=${this.store.showEmailPrompt}
  headline="Set Up Cloud Sync"
  dismissable
  mode="fullscreen"
  @close=${this._handleSkip}
>
  <p>Enter your email to sync songs across all your devices</p>
  
  <sp-textfield
    type="email"
    placeholder="your.email@example.com"
    .value=${this.email}
    ?invalid=${!!this.errorMessage}
    @input=${this._handleInput}
    required
  ></sp-textfield>
  
  ${this.errorMessage ? html`
    <p class="error">${this.errorMessage}</p>
  ` : ''}
  
  <sp-button 
    slot="button" 
    variant="accent"
    ?pending=${this.isSubmitting}
    @click=${this._handleSubmit}
  >
    Enable Sync
  </sp-button>
  
  <sp-button 
    slot="button" 
    variant="secondary"
    @click=${this._handleSkip}
  >
    Skip (Local Only)
  </sp-button>
</sp-dialog-wrapper>
```

**Benefits:**
- ✅ Less custom CSS needed
- ✅ Better accessibility
- ✅ Consistent with Spectrum design
- ✅ Built-in focus management
- ✅ Responsive sizing

---

## Testing Strategy

For each replaced component:

1. **Visual Testing**
   - Verify styling matches original
   - Test all states (hover, focus, active, disabled)
   - Check responsive behavior

2. **Functional Testing**
   - Verify all click handlers work
   - Test keyboard navigation
   - Validate form submission
   - Check state management

3. **Accessibility Testing**
   - Screen reader announces correctly
   - Keyboard navigation works
   - Focus indicators visible
   - ARIA attributes present

4. **Integration Testing**
   - Works with existing store/controllers
   - Doesn't break other components
   - Performance acceptable

---

## Migration Checklist

- [ ] Set up sp-theme in main.ts
- [ ] Wrap app with `<sp-theme>`
- [ ] **Phase 1: Buttons**
  - [ ] Replace buttons in app-header
  - [ ] Replace buttons in app-controls
  - [ ] Replace buttons in floating-strip
  - [ ] Replace buttons in dialogs
- [ ] **Phase 1: Text Fields**
  - [ ] Replace inputs in app-header
  - [ ] Replace inputs in app-controls
  - [ ] Replace inputs in floating-strip
  - [ ] Replace inputs in left-panel
  - [ ] Replace inputs in dialogs
- [ ] **Phase 1: Simple Dialogs**
  - [ ] Replace email-prompt
  - [ ] Replace edit-modal
- [ ] **Phase 2: Action Buttons**
  - [ ] Replace in app-navbar
  - [ ] Replace in lyric-line
  - [ ] Replace in lyric-group
- [ ] **Phase 2: Action Groups**
  - [ ] Replace in app-navbar
  - [ ] Replace in floating-strip
- [ ] **Phase 2: Menus**
  - [ ] Replace section picker
- [ ] Remove unused custom CSS
- [ ] Test all replaced components
- [ ] Update documentation

---

## Expected Results

After full implementation:

**Code Quality:**
- ✅ 30-40% less custom CSS
- ✅ Better separation of concerns
- ✅ Easier to maintain
- ✅ Consistent with Spectrum design

**Accessibility:**
- ✅ Better screen reader support
- ✅ Improved keyboard navigation
- ✅ Proper ARIA attributes
- ✅ Better focus management

**User Experience:**
- ✅ More consistent interactions
- ✅ Better animations/transitions
- ✅ Responsive sizing
- ✅ Mobile-friendly

**Developer Experience:**
- ✅ Less code to write
- ✅ Official documentation
- ✅ Community support
- ✅ Automatic updates

---

*Next: Proceed with Phase 1 implementation*


