import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import type { SavedSong } from '../store/index';
import { loadDialogStyles } from './styles.css.ts';

/**
 * Dialog component for managing saved songs (load/delete/import/export)
 */
export class LoadDialog extends LitElement {
  static styles = loadDialogStyles;
  
  private store = new SongStoreController(this);

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

  render() {
    if (!this.store.showLoadDialog) {
      return html``;
    }

    const hasSavedSongs = this.store.savedSongs.length > 0;
    const sampleSongs = this.store.sampleContent?.sampleSongs ?? [];
    const hasSampleSongs = sampleSongs.length > 0;

    return html`
      <div class="dialog-overlay" data-spectrum-pattern="modal-overlay" @click=${() => this.store.setShowLoadDialog(false)}>
        <div class="dialog" data-spectrum-pattern="dialog" @click=${(e: MouseEvent) => e.stopPropagation()}>
          <h2 data-spectrum-pattern="dialog-heading">Load Song</h2>
          
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

          <div class="dialog-actions" data-spectrum-pattern="dialog-footer">
            <button class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${() => this.store.setShowLoadDialog(false)}>Close</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('load-dialog', LoadDialog);

