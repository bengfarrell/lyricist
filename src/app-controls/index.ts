import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../store/index.js';
import type { LyricLine } from '../store/index.js';
import { appControlsStyles } from './styles.css.js';

/**
 * Controls component for adding new lyric lines or creating groups
 */
export class AppControls extends LitElement {
  static styles = appControlsStyles;
  
  private store = new SongStoreController(this);
  private _showCustomSectionInput: boolean = false;
  private _customSectionName: string = '';
  private _inputValue: string = '';

  private _addLine(e: Event): void {
    e.preventDefault();
    
    // Use the input value or default text if empty
    const text = this._inputValue.trim() || DEFAULT_LINE_TEXT;

    // Generate a subtle random rotation between -5 and +5 degrees
    const rotation = (Math.random() * 10) - 5;
    
    const maxZ = this.store.getMaxZIndex();
    
    // Position new lines in center, staggered vertically
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'line',
      text,
      chords: [],
      hasChordSection: false,
      x: 150, // Default x position
      y: 100 + (this.store.lines.length * 60), // Stagger by 60px
      rotation,
      zIndex: maxZ + 1
    };

    this.store.addLine(newLine);
    // Don't clear the input - keep the text for reuse
  }
  
  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this._inputValue = target.value;
    // Also update the store so canvas clicks can use it
    this.store.setNewLineInputText(target.value);
    this.requestUpdate();
  }
  
  private _createGroup(sectionName: string): void {
    if (!sectionName.trim()) return;
    
    this.store.createGroup(sectionName.trim());
    this._showCustomSectionInput = false;
    this._customSectionName = '';
    this.requestUpdate();
  }
  
  private _handleSectionClick(sectionName: string): void {
    if (sectionName === 'Custom') {
      this._showCustomSectionInput = true;
      this.requestUpdate();
      // Focus the input after render
      this.updateComplete.then(() => {
        const input = this.shadowRoot?.querySelector('.custom-section-input') as HTMLInputElement;
        if (input) input.focus();
      });
    } else {
      this._createGroup(sectionName);
    }
  }
  
  private _handleCustomSectionSubmit(e: Event): void {
    e.preventDefault();
    if (this._customSectionName.trim()) {
      this._createGroup(this._customSectionName);
    }
  }

  render() {
    const hasSelection = this.store.selectedLineIds.size > 0;
    
    // Common section names
    const sectionNames = ['Verse', 'Chorus', 'Bridge', 'Intro', 'Outro', 'Pre-Chorus', 'Hook', 'Custom'];
    
    // Count selected items and lines
    const selectedItems = this.store.items.filter(item => this.store.selectedLineIds.has(item.id));
    const totalLines = selectedItems.reduce((count, item) => {
      if (item.type === 'line') return count + 1;
      if (item.type === 'group') return count + item.lines.length;
      return count;
    }, 0);
    
    return html`
      <div class="controls">
        ${hasSelection ? html`
          <div class="group-creator">
            <div class="group-header">
              <span class="group-title">Create Section (${this.store.selectedLineIds.size} item${this.store.selectedLineIds.size !== 1 ? 's' : ''}, ${totalLines} line${totalLines !== 1 ? 's' : ''})</span>
            </div>
            
            ${this._showCustomSectionInput ? html`
              <form class="custom-section-form" @submit=${this._handleCustomSectionSubmit}>
                <input 
                  type="text" 
                  class="custom-section-input" 
                  placeholder="Enter custom section name..."
                  .value=${this._customSectionName}
                  @input=${(e: InputEvent) => {
                    this._customSectionName = (e.target as HTMLInputElement).value;
                    this.requestUpdate();
                  }}
                />
                <button type="submit" class="btn btn-primary">Create</button>
                <button type="button" class="btn btn-secondary" @click=${() => {
                  this._showCustomSectionInput = false;
                  this._customSectionName = '';
                  this.requestUpdate();
                }}>Cancel</button>
              </form>
            ` : html`
              <div class="section-buttons">
                ${sectionNames.map(name => html`
                  <button 
                    class="section-btn" 
                    @click=${() => this._handleSectionClick(name)}
                  >${name}</button>
                `)}
              </div>
            `}
          </div>
        ` : html`
          <form class="input-container" @submit=${this._addLine}>
            <label for="lyric-input" class="visually-hidden">Lyric line</label>
            <input 
              id="lyric-input"
              type="text" 
              class="lyric-input" 
              placeholder=${DEFAULT_LINE_TEXT}
              .value=${this._inputValue}
              @input=${this._handleInput}
            />
            <button type="submit" class="btn btn-primary">Add Line</button>
          </form>
        `}
      </div>
    `;
  }
}

customElements.define('app-controls', AppControls);

