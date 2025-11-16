import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { AppHeader } from '../../../src/app-header/index.js';
import { songStore } from '../../../src/store/song-store.js';
import type { LyricLine } from '../../../src/store/types.js';

// Mock fetch for sample content loading
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    sampleSongs: [{
      name: 'Morning Coffee (Sample)',
      lastModified: '2024-01-01T00:00:00.000Z',
      wordLadderSets: [],
      items: [
        {
          id: 'line-1',
          type: 'line',
          text: 'Sample line',
          chords: [],
          hasChordSection: false,
          x: 100,
          y: 100,
          rotation: 0,
          zIndex: 1
        }
      ]
    }]
  }),
} as Response);

// Ensure the component is registered
import '../../../src/app-header/index.js';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    songStore.newSong();
  });

  it('should render the header with title', async () => {
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    await el.updateComplete;
    
    const header = el.shadowRoot!.querySelector('.header');
    expect(header).toBeTruthy();
    
    const title = el.shadowRoot!.querySelector('h1');
    expect(title?.textContent).toContain('Lyricist');
  });

  it('should render song name input', async () => {
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    
    const input = el.shadowRoot!.querySelector('.song-name-input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Song Name');
  });

  it('should update song name when input changes', async () => {
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    await el.updateComplete;
    
    const input = el.shadowRoot!.querySelector('.song-name-input') as HTMLInputElement;
    
    input.value = 'My New Song';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    
    expect(songStore.songName).toBe('My New Song');
  });

  it('should display current song name in input', async () => {
    songStore.setSongName('Existing Song');
    
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    await el.updateComplete;
    
    const input = el.shadowRoot!.querySelector('.song-name-input') as HTMLInputElement;
    expect(input.value).toBe('Existing Song');
  });

  describe('save functionality', () => {
    it('should save song when save button is clicked', async () => {
      songStore.setSongName('Test Song');
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
      songStore.addLine(line);

      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      const saveBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('Save')
      ) as HTMLButtonElement;
      expect(saveBtn).toBeTruthy();

      saveBtn.click();
      await el.updateComplete;

      expect(songStore.savedSongs).toHaveLength(1);
      expect(songStore.savedSongs[0].name).toBe('Test Song');
    });

    it('should show alert when trying to save without song name', async () => {
      // Clear any existing saved songs from previous tests
      localStorage.clear();
      songStore.newSong();
      
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      const saveBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('Save')
      ) as HTMLButtonElement;

      saveBtn.click();
      await el.updateComplete;

      expect(alertMock).toHaveBeenCalledWith('Please enter a song name');
      
      // Reload saved songs to get fresh state
      const freshStore = new (await import('../../../src/store/song-store.js')).SongStore();
      expect(freshStore.savedSongs).toHaveLength(0);

      alertMock.mockRestore();
    });
  });

  describe('load functionality', () => {
    it('should open load dialog when load button is clicked', async () => {
      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      const loadBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('Load')
      ) as HTMLButtonElement;
      expect(loadBtn).toBeTruthy();

      loadBtn.click();
      await el.updateComplete;

      expect(songStore.showLoadDialog).toBe(true);
    });
  });

  describe('new song functionality', () => {
    it('should create new song when new button is clicked', async () => {
      songStore.setSongName('Old Song');
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
      songStore.addLine(line);

      // Mock confirm to auto-accept
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      const newBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('New')
      ) as HTMLButtonElement;

      newBtn.click();
      await el.updateComplete;

      expect(songStore.songName).toBe('');
      expect(songStore.lines).toHaveLength(0);

      confirmMock.mockRestore();
    });

    it('should not create new song if user cancels', async () => {
      songStore.setSongName('Old Song');
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
      songStore.addLine(line);

      // Mock confirm to reject
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      const newBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('New')
      ) as HTMLButtonElement;

      newBtn.click();
      await el.updateComplete;

      expect(songStore.songName).toBe('Old Song');
      expect(songStore.lines).toHaveLength(1);

      confirmMock.mockRestore();
    });
  });

  describe('load sample functionality', () => {
    it('should load sample song when button is clicked', async () => {
      // Reset mock to return sample data
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sampleSongs: [{
            name: 'Morning Coffee (Sample)',
            lastModified: '2024-01-01T00:00:00.000Z',
            wordLadderSets: [],
            items: [
              {
                id: 'line-1',
                type: 'line',
                text: 'Sample line',
                chords: [],
                hasChordSection: false,
                x: 100,
                y: 100,
                rotation: 0,
                zIndex: 1
              }
            ]
          }]
        }),
      } as Response);
      
      const el = await fixture<AppHeader>(html`<app-header></app-header>`);
      await el.updateComplete;
      
      // Force sample content reload
      await (songStore as any)._loadSampleContent();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const sampleBtn = Array.from(el.shadowRoot!.querySelectorAll('.btn')).find(
        btn => btn.textContent?.includes('Load Sample')
      ) as HTMLButtonElement;
      expect(sampleBtn).toBeTruthy();

      sampleBtn.click();
      await el.updateComplete;
      
      // Wait for the async load to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(songStore.songName).toContain('Morning Coffee');
      expect(songStore.lines.length).toBeGreaterThan(0);
    });
  });

  it('should render all action buttons', async () => {
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    
    const buttons = el.shadowRoot!.querySelectorAll('.btn');
    expect(buttons.length).toBeGreaterThanOrEqual(4); // Save, Load, New, Load Sample
  });

  it('should update when store changes', async () => {
    const el = await fixture<AppHeader>(html`<app-header></app-header>`);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('.song-name-input') as HTMLInputElement;
    expect(input.value).toBe('');

    // Change song name in store
    songStore.setSongName('Updated Name');
    await el.updateComplete;

    expect(input.value).toBe('Updated Name');
  });
});

