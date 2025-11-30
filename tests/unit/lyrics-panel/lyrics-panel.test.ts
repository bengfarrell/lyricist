import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { LyricsPanel } from '../../../src/lyrics-panel/index.js';
import { songStore } from '../../../src/store/song-store.js';
import type { LyricLine } from '../../../src/store/types.js';

// Ensure the component is registered
import '../../../src/lyrics-panel/index.js';

describe('LyricsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store to clean state
    songStore.newSong();
  });

  it('should render empty state when no lines exist', async () => {
    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    
    const emptyState = el.shadowRoot!.querySelector('.lyrics-text.empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No lyrics yet');
  });

  it('should render lyrics lines', async () => {
    const line: LyricLine = {
      id: 'line-1',
        type: 'line' as const,
      text: 'Test lyric line',
      chords: [],
      hasChordSection: false,
      x: 100,
      y: 100,
      rotation: 0,
      zIndex: 1,
    };
    songStore.addLine(line);

    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    await el.updateComplete;

    const lyricsText = el.shadowRoot!.querySelector('.lyrics-text');
    expect(lyricsText?.textContent).toContain('Test lyric line');
  });

  it('should render chords above lyrics', async () => {
    const line: LyricLine = {
      id: 'line-1',
        type: 'line' as const,
      text: 'Test lyric line',
      chords: [
        { id: 'chord-1', name: 'C', position: 10 },
        { id: 'chord-2', name: 'G', position: 50 },
      ],
      hasChordSection: false,
      x: 100,
      y: 100,
      rotation: 0,
      zIndex: 1,
    };
    songStore.addLine(line);

    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    await el.updateComplete;

    const chordLine = el.shadowRoot!.querySelector('.chord-line');
    expect(chordLine).toBeTruthy();
    expect(chordLine?.textContent).toContain('C');
    expect(chordLine?.textContent).toContain('G');
  });

  it('should sort lines by y position', async () => {
    const line1: LyricLine = {
      id: 'line-1',
        type: 'line' as const,
      text: 'Second line',
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
      text: 'First line',
      chords: [],
      hasChordSection: false,
      x: 100,
      y: 100,
      rotation: 0,
      zIndex: 1,
    };
    songStore.addLine(line1);
    songStore.addLine(line2);

    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    await el.updateComplete;

    const lyricsText = el.shadowRoot!.querySelector('.lyrics-text');
    const text = lyricsText?.textContent || '';
    
    // "First line" should appear before "Second line"
    const firstLineIndex = text.indexOf('First line');
    const secondLineIndex = text.indexOf('Second line');
    expect(firstLineIndex).toBeLessThan(secondLineIndex);
  });

  describe('copy functionality', () => {
    it('should copy lyrics to clipboard', async () => {
      const mockWriteText = vi.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Test lyric',
        chords: [{ id: 'chord-1', name: 'C', position: 0 }],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line);
      songStore.setSongName('My Song');

      const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
      await el.updateComplete;

      // Trigger copy via custom event (the component listens for 'copy-lyrics' event)
      window.dispatchEvent(new CustomEvent('copy-lyrics'));
      await el.updateComplete;

      expect(mockWriteText).toHaveBeenCalled();
      const copiedText = ((mockWriteText as any).mock.calls[0][0] as string) || '';
      expect(copiedText).toContain('My Song');
      expect(copiedText).toContain('Test lyric');
      expect(copiedText).toContain('C'); // Chord should be included
    });

    it('should copy only lyrics when song has no name', async () => {
      const mockWriteText = vi.fn(() => Promise.resolve());
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      const line: LyricLine = {
        id: 'line-1',
        type: 'line' as const,
        text: 'Test lyric',
        chords: [],
        hasChordSection: false,
        x: 100,
        y: 100,
        rotation: 0,
        zIndex: 1,
      };
      songStore.addLine(line);

      const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
      await el.updateComplete;

      // Trigger copy via custom event (the component listens for 'copy-lyrics' event)
      window.dispatchEvent(new CustomEvent('copy-lyrics'));
      await el.updateComplete;

      expect(mockWriteText).toHaveBeenCalled();
      const copiedText = ((mockWriteText as any).mock.calls[0][0] as string) || '';
      expect(copiedText).toContain('Test lyric');
    });
  });

  it('should render lyrics panel content', async () => {
    songStore.setSongName('Test Song Name');

    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    await el.updateComplete;

    // Check that the main content container exists
    const content = el.shadowRoot!.querySelector('.lyrics-panel-content');
    expect(content).toBeTruthy();
  });

  it('should update when store changes', async () => {
    const el = await fixture<LyricsPanel>(html`<lyrics-panel></lyrics-panel>`);
    await el.updateComplete;

    // Initially empty
    let emptyState = el.shadowRoot!.querySelector('.lyrics-text.empty');
    expect(emptyState).toBeTruthy();

    // Add a line
    const line: LyricLine = {
      id: 'line-1',
        type: 'line' as const,
      text: 'New line',
      chords: [],
      hasChordSection: false,
      x: 100,
      y: 100,
      rotation: 0,
      zIndex: 1,
    };
    songStore.addLine(line);
    await el.updateComplete;

    // Should now show lyrics
    emptyState = el.shadowRoot!.querySelector('.lyrics-text.empty');
    expect(emptyState).toBeNull();

    const lyricsText = el.shadowRoot!.querySelector('.lyrics-text');
    expect(lyricsText?.textContent).toContain('New line');
  });
});

