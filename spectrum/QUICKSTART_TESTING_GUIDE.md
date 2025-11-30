# Quick Start: Testing Your Spectrum Web Components Migration

## 🚀 Ready to Test!

All Spectrum Web Components have been successfully integrated. Here's how to test your upgraded app.

---

## Step 1: Start the Dev Server

```bash
npm run dev
```

The app should start without errors. If you see any import errors, the bundle might need to be installed:

```bash
npm install
npm run dev
```

---

## Step 2: Quick Visual Check

Open the app in your browser and do a quick visual scan:

### ✅ What to Look For:

**Buttons should look polished:**
- Clean rounded corners
- Subtle hover effects
- Clear focus indicators
- Proper disabled states (grayed out)

**Text inputs should have:**
- Clean borders (or no border for `quiet` variant)
- Focus animation (blue highlight)
- Cursor changes to text when hovering

**Action buttons should:**
- Show on hover (if quiet variant)
- Display selection state (for alignment buttons)
- Have proper touch targets

### 🎨 Expected Visual Changes:

| Element | Before | After |
|---------|--------|-------|
| **Buttons** | Custom styled | Spectrum blue accent/gray secondary |
| **Text Inputs** | Basic border | Spectrum focus ring + animation |
| **Action Buttons** | Always visible | Subtle until hover (quiet variant) |
| **Loading States** | Manual emoji spinner | Built-in Spectrum spinner |

---

## Step 3: Functional Testing

### Test Each Panel

#### 1. **Word Ladder Panel**
- [ ] Click "Word Ladder" tab
- [ ] Type in left word input, press Tab → word added
- [ ] Type in right word input, press Tab → word added
- [ ] Click suggestion chips → title changes
- [ ] Click word items → selection works
- [ ] Click × on word → word removed
- [ ] Click 🎲 → random combination selected

#### 2. **Canvas Panel**
- [ ] Click "Canvas" tab
- [ ] Type lyric in input, click "Add Lyric" → line appears
- [ ] Drag lyric line → moves smoothly
- [ ] Double-click lyric → edit mode works
- [ ] Click ⊕ → duplicates
- [ ] Click × → deletes
- [ ] Click ♪ → chord section appears/disappears
- [ ] Click alignment buttons (◧ ◨ ◩ ◪) → lyrics panel appears/disappears

#### 3. **Lyrics Panel**
- [ ] Click "Lyrics" tab
- [ ] Formatted lyrics display correctly
- [ ] Click "Copy to Clipboard" → copies lyrics

### Test Dialogs

#### Email Prompt
- [ ] Click settings ⚙️
- [ ] Dialog appears with dark overlay
- [ ] Type invalid email → validation shows
- [ ] Type valid email → validation clears
- [ ] Click "Skip" → dialog closes
- [ ] Click "Enable Sync" → saves email

#### Edit Modal (Mobile)
- [ ] On mobile/narrow screen
- [ ] Double-click lyric line
- [ ] Modal appears
- [ ] Edit text
- [ ] Click "Save" → updates line
- [ ] Click "Cancel" → discards changes

#### Load Dialog
- [ ] Click "Load" in header
- [ ] Dialog shows saved songs
- [ ] Click song → loads
- [ ] Click "Delete" → confirms and deletes
- [ ] Click "Import JSON" → file picker opens
- [ ] Click "Export JSON" → downloads file
- [ ] Click "Close" → dialog closes

### Test Header
- [ ] Edit song name in header input → updates
- [ ] Click "Save" → saves song
- [ ] Click "Load" → opens load dialog
- [ ] Click "New" → confirms and clears

---

## Step 4: Keyboard Navigation

Test that keyboard navigation works:

### Tab Order
- [ ] Press Tab repeatedly → focus moves through all interactive elements
- [ ] Focus indicators visible on all buttons/inputs
- [ ] Tab order is logical (left-to-right, top-to-bottom)

### Enter/Escape
- [ ] Press Enter in text input → submits form
- [ ] Press Escape in dialog → closes dialog
- [ ] Press Escape while editing → cancels edit

### Arrows (Future Enhancement)
- Spectrum menus support arrow key navigation
- Not implemented in current version

---

## Step 5: Responsive Testing

### Mobile (< 768px)
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
- [ ] Select "iPhone 12 Pro" or similar
- [ ] All buttons are large enough to tap
- [ ] Text inputs are easy to focus
- [ ] Floating strip appears (mobile layout)
- [ ] File modal is fullscreen

### Tablet (768px - 1024px)
- [ ] Select "iPad" or resize window
- [ ] Layout adjusts appropriately
- [ ] Controls remain usable

### Desktop (> 1024px)
- [ ] Resize to full width
- [ ] All elements scale nicely
- [ ] Hover states work

---

## Step 6: Drag & Drop Testing

**Critical:** Ensure custom drag/drop functionality still works.

### Lyric Lines
- [ ] Click and drag lyric line → moves
- [ ] Drag multiple pixels → line follows cursor
- [ ] Release → line stays in new position
- [ ] Line doesn't jump or glitch

### Lyric Groups
- [ ] Create a group (select section, add multiple lines)
- [ ] Drag group → entire group moves
- [ ] Release → group stays together
- [ ] Click "Ungroup" → lines separate

