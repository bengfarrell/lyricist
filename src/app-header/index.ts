import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { appHeaderStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';

/**
 * App header component with song name input and action buttons
 */
export class AppHeader extends LitElement {
  static styles = appHeaderStyles;
  
  private store = new SongStoreController(this);

  private async _handleSave(): Promise<void> {
    // Show saving state
    const btn = this.shadowRoot?.querySelector('.btn-primary');
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
          <sp-textfield 
            id="song-name-input"
            data-spectrum-pattern="textfield"
            placeholder="Song Name"
            quiet
            .value=${this.store.songName}
            @input=${(e: InputEvent) => this.store.setSongName((e.target as HTMLInputElement).value)}
          ></sp-textfield>
          <sp-button variant="accent" data-spectrum-pattern="button-accent" @click=${this._handleSave}>Save</sp-button>
          <sp-button variant="secondary" data-spectrum-pattern="button-secondary" @click=${() => this.store.setShowLoadDialog(true)}>Load</sp-button>
          <sp-button variant="secondary" data-spectrum-pattern="button-secondary" @click=${this._handleNew}>New</sp-button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-header', AppHeader);

