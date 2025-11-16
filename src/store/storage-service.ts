import { SavedSong } from './types';

const STORAGE_KEY = 'lyricist-songs';

export class StorageService {
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

