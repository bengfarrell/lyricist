import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index.js';
import type { LyricLine } from '../store/index.js';
import { cursorManager } from '../cursor-manager/index.js';
import '../lyric-line/index.js';
import { lyricCanvasStyles } from './styles.css.js';

/**
 * Canvas component for displaying and interacting with draggable lyric lines
 */
export class LyricCanvas extends LitElement {
  static styles = lyricCanvasStyles;
  
  private store = new SongStoreController(this);
  
  private _draggedLine: LyricLine | null = null;
  private _boundHandleMouseMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;

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
    
    cursorManager.clearCursor();
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

  render() {
    return html`
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
    `;
  }
}

customElements.define('lyric-canvas', LyricCanvas);

