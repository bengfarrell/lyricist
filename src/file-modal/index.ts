import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { SongStoreController } from '../store/index';
import { fileModalStyles } from './styles.css.ts';
import type { SavedSong } from '../store/types';
import '../lyrics-panel/index';

// @ts-ignore - vite will resolve this
const APP_VERSION = __APP_VERSION__;

/**
 * Full-screen modal for file management
 */
export class FileModal extends LitElement {
  static properties = {
    _selectedTab: { type: String, state: true }
  };

  static styles = fileModalStyles;

  private store = new SongStoreController(this);
  private _selectedTab: string = 'current-song';

  private _handleClose(): void {
    this.store.setShowFileModal(false);
  }

  private async _handleSave(): Promise<void> {
    // Show syncing state
    const btn = this.shadowRoot?.querySelector('.btn-primary');
    const originalText = btn?.textContent || 'Sync to Cloud';
    if (btn) {
      btn.textContent = '⏳ Syncing...';
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
        btn.textContent = '✓ Synced!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }
    } catch (error) {
      console.error('Sync error:', error);
      if (btn) {
        btn.textContent = '❌ Sync Failed';
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

  private _switchTab(tab: string): void {
    this._selectedTab = tab;
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
      this._selectedTab = 'current-song'; // Switch to current song tab after loading
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

  private _downloadJSON(): void {
    const song = {
      name: this.store.songName || 'Untitled',
      items: this.store.items,
      wordLadderColumns: this.store.wordLadderColumns,
      lastModified: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(song, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.name || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private _renderCurrentSongTab() {
    const items = this.store.items;

    return html`
      <div class="current-song-content">
        <div class="song-name-section">
          <label for="current-song-name-input" class="visually-hidden">Song name</label>
          <input
            id="current-song-name-input"
            type="text"
            class="song-name-input"
            placeholder="Enter song name..."
            .value=${this.store.songName}
            @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="lyrics-preview-section">
          <h4>Lyrics Preview</h4>
          <lyrics-panel></lyrics-panel>
        </div>

        <div class="current-song-actions">
          <button
            class="btn btn-secondary"
            @click=${this._copyLyrics}
            ?disabled=${items.length === 0}
          >
            Copy Lyrics
          </button>
          <button
            class="btn btn-secondary"
            @click=${this._downloadJSON}
            ?disabled=${items.length === 0}
          >
            Download
          </button>
          <button
            class="btn btn-primary"
            @click=${this._handleSave}
            ?disabled=${items.length === 0}
          >
            Sync to Cloud
          </button>
        </div>
      </div>
    `;
  }

  private async _deleteSong(song: SavedSong, e: MouseEvent): Promise<void> {
    e.stopPropagation();
    if (confirm(`Delete "${song.name}"? This will remove it from local storage and the cloud.`)) {
      await this.store.deleteSong(song.name);
    }
  }

  private _renderAllSongsTab() {
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
      <div class="document-picker">
        <div class="document-list">
          ${allSongs.map(song => {
            const isSample = this.store.sampleContent?.sampleSongs?.some(s => s.songId === song.songId);
            const itemCount = (song.items || song.lines || []).length;
            const date = new Date(song.lastModified).toLocaleDateString();

            return html`
              <div class="document-item ${isSample ? 'sample-document' : ''}" @click=${() => this._handleDocumentSelect(song.name)}>
                <div class="document-info">
                  <div class="document-title">${song.name}</div>
                  <div class="document-meta">
                    ${itemCount} items • ${isSample ? 'Sample' : date}
                  </div>
                </div>
                <div class="document-actions">
                  ${!isSample ? html`
                    <button
                      class="btn btn-delete"
                      @click=${(e: MouseEvent) => this._deleteSong(song, e)}
                      title="Delete song"
                    >
                      Delete
                    </button>
                  ` : ''}
                  <div class="document-arrow">→</div>
                </div>
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
      <div class="modal-backdrop" @click=${this._handleBackdropClick}>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Songs</h2>
            <button class="close-btn" @click=${this._handleClose}>✕</button>
          </div>

          <div class="tabs-container">
            <div class="tabs">
              <button
                class="tab ${this._selectedTab === 'current-song' ? 'active' : ''}"
                @click=${() => this._switchTab('current-song')}
              >
                Current Song
              </button>
              <button
                class="tab ${this._selectedTab === 'all-songs' ? 'active' : ''}"
                @click=${() => this._switchTab('all-songs')}
              >
                All Songs
              </button>
            </div>
            <button class="btn btn-secondary new-song-btn" @click=${this._handleNew}>New Song</button>
          </div>

          <div class="modal-body">
            ${this._selectedTab === 'current-song'
              ? this._renderCurrentSongTab()
              : this._renderAllSongsTab()
            }
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

