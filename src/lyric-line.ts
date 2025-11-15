import { LitElement, html, css, PropertyValues } from 'lit';
import { cursorManager } from './cursor-manager.js';

export interface Chord {
  id: string;
  name: string;
  position: number;
}

interface ChordLibrary {
  [category: string]: string[];
}

export class LyricLine extends LitElement {
  static properties = {
    text: { type: String },
    chords: { type: Array },
    hasChordSection: { type: Boolean },
    x: { type: Number },
    y: { type: Number },
    id: { type: String },
    rotation: { type: Number },
    zIndex: { type: Number },
    _showChordPicker: { type: Boolean, state: true },
    _pickerPosition: { type: Number, state: true },
    _editingChordId: { type: String, state: true },
    _draggedChordId: { type: String, state: true },
    _chordDragStarted: { type: Boolean, state: true },
    _isEditingText: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      position: absolute;
      user-select: none;
      z-index: 1;
    }

    :host([dragging]) {
      z-index: 1000;
      opacity: 0.8;
    }

    .container {
      display: inline-block;
    }

    .chord-section {
      position: absolute;
      bottom: 100%;
      margin-bottom: 8px;
      left: 0;
      right: 0;
      background: transparent;
      padding: 0;
      border-radius: 0;
      border: none;
      transition: all 0.2s ease;
    }

    .chord-section:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    .chord-section-hint {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #9ca3af;
      font-size: 14px;
      opacity: 0.7;
      pointer-events: none;
      font-style: italic;
    }

    .chord-markers {
      position: relative;
      width: 100%;
      height: 26px;
    }

    .chord-marker {
      position: absolute;
      background: #000;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      color: white;
      transform: translateX(-50%);
      white-space: nowrap;
      border: 2px solid #000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .chord-marker:hover {
      background: #374151;
      border-color: #374151;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .chord-marker::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 8px;
      background: #000;
    }

    .chord-picker {
      position: fixed;
      background: white;
      border: 2px solid #000;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      padding: 16px;
      z-index: 100000;
      overflow-y: auto;
      width: 240px;
      max-height: 400px;
    }

    .chord-picker-group {
      margin-bottom: 12px;
    }

    .chord-picker-group:last-child {
      margin-bottom: 0;
    }

