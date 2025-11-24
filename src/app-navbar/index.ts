import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
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

  private _switchPanel(panel: 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom'): void {
    this.store.setCurrentPanel(panel);
  }

  private _isCanvasMode(): boolean {
    const panel = this.store.currentPanel;
    return panel === 'canvas' || panel === 'canvas-lyrics-left' || panel === 'canvas-lyrics-right' || panel === 'canvas-lyrics-top' || panel === 'canvas-lyrics-bottom';
  }

  private _toggleLyricsPosition(position: 'left' | 'right' | 'top' | 'bottom'): void {
    if (!this._isCanvasMode()) return;
    
    const currentPanel = this.store.currentPanel;
    const targetPanel = `canvas-lyrics-${position}` as 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom';
    
    // If clicking the active button, toggle it off (return to canvas)
    if (currentPanel === targetPanel) {
      this._switchPanel('canvas');
    } else {
      this._switchPanel(targetPanel);
    }
  }

  render() {
    const isCanvasMode = this._isCanvasMode();
    const currentPanel = this.store.currentPanel;
    
    return html`
      <div class="navbar">
        <div class="navbar-tabs">
          <button 
            class="navbar-tab ${this.store.currentPanel === 'word-ladder' ? 'active' : ''}"
            @click=${() => this._switchPanel('word-ladder')}
            title="Word Ladder"
          >Word Ladder</button>
          
          <button 
            class="navbar-tab ${isCanvasMode ? 'active' : ''}"
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
            class="align-btn ${currentPanel === 'canvas-lyrics-left' ? 'active' : ''}"
            @click=${() => this._toggleLyricsPosition('left')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on left (click again to hide)"
            aria-label="Toggle lyrics on left"
          >◧</button>
          <button 
            class="align-btn ${currentPanel === 'canvas-lyrics-right' ? 'active' : ''}"
            @click=${() => this._toggleLyricsPosition('right')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on right (click again to hide)"
            aria-label="Toggle lyrics on right"
          >◨</button>
          <button 
            class="align-btn ${currentPanel === 'canvas-lyrics-top' ? 'active' : ''}"
            @click=${() => this._toggleLyricsPosition('top')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on top (click again to hide)"
            aria-label="Toggle lyrics on top"
          >◩</button>
          <button 
            class="align-btn ${currentPanel === 'canvas-lyrics-bottom' ? 'active' : ''}"
            @click=${() => this._toggleLyricsPosition('bottom')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on bottom (click again to hide)"
            aria-label="Toggle lyrics on bottom"
          >◪</button>
          
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

