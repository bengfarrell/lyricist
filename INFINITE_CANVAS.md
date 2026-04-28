# Infinite Canvas Implementation

## Overview
The lyrics canvas has been upgraded to an infinite canvas with 2-finger panning support for both mobile touch devices and trackpads.

## Features Implemented

### 1. Pan State Management (src/store/song-store.ts)
Added canvas pan offset tracking:
- `_canvasPanX` and `_canvasPanY` - Store the current pan offset
- `canvasPanX` and `canvasPanY` - Getters for pan state
- `setCanvasPan(x, y)` - Set absolute pan position
- `adjustCanvasPan(deltaX, deltaY)` - Adjust pan by delta

### 2. Multi-Touch Detection (src/lyric-canvas/index.ts)
Intelligent gesture detection:
- Tracks active touch points using `_activeTouches` Map
- Detects 2-finger gestures on mobile (touch)
- Detects 2-finger trackpad gestures on desktop
- Prevents conflict with single-finger selection box

### 3. Pan Gesture Handling
Smooth panning experience:
- `_isPanning` - Flag to track active pan state
- Stores initial pan position and current offset on pan start
- Updates pan offset in real-time during gesture
- Prevents selection box when panning

### 4. CSS Transform Architecture
Efficient rendering with GPU acceleration:
- Created `.canvas-content` wrapper div
- Applied CSS transform to move entire canvas
- Used `transform-origin: 0 0` for proper offset calculation
- Added `will-change: transform` for performance

### 5. Coordinate System Updates
All pointer interactions account for pan offset:
- Double-click to add line - adjusted coordinates
- Selection box start/drag/end - adjusted coordinates
- Item dragging - adjusted coordinates
- Maintains accuracy regardless of pan position

### 6. Visual Grid Background
Subtle grid provides spatial awareness:
- Light grid pattern (50px spacing)
- Grid moves with pan using `background-position`
- Helps users understand infinite canvas behavior
- Non-intrusive design

## How It Works

### Touch/Trackpad Detection
```
User touches with 2 fingers
  ↓
Canvas detects activeTouches.size === 2
  ↓
Sets _isPanning = true
  ↓
Tracks movement and updates pan offset
  ↓
On finger release, stops panning
```

### Coordinate Translation
```
Pointer Event (e.clientX, e.clientY)
  ↓
Canvas-relative (clientX - rect.left)
  ↓
Pan-adjusted (canvasX - panOffsetX)
  ↓
Item position in virtual space
```

## Usage

### Desktop (Trackpad)
- Use 2-finger drag to pan the canvas
- Works like Maps/Figma - smooth and intuitive
- Does not interfere with 1-finger selection box

### Mobile (Touch)
- Use 2-finger drag to pan the canvas
- Touch and drag with 2 fingers simultaneously
- Single finger still creates selection box

### Single Finger/Click
- Single click/tap selects items (unchanged)
- Click and drag creates selection box (unchanged)
- Double-click adds new lyric line (unchanged)

## Technical Details

### Performance
- Uses CSS transforms (GPU-accelerated)
- No reflow/repaint during pan
- Smooth 60fps panning

### Touch Action
- `touch-action: none` prevents browser scroll
- Gives us full control over touch gestures

### State Persistence
- Pan offset is UI state (not saved to songs)
- Resets when loading new songs
- Could be persisted if desired in future

## Future Enhancements
- Reset view button to return to origin (0, 0)
- Zoom in/out with pinch gesture
- Mini-map for navigation
- Pan with keyboard arrow keys
- Constrain pan boundaries (optional)