    .chord-picker-label {
      font-size: 11px;
      font-weight: 700;
      color: #000;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .chord-picker-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }

    .chord-option {
      padding: 6px 8px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      color: #000;
      transition: all 0.15s ease;
    }

    .chord-option:hover {
      background: #000;
      color: white;
      border-color: #000;
      transform: scale(1.05);
    }

    .chord-delete-btn {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ef4444;
      color: white;
      border: 1px solid white;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .chord-marker:hover .chord-delete-btn {
      display: flex;
    }

    .chord-delete-btn:hover {
      background: #dc2626;
    }

    .lyric-line {
      background: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
      font-size: 18px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      transition: box-shadow 0.2s ease, transform 0.1s ease;
      position: relative;
      display: inline-block;
    }

    :host(:hover) .lyric-line {
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    :host([dragging]) .lyric-line {
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
    }

    .lyric-text-editable {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 4px;
      padding: 2px 4px;
      margin: -2px -4px;
      display: inline-block;
      min-width: 100px;
      user-select: text;
    }

    .lyric-text-editable:focus {
      outline: 2px solid #667eea;
      user-select: text;
    }

    .action-btn {
      position: absolute;
      bottom: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      color: white;
      border: 2px solid white;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    :host(:hover) .action-btn {
      display: flex;
    }

    .delete-btn {
      right: -8px;
      background: #ef4444;
    }

    .delete-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .duplicate-btn {
      left: -8px;
      background: #3b82f6;
    }

    .duplicate-btn:hover {
      background: #2563eb;
      transform: scale(1.1);
    }

    .chord-toggle-btn {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: #000;
      color: white;
      border: 2px solid white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    :host(:hover) .chord-toggle-btn {
      display: flex;
    }

    .chord-toggle-btn:hover {
      background: #374151;
      transform: translateX(-50%) scale(1.1);
    }
  `;

  text: string = '';
  chords: Chord[] = [];
  hasChordSection: boolean = false;
  x: number = 0;
  y: number = 0;
  id: string = '';
  rotation: number = 0;
  zIndex: number = 1;
  
  private _isDragging: boolean = false;
  private _startX: number = 0;
  private _startY: number = 0;
  _offsetX: number = 0;
  _offsetY: number = 0;
  private _showChordPicker: boolean = false;
  private _pickerPosition: number = 0;
  private _editingChordId: string | null = null;
  private _pickerX: number = 0;
  private _pickerY: number = 0;
  private _pickerHeight: number = 500;
  private _isDraggingChord: boolean = false;
  private _draggedChordId: string | null = null;
  private _dragStartX: number = 0;
  private _chordDragStarted: boolean = false;
  private _pickerWasOpenBeforeDrag: boolean = false;
  private _isEditingText: boolean = false;
  private _chordLibrary: ChordLibrary;
  
  private _boundHandleClickOutside?: (e: Event) => void;
  private _boundHandleClosePickerEvent?: (e: Event) => void;
  private _boundHandleChordDragMove?: (e: MouseEvent) => void;
  private _boundHandleChordDragEnd?: (e: MouseEvent) => void;

  constructor() {
    super();
    
    // Complete chord library
    this._chordLibrary = {
      'Major': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      'Minor': ['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'],
      '7th': ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'],
      'Major 7': ['Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'],
      'Minor 7': ['Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7'],
      'Sus': ['Csus2', 'Csus4', 'Dsus2', 'Dsus4', 'Esus2', 'Esus4', 'Fsus2', 'Fsus4', 'Gsus2', 'Gsus4', 'Asus2', 'Asus4', 'Bsus2', 'Bsus4'],
      'Dim/Aug': ['Cdim', 'Ddim', 'Edim', 'Fdim', 'Gdim', 'Adim', 'Bdim', 'Caug', 'Daug', 'Eaug', 'Faug', 'Gaug', 'Aaug', 'Baug']
    };
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('x') || changedProperties.has('y') || changedProperties.has('rotation') || changedProperties.has('zIndex')) {
      this.updatePosition();
    }
  }

  updatePosition(): void {
    // Position is relative to the lyric line, not the container
    this.style.left = `${this.x}px`;
    this.style.top = `${this.y}px`;
    this.style.transform = `rotate(${this.rotation}deg)`;
    this.style.transformOrigin = 'top left';
    this.style.zIndex = this.zIndex.toString();
  }

  private _handleMouseDown(e: MouseEvent): void {
    // Don't start dragging if editing text, clicking buttons, or clicking on editable text
    const target = e.target as HTMLElement;
    if (target.classList.contains('action-btn') || 
        target.classList.contains('lyric-text-editable') ||
        this._isEditingText) {
      return;
    }

    // Bring this line to front
    this.dispatchEvent(new CustomEvent('bring-to-front', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));

    this._isDragging = true;
    this.setAttribute('dragging', '');
    
    // Store the offset between mouse and element position
    const rect = this.getBoundingClientRect();
    this._offsetX = e.clientX - rect.left;
    this._offsetY = e.clientY - rect.top;

    this.dispatchEvent(new CustomEvent('drag-start', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleDoubleClick(e: MouseEvent): void {
    // Don't start editing if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.classList.contains('action-btn') || target.classList.contains('chord-toggle-btn')) {
      return;
    }

    e.stopPropagation();
    this._isEditingText = true;
    
    // Focus the editable span after render
    this.updateComplete.then(() => {
      const editableSpan = this.shadowRoot?.querySelector('.lyric-text-editable') as HTMLElement;
      if (editableSpan) {
        editableSpan.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(editableSpan);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  }

  private _handleTextBlur(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    const newText = target.textContent?.trim();
    if (newText && newText !== this.text) {
      this.dispatchEvent(new CustomEvent('text-changed', {
        detail: { id: this.id, text: newText },
        bubbles: true,
        composed: true
      }));
    }
    this._isEditingText = false;
  }

  private _handleTextKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._isEditingText = false;
    }
  }

  private _handleDelete(e: MouseEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('delete-line', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleDuplicate(e: MouseEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('duplicate-line', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleToggleChordSection(e: MouseEvent): void {
    e.stopPropagation();
    
    // If the chord section is open and picker is showing, close the picker
    if (this.hasChordSection && this._showChordPicker) {
      this._showChordPicker = false;
      return;
    }
    
    this.dispatchEvent(new CustomEvent('toggle-chord-section', {
      detail: { id: this.id, hasChordSection: !this.hasChordSection },
      bubbles: true,
      composed: true
    }));
  }

  private _handleChordSectionClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target.closest('.chord-picker')) {
      return;
    }
    
    e.stopPropagation();
    
    // Bring this line to front
    this.dispatchEvent(new CustomEvent('bring-to-front', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentPosition = (clickX / rect.width) * 100;
    
    this._pickerPosition = percentPosition;
    this._editingChordId = null;
    this._showChordPicker = true;
    this._calculatePickerPosition();
  }

  private _handleChordMarkerMouseDown(e: MouseEvent, chord: Chord): void {
    e.stopPropagation();
    
    // Check if picker is open for this chord
    const pickerWasOpen = this._showChordPicker && this._editingChordId === chord.id;
    
    this._draggedChordId = chord.id;
    this._dragStartX = e.clientX;
    this._chordDragStarted = false;
    this._pickerWasOpenBeforeDrag = pickerWasOpen;
  }

  private _handleChordDragMove(e: MouseEvent): void {
    if (!this._draggedChordId) return;
    
    const dragDistance = Math.abs(e.clientX - this._dragStartX);
    
    // If moved more than 5px, consider it a drag
    if (dragDistance > 5) {
      if (!this._chordDragStarted) {
        // First time we're starting a drag - close picker and mark as dragging
        this._chordDragStarted = true;
        this._showChordPicker = false;
        this._editingChordId = null;
        // Set global cursor to horizontal resize
        cursorManager.setCursor('ew-resize');
      }
      
      const chordSection = this.shadowRoot?.querySelector('.chord-section');
      if (!chordSection) return;
      
      const rect = chordSection.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const newPosition = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      
      // Update chord position
      this.dispatchEvent(new CustomEvent('chord-position-changed', {
        detail: { 
          lineId: this.id, 
          chordId: this._draggedChordId, 
          position: newPosition 
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _handleChordDragEnd(e: MouseEvent): void {
    if (!this._draggedChordId) return;
    
    const chord = this.chords.find(c => c.id === this._draggedChordId);
    const wasDragged = this._chordDragStarted;
    const pickerWasOpen = this._pickerWasOpenBeforeDrag;
    
    // Reset cursor if we were dragging
    if (wasDragged) {
      cursorManager.clearCursor();
    }
    
    // Only toggle picker if it was a click (not a drag)
    if (!wasDragged && chord) {
      // If picker was open for this chord, close it
      if (pickerWasOpen) {
        this._showChordPicker = false;
        this._editingChordId = null;
      } else {
        // Open the picker
        this._pickerPosition = chord.position;
        this._editingChordId = chord.id;
        this._showChordPicker = true;
        this._calculatePickerPosition();
      }
    }
    
    this._draggedChordId = null;
    this._chordDragStarted = false;
    this._pickerWasOpenBeforeDrag = false;
  }

  private _calculatePickerPosition(): void {
    // Find the canvas element to position relative to it
    const canvas = document.querySelector('.canvas');
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      // Position in upper right corner with some padding
      this._pickerX = canvasRect.right - 260; // 240px width + 20px padding
      this._pickerY = canvasRect.top + 20;
      this._pickerHeight = canvasRect.height - 40; // Full height minus padding
    }
  }

  private _handleChordSelect(chordName: string): void {
    if (this._editingChordId) {
      // Update existing chord
      this.dispatchEvent(new CustomEvent('chord-updated', {
        detail: { lineId: this.id, chordId: this._editingChordId, name: chordName },
        bubbles: true,
        composed: true
      }));
    } else {
      // Add new chord
      const newChord: Chord = {
        id: `chord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: chordName,
        position: this._pickerPosition
      };
      
      this.dispatchEvent(new CustomEvent('chord-added', {
        detail: { lineId: this.id, chord: newChord },
        bubbles: true,
        composed: true
      }));
    }
    
    this._showChordPicker = false;
    this._editingChordId = null;
  }

  private _handleDeleteChord(e: MouseEvent, chordId: string): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('chord-deleted', {
      detail: { lineId: this.id, chordId },
      bubbles: true,
      composed: true
    }));
  }

