import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SongStoreController } from '../store/index';
import { fileModalStyles } from './styles.css.ts';
import '../lyrics-panel/index';

/**
 * Full-screen modal for file management
 */
export class FileModal extends LitElement {
  static styles = fileModalStyles;
  
  private store = new SongStoreController(this);
  
  @property({ type: Boolean })
  private showDocumentPicker = false;
  
  // Fake documents for testing
  private fakeDocuments = [
    { id: 1, title: 'Summer Breeze', date: '2024-03-15', lines: 24 },
    { id: 2, title: 'Midnight Dreams', date: '2024-03-10', lines: 18 },
    { id: 3, title: 'City Lights', date: '2024-03-05', lines: 32 },
    { id: 4, title: 'Ocean Waves', date: '2024-02-28', lines: 16 },
    { id: 5, title: 'Mountain Echo', date: '2024-02-20', lines: 20 },
    { id: 6, title: 'Desert Rose', date: '2024-02-15', lines: 22 },
    { id: 7, title: 'River Song', date: '2024-02-10', lines: 28 },
    { id: 8, title: 'Starlight Serenade', date: '2024-02-05', lines: 26 },
    { id: 9, title: 'Thunder Road', date: '2024-01-30', lines: 30 },
    { id: 10, title: 'Whispers in the Wind', date: '2024-01-25', lines: 19 },
    { id: 11, title: 'Dancing Shadows', date: '2024-01-20', lines: 21 },
    { id: 12, title: 'Golden Hour', date: '2024-01-15', lines: 17 },
    { id: 13, title: 'Neon Nights', date: '2024-01-10', lines: 25 },
    { id: 14, title: 'Silent Sunrise', date: '2024-01-05', lines: 23 },
    { id: 15, title: 'Endless Highway', date: '2024-01-01', lines: 29 }
  ];

  private _handleClose(): void {
    this.store.setShowFileModal(false);
  }

  private _handleSave(): void {
    const success = this.store.saveSong();
    if (!success) {
      alert('Please enter a song name');
      return;
    }
    
    // Visual feedback
    const btn = this.shadowRoot?.querySelector('.btn-save');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }

  private _handleNew(): void {
    if (this.store.items.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.store.newSong();
  }

  private _handleLoad(): void {
    this.showDocumentPicker = !this.showDocumentPicker;
  }
  
  private _handleDocumentSelect(docId: number): void {
    // For now, just load the sample song and close picker
    // In the future, this would load the actual document
    this.store.loadSampleSong();
    this.showDocumentPicker = false;
  }

  private _handleLoadSample(): void {
    this.store.loadSampleSong();
  }

  private _handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  private _copyLyrics(): void {
    // Dispatch event to the embedded lyrics panel
    const lyricsPanel = this.shadowRoot?.querySelector('lyrics-panel');
    if (lyricsPanel) {
      lyricsPanel.dispatchEvent(new CustomEvent('copy-lyrics', { bubbles: true, composed: true }));
    }
  }
  
  private _renderDocumentPicker() {
    return html`
      <div class="document-picker">
        <div class="document-list">
          ${this.fakeDocuments.map(doc => html`
            <div class="document-item" @click=${() => this._handleDocumentSelect(doc.id)}>
              <div class="document-info">
                <div class="document-title">${doc.title}</div>
                <div class="document-meta">
                  ${doc.lines} lines • ${doc.date}
                </div>
              </div>
              <div class="document-arrow">→</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.store.showFileModal) {
      return html``;
    }

    return html`
      <div class="modal-backdrop" @click=${this._handleBackdropClick}>
        <div class="modal-content">
          <div class="modal-header">
            <h2>File Management</h2>
            <button class="close-btn" data-spectrum-pattern="action-button-quiet" @click=${this._handleClose}>✕</button>
          </div>
          
          <div class="modal-body">
            <div class="section">
              <h3>Song Title</h3>
              <label for="file-modal-song-name" class="visually-hidden" data-spectrum-pattern="field-label">Song name</label>
              <input 
                id="file-modal-song-name"
                type="text" 
                class="song-name-input" 
                data-spectrum-pattern="textfield"
                placeholder="Enter song name..."
                .value=${this.store.songName}
                @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="section lyrics-section">
              <h3>${this.showDocumentPicker ? 'Select a Song' : 'Lyrics Preview'}</h3>
              <div class="lyrics-preview">
                ${this.showDocumentPicker ? this._renderDocumentPicker() : html`<lyrics-panel></lyrics-panel>`}
              </div>
              <div class="actions-row">
                <button 
                  class="btn btn-primary btn-save" 
                  data-spectrum-pattern="button-accent" 
                  @click=${this._handleSave}
                  title="Save song"
                >
                  Save
                </button>
                <button 
                  class="btn btn-secondary" 
                  data-spectrum-pattern="button-secondary" 
                  @click=${this._copyLyrics}
                  ?disabled=${this.store.items.length === 0}
                  title="Copy lyrics to clipboard"
                >
                  Copy
                </button>
                <button 
                  class="btn btn-secondary" 
                  data-spectrum-pattern="button-secondary" 
                  @click=${this._handleNew}
                  ?disabled=${this.store.items.length === 0}
                  title="Start a new song"
                >
                  New
                </button>
                <button 
                  class="btn btn-secondary ${this.showDocumentPicker ? 'btn-active' : ''}" 
                  data-spectrum-pattern="button-secondary" 
                  @click=${this._handleLoad}
                  title="Load a saved song"
                >
                  Load
                </button>
                <button 
                  class="btn btn-secondary" 
                  data-spectrum-pattern="button-secondary" 
                  @click=${this._handleLoadSample}
                  title="Load sample song"
                >
                  Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('file-modal', FileModal);

