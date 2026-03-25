import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import type { SavedSong } from '../store/index';
import { loadDialogStyles } from './styles.css.ts';

/**
 * Dialog component for managing saved songs (load/delete/import/export)
 */
export class LoadDialog extends LitElement {
  static properties = {
    _selectedTab: { type: String, state: true }
  };

  static styles = loadDialogStyles;
  
  private store = new SongStoreController(this);
  private _selectedTab: string = 'all-songs';

  private async _deleteSong(song: SavedSong, e: MouseEvent): Promise<void> {
    e.stopPropagation();
    if (confirm(`Delete "${song.name}"?`)) {
      await this.store.deleteSong(song.name);
    }
  }

  private _importFromJSON(): void {
    const input = this.shadowRoot?.querySelector('.file-input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  private _handleFileImport(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const song = JSON.parse(result) as SavedSong;
          this.store.importFromJSON(song);
        }
      } catch (error) {
        alert('Error importing file: Invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  private _switchTab(tab: string): void {
    this._selectedTab = tab;
  }

  private _renderCurrentSongTab() {
    const currentSong = this.store.songName;
    const items = this.store.items;
    const lines = this.store.lines;
    const groups = this.store.groups;

    if (!currentSong) {
      return html`
        <div class="empty-message">
          No song currently loaded. Create a new song or load an existing one.
        </div>
      `;
    }

    return html`
      <div class="current-song-info">
        <div class="info-section">
          <h3 class="info-label">Song Name</h3>
          <div class="info-value">${currentSong}</div>
        </div>

        <div class="info-section">
          <h3 class="info-label">Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${items.length}</div>
              <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${lines.length}</div>
              <div class="stat-label">Lines</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${groups.length}</div>
              <div class="stat-label">Groups</div>
            </div>
          </div>
        </div>

        ${lines.length > 0 ? html`
          <div class="info-section">
            <h3 class="info-label">Lyrics Preview</h3>
            <div class="lyrics-preview">
              ${lines.slice(0, 10).map(line => html`
                <div class="preview-line">${line.text}</div>
              `)}
              ${lines.length > 10 ? html`
                <div class="preview-more">... and ${lines.length - 10} more lines</div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderAllSongsTab() {
    const hasSavedSongs = this.store.savedSongs.length > 0;
    const sampleSongs = this.store.sampleContent?.sampleSongs ?? [];
    const hasSampleSongs = sampleSongs.length > 0;

    return html`
      ${!hasSavedSongs && !hasSampleSongs ? html`
        <p class="empty-message" data-spectrum-pattern="dialog-content">
          No saved songs yet. Create and save your first song!
        </p>
      ` : html`
        ${hasSavedSongs ? html`
          <div class="song-section">
            <h3 class="section-heading">Your Songs</h3>
            <div class="song-list" data-spectrum-pattern="dialog-content">
              ${this.store.savedSongs.map(song => html`
                <div class="song-item" data-spectrum-pattern="list-item-selectable" @click=${() => this.store.loadSong(song)}>
                  <div class="song-item-info">
                    <div class="song-item-name">${song.name}</div>
                    <div class="song-item-meta">
                      ${(song.items || song.lines || []).length} items • Last modified: ${new Date(song.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  <button class="btn btn-danger" data-spectrum-pattern="button-negative" @click=${(e: MouseEvent) => this._deleteSong(song, e)}>Delete</button>
                </div>
              `)}
            </div>
          </div>
        ` : ''}

        ${hasSampleSongs ? html`
          <div class="song-section">
            <h3 class="section-heading">Sample Songs</h3>
            <div class="song-list" data-spectrum-pattern="dialog-content">
              ${sampleSongs.map(song => html`
                <div class="song-item sample-item" data-spectrum-pattern="list-item-selectable" @click=${() => this.store.loadSong(song)}>
                  <div class="song-item-info">
                    <div class="song-item-name">${song.name}</div>
                    <div class="song-item-meta">
                      ${(song.items || song.lines || []).length} items • Sample content
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        ` : ''}
      `}

      <div class="export-section">
        <h3>Import/Export</h3>
        <div class="export-actions">
          <button class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${this._importFromJSON}>Import JSON</button>
          <button class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${() => this.store.exportToJSON()}>Export JSON</button>
        </div>
        <input type="file" class="file-input" accept=".json" @change=${this._handleFileImport} />
      </div>
    `;
  }

  render() {
    if (!this.store.showLoadDialog) {
      return html``;
    }

    return html`
      <div class="dialog-overlay" data-spectrum-pattern="modal-overlay" @click=${() => this.store.setShowLoadDialog(false)}>
        <div class="dialog" data-spectrum-pattern="dialog" @click=${(e: MouseEvent) => e.stopPropagation()}>
          <h2 data-spectrum-pattern="dialog-heading">Songs</h2>

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

          <div class="tab-content">
            ${this._selectedTab === 'current-song'
              ? this._renderCurrentSongTab()
              : this._renderAllSongsTab()
            }
          </div>

          <div class="dialog-actions" data-spectrum-pattern="dialog-footer">
            <button class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${() => this.store.setShowLoadDialog(false)}>Close</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('load-dialog', LoadDialog);

