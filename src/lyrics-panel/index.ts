import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index.js';
import type { LyricLine } from '../store/index.js';
import { lyricsPanelStyles } from './styles.css.js';

/**
 * Panel component for displaying formatted lyrics with chords
 */
export class LyricsPanel extends LitElement {
  static styles = lyricsPanelStyles;
  
  private store = new SongStoreController(this);

  private _renderChordLine(line: LyricLine): string {
    if (!line.chords || line.chords.length === 0) {
      return '';
    }

    // Sort chords by position
    const sortedChords = [...line.chords].sort((a, b) => a.position - b.position);
    
    // The lyric line has 20px padding on each side
    // In monospace font (Courier New), approximate character width is ~9.6px at 16px font
    // So 20px ≈ 2 characters of spacing
    const paddingChars = 2;
    
    // Calculate character positions based on line text length and chord positions
    // The total width includes padding on both sides
    const textLength = line.text.length;
    const totalWidth = paddingChars + textLength + paddingChars;
    
    let chordLine = '';
    let currentPos = 0;

    sortedChords.forEach(chord => {
      // Convert percentage position to character position within the full width (including padding)
      const charPos = Math.floor((chord.position / 100) * totalWidth);
      
      // Add spaces to reach the chord position
      while (currentPos < charPos) {
        chordLine += ' ';
        currentPos++;
      }
      
      // Add the chord
      chordLine += chord.name;
      currentPos += chord.name.length;
    });

    return chordLine;
  }

  private _copyLyricsToClipboard(): void {
    const sortedLines = this.store.getSortedLines();
    let text = '';

    if (this.store.songName) {
      text += `${this.store.songName}\n\n`;
    }

    sortedLines.forEach(line => {
      const chordLine = this._renderChordLine(line);
      if (chordLine) {
        text += chordLine + '\n';
      }
      // Add padding spaces to match the visual layout
      text += '  ' + line.text + '  ' + '\n\n';
    });

    navigator.clipboard.writeText(text.trim()).then(() => {
      // Visual feedback
      const btn = this.shadowRoot?.querySelector('.copy-lyrics-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 1500);
      }
    });
  }

  render() {
    return html`
      <div class="lyrics-panel-header">
        <h2>📝 Song Lyrics</h2>
        <button class="copy-lyrics-btn" @click=${this._copyLyricsToClipboard} title="Copy all lyrics">📋</button>
      </div>
      <div class="lyrics-panel-content">
        ${this.store.lines.length === 0 ? html`
          <div class="lyrics-text empty">
            No lyrics yet. Add lines and arrange them on the canvas to see your song here.
          </div>
        ` : html`
          <div class="lyrics-text">${this.store.getSortedLines().map(line => {
            const chordLine = this._renderChordLine(line);
            return html`<div class="lyric-line-with-chords">${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}<div class="lyric-text-line">${'\u00A0\u00A0'}${line.text}${'  '}</div></div>`;
          })}</div>
        `}
      </div>
    `;
  }
}

customElements.define('lyrics-panel', LyricsPanel);

