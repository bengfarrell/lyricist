# Panel Positioning Feature Removal

## Overview
Removed the canvas-lyrics hybrid view feature (panel positioning buttons) that allowed displaying formatted lyrics as an overlay on the canvas. This simplifies the UI and focuses on the clean canvas-only experience.

## What Was Removed

### 1. Navbar Position Buttons (src/app-navbar/index.ts)
**Before**: 4 buttons in navbar-right for positioning lyrics:
- ◧ Left
- ◨ Right
- ◩ Top
- ◪ Bottom

**After**: Only the settings button (⚙️) remains in navbar-right

**Code Changes**:
- Removed `_isCanvasMode()` helper method
- Removed `_toggleLyricsPosition()` method
- Simplified `_switchPanel()` parameter types
- Removed 4 position toggle buttons from template

### 2. Panel State Types Simplified

**Before**:
```typescript
type Panel = 'word-ladder' | 'canvas' | 'lyrics' | 
             'canvas-lyrics-left' | 'canvas-lyrics-right' | 
             'canvas-lyrics-top' | 'canvas-lyrics-bottom';
```

**After**:
```typescript
type Panel = 'word-ladder' | 'canvas' | 'lyrics';
```

**Updated in**:
- `src/store/song-store.ts` - Private state and getter
- `src/store/song-store.ts` - `setCurrentPanel()` method
- `src/store/song-store-controller.ts` - `setCurrentPanel()` method

### 3. Main App Layout (src/lyricist-app/index.ts)

**Before**: Complex conditional rendering with overlay panels
```typescript
const isCanvasLyricsLeft = currentPanel === 'canvas-lyrics-left';
const isCanvasLyricsRight = currentPanel === 'canvas-lyrics-right';
const isCanvasLyricsTop = currentPanel === 'canvas-lyrics-top';
const isCanvasLyricsBottom = currentPanel === 'canvas-lyrics-bottom';
const isHybridMode = isCanvasLyricsLeft || ...;

// Multiple conditional overlay panels
```

**After**: Simple 3-panel layout
```typescript
<left-panel class="panel ${currentPanel === 'word-ladder' ? 'visible' : 'hidden'}">
<lyric-canvas class="panel ${currentPanel === 'canvas' ? 'visible' : 'hidden'}">
<lyrics-panel class="panel ${currentPanel === 'lyrics' ? 'visible' : 'hidden'}">
```

### 4. Overlay CSS Removed (src/lyricist-app/styles.css.ts)

Removed all overlay-specific styles:
- `.panel-overlay` (base overlay styles)
- `.panel-overlay-left` (50% width, left side)
- `.panel-overlay-right` (50% width, right side)
- `.panel-overlay-top` (50% height, top)
- `.panel-overlay-bottom` (50% height, bottom)
- `.panel-overlay.visible` (visibility state)

**Impact**: ~45 lines of CSS removed

### 5. Floating Strip Simplification (src/floating-strip/index.ts)

**Before**:
```typescript
const isCanvasMode = currentPanel === 'canvas' || 
                     currentPanel === 'canvas-lyrics-left' || ...;
```

**After**:
```typescript
const isCanvasMode = currentPanel === 'canvas';
```

### 6. Lyrics Panel Component (src/lyrics-panel/index.ts)

Removed overlay mode:
- Deleted `static properties` for `overlay` attribute
- Removed `overlay = false` property
- Removed overlay-specific scrollbar hiding CSS

**src/lyrics-panel/styles.css.ts**:
Removed:
```css
:host([overlay]) .lyrics-panel-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
:host([overlay]) .lyrics-panel-content::-webkit-scrollbar {
  display: none;
}
```

## What Still Works

✅ **3 Main Views**:
1. **Word Ladder** - Rhyme word columns
2. **Canvas** - Drag-and-drop lyric positioning (now with infinite canvas!)
3. **Lyrics** - Formatted sheet view with chords

✅ **All Canvas Features**:
- Infinite canvas with pan (2-finger, trackpad, spacebar)
- Hand cursor visual feedback
- Marquee selection
- Item dragging
- Keyboard shortcuts (delete/backspace)
- Delete button in floating strip

✅ **All Other Features**:
- Word ladder
- Chord notation
- Groups/sections
- Cloud sync
- Export/download

## Benefits of Removal

1. **Simpler UX** - Fewer buttons, less confusion
2. **Cleaner Code** - Removed ~150 lines of code total
3. **Better Focus** - Canvas mode is now dedicated to canvas work
4. **Easier Maintenance** - Fewer edge cases to test
5. **Improved Performance** - No overlay rendering overhead

## Migration Notes

**For Users**:
- If you were using the hybrid canvas+lyrics views, you now need to switch between Canvas and Lyrics tabs
- This actually provides a cleaner, less cluttered experience
- All your songs and lyrics are still intact

**For Developers**:
- `currentPanel` type is now simpler (`'word-ladder' | 'canvas' | 'lyrics'`)
- No more overlay mode to worry about
- Panel switching is now straightforward boolean checks

## Files Modified

1. ✅ `src/app-navbar/index.ts` - Removed buttons and methods
2. ✅ `src/store/song-store.ts` - Simplified panel type
3. ✅ `src/store/song-store-controller.ts` - Simplified panel type
4. ✅ `src/lyricist-app/index.ts` - Simplified render logic
5. ✅ `src/lyricist-app/styles.css.ts` - Removed overlay CSS
6. ✅ `src/floating-strip/index.ts` - Simplified canvas mode check
7. ✅ `src/lyrics-panel/index.ts` - Removed overlay property
8. ✅ `src/lyrics-panel/styles.css.ts` - Removed overlay CSS

## Testing

✅ TypeScript compilation: **PASSED**
✅ Dev server reload: **SUCCESS**
✅ App running at: **http://localhost:3000**

Try these workflows:
1. Switch between Word Ladder / Canvas / Lyrics tabs ✓
2. Canvas mode shows only canvas (clean!) ✓
3. Lyrics mode shows formatted view ✓
4. Spacebar pan still works ✓
5. All canvas interactions work ✓
