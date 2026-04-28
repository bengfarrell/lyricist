import { LitElement, html } from 'lit';
import { SongStoreController } from '../utils/index';
import { lyricistAppStyles } from './styles.css.ts';
import { keyboardManager } from '../utils/keyboard-manager';
import '../app-navbar/index';
import '../floating-strip/index';
import '../file-modal/index';
import '../lyric-canvas/index';
import '../lyrics-panel/index';
import '../left-panel/index';
import '../load-dialog/index';
import '../email-prompt/index';
import '../edit-modal/index.ts';
import '../word-ladder-config-modal/index.ts';

/**
 * Main application component that composes all child components
 */
export class LyricistApp extends LitElement {
  static styles = lyricistAppStyles;

  private store = new SongStoreController(this);

  connectedCallback(): void {
    super.connectedCallback();
    // Initialize global keyboard shortcuts
    keyboardManager.init();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // Clean up keyboard shortcuts
    keyboardManager.destroy();
  }

  render() {
    const currentPanel = this.store.currentPanel;

    return html`
      <div class="container">
        <app-navbar></app-navbar>

        <div class="main-content">
          <left-panel class="panel ${currentPanel === 'word-ladder' ? 'visible' : 'hidden'}"></left-panel>
          <lyric-canvas class="panel ${currentPanel === 'canvas' ? 'visible' : 'hidden'}"></lyric-canvas>
          <lyrics-panel class="panel ${currentPanel === 'lyrics' ? 'visible' : 'hidden'}"></lyrics-panel>
        </div>

        <floating-strip></floating-strip>
      </div>

      <load-dialog></load-dialog>
      <file-modal></file-modal>
      <email-prompt></email-prompt>
      <edit-modal></edit-modal>
      <word-ladder-config-modal></word-ladder-config-modal>
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);
