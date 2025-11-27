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
  private _maxCharsPerLine = 80; // Default, will be calculated dynamically

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('copy-lyrics', this._handleCopyLyrics.bind(this));
    window.addEventListener('resize', this._handleResize.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('copy-lyrics', this._handleCopyLyrics.bind(this));
    window.removeEventListener('resize', this._handleResize.bind(this));
  }

  firstUpdated(): void {
    this._calculateMaxChars();
  }

  private _handleResize(): void {
    this._calculateMaxChars();
    this.requestUpdate();
  }

  private _calculateMaxChars(): void {
    const content = this.shadowRoot?.querySelector('.lyrics-panel-content');
    if (!content) return;

    const width = content.clientWidth;
    // At 16px font, Courier New has character width of ~9.6px
    // Subtract padding (30px * 2) from available width
    const availableWidth = width - 60;
    const charWidth = 9.6;
    this._maxCharsPerLine = Math.floor(availableWidth / charWidth);
  }

  private _handleCopyLyrics(): void {
    this._copyLyricsToClipboard();
  }

  private _breakLineIntoSegments(line: LyricLine, maxChars: number): Array<{text: string, chords: Array<{name: string, position: number}>}> {
    // If line has no chords or is short enough, return as single segment
    const fullText = line.text;
    const totalChars = fullText.length + 4; // +4 for padding spaces
    
    if (!line.chords || line.chords.length === 0 || totalChars <= maxChars) {
      return [{
        text: fullText,
        chords: line.chords || []
      }];
    }

    // Break into segments
    const segments: Array<{text: string, chords: Array<{name: string, position: number}>}> = [];
    const charsPerSegment = maxChars - 4; // Account for padding
    let startChar = 0;

    while (startChar < fullText.length) {
      const endChar = Math.min(startChar + charsPerSegment, fullText.length);
      const segmentText = fullText.substring(startChar, endChar);
      
      // Calculate which chords belong to this segment
      // Chord positions are percentages of the total line
      const startPercent = (startChar / fullText.length) * 100;
      const endPercent = (endChar / fullText.length) * 100;
      
      const segmentChords = line.chords
        .filter(chord => {
          // Include chord if its position falls within this segment
          // Chords exactly at the break point go to the next segment
          return chord.position >= startPercent && chord.position < endPercent;
        })
        .map(chord => {
          // Recalculate position relative to this segment
          const relativePercent = ((chord.position - startPercent) / (endPercent - startPercent)) * 100;
          return {
            name: chord.name,
            position: relativePercent
          };
        });

      segments.push({
        text: segmentText,
        chords: segmentChords
      });

      startChar = endChar;
    }

    return segments;
  }

  private _renderChordLine(text: string, chords: Array<{name: string, position: number}>): string {
    if (!chords || chords.length === 0) {
      return '';
    }

    // Sort chords by position
    const sortedChords = [...chords].sort((a, b) => a.position - b.position);
    
    const textLength = text.length;
    
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
        const chordLine = this._renderChordLine(item.text, item.chords || []);
        if (chordLine) {
          text += chordLine + '\n';
        }
        text += '  ' + item.text + '  \n\n';
      } else {
        // Add section header
        text += `[${item.sectionName}]\n`;
        // Add all lines in the group
        item.lines.forEach(line => {
          const chordLine = this._renderChordLine(line.text, line.chords || []);
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
                // Break line into segments if needed
                const segments = this._breakLineIntoSegments(item, this._maxCharsPerLine);
                return html`
                  ${segments.map(segment => {
                    const chordLine = this._renderChordLine(segment.text, segment.chords);
                    return html`
                      <div class="lyric-line-with-chords">
                        ${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}
                        <div class="lyric-text-line">${'\u00A0\u00A0'}${segment.text}${'\u00A0\u00A0'}</div>
                      </div>
                    `;
                  })}
                `;
              } else {
                // Render a group with section header
                return html`
                  <div class="section-group">
                    <div class="section-header">[${item.sectionName}]</div>
                    ${item.lines.map(line => {
                      const segments = this._breakLineIntoSegments(line, this._maxCharsPerLine);
                      return html`
                        ${segments.map(segment => {
                          const chordLine = this._renderChordLine(segment.text, segment.chords);
                          return html`
                            <div class="lyric-line-with-chords">
                              ${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}
                              <div class="lyric-text-line">${'\u00A0\u00A0'}${segment.text}${'\u00A0\u00A0'}</div>
                            </div>
                          `;
                        })}
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

