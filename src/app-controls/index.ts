import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index.js';
import type { LyricLine } from '../store/index.js';
import { appControlsStyles } from './styles.css.js';

/**
 * Controls component for adding new lyric lines
 */
export class AppControls extends LitElement {
  static styles = appControlsStyles;
  
  private store = new SongStoreController(this);
  private _newLineText: string = '';

  private _addLine(e: Event): void {
    e.preventDefault();
    const input = this.shadowRoot?.querySelector('.lyric-input') as HTMLInputElement;
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;

    // Generate a subtle random rotation between -5 and +5 degrees
    const rotation = (Math.random() * 10) - 5;
    
    const maxZ = this.store.getMaxZIndex();
    
    // Position new lines in center, staggered vertically
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      chords: [],
      hasChordSection: false,
      x: 150, // Default x position
      y: 100 + (this.store.lines.length * 60), // Stagger by 60px
      rotation,
      zIndex: maxZ + 1
    };

    this.store.addLine(newLine);
    input.value = '';
    this._newLineText = '';
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="controls">
        <form class="input-container" @submit=${this._addLine}>
          <input 
            type="text" 
            class="lyric-input" 
            placeholder="Enter a line of lyrics..."
            .value=${this._newLineText}
            @input=${(e: InputEvent) => this._newLineText = (e.target as HTMLInputElement).value}
          />
          <button type="submit" class="btn btn-primary">Add Line</button>
        </form>
      </div>
    `;
  }
}

customElements.define('app-controls', AppControls);

