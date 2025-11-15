import { LitElement, html, PropertyValues } from 'lit';
import '../lyric-line/index.js';
import { cursorManager } from '../cursor-manager/index.js';
import { Chord } from '../lyric-line/index.js';
import { lyricistAppStyles } from './styles.css.js';

export interface LyricLine {
  id: string;
  text: string;
  chords: Chord[];
  hasChordSection: boolean;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface SavedSong {
  name: string;
  lines: LyricLine[];
  lastModified: string;
  exportedAt?: string;
}

export class LyricistApp extends LitElement {
  static properties = {
    lines: { type: Array },
    songName: { type: String },
    savedSongs: { type: Array },
    showLoadDialog: { type: Boolean },
    newLineText: { type: String },
    lyricsPanelWidth: { type: Number }
  };

  static styles = lyricistAppStyles;

  lines: LyricLine[] = [];
  songName: string = '';
  savedSongs: SavedSong[] = [];
  showLoadDialog: boolean = false;
  newLineText: string = '';
  lyricsPanelWidth: number = 350;
  
  private _draggedLine: LyricLine | null = null;
  private _isDraggingDivider: boolean = false;
  private _boundHandleMouseMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;
  private _boundHandleDividerMove?: (e: MouseEvent) => void;

  constructor() {
    super();
    this._loadSavedSongs();
    // Load sample song on startup for development
    this._loadSampleSong();
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

  private _loadSavedSongs(): void {
    const saved = localStorage.getItem('lyricist-songs');
    if (saved) {
      this.savedSongs = JSON.parse(saved);
    }
  }

  private _saveSong(): void {
    if (!this.songName.trim()) {
      alert('Please enter a song name');
      return;
    }

    const song: SavedSong = {
      name: this.songName,
      lines: this.lines,
      lastModified: new Date().toISOString()
    };

    // Check if song already exists
    const existingIndex = this.savedSongs.findIndex(s => s.name === this.songName);
    if (existingIndex >= 0) {
      this.savedSongs[existingIndex] = song;
    } else {
      this.savedSongs = [...this.savedSongs, song];
    }

    localStorage.setItem('lyricist-songs', JSON.stringify(this.savedSongs));
    
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

  private _loadSong(song: SavedSong): void {
    this.songName = song.name;
    // Close all chord sections by default when loading
    this.lines = song.lines.map(line => ({ ...line, hasChordSection: false }));
    this.showLoadDialog = false;
    this.requestUpdate();
  }

  private _deleteSong(song: SavedSong, e: MouseEvent): void {
    e.stopPropagation();
    if (confirm(`Delete "${song.name}"?`)) {
      this.savedSongs = this.savedSongs.filter(s => s.name !== song.name);
      localStorage.setItem('lyricist-songs', JSON.stringify(this.savedSongs));
      this.requestUpdate();
    }
  }

  private _newSong(): void {
    if (this.lines.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.songName = '';
    this.lines = [];
    this.requestUpdate();
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
    
    const maxZ = this.lines.length > 0 ? Math.max(...this.lines.map(line => line.zIndex || 1)) : 0;
    
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      chords: [],
      hasChordSection: false,
      x: rect.width / 2 - 100,
      y: rect.height / 2 - 20 + (this.lines.length * 60),
      rotation,
      zIndex: maxZ + 1
    };

    this.lines = [...this.lines, newLine];
    input.value = '';
    this.newLineText = '';
  }

  private _handleDragStart(e: CustomEvent): void {
    const line = this.lines.find(line => line.id === e.detail.id);
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
    
    // Find the maximum z-index
    const maxZ = Math.max(...this.lines.map(line => line.zIndex || 1));
    // Update all lines: clicked line gets maxZ + 1, others stay the same
    this.lines = this.lines.map(line => 
      line.id === clickedId ? { ...line, zIndex: maxZ + 1 } : line
    );
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

    // Update the line position
    this.lines = this.lines.map(line => 
      line.id === this._draggedLine!.id 
        ? { ...line, x: newX, y: newY }
        : line
    );
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
    
    // Constrain between 200px and 600px
    this.lyricsPanelWidth = Math.max(200, Math.min(600, newWidth));
  }

  private _handleDeleteLine(e: CustomEvent): void {
    const lineId = e.detail.id;
    this.lines = this.lines.filter(line => line.id !== lineId);
  }

  private _handleDuplicateLine(e: CustomEvent): void {
    const originalLine = this.lines.find(line => line.id === e.detail.id);
    if (!originalLine) return;

    // Create a duplicate with slight offset and new rotation
    const newLine: LyricLine = {
      ...originalLine,
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: originalLine.x + 30,
      y: originalLine.y + 30,
      rotation: (Math.random() * 10) - 5
    };

    this.lines = [...this.lines, newLine];
  }

  private _getSortedLines(): LyricLine[] {
    return [...this.lines].sort((a, b) => a.y - b.y);
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
    const sortedLines = this._getSortedLines();
    let text = '';

    if (this.songName) {
      text += `${this.songName}\n\n`;
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
    this.lines = this.lines.map(line => 
      line.id === id ? { ...line, hasChordSection } : line
    );
  }

  private _handleChordAdded(e: CustomEvent): void {
    const { lineId, chord } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { ...line, chords: [...(line.chords || []), chord] } : line
    );
  }

  private _handleChordUpdated(e: CustomEvent): void {
    const { lineId, chordId, name } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { 
        ...line, 
        chords: line.chords.map(c => c.id === chordId ? { ...c, name } : c)
      } : line
    );
  }

  private _handleChordDeleted(e: CustomEvent): void {
    const { lineId, chordId } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { ...line, chords: line.chords.filter(c => c.id !== chordId) } : line
    );
  }

