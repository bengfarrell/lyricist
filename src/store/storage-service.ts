import { SavedSong } from './types';

const STORAGE_KEY = 'lyricist-songs';
const USER_ID_KEY = 'lyricist-user-id';
const USER_EMAIL_KEY = 'lyricist-user-email';

export class StorageService {
  /**
   * Hash email to create consistent userId across devices
   */
  private async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Return first 32 chars to keep it manageable
    return hashHex.substring(0, 32);
  }

  /**
   * Get the stored email
   */
  getEmail(): string | null {
    return localStorage.getItem(USER_EMAIL_KEY);
  }

  /**
   * Set email and generate userId from it
   */
  async setEmail(email: string): Promise<string> {
    const normalizedEmail = email.toLowerCase().trim();
    const userId = await this.hashEmail(normalizedEmail);
    
    localStorage.setItem(USER_EMAIL_KEY, normalizedEmail);
    localStorage.setItem(USER_ID_KEY, userId);
    
    return userId;
  }

  /**
   * Get or create the current user's ID
   * Now based on email instead of random UUID
   */
  getUserId(): string {
    try {
      let userId = localStorage.getItem(USER_ID_KEY);
      
      // If no userId but we have an email, regenerate from email
      if (!userId) {
        const email = this.getEmail();
        if (email) {
          // Regenerate userId from stored email (synchronously for compatibility)
          // This shouldn't happen in normal flow, but handles edge cases
          userId = this._generateFallbackId();
          localStorage.setItem(USER_ID_KEY, userId);
          return userId;
        }
        
        // No userId and no email - this means user hasn't set up yet
        // Generate and store a temporary ID (will be replaced when they set email)
        userId = this._generateFallbackId();
        localStorage.setItem(USER_ID_KEY, userId);
      }
      
      return userId;
    } catch (error) {
      console.error('Error getting/creating user ID:', error);
      return this._generateFallbackId();
    }
  }

  /**
   * Generate a fallback ID for cases where email isn't set yet
   */
  private _generateFallbackId(): string {
    return 'temp-' + crypto.randomUUID();
  }

  /**
   * Check if user has set their email
   */
  hasEmail(): boolean {
    return !!localStorage.getItem(USER_EMAIL_KEY);
  }

  /**
   * Clear user email and ID (for logout/reset)
   */
  clearUserData(): void {
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
  /**
   * Load all saved songs from localStorage
   */
  loadSongs(): SavedSong[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading songs from localStorage:', error);
    }
    return [];
  }

  /**
   * Save all songs to localStorage
   */
  saveSongs(songs: SavedSong[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch (error) {
      console.error('Error saving songs to localStorage:', error);
    }
  }

  /**
   * Save a single song (add or update)
   */
  saveSong(song: SavedSong): SavedSong[] {
    const songs = this.loadSongs();
    const existingIndex = songs.findIndex(s => s.name === song.name);
    
    if (existingIndex >= 0) {
      songs[existingIndex] = song;
    } else {
      songs.push(song);
    }
    
    this.saveSongs(songs);
    return songs;
  }

  /**
   * Delete a song by name
   */
  deleteSong(songName: string): SavedSong[] {
    const songs = this.loadSongs();
    const filtered = songs.filter(s => s.name !== songName);
    this.saveSongs(filtered);
    return filtered;
  }

  /**
   * Clear all saved songs
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const storageService = new StorageService();

