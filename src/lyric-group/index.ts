import { LitElement, html, PropertyValues } from 'lit';
import { cursorManager } from '../cursor-manager/index';
import { lyricGroupStyles } from './styles.css.ts';
import type { LyricLine } from '../store/types';

export class LyricGroup extends LitElement {
  static properties = {
    sectionName: { type: String },
    lines: { type: Array },
    x: { type: Number },
    y: { type: Number },
    id: { type: String },
    rotation: { type: Number },
    zIndex: { type: Number },
    selected: { type: Boolean }
  };

  static styles = lyricGroupStyles;

  sectionName: string = '';
  lines: LyricLine[] = [];
  x: number = 0;
  y: number = 0;
  id: string = '';
  rotation: number = 0;
  zIndex: number = 1;
  selected: boolean = false;
  
  private _isDragging: boolean = false;
  _offsetX: number = 0;
  _offsetY: number = 0;

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
    this.style.left = `${this.x}px`;
    this.style.top = `${this.y}px`;
    this.style.transform = `rotate(${this.rotation}deg)`;
    this.style.transformOrigin = 'top left';
    this.style.zIndex = this.zIndex.toString();
  }

  private _handlePointerDown(e: PointerEvent): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('action-btn')) {
      return;
    }

    // Select this group
    this.dispatchEvent(new CustomEvent('group-selected', {
      detail: { id: this.id, shiftKey: e.shiftKey },
      bubbles: true,
      composed: true
    }));

    // Bring to front
    this.dispatchEvent(new CustomEvent('bring-to-front', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));

    this._isDragging = true;
    this.setAttribute('dragging', '');
    
    const rect = this.getBoundingClientRect();
    this._offsetX = e.clientX - rect.left;
    this._offsetY = e.clientY - rect.top;

    this.dispatchEvent(new CustomEvent('drag-start', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleDelete(e: MouseEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('delete-group', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleDuplicate(e: MouseEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('duplicate-group', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleUngroup(e: MouseEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('ungroup', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updatePosition();
    this.updateSelectedState();
  }

  render() {
    return html`
      <div 
        class="container"
        @pointerdown=${this._handlePointerDown}
      >
        <div class="section-header">
          <span class="section-name">${this.sectionName}</span>
          <span class="line-count">(${this.lines.length} line${this.lines.length !== 1 ? 's' : ''})</span>
        </div>
        
        <button class="action-btn duplicate-btn" data-spectrum-pattern="action-button-quiet" @click=${this._handleDuplicate} title="Duplicate">⊕</button>
        <button class="action-btn ungroup-btn" data-spectrum-pattern="action-button-quiet" @click=${this._handleUngroup} title="Ungroup">⊟</button>
        <button class="action-btn delete-btn" data-spectrum-pattern="action-button-quiet" @click=${this._handleDelete} title="Delete">×</button>
      </div>
    `;
  }
}

customElements.define('lyric-group', LyricGroup);