  private _handleClickOutside(e: Event): void {
    const picker = this.shadowRoot?.querySelector('.chord-picker');
    if (!picker) return;
    
    // Close if clicking outside the picker
    if (!(e as Event & { composedPath: () => EventTarget[] }).composedPath().includes(picker)) {
      this._showChordPicker = false;
    }
  }

  private _handlePickerClick(e: MouseEvent): void {
    // Close if clicking on the picker background (not on an option)
    const target = e.target as HTMLElement;
    if (target.classList.contains('chord-picker') || 
        target.classList.contains('chord-picker-group') ||
        target.classList.contains('chord-picker-label') ||
        target.classList.contains('chord-picker-options')) {
      this._showChordPicker = false;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updatePosition();
    this._boundHandleClickOutside = this._handleClickOutside.bind(this);
    this._boundHandleClosePickerEvent = this._handleClosePickerEvent.bind(this);
    this._boundHandleChordDragMove = this._handleChordDragMove.bind(this);
    this._boundHandleChordDragEnd = this._handleChordDragEnd.bind(this);
    document.addEventListener('click', this._boundHandleClickOutside);
    document.addEventListener('close-chord-picker', this._boundHandleClosePickerEvent);
    document.addEventListener('mousemove', this._boundHandleChordDragMove);
    document.addEventListener('mouseup', this._boundHandleChordDragEnd);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundHandleClickOutside) {
      document.removeEventListener('click', this._boundHandleClickOutside);
    }
    if (this._boundHandleClosePickerEvent) {
      document.removeEventListener('close-chord-picker', this._boundHandleClosePickerEvent);
    }
    if (this._boundHandleChordDragMove) {
      document.removeEventListener('mousemove', this._boundHandleChordDragMove);
    }
    if (this._boundHandleChordDragEnd) {
      document.removeEventListener('mouseup', this._boundHandleChordDragEnd);
    }
    
    // Clean up cursor if we were dragging
    if (this._chordDragStarted) {
      cursorManager.clearCursor();
    }
  }

