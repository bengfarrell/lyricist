import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { songStore } from '../../../src/store/song-store.js';
import type { LyricLine, SavedSong } from '../../../src/store/types.js';
import '../../../src/app-header/index.js';
import '../../../src/lyrics-panel/index.js';
import '../../../src/load-dialog/index.js';
import '../../../src/lyric-canvas/index.js';
import '../../../src/lyric-line/index.js';
import '../../../src/lyricist-app/index.js';

describe('Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    songStore.newSong();
  });

  describe('Create Song Workflow', () => {
    it('should create, edit, and save a complete song', async () => {
      // Step 1: Start with empty song
      expect(songStore.lines).toHaveLength(0);
      expect(songStore.songName).toBe('');

      // Step 2: Set song name
      songStore.setSongName('My First Song');
      expect(songStore.songName).toBe('My First Song');

      // Step 3: Add lyric lines
      const line1: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'First line of lyrics',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line1);

      const line2: LyricLine = {
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line of lyrics',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 160,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line2);

      expect(songStore.lines).toHaveLength(2);

      // Step 4: Add chords to lines
      songStore.addChord('line-1', { id: 'chord-1', name: 'C', position: 10 });
      songStore.addChord('line-1', { id: 'chord-2', name: 'G', position: 50 });
      songStore.addChord('line-2', { id: 'chord-3', name: 'Am', position: 20 });

      expect(songStore.lines[0].chords).toHaveLength(2);
      expect(songStore.lines[1].chords).toHaveLength(1);

      // Step 5: Edit a line
      songStore.updateLineText('line-1', 'Updated first line');
      expect(songStore.lines[0].text).toBe('Updated first line');

      // Step 6: Move a line
      songStore.updateLinePosition('line-1', 150, 200);
      expect(songStore.lines[0].x).toBe(150);
      expect(songStore.lines[0].y).toBe(200);

      // Step 7: Save the song
      const success = await songStore.saveSong();
      expect(success).toBe(true);
      expect(songStore.savedSongs).toHaveLength(1);
      expect(songStore.savedSongs[0].name).toBe('My First Song');
      expect(songStore.savedSongs[0].items).toHaveLength(2);
    });

    it('should duplicate and delete lines', async () => {
      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Original line',
        chords: [{ id: 'chord-1', name: 'C', position: 10 }],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line);

      // Duplicate the line
      songStore.duplicateLine('line-1');
      expect(songStore.lines).toHaveLength(2);
      expect(songStore.lines[1].text).toBe('Original line');
      expect(songStore.lines[1].chords).toHaveLength(1);
      expect(songStore.lines[1].id).not.toBe('line-1');

      // Delete a line
      songStore.deleteLine('line-1');
      expect(songStore.lines).toHaveLength(1);
      expect(songStore.lines[0].id).not.toBe('line-1');
    });
  });

  describe('Load and Edit Workflow', () => {
    it('should load a saved song and edit it', async () => {
      // Create and save a song first
      songStore.setSongName('Original Song');
      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Original text',
        chords: [{ id: 'chord-1', name: 'C', position: 10 }],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line);
      await songStore.saveSong();

      // Clear current state
      songStore.newSong();
      expect(songStore.lines).toHaveLength(0);
      expect(songStore.songName).toBe('');

      // Load the saved song
      const savedSong = songStore.savedSongs[0];
      songStore.loadSong(savedSong);

      expect(songStore.songName).toBe('Original Song');
      expect(songStore.lines).toHaveLength(1);
      expect(songStore.lines[0].text).toBe('Original text');

      // Edit the loaded song
      songStore.updateLineText('line-1', 'Modified text');
      songStore.addLine({
        id: 'line-2',
        type: 'line' as const,
        text: 'New line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 160,
        rotation: 0,
        zIndex: 1,
      });

      expect(songStore.lines).toHaveLength(2);

      // Save the modified song (should update existing)
      await songStore.saveSong();
      expect(songStore.savedSongs).toHaveLength(1); // Still only one song
      expect(songStore.savedSongs[0].items).toHaveLength(2); // But now with 2 lines
    });
  });

  describe('Multi-Song Management Workflow', () => {
    it('should manage multiple songs', async () => {
      // Create first song
      songStore.setSongName('Song A');
      songStore.addLine({
        id: 'line-a1',
        type: 'line' as const,
        text: 'Line from Song A',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });
      await songStore.saveSong();

      // Create second song
      songStore.newSong();
      songStore.setSongName('Song B');
      songStore.addLine({
        id: 'line-b1',
        type: 'line' as const,
        text: 'Line from Song B',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });
      await songStore.saveSong();

      // Should have two saved songs
      expect(songStore.savedSongs).toHaveLength(2);
      expect(songStore.savedSongs.map(s => s.name)).toContain('Song A');
      expect(songStore.savedSongs.map(s => s.name)).toContain('Song B');

      // Delete one song
      songStore.deleteSong('Song A');
      expect(songStore.savedSongs).toHaveLength(1);
      expect(songStore.savedSongs[0].name).toBe('Song B');

      // Load remaining song
      songStore.loadSong(songStore.savedSongs[0]);
      expect(songStore.songName).toBe('Song B');
      expect(songStore.lines[0].text).toBe('Line from Song B');
    });
  });

  describe('Chord Management Workflow', () => {
    it('should manage chords on a line', async () => {
      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Test line with chords',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line);

      // Add multiple chords
      songStore.addChord('line-1', { id: 'chord-1', name: 'C', position: 10 });
      songStore.addChord('line-1', { id: 'chord-2', name: 'G', position: 30 });
      songStore.addChord('line-1', { id: 'chord-3', name: 'Am', position: 50 });

      expect(songStore.lines[0].chords).toHaveLength(3);

      // Update a chord
      songStore.updateChord('line-1', 'chord-2', 'D');
      expect(songStore.lines[0].chords[1].name).toBe('D');

      // Move a chord
      songStore.updateChordPosition('line-1', 'chord-2', 40);
      expect(songStore.lines[0].chords[1].position).toBe(40);

      // Delete a chord
      songStore.deleteChord('line-1', 'chord-1');
      expect(songStore.lines[0].chords).toHaveLength(2);
      expect(songStore.lines[0].chords.find(c => c.id === 'chord-1')).toBeUndefined();
    });
  });

  describe('Copy Lyrics Workflow', () => {
    it('should copy formatted lyrics with chords', async () => {
      const mockWriteText = vi.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // Create song with multiple lines and chords
      songStore.setSongName('Copy Test');
      
      songStore.addLine({
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [
          { id: 'chord-1', name: 'C', position: 0 },
          { id: 'chord-2', name: 'G', position: 50 },
        ],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      songStore.addLine({
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [{ id: 'chord-3', name: 'Am', position: 20 }],
        hasChordSection: false,
        x: 100,
        y: 160,
        rotation: 0,
        zIndex: 1,
      });

      // Import and render lyrics panel
      const lyricsPanel: any = await fixture(html`<lyrics-panel></lyrics-panel>`);
      await lyricsPanel.updateComplete;

      // Trigger copy via custom event
      window.dispatchEvent(new CustomEvent('copy-lyrics'));
      await lyricsPanel.updateComplete;

      // Verify clipboard was called with formatted text
      expect(mockWriteText).toHaveBeenCalled();
      const copiedText = ((mockWriteText as any).mock.calls[0][0] as string) || '';
      
      expect(copiedText).toContain('Copy Test'); // Song name
      expect(copiedText).toContain('First line');
      expect(copiedText).toContain('Second line');
      expect(copiedText).toContain('C'); // Chords
      expect(copiedText).toContain('G');
      expect(copiedText).toContain('Am');
    });
  });

  describe('Z-Index Management Workflow', () => {
    it('should manage line stacking order', async () => {
      // Add multiple lines
      songStore.addLine({
        id: 'line-1',
        type: 'line' as const,
        text: 'Bottom line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      songStore.addLine({
        id: 'line-2',
        type: 'line' as const,
        text: 'Middle line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 2,
      });

      songStore.addLine({
        id: 'line-3',
        type: 'line' as const,
        text: 'Top line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 3,
      });

      // Bring bottom line to front
      songStore.bringLineToFront('line-1');

      const line1 = songStore.lines.find(l => l.id === 'line-1');
      expect(line1?.zIndex).toBe(4); // Should be higher than previous max (3)

      // Verify max z-index utility
      expect(songStore.getMaxZIndex()).toBe(4);
    });
  });

  describe('Persistence Workflow', () => {
    it('should persist songs across store instances', async () => {
      // Create and save a song
      songStore.setSongName('Persistent Song');
      songStore.addLine({
        id: 'line-1',
        type: 'line' as const,
        text: 'This should persist',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });
      await songStore.saveSong();

      // Verify localStorage was updated
      const saved = localStorage.getItem('lyricist-songs');
      expect(saved).toBeTruthy();
      
      const songs: SavedSong[] = JSON.parse(saved!);
      expect(songs).toHaveLength(1);
      expect(songs[0].name).toBe('Persistent Song');
      expect(songs[0].items).toHaveLength(1);

      // Create new store instance (simulating page reload)
      const { SongStore } = await import('../../../src/store/song-store.js');
      const newStore = new SongStore();

      // Should load saved songs from localStorage
      expect(newStore.savedSongs).toHaveLength(1);
      expect(newStore.savedSongs[0].name).toBe('Persistent Song');
    });
  });

  describe('UI State Management Workflow', () => {
    it('should manage dialog and panel state', async () => {
      // Test load dialog state
      expect(songStore.showLoadDialog).toBe(false);
      songStore.setShowLoadDialog(true);
      expect(songStore.showLoadDialog).toBe(true);
      songStore.setShowLoadDialog(false);
      expect(songStore.showLoadDialog).toBe(false);

      // Test panel width with constraints
      expect(songStore.lyricsPanelWidth).toBe(350);
      
      songStore.setLyricsPanelWidth(400);
      expect(songStore.lyricsPanelWidth).toBe(400);

      // Test min constraint
      songStore.setLyricsPanelWidth(100);
      expect(songStore.lyricsPanelWidth).toBe(200);

      // Test max constraint
      songStore.setLyricsPanelWidth(800);
      expect(songStore.lyricsPanelWidth).toBe(600);
    });
  });

  describe('Sorted Lines Workflow', () => {
    it('should sort lines by y position for lyrics display', async () => {
      // Add lines in random order
      songStore.addLine({
        id: 'line-3',
        type: 'line' as const,
        text: 'Third line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 300,
        rotation: 0,
        zIndex: 1,
      });

      songStore.addLine({
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      songStore.addLine({
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 200,
        rotation: 0,
        zIndex: 1,
      });

      // Get sorted lines
      const sorted = songStore.getSortedLines();
      
      expect(sorted[0].id).toBe('line-1');
      expect(sorted[1].id).toBe('line-2');
      expect(sorted[2].id).toBe('line-3');

      // Original array should be unchanged
      expect(songStore.lines[0].id).toBe('line-3');
    });
  });

  describe('Canvas Layout and Visibility', () => {
    it('should render canvas directly and show lyric lines', async () => {
      // Add a lyric line to the store
      songStore.addLine({
        id: 'test-line-1',
        type: 'line' as const,
        text: 'Test lyric line',
        chords: [],
        hasChordSection: false,
        x: 150,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      // Render just the canvas component (avoids sp-theme JSDOM issues)
      const canvas: any = await fixture(html`<lyric-canvas></lyric-canvas>`);
      await canvas.updateComplete;
      
      // Verify lyric line is rendered
      const lyricLine = canvas.shadowRoot.querySelector('lyric-line');
      expect(lyricLine).toBeTruthy();
      
      // Verify lyric line has content and is positioned
      expect(lyricLine.text).toBe('Test lyric line');
      expect(lyricLine.x).toBe(150);
      expect(lyricLine.y).toBe(100);

      // Verify the line element exists and has content rendered
      await lyricLine.updateComplete;
      const lyricLineDiv = lyricLine.shadowRoot.querySelector('.lyric-line');
      expect(lyricLineDiv).toBeTruthy();
      expect(lyricLineDiv.textContent).toContain('Test lyric line');
    });

    it('should render multiple lyric lines on canvas', async () => {
      // Add multiple lines
      songStore.addLine({
        id: 'line-1',
        type: 'line' as const,
        text: 'First line',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      songStore.addLine({
        id: 'line-2',
        type: 'line' as const,
        text: 'Second line',
        chords: [],
        hasChordSection: false,
        x: 200,
        y: 200,
        rotation: 0,
        zIndex: 2,
      });

      songStore.addLine({
        id: 'line-3',
        type: 'line' as const,
        text: 'Third line',
        chords: [],
        hasChordSection: false,
        x: 300,
        y: 150,
        rotation: 0,
        zIndex: 3,
      });

      const canvas: any = await fixture(html`<lyric-canvas></lyric-canvas>`);
      await canvas.updateComplete;

      // Verify all lines are rendered
      const lyricLines = canvas.shadowRoot.querySelectorAll('lyric-line');
      expect(lyricLines.length).toBe(3);

      // Verify each line has proper content
      const line1 = Array.from(lyricLines).find((line: any) => line.id === 'line-1') as any;
      const line2 = Array.from(lyricLines).find((line: any) => line.id === 'line-2') as any;
      const line3 = Array.from(lyricLines).find((line: any) => line.id === 'line-3') as any;

      expect(line1?.text).toBe('First line');
      expect(line2?.text).toBe('Second line');
      expect(line3?.text).toBe('Third line');

      // Verify lines are positioned correctly
      expect(line1?.x).toBe(100);
      expect(line1?.y).toBe(100);
      expect(line2?.x).toBe(200);
      expect(line2?.y).toBe(200);
      expect(line3?.x).toBe(300);
      expect(line3?.y).toBe(150);
    });

    it('should show empty state when no lines exist', async () => {
      // Ensure no lines in store
      expect(songStore.lines).toHaveLength(0);

      const canvas: any = await fixture(html`<lyric-canvas></lyric-canvas>`);
      await canvas.updateComplete;

      // Verify empty state is shown
      const emptyState = canvas.shadowRoot.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();

      // Verify no lyric lines are rendered
      const lyricLines = canvas.shadowRoot.querySelectorAll('lyric-line');
      expect(lyricLines.length).toBe(0);
    });

    it('should preserve positioning when lines are repositioned', async () => {
      // Add a line
      songStore.addLine({
        id: 'movable-line',
        type: 'line' as const,
        text: 'Move me',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      });

      const canvas: any = await fixture(html`<lyric-canvas></lyric-canvas>`);
      await canvas.updateComplete;

      const lyricLine: any = canvas.shadowRoot.querySelector('lyric-line');
      expect(lyricLine.x).toBe(100);
      expect(lyricLine.y).toBe(100);

      // Update position
      songStore.updateLinePosition('movable-line', 250, 300);
      await canvas.updateComplete;

      // Verify new position
      expect(lyricLine.x).toBe(250);
      expect(lyricLine.y).toBe(300);
    });
  });
});

