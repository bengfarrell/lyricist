import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SongStore } from '../song-store.js';
import type { LyricLine, SavedSong } from '../types.js';

describe('SongStore', () => {
  let store: SongStore;

  beforeEach(() => {
    localStorage.clear();
    store = new SongStore();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(store.lines).toEqual([]);
      expect(store.songName).toBe('');
      expect(store.savedSongs).toEqual([]);
      expect(store.showLoadDialog).toBe(false);
      expect(store.lyricsPanelWidth).toBe(350);
    });

    it('should load saved songs from localStorage', () => {
      const mockSongs: SavedSong[] = [
        { name: 'Test', lines: [], lastModified: '2025-01-01' },
      ];
      localStorage.setItem('lyricist-songs', JSON.stringify(mockSongs));

      const newStore = new SongStore();
      expect(newStore.savedSongs).toEqual(mockSongs);
    });
  });

  describe('line management', () => {
    it('should add a line', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };

      store.addLine(line);

      expect(store.lines).toHaveLength(1);
      expect(store.lines[0]).toEqual(line);
    });

    it('should update a line', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Original',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.updateLine('line-1', { text: 'Updated' });

      expect(store.lines[0].text).toBe('Updated');
    });

    it('should delete a line', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.deleteLine('line-1');

      expect(store.lines).toHaveLength(0);
    });

    it('should duplicate a line with new id and offset position', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.duplicateLine('line-1');

      expect(store.lines).toHaveLength(2);
      expect(store.lines[1].id).not.toBe('line-1');
      expect(store.lines[1].text).toBe('Test');
      expect(store.lines[1].x).toBe(130); // offset by 30
      expect(store.lines[1].y).toBe(130); // offset by 30
    });

    it('should bring line to front', () => {
      const line1: LyricLine = {
        id: 'line-1',
        text: 'Test 1',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        text: 'Test 2',
        chords: [],
        hasChordSection: false,
        x: 150,
        y: 150,
        rotation: 0,
        zIndex: 2,
      };
      store.addLine(line1);
      store.addLine(line2);

      store.bringLineToFront('line-1');

      const updatedLine = store.lines.find(l => l.id === 'line-1');
      expect(updatedLine?.zIndex).toBe(3); // Max + 1
    });

    it('should update line position', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.updateLinePosition('line-1', 200, 250);

      expect(store.lines[0].x).toBe(200);
      expect(store.lines[0].y).toBe(250);
    });

    it('should update line text', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Original',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.updateLineText('line-1', 'New text');

      expect(store.lines[0].text).toBe('New text');
    });
  });

  describe('chord management', () => {
    beforeEach(() => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);
    });

    it('should toggle chord section', () => {
      store.toggleChordSection('line-1', true);
      expect(store.lines[0].hasChordSection).toBe(true);

      store.toggleChordSection('line-1', false);
      expect(store.lines[0].hasChordSection).toBe(false);
    });

    it('should add a chord to a line', () => {
      const chord = { id: 'chord-1', name: 'C', position: 50 };
      store.addChord('line-1', chord);

      expect(store.lines[0].chords).toHaveLength(1);
      expect(store.lines[0].chords[0]).toEqual(chord);
    });

    it('should update a chord', () => {
      const chord = { id: 'chord-1', name: 'C', position: 50 };
      store.addChord('line-1', chord);

      store.updateChord('line-1', 'chord-1', 'G');

      expect(store.lines[0].chords[0].name).toBe('G');
    });

    it('should delete a chord', () => {
      const chord = { id: 'chord-1', name: 'C', position: 50 };
      store.addChord('line-1', chord);

      store.deleteChord('line-1', 'chord-1');

      expect(store.lines[0].chords).toHaveLength(0);
    });

    it('should update chord position', () => {
      const chord = { id: 'chord-1', name: 'C', position: 50 };
      store.addChord('line-1', chord);

      store.updateChordPosition('line-1', 'chord-1', 75);

      expect(store.lines[0].chords[0].position).toBe(75);
    });
  });

  describe('song management', () => {
    it('should set song name', () => {
      store.setSongName('My Song');
      expect(store.songName).toBe('My Song');
    });

    it('should save a song', () => {
      store.setSongName('Test Song');
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      const result = store.saveSong();

      expect(result).toBe(true);
      expect(store.savedSongs).toHaveLength(1);
      expect(store.savedSongs[0].name).toBe('Test Song');
      expect(store.savedSongs[0].lines).toHaveLength(1);
    });

    it('should not save song without name', () => {
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      const result = store.saveSong();

      expect(result).toBe(false);
      expect(store.savedSongs).toHaveLength(0);
    });

    it('should load a song', () => {
      const song: SavedSong = {
        name: 'Loaded Song',
        lines: [
          {
            id: 'line-1',
            text: 'Test line',
            chords: [],
            hasChordSection: true,
            x: 100,
            y: 100,
            rotation: 0,
            zIndex: 1,
          },
        ],
        lastModified: '2025-01-01',
      };

      store.loadSong(song);

      expect(store.songName).toBe('Loaded Song');
      expect(store.lines).toHaveLength(1);
      expect(store.lines[0].hasChordSection).toBe(false); // Should close chord sections
    });

    it('should delete a saved song', () => {
      store.setSongName('Test Song');
      store.saveSong();

      store.deleteSong('Test Song');

      expect(store.savedSongs).toHaveLength(0);
    });

    it('should create a new song', () => {
      store.setSongName('Old Song');
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      store.newSong();

      expect(store.songName).toBe('');
      expect(store.lines).toHaveLength(0);
    });
  });

  describe('import/export', () => {
    it('should export song to JSON', () => {
      store.setSongName('Export Test');
      const line: LyricLine = {
        id: 'line-1',
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);

      // Mock document.createElement to capture the download
      const mockClick = vi.fn();
      const mockAnchor = { click: mockClick, href: '', download: '' };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);

      store.exportToJSON();

      expect(mockClick).toHaveBeenCalled();
      expect(mockAnchor.download).toBe('export_test.json');
    });

    it('should import song from JSON', () => {
      const importedSong: SavedSong = {
        name: 'Imported',
        lines: [
          {
            id: 'line-1',
            text: 'Imported line',
            chords: [],
            hasChordSection: true,
            x: 100,
            y: 100,
            rotation: 0,
            zIndex: 1,
          },
        ],
        lastModified: '2025-01-01',
      };

      store.importFromJSON(importedSong);

      expect(store.songName).toBe('Imported');
      expect(store.lines).toHaveLength(1);
      expect(store.lines[0].hasChordSection).toBe(false); // Should close chord sections
    });
  });

  describe('UI state', () => {
    it('should toggle load dialog', () => {
      store.setShowLoadDialog(true);
      expect(store.showLoadDialog).toBe(true);

      store.setShowLoadDialog(false);
      expect(store.showLoadDialog).toBe(false);
    });

    it('should set lyrics panel width with constraints', () => {
      store.setLyricsPanelWidth(400);
      expect(store.lyricsPanelWidth).toBe(400);

      // Test min constraint
      store.setLyricsPanelWidth(100);
      expect(store.lyricsPanelWidth).toBe(200);

      // Test max constraint
      store.setLyricsPanelWidth(800);
      expect(store.lyricsPanelWidth).toBe(600);
    });
  });

  describe('utility methods', () => {
    it('should get sorted lines by y position', () => {
      const line1: LyricLine = {
        id: 'line-1',
        text: 'Line 1',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        text: 'Line 2',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line1);
      store.addLine(line2);

      const sorted = store.getSortedLines();

      expect(sorted[0].id).toBe('line-2');
      expect(sorted[1].id).toBe('line-1');
    });

    it('should get max z-index', () => {
      const line1: LyricLine = {
        id: 'line-1',
        text: 'Line 1',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 5,
      };
      const line2: LyricLine = {
        id: 'line-2',
        text: 'Line 2',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 3,
      };
      store.addLine(line1);
      store.addLine(line2);

      expect(store.getMaxZIndex()).toBe(5);
    });

    it('should return 0 for max z-index when no lines exist', () => {
      expect(store.getMaxZIndex()).toBe(0);
    });
  });

  describe('reactive updates', () => {
    it('should notify hosts when state changes', () => {
      const mockHost = { requestUpdate: vi.fn() };
      store.addHost(mockHost as any);

      store.setSongName('Test');

      expect(mockHost.requestUpdate).toHaveBeenCalled();
    });

    it('should stop notifying hosts after removal', () => {
      const mockHost = { requestUpdate: vi.fn() };
      store.addHost(mockHost as any);
      store.removeHost(mockHost as any);

      mockHost.requestUpdate.mockClear();
      store.setSongName('Test');

      expect(mockHost.requestUpdate).not.toHaveBeenCalled();
    });
  });
});

