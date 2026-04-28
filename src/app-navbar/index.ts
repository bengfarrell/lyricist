import { LitElement, html } from 'lit';
import { SongStoreController } from '../utils/index';
import { appNavbarStyles } from './styles.css.ts';

/**
 * Thin macOS-style navbar at the top of the app
 */

export class AppNavbar extends LitElement {
  static styles = appNavbarStyles;
  
  private store = new SongStoreController(this);

  private _handleTitleClick(): void {
    this.store.setShowFileModal(true);
  }

  private _handleSettingsClick(): void {
    this.store.setShowEmailPrompt(true);
  }

  private _switchPanel(panel: 'word-ladder' | 'canvas' | 'lyrics'): void {
    this.store.setCurrentPanel(panel);
  }

  render() {
    
    return html`
      <div class="navbar">
        <div class="navbar-tabs">
          <button
            class="navbar-tab ${this.store.currentPanel === 'word-ladder' ? 'active' : ''}"
            @click=${() => this._switchPanel('word-ladder')}
            title="Word Ladder"
          >Word Ladder</button>

          <button
            class="navbar-tab ${this.store.currentPanel === 'canvas' ? 'active' : ''}"
            @click=${() => this._switchPanel('canvas')}
            title="Canvas"
          >Canvas</button>

          <button
            class="navbar-tab ${this.store.currentPanel === 'lyrics' ? 'active' : ''}"
            @click=${() => this._switchPanel('lyrics')}
            title="Lyrics Sheet"
          >Lyrics</button>
        </div>

        <button class="navbar-title" @click=${this._handleTitleClick} title="Click to manage file">
          ${this.store.songName || 'Untitled'}
        </button>

        <div class="navbar-right">
          <button
            class="settings-btn"
            @click=${this._handleSettingsClick}
            title="${this.store.userEmail ? `Syncing as: ${this.store.userEmail}` : 'Set up cloud sync'}"
            aria-label="Settings"
          >⚙️</button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-navbar', AppNavbar);

