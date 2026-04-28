import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../utils/index';
import type { LyricLine } from '../utils/index';
import { appControlsStyles } from './styles.css.ts';

/**
 * Controls component for adding new lyric lines or creating groups
 */
export class AppControls extends LitElement {
  static styles = appControlsStyles;
  
  private store = new SongStoreController(this);
  private _showCustomSectionInput: boolean = false;
  private _customSectionName: string = '';

  private _getWordLadderPlaceholder(): string {
    const columns = this.store.wordLadderColumns;
    const selectedIndices = this.store.wordLadderSelectedIndices;

    if (columns.length === 0) {
      return DEFAULT_LINE_TEXT;
    }

    // Build text from selected words or placeholders
    const words: string[] = [];
    columns.forEach((column, index) => {
      const selectedIndex = selectedIndices[index] ?? -1;

      if (selectedIndex !== -1 && column.words.length > 0) {
        // Use selected word
        words.push(column.words[selectedIndex]);
      } else if (column.words.length === 0) {
        // Use column title as placeholder for empty lists
        words.push(column.title.toLowerCase());
      }
    });

    return words.length > 0 ? words.join(' ') : DEFAULT_LINE_TEXT;
  }

  private _addLine(e: Event): void {
    e.preventDefault();
    
    // Use the store's input value, or if empty, use the word ladder placeholder
    const text = this.store.newLineInputText.trim() || this._getWordLadderPlaceholder();

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
    // Update the store directly - this will trigger reactive updates
    this.store.setNewLineInputText(target.value);
  }

  private _rollDice(): void {
    const columns = this.store.wordLadderColumns;
    const randomColumnCount = this.store.wordLadderRandomColumnCount;

    if (columns.length === 0) return;

    // Filter out muted columns
    const activeColumnIndices = columns
      .map((col, index) => col.muted ? -1 : index)
      .filter(index => index !== -1);

    if (activeColumnIndices.length === 0) return; // No active columns

    // Determine how many columns to actually use (min of configured count and available columns)
    const numColumnsToUse = Math.min(randomColumnCount, activeColumnIndices.length);

    // Shuffle active column indices and take the first N
    const shuffled = [...activeColumnIndices].sort(() => Math.random() - 0.5);
    const selectedColumnIndices = shuffled.slice(0, numColumnsToUse);

    // Pick random words from those columns
    const selectedIndices = new Array(columns.length).fill(-1);

    for (const colIndex of selectedColumnIndices) {
      if (columns[colIndex].words.length > 0) {
        selectedIndices[colIndex] = Math.floor(Math.random() * columns[colIndex].words.length);
      }
    }

    // Store the selected indices
    this.store.setWordLadderSelection(selectedIndices);

    // Build the combined text from selected words
    const selectedWords = selectedIndices
      .map((index, colIndex) => index !== -1 ? columns[colIndex].words[index] : null)
      .filter(word => word !== null);

    if (selectedWords.length > 0) {
      this.store.setNewLineInputText(selectedWords.join(' '));
    } else {
      this.store.setNewLineInputText('');
    }

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
    
    // Compute dynamic placeholder based on word ladder selection
    const inputPlaceholder = this._getWordLadderPlaceholder();
    
    return html`
      <div class="controls">
        ${hasSelection ? html`
          <div class="group-creator">
            <div class="group-header">
              <span class="group-title">Create Section (${this.store.selectedLineIds.size} item${this.store.selectedLineIds.size !== 1 ? 's' : ''}, ${totalLines} line${totalLines !== 1 ? 's' : ''})</span>
            </div>
            
            ${this._showCustomSectionInput ? html`
              <form class="custom-section-form" data-spectrum-pattern="form" @submit=${this._handleCustomSectionSubmit}>
                <input
                  type="text"
                  class="custom-section-input"
                  data-spectrum-pattern="textfield"
                  placeholder="Enter custom section name..."
                  .value=${this._customSectionName}
                  @input=${(e: InputEvent) => {
                    this._customSectionName = (e.target as HTMLInputElement).value;
                    this.requestUpdate();
                  }}
                  @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                />
                <button type="submit" class="btn btn-primary" data-spectrum-pattern="button-primary">Create</button>
                <button type="button" class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${() => {
                  this._showCustomSectionInput = false;
                  this._customSectionName = '';
                  this.requestUpdate();
                }}>Cancel</button>
              </form>
            ` : html`
              <div class="section-buttons" data-spectrum-pattern="action-group-horizontal">
                ${sectionNames.map(name => html`
                  <button 
                    class="section-btn" 
                    data-spectrum-pattern="action-button"
                    @click=${() => this._handleSectionClick(name)}
                  >${name}</button>
                `)}
              </div>
            `}
          </div>
        ` : html`
          <button class="dice-btn" data-spectrum-pattern="action-button" @click=${this._rollDice} title="Roll the dice for random word combo!" aria-label="Roll random word combo">
            🎲
          </button>
          <div class="lyric-creator">
            <div class="lyric-header">
              <span class="lyric-title">Enter a line of lyrics...</span>
            </div>
            <form class="input-container" data-spectrum-pattern="form" @submit=${this._addLine}>
              <label for="lyric-input" class="visually-hidden" data-spectrum-pattern="field-label">Lyric line</label>
              <input
                id="lyric-input"
                type="text"
                class="lyric-input"
                data-spectrum-pattern="textfield"
                placeholder=${inputPlaceholder}
                .value=${this.store.newLineInputText}
                @input=${this._handleInput}
                @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
              />
              <button type="submit" class="btn btn-primary" data-spectrum-pattern="button-primary">Add Line</button>
            </form>
            <button
              class="config-btn"
              @click=${() => this.store.setShowWordLadderConfig(true)}
              title="Configure word ladder settings"
              aria-label="Configure word ladder"
            >
              ⚙️ Configure
            </button>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('app-controls', AppControls);

