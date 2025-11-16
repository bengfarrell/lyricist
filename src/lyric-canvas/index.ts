import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../store/index';
import type { LyricLine, CanvasItem } from '../store/index';
import { cursorManager } from '../cursor-manager/index';
import '../lyric-line/index.js';
import '../lyric-group/index.js';
import { lyricCanvasStyles } from './styles.css.ts';

/**
 * Canvas component for displaying and interacting with draggable lyric lines
 */
export class LyricCanvas extends LitElement {
  static styles = lyricCanvasStyles;
  
  private store = new SongStoreController(this);
  
  private _draggedItem: CanvasItem | null = null;
  private _boundHandleMouseMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;
  
  // Selection box state
  private _isSelectionBoxActive: boolean = false;
  private _selectionBoxStart: { x: number; y: number } | null = null;
  private _selectionBoxEnd: { x: number; y: number } | null = null;
  
  // Click detection for adding lines
  private _canvasMouseDownPos: { x: number; y: number } | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._boundHandleMouseMove = this._handleMouseMove.bind(this);
    this._boundHandleMouseUp = this._handleMouseUp.bind(this);
    window.addEventListener('mousemove', this._boundHandleMouseMove);
    window.addEventListener('mouseup', this._boundHandleMouseUp);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundHandleMouseMove) {
      window.removeEventListener('mousemove', this._boundHandleMouseMove);
    }
    if (this._boundHandleMouseUp) {
      window.removeEventListener('mouseup', this._boundHandleMouseUp);
    }
  }

  private _handleDragStart(e: CustomEvent): void {
    const item = this.store.items.find(item => item.id === e.detail.id);
    if (item) {
      this._draggedItem = item;
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
    // Handle item dragging
    if (this._draggedItem) {
      const canvas = this.shadowRoot?.querySelector('.canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();

      const elementSelector = this._draggedItem.type === 'line' ? 'lyric-line' : 'lyric-group';
      const itemElement = this.shadowRoot?.querySelector(`${elementSelector}[id="${this._draggedItem.id}"]`) as any;
      if (!itemElement) return;

      // Calculate new position relative to canvas, accounting for where user clicked within the element
      const newX = e.clientX - rect.left - itemElement._offsetX;
      const newY = e.clientY - rect.top - itemElement._offsetY;

      this.store.updateLinePosition(this._draggedItem.id, newX, newY);
      return;
    }
    
    // Handle selection box
    if (this._isSelectionBoxActive && this._selectionBoxStart) {
      const canvas = this.shadowRoot?.querySelector('.canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      this._selectionBoxEnd = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Update selection in real-time
      this._updateSelectionFromBox(e.shiftKey);
      this.requestUpdate();
    }
  }

  private _handleMouseUp(e: MouseEvent): void {
    // Handle item drag end
    if (this._draggedItem) {
      const elementSelector = this._draggedItem.type === 'line' ? 'lyric-line' : 'lyric-group';
      const itemElement = this.shadowRoot?.querySelector(`${elementSelector}[id="${this._draggedItem.id}"]`);
      if (itemElement) {
        itemElement.removeAttribute('dragging');
      }
      this._draggedItem = null;
      cursorManager.clearCursor();
    }
    
    // Handle selection box end or click to add line
    if (this._isSelectionBoxActive && this._canvasMouseDownPos) {
      const canvas = this.shadowRoot?.querySelector('.canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseUpX = e.clientX - rect.left;
        const mouseUpY = e.clientY - rect.top;
        
        // Calculate distance between mousedown and mouseup
        const dx = mouseUpX - this._canvasMouseDownPos.x;
        const dy = mouseUpY - this._canvasMouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If distance is small (less than 5 pixels), it's a click, not a drag
        const CLICK_THRESHOLD = 5;
        
        if (distance < CLICK_THRESHOLD) {
          // It's a click - add a new line at this position
          this._addLineAtPosition(this._canvasMouseDownPos.x, this._canvasMouseDownPos.y);
        } else {
          // It's a drag - complete the selection box
          this._updateSelectionFromBox(e.shiftKey);
        }
      }
      
      this._isSelectionBoxActive = false;
      this._selectionBoxStart = null;
      this._selectionBoxEnd = null;
      this._canvasMouseDownPos = null;
      this.requestUpdate();
    }
  }
  
  private _updateSelectionFromBox(shiftKey: boolean): void {
    if (!this._selectionBoxStart || !this._selectionBoxEnd) return;
    
    const box = this._getSelectionBoxRect();
    const selectedIds: string[] = [];
    
    // Check which items intersect with the selection box
    this.store.items.forEach(item => {
      const elementSelector = item.type === 'line' ? 'lyric-line' : 'lyric-group';
      const itemElement = this.shadowRoot?.querySelector(`${elementSelector}[id="${item.id}"]`) as HTMLElement;
      if (!itemElement) return;
      
      const itemRect = itemElement.getBoundingClientRect();
      const canvas = this.shadowRoot?.querySelector('.canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      
      // Convert to canvas-relative coordinates
      const itemBox = {
        left: itemRect.left - canvasRect.left,
        top: itemRect.top - canvasRect.top,
        right: itemRect.right - canvasRect.left,
        bottom: itemRect.bottom - canvasRect.top
      };
      
      // Check for intersection
      if (this._boxesIntersect(box, itemBox)) {
        selectedIds.push(item.id);
      }
    });
    
    if (shiftKey) {
      // Add to existing selection
      const currentSelection = Array.from(this.store.selectedLineIds);
      const combined = [...new Set([...currentSelection, ...selectedIds])];
      this.store.setSelectedLineIds(combined);
    } else {
      // Replace selection
      this.store.setSelectedLineIds(selectedIds);
    }
  }
  
  private _getSelectionBoxRect(): { left: number; top: number; right: number; bottom: number } {
    if (!this._selectionBoxStart || !this._selectionBoxEnd) {
      return { left: 0, top: 0, right: 0, bottom: 0 };
    }
    
    return {
      left: Math.min(this._selectionBoxStart.x, this._selectionBoxEnd.x),
      top: Math.min(this._selectionBoxStart.y, this._selectionBoxEnd.y),
      right: Math.max(this._selectionBoxStart.x, this._selectionBoxEnd.x),
      bottom: Math.max(this._selectionBoxStart.y, this._selectionBoxEnd.y)
    };
  }
  
  private _boxesIntersect(
    box1: { left: number; top: number; right: number; bottom: number },
    box2: { left: number; top: number; right: number; bottom: number }
  ): boolean {
    return !(
      box1.right < box2.left ||
      box1.left > box2.right ||
      box1.bottom < box2.top ||
      box1.top > box2.bottom
    );
  }

  private _handleDeleteLine(e: CustomEvent): void {
    this.store.deleteLine(e.detail.id);
  }

  private _handleDuplicateLine(e: CustomEvent): void {
    this.store.duplicateLine(e.detail.id);
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
    // Auto-save on text change
    this.store.saveSong();
  }

  private _handleLineSelected(e: CustomEvent): void {
    const { id, shiftKey } = e.detail;
    
    if (shiftKey) {
      // Shift is held: toggle selection
      this.store.toggleLineSelection(id);
    } else {
      // Shift not held: clear selection and select only this line
      this.store.selectLine(id);
    }
  }
  
  private _handleGroupSelected(e: CustomEvent): void {
    const { id, shiftKey } = e.detail;
    
    if (shiftKey) {
      // Shift is held: toggle selection
      this.store.toggleLineSelection(id);
    } else {
      // Shift not held: clear selection and select only this group
      this.store.selectLine(id);
    }
  }
  
  private _handleDeleteGroup(e: CustomEvent): void {
    this.store.deleteGroup(e.detail.id);
  }
  
  private _handleDuplicateGroup(e: CustomEvent): void {
    this.store.duplicateLine(e.detail.id); // This already handles groups
  }

  private _handleUngroupGroup(e: CustomEvent): void {
    this.store.ungroupGroup(e.detail.id);
  }
  
  private _addLineAtPosition(x: number, y: number): void {
    const maxZ = this.store.items.length > 0 
      ? Math.max(...this.store.items.map(item => item.zIndex || 1)) 
      : 0;
    
    // Use the current input text from the store, or default text if empty
    const text = (this.store.newLineInputText || '').trim() || DEFAULT_LINE_TEXT;
    
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'line',
      text,
      chords: [],
      hasChordSection: false,
      x: x,
      y: y,
      rotation: (Math.random() * 10) - 5, // Random rotation between -5 and 5 degrees
      zIndex: maxZ + 1
    };
    
    this.store.addLine(newLine);
  }

  private _handleCanvasClick(e: MouseEvent): void {
    // This will be handled by mousedown/mouseup for selection box
  }
  
  private _handleCanvasMouseDown(e: MouseEvent): void {
    // Only start selection box if clicking directly on canvas background
    if (e.target !== e.currentTarget) return;
    
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    this._isSelectionBoxActive = true;
    this._selectionBoxStart = { x: clickX, y: clickY };
    this._selectionBoxEnd = { ...this._selectionBoxStart };
    this._canvasMouseDownPos = { x: clickX, y: clickY };
    
    // Clear selection if shift is not held
    if (!e.shiftKey) {
      this.store.clearSelection();
    }
    
    this.requestUpdate();
  }

  render() {
    const selectionBox = this._isSelectionBoxActive && this._selectionBoxStart && this._selectionBoxEnd
      ? this._getSelectionBoxRect()
      : null;
    
    return html`
      <div class="canvas" 
        @drag-start=${this._handleDragStart} 
        @delete-line=${this._handleDeleteLine} 
        @duplicate-line=${this._handleDuplicateLine}
        @delete-group=${this._handleDeleteGroup}
        @duplicate-group=${this._handleDuplicateGroup}
        @ungroup=${this._handleUngroupGroup}
        @toggle-chord-section=${this._handleToggleChordSection}
        @chord-added=${this._handleChordAdded}
        @chord-updated=${this._handleChordUpdated}
        @chord-deleted=${this._handleChordDeleted}
        @chord-position-changed=${this._handleChordPositionChanged}
        @bring-to-front=${this._handleBringToFront}
        @text-changed=${this._handleTextChanged}
        @line-selected=${this._handleLineSelected}
        @group-selected=${this._handleGroupSelected}
        @mousedown=${this._handleCanvasMouseDown}
      >
        ${this.store.items.length === 0 ? html`
          <div class="empty-state">
            <div class="empty-state-icon">✨</div>
            <h2>Start Creating</h2>
            <p>Add your first lyric line to begin</p>
          </div>
        ` : ''}
        
        ${this.store.items.map(item => {
          if (item.type === 'line') {
            return html`
              <lyric-line
                id=${item.id}
                text=${item.text}
                .chords=${item.chords || []}
                .hasChordSection=${item.hasChordSection || false}
                .x=${item.x}
                .y=${item.y}
                .rotation=${item.rotation || 0}
                .zIndex=${item.zIndex || 1}
                .selected=${this.store.isLineSelected(item.id)}
              ></lyric-line>
            `;
          } else {
            return html`
              <lyric-group
                id=${item.id}
                .sectionName=${item.sectionName}
                .lines=${item.lines}
                .x=${item.x}
                .y=${item.y}
                .rotation=${item.rotation || 0}
                .zIndex=${item.zIndex || 1}
                .selected=${this.store.isLineSelected(item.id)}
              ></lyric-group>
            `;
          }
        })}
        
        ${selectionBox ? html`
          <div class="selection-box" style="
            left: ${selectionBox.left}px;
            top: ${selectionBox.top}px;
            width: ${selectionBox.right - selectionBox.left}px;
            height: ${selectionBox.bottom - selectionBox.top}px;
          "></div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('lyric-canvas', LyricCanvas);

