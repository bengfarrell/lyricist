import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../store/index';
import type { LyricLine } from '../store/index';
import { appControlsStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/action-button/sp-action-button.js';

/**
 * Controls component for adding new lyric lines or creating groups
 */
export class AppControls extends LitElement {
  static styles = appControlsStyles;
  
  private store = new SongStoreController(this);
  private _showCustomSectionInput: boolean = false;
  private _customSectionName: string = '';

  private _getWordLadderPlaceholder(): string {
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;
    
    const leftIndex = this.store.wordLadderSelectedLeft;
    const rightIndex = this.store.wordLadderSelectedRight;
    
    // Check if we should show word ladder text
    // This includes: actual selections OR when both lists are empty (showing placeholders)
    const hasLeftSelection = leftIndex !== -1 || leftWords.length === 0;
    const hasRightSelection = rightIndex !== -1 || rightWords.length === 0;
    
    if (hasLeftSelection && hasRightSelection) {
      // Get left word or placeholder
      let leftText: string;
      if (leftIndex !== -1 && leftWords.length > 0) {
        leftText = leftWords[leftIndex];
      } else {
        // Use category title for empty lists
        leftText = currentSet.leftColumn.title.toLowerCase();
      }
      
      // Get right word or placeholder
      let rightText: string;
      if (rightIndex !== -1 && rightWords.length > 0) {
        rightText = rightWords[rightIndex];
      } else {
        // Use category title for empty lists
        rightText = currentSet.rightColumn.title.toLowerCase();
      }
      
      return `${leftText} ${rightText}`;
    }
    
    return DEFAULT_LINE_TEXT;
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
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;
    
    // Pick random words or use -1 for placeholders
    let leftIndex = -1;
    let rightIndex = -1;
    
    if (leftWords.length > 0) {
      leftIndex = Math.floor(Math.random() * leftWords.length);
    }
    
    if (rightWords.length > 0) {
      rightIndex = Math.floor(Math.random() * rightWords.length);
    }
    
    // Store the selected indices so the left panel can show the connection
    this.store.setWordLadderSelection(leftIndex, rightIndex);
    
    // If both are actual words, set the value; otherwise clear it (will use placeholder)
    if (leftIndex !== -1 && rightIndex !== -1) {
      const combinedText = `${leftWords[leftIndex]} ${rightWords[rightIndex]}`;
      this.store.setNewLineInputText(combinedText);
    } else {
      // Clear the input value so placeholder shows
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
                <sp-textfield 
                  data-spectrum-pattern="textfield"
                  placeholder="Enter custom section name..."
                  .value=${this._customSectionName}
                  @input=${(e: InputEvent) => {
                    this._customSectionName = (e.target as HTMLInputElement).value;
                    this.requestUpdate();
                  }}
                ></sp-textfield>
                <sp-button type="submit" variant="primary" data-spectrum-pattern="button-primary">Create</sp-button>
                <sp-button type="button" variant="secondary" data-spectrum-pattern="button-secondary" @click=${() => {
                  this._showCustomSectionInput = false;
                  this._customSectionName = '';
                  this.requestUpdate();
                }}>Cancel</sp-button>
              </form>
            ` : html`
              <div class="section-buttons" data-spectrum-pattern="action-group-horizontal">
                ${sectionNames.map(name => html`
                  <sp-action-button 
                    data-spectrum-pattern="action-button"
                    @click=${() => this._handleSectionClick(name)}
                  >${name}</sp-action-button>
                `)}
              </div>
            `}
          </div>
        ` : html`
          <sp-action-button data-spectrum-pattern="action-button" @click=${this._rollDice} title="Roll the dice for random word combo!" aria-label="Roll random word combo">
            🎲
          </sp-action-button>
          <div class="lyric-creator">
            <div class="lyric-header">
              <span class="lyric-title">Enter a line of lyrics...</span>
            </div>
            <form class="input-container" data-spectrum-pattern="form" @submit=${this._addLine}>
              <sp-textfield 
                id="lyric-input"
                data-spectrum-pattern="textfield"
                placeholder=${inputPlaceholder}
                .value=${this.store.newLineInputText}
                @input=${this._handleInput}
              ></sp-textfield>
              <sp-button type="submit" variant="primary" data-spectrum-pattern="button-primary">Add Line</sp-button>
            </form>
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('app-controls', AppControls);

