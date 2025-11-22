import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import type { LyricLine, CanvasItem } from '../store/index';
import { lyricsPanelStyles } from './styles.css.ts';

/**
 * Panel component for displaying formatted lyrics with chords
 */
export class LyricsPanel extends LitElement {
  static properties = {
    overlay: { type: Boolean, reflect: true }
  };

  static styles = lyricsPanelStyles;
  
  private store = new SongStoreController(this);
  
  overlay = false;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('copy-lyrics', this._handleCopyLyrics.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('copy-lyrics', this._handleCopyLyrics.bind(this));
  }

  private _handleCopyLyrics(): void {
    this._copyLyricsToClipboard();
  }

  private _renderChordLine(line: LyricLine): string {
    if (!line.chords || line.chords.length === 0) {
      return '';
    }

    // Sort chords by position
    const sortedChords = [...line.chords].sort((a, b) => a.position - b.position);
    
    // The lyric line in the canvas has 20px padding on each side
    // Match that exactly by calculating: padding as a fraction of character width
    // At 16px font, Courier New has character width of ~0.6em = ~9.6px
    // 20px padding / 9.6px per char = 2.083 chars
    // But we add the 2 non-breaking spaces in HTML, so we work with text length directly
    const textLength = line.text.length;
    
    let chordLine = '';
    let currentPos = 0;

    sortedChords.forEach(chord => {
      // The chord position is a percentage of the TOTAL width (padding + text + padding)
      // We have 2 spaces for padding on each side
      const totalWidth = 2 + textLength + 2;
      const rawPos = (chord.position / 100) * totalWidth;
      // The chord marker is centered at this position, so we need to position the START
      // of the chord name by subtracting half its length
      const chordStartPos = rawPos - (chord.name.length / 2);
      // Use floor to avoid rounding up - chords should appear at or before their center position
      const charPos = Math.floor(chordStartPos);
      
      // Ensure we don't go backwards
      const targetPos = Math.max(currentPos, charPos);
      
      // Add spaces to reach the chord position (use non-breaking spaces to match text line)
      while (currentPos < targetPos) {
        chordLine += '\u00A0';
        currentPos++;
      }
      
      // Add the chord
      chordLine += chord.name;
      currentPos += chord.name.length;
    });

    return chordLine;
  }

  private _copyLyricsToClipboard(): void {
    const sortedItems = this.store.getSortedItems();
    let text = '';

    if (this.store.songName) {
      text += `${this.store.songName}\n\n`;
    }

    sortedItems.forEach(item => {
      if (item.type === 'line') {
        const chordLine = this._renderChordLine(item);
        if (chordLine) {
          text += chordLine + '\n';
        }
        text += '  ' + item.text + '  \n\n';
      } else {
        // Add section header
        text += `[${item.sectionName}]\n`;
        // Add all lines in the group
        item.lines.forEach(line => {
          const chordLine = this._renderChordLine(line);
          if (chordLine) {
            text += chordLine + '\n';
          }
          text += '  ' + line.text + '  \n\n';
        });
        // Add section divider
        text += '------------------------\n\n';
      }
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
      <div class="lyrics-panel-content">
        ${this.store.items.length === 0 ? html`
          <div class="lyrics-text empty">
            No lyrics yet.<br>
            Add lines and arrange them<br>
            on the canvas to see your song here.
          </div>
        ` : html`
          <div class="lyrics-text">
            ${this.store.getSortedItems().map(item => {
              if (item.type === 'line') {
                // Render a single line
                const chordLine = this._renderChordLine(item);
                return html`
                  <div class="lyric-line-with-chords">
                    ${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}
                    <div class="lyric-text-line">${'\u00A0\u00A0'}${item.text}${'\u00A0\u00A0'}</div>
                  </div>
                `;
              } else {
                // Render a group with section header
                return html`
                  <div class="section-group">
                    <div class="section-header">[${item.sectionName}]</div>
                    ${item.lines.map(line => {
                      const chordLine = this._renderChordLine(line);
                      return html`
                        <div class="lyric-line-with-chords">
                          ${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}
                          <div class="lyric-text-line">${'\u00A0\u00A0'}${line.text}${'\u00A0\u00A0'}</div>
                        </div>
                      `;
                    })}
                    <div class="section-divider">------------------------</div>
                  </div>
                `;
              }
            })}
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('lyrics-panel', LyricsPanel);

