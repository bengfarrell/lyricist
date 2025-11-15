import { LitElement, html } from 'lit';
import '../lyric-line/index.js';
import { cursorManager } from '../cursor-manager/index.js';
import { lyricistAppStyles } from './styles.css.js';
import { SongStoreController } from '../store/index.js';
import type { LyricLine, SavedSong } from '../store/index.js';

export class LyricistApp extends LitElement {
  static styles = lyricistAppStyles;
  
  // Reactive store controller - auto registers/unregisters this component
  private store = new SongStoreController(this);
  
  // Local UI state (not shared with other components)
  private _draggedLine: LyricLine | null = null;
  private _isDraggingDivider: boolean = false;
  private _newLineText: string = '';
  private _boundHandleMouseMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;
  private _boundHandleDividerMove?: (e: MouseEvent) => void;

  constructor() {
    super();
    // Load sample song on startup for development
    this.store.loadSampleSong();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._boundHandleMouseMove = this._handleMouseMove.bind(this);
    this._boundHandleMouseUp = this._handleMouseUp.bind(this);
    this._boundHandleDividerMove = this._handleDividerMove.bind(this);
    window.addEventListener('mousemove', this._boundHandleMouseMove);
    window.addEventListener('mouseup', this._boundHandleMouseUp);
    window.addEventListener('mousemove', this._boundHandleDividerMove);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundHandleMouseMove) {
      window.removeEventListener('mousemove', this._boundHandleMouseMove);
    }
    if (this._boundHandleMouseUp) {
      window.removeEventListener('mouseup', this._boundHandleMouseUp);
    }
    if (this._boundHandleDividerMove) {
      window.removeEventListener('mousemove', this._boundHandleDividerMove);
    }
  }

  private _saveSong(): void {
    const success = this.store.saveSong();
    if (!success) {
      alert('Please enter a song name');
      return;
    }
    
    // Visual feedback
    const btn = this.shadowRoot?.querySelector('.btn-primary');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }

  private _deleteSong(song: SavedSong, e: MouseEvent): void {
    e.stopPropagation();
    if (confirm(`Delete "${song.name}"?`)) {
      this.store.deleteSong(song.name);
    }
  }

  private _newSong(): void {
    if (this.store.lines.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.store.newSong();
  }

  private _addLine(e: Event): void {
    e.preventDefault();
    const input = this.shadowRoot?.querySelector('.lyric-input') as HTMLInputElement;
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;

    const canvas = this.shadowRoot?.querySelector('.canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Generate a subtle random rotation between -5 and +5 degrees
    const rotation = (Math.random() * 10) - 5;
    
    const maxZ = this.store.getMaxZIndex();
    
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      chords: [],
      hasChordSection: false,
      x: rect.width / 2 - 100,
      y: rect.height / 2 - 20 + (this.store.lines.length * 60),
      rotation,
      zIndex: maxZ + 1
    };

    this.store.addLine(newLine);
    input.value = '';
    this._newLineText = '';
    this.requestUpdate();
  }

  private _handleDragStart(e: CustomEvent): void {
    const line = this.store.lines.find(line => line.id === e.detail.id);
    if (line) {
      this._draggedLine = line;
      cursorManager.setCursor('move');
    }
  }

  private _handleBringToFront(e: CustomEvent): void {
    const clickedId = e.detail.id;
    
    // Close any open chord pickers on other lines
    document.dispatchEvent(new CustomEvent('close-chord-picker', {
      detail: { exceptId: clickedId }
    }));
    
    this.store.bringLineToFront(clickedId);
  }

  private _handleMouseMove(e: MouseEvent): void {
    if (!this._draggedLine) return;

    const canvas = this.shadowRoot?.querySelector('.canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();

    const lineElement = this.shadowRoot?.querySelector(`lyric-line[id="${this._draggedLine.id}"]`) as any;
    if (!lineElement) return;

    // Calculate new position relative to canvas, accounting for where user clicked within the element
    const newX = e.clientX - rect.left - lineElement._offsetX;
    const newY = e.clientY - rect.top - lineElement._offsetY;

    this.store.updateLinePosition(this._draggedLine.id, newX, newY);
  }

  private _handleMouseUp(): void {
    if (this._draggedLine) {
      const lineElement = this.shadowRoot?.querySelector(`lyric-line[id="${this._draggedLine.id}"]`);
      if (lineElement) {
        lineElement.removeAttribute('dragging');
      }
      this._draggedLine = null;
    }
    
    if (this._isDraggingDivider) {
      this._isDraggingDivider = false;
    }
    
    // Clear cursor for any drag operation
    cursorManager.clearCursor();
  }

  private _handleDividerMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this._isDraggingDivider = true;
    cursorManager.setCursor('ew-resize');
  }

  private _handleDividerMove(e: MouseEvent): void {
    if (!this._isDraggingDivider) return;

    const container = this.shadowRoot?.querySelector('.main-content');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Calculate new width from the right edge
    const newWidth = rect.right - e.clientX;
    
    this.store.setLyricsPanelWidth(newWidth);
  }

  private _handleDeleteLine(e: CustomEvent): void {
    this.store.deleteLine(e.detail.id);
  }

  private _handleDuplicateLine(e: CustomEvent): void {
    this.store.duplicateLine(e.detail.id);
  }

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

  private _handleToggleChordSection(e: CustomEvent): void {
    const { id, hasChordSection } = e.detail;
    this.store.toggleChordSection(id, hasChordSection);
  }

  private _handleChordAdded(e: CustomEvent): void {
    const { lineId, chord } = e.detail;
    this.store.addChord(lineId, chord);
  }

  private _handleChordUpdated(e: CustomEvent): void {
    const { lineId, chordId, name } = e.detail;
    this.store.updateChord(lineId, chordId, name);
  }

  private _handleChordDeleted(e: CustomEvent): void {
    const { lineId, chordId } = e.detail;
    this.store.deleteChord(lineId, chordId);
  }

  private _handleChordPositionChanged(e: CustomEvent): void {
    const { lineId, chordId, position } = e.detail;
    this.store.updateChordPosition(lineId, chordId, position);
  }

  private _handleTextChanged(e: CustomEvent): void {
    const { id, text } = e.detail;
    this.store.updateLineText(id, text);
    this._saveSong();
  }

  private _importFromJSON(): void {
    const input = this.shadowRoot?.querySelector('.file-input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  private _handleFileImport(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const song = JSON.parse(result) as SavedSong;
          this.store.importFromJSON(song);
        }
      } catch (error) {
        alert('Error importing file: Invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>🎵 Lyricist</h1>
          <div class="header-controls">
            <input 
              type="text" 
              class="song-name-input" 
              placeholder="Song Name"
              .value=${this.store.songName}
              @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
            />
            <button class="btn btn-primary" @click=${this._saveSong}>Save</button>
            <button class="btn btn-secondary" @click=${() => this.store.setShowLoadDialog(true)}>Load</button>
            <button class="btn btn-secondary" @click=${this._newSong}>New</button>
            <button class="btn btn-secondary" @click=${() => this.store.loadSampleSong()}>Load Sample</button>
          </div>
        </div>

        <div class="controls">
          <form class="input-container" @submit=${this._addLine}>
            <input 
              type="text" 
              class="lyric-input" 
              placeholder="Enter a line of lyrics..."
              .value=${this._newLineText}
              @input=${(e: InputEvent) => this._newLineText = (e.target as HTMLInputElement).value}
            />
            <button type="submit" class="btn btn-primary">Add Line</button>
          </form>
        </div>

        <div class="main-content">
          <div class="canvas" 
            @drag-start=${this._handleDragStart} 
            @delete-line=${this._handleDeleteLine} 
            @duplicate-line=${this._handleDuplicateLine}
            @toggle-chord-section=${this._handleToggleChordSection}
            @chord-added=${this._handleChordAdded}
            @chord-updated=${this._handleChordUpdated}
            @chord-deleted=${this._handleChordDeleted}
            @chord-position-changed=${this._handleChordPositionChanged}
            @bring-to-front=${this._handleBringToFront}
            @text-changed=${this._handleTextChanged}
          >
            ${this.store.lines.length === 0 ? html`
              <div class="empty-state">
                <div class="empty-state-icon">✨</div>
                <h2>Start Creating</h2>
                <p>Add your first lyric line to begin</p>
              </div>
            ` : ''}
            
            ${this.store.lines.map(line => html`
              <lyric-line
                id=${line.id}
                text=${line.text}
                .chords=${line.chords || []}
                .hasChordSection=${line.hasChordSection || false}
                .x=${line.x}
                .y=${line.y}
                .rotation=${line.rotation || 0}
                .zIndex=${line.zIndex || 1}
              ></lyric-line>
            `)}
          </div>

          <div class="panel-divider" @mousedown=${this._handleDividerMouseDown}></div>

          <div class="lyrics-panel" style="width: ${this.store.lyricsPanelWidth}px">
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
          </div>
        </div>
      </div>

      ${this.store.showLoadDialog ? html`
        <div class="dialog-overlay" @click=${() => this.store.setShowLoadDialog(false)}>
          <div class="dialog" @click=${(e: MouseEvent) => e.stopPropagation()}>
            <h2>Load Song</h2>
            
            ${this.store.savedSongs.length === 0 ? html`
              <p style="color: #6b7280; text-align: center; padding: 40px 0;">
                No saved songs yet. Create and save your first song!
              </p>
            ` : html`
              <div class="song-list">
                ${this.store.savedSongs.map(song => html`
                  <div class="song-item" @click=${() => this.store.loadSong(song)}>
                    <div class="song-item-info">
                      <div class="song-item-name">${song.name}</div>
                      <div class="song-item-meta">
                        ${song.lines.length} lines • Last modified: ${new Date(song.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                    <button class="btn btn-danger" @click=${(e: MouseEvent) => this._deleteSong(song, e)}>Delete</button>
                  </div>
                `)}
              </div>
            `}

            <div class="export-section">
              <h3>Import/Export</h3>
              <div class="export-actions">
                <button class="btn btn-secondary" @click=${this._importFromJSON}>Import JSON</button>
                <button class="btn btn-secondary" @click=${() => this.store.exportToJSON()}>Export JSON</button>
              </div>
              <input type="file" class="file-input" accept=".json" @change=${this._handleFileImport} />
            </div>

            <div class="dialog-actions">
              <button class="btn btn-secondary" @click=${() => this.store.setShowLoadDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);
