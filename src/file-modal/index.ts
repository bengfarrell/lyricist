import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SongStoreController } from '../store/index';
import { fileModalStyles } from './styles.css.ts';
import '../lyrics-panel/index';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/action-button/sp-action-button.js';

// @ts-ignore - vite will resolve this
const APP_VERSION = __APP_VERSION__;

/**
 * Full-screen modal for file management
 */
export class FileModal extends LitElement {
  static styles = fileModalStyles;
  
  private store = new SongStoreController(this);
  
  @property({ type: Boolean })
  private showDocumentPicker = false;

  private _handleClose(): void {
    this.store.setShowFileModal(false);
  }

  private async _handleSave(): Promise<void> {
    // Show saving state
    const btn = this.shadowRoot?.querySelector('.btn-save');
    const originalText = btn?.textContent || 'Save';
    if (btn) {
      btn.textContent = '⏳ Saving...';
    }
    
    try {
      const success = await this.store.saveSong();
      if (!success) {
        if (btn) btn.textContent = originalText;
        alert('Please enter a song name');
        return;
      }
      
      // Visual feedback
      if (btn) {
        btn.textContent = '✓ Saved!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }
    } catch (error) {
      console.error('Save error:', error);
      if (btn) {
        btn.textContent = '❌ Error';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    }
  }

  private _handleNew(): void {
    if (this.store.items.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.store.newSong();
  }

  private async _handleLoad(): Promise<void> {
    // Refresh songs from cloud before showing picker
    await this.store.refreshSongsFromCloud();
    this.showDocumentPicker = !this.showDocumentPicker;
  }
  
  private _handleDocumentSelect(songName: string): void {
    // Check saved songs first
    let song = this.store.savedSongs.find(s => s.name === songName);
    
    // If not found, check sample songs
    if (!song) {
      song = this.store.sampleContent?.sampleSongs?.find(s => s.name === songName);
    }
    
    if (song) {
      this.store.loadSong(song);
      this.showDocumentPicker = false;
    }
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
    const allSongs = [
      ...this.store.savedSongs,
      ...(this.store.sampleContent?.sampleSongs ?? [])
    ];

    if (allSongs.length === 0) {
      return html`
        <div class="document-picker">
          <div class="empty-picker-message">
            No saved songs yet. Create and save your first song!
          </div>
        </div>
      `;
    }

    return html`
      <div class="document-picker" data-spectrum-pattern="menu">
        <div class="document-list">
          ${allSongs.map(song => {
            const isSample = this.store.sampleContent?.sampleSongs?.some(s => s.songId === song.songId);
            const itemCount = (song.items || song.lines || []).length;
            const date = new Date(song.lastModified).toLocaleDateString();
            
            return html`
              <div class="document-item ${isSample ? 'sample-document' : ''}" data-spectrum-pattern="menu-item" @click=${() => this._handleDocumentSelect(song.name)}>
                <div class="document-info">
                  <div class="document-title">${song.name}</div>
                  <div class="document-meta">
                    ${itemCount} items • ${isSample ? 'Sample' : date}
                  </div>
                </div>
                <div class="document-arrow">→</div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.store.showFileModal) {
      return html``;
    }

    return html`
      <div class="modal-backdrop" data-spectrum-pattern="underlay-open" @click=${this._handleBackdropClick}>
        <div class="modal-content" data-spectrum-pattern="modal-open modal-fullscreen">
          <div class="modal-header">
            <sp-textfield 
              id="file-modal-song-name"
              data-spectrum-pattern="textfield"
              placeholder="Enter song name..."
              quiet
              .value=${this.store.songName}
              @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
            ></sp-textfield>
            <sp-action-button quiet data-spectrum-pattern="action-button-quiet" @click=${this._handleClose}>✕</sp-action-button>
          </div>
          
          <div class="modal-body">
            <div class="section lyrics-section">
              <h3>${this.showDocumentPicker ? 'Select a Song' : 'Lyrics Preview'}</h3>
              <div class="lyrics-preview">
                ${this.showDocumentPicker ? this._renderDocumentPicker() : html`<lyrics-panel></lyrics-panel>`}
              </div>
              <div class="actions-container">
                <div class="actions-row">
                  <sp-button 
                    variant="secondary" 
                    data-spectrum-pattern="button-secondary" 
                    @click=${this._copyLyrics}
                    ?disabled=${this.store.items.length === 0}
                    title="Copy lyrics to clipboard"
                  >
                    Copy
                  </sp-button>
                  <sp-button 
                    variant="secondary"
                    data-spectrum-pattern="button-secondary" 
                    @click=${this._handleSave}
                    ?disabled=${this.store.items.length === 0}
                    title="Save song"
                  >
                    Save
                  </sp-button>
                </div>
                <div class="button-divider"></div>
                <div class="actions-row">
                  <sp-button 
                    variant="secondary" 
                    data-spectrum-pattern="button-secondary" 
                    @click=${this._handleNew}
                    ?disabled=${this.store.items.length === 0}
                    title="Start a new song"
                  >
                    New
                  </sp-button>
                  <sp-button 
                    variant="secondary"
                    data-spectrum-pattern="button-secondary" 
                    @click=${this._handleLoad}
                    title="Load a saved song"
                  >
                    Load
                  </sp-button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <span class="version-text">Version ${APP_VERSION}</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('file-modal', FileModal);

