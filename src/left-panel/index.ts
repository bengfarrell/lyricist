import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { leftPanelStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-close.js';

/**
 * Left panel component with word ladder feature
 */
interface WordSet {
  leftTitle: string;
  rightTitle: string;
  leftPlaceholder: string;
  rightPlaceholder: string;
  leftWords: string[];
  rightWords: string[];
}

// Common category suggestions
const LEFT_CATEGORY_SUGGESTIONS = [
  'Verbs',
  'Locations', 
  'Emotions',
  'Natural Elements',
  'Sounds'
];

const RIGHT_CATEGORY_SUGGESTIONS = [
  'Nouns',
  'Things in Room',
  'Adjectives',
  'Times of Day',
  'Colors & Textures',
  'Movements',
  'Moments'
];

export class LeftPanel extends LitElement {
  static styles = leftPanelStyles;
  
  private store = new SongStoreController(this);
  private _newLeftWord: string = '';
  private _newRightWord: string = '';
  private _editingLeftTitle: boolean = false;
  private _editingRightTitle: boolean = false;
  private _editLeftTitleValue: string = '';
  private _editRightTitleValue: string = '';

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('next-word-set', this._handleNextSet.bind(this));
    window.addEventListener('prev-word-set', this._handlePrevSet.bind(this));
    window.addEventListener('add-word-set', this._handleAddSet.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('next-word-set', this._handleNextSet.bind(this));
    window.removeEventListener('prev-word-set', this._handlePrevSet.bind(this));
    window.removeEventListener('add-word-set', this._handleAddSet.bind(this));
  }

  private _handleNextSet(): void {
    this._nextSet();
  }

  private _handlePrevSet(): void {
    this._prevSet();
  }

  private _handleAddSet(): void {
    this._addSet();
  }
  
  private _getWordSetConfig(): WordSet[] {
    // Convert the store's word ladder sets to the local WordSet format
    return this.store.wordLadderSets.map(set => ({
      leftTitle: set.leftColumn.title,
      rightTitle: set.rightColumn.title,
      leftPlaceholder: set.leftColumn.placeholder,
      rightPlaceholder: set.rightColumn.placeholder,
      leftWords: set.leftColumn.words,
      rightWords: set.rightColumn.words
    }));
  }

  private _getCurrentSet(): WordSet {
    const index = this.store.wordLadderSetIndex;
    const wordSets = this._getWordSetConfig();
    return wordSets[index] || {
      leftTitle: 'Left',
      rightTitle: 'Right',
      leftPlaceholder: 'word',
      rightPlaceholder: 'word',
      leftWords: [],
      rightWords: []
    };
  }

  private _nextSet(): void {
    const wordSets = this._getWordSetConfig();
    if (wordSets.length <= 1) return; // Don't navigate if there's only one or no sets
    const currentIndex = this.store.wordLadderSetIndex;
    const newIndex = (currentIndex + 1) % wordSets.length;
    if (newIndex !== currentIndex) {
      this.store.setWordLadderSetIndex(newIndex);
      this._newLeftWord = '';
      this._newRightWord = '';
      this._editingLeftTitle = false;
      this._editingRightTitle = false;
      this._selectRandomPairing();
    }
  }

  private _prevSet(): void {
    const wordSets = this._getWordSetConfig();
    if (wordSets.length <= 1) return; // Don't navigate if there's only one or no sets
    const currentIndex = this.store.wordLadderSetIndex;
    const newIndex = (currentIndex - 1 + wordSets.length) % wordSets.length;
    if (newIndex !== currentIndex) {
      this.store.setWordLadderSetIndex(newIndex);
      this._newLeftWord = '';
      this._newRightWord = '';
      this._editingLeftTitle = false;
      this._editingRightTitle = false;
      this._selectRandomPairing();
    }
  }

  private _selectRandomPairing(): void {
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;

    // Pick random indices if words are available, otherwise select placeholders
    let leftIndex = -1;
    let rightIndex = -1;

    if (leftWords.length > 0) {
      leftIndex = Math.floor(Math.random() * leftWords.length);
    } else {
      // Select placeholder by using -1
      leftIndex = -1;
    }

    if (rightWords.length > 0) {
      rightIndex = Math.floor(Math.random() * rightWords.length);
    } else {
      // Select placeholder by using -1
      rightIndex = -1;
    }

    // Always set selection, even if both are placeholders
    this.store.setWordLadderSelection(leftIndex, rightIndex);
  }

  private _addSet(): void {
    this.store.addWordLadderSet();
    this._editingLeftTitle = false;
    this._editingRightTitle = false;
    
    // Navigate to the newly added set (last one in the array)
    const newIndex = this.store.wordLadderSets.length - 1;
    this.store.setWordLadderSetIndex(newIndex);
  }

  private _startEditLeftTitle(): void {
    const currentSet = this.store.currentWordLadderSet;
    this._editLeftTitleValue = currentSet.leftColumn.title;
    this._editingLeftTitle = true;
    this.requestUpdate();
    
    // Focus the input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('.edit-left-title') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  private _startEditRightTitle(): void {
    const currentSet = this.store.currentWordLadderSet;
    this._editRightTitleValue = currentSet.rightColumn.title;
    this._editingRightTitle = true;
    this.requestUpdate();
    
    // Focus the input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('.edit-right-title') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  private _saveLeftTitle(e: Event): void {
    e.preventDefault();
    if (this._editLeftTitleValue.trim()) {
      this.store.updateWordLadderColumnTitle('left', this._editLeftTitleValue.trim());
    }
    this._editingLeftTitle = false;
  }

  private _saveRightTitle(e: Event): void {
    e.preventDefault();
    if (this._editRightTitleValue.trim()) {
      this.store.updateWordLadderColumnTitle('right', this._editRightTitleValue.trim());
    }
    this._editingRightTitle = false;
  }

  private _cancelEditLeftTitle(): void {
    this._editingLeftTitle = false;
  }

  private _cancelEditRightTitle(): void {
    this._editingRightTitle = false;
  }

  private _selectLeftSuggestion(suggestion: string): void {
    this._editLeftTitleValue = suggestion;
    this.store.updateWordLadderColumnTitle('left', suggestion);
    this._editingLeftTitle = false;
  }

  private _selectRightSuggestion(suggestion: string): void {
    this._editRightTitleValue = suggestion;
    this.store.updateWordLadderColumnTitle('right', suggestion);
    this._editingRightTitle = false;
  }

  private _addLeftWord(e?: Event): void {
    if (e) e.preventDefault();
    const word = this._newLeftWord.trim();
    if (!word) return;
    
    const currentSet = this.store.currentWordLadderSet;
    const newWords = [...currentSet.leftColumn.words, word];
    this.store.setWordLadderLeftWords(newWords);
    this._newLeftWord = '';
    
    // Auto-select the newly added word
    const newIndex = newWords.length - 1;
    
    // If right column has words, select the first one (or keep current selection)
    const rightWords = currentSet.rightColumn.words;
    let rightIndex = this.store.wordLadderSelectedRight;
    
    // If no right selection yet but right words exist, select the first one
    if (rightIndex === -1 && rightWords.length > 0) {
      rightIndex = 0;
    }
    
    this.store.setWordLadderSelection(newIndex, rightIndex);
  }
  
  private _handleLeftInputBlur(): void {
    this._addLeftWord();
  }
  
  private _handleLeftInputKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      e.preventDefault();
      this._addLeftWord();
      // Focus the right input
      this.updateComplete.then(() => {
        const rightInput = this.shadowRoot?.querySelector('.word-column:nth-child(2) .word-input-inline') as HTMLInputElement;
        if (rightInput) rightInput.focus();
      });
    }
  }

  private _addRightWord(e?: Event): void {
    if (e) e.preventDefault();
    const word = this._newRightWord.trim();
    if (!word) return;
    
    const currentSet = this.store.currentWordLadderSet;
    const newWords = [...currentSet.rightColumn.words, word];
    this.store.setWordLadderRightWords(newWords);
    this._newRightWord = '';
    
    // Auto-select the newly added word
    const newIndex = newWords.length - 1;
    
    // If left column has words, select the first one (or keep current selection)
    const leftWords = currentSet.leftColumn.words;
    let leftIndex = this.store.wordLadderSelectedLeft;
    
    // If no left selection yet but left words exist, select the first one
    if (leftIndex === -1 && leftWords.length > 0) {
      leftIndex = 0;
    }
    
    this.store.setWordLadderSelection(leftIndex, newIndex);
  }
  
  private _handleRightInputBlur(): void {
    this._addRightWord();
  }
  
  private _handleRightInputKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      e.preventDefault();
      this._addRightWord();
      // Focus the left input (wrap around)
      this.updateComplete.then(() => {
        const leftInput = this.shadowRoot?.querySelector('.word-column:nth-child(1) .word-input-inline') as HTMLInputElement;
        if (leftInput) leftInput.focus();
      });
    }
  }

  private _removeLeftWord(wordIndex: number): void {
    const currentSet = this.store.currentWordLadderSet;
    const newWords = currentSet.leftColumn.words.filter((_, i) => i !== wordIndex);
    this.store.setWordLadderLeftWords(newWords);
    
    // Auto-select a new random word from the remaining words
    let newLeftIndex = -1;
    if (newWords.length > 0) {
      // If we removed the selected word, pick a new random one
      if (wordIndex === this.store.wordLadderSelectedLeft) {
        newLeftIndex = Math.floor(Math.random() * newWords.length);
      } else {
        // Adjust the index if it changed due to removal
        const currentIndex = this.store.wordLadderSelectedLeft;
        if (currentIndex > wordIndex) {
          newLeftIndex = currentIndex - 1;
        } else {
          newLeftIndex = currentIndex;
        }
      }
    }
    
    this.store.setWordLadderSelection(newLeftIndex, this.store.wordLadderSelectedRight);
  }

  private _removeRightWord(wordIndex: number): void {
    const currentSet = this.store.currentWordLadderSet;
    const newWords = currentSet.rightColumn.words.filter((_, i) => i !== wordIndex);
    this.store.setWordLadderRightWords(newWords);
    
    // Auto-select a new random word from the remaining words
    let newRightIndex = -1;
    if (newWords.length > 0) {
      // If we removed the selected word, pick a new random one
      if (wordIndex === this.store.wordLadderSelectedRight) {
        newRightIndex = Math.floor(Math.random() * newWords.length);
      } else {
        // Adjust the index if it changed due to removal
        const currentIndex = this.store.wordLadderSelectedRight;
        if (currentIndex > wordIndex) {
          newRightIndex = currentIndex - 1;
        } else {
          newRightIndex = currentIndex;
        }
      }
    }
    
    this.store.setWordLadderSelection(this.store.wordLadderSelectedLeft, newRightIndex);
  }

  private _selectLeftWord(index: number): void {
    const currentSet = this._getCurrentSet();
    const rightIndex = this.store.wordLadderSelectedRight;
    this.store.setWordLadderSelection(index, rightIndex);
    
    // Update input text if both words are selected
    if (index !== -1 && rightIndex !== -1) {
      const leftWord = currentSet.leftWords[index];
      const rightWord = currentSet.rightWords[rightIndex];
      this.store.setNewLineInputText(`${leftWord} ${rightWord}`);
    }
  }

  private _selectRightWord(index: number): void {
    const currentSet = this._getCurrentSet();
    const leftIndex = this.store.wordLadderSelectedLeft;
    this.store.setWordLadderSelection(leftIndex, index);
    
    // Update input text if both words are selected
    if (leftIndex !== -1 && index !== -1) {
      const leftWord = currentSet.leftWords[leftIndex];
      const rightWord = currentSet.rightWords[index];
      this.store.setNewLineInputText(`${leftWord} ${rightWord}`);
    }
  }

  render() {
    const currentSet = this._getCurrentSet();
    const leftWords = currentSet.leftWords;
    const rightWords = currentSet.rightWords;
    const hasMultipleSets = this._getWordSetConfig().length > 1;
    
    return html`
      <div class="left-panel-content">
        <div class="word-ladder">
          <div class="word-column">
            ${this._editingLeftTitle ? html`
              <div class="edit-title-container">
                <form class="edit-title-form" data-spectrum-pattern="form" @submit=${this._saveLeftTitle}>
                  <sp-textfield
                    aria-label="Edit category title"
                    data-spectrum-pattern="textfield"
                  .value=${this._editLeftTitleValue}
                  @input=${(e: InputEvent) => {
                    this._editLeftTitleValue = (e.target as HTMLInputElement).value;
                  }}
                    @blur=${this._saveLeftTitle}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Escape') this._cancelEditLeftTitle();
                    }}
                  ></sp-textfield>
                </form>
                <div class="suggestion-chips" data-spectrum-pattern="action-group-horizontal">
                  ${LEFT_CATEGORY_SUGGESTIONS.map(suggestion => html`
                    <sp-action-button 
                      data-spectrum-pattern="action-button"
                      @mousedown=${(e: Event) => { e.preventDefault(); this._selectLeftSuggestion(suggestion); }}
                    >${suggestion}</sp-action-button>
                  `)}
                </div>
              </div>
            ` : html`
              <h3 class="column-title editable" @click=${this._startEditLeftTitle} title="Click to edit">${currentSet.leftTitle}</h3>
            `}
            <div class="word-list">
              <!-- Add word item at the top -->
              <form class="word-item add-word-item" data-spectrum-pattern="form" @submit=${this._addLeftWord} @click=${(e: MouseEvent) => {
                const input = (e.currentTarget as HTMLFormElement).querySelector('sp-textfield') as HTMLInputElement;
                if (input) input.focus();
              }}>
                <sp-textfield
                  quiet
                  aria-label="Add word to left column"
                  data-spectrum-pattern="textfield"
                  placeholder="+ Add word..."
                .value=${this._newLeftWord}
                @input=${(e: InputEvent) => {
                  this._newLeftWord = (e.target as HTMLInputElement).value;
                }}
                  @blur=${this._handleLeftInputBlur}
                  @keydown=${this._handleLeftInputKeyDown}
                ></sp-textfield>
              </form>
              
              ${leftWords.map((word, index) => html`
                <div class="word-item ${index === this.store.wordLadderSelectedLeft ? 'selected' : ''}" data-spectrum-pattern="list-item-selectable" @click=${() => this._selectLeftWord(index)}>
                  <span class="word-text">${word}</span>
                  <sp-action-button quiet data-spectrum-pattern="action-button-quiet" @click=${(e: Event) => { e.stopPropagation(); this._removeLeftWord(index); }} title="Remove">
                    <sp-icon-close slot="icon"></sp-icon-close>
                  </sp-action-button>
                </div>
              `)}
            </div>
          </div>

          <div class="word-column">
            ${this._editingRightTitle ? html`
              <div class="edit-title-container">
                <form class="edit-title-form" data-spectrum-pattern="form" @submit=${this._saveRightTitle}>
                  <sp-textfield
                    data-spectrum-pattern="textfield"
                  .value=${this._editRightTitleValue}
                  @input=${(e: InputEvent) => {
                    this._editRightTitleValue = (e.target as HTMLInputElement).value;
                  }}
                    @blur=${this._saveRightTitle}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Escape') this._cancelEditRightTitle();
                    }}
                  ></sp-textfield>
                </form>
                <div class="suggestion-chips" data-spectrum-pattern="action-group-horizontal">
                  ${RIGHT_CATEGORY_SUGGESTIONS.map(suggestion => html`
                    <sp-action-button 
                      data-spectrum-pattern="action-button"
                      @mousedown=${(e: Event) => { e.preventDefault(); this._selectRightSuggestion(suggestion); }}
                    >${suggestion}</sp-action-button>
                  `)}
                </div>
              </div>
            ` : html`
              <h3 class="column-title editable" @click=${this._startEditRightTitle} title="Click to edit">${currentSet.rightTitle}</h3>
            `}
            <div class="word-list">
              <!-- Add word item at the top -->
              <form class="word-item add-word-item" data-spectrum-pattern="form" @submit=${this._addRightWord} @click=${(e: MouseEvent) => {
                const input = (e.currentTarget as HTMLFormElement).querySelector('sp-textfield') as HTMLInputElement;
                if (input) input.focus();
              }}>
                <sp-textfield
                  quiet
                  aria-label="Add word to right column"
                  data-spectrum-pattern="textfield"
                  placeholder="+ Add word..."
                .value=${this._newRightWord}
                @input=${(e: InputEvent) => {
                  this._newRightWord = (e.target as HTMLInputElement).value;
                }}
                  @blur=${this._handleRightInputBlur}
                  @keydown=${this._handleRightInputKeyDown}
                ></sp-textfield>
              </form>
              
              ${rightWords.map((word, index) => html`
                <div class="word-item ${index === this.store.wordLadderSelectedRight ? 'selected' : ''}" data-spectrum-pattern="list-item-selectable" @click=${() => this._selectRightWord(index)}>
                  <span class="word-text">${word}</span>
                  <sp-action-button quiet data-spectrum-pattern="action-button-quiet" @click=${(e: Event) => { e.stopPropagation(); this._removeRightWord(index); }} title="Remove">
                    <sp-icon-close slot="icon"></sp-icon-close>
                  </sp-action-button>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('left-panel', LeftPanel);

