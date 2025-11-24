import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { LoadDialog } from '../../../src/load-dialog/index.js';
import { songStore } from '../../../src/store/song-store.js';
import type { SavedSong } from '../../../src/store/types.js';

// Mock fetch for sample content loading
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ sampleSongs: [] }),
} as Response);

// Ensure the component is registered
import '../../../src/load-dialog/index.js';

describe('LoadDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    songStore.newSong();
    songStore.setShowLoadDialog(false);
  });

  it('should not render when showLoadDialog is false', async () => {
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    
    const overlay = el.shadowRoot!.querySelector('.dialog-overlay');
    expect(overlay).toBeNull();
  });

  it('should render when showLoadDialog is true', async () => {
    songStore.setShowLoadDialog(true);
    
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    await el.updateComplete;
    
    const overlay = el.shadowRoot!.querySelector('.dialog-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should close dialog when overlay is clicked', async () => {
    songStore.setShowLoadDialog(true);
    
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    await el.updateComplete;
    
    const overlay = el.shadowRoot!.querySelector('.dialog-overlay') as HTMLElement;
    overlay.click();
    await el.updateComplete;
    
    expect(songStore.showLoadDialog).toBe(false);
  });

  it('should not close dialog when dialog content is clicked', async () => {
    songStore.setShowLoadDialog(true);
    
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    await el.updateComplete;
    
    const dialog = el.shadowRoot!.querySelector('.dialog') as HTMLElement;
    dialog.click();
    await el.updateComplete;
    
    // Should still be open because stopPropagation prevents closing
    expect(songStore.showLoadDialog).toBe(true);
  });

  describe('empty state', () => {
    it('should show empty message when no saved songs exist', async () => {
      songStore.setShowLoadDialog(true);
      
      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;
      
      const emptyMessage = el.shadowRoot!.querySelector('.empty-message');
      expect(emptyMessage).toBeTruthy();
      expect(emptyMessage?.textContent).toContain('No saved songs yet');
    });
  });

  describe('song list', () => {
    it('should display saved songs', async () => {
      const song: SavedSong = {
        name: 'Test Song',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [
          {
            id: 'line-1',
        type: 'line' as const,
            text: 'Test',
            chords: [],
            hasChordSection: false,
            x: 100,
            y: 100,
            rotation: 0,
            zIndex: 1,
          },
        ],
        lastModified: '2025-01-15T00:00:00.000Z',
      };
      songStore.setSongName('Test Song');
      songStore.addLine(song.lines![0]);
      await songStore.saveSong();
      songStore.setShowLoadDialog(true);

      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;

      const songList = el.shadowRoot!.querySelector('.song-list');
      expect(songList).toBeTruthy();

      const songItem = el.shadowRoot!.querySelector('.song-item');
      expect(songItem).toBeTruthy();
      expect(songItem?.textContent).toContain('Test Song');
      expect(songItem?.textContent).toContain('1 items');
    });

    it('should load song when song item is clicked', async () => {
      const song: SavedSong = {
        name: 'Test Song',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [
          {
            id: 'line-1',
        type: 'line' as const,
            text: 'Test',
            chords: [],
            hasChordSection: false,
            x: 100,
            y: 100,
            rotation: 0,
            zIndex: 1,
          },
        ],
        lastModified: '2025-01-15T00:00:00.000Z',
      };
      songStore.setSongName('Test Song');
      songStore.addLine(song.lines![0]);
      await songStore.saveSong();
      
      // Clear current state
      songStore.newSong();
      songStore.setShowLoadDialog(true);

      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;

      const songItem = el.shadowRoot!.querySelector('.song-item') as HTMLElement;
      songItem.click();
      await el.updateComplete;

      expect(songStore.songName).toBe('Test Song');
      expect(songStore.lines).toHaveLength(1);
      expect(songStore.showLoadDialog).toBe(false);
    });
  });

  describe('delete functionality', () => {
    it('should delete song when delete button is clicked', async () => {
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const song: SavedSong = {
        name: 'To Delete',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-15T00:00:00.000Z',
      };
      songStore.setSongName('To Delete');
      await songStore.saveSong();
      songStore.setShowLoadDialog(true);

      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;

      const deleteBtn = el.shadowRoot!.querySelector('.btn-danger') as HTMLButtonElement;
      expect(deleteBtn).toBeTruthy();

      deleteBtn.click();
      await el.updateComplete;

      expect(confirmMock).toHaveBeenCalledWith('Delete "To Delete"?');
      expect(songStore.savedSongs).toHaveLength(0);

      confirmMock.mockRestore();
    });

    it('should not delete song if user cancels', async () => {
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const song: SavedSong = {
        name: 'To Keep',
        songId: 'test-song-id',
        userId: 'test-user-id',
        lines: [],
        lastModified: '2025-01-15T00:00:00.000Z',
      };
      songStore.setSongName('To Keep');
      await songStore.saveSong();
      songStore.setShowLoadDialog(true);

      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;

      const deleteBtn = el.shadowRoot!.querySelector('.btn-danger') as HTMLButtonElement;
      deleteBtn.click();
      await el.updateComplete;

      expect(songStore.savedSongs).toHaveLength(1);

      confirmMock.mockRestore();
    });
  });

  describe('import functionality', () => {
    it('should have import button', async () => {
      songStore.setShowLoadDialog(true);
      
      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;
      
      const importBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-secondary')).find(
        btn => btn.textContent?.includes('Import JSON')
      ) as HTMLButtonElement;
      expect(importBtn).toBeTruthy();
    });

    it('should trigger file input when import button is clicked', async () => {
      songStore.setShowLoadDialog(true);
      
      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;
      
      const fileInput = el.shadowRoot!.querySelector('.file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const importBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-secondary')).find(
        btn => btn.textContent?.includes('Import JSON')
      ) as HTMLButtonElement;
      
      importBtn.click();
      await el.updateComplete;

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('export functionality', () => {
    it('should have export button', async () => {
      songStore.setShowLoadDialog(true);
      
      const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
      await el.updateComplete;
      
      const exportBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn-secondary')).find(
        btn => btn.textContent?.includes('Export JSON')
      ) as HTMLButtonElement;
      expect(exportBtn).toBeTruthy();
    });
  });

  it('should have close button', async () => {
    vi.restoreAllMocks(); // Clean up any mocks from previous tests
    songStore.setShowLoadDialog(true);
    
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    await el.updateComplete;
    
    const closeBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
      btn => btn.textContent?.includes('Close')
    ) as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    closeBtn.click();
    await el.updateComplete;

    expect(songStore.showLoadDialog).toBe(false);
  });

  it('should update when store changes', async () => {
    vi.restoreAllMocks(); // Clean up any mocks from previous tests
    
    // Clear all saved songs and start fresh
    localStorage.clear();
    
    // Create a completely fresh store
    const { SongStore } = await import('../../../src/store/song-store.js');
    const freshStore = new SongStore();
    expect(freshStore.savedSongs).toHaveLength(0);
    
    // Clear the global store too
    songStore.newSong();
    // Manually clear saved songs array in the store
    (songStore as any)._savedSongs = [];
    songStore.setShowLoadDialog(true);
    
    const el = await fixture<LoadDialog>(html`<load-dialog></load-dialog>`);
    await el.updateComplete;

    // Initially no saved songs
    let emptyMessage = el.shadowRoot!.querySelector('.empty-message');
    expect(emptyMessage).toBeTruthy();

    // Add a saved song
    songStore.setSongName('New Song');
    await songStore.saveSong();
    await el.updateComplete;

    // Should now show song list
    emptyMessage = el.shadowRoot!.querySelector('.empty-message');
    expect(emptyMessage).toBeNull();

    const songItem = el.shadowRoot!.querySelector('.song-item');
    expect(songItem).toBeTruthy();
  });
});

