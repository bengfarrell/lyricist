import { LitElement, html } from 'lit';
import { SongStoreController, DEFAULT_LINE_TEXT } from '../utils/index';
import type { LyricLine } from '../utils/index';
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
    const columns = this.store.wordLadderColumns;
    const selectedIndices = this.store.wordLadderSelectedIndices;

    // Only show word ladder combination if we have actual words selected
    const selectedWords = selectedIndices
      .map((index, colIndex) => {
        if (index !== -1 && columns[colIndex]?.words.length > 0) {
          return columns[colIndex].words[index];
        }
        return null;
      })
      .filter(word => word !== null);

    if (selectedWords.length > 0) {
      return selectedWords.join(' ');
    }

    return "Add a song lyric here...";
  }

  private _addLine(e: Event): void {
    e.preventDefault();

    // Check if we're in word ladder mode
    const wasInWordLadderMode = this.store.currentPanel === 'word-ladder';

    // If input is empty, try to use word ladder selection, otherwise use default
    let text = this.store.newLineInputText.trim();
    if (!text) {
      const columns = this.store.wordLadderColumns;
      const selectedIndices = this.store.wordLadderSelectedIndices;

      const selectedWords = selectedIndices
        .map((index, colIndex) => {
          if (index !== -1 && columns[colIndex]?.words.length > 0) {
            return columns[colIndex].words[index];
          }
          return null;
        })
        .filter(word => word !== null);

      if (selectedWords.length > 0) {
        text = selectedWords.join(' ');
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

    // If we were in word ladder mode, switch to canvas to show the new lyric
    if (wasInWordLadderMode) {
      this.store.setCurrentPanel('canvas');
    }
  }
  
  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.store.setNewLineInputText(target.value);
  }

  private _rollDice(): void {
    const columns = this.store.wordLadderColumns;

    if (columns.length === 0) return;

    // Filter out muted columns
    const activeColumnIndices = columns
      .map((col, index) => col.muted ? -1 : index)
      .filter(index => index !== -1);

    if (activeColumnIndices.length === 0) return; // No active columns

    // Pick 2 random active columns (can be any columns)
    let col1Index: number, col2Index: number;

    if (activeColumnIndices.length === 1) {
      col1Index = activeColumnIndices[0];
      col2Index = activeColumnIndices[0];
    } else {
      const randomIdx1 = Math.floor(Math.random() * activeColumnIndices.length);
      col1Index = activeColumnIndices[randomIdx1];

      let randomIdx2;
      do {
        randomIdx2 = Math.floor(Math.random() * activeColumnIndices.length);
      } while (randomIdx2 === randomIdx1 && activeColumnIndices.length > 1);
      col2Index = activeColumnIndices[randomIdx2];
    }

    // Pick random words from those columns
    const selectedIndices = new Array(columns.length).fill(-1);

    if (columns[col1Index].words.length > 0) {
      selectedIndices[col1Index] = Math.floor(Math.random() * columns[col1Index].words.length);
    }

    if (columns[col2Index].words.length > 0) {
      selectedIndices[col2Index] = Math.floor(Math.random() * columns[col2Index].words.length);
    }

    // Update the selection
    this.store.setWordLadderSelection(selectedIndices);

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

  private _deleteSelectedItems(): void {
    if (this.store.selectedLineIds.size === 0) return;

    const count = this.store.selectedLineIds.size;
    const itemWord = count === 1 ? 'item' : 'items';

    if (confirm(`Delete ${count} selected ${itemWord}?`)) {
      this.store.deleteSelectedItems();
    }
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
            <div class="group-controls">
              <div class="alignment-buttons" data-spectrum-pattern="action-group-horizontal">
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('left')} title="Align left">◧</button>
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('center')} title="Align center">◫</button>
                <button class="align-btn" data-spectrum-pattern="action-button" @click=${() => this._alignItems('right')} title="Align right">◨</button>
                <button class="align-btn delete-btn" data-spectrum-pattern="action-button" @click=${this._deleteSelectedItems} title="Delete selected items (Backspace/Delete)">×</button>
              </div>
              <div class="section-picker-wrapper">
                <button 
                  class="section-picker-btn" 
                  @click=${this._toggleSectionPicker}
                  data-spectrum-pattern="picker"
                >
                  Section...
                </button>
                ${this._showSectionPicker ? html`
                  <div class="section-picker-overlay" @click=${() => { this._showSectionPicker = false; this.requestUpdate(); }}>
                    <div class="section-picker-panel" @click=${(e: Event) => e.stopPropagation()}>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Verse')}>Verse</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Chorus')}>Chorus</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Bridge')}>Bridge</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Intro')}>Intro</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Outro')}>Outro</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Pre-Chorus')}>Pre-Chorus</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Hook')}>Hook</button>
                      <button class="section-bubble" @click=${() => this._handleSectionClick('Custom')}>Custom...</button>
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
              @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
            />
            <button type="submit" class="btn btn-primary" data-spectrum-pattern="button-primary">Add Lyric</button>
          </form>
        </div>
        <button
          class="config-btn-icon"
          @click=${() => this.store.setShowWordLadderConfig(true)}
          title="Configure word ladder settings"
          aria-label="Configure word ladder"
        >
          ⚙️
        </button>
      `}
    `;
  }

  private _copyLyrics(): void {
    // Dispatch event to lyrics-panel
    this.dispatchEvent(new CustomEvent('copy-lyrics', { bubbles: true, composed: true }));
  }

  private _downloadJSON(): void {
    const song = {
      name: this.store.songName || 'Untitled',
      items: this.store.items,
      wordLadderColumns: this.store.wordLadderColumns,
      lastModified: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(song, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.name || 'untitled'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private _renderLyricsControls() {
    return html`
      <div class="lyrics-controls">
        <span class="lyrics-info">📝 Song Lyrics</span>
        <button class="btn btn-secondary" @click=${this._copyLyrics} title="Copy all lyrics">
          📋 Copy to Clipboard
        </button>
        <button class="btn btn-secondary" @click=${this._downloadJSON} title="Download song as JSON">
          💾 Download
        </button>
      </div>
    `;
  }

  render() {
    const isRetracted = this.store.stripRetracted;
    const currentPanel = this.store.currentPanel;
    const isCanvasMode = currentPanel === 'canvas';

    return html`
      <div class="floating-strip ${isRetracted ? 'retracted' : ''}">
        ${isRetracted ? html`
          <button class="expand-btn" @click=${this._toggleRetract} title="Expand" aria-label="Expand controls">
            ›
          </button>
        ` : html`
          <div class="strip-content">
            <div class="controls-area">
              ${isCanvasMode || currentPanel === 'word-ladder' ? this._renderCanvasControls() : ''}
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

