import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index.js';
import { appHeaderStyles } from './styles.css.js';

/**
 * App header component with song name input and action buttons
 */
export class AppHeader extends LitElement {
  static styles = appHeaderStyles;
  
  private store = new SongStoreController(this);

  private _handleSave(): void {
    const success = this.store.saveSong();
    if (!success) {
      alert('Please enter a song name');
      return;
    }
    
    // Visual feedback
    const btn = this.shadowRoot?.querySelector('.btn-primary');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Saved!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }

  private _handleNew(): void {
    if (this.store.lines.length > 0 && !confirm('Start a new song? Unsaved changes will be lost.')) {
      return;
    }
    this.store.newSong();
  }

  render() {
    return html`
      <div class="header">
        <h1>🎵 Lyricist</h1>
        <div class="header-controls">
          <input 
            type="text" 
            class="song-name-input" 
            placeholder="Song Name"
            .value=${this.store.songName}
            @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
          />
          <button class="btn btn-primary" @click=${this._handleSave}>Save</button>
          <button class="btn btn-secondary" @click=${() => this.store.setShowLoadDialog(true)}>Load</button>
          <button class="btn btn-secondary" @click=${this._handleNew}>New</button>
          <button class="btn btn-secondary" @click=${() => this.store.loadSampleSong()}>Load Sample</button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-header', AppHeader);

