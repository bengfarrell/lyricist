import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { appNavbarStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/action-group/sp-action-group.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-left.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-right.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-top.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-align-bottom.js';

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
        <div class="navbar-tabs" role="tablist" data-spectrum-pattern="tabs">
          <sp-action-button 
            quiet
            role="tab"
            aria-selected=${this.store.currentPanel === 'word-ladder' ? 'true' : 'false'}
            ?selected=${this.store.currentPanel === 'word-ladder'}
            class="navbar-tab ${this.store.currentPanel === 'word-ladder' ? 'active' : ''}"
            data-spectrum-pattern="tab-item ${this.store.currentPanel === 'word-ladder' ? 'tab-selected' : ''}"
            @click=${() => this._switchPanel('word-ladder')}
            title="Word Ladder"
          >Word Ladder</sp-action-button>
          
          <sp-action-button 
            quiet
            role="tab"
            aria-selected=${isCanvasMode ? 'true' : 'false'}
            ?selected=${isCanvasMode}
            class="navbar-tab ${isCanvasMode ? 'active' : ''}"
            data-spectrum-pattern="tab-item ${isCanvasMode ? 'tab-selected' : ''}"
            @click=${() => this._switchPanel('canvas')}
            title="Canvas"
          >Canvas</sp-action-button>
          
          <sp-action-button 
            quiet
            role="tab"
            aria-selected=${this.store.currentPanel === 'lyrics' ? 'true' : 'false'}
            ?selected=${this.store.currentPanel === 'lyrics'}
            class="navbar-tab ${this.store.currentPanel === 'lyrics' ? 'active' : ''}"
            data-spectrum-pattern="tab-item ${this.store.currentPanel === 'lyrics' ? 'tab-selected' : ''}"
            @click=${() => this._switchPanel('lyrics')}
            title="Lyrics Sheet"
          >Lyrics</sp-action-button>
        </div>
        
        <sp-action-button class="navbar-title" data-spectrum-pattern="action-button" @click=${this._handleTitleClick} title="Click to manage file">
          ${this.store.songName || 'Untitled'}
        </sp-action-button>
        
        <sp-action-group class="navbar-right" compact quiet data-spectrum-pattern="action-group-horizontal action-group-compact">
          <sp-action-button 
            ?selected=${currentPanel === 'canvas-lyrics-left'}
            data-spectrum-pattern="action-button ${currentPanel === 'canvas-lyrics-left' ? 'action-button-selected' : ''}"
            @click=${() => this._toggleLyricsPosition('left')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on left (click again to hide)"
            aria-label="Toggle lyrics on left"
          >
            <sp-icon-align-left slot="icon"></sp-icon-align-left>
          </sp-action-button>
          <sp-action-button 
            ?selected=${currentPanel === 'canvas-lyrics-right'}
            data-spectrum-pattern="action-button ${currentPanel === 'canvas-lyrics-right' ? 'action-button-selected' : ''}"
            @click=${() => this._toggleLyricsPosition('right')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on right (click again to hide)"
            aria-label="Toggle lyrics on right"
          >
            <sp-icon-align-right slot="icon"></sp-icon-align-right>
          </sp-action-button>
          <sp-action-button 
            ?selected=${currentPanel === 'canvas-lyrics-top'}
            data-spectrum-pattern="action-button ${currentPanel === 'canvas-lyrics-top' ? 'action-button-selected' : ''}"
            @click=${() => this._toggleLyricsPosition('top')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on top (click again to hide)"
            aria-label="Toggle lyrics on top"
          >
            <sp-icon-align-top slot="icon"></sp-icon-align-top>
          </sp-action-button>
          <sp-action-button 
            ?selected=${currentPanel === 'canvas-lyrics-bottom'}
            data-spectrum-pattern="action-button ${currentPanel === 'canvas-lyrics-bottom' ? 'action-button-selected' : ''}"
            @click=${() => this._toggleLyricsPosition('bottom')}
            ?disabled=${!isCanvasMode}
            title="Lyrics on bottom (click again to hide)"
            aria-label="Toggle lyrics on bottom"
          >
            <sp-icon-align-bottom slot="icon"></sp-icon-align-bottom>
          </sp-action-button>
          
          <sp-action-button 
            data-spectrum-pattern="action-button"
            @click=${this._handleSettingsClick}
            title="${this.store.userEmail ? `Syncing as: ${this.store.userEmail}` : 'Set up cloud sync'}"
            aria-label="Settings"
          >
            <sp-icon-settings slot="icon"></sp-icon-settings>
          </sp-action-button>
        </sp-action-group>
      </div>
    `;
  }
}

customElements.define('app-navbar', AppNavbar);

