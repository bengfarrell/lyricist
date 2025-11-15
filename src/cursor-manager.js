class CursorManager {
  constructor() {
    this.currentCursor = null;
  }

  setCursor(cursorType) {
    if (this.currentCursor === cursorType) {
      return;
    }
    
    document.body.style.setProperty('cursor', cursorType, 'important');
    this.currentCursor = cursorType;
  }

  clearCursor() {
    if (this.currentCursor !== null) {
      document.body.style.removeProperty('cursor');
      this.currentCursor = null;
    }
  }

  isActive() {
    return this.currentCursor !== null;
  }

  getCurrentCursor() {
    return this.currentCursor;
  }
}

// Export a singleton instance
export const cursorManager = new CursorManager();