### Chord Markers
- [ ] Add chords to a line (click ♪, click chord section)
- [ ] Drag chord marker → moves along line
- [ ] Chord picker still opens
- [ ] Chord options selectable

---

## Step 7: Browser Testing

Test in your target browsers:

### Chrome (Primary)
- [ ] All functionality works
- [ ] No console errors
- [ ] Performance acceptable

### Safari
- [ ] Spectrum components render
- [ ] Drag/drop works
- [ ] No visual glitches

### Firefox
- [ ] Components render correctly
- [ ] All interactions work

### Edge
- [ ] Similar to Chrome (Chromium-based)

---

## Common Issues & Solutions

### Issue: Buttons Don't Look Right

**Symptoms:** Buttons still look like old custom buttons

**Cause:** Theme not loading or CSS conflicts

**Solution:**
1. Check console for theme errors
2. Ensure `<sp-theme>` is wrapping the app
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard reload (Ctrl+Shift+R / Cmd+Shift+R)

---

### Issue: Text Input Not Working

**Symptoms:** Can't type in sp-textfield

**Cause:** Event handler not connected or shadow DOM issue

**Solution:**
1. Check console for errors
2. Ensure `@input` handler is present
3. Verify event target typing: `(e.target as HTMLInputElement).value`

---

### Issue: Drag/Drop Broken

**Symptoms:** Lyric lines won't drag

**Cause:** Likely not related to SWC (buttons replaced, not container)

**Solution:**
1. Check if issue exists in Canvas tab only
2. Verify `_isDragging` state
3. Check pointer event handlers
4. This would indicate a separate issue (not SWC-related)

---

### Issue: Theme Not Loading

**Symptoms:** Console error about "theme fragment not loaded"

**Cause:** Theme imports missing from main.ts

**Solution:**
Ensure these lines are in `src/main.ts`:
```typescript
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/theme-dark.js';
```

---

### Issue: Buttons Too Large/Small

**Symptoms:** Buttons don't fit in layout

**Cause:** Different default sizing from custom buttons

**Solution:**
1. Add custom CSS to adjust button size
2. Use `size="s"` attribute for smaller buttons
3. Adjust container padding/margins

---

### Issue: Focus Styles Too Prominent

**Symptoms:** Blue focus ring distracting

**Cause:** Spectrum's default focus indicator

**Solution:**
This is actually good for accessibility! If you must change:
```css
sp-button {
  --mod-button-focus-ring-color: rgba(0, 0, 0, 0.3);
}
```

---

## Performance Check

### Bundle Size
```bash
npm run build
```

Check `dist/` folder size. Expected increase: ~150KB due to SWC.

### Runtime Performance
- [ ] Initial load time similar
- [ ] Drag/drop feels smooth (60fps)
- [ ] No frame drops when interacting
- [ ] Canvas rendering not affected

---

## Production Build Test

Before deploying:

```bash
npm run build
npm run preview
```

- [ ] Production build succeeds
- [ ] Preview server starts
- [ ] All functionality works in production build
- [ ] No console errors

---

## Deployment Checklist

Before pushing to production:

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] Drag/drop works perfectly
- [ ] Mobile experience good
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Build size acceptable

---

## Roll Back Plan

If something is critically broken:

### Option 1: Git Revert (if committed)
```bash
git log  # Find commit hash before SWC changes
git revert <commit-hash>
```

### Option 2: Manual Rollback
1. Remove `@spectrum-web-components` imports from components
2. Change `<sp-button>` back to `<button>`
3. Change `<sp-textfield>` back to `<input>`
4. Change `<sp-action-button>` back to `<button>`
5. Remove `<sp-theme>` wrapper from lyricist-app

---

## Success Criteria

Your migration is successful if:

✅ All functionality works as before
✅ Visual appearance is clean and consistent
✅ Drag/drop still works smoothly
✅ No console errors
✅ Mobile experience is good
✅ Performance is acceptable
✅ Accessibility is improved

---

## Getting Help

If you encounter issues:

1. **Check documentation:**
   - [STEP_2_SWC_REPLACEMENT_PLAN.md](./STEP_2_SWC_REPLACEMENT_PLAN.md)
   - [STEP_2_COMPLETION_REPORT.md](./STEP_2_COMPLETION_REPORT.md)

2. **Check Spectrum docs:**
   - [Button](https://opensource.adobe.com/spectrum-web-components/components/button/)
   - [Textfield](https://opensource.adobe.com/spectrum-web-components/components/textfield/)
   - [Action Button](https://opensource.adobe.com/spectrum-web-components/components/action-button/)

3. **Common fixes:**
   - Clear cache and hard reload
   - Check console for errors
   - Verify imports are correct
   - Ensure theme is loaded

---

## Next Steps After Testing

Once testing is complete:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: migrate to Spectrum Web Components"
   ```

2. **Optional CSS cleanup:**
   - Remove unused custom button CSS
   - Simplify input styles
   - Reduce overall CSS footprint

3. **Consider enhancements:**
   - Add dark mode toggle
   - Replace emojis with Spectrum icons
   - Add size variants for mobile

4. **Deploy with confidence!**

---

*Happy Testing! 🎉*


