import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { cursorManager } from '../cursor-manager/index';
import { lyricistAppStyles } from './styles.css.ts';
import '../app-header/index';
import '../app-controls/index';
import '../lyric-canvas/index';
import '../lyrics-panel/index';
import '../left-panel/index';
import '../load-dialog/index';

/**
 * Main application component that composes all child components
 */
export class LyricistApp extends LitElement {
  static styles = lyricistAppStyles;
  
  private store = new SongStoreController(this);
  
  private _draggingDivider: 'left' | 'right' | null = null;
  private _boundHandleDividerMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._boundHandleDividerMove = this._handleDividerMove.bind(this);
    this._boundHandleMouseUp = this._handleMouseUp.bind(this);
    window.addEventListener('mousemove', this._boundHandleDividerMove);
    window.addEventListener('mouseup', this._boundHandleMouseUp);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundHandleDividerMove) {
      window.removeEventListener('mousemove', this._boundHandleDividerMove);
    }
    if (this._boundHandleMouseUp) {
      window.removeEventListener('mouseup', this._boundHandleMouseUp);
    }
  }

  private _handleLeftDividerMouseDown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._draggingDivider = 'left';
    cursorManager.setCursor('ew-resize');
  }

  private _handleRightDividerMouseDown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._draggingDivider = 'right';
    cursorManager.setCursor('ew-resize');
  }

  private _handleDividerMove(e: MouseEvent): void {
    if (!this._draggingDivider) return;

    const container = this.shadowRoot?.querySelector('.main-content');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    if (this._draggingDivider === 'left') {
      // Calculate new width from the left edge
      const newWidth = e.clientX - rect.left;
      this.store.setLeftPanelWidth(newWidth);
    } else if (this._draggingDivider === 'right') {
      // Calculate new width from the right edge
      const newWidth = rect.right - e.clientX;
      this.store.setLyricsPanelWidth(newWidth);
    }
  }

  private _handleMouseUp(): void {
    if (this._draggingDivider) {
      this._draggingDivider = null;
      cursorManager.clearCursor();
    }
  }

  render() {
    return html`
      <div class="container">
        <app-header></app-header>
        <app-controls></app-controls>
        
        <div class="main-content">
          <left-panel style="width: ${this.store.leftPanelWidth}px"></left-panel>
          
          <div class="panel-divider left-divider" @mousedown=${this._handleLeftDividerMouseDown}></div>
          
          <lyric-canvas></lyric-canvas>
          
          <div class="panel-divider right-divider" @mousedown=${this._handleRightDividerMouseDown}></div>
          
          <lyrics-panel style="width: ${this.store.lyricsPanelWidth}px"></lyrics-panel>
        </div>
      </div>

      <load-dialog></load-dialog>
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);
