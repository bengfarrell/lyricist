import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SongStore } from '../../../src/store/song-store.js';
import type { LyricLine, SavedSong } from '../../../src/store/types.js';

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
      expect(store.newLineInputText).toBe('');
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
      expect(store.savedSongs[0].items).toHaveLength(1);
    });

    it('should not save song without name', () => {
      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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
        type: 'line' as const,
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

  describe('selection management', () => {
    beforeEach(() => {
      // Add some test lines
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Line 1',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Line 2',
        chords: [],
        hasChordSection: false,
        x: 150,
        y: 150,
        rotation: 0,
        zIndex: 2,
      };
      const line3: LyricLine = {
        id: 'line-3',
        type: 'line' as const,
        text: 'Line 3',
        chords: [],
        hasChordSection: false,
        x: 200,
        y: 200,
        rotation: 0,
        zIndex: 3,
      };
      store.addLine(line1);
      store.addLine(line2);
      store.addLine(line3);
    });

    it('should initialize with no selection', () => {
      expect(store.selectedLineIds.size).toBe(0);
    });

    it('should select a single line', () => {
      store.selectLine('line-1');

      expect(store.selectedLineIds.size).toBe(1);
      expect(store.isLineSelected('line-1')).toBe(true);
      expect(store.isLineSelected('line-2')).toBe(false);
    });

    it('should replace selection when selecting a line', () => {
      store.selectLine('line-1');
      store.selectLine('line-2');

      expect(store.selectedLineIds.size).toBe(1);
      expect(store.isLineSelected('line-1')).toBe(false);
      expect(store.isLineSelected('line-2')).toBe(true);
    });

    it('should toggle line selection', () => {
      store.toggleLineSelection('line-1');
      expect(store.isLineSelected('line-1')).toBe(true);

      store.toggleLineSelection('line-1');
      expect(store.isLineSelected('line-1')).toBe(false);
    });

    it('should allow multi-selection via toggle', () => {
      store.toggleLineSelection('line-1');
      store.toggleLineSelection('line-2');
      store.toggleLineSelection('line-3');

      expect(store.selectedLineIds.size).toBe(3);
      expect(store.isLineSelected('line-1')).toBe(true);
      expect(store.isLineSelected('line-2')).toBe(true);
      expect(store.isLineSelected('line-3')).toBe(true);
    });

    it('should set multiple selected lines', () => {
      store.setSelectedLineIds(['line-1', 'line-3']);

      expect(store.selectedLineIds.size).toBe(2);
      expect(store.isLineSelected('line-1')).toBe(true);
      expect(store.isLineSelected('line-2')).toBe(false);
      expect(store.isLineSelected('line-3')).toBe(true);
    });

    it('should clear all selections', () => {
      store.setSelectedLineIds(['line-1', 'line-2', 'line-3']);
      expect(store.selectedLineIds.size).toBe(3);

      store.clearSelection();

      expect(store.selectedLineIds.size).toBe(0);
      expect(store.isLineSelected('line-1')).toBe(false);
      expect(store.isLineSelected('line-2')).toBe(false);
      expect(store.isLineSelected('line-3')).toBe(false);
    });

    it('should clear selection when deleting a selected line', () => {
      store.selectLine('line-1');
      expect(store.isLineSelected('line-1')).toBe(true);

      store.deleteLine('line-1');

      expect(store.selectedLineIds.size).toBe(0);
      expect(store.lines).toHaveLength(2);
    });

    it('should preserve other selections when deleting an unselected line', () => {
      store.setSelectedLineIds(['line-1', 'line-2']);
      
      store.deleteLine('line-3');

      expect(store.selectedLineIds.size).toBe(2);
      expect(store.isLineSelected('line-1')).toBe(true);
      expect(store.isLineSelected('line-2')).toBe(true);
    });

    it('should remove deleted line from multi-selection', () => {
      store.setSelectedLineIds(['line-1', 'line-2', 'line-3']);
      
      store.deleteLine('line-2');

      expect(store.selectedLineIds.size).toBe(2);
      expect(store.isLineSelected('line-1')).toBe(true);
      expect(store.isLineSelected('line-2')).toBe(false);
      expect(store.isLineSelected('line-3')).toBe(true);
    });

    it('should clear selection when loading a song', () => {
      store.selectLine('line-1');
      
      const song: SavedSong = {
        name: 'New Song',
        lines: [],
        lastModified: '2025-01-01',
      };
      store.loadSong(song);

      expect(store.selectedLineIds.size).toBe(0);
    });

    it('should clear selection when creating a new song', () => {
      store.selectLine('line-1');
      
      store.newSong();

      expect(store.selectedLineIds.size).toBe(0);
    });

    it('should clear selection when importing a song', () => {
      store.selectLine('line-1');
      
      const song: SavedSong = {
        name: 'Imported',
        lines: [],
        lastModified: '2025-01-01',
      };
      store.importFromJSON(song);

      expect(store.selectedLineIds.size).toBe(0);
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

    it('should notify hosts when selection changes', () => {
      const mockHost = { requestUpdate: vi.fn() };
      store.addHost(mockHost as any);

      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Test',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      store.addLine(line);
      mockHost.requestUpdate.mockClear();

      store.selectLine('line-1');

      expect(mockHost.requestUpdate).toHaveBeenCalled();
    });
  });

  describe('group management', () => {
    it('should create a group from selected lines', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);

      store.createGroup('Verse');

      expect(store.lines).toHaveLength(0);
      expect(store.groups).toHaveLength(1);
      expect(store.groups[0].sectionName).toBe('Verse');
      expect(store.groups[0].lines).toHaveLength(2);
      expect(store.groups[0].lines[0].text).toBe('First line');
      expect(store.groups[0].lines[1].text).toBe('Second line');
    });

    it('should sort lines by y position when creating group', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 300,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);

      store.createGroup('Verse');

      expect(store.groups[0].lines[0].text).toBe('Second line');
      expect(store.groups[0].lines[1].text).toBe('First line');
    });

    it('should position group at topmost selected item', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 150,
        y: 300,
        rotation: 2,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: -1,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);

      store.createGroup('Verse');

      expect(store.groups[0].x).toBe(100);
      expect(store.groups[0].y).toBe(100);
      expect(store.groups[0].rotation).toBe(-1);
    });

    it('should create group from mixed selection of lines and groups', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Line 1',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Line 2',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);
      store.createGroup('Verse 1');

      // Add a standalone line
      const line3: LyricLine = {
        id: 'line-3',
        type: 'line' as const,
        text: 'Line 3',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 300,
        rotation: 0,
        zIndex: 3,
      };
      store.addLine(line3);

      // Select the group and the standalone line
      const groupId = store.groups[0].id;
      store.setSelectedLineIds([groupId, 'line-3']);
      store.createGroup('Combined');

      expect(store.groups).toHaveLength(1);
      expect(store.groups[0].sectionName).toBe('Combined');
      expect(store.groups[0].lines).toHaveLength(3);
      expect(store.lines).toHaveLength(0);
    });

    it('should ungroup a group back to individual lines', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);
      store.createGroup('Verse');

      const groupId = store.groups[0].id;
      store.ungroupGroup(groupId);

      expect(store.groups).toHaveLength(0);
      expect(store.lines).toHaveLength(2);
      expect(store.lines[0].text).toBe('First line');
      expect(store.lines[1].text).toBe('Second line');
    });

    it('should space lines vertically when ungrouping', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);
      store.createGroup('Verse');

      const group = store.groups[0];
      store.ungroupGroup(group.id);

      expect(store.lines[0].y).toBe(group.y);
      expect(store.lines[1].y).toBe(group.y + 60);
    });

    it('should select all lines after ungrouping', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);
      store.createGroup('Verse');

      const groupId = store.groups[0].id;
      store.ungroupGroup(groupId);

      expect(store.selectedLineIds.size).toBe(2);
      store.lines.forEach(line => {
        expect(store.isLineSelected(line.id)).toBe(true);
      });
    });

    it('should delete a group', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-1', 'line-2']);
      store.createGroup('Verse');

      const groupId = store.groups[0].id;
      store.deleteGroup(groupId);

      expect(store.groups).toHaveLength(0);
      expect(store.items).toHaveLength(0);
    });

    it('should duplicate a group', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };

      store.addLine(line1);
      store.setSelectedLineIds(['line-1']);
      store.createGroup('Verse');

      const groupId = store.groups[0].id;
      store.duplicateLine(groupId);

      expect(store.groups).toHaveLength(2);
      expect(store.groups[0].sectionName).toBe('Verse');
      expect(store.groups[1].sectionName).toBe('Verse');
      expect(store.groups[0].id).not.toBe(store.groups[1].id);
    });

    it('should return sorted items by y position', () => {
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Third',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 300,
        rotation: 0,
        zIndex: 1,
      };
      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'First',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 2,
      };

      store.addLine(line1);
      store.addLine(line2);
      store.setSelectedLineIds(['line-2']);
      store.createGroup('Verse');

      const sortedItems = store.getSortedItems();

      expect(sortedItems[0].y).toBe(100);
      expect(sortedItems[1].y).toBe(300);
    });
  });

  describe('newLineInputText', () => {
    it('should start with empty input text', () => {
      expect(store.newLineInputText).toBe('');
    });

    it('should set and get input text', () => {
      store.setNewLineInputText('Test lyric line');
      expect(store.newLineInputText).toBe('Test lyric line');
    });

    it('should update input text', () => {
      store.setNewLineInputText('First text');
      expect(store.newLineInputText).toBe('First text');
      
      store.setNewLineInputText('Updated text');
      expect(store.newLineInputText).toBe('Updated text');
    });

    it('should allow empty string', () => {
      store.setNewLineInputText('Some text');
      store.setNewLineInputText('');
      expect(store.newLineInputText).toBe('');
    });
  });
});

