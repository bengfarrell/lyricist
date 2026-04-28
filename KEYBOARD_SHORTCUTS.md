# Keyboard Manager Implementation

## Features Implemented

### 1. Keyboard Utility Class (src/keyboard-manager/index.ts)
- Singleton pattern for global keyboard event handling
- Handles Delete and Backspace keys
- Prevents default browser behavior (back navigation on backspace)
- Checks if text inputs are focused before triggering actions

### 2. Delete Selected Items Method (src/store/song-store.ts)
- deleteSelectedItems() method added to SongStore
- Deletes all selected lines and groups
- Clears selection after deletion
- Also exposed through SongStoreController

### 3. Keyboard Manager Integration (src/lyricist-app/index.ts)
- Initialized in connectedCallback()
- Cleaned up in disconnectedCallback()
- Active for the entire app lifecycle

### 4. Delete Button in Floating Strip (src/floating-strip/index.ts)
- Added next to alignment tools (left/center/right/delete)
- Shows confirmation dialog before deleting
- Styled with red theme to indicate destructive action
- Tooltip shows keyboard shortcut hint

### 5. Event Propagation Prevention
Added keydown handlers with stopPropagation() to all text inputs:
- src/app-controls/index.ts - lyric input & custom section input
- src/floating-strip/index.ts - lyric input & custom section input
- src/edit-modal/index.ts - edit input
- src/lyric-line/index.ts - inline text editor
- src/left-panel/index.ts - word inputs & title editor
- src/file-modal/index.ts - song name input
- src/email-prompt/index.ts - email input

## Usage

1. Select one or more lyric lines by clicking them (Shift+Click for multi-select)
2. Press Backspace or Delete to delete selected items
3. OR click the delete button (×) in the floating strip when items are selected
4. When editing text in any input field, Backspace/Delete work normally without deleting lyrics

## Expected Behavior

- Backspace/Delete keys delete selected items when NOT in text input
- Backspace/Delete keys work normally when editing text
- Delete button appears in floating strip when items are selected
- Delete button shows confirmation dialog
- All selected items are deleted together
- Selection is cleared after deletion
