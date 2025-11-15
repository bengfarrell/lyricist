class CursorManager {
  private currentCursor: string | null = null;

  setCursor(cursorType: string): void {
    if (this.currentCursor === cursorType) {
      return;
    }
    
    document.body.style.setProperty('cursor', cursorType, 'important');
    this.currentCursor = cursorType;
  }

  clearCursor(): void {
    if (this.currentCursor !== null) {
      document.body.style.removeProperty('cursor');
      this.currentCursor = null;
    }
  }

  isActive(): boolean {
    return this.currentCursor !== null;
  }

  getCurrentCursor(): string | null {
    return this.currentCursor;
  }
}

// Export a singleton instance
export const cursorManager = new CursorManager();

