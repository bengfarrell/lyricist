import { LitElement, html, PropertyValues } from 'lit';
import { cursorManager } from '../cursor-manager/index';
import { lyricLineStyles } from './styles.css.ts';
import type { Chord } from '../store/types';

export type { Chord };

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
    selected: { type: Boolean },
    _showChordPicker: { type: Boolean, state: true },
    _pickerPosition: { type: Number, state: true },
    _editingChordId: { type: String, state: true },
    _isEditingText: { type: Boolean, state: true },
    _activeChordId: { type: String, state: true }
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
  selected: boolean = false;
  
  private _isDragging: boolean = false;
  private _startX: number = 0;
  private _startY: number = 0;
  _offsetX: number = 0;
  _offsetY: number = 0;
  private _pointerDownX: number = 0;
  private _pointerDownY: number = 0;
  private _hasMoved: boolean = false;
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
  private _chordDragOffsetX: number = 0;
  private _isEditingText: boolean = false;
  private _chordLibrary: ChordLibrary;
  private _activeChordId: string | null = null;
  
  private _boundHandleClickOutside?: (e: Event) => void;
  private _boundHandleClosePickerEvent?: (e: Event) => void;
  private _boundHandleChordDragMove?: (e: PointerEvent) => void;
  private _boundHandleChordDragEnd?: (e: PointerEvent) => void;
  private _boundHandleKeyDown?: (e: KeyboardEvent) => void;
  private _boundHandlePointerUp?: (e: PointerEvent) => void;

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
    if (changedProperties.has('selected')) {
      this.updateSelectedState();
    }
  }

  updateSelectedState(): void {
    if (this.selected) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
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

  private _handlePointerDown(e: PointerEvent): void {
    // Don't start dragging if editing text, clicking buttons, or clicking on editable text
    const target = e.target as HTMLElement;
    
    // If we're already editing text, completely ignore pointer events
    if (this._isEditingText) {
      e.stopPropagation();
      return;
    }
    
    if (target.classList.contains('action-btn') || 
        target.classList.contains('lyric-text-input') ||
        target.classList.contains('chord-toggle-btn')) {
      return;
    }

    // Track initial pointer position for tap detection
    this._pointerDownX = e.clientX;
    this._pointerDownY = e.clientY;
    this._hasMoved = false;

    // Select this line
    this.dispatchEvent(new CustomEvent('line-selected', {
      detail: { id: this.id, shiftKey: e.shiftKey },
      bubbles: true,
      composed: true
    }));

    // Bring this line to front
    this.dispatchEvent(new CustomEvent('bring-to-front', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));

    // Mark as potentially dragging, but DON'T dispatch drag-start yet
    // We'll wait to see if this is a drag or a tap
    this._isDragging = true;
    
    // Store the offset between pointer and element position
    const rect = this.getBoundingClientRect();
    this._offsetX = e.clientX - rect.left;
    this._offsetY = e.clientY - rect.top;
  }

  private _handlePointerUp(e: PointerEvent): void {
    // Only handle if this line was being interacted with
    if (!this._isDragging) return;
    
    // Calculate how much the pointer moved
    const deltaX = Math.abs(e.clientX - this._pointerDownX);
    const deltaY = Math.abs(e.clientY - this._pointerDownY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Reset dragging state
    this._isDragging = false;
    this.removeAttribute('dragging');
    
    // If pointer didn't move much (less than 5px), treat it as a tap
    if (distance < 5) {
      // Check if the pointer is over this line's text area
      const composedPath = e.composedPath();
      const isOverThisLine = composedPath.includes(this);
      
      if (!isOverThisLine) return;
      
      const target = e.target as HTMLElement;
      // Don't activate editing if clicking on buttons
      if (target.classList.contains('action-btn') || 
          target.classList.contains('chord-toggle-btn')) {
        return;
      }
      
      // On touch devices (pointerType === 'touch'), activate editing with a tap
      if (e.pointerType === 'touch') {
        this._isEditingText = true;
        this.setAttribute('editing-text', '');
        
        // Let the browser handle focus naturally - don't force it
        // The input will appear and user can tap it again if needed
        this.requestUpdate();
        return;
      }
    }
  }

  private _handleDoubleClick(e: MouseEvent): void {
    // Don't start editing if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.classList.contains('action-btn') || target.classList.contains('chord-toggle-btn')) {
      return;
    }

    e.stopPropagation();
    this._isEditingText = true;
    this.setAttribute('editing-text', '');
    
    // Focus the input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('.lyric-text-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }
  
  // Public method to programmatically start editing
  focusTextarea(): void {
    this._isEditingText = true;
    this.setAttribute('editing-text', '');
    
    // Focus the input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('.lyric-text-input') as HTMLInputElement;
      if (input) {
        input.focus();
        if (this.text) {
          input.select();
        }
      }
    });
  }

  private _handleTextBlur(e: FocusEvent): void {
    const target = e.target as HTMLInputElement;
    const newText = target.value?.trim();
    if (newText && newText !== this.text) {
      this.dispatchEvent(new CustomEvent('text-changed', {
        detail: { id: this.id, text: newText },
        bubbles: true,
        composed: true
      }));
    }
    this._isEditingText = false;
    this.removeAttribute('editing-text');
  }

  private _handleTextKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._isEditingText = false;
      this.removeAttribute('editing-text');
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

  private _handleChordMarkerPointerDown(e: PointerEvent, chord: Chord): void {
    e.stopPropagation();
    
    // Set this chord as active for keyboard control
    this._activeChordId = chord.id;
    
    // Check if picker is open for this chord
    const pickerWasOpen = this._showChordPicker && this._editingChordId === chord.id;
    
    // Calculate where the user clicked relative to the chord's position
    const chordSection = this.shadowRoot?.querySelector('.chord-section');
    if (chordSection) {
      const rect = chordSection.getBoundingClientRect();
      const chordPositionPx = (chord.position / 100) * rect.width;
      const clickOffsetFromChordCenter = e.clientX - (rect.left + chordPositionPx);
      this._chordDragOffsetX = clickOffsetFromChordCenter;
    }
    
    this._draggedChordId = chord.id;
    this._dragStartX = e.clientX;
    this._chordDragStarted = false;
    this._pickerWasOpenBeforeDrag = pickerWasOpen;
  }

  private _handleChordDragMove(e: PointerEvent): void {
    if (!this._draggedChordId) return;
    
    const dragDistance = Math.abs(e.clientX - this._dragStartX);
    
    // If moved more than 5px, mark as drag (not a click) for UI purposes
    if (dragDistance > 5 && !this._chordDragStarted) {
      this._chordDragStarted = true;
      this._showChordPicker = false;
      this._editingChordId = null;
      // Set global cursor to horizontal resize
      cursorManager.setCursor('ew-resize');
      // Add attribute to all lyric lines to suppress hover effects
      // The parent is the .canvas div, all lyric-line elements are siblings
      const canvasDiv = this.parentElement;
      
      if (canvasDiv) {
        const allLines = canvasDiv.querySelectorAll('lyric-line');
        allLines.forEach(line => {
          line.setAttribute('chord-drag-active', '');
        });
      }
    }
    
    // Always update position while pointer is moving, regardless of threshold
    const chordSection = this.shadowRoot?.querySelector('.chord-section');
    if (!chordSection) return;
    
    const rect = chordSection.getBoundingClientRect();
    // Subtract the offset so the chord center follows the pointer properly
    const relativeX = e.clientX - rect.left - this._chordDragOffsetX;
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

  private _handleChordDragEnd(e: PointerEvent): void {
    if (!this._draggedChordId) return;
    
    const chord = this.chords.find(c => c.id === this._draggedChordId);
    const wasDragged = this._chordDragStarted;
    const pickerWasOpen = this._pickerWasOpenBeforeDrag;
    
    // Reset cursor and remove drag attribute if we were dragging
    if (wasDragged) {
      cursorManager.clearCursor();
      // Remove attribute from all lyric lines to restore hover effects
      const canvasDiv = this.parentElement;
      
      if (canvasDiv) {
        const allLines = canvasDiv.querySelectorAll('lyric-line');
        allLines.forEach(line => {
          line.removeAttribute('chord-drag-active');
        });
      }
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
    this._chordDragOffsetX = 0;
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

  private _handleKeyDown(e: KeyboardEvent): void {
    // Only handle keyboard if we have an active chord and not editing text
    if (!this._activeChordId || this._isEditingText) return;
    
    const chord = this.chords.find(c => c.id === this._activeChordId);
    if (!chord) return;
    
    let delta = 0;
    
    if (e.key === 'ArrowLeft') {
      delta = -0.5; // Move left by 0.5%
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      delta = 0.5; // Move right by 0.5%
      e.preventDefault();
    }
    
    if (delta !== 0) {
      const newPosition = Math.max(0, Math.min(100, chord.position + delta));
      
      this.dispatchEvent(new CustomEvent('chord-position-changed', {
        detail: { 
          lineId: this.id, 
          chordId: this._activeChordId, 
          position: newPosition 
        },
        bubbles: true,
        composed: true
      }));
    }
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
    this.updateSelectedState();
    this._boundHandleClickOutside = this._handleClickOutside.bind(this);
    this._boundHandleClosePickerEvent = this._handleClosePickerEvent.bind(this);
    this._boundHandleChordDragMove = this._handleChordDragMove.bind(this);
    this._boundHandleChordDragEnd = this._handleChordDragEnd.bind(this);
    this._boundHandleKeyDown = this._handleKeyDown.bind(this);
    this._boundHandlePointerUp = this._handlePointerUp.bind(this);
    document.addEventListener('click', this._boundHandleClickOutside);
    document.addEventListener('close-chord-picker', this._boundHandleClosePickerEvent);
    document.addEventListener('pointermove', this._boundHandleChordDragMove);
    document.addEventListener('pointerup', this._boundHandleChordDragEnd);
    document.addEventListener('keydown', this._boundHandleKeyDown);
    window.addEventListener('pointerup', this._boundHandlePointerUp);
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
      document.removeEventListener('pointermove', this._boundHandleChordDragMove);
    }
    if (this._boundHandleChordDragEnd) {
      document.removeEventListener('pointerup', this._boundHandleChordDragEnd);
    }
    if (this._boundHandleKeyDown) {
      document.removeEventListener('keydown', this._boundHandleKeyDown);
    }
    if (this._boundHandlePointerUp) {
      window.removeEventListener('pointerup', this._boundHandlePointerUp);
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
        @pointerdown=${this._isEditingText ? null : this._handlePointerDown}
        @dblclick=${this._isEditingText ? null : this._handleDoubleClick}
      >
        ${this.hasChordSection ? html`
          <div 
            class="chord-section"
            @click=${this._handleChordSectionClick}
            @pointerdown=${(e: PointerEvent) => e.stopPropagation()}
          >
            ${this.chords.length === 0 ? html`
              <div class="chord-section-hint">Click to add chords</div>
            ` : ''}
            
            <div class="chord-markers">
              ${this.chords.map(chord => html`
                <div 
                  class="chord-marker ${chord.id === this._activeChordId ? 'active' : ''}" 
                  style="left: ${chord.position}%"
                  @pointerdown=${(e: PointerEvent) => this._handleChordMarkerPointerDown(e, chord)}
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
            <input 
              type="text"
              class="lyric-text-input"
              inputmode="text"
              spellcheck="true"
              .value=${this.text}
              @blur=${this._handleTextBlur}
              @keydown=${this._handleTextKeyDown}
            />
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