  private _handleChordPositionChanged(e: CustomEvent): void {
    const { lineId, chordId, position } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? {
        ...line,
        chords: line.chords.map(c => c.id === chordId ? { ...c, position } : c)
      } : line
    );
  }

  private _handleTextChanged(e: CustomEvent): void {
    const { id, text } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === id ? { ...line, text } : line
    );
    this._saveSong();
  }

  private _exportToJSON(): void {
    const song: SavedSong = {
      name: this.songName || 'Untitled Song',
      lines: this.lines,
      lastModified: new Date().toISOString(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(song, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private _importFromJSON(): void {
    const input = this.shadowRoot?.querySelector('.file-input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  private _loadSampleSong(): void {
    const sampleSong: SavedSong = {
      name: "Morning Coffee (Sample)",
      lastModified: new Date().toISOString(),
      lines: [
        {
          id: "line-sample-1",
          text: "Wake up to the sunrise glow",
          chords: [
            { id: "chord-1-1", name: "C", position: 0 },
            { id: "chord-1-2", name: "G", position: 60 }
          ],
          hasChordSection: false,
          x: 150,
          y: 100,
          rotation: -2,
          zIndex: 1
        },
        {
          id: "line-sample-2",
          text: "Pour a cup and take it slow",
          chords: [
            { id: "chord-2-1", name: "Am", position: 15 },
            { id: "chord-2-2", name: "F", position: 65 }
          ],
          hasChordSection: false,
          x: 160,
          y: 180,
          rotation: 1,
          zIndex: 2
        },
        {
          id: "line-sample-3",
          text: "Every morning feels brand new",
          chords: [
            { id: "chord-3-1", name: "C", position: 20 },
            { id: "chord-3-2", name: "G", position: 70 }
          ],
          hasChordSection: false,
          x: 140,
          y: 260,
          rotation: -1,
          zIndex: 3
        },
        {
          id: "line-sample-4",
          text: "Simple moments just me and you",
          chords: [
            { id: "chord-4-1", name: "Am", position: 25 },
            { id: "chord-4-2", name: "F", position: 55 },
            { id: "chord-4-3", name: "G", position: 85 }
          ],
          hasChordSection: false,
          x: 155,
          y: 340,
          rotation: 2,
          zIndex: 4
        },
        {
          id: "line-sample-5",
          text: "Morning coffee, warm and sweet",
          chords: [
            { id: "chord-5-1", name: "F", position: 10 },
            { id: "chord-5-2", name: "C", position: 60 }
          ],
          hasChordSection: false,
          x: 145,
          y: 450,
          rotation: -3,
          zIndex: 5
        },
        {
          id: "line-sample-6",
          text: "Makes my day feel complete",
          chords: [
            { id: "chord-6-1", name: "G", position: 15 },
            { id: "chord-6-2", name: "C", position: 70 }
          ],
          hasChordSection: false,
          x: 170,
          y: 530,
          rotation: 1,
          zIndex: 6
        }
      ]
    };

    this.songName = sampleSong.name;
    this.lines = sampleSong.lines;
    this.requestUpdate();
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
          this.songName = song.name || 'Imported Song';
          // Close all chord sections by default when loading
          this.lines = (song.lines || []).map(line => ({ ...line, hasChordSection: false }));
          this.requestUpdate();
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
              .value=${this.songName}
              @input=${(e: InputEvent) => this.songName = (e.target as HTMLInputElement).value}
            />
            <button class="btn btn-primary" @click=${this._saveSong}>Save</button>
            <button class="btn btn-secondary" @click=${() => this.showLoadDialog = true}>Load</button>
            <button class="btn btn-secondary" @click=${this._newSong}>New</button>
            <button class="btn btn-secondary" @click=${this._loadSampleSong}>Load Sample</button>
          </div>
        </div>

        <div class="controls">
          <form class="input-container" @submit=${this._addLine}>
            <input 
              type="text" 
              class="lyric-input" 
              placeholder="Enter a line of lyrics..."
              .value=${this.newLineText}
              @input=${(e: InputEvent) => this.newLineText = (e.target as HTMLInputElement).value}
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
            ${this.lines.length === 0 ? html`
              <div class="empty-state">
                <div class="empty-state-icon">✨</div>
                <h2>Start Creating</h2>
                <p>Add your first lyric line to begin</p>
              </div>
            ` : ''}
            
            ${this.lines.map(line => html`
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

          <div class="lyrics-panel" style="width: ${this.lyricsPanelWidth}px">
            <div class="lyrics-panel-header">
              <h2>📝 Song Lyrics</h2>
              <button class="copy-lyrics-btn" @click=${this._copyLyricsToClipboard} title="Copy all lyrics">📋</button>
            </div>
            <div class="lyrics-panel-content">
              ${this.lines.length === 0 ? html`
                <div class="lyrics-text empty">
                  No lyrics yet. Add lines and arrange them on the canvas to see your song here.
                </div>
              ` : html`
                <div class="lyrics-text">${this._getSortedLines().map(line => {
                  const chordLine = this._renderChordLine(line);
                  return html`<div class="lyric-line-with-chords">${chordLine ? html`<div class="chord-line">${chordLine}</div>` : ''}<div class="lyric-text-line">${'\u00A0\u00A0'}${line.text}${'  '}</div></div>`;
                })}</div>
              `}
            </div>
          </div>
        </div>
      </div>

      ${this.showLoadDialog ? html`
        <div class="dialog-overlay" @click=${() => this.showLoadDialog = false}>
          <div class="dialog" @click=${(e: MouseEvent) => e.stopPropagation()}>
            <h2>Load Song</h2>
            
            ${this.savedSongs.length === 0 ? html`
              <p style="color: #6b7280; text-align: center; padding: 40px 0;">
                No saved songs yet. Create and save your first song!
              </p>
            ` : html`
              <div class="song-list">
                ${this.savedSongs.map(song => html`
                  <div class="song-item" @click=${() => this._loadSong(song)}>
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
                <button class="btn btn-secondary" @click=${this._exportToJSON}>Export JSON</button>
              </div>
              <input type="file" class="file-input" accept=".json" @change=${this._handleFileImport} />
            </div>

            <div class="dialog-actions">
              <button class="btn btn-secondary" @click=${() => this.showLoadDialog = false}>Close</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);

