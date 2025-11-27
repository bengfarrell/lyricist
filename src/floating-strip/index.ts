import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../store/index';
import type { LyricLine } from '../store/index';
import { floatingStripStyles } from './styles.css.ts';

/**
 * Floating header strip with controls and panel switcher
 */
export class FloatingStrip extends LitElement {
  static styles = floatingStripStyles;
  
  private store = new SongStoreController(this);
  private _showCustomSectionInput: boolean = false;
  private _customSectionName: string = '';
  private _showSectionPicker: boolean = false;

  private _getWordLadderPlaceholder(): string {
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;
    
    const leftIndex = this.store.wordLadderSelectedLeft;
    const rightIndex = this.store.wordLadderSelectedRight;
    
    // Only show word ladder combination if we have actual words selected
    if (leftIndex !== -1 && rightIndex !== -1 && 
        leftWords.length > 0 && rightWords.length > 0) {
      return `${leftWords[leftIndex]} ${rightWords[rightIndex]}`;
    }
    
    return "Add a song lyric here...";
  }

  private _addLine(e: Event): void {
    e.preventDefault();
    
    // If input is empty, try to use word ladder selection, otherwise use default
    let text = this.store.newLineInputText.trim();
    if (!text) {
      const currentSet = this.store.currentWordLadderSet;
      const leftWords = currentSet.leftColumn.words;
      const rightWords = currentSet.rightColumn.words;
      const leftIndex = this.store.wordLadderSelectedLeft;
      const rightIndex = this.store.wordLadderSelectedRight;
      
      if (leftIndex !== -1 && rightIndex !== -1 && 
          leftWords.length > 0 && rightWords.length > 0) {
        text = `${leftWords[leftIndex]} ${rightWords[rightIndex]}`;
      } else {
        text = DEFAULT_LINE_TEXT;
      }
    }
    
    const rotation = (Math.random() * 10) - 5;
    const maxZ = this.store.getMaxZIndex();
    
    const newLine: LyricLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'line',
      text,
      chords: [],
      hasChordSection: false,
      x: 150,
      y: 100 + (this.store.lines.length * 60),
      rotation,
      zIndex: maxZ + 1
    };

