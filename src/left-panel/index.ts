import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { leftPanelStyles } from './styles.css.ts';

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
    this._updateInputText();
  }

  private _addSet(): void {
    this.store.addWordLadderSet();
    this._editingLeftTitle = false;
    this._editingRightTitle = false;
    
    // Navigate to the newly added set (last one in the array)
    const newIndex = this.store.wordLadderSets.length - 1;
    this.store.setWordLadderSetIndex(newIndex);
    
    // Auto-select placeholders for the new empty category
    this._selectRandomPairing();
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

  private _addLeftWord(e: Event): void {
    e.preventDefault();
    const word = this._newLeftWord.trim();
    if (!word) return;
    
    const currentSet = this.store.currentWordLadderSet;
    const newWords = [...currentSet.leftColumn.words, word];
    this.store.setWordLadderLeftWords(newWords);
    this._newLeftWord = '';
  }

  private _addRightWord(e: Event): void {
    e.preventDefault();
    const word = this._newRightWord.trim();
    if (!word) return;
    
    const currentSet = this.store.currentWordLadderSet;
    const newWords = [...currentSet.rightColumn.words, word];
    this.store.setWordLadderRightWords(newWords);
    this._newRightWord = '';
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
    this._updateInputText();
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
    this._updateInputText();
  }

  private _selectLeftWord(index: number): void {
    const rightIndex = this.store.wordLadderSelectedRight;
    this.store.setWordLadderSelection(index, rightIndex);
    this._updateInputText();
  }

  private _selectRightWord(index: number): void {
    const leftIndex = this.store.wordLadderSelectedLeft;
    this.store.setWordLadderSelection(leftIndex, index);
    this._updateInputText();
  }

  private _updateInputText(): void {
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;
    const leftIndex = this.store.wordLadderSelectedLeft;
    const rightIndex = this.store.wordLadderSelectedRight;

    // If both sides have valid word selections, update the input text
    if (leftIndex !== -1 && rightIndex !== -1 && 
        leftWords.length > 0 && rightWords.length > 0) {
      const combinedText = `${leftWords[leftIndex]} ${rightWords[rightIndex]}`;
      this.store.setNewLineInputText(combinedText);
    } else if (leftIndex === -1 && rightIndex === -1 && 
               leftWords.length === 0 && rightWords.length === 0) {
      // Both are placeholders in an empty category - use category titles
      const combinedText = `${currentSet.leftColumn.title.toLowerCase()} ${currentSet.rightColumn.title.toLowerCase()}`;
      this.store.setNewLineInputText(combinedText);
    } else {
      // Clear the input to show placeholder
      this.store.setNewLineInputText('');
    }
  }

  render() {
    const currentSet = this._getCurrentSet();
    const leftWords = currentSet.leftWords;
    const rightWords = currentSet.rightWords;
    const hasMultipleSets = this._getWordSetConfig().length > 1;
    
    return html`
      <div class="left-panel-header">
        <button class="carousel-btn" data-spectrum-pattern="action-button-quiet" @click=${this._prevSet} ?disabled=${!hasMultipleSets} title="Previous set">‹</button>
        <h2 class="header-title">📝 Word Ladder</h2>
        <button class="carousel-btn" data-spectrum-pattern="action-button-quiet" @click=${this._nextSet} ?disabled=${!hasMultipleSets} title="Next set">›</button>
        <button class="add-set-btn" data-spectrum-pattern="action-button" @click=${this._addSet} title="Add new category">+</button>
      </div>
      <div class="left-panel-content">
        <div class="word-ladder">
          <div class="word-column">
            ${this._editingLeftTitle ? html`
              <div class="edit-title-container">
                <form class="edit-title-form" data-spectrum-pattern="form" @submit=${this._saveLeftTitle}>
                  <input
                    type="text"
                    class="edit-left-title"
                    data-spectrum-pattern="textfield"
                    .value=${this._editLeftTitleValue}
                    @input=${(e: InputEvent) => {
                      this._editLeftTitleValue = (e.target as HTMLInputElement).value;
                      this.requestUpdate();
                    }}
                    @blur=${this._saveLeftTitle}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Escape') this._cancelEditLeftTitle();
                    }}
                  />
                </form>
                <div class="suggestion-chips" data-spectrum-pattern="action-group-horizontal">
                  ${LEFT_CATEGORY_SUGGESTIONS.map(suggestion => html`
                    <button 
                      class="suggestion-chip"
                      data-spectrum-pattern="action-button"
                      @mousedown=${(e: Event) => { e.preventDefault(); this._selectLeftSuggestion(suggestion); }}
                      type="button"
                    >${suggestion}</button>
                  `)}
                </div>
              </div>
            ` : html`
              <h3 class="column-title editable" @click=${this._startEditLeftTitle} title="Click to edit">${currentSet.leftTitle}</h3>
            `}
            <div class="word-list">
              ${leftWords.length === 0 ? html`
                <div class="word-item placeholder ${this.store.wordLadderSelectedLeft === -1 && (this.store.wordLadderSelectedRight !== -1 || rightWords.length === 0) ? 'selected' : ''}" data-spectrum-pattern="list-item">
                  <span class="word-text">${currentSet.leftTitle.toLowerCase()}</span>
                </div>
              ` : leftWords.map((word, index) => html`
                <div class="word-item ${index === this.store.wordLadderSelectedLeft ? 'selected' : ''}" data-spectrum-pattern="list-item-selectable" @click=${() => this._selectLeftWord(index)}>
                  <span class="word-text">${word}</span>
                  <button class="remove-btn" data-spectrum-pattern="action-button-quiet" @click=${(e: Event) => { e.stopPropagation(); this._removeLeftWord(index); }} title="Remove">×</button>
                </div>
              `)}
            </div>
            <form class="add-word-form" data-spectrum-pattern="form" @submit=${this._addLeftWord}>
              <input
                type="text"
                class="word-input"
                data-spectrum-pattern="textfield"
                placeholder="Add..."
                .value=${this._newLeftWord}
                @input=${(e: InputEvent) => {
                  this._newLeftWord = (e.target as HTMLInputElement).value;
                  this.requestUpdate();
                }}
              />
              <button type="submit" class="add-btn" data-spectrum-pattern="action-button" title="Add word">+</button>
            </form>
          </div>

          <div class="word-column">
            ${this._editingRightTitle ? html`
              <div class="edit-title-container">
                <form class="edit-title-form" data-spectrum-pattern="form" @submit=${this._saveRightTitle}>
                  <input
                    type="text"
                    class="edit-right-title"
                    data-spectrum-pattern="textfield"
                    .value=${this._editRightTitleValue}
                    @input=${(e: InputEvent) => {
                      this._editRightTitleValue = (e.target as HTMLInputElement).value;
                      this.requestUpdate();
                    }}
                    @blur=${this._saveRightTitle}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Escape') this._cancelEditRightTitle();
                    }}
                  />
                </form>
                <div class="suggestion-chips" data-spectrum-pattern="action-group-horizontal">
                  ${RIGHT_CATEGORY_SUGGESTIONS.map(suggestion => html`
                    <button 
                      class="suggestion-chip"
                      data-spectrum-pattern="action-button"
                      @mousedown=${(e: Event) => { e.preventDefault(); this._selectRightSuggestion(suggestion); }}
                      type="button"
                    >${suggestion}</button>
                  `)}
                </div>
              </div>
            ` : html`
              <h3 class="column-title editable" @click=${this._startEditRightTitle} title="Click to edit">${currentSet.rightTitle}</h3>
            `}
            <div class="word-list">
              ${rightWords.length === 0 ? html`
                <div class="word-item placeholder ${this.store.wordLadderSelectedRight === -1 && (this.store.wordLadderSelectedLeft !== -1 || leftWords.length === 0) ? 'selected' : ''}" data-spectrum-pattern="list-item">
                  <span class="word-text">${currentSet.rightTitle.toLowerCase()}</span>
                </div>
              ` : rightWords.map((word, index) => html`
                <div class="word-item ${index === this.store.wordLadderSelectedRight ? 'selected' : ''}" data-spectrum-pattern="list-item-selectable" @click=${() => this._selectRightWord(index)}>
                  <span class="word-text">${word}</span>
                  <button class="remove-btn" data-spectrum-pattern="action-button-quiet" @click=${(e: Event) => { e.stopPropagation(); this._removeRightWord(index); }} title="Remove">×</button>
                </div>
              `)}
            </div>
            <form class="add-word-form" data-spectrum-pattern="form" @submit=${this._addRightWord}>
              <input
                type="text"
                class="word-input"
                data-spectrum-pattern="textfield"
                placeholder="Add..."
                .value=${this._newRightWord}
                @input=${(e: InputEvent) => {
                  this._newRightWord = (e.target as HTMLInputElement).value;
                  this.requestUpdate();
                }}
              />
              <button type="submit" class="add-btn" data-spectrum-pattern="action-button" title="Add word">+</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('left-panel', LeftPanel);

