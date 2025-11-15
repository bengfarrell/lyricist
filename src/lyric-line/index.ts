import { LitElement, html, PropertyValues } from 'lit';
import { cursorManager } from '../cursor-manager/index.js';
import { lyricLineStyles } from './styles.css.js';

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

  static styles = lyricLineStyles;

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

