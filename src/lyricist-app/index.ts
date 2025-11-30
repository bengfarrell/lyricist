import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { lyricistAppStyles } from './styles.css.ts';
import '../app-navbar/index';
import '../floating-strip/index';
import '../file-modal/index';
import '../lyric-canvas/index';
import '../lyrics-panel/index';
import '../left-panel/index';
import '../load-dialog/index';
import '../email-prompt/index';
import '../edit-modal/index.ts';

/**
 * Main application component that composes all child components
 */
export class LyricistApp extends LitElement {
  static styles = lyricistAppStyles;
  
  private store = new SongStoreController(this);

  render() {
    const currentPanel = this.store.currentPanel;
    const isCanvasLyricsLeft = currentPanel === 'canvas-lyrics-left';
    const isCanvasLyricsRight = currentPanel === 'canvas-lyrics-right';
    const isCanvasLyricsTop = currentPanel === 'canvas-lyrics-top';
    const isCanvasLyricsBottom = currentPanel === 'canvas-lyrics-bottom';
    const isHybridMode = isCanvasLyricsLeft || isCanvasLyricsRight || isCanvasLyricsTop || isCanvasLyricsBottom;
    
    return html`
      <sp-theme scale="medium" color="light" system="spectrum">
      <div class="container">
        <app-navbar></app-navbar>
        
        <div class="main-content">
          <left-panel class="panel ${currentPanel === 'word-ladder' ? 'visible' : 'hidden'}"></left-panel>
          
          <!-- Canvas visible in canvas mode and hybrid modes -->
          <lyric-canvas class="panel ${currentPanel === 'canvas' || isHybridMode ? 'visible' : 'hidden'}"></lyric-canvas>
          
          <!-- Lyrics as background overlay in hybrid modes -->
          ${isCanvasLyricsLeft ? html`
            <lyrics-panel class="panel-overlay panel-overlay-left visible" overlay></lyrics-panel>
          ` : ''}
          ${isCanvasLyricsRight ? html`
            <lyrics-panel class="panel-overlay panel-overlay-right visible" overlay></lyrics-panel>
          ` : ''}
          ${isCanvasLyricsTop ? html`
            <lyrics-panel class="panel-overlay panel-overlay-top visible" overlay></lyrics-panel>
          ` : ''}
          ${isCanvasLyricsBottom ? html`
            <lyrics-panel class="panel-overlay panel-overlay-bottom visible" overlay></lyrics-panel>
          ` : ''}
          
          <!-- Lyrics full screen in lyrics-only mode -->
          <lyrics-panel class="panel ${currentPanel === 'lyrics' ? 'visible' : 'hidden'}"></lyrics-panel>
        </div>

        <floating-strip></floating-strip>
      </div>

      <load-dialog></load-dialog>
      <file-modal></file-modal>
      <email-prompt></email-prompt>
      <edit-modal></edit-modal>
      </sp-theme>
    `;
  }
}

customElements.define('lyricist-app', LyricistApp);
