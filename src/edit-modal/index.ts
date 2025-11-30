import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { editModalStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';

/**
 * Simple modal for editing lyric text on mobile
 */
export class EditModal extends LitElement {
  static styles = editModalStyles;
  
  private store = new SongStoreController(this);

  private _handleClose(): void {
    this.store.setEditingLineId(null);
  }

  private _handleSave(): void {
    const input = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
    const newText = input?.value?.trim();
    
    if (newText && this.store.editingLineId) {
      this.store.updateLineText(this.store.editingLineId, newText);
    }
    
    this.store.setEditingLineId(null);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._handleClose();
    }
  }

  private _handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  firstUpdated(): void {
    // Auto-focus the input when modal appears
    const input = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
    if (input) {
      setTimeout(() => {
        input.focus();
        input.select();
      }, 100);
    }
  }

  render() {
    if (!this.store.editingLineId) {
      return html``;
    }

    console.log('Edit modal rendering for line:', this.store.editingLineId);
    const line = this.store.items.find(item => item.id === this.store.editingLineId);
    const text = line?.type === 'line' ? line.text : '';
    console.log('Line found:', line, 'Text:', text);

    return html`
      <div class="modal-backdrop" data-spectrum-pattern="underlay-open" @click=${this._handleBackdropClick}>
        <div class="modal-content" data-spectrum-pattern="modal-open dialog">
          <div class="modal-header" data-spectrum-pattern="dialog-heading">
            <h3>Edit Lyric</h3>
            <sp-action-button quiet data-spectrum-pattern="action-button-quiet" @click=${this._handleClose}>
              <sp-icon-close slot="icon"></sp-icon-close>
            </sp-action-button>
          </div>
          
          <div class="modal-body" data-spectrum-pattern="dialog-content">
            <sp-textfield 
              aria-label="Edit lyric text"
              data-spectrum-pattern="textfield"
              .value=${text}
              @keydown=${this._handleKeyDown}
              placeholder="Enter lyric text..."
            ></sp-textfield>
          </div>
          
          <div class="modal-footer" data-spectrum-pattern="dialog-footer">
            <sp-button variant="secondary" data-spectrum-pattern="button-secondary" @click=${this._handleClose}>Cancel</sp-button>
            <sp-button variant="accent" data-spectrum-pattern="button-accent" @click=${this._handleSave}>Save</sp-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('edit-modal', EditModal);

