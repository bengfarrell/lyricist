import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SongStore } from '../../../src/store/song-store.js';
import type { WordLadderColumn } from '../../../src/store/types.js';

describe('SongStore - Word Ladder', () => {
  let store: SongStore;

  beforeEach(() => {
    localStorage.clear();
    // Mock fetch before creating store
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sampleSongs: [] }),
    } as Response);
    store = new SongStore();
  });

  describe('initialization', () => {
    it('should initialize with default word ladder columns', () => {
      expect(store.wordLadderColumns).toHaveLength(2);
      expect(store.wordLadderColumns[0].title).toBe('Verbs');
      expect(store.wordLadderColumns[1].title).toBe('Nouns');
    });

    it('should initialize with empty word arrays', () => {
      expect(store.wordLadderColumns[0].words).toEqual([]);
      expect(store.wordLadderColumns[1].words).toEqual([]);
    });

    it('should initialize with no selection', () => {
      expect(store.wordLadderSelectedIndices).toEqual([]);
    });
  });

  describe('word ladder column management', () => {
    it('should add a new word ladder column', () => {
      store.addWordLadderColumn();

      expect(store.wordLadderColumns).toHaveLength(3);
      expect(store.wordLadderColumns[2].title).toBe('New Column');
    });

    it('should update column titles', () => {
      store.updateWordLadderColumnTitle(0, 'Emotions');
      store.updateWordLadderColumnTitle(1, 'Colors');

      expect(store.wordLadderColumns[0].title).toBe('Emotions');
      expect(store.wordLadderColumns[1].title).toBe('Colors');
    });

    it('should toggle column muted state', () => {
      expect(store.wordLadderColumns[0].muted).toBeFalsy();

      store.toggleWordLadderColumnMuted(0);
      expect(store.wordLadderColumns[0].muted).toBe(true);

      store.toggleWordLadderColumnMuted(0);
      expect(store.wordLadderColumns[0].muted).toBe(false);
    });
  });

  describe('word management', () => {
    it('should add words to first column', () => {
      const words = ['dance', 'sing', 'run'];
      store.setWordLadderColumnWords(0, words);

      expect(store.wordLadderColumns[0].words).toEqual(words);
    });

    it('should add words to second column', () => {
      const words = ['moon', 'star', 'sun'];
      store.setWordLadderColumnWords(1, words);

      expect(store.wordLadderColumns[1].words).toEqual(words);
    });

    it('should replace existing words when setting new words', () => {
      store.setWordLadderColumnWords(0, ['old', 'words']);
      store.setWordLadderColumnWords(0, ['new', 'words']);

      expect(store.wordLadderColumns[0].words).toEqual(['new', 'words']);
      expect(store.wordLadderColumns[0].words).toHaveLength(2);
    });

    it('should handle empty word arrays', () => {
      store.setWordLadderColumnWords(0, []);
      store.setWordLadderColumnWords(1, []);

      expect(store.wordLadderColumns[0].words).toEqual([]);
      expect(store.wordLadderColumns[1].words).toEqual([]);
    });
  });

  describe('word selection', () => {
    beforeEach(() => {
      store.setWordLadderColumnWords(0, ['dance', 'sing', 'run']);
      store.setWordLadderColumnWords(1, ['moon', 'star', 'sun']);
    });

    it('should select words by index array', () => {
      store.setWordLadderSelection([1, 2]);

      expect(store.wordLadderSelectedIndices).toEqual([1, 2]);
      expect(store.wordLadderSelectedIndices[0]).toBe(1);
      expect(store.wordLadderSelectedIndices[1]).toBe(2);
    });

    it('should allow selecting with -1 for no selection', () => {
      store.setWordLadderSelection([-1, -1]);

      expect(store.wordLadderSelectedIndices).toEqual([-1, -1]);
    });

    it('should handle selections with more columns', () => {
      store.addWordLadderColumn();
      store.setWordLadderColumnWords(2, ['tree', 'rock']);
      store.setWordLadderSelection([1, 2, 0]);

      expect(store.wordLadderSelectedIndices).toEqual([1, 2, 0]);
      expect(store.wordLadderSelectedIndices.length).toBe(3);
    });

    it('should support empty selection array', () => {
      store.setWordLadderSelection([]);

      expect(store.wordLadderSelectedIndices).toEqual([]);
    });
  });

  describe('song persistence', () => {
    beforeEach(() => {
      store.setWordLadderColumnWords(0, ['dance', 'sing']);
      store.setWordLadderColumnWords(1, ['moon', 'star']);
    });

    it('should include word ladder columns when saving a song', async () => {
      store.setSongName('Test Song');
      await store.saveSong();

      const savedSongs = store.savedSongs;
      expect(savedSongs).toHaveLength(1);
      expect(savedSongs[0].wordLadderColumns).toBeDefined();
      expect(savedSongs[0].wordLadderColumns).toHaveLength(2);
      expect(savedSongs[0].wordLadderColumns![0].words).toEqual(['dance', 'sing']);
      expect(savedSongs[0].wordLadderColumns![1].words).toEqual(['moon', 'star']);
    });

    it('should restore word ladder columns when loading a song', async () => {
      store.setSongName('Test Song');
      store.setWordLadderColumnWords(0, ['dance', 'sing']);
      store.setWordLadderColumnWords(1, ['moon', 'star']);
      await store.saveSong();

      // Create new store and load
      const newStore = new SongStore();
      newStore.loadSong(newStore.savedSongs[0].name);

      expect(newStore.wordLadderColumns[0].words).toEqual(['dance', 'sing']);
      expect(newStore.wordLadderColumns[1].words).toEqual(['moon', 'star']);
    });

    it('should handle loading songs without word ladder columns', () => {
      // Simulate old saved song format
      const oldSong = {
        name: 'Old Song',
        songId: 'old-song-id',
        userId: 'test-user',
        lastModified: new Date().toISOString(),
        items: [],
      };
      localStorage.setItem('lyricist-songs', JSON.stringify([oldSong]));

      // Create a fresh store with new fetch mock
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sampleSongs: [] }),
      } as Response);
      const newStore = new SongStore();

      const loadedSong = newStore.savedSongs.find(s => s.name === 'Old Song');
      if (loadedSong) {
        newStore.loadSong(loadedSong);
      }

      // Should fallback to default word ladder columns
      expect(newStore.wordLadderColumns.length).toBeGreaterThanOrEqual(2);
      expect(newStore.wordLadderColumns[0].title).toBeDefined();
    });

    it('should reset word ladder columns to default when creating a new song', () => {
      // Create a fresh store to avoid mutation issues
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sampleSongs: [] }),
      } as Response);
      const freshStore = new SongStore();

      freshStore.setWordLadderColumnWords(0, ['dance', 'sing']);
      freshStore.setWordLadderColumnWords(1, ['moon', 'star']);
      freshStore.addWordLadderColumn();

      const columnCountBefore = freshStore.wordLadderColumns.length;

      freshStore.newSong();

      // Should reset to default columns
      expect(freshStore.wordLadderColumns).toHaveLength(2);
      expect(columnCountBefore).toBeGreaterThan(2);

      // Check the reset worked
      expect(freshStore.wordLadderSelectedIndices).toEqual([]);
    });
  });

  describe('multiple columns', () => {
    it('should maintain separate word lists for different columns', () => {
      // Set words for initial columns
      store.setWordLadderColumnWords(0, ['dance', 'sing']);
      store.setWordLadderColumnWords(1, ['moon', 'star']);

      // Add a third column
      store.addWordLadderColumn();
      store.setWordLadderColumnWords(2, ['walk', 'jump']);

      // Verify all columns
      expect(store.wordLadderColumns[0].words).toEqual(['dance', 'sing']);
      expect(store.wordLadderColumns[1].words).toEqual(['moon', 'star']);
      expect(store.wordLadderColumns[2].words).toEqual(['walk', 'jump']);
    });

    it('should allow different titles for different columns', () => {
      store.updateWordLadderColumnTitle(0, 'Verbs');
      store.updateWordLadderColumnTitle(1, 'Nouns');

      store.addWordLadderColumn();
      store.updateWordLadderColumnTitle(2, 'Emotions');

      expect(store.wordLadderColumns[0].title).toBe('Verbs');
      expect(store.wordLadderColumns[1].title).toBe('Nouns');
      expect(store.wordLadderColumns[2].title).toBe('Emotions');
    });
  });

  describe('edge cases', () => {
    it('should handle selecting word at invalid index', () => {
      store.setWordLadderColumnWords(0, ['dance']);
      store.setWordLadderSelection([5, 0]); // Index 5 doesn't exist

      // Selection is set regardless of validity
      expect(store.wordLadderSelectedIndices[0]).toBe(5);
    });

    it('should handle empty word lists with selection', () => {
      store.setWordLadderColumnWords(0, []);
      store.setWordLadderColumnWords(1, []);
      store.setWordLadderSelection([-1, -1]);

      expect(store.wordLadderSelectedIndices).toEqual([-1, -1]);
    });

    it('should create unique IDs for each word ladder column', async () => {
      store.addWordLadderColumn();
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 2));
      store.addWordLadderColumn();

      const ids = store.wordLadderColumns.map(col => col.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('input text integration', () => {
    it('should update input text separately from word ladder', () => {
      store.setWordLadderColumnWords(0, ['dance', 'sing']);
      store.setWordLadderColumnWords(1, ['moon', 'star']);
      store.setWordLadderSelection([0, 1]);

      store.setNewLineInputText('custom text');

      expect(store.newLineInputText).toBe('custom text');
      expect(store.wordLadderSelectedIndices).toEqual([0, 1]);
    });

    it('should clear input text when requested', () => {
      store.setNewLineInputText('some text');
      store.setNewLineInputText('');

      expect(store.newLineInputText).toBe('');
    });
  });

  describe('muted columns', () => {
    it('should toggle muted state', () => {
      expect(store.wordLadderColumns[0].muted).toBeFalsy();

      store.toggleWordLadderColumnMuted(0);
      expect(store.wordLadderColumns[0].muted).toBe(true);

      store.toggleWordLadderColumnMuted(0);
      expect(store.wordLadderColumns[0].muted).toBe(false);
    });

    it('should persist muted state when saving', async () => {
      store.toggleWordLadderColumnMuted(0);
      store.setSongName('Test Song with Muted Column');
      await store.saveSong();

      const savedSongs = store.savedSongs;
      const savedSong = savedSongs.find(s => s.name === 'Test Song with Muted Column');
      expect(savedSong?.wordLadderColumns![0].muted).toBe(true);
    });
  });
});