    this.store.addLine(newLine);
  }
  
  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.store.setNewLineInputText(target.value);
  }

  private _rollDice(): void {
    const currentSet = this.store.currentWordLadderSet;
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;
    
    let leftIndex = -1;
    let rightIndex = -1;
    
    if (leftWords.length > 0) {
      leftIndex = Math.floor(Math.random() * leftWords.length);
    }
    
    if (rightWords.length > 0) {
      rightIndex = Math.floor(Math.random() * rightWords.length);
    }
    
    // Update the selection - this should trigger a re-render via the reactive controller
    this.store.setWordLadderSelection(leftIndex, rightIndex);
    
    // Force update to ensure placeholder refreshes
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
    this._showSectionPicker = false;
    if (sectionName === 'Custom') {
      this._showCustomSectionInput = true;
      this.requestUpdate();
      this.updateComplete.then(() => {
        const input = this.shadowRoot?.querySelector('.custom-section-input') as HTMLInputElement;
        if (input) input.focus();
      });
    } else {
      this._createGroup(sectionName);
    }
  }

  private _toggleSectionPicker(): void {
    this._showSectionPicker = !this._showSectionPicker;
    this.requestUpdate();
  }
  
  private _handleCustomSectionSubmit(e: Event): void {
    e.preventDefault();
    if (this._customSectionName.trim()) {
      this._createGroup(this._customSectionName);
    }
  }

  private _alignItems(alignment: 'left' | 'center' | 'right'): void {
    // Find the canvas element to get its width and query items
    const app = document.querySelector('lyricist-app');
    if (!app || !app.shadowRoot) return;
    
    const canvas = app.shadowRoot.querySelector('lyric-canvas');
    if (!canvas || !canvas.shadowRoot) return;
    
    const canvasElement = canvas.shadowRoot.querySelector('.canvas') as HTMLElement;
    if (!canvasElement) return;
    
    const canvasWidth = canvasElement.offsetWidth;
    const padding = 40;
    
    // Get all selected items and their widths
    this.store.items.forEach(item => {
      if (!this.store.isLineSelected(item.id)) return;
      
      // Find the DOM element for this item
      const elementSelector = item.type === 'line' ? 'lyric-line' : 'lyric-group';
      const element = canvas.shadowRoot!.querySelector(`${elementSelector}[id="${item.id}"]`) as HTMLElement;
      if (!element) return;
      
      const itemWidth = element.offsetWidth;
      let newX = item.x;
      
      if (alignment === 'left') {
        newX = padding;
      } else if (alignment === 'center') {
        // Center the item (x is the center point)
        newX = (canvasWidth / 2) - (itemWidth / 2);
      } else if (alignment === 'right') {
        // Right align (x + width = right edge - padding)
        newX = canvasWidth - padding - itemWidth;
      }
      
      this.store.updateLinePosition(item.id, newX, item.y);
    });
  }

  private _toggleRetract(): void {
    this.store.setStripRetracted(!this.store.stripRetracted);
  }

  private _renderCanvasControls() {
    const hasSelection = this.store.selectedLineIds.size > 0;
    
    const selectedItems = this.store.items.filter(item => this.store.selectedLineIds.has(item.id));
    const totalLines = selectedItems.reduce((count, item) => {
      if (item.type === 'line') return count + 1;
      if (item.type === 'group') return count + item.lines.length;
      return count;
    }, 0);
    
    const inputPlaceholder = this._getWordLadderPlaceholder();

    return html`
      ${hasSelection ? html`
        <div class="group-creator">
          ${this._showCustomSectionInput ? html`
            <form class="custom-section-form" data-spectrum-pattern="form" @submit=${this._handleCustomSectionSubmit}>
              <input 
                type="text" 
                class="custom-section-input" 
                data-spectrum-pattern="textfield"
                placeholder="Enter section name..."
                .value=${this._customSectionName}
                @input=${(e: InputEvent) => {
                  this._customSectionName = (e.target as HTMLInputElement).value;
                  this.requestUpdate();
                }}
              />
              <button type="submit" class="btn btn-primary" data-spectrum-pattern="button-primary">Create</button>
              <button type="button" class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${() => {
                this._showCustomSectionInput = false;
                this._customSectionName = '';
                this.requestUpdate();
              }}>Cancel</button>
            </form>
          ` : html`
            <div class="group-controls">
              <div class="alignment-buttons" data-spectrum-pattern="action-group-horizontal">
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('left')} title="Align left">◧</button>
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('center')} title="Align center">◫</button>
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('right')} title="Align right">◨</button>
              </div>
              <div class="section-picker-wrapper">
                <button 
                  class="section-picker-btn" 
                  @click=${this._toggleSectionPicker}
                  data-spectrum-pattern="button-secondary"
                >
                  Section...
                </button>
                ${this._showSectionPicker ? html`
                  <div class="section-picker-overlay" data-spectrum-pattern="popover-bottom popover-open" @click=${() => { this._showSectionPicker = false; this.requestUpdate(); }}>
                    <div class="section-picker-panel" data-spectrum-pattern="menu" @click=${(e: Event) => e.stopPropagation()}>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Verse')}>Verse</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Chorus')}>Chorus</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Bridge')}>Bridge</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Intro')}>Intro</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Outro')}>Outro</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Pre-Chorus')}>Pre-Chorus</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Hook')}>Hook</button>
                      <button class="section-bubble" data-spectrum-pattern="menu-item" @click=${() => this._handleSectionClick('Custom')}>Custom...</button>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `}
        </div>
      ` : html`
        <button class="dice-btn-icon" data-spectrum-pattern="action-button" @click=${this._rollDice} title="Roll the dice for random word combo!" aria-label="Roll random word combo">
          🎲
        </button>
        <div class="lyric-creator">
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
            />
            <button type="submit" class="btn btn-primary" data-spectrum-pattern="button-primary">Add Lyric</button>
          </form>
        </div>
      `}
    `;
  }

  private _nextSet(): void {
    // Dispatch event to left-panel
    this.dispatchEvent(new CustomEvent('next-word-set', { bubbles: true, composed: true }));
  }

  private _prevSet(): void {
    // Dispatch event to left-panel
    this.dispatchEvent(new CustomEvent('prev-word-set', { bubbles: true, composed: true }));
  }

  private _addSet(): void {
    // Dispatch event to left-panel
    this.dispatchEvent(new CustomEvent('add-word-set', { bubbles: true, composed: true }));
  }

  private _copyLyrics(): void {
    // Dispatch event to lyrics-panel
    this.dispatchEvent(new CustomEvent('copy-lyrics', { bubbles: true, composed: true }));
  }

  private _renderWordLadderControls() {
    const hasMultipleSets = this.store.wordLadderSets.length > 1;
    const currentIndex = this.store.wordLadderSetIndex + 1; // Convert to 1-based for humans
    const totalSets = this.store.wordLadderSets.length;
    
    return html`
      <div class="word-ladder-controls">
        <button class="dice-btn-icon" data-spectrum-pattern="action-button" @click=${this._rollDice} title="Roll the dice for random word combo!" aria-label="Roll random word combo">
          🎲
        </button>
        <div class="word-ladder-nav" data-spectrum-pattern="pagination">
          <button class="carousel-btn" data-spectrum-pattern="action-button" @click=${this._prevSet} ?disabled=${!hasMultipleSets} title="Previous set">‹</button>
          <span class="set-index">${currentIndex} of ${totalSets}</span>
          <button class="carousel-btn" data-spectrum-pattern="action-button" @click=${this._nextSet} ?disabled=${!hasMultipleSets} title="Next set">›</button>
        </div>
        <button class="add-set-btn" data-spectrum-pattern="button-secondary" @click=${this._addSet} title="Add new category">+ Add Set</button>
      </div>
    `;
  }

  private _renderLyricsControls() {
    return html`
      <div class="lyrics-controls">
        <span class="lyrics-info">📝 Song Lyrics</span>
        <button class="btn btn-secondary" data-spectrum-pattern="button-secondary" @click=${this._copyLyrics} title="Copy all lyrics">
          📋 Copy to Clipboard
        </button>
      </div>
    `;
  }

  render() {
    const isRetracted = this.store.stripRetracted;
    const currentPanel = this.store.currentPanel;
    const isCanvasMode = currentPanel === 'canvas' || currentPanel === 'canvas-lyrics-left' || currentPanel === 'canvas-lyrics-right' || currentPanel === 'canvas-lyrics-top' || currentPanel === 'canvas-lyrics-bottom';

    return html`
      <div class="floating-strip ${isRetracted ? 'retracted' : ''}">
        ${isRetracted ? html`
          <button class="expand-btn" @click=${this._toggleRetract} title="Expand" aria-label="Expand controls">
            ›
          </button>
        ` : html`
          <div class="strip-content">
            <div class="controls-area">
              ${isCanvasMode ? this._renderCanvasControls() : ''}
              ${currentPanel === 'word-ladder' ? this._renderWordLadderControls() : ''}
              ${currentPanel === 'lyrics' ? this._renderLyricsControls() : ''}
            </div>
          </div>
          <button class="close-btn" @click=${this._toggleRetract} title="Close" aria-label="Close controls">
            ×
          </button>
        `}
      </div>
    `;
  }
}

customElements.define('floating-strip', FloatingStrip);

