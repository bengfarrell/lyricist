import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index.js';
import { cursorManager } from '../cursor-manager/index.js';
import { lyricistAppStyles } from './styles.css.js';
import '../app-header/index.js';
import '../app-controls/index.js';
import '../lyric-canvas/index.js';
import '../lyrics-panel/index.js';
import '../load-dialog/index.js';

/**
 * Main application component that composes all child components
 */
export class LyricistApp extends LitElement {
  static styles = lyricistAppStyles;
  
  private store = new SongStoreController(this);
  
  private _isDraggingDivider: boolean = false;
  private _boundHandleDividerMove?: (e: MouseEvent) => void;
  private _boundHandleMouseUp?: (e: MouseEvent) => void;

  constructor() {
    super();
    // Load sample song on startup for development
    this.store.loadSampleSong();
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

  private _handleMouseUp(): void {
    if (this._isDraggingDivider) {
      this._isDraggingDivider = false;
      cursorManager.clearCursor();
    }
  }

  render() {
    return html`
      <div class="container">
        <app-header></app-header>
        <app-controls></app-controls>
        
        <div class="main-content">
          <lyric-canvas></lyric-canvas>
          
          <div class="panel-divider" @mousedown=${this._handleDividerMouseDown}></div>
          
          <lyrics-panel style="width: ${this.store.lyricsPanelWidth}px"></lyrics-panel>
        </div>
      </div>

      <load-dialog></load-dialog>
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);