  private _handleClosePickerEvent(e: Event): void {
    // Close picker if the event is for a different line
    const customEvent = e as CustomEvent;
    if (customEvent.detail && customEvent.detail.exceptId !== this.id) {
      this._showChordPicker = false;
    }
  }

  render() {
    return html`
      <div 
        class="container"
        @mousedown=${this._handleMouseDown}
        @dblclick=${this._handleDoubleClick}
      >
        ${this.hasChordSection ? html`
          <div 
            class="chord-section"
            @click=${this._handleChordSectionClick}
            @mousedown=${(e: MouseEvent) => e.stopPropagation()}
          >
            ${this.chords.length === 0 ? html`
              <div class="chord-section-hint">Click to add chords</div>
            ` : ''}
            
            <div class="chord-markers">
              ${this.chords.map(chord => html`
                <div 
                  class="chord-marker" 
                  style="left: ${chord.position}%"
                  @mousedown=${(e: MouseEvent) => this._handleChordMarkerMouseDown(e, chord)}
                  @click=${(e: MouseEvent) => e.stopPropagation()}
                >
                  ${chord.name}
                  <div class="chord-delete-btn" @click=${(e: MouseEvent) => this._handleDeleteChord(e, chord.id)}>×</div>
                </div>
              `)}
            </div>

            ${this._showChordPicker ? html`
              <div 
                class="chord-picker" 
                style="left: ${this._pickerX}px; top: ${this._pickerY}px;"
                @click=${this._handlePickerClick}
              >
                ${Object.entries(this._chordLibrary).map(([category, chords]) => html`
                  <div class="chord-picker-group">
                    <div class="chord-picker-label">${category}</div>
                    <div class="chord-picker-options">
                      ${chords.map(chord => html`
                        <div class="chord-option" @click=${() => this._handleChordSelect(chord)}>
                          ${chord}
                        </div>
                      `)}
                    </div>
                  </div>
                `)}
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="lyric-line">
          ${this._isEditingText ? html`
            <span 
              class="lyric-text-editable"
              contenteditable="true"
              @blur=${this._handleTextBlur}
              @keydown=${this._handleTextKeyDown}
            >${this.text}</span>
          ` : this.text}
          <button class="action-btn duplicate-btn" @click=${this._handleDuplicate}>⊕</button>
          <button class="chord-toggle-btn" @click=${this._handleToggleChordSection}>
            ${this.hasChordSection ? '−' : '♪'}
          </button>
          <button class="action-btn delete-btn" @click=${this._handleDelete}>×</button>
        </div>
      </div>
    `;
  }
}

customElements.define('lyric-line', LyricLine);

