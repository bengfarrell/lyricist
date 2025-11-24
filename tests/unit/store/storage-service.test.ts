import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../../../src/store/storage-service.js';
import type { SavedSong } from '../../../src/store/types.js';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadSongs', () => {
    it('should return empty array when no songs are saved', () => {
      const songs = storageService.loadSongs();
      expect(songs).toEqual([]);
    });

    it('should load saved songs from localStorage', () => {
      const mockSongs: SavedSong[] = [
        {
          name: 'Test Song',
          songId: 'test-song-id',
          userId: 'test-user-id',
          lines: [],
          lastModified: '2025-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('lyricist-songs', JSON.stringify(mockSongs));

      const songs = storageService.loadSongs();
      expect(songs).toEqual(mockSongs);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      // Suppress expected console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorage.setItem('lyricist-songs', 'invalid-json');
      const songs = storageService.loadSongs();
      expect(songs).toEqual([]);
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading songs from localStorage:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveSongs', () => {
    it('should save songs to localStorage', () => {
      const mockSongs: SavedSong[] = [
        {
          name: 'Test Song',
          songId: 'test-song-id',
          userId: 'test-user-id',
          lines: [],
          lastModified: '2025-01-01T00:00:00.000Z',
        },
      ];

      storageService.saveSongs(mockSongs);

      const saved = localStorage.getItem('lyricist-songs');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(mockSongs);
    });
  });

  describe('saveSong', () => {
    it('should add a new song', () => {
      const newSong: SavedSong = {
        name: 'New Song',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-01T00:00:00.000Z',
      };

      const result = storageService.saveSong(newSong);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newSong);
    });

    it('should update an existing song', () => {
      const originalSong: SavedSong = {
        name: 'Test Song',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-01T00:00:00.000Z',
      };
      storageService.saveSong(originalSong);

      const updatedSong: SavedSong = {
        name: 'Test Song',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [{ id: '1', type: 'line' as const, text: 'Updated', chords: [], hasChordSection: false, x: 0, y: 0, rotation: 0, zIndex: 1 }],
        lastModified: '2025-01-02T00:00:00.000Z',
      };
      const result = storageService.saveSong(updatedSong);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(updatedSong);
      expect(result[0].lines).toHaveLength(1);
    });

    it('should maintain multiple songs', () => {
      const song1: SavedSong = {
        name: 'Song 1',
        songId: 'test-song-id-1',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-01T00:00:00.000Z',
      };
      const song2: SavedSong = {
        name: 'Song 2',
        songId: 'test-song-id-2',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-01T00:00:00.000Z',
      };

      storageService.saveSong(song1);
      const result = storageService.saveSong(song2);

      expect(result).toHaveLength(2);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song by name', () => {
      const songs: SavedSong[] = [
        { name: 'Song 1', songId: 'song-id-1', userId: 'test-user-id', lines: [], lastModified: '2025-01-01' },
        { name: 'Song 2', songId: 'song-id-2', userId: 'test-user-id', lines: [], lastModified: '2025-01-01' },
      ];
      storageService.saveSongs(songs);

      const result = storageService.deleteSong('Song 1');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Song 2');
    });

    it('should handle deleting non-existent song', () => {
      const songs: SavedSong[] = [
        { name: 'Song 1', songId: 'song-id-1', userId: 'test-user-id', lines: [], lastModified: '2025-01-01' },
      ];
      storageService.saveSongs(songs);

      const result = storageService.deleteSong('Non-existent');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Song 1');
    });
  });

  describe('clearAll', () => {
    it('should clear all saved songs', () => {
      const songs: SavedSong[] = [
        { name: 'Song 1', songId: 'song-id-1', userId: 'test-user-id', lines: [], lastModified: '2025-01-01' },
      ];
      storageService.saveSongs(songs);

      storageService.clearAll();

      expect(localStorage.getItem('lyricist-songs')).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('should generate and store a new user ID if none exists', () => {
      const userId = storageService.getUserId();
      
      expect(userId).toBeTruthy();
      expect(userId.length).toBeGreaterThan(0);
      
      // Verify it's stored in localStorage
      const storedId = localStorage.getItem('lyricist-user-id');
      expect(storedId).toBe(userId);
    });

    it('should return the same user ID on subsequent calls', () => {
      const userId1 = storageService.getUserId();
      const userId2 = storageService.getUserId();
      
      expect(userId1).toBe(userId2);
    });

    it('should use existing user ID from localStorage', () => {
      const existingId = 'existing-user-id-123';
      localStorage.setItem('lyricist-user-id', existingId);
      
      const userId = storageService.getUserId();
      
      expect(userId).toBe(existingId);
    });
  });
});

