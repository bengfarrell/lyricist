import { LitElement, html, css } from 'lit';
import './lyric-line.js';
import { cursorManager } from './cursor-manager.js';

export class LyricistApp extends LitElement {
  static properties = {
    lines: { type: Array },
    songName: { type: String },
    savedSongs: { type: Array },
    showLoadDialog: { type: Boolean },
    newLineText: { type: String },
    lyricsPanelWidth: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      width: 95vw;
      height: 95vh;
      max-width: 1400px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .main-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .header-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .song-name-input {
      padding: 8px 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 16px;
      min-width: 200px;
    }

    .song-name-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .controls {
      padding: 20px 30px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .input-container {
      flex: 1;
      display: flex;
      gap: 10px;
    }

    .lyric-input {
      flex: 1;
      padding: 12px 20px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s ease;
    }

    .lyric-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .lyrics-panel {
      background: #f8f9fa;
      border-left: 2px solid #e9ecef;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex-shrink: 0;
    }

    .lyrics-panel-header {
      padding: 20px;
      background: white;
      border-bottom: 2px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .lyrics-panel-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .copy-lyrics-btn {
      padding: 8px 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 18px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .copy-lyrics-btn:hover {
      background: #5568d3;
      transform: translateY(-1px);
    }

    .copy-lyrics-btn.copied {
      background: #10b981;
    }

    .lyrics-panel-content {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
      overflow-x: auto;
      background: #fefce8;
      background-image: 
        repeating-linear-gradient(
          transparent,
          transparent 31px,
          #e5e7eb 31px,
          #e5e7eb 32px
        );
    }

    .lyrics-text {
      font-family: 'Courier New', 'Courier', monospace;
      font-size: 16px;
      color: #1f2937;
      padding-top: 1px;
      white-space: nowrap;
    }

    .lyrics-text.empty {
      color: #9ca3af;
      font-style: italic;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .lyric-line-with-chords {
      margin-bottom: 4px;
    }

    .chord-line {
      font-family: 'Courier New', 'Courier', monospace;
      font-size: 16px;
      font-weight: bold;
      color: #000;
      white-space: pre;
      line-height: 18px;
      position: relative;
      height: 18px;
      margin-bottom: 2px;
    }

    .lyric-text-line {
      font-family: 'Courier New', 'Courier', monospace;
      font-size: 16px;
      color: #1f2937;
      line-height: 16px;
    }

    .canvas {
      flex: 1;
      position: relative;
      background: linear-gradient(90deg, #f8f9fa 1px, transparent 1px),
                  linear-gradient(#f8f9fa 1px, transparent 1px);
      background-size: 40px 40px;
      overflow: hidden;
    }

    .empty-state {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #9ca3af;
    }

    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      font-size: 24px;
      margin: 0 0 10px 0;
      font-weight: 600;
    }

    .empty-state p {
      font-size: 16px;
      margin: 0;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }

    .dialog {
      background: white;
      border-radius: 16px;
      padding: 30px;
      min-width: 400px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    }

    .dialog h2 {
      margin: 0 0 20px 0;
      font-size: 24px;
      color: #333;
    }

    .song-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }

    .song-item {
      padding: 15px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .song-item:hover {
      border-color: #667eea;
      background: #f8f9fa;
    }

    .song-item-info {
      flex: 1;
    }

    .song-item-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    .song-item-meta {
      font-size: 14px;
      color: #6b7280;
    }

    .dialog-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .export-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .export-section h3 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #333;
    }

    .export-actions {
      display: flex;
      gap: 10px;
    }

    .file-input {
      display: none;
    }

    .panel-divider {
      width: 8px;
      background: #e9ecef;
      flex-shrink: 0;
      position: relative;
      transition: background 0.2s ease;
    }

    .panel-divider:hover {
      background: #d1d5db;
    }

    .panel-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 40px;
      background: #9ca3af;
      border-radius: 1px;
    }
  `;

  constructor() {
    super();
    this.lines = [];
    this.songName = '';
    this.savedSongs = [];
    this.showLoadDialog = false;
    this.newLineText = '';
    this.lyricsPanelWidth = 350;
    this._draggedLine = null;
    this._isDraggingDivider = false;
    this._loadSavedSongs();
    // Load sample song on startup for development
    this._loadSampleSong();
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundHandleMouseMove = this._handleMouseMove.bind(this);
    this._boundHandleMouseUp = this._handleMouseUp.bind(this);
    this._boundHandleDividerMove = this._handleDividerMove.bind(this);
    window.addEventListener('mousemove', this._boundHandleMouseMove);
    window.addEventListener('mouseup', this._boundHandleMouseUp);
    window.addEventListener('mousemove', this._boundHandleDividerMove);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._boundHandleMouseMove);
    window.removeEventListener('mouseup', this._boundHandleMouseUp);
    window.removeEventListener('mousemove', this._boundHandleDividerMove);
  }

  _loadSavedSongs() {
    const saved = localStorage.getItem('lyricist-songs');
    if (saved) {
      this.savedSongs = JSON.parse(saved);
    }
  }

  _saveSong() {
    if (!this.songName.trim()) {
      alert('Please enter a song name');
      return;
    }

    const song = {
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
    const btn = this.shadowRoot.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = '✓ Saved!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }

  _loadSong(song) {
    this.songName = song.name;
    // Close all chord sections by default when loading
    this.lines = song.lines.map(line => ({ ...line, hasChordSection: false }));
    this.showLoadDialog = false;
    this.requestUpdate();
  }

  _deleteSong(song, e) {
    e.stopPropagation();
    if (confirm(`Delete "${song.name}"?`)) {
      this.savedSongs = this.savedSongs.filter(s => s.name !== song.name);
      localStorage.setItem('lyricist-songs', JSON.stringify(this.savedSongs));
      this.requestUpdate();
    }
  }

  _newSong() {
    if (this.lines.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.songName = '';
    this.lines = [];
    this.requestUpdate();
  }

  _addLine(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector('.lyric-input');
    const text = input.value.trim();
    
    if (!text) return;

    const canvas = this.shadowRoot.querySelector('.canvas');
    const rect = canvas.getBoundingClientRect();
    
    // Generate a subtle random rotation between -5 and +5 degrees
    const rotation = (Math.random() * 10) - 5;
    
    const maxZ = this.lines.length > 0 ? Math.max(...this.lines.map(line => line.zIndex || 1)) : 0;
    
    const newLine = {
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

  _handleDragStart(e) {
    this._draggedLine = this.lines.find(line => line.id === e.detail.id);
    cursorManager.setCursor('move');
  }

  _handleBringToFront(e) {
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

  _handleMouseMove(e) {
    if (!this._draggedLine) return;

    const canvas = this.shadowRoot.querySelector('.canvas');
    const rect = canvas.getBoundingClientRect();

    const lineElement = this.shadowRoot.querySelector(`lyric-line[id="${this._draggedLine.id}"]`);
    if (!lineElement) return;

    // Calculate new position relative to canvas, accounting for where user clicked within the element
    const newX = e.clientX - rect.left - lineElement._offsetX;
    const newY = e.clientY - rect.top - lineElement._offsetY;

    // Update the line position
    this.lines = this.lines.map(line => 
      line.id === this._draggedLine.id 
        ? { ...line, x: newX, y: newY }
        : line
    );
  }

  _handleMouseUp() {
    if (this._draggedLine) {
      const lineElement = this.shadowRoot.querySelector(`lyric-line[id="${this._draggedLine.id}"]`);
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

  _handleDividerMouseDown(e) {
    e.preventDefault();
    this._isDraggingDivider = true;
    cursorManager.setCursor('ew-resize');
  }

  _handleDividerMove(e) {
    if (!this._isDraggingDivider) return;

    const container = this.shadowRoot.querySelector('.main-content');
    const rect = container.getBoundingClientRect();
    
    // Calculate new width from the right edge
    const newWidth = rect.right - e.clientX;
    
    // Constrain between 200px and 600px
    this.lyricsPanelWidth = Math.max(200, Math.min(600, newWidth));
  }

  _handleDeleteLine(e) {
    const lineId = e.detail.id;
    this.lines = this.lines.filter(line => line.id !== lineId);
  }

  _handleDuplicateLine(e) {
    const originalLine = this.lines.find(line => line.id === e.detail.id);
    if (!originalLine) return;

    // Create a duplicate with slight offset and new rotation
    const newLine = {
      ...originalLine,
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: originalLine.x + 30,
      y: originalLine.y + 30,
      rotation: (Math.random() * 10) - 5
    };

    this.lines = [...this.lines, newLine];
  }

  _getSortedLines() {
    return [...this.lines].sort((a, b) => a.y - b.y);
  }

  _renderChordLine(line) {
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

  _copyLyricsToClipboard() {
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
      const btn = this.shadowRoot.querySelector('.copy-lyrics-btn');
      const originalText = btn.textContent;
      btn.textContent = '✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 1500);
    });
  }

  _handleToggleChordSection(e) {
    const { id, hasChordSection } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === id ? { ...line, hasChordSection } : line
    );
  }

  _handleChordAdded(e) {
    const { lineId, chord } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { ...line, chords: [...(line.chords || []), chord] } : line
    );
  }

  _handleChordUpdated(e) {
    const { lineId, chordId, name } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { 
        ...line, 
        chords: line.chords.map(c => c.id === chordId ? { ...c, name } : c)
      } : line
    );
  }

  _handleChordDeleted(e) {
    const { lineId, chordId } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? { ...line, chords: line.chords.filter(c => c.id !== chordId) } : line
    );
  }

  _handleChordPositionChanged(e) {
    const { lineId, chordId, position } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === lineId ? {
        ...line,
        chords: line.chords.map(c => c.id === chordId ? { ...c, position } : c)
      } : line
    );
  }

  _handleTextChanged(e) {
    const { id, text } = e.detail;
    this.lines = this.lines.map(line => 
      line.id === id ? { ...line, text } : line
    );
    this._saveSong();
  }

  _exportToJSON() {
    const song = {
      name: this.songName || 'Untitled Song',
      lines: this.lines,
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

  _importFromJSON() {
    const input = this.shadowRoot.querySelector('.file-input');
    input.click();
  }

  _loadSampleSong() {
    const sampleSong = {
      name: "Morning Coffee (Sample)",
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
          rotation: -2
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
          rotation: 1
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
          rotation: -1
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
          rotation: 2
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
          rotation: -3
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
          rotation: 1
        }
      ]
    };

    this.songName = sampleSong.name;
    this.lines = sampleSong.lines;
    this.requestUpdate();
  }

  _handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const song = JSON.parse(e.target.result);
        this.songName = song.name || 'Imported Song';
        // Close all chord sections by default when loading
        this.lines = (song.lines || []).map(line => ({ ...line, hasChordSection: false }));
        this.requestUpdate();
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
              @input=${(e) => this.songName = e.target.value}
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
              @input=${(e) => this.newLineText = e.target.value}
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
          <div class="dialog" @click=${(e) => e.stopPropagation()}>
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
                    <button class="btn btn-danger" @click=${(e) => this._deleteSong(song, e)}>Delete</button>
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

