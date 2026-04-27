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
  private _newWords: Map<number, string> = new Map(); // columnIndex -> input value
  private _editingTitles: Set<number> = new Set(); // which column indices are being edited
  private _editTitleValues: Map<number, string> = new Map(); // columnIndex -> title value

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

  private _getVisibleColumns() {
    const columns = this.store.wordLadderColumns;
    const offset = this.store.wordLadderColumnViewOffset;
    return columns.slice(offset, offset + 2);
  }

  private _getVisibleColumnIndices() {
    const offset = this.store.wordLadderColumnViewOffset;
    return [offset, offset + 1];
  }

  private _nextSet(): void {
    const wordSets = this.store.wordLadderSets;
    if (wordSets.length <= 1) return;
    const currentIndex = this.store.wordLadderSetIndex;
    const newIndex = (currentIndex + 1) % wordSets.length;
    if (newIndex !== currentIndex) {
      this.store.setWordLadderSetIndex(newIndex);
      this._newWords.clear();
      this._editingTitles.clear();
      this._editTitleValues.clear();
      this._selectRandomPairing();
    }
  }

  private _prevSet(): void {
    const wordSets = this.store.wordLadderSets;
    if (wordSets.length <= 1) return;
    const currentIndex = this.store.wordLadderSetIndex;
    const newIndex = (currentIndex - 1 + wordSets.length) % wordSets.length;
    if (newIndex !== currentIndex) {
      this.store.setWordLadderSetIndex(newIndex);
      this._newWords.clear();
      this._editingTitles.clear();
      this._editTitleValues.clear();
      this._selectRandomPairing();
    }
  }

  private _selectRandomPairing(): void {
    const columns = this.store.wordLadderColumns;

    // Pick random indices for each column
    const selectedIndices = columns.map(col => {
      return col.words.length > 0 ? Math.floor(Math.random() * col.words.length) : -1;
    });

    this.store.setWordLadderSelection(selectedIndices);
  }

  private _addSet(): void {
    this.store.addWordLadderSet();
    this._editingTitles.clear();
    this._editTitleValues.clear();
    this._newWords.clear();

    // Navigate to the newly added set (last one in the array)
    const newIndex = this.store.wordLadderSets.length - 1;
    this.store.setWordLadderSetIndex(newIndex);
  }

  private _startEditTitle(columnIndex: number): void {
    const columns = this.store.wordLadderColumns;
    const column = columns[columnIndex];
    if (!column) return;

    this._editTitleValues.set(columnIndex, column.title);
    this._editingTitles.add(columnIndex);
    this.requestUpdate();

    // Focus the input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector(`.edit-title-${columnIndex}`) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  private _saveTitle(columnIndex: number, e: Event): void {
    e.preventDefault();
    const titleValue = this._editTitleValues.get(columnIndex);
    if (titleValue?.trim()) {
      this.store.updateWordLadderColumnTitle(columnIndex, titleValue.trim());
    }
    this._editingTitles.delete(columnIndex);
    this._editTitleValues.delete(columnIndex);
  }

  private _cancelEditTitle(columnIndex: number): void {
    this._editingTitles.delete(columnIndex);
    this._editTitleValues.delete(columnIndex);
  }

  private _selectSuggestion(columnIndex: number, suggestion: string): void {
    this._editTitleValues.set(columnIndex, suggestion);
    this.store.updateWordLadderColumnTitle(columnIndex, suggestion);
    this._editingTitles.delete(columnIndex);
  }

  private _addWord(columnIndex: number, e?: Event): void {
    if (e) e.preventDefault();
    const input = this._newWords.get(columnIndex)?.trim();
    if (!input) return;

    const columns = this.store.wordLadderColumns;
    const column = columns[columnIndex];
    if (!column) return;

    // Split by commas and trim each word
    const wordsToAdd = input
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (wordsToAdd.length === 0) return;

    // Add all words to the column
    const newWords = [...column.words, ...wordsToAdd];
    this.store.setWordLadderColumnWords(columnIndex, newWords);
    this._newWords.set(columnIndex, '');

    // Auto-select the last added word
    const selectedIndices = [...this.store.wordLadderSelectedIndices];
    while (selectedIndices.length < columns.length) {
      selectedIndices.push(-1);
    }
    selectedIndices[columnIndex] = newWords.length - 1;

    this.store.setWordLadderSelection(selectedIndices);
  }

  private _handleInputBlur(columnIndex: number): void {
    this._addWord(columnIndex);
  }

  private _handleInputKeyDown(columnIndex: number, e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      e.preventDefault();
      this._addWord(columnIndex);
    }
  }

  private _removeWord(columnIndex: number, wordIndex: number): void {
    const columns = this.store.wordLadderColumns;
    const column = columns[columnIndex];
    if (!column) return;

    const newWords = column.words.filter((_, i) => i !== wordIndex);
    this.store.setWordLadderColumnWords(columnIndex, newWords);

    // Update selection
    const selectedIndices = [...this.store.wordLadderSelectedIndices];
    while (selectedIndices.length < columns.length) {
      selectedIndices.push(-1);
    }

    const currentIndex = selectedIndices[columnIndex] ?? -1;
    let newIndex = -1;

    if (newWords.length > 0) {
      // If we removed the selected word, pick a new random one
      if (wordIndex === currentIndex) {
        newIndex = Math.floor(Math.random() * newWords.length);
      } else if (currentIndex > wordIndex) {
        // Adjust the index if it changed due to removal
        newIndex = currentIndex - 1;
      } else {
        newIndex = currentIndex;
      }
    }

    selectedIndices[columnIndex] = newIndex;
    this.store.setWordLadderSelection(selectedIndices);
  }

  private _selectWord(columnIndex: number, wordIndex: number): void {
    const columns = this.store.wordLadderColumns;
    const selectedIndices = [...this.store.wordLadderSelectedIndices];

    // Ensure array is long enough
    while (selectedIndices.length < columns.length) {
      selectedIndices.push(-1);
    }

    selectedIndices[columnIndex] = wordIndex;
    this.store.setWordLadderSelection(selectedIndices);
  }

  render() {
    const visibleColumns = this._getVisibleColumns();
    const visibleColumnIndices = this._getVisibleColumnIndices();
    const selectedIndices = this.store.wordLadderSelectedIndices;
    const totalColumns = this.store.wordLadderColumns.length;
    const offset = this.store.wordLadderColumnViewOffset;

    const canGoBack = offset > 0;
    const canGoForward = offset + 2 < totalColumns;

    // Combine left and right suggestions
    const allSuggestions = [...new Set([...LEFT_CATEGORY_SUGGESTIONS, ...RIGHT_CATEGORY_SUGGESTIONS])];

    return html`
      <div class="left-panel-content">
        ${canGoBack || canGoForward || totalColumns > 2 ? html`
          <div class="column-nav">
            <button
              class="nav-btn"
              @click=${() => {
                const currentOffset = this.store.wordLadderColumnViewOffset;
                if (currentOffset > 0) {
                  this.store.setWordLadderColumnViewOffset(currentOffset - 1);
                }
              }}
              ?disabled=${!canGoBack}
              title="Previous columns"
            >‹</button>
            <span class="column-indicator">Columns ${offset + 1}-${Math.min(offset + 2, totalColumns)} of ${totalColumns}</span>
            <button
              class="nav-btn"
              @click=${() => {
                const totalColumns = this.store.wordLadderColumns.length;
                const currentOffset = this.store.wordLadderColumnViewOffset;
                if (currentOffset + 2 < totalColumns) {
                  this.store.setWordLadderColumnViewOffset(currentOffset + 1);
                }
              }}
              ?disabled=${!canGoForward}
              title="Next columns"
            >›</button>
            <button
              class="add-column-btn"
              @click=${() => this.store.addWordLadderColumn()}
              title="Add column"
            >+ Add Column</button>
          </div>
        ` : html`
          <div class="column-nav">
            <button
              class="add-column-btn"
              @click=${() => this.store.addWordLadderColumn()}
              title="Add column"
            >+ Add Column</button>
          </div>
        `}
        <div class="word-ladder">
          ${visibleColumns.map((column, viewIndex) => {
            const columnIndex = visibleColumnIndices[viewIndex];
            const isEditing = this._editingTitles.has(columnIndex);
            const editValue = this._editTitleValues.get(columnIndex) || '';
            const newWord = this._newWords.get(columnIndex) || '';
            const selectedWordIndex = selectedIndices[columnIndex] ?? -1;

            return html`
              <div class="word-column ${column.muted ? 'muted' : ''}">
                <div class="column-header">
                  ${isEditing ? html`
                    <div class="edit-title-container">
                      <form class="edit-title-form" data-spectrum-pattern="form" @submit=${(e: Event) => this._saveTitle(columnIndex, e)}>
                        <input
                          type="text"
                          class="edit-title-${columnIndex}"
                          data-spectrum-pattern="textfield"
                          .value=${editValue}
                          @input=${(e: InputEvent) => {
                            this._editTitleValues.set(columnIndex, (e.target as HTMLInputElement).value);
                            this.requestUpdate();
                          }}
                          @blur=${(e: Event) => this._saveTitle(columnIndex, e)}
                          @keydown=${(e: KeyboardEvent) => {
                            if (e.key === 'Escape') this._cancelEditTitle(columnIndex);
                          }}
                        />
                      </form>
                      <div class="suggestion-chips" data-spectrum-pattern="action-group-horizontal">
                        ${allSuggestions.map(suggestion => html`
                          <button
                            class="suggestion-chip"
                            data-spectrum-pattern="action-button"
                            @mousedown=${(e: Event) => { e.preventDefault(); this._selectSuggestion(columnIndex, suggestion); }}
                            type="button"
                          >${suggestion}</button>
                        `)}
                      </div>
                    </div>
                  ` : html`
                    <h3 class="column-title editable" @click=${() => this._startEditTitle(columnIndex)} title="Click to edit">${column.title}</h3>
                  `}
                  <button
                    class="mute-btn ${column.muted ? 'muted' : ''}"
                    @click=${() => this.store.toggleWordLadderColumnMuted(columnIndex)}
                    title="${column.muted ? 'Unmute column (include in randomization)' : 'Mute column (exclude from randomization)'}"
                    aria-label="${column.muted ? 'Unmute column' : 'Mute column'}"
                  >
                    ${column.muted ? '🔇' : '🔊'}
                  </button>
                </div>
                <div class="word-list">
                  <!-- Add word item at the top -->
                  <form class="word-item add-word-item" data-spectrum-pattern="form" @submit=${(e: Event) => this._addWord(columnIndex, e)} @click=${(e: MouseEvent) => {
                    const input = (e.currentTarget as HTMLFormElement).querySelector('.word-input-inline') as HTMLInputElement;
                    if (input) input.focus();
                  }}>
                    <input
                      type="text"
                      class="word-input-inline"
                      data-spectrum-pattern="textfield"
                      placeholder="+ Add word (or comma-separated list)..."
                      .value=${newWord}
                      @input=${(e: InputEvent) => {
                        this._newWords.set(columnIndex, (e.target as HTMLInputElement).value);
                        this.requestUpdate();
                      }}
                      @blur=${() => this._handleInputBlur(columnIndex)}
                      @keydown=${(e: KeyboardEvent) => this._handleInputKeyDown(columnIndex, e)}
                    />
                  </form>

                  ${column.words.map((word, wordIndex) => html`
                    <div class="word-item ${wordIndex === selectedWordIndex ? 'selected' : ''}" data-spectrum-pattern="list-item-selectable" @click=${() => this._selectWord(columnIndex, wordIndex)}>
                      <span class="word-text">${word}</span>
                      <button class="remove-btn" data-spectrum-pattern="action-button-quiet" @click=${(e: Event) => { e.stopPropagation(); this._removeWord(columnIndex, wordIndex); }} title="Remove">×</button>
                    </div>
                  `)}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define('left-panel', LeftPanel);

