/**
 * KeyboardManager - Singleton class to handle global keyboard commands
 * 
 * This utility manages app-wide keyboard shortcuts like delete/backspace
 * to delete selected lyric lines while preventing these actions when
 * text inputs are focused.
 */

import { songStore } from './song-store.js';

class KeyboardManager {
  private static instance: KeyboardManager;
  private isEnabled: boolean = false;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  /**
   * Initialize keyboard event listeners
   * Should be called once when the app loads
   */
  init(): void {
    if (this.isEnabled) return;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.isEnabled = true;
  }

  /**
   * Remove keyboard event listeners
   * Useful for cleanup
   */
  destroy(): void {
    if (!this.isEnabled) return;

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.isEnabled = false;
  }

  /**
   * Handle global keydown events
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // Handle spacebar for pan mode (works even in text inputs, but doesn't type space)
    if (e.key === ' ' || e.code === 'Space') {
      // Only activate pan mode if not already in an input field typing
      if (!this.isTextInputFocused(e.target)) {
        e.preventDefault(); // Prevent page scroll
        songStore.setSpacebarPanMode(true);
        return;
      }
    }

    // Check if the event originated from a text input for other shortcuts
    if (this.isTextInputFocused(e.target)) {
      return; // Don't handle keyboard shortcuts when typing in inputs
    }

    // Handle Delete or Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault(); // Prevent browser back navigation on backspace
      this.deleteSelectedItems();
    }
  }

  /**
   * Handle global keyup events
   */
  private handleKeyUp(e: KeyboardEvent): void {
    // Release spacebar pan mode
    if (e.key === ' ' || e.code === 'Space') {
      songStore.setSpacebarPanMode(false);
    }
  }

  /**
   * Check if the event target is a text input element
   */
  private isTextInputFocused(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) {
      return false;
    }

    // Check if it's an input or textarea
    const tagName = target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
      return true;
    }

    // Check if it has contenteditable
    if (target.isContentEditable) {
      return true;
    }

    return false;
  }

  /**
   * Delete all selected items (lines and groups)
   */
  private deleteSelectedItems(): void {
    songStore.deleteSelectedItems();
  }
}

// Export singleton instance
export const keyboardManager = KeyboardManager.getInstance();
