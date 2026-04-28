import { LitElement, html } from 'lit';
import { SongStoreController } from '../utils/index';
import { wordLadderConfigModalStyles } from './styles.css.ts';

/**
 * Modal for configuring word ladder settings
 */
export class WordLadderConfigModal extends LitElement {
  static styles = wordLadderConfigModalStyles;
  
  private store = new SongStoreController(this);

  private _handleClose(): void {
    this.store.setShowWordLadderConfig(false);
  }

  private _handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  private _toggleColumnMuted(columnIndex: number): void {
    this.store.toggleWordLadderColumnMuted(columnIndex);
  }

  private _handleRandomColumnCountChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.store.setWordLadderRandomColumnCount(value);
    }
  }

  render() {
    if (!this.store.showWordLadderConfig) {
      return html``;
    }

    const columns = this.store.wordLadderColumns;
    const randomColumnCount = this.store.wordLadderRandomColumnCount;

    return html`
      <div class="modal-backdrop" @click=${this._handleBackdropClick}>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Word Ladder Configuration</h2>
            <button 
              class="close-btn" 
              @click=${this._handleClose}
              title="Close"
              aria-label="Close"
            >×</button>
          </div>

          <div class="modal-body">
            <div class="config-section">
              <h3>Active Columns</h3>
              <p class="help-text">Toggle columns on/off to include/exclude them from randomization</p>
              <div class="column-toggles">
                ${columns.map((column, index) => html`
                  <button
                    class="column-toggle ${column.muted ? 'muted' : 'active'}"
                    @click=${() => this._toggleColumnMuted(index)}
                    title="${column.muted ? 'Click to activate' : 'Click to mute'}"
                  >
                    <span class="column-name">${column.title}</span>
                  </button>
                `)}
              </div>
            </div>

            <div class="config-section">
              <h3>Random Column Count</h3>
              <p class="help-text">Number of columns to use when rolling the dice</p>
              <div class="number-input-container">
                <button 
                  class="stepper-btn"
                  @click=${() => this.store.setWordLadderRandomColumnCount(Math.max(1, randomColumnCount - 1))}
                  ?disabled=${randomColumnCount <= 1}
                >−</button>
                <input
                  type="number"
                  class="random-count-input"
                  min="1"
                  max="${columns.length}"
                  .value="${randomColumnCount}"
                  @input=${this._handleRandomColumnCountChange}
                  @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                />
                <button 
                  class="stepper-btn"
                  @click=${() => this.store.setWordLadderRandomColumnCount(Math.min(columns.length, randomColumnCount + 1))}
                  ?disabled=${randomColumnCount >= columns.length}
                >+</button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="done-btn" @click=${this._handleClose}>Done</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('word-ladder-config-modal', WordLadderConfigModal);
