# Spacebar Pan Mode Implementation

## Overview
Added spacebar as a modifier key to enable pan mode, allowing users to hold spacebar and drag to pan the canvas. This works alongside the existing 2-finger touch/trackpad panning.

## Features Implemented

### 1. Spacebar Pan State (src/store/song-store.ts)
Added state tracking for spacebar pan mode:
- `_isSpacebarPanMode: boolean` - Tracks if spacebar is currently held
- `isSpacebarPanMode` - Getter for reactive access
- `setSpacebarPanMode(enabled)` - Setter to toggle pan mode

### 2. Keyboard Manager Updates (src/keyboard-manager/index.ts)
Enhanced keyboard manager to handle spacebar:
- **keydown handler**: 
  - Detects spacebar press (`e.key === ' '` or `e.code === 'Space'`)
  - Prevents default page scroll behavior
  - Sets `isSpacebarPanMode = true`
  - Only activates if not in text input field
  
- **keyup handler**: 
  - Detects spacebar release
  - Sets `isSpacebarPanMode = false`
  - Registered in init() and cleaned up in destroy()

### 3. Canvas Pan Mode Integration (src/lyric-canvas/index.ts)
Updated canvas to respond to spacebar pan mode:
- Checks `store.isSpacebarPanMode` in `_handleCanvasPointerDown`
- If spacebar is held OR 2-finger gesture detected:
  - Starts pan mode (`_isPanning = true`)
  - Captures initial mouse position and pan offset
  - Cancels any active selection box
  - Prevents marquee selection during pan

### 4. Hand Cursor Visual Feedback (src/lyric-canvas/styles.css.ts)
Added cursor states to indicate pan mode:
- **cursor-grab**: Open hand cursor when pan mode is active (spacebar held)
- **cursor-grabbing**: Closed hand cursor when actively panning (dragging)
- Applied dynamically based on pan state:
  ```typescript
  const isPanMode = this.store.isSpacebarPanMode || this._isPanning;
  const cursorClass = isPanMode ? (this._isPanning ? 'cursor-grabbing' : 'cursor-grab') : '';
  ```

## User Experience

### Pan Mode Activation
Three ways to activate pan mode:

1. **Spacebar + Drag** (Desktop)
   - Hold spacebar → cursor changes to open hand (grab)
   - Click and drag → cursor changes to closed hand (grabbing)
   - Canvas pans smoothly
   - Release mouse → cursor returns to open hand
   - Release spacebar → cursor returns to normal

2. **2-Finger Trackpad Drag** (Desktop)
   - Use 2 fingers on trackpad to drag
   - Triggers wheel events
   - Canvas pans immediately
   - Cursor changes to grabbing

3. **2-Finger Touch Drag** (Mobile)
   - Touch with 2 fingers and drag
   - Detects multi-touch via activeTouches
   - Canvas pans smoothly
   - Visual feedback on canvas

### Cursor States

| State | Cursor | When |
|-------|--------|------|
| Normal | default | No pan mode active |
| Ready to Pan | grab (open hand) | Spacebar held, not dragging |
| Panning | grabbing (closed hand) | Actively panning with spacebar or 2-finger |

### Behavior with Other Features

**Marquee Selection**:
- ❌ Disabled while spacebar is held
- ✅ Works normally when spacebar is released

**Item Selection**:
- ❌ Cannot select items while panning
- ✅ Works normally when not in pan mode

**Item Dragging**:
- ❌ Cannot drag items while in pan mode
- ✅ Works normally when not in pan mode

**Text Inputs**:
- ✅ Spacebar works normally in text inputs (types a space)
- ✅ Pan mode only activates when NOT focused in text input

## Technical Implementation

### Event Flow
```
User presses Spacebar
  ↓
KeyboardManager.handleKeyDown()
  ↓
Check: isTextInputFocused?
  ↓ No
Prevent default (stop page scroll)
  ↓
store.setSpacebarPanMode(true)
  ↓
Canvas re-renders with cursor-grab class
  ↓
User clicks and drags on canvas
  ↓
Canvas detects isSpacebarPanMode = true
  ↓
Starts pan mode (same as 2-finger)
  ↓
Cursor changes to cursor-grabbing
  ↓
Pan offset updates on pointer move
  ↓
User releases mouse → cursor returns to grab
  ↓
User releases spacebar → cursor returns to normal
```

### Pan Mode Priority
Pan mode activates if ANY of these conditions are true:
1. `store.isSpacebarPanMode === true` (spacebar held)
2. `activeTouches.size === 2` (2-finger touch)
3. Trackpad 2-finger pan (wheel events)

## Benefits

1. **Familiar UX**: Spacebar-to-pan is standard in design tools (Figma, Sketch, Adobe)
2. **Easy Access**: Spacebar is large and easy to hold with thumb
3. **Precision**: Mouse/trackpad provides more precise panning than touch
4. **Visual Feedback**: Hand cursors clearly indicate pan mode state
5. **Non-Destructive**: Doesn't interfere with other canvas interactions
6. **Keyboard-Friendly**: Great for keyboard-heavy workflows

## Testing

The implementation is live at **http://localhost:3000**

Try these workflows:
1. Hold spacebar → See grab cursor
2. Hold spacebar + drag → See grabbing cursor, canvas pans
3. Release spacebar → Cursor returns to normal
4. Try to create selection box with spacebar held → Blocked (pans instead)
5. Click in text input + press spacebar → Types space (correct)
6. Use 2-finger trackpad drag → Still works, cursor shows grabbing
