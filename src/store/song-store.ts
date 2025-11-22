import { ReactiveControllerHost } from 'lit';
import { LyricLine, LyricGroup, CanvasItem, SavedSong, Chord, WordLadderSet, SampleContent } from './types';
import { storageService } from './storage-service';

/**
 * Central store for song data and application state
 * Manages reactive updates to all connected Lit components
 */
// Default starting word ladder set
const DEFAULT_WORD_LADDER_SET: WordLadderSet = {
  id: 'default-1',
  leftColumn: {
    title: 'Verbs',
    placeholder: 'run',
    words: []
  },
  rightColumn: {
    title: 'Nouns',
    placeholder: 'table',
    words: []
  }
};

export class SongStore {
  // Core song data
  private _items: CanvasItem[] = [];
  private _songName: string = '';
  
  // Saved songs list
  private _savedSongs: SavedSong[] = [];
  
  // UI state
  private _showLoadDialog: boolean = false;
  private _showFileModal: boolean = false;
  private _lyricsPanelWidth: number = 350;
  private _leftPanelWidth: number = 300;
  private _selectedLineIds: Set<string> = new Set();
  private _newLineInputText: string = '';
  private _currentPanel: 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom' = 'canvas';
  private _stripRetracted: boolean = false;
  
  // Word Ladder state - part of the current song
  private _wordLadderSets: WordLadderSet[] = [{ ...DEFAULT_WORD_LADDER_SET }];
  private _wordLadderSetIndex: number = 0;
  private _wordLadderSelectedLeft: number = -1;
  private _wordLadderSelectedRight: number = -1;
  
  // Sample content for loading
  private _sampleContent: SampleContent | null = null;
  
  // Reactive hosts (Lit components)
  private _hosts = new Set<ReactiveControllerHost>();
  
  constructor() {
    // Load saved songs on initialization
    this._savedSongs = storageService.loadSongs();
    
    // Load sample content asynchronously
    this._loadSampleContent();
  }

  private async _loadSampleContent(): Promise<void> {
    try {
      const response = await fetch('/sample-content.json');
      if (!response.ok) {
        throw new Error(`Failed to load sample content: ${response.statusText}`);
      }
      this._sampleContent = await response.json();
      this.notify();
    } catch (error) {
      console.error('Error loading sample content:', error);
      // Fallback to empty structure
      this._sampleContent = {
        sampleSongs: []
      };
      this.notify();
    }
  }

  private _autoSelectRandomWords(): void {
    if (this._wordLadderSets.length === 0) {
      return;
    }

    const currentSet = this._wordLadderSets[this._wordLadderSetIndex];
    const leftWords = currentSet.leftColumn.words;
    const rightWords = currentSet.rightColumn.words;

    // Pick random indices if words are available
    let leftIndex = -1;
    let rightIndex = -1;

    if (leftWords.length > 0) {
      leftIndex = Math.floor(Math.random() * leftWords.length);
    }

    if (rightWords.length > 0) {
      rightIndex = Math.floor(Math.random() * rightWords.length);
    }

    // Set the selection
    this._wordLadderSelectedLeft = leftIndex;
    this._wordLadderSelectedRight = rightIndex;

    // If both are real words (not placeholders), set the input text value
    // Otherwise, leave it empty to show as placeholder
    if (leftIndex !== -1 && rightIndex !== -1) {
      const combinedText = `${leftWords[leftIndex]} ${rightWords[rightIndex]}`;
      this._newLineInputText = combinedText;
    }
  }
  
  // ===== Registration =====
  
  addHost(host: ReactiveControllerHost): void {
    this._hosts.add(host);
  }
  
  removeHost(host: ReactiveControllerHost): void {
    this._hosts.delete(host);
  }
  
  private notify(): void {
    this._hosts.forEach(host => host.requestUpdate());
  }
  
  // ===== Getters =====
  
  get items(): CanvasItem[] {
    return this._items;
  }
  
  get lines(): LyricLine[] {
    return this._items.filter((item): item is LyricLine => item.type === 'line');
  }
  
  get groups(): LyricGroup[] {
    return this._items.filter((item): item is LyricGroup => item.type === 'group');
  }
  
  get songName(): string {
    return this._songName;
  }
  
  get savedSongs(): SavedSong[] {
    return this._savedSongs;
  }
  
  get showLoadDialog(): boolean {
    return this._showLoadDialog;
  }
  
  get showFileModal(): boolean {
    return this._showFileModal;
  }
  
  get lyricsPanelWidth(): number {
    return this._lyricsPanelWidth;
  }
  
  get leftPanelWidth(): number {
    return this._leftPanelWidth;
  }
  
  get selectedLineIds(): Set<string> {
    return this._selectedLineIds;
  }
  
  get newLineInputText(): string {
    return this._newLineInputText;
  }
  
  get currentPanel(): 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom' {
    return this._currentPanel;
  }
  
  get stripRetracted(): boolean {
    return this._stripRetracted;
  }
  
  get wordLadderSets(): WordLadderSet[] {
    return this._wordLadderSets;
  }

  get currentWordLadderSet(): WordLadderSet {
    return this._wordLadderSets[this._wordLadderSetIndex] || {
      id: 'default',
      leftColumn: { title: 'Left', placeholder: 'word', words: [] },
      rightColumn: { title: 'Right', placeholder: 'word', words: [] }
    };
  }

  get wordLadderSetIndex(): number {
    return this._wordLadderSetIndex;
  }

  get wordLadderSelectedLeft(): number {
    return this._wordLadderSelectedLeft;
  }

  get wordLadderSelectedRight(): number {
    return this._wordLadderSelectedRight;
  }
  
  // Legacy getters for backwards compatibility (deprecated - use currentWordLadderSet instead)
  get wordLadderVerbs(): string[] {
    return this._wordLadderSets[0]?.leftColumn.words || [];
  }
  
  get wordLadderNouns(): string[] {
    return this._wordLadderSets[0]?.rightColumn.words || [];
  }
  
  get wordLadderLocations(): string[] {
    return this._wordLadderSets[1]?.leftColumn.words || [];
  }
  
  get wordLadderAdjectives(): string[] {
    return this._wordLadderSets[1]?.rightColumn.words || [];
  }
  
  // ===== Song Metadata Actions =====
  
  setSongName(name: string): void {
    this._songName = name;
    this.notify();
  }
  
  // ===== Line Management Actions =====
  
  addLine(line: LyricLine): void {
    this._items = [...this._items, { ...line, type: 'line' as const }];
    this.notify();
  }
  
  updateLine(id: string, updates: Partial<LyricLine>): void {
    this._items = this._items.map(item => 
      item.id === id && item.type === 'line' ? { ...item, ...updates } : item
    );
    this.notify();
  }
  
  deleteLine(id: string): void {
    // Clear selection if the deleted line is selected
    if (this._selectedLineIds.has(id)) {
      this._selectedLineIds.delete(id);
    }
    this._items = this._items.filter(item => item.id !== id);
    this.notify();
  }
  
  duplicateLine(id: string): void {
    const originalItem = this._items.find(item => item.id === id);
    if (!originalItem) return;
    
    if (originalItem.type === 'line') {
      const newLine: LyricLine = {
        ...originalItem,
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: originalItem.x + 30,
        y: originalItem.y + 30,
        rotation: (Math.random() * 10) - 5
      };
      this.addLine(newLine);
    } else {
      // Duplicate group
      const newGroup: LyricGroup = {
        ...originalItem,
        id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: originalItem.x + 30,
        y: originalItem.y + 30,
        rotation: (Math.random() * 10) - 5,
        // Deep copy lines
        lines: originalItem.lines.map(line => ({
          ...line,
          id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))
      };
      this.addGroup(newGroup);
    }
  }
  
  bringLineToFront(id: string): void {
    const maxZ = Math.max(...this._items.map(item => item.zIndex || 1));
    this.updateItem(id, { zIndex: maxZ + 1 });
  }
  
  updateItem(id: string, updates: Partial<CanvasItem>): void {
    this._items = this._items.map(item => {
      if (item.id !== id) return item;
      
      // Preserve the type and only update allowed properties
      if (item.type === 'line') {
        return { ...item, ...updates, type: 'line' as const };
      } else {
        return { ...item, ...updates, type: 'group' as const };
      }
    });
    this.notify();
  }
  
  updateLinePosition(id: string, x: number, y: number): void {
    this.updateItem(id, { x, y });
  }
  
  updateLineText(id: string, text: string): void {
    this.updateLine(id, { text });
  }
  
  // ===== Group Management Actions =====
  
  addGroup(group: LyricGroup): void {
    this._items = [...this._items, { ...group, type: 'group' as const }];
    this.notify();
  }
  
  updateGroup(id: string, updates: Partial<LyricGroup>): void {
    this._items = this._items.map(item => 
      item.id === id && item.type === 'group' ? { ...item, ...updates } : item
    );
    this.notify();
  }
  
  deleteGroup(id: string): void {
    // Clear selection if the deleted group is selected
    if (this._selectedLineIds.has(id)) {
      this._selectedLineIds.delete(id);
    }
    this._items = this._items.filter(item => item.id !== id);
    this.notify();
  }

  ungroupGroup(id: string): void {
    const group = this._items.find(item => item.id === id && item.type === 'group');
    if (!group || group.type !== 'group') return;

    // Get max z-index
    const maxZ = this.getMaxZIndex();
    
    // Create standalone lines from the group's lines
    // Place them at the group's position with vertical spacing
    const spacing = 60; // pixels between lines
    const newLines: LyricLine[] = group.lines.map((line, index) => ({
      ...line,
      type: 'line' as const,
      id: `line-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      x: group.x,
      y: group.y + (index * spacing),
      rotation: group.rotation,
      zIndex: maxZ + 1 + index
    }));

    // Remove the group
    this._items = this._items.filter(item => item.id !== id);
    
    // Add the new lines
    newLines.forEach(line => {
      this._items.push(line);
    });

    // Select all the new lines
    this._selectedLineIds.clear();
    newLines.forEach(line => {
      this._selectedLineIds.add(line.id);
    });

    this.notify();
  }
  
  createGroup(sectionName: string): void {
    if (this._selectedLineIds.size === 0) return;
    
    // Get all selected items (both lines and groups)
    const selectedItems = this._items.filter(item => this._selectedLineIds.has(item.id));
    
    // Collect all lines from both standalone lines and groups
    const allLines: LyricLine[] = [];
    selectedItems.forEach(item => {
      if (item.type === 'line') {
        allLines.push(item);
      } else if (item.type === 'group') {
        // Add all lines from the group
        allLines.push(...item.lines);
      }
    });
    
    if (allLines.length === 0) return;
    
    // Sort lines by their original y position to maintain order
    // For lines in groups, we use the group's y position
    const linesWithY = allLines.map(line => {
      const originalItem = this._items.find(item => 
        item.type === 'line' && item.id === line.id
      );
      if (originalItem) {
        return { line, y: originalItem.y };
      }
      // If line is in a group, find the group's y position
      const parentGroup = this._items.find(item => 
        item.type === 'group' && item.lines.some(l => l.id === line.id)
      );
      return { line, y: parentGroup?.y ?? line.y };
    });
    
    const sortedLines = linesWithY.sort((a, b) => a.y - b.y).map(item => item.line);
    
    // Find the topmost item's position for the group
    const topItem = selectedItems.reduce((top, item) => 
      item.y < top.y ? item : top
    , selectedItems[0]);
    
    // Get max z-index for the new group
    const maxZ = this.getMaxZIndex();
    
    // Create the new group
    const newGroup: LyricGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'group',
      sectionName,
      lines: sortedLines,
      x: topItem.x,
      y: topItem.y,
      rotation: topItem.rotation,
      zIndex: maxZ + 1
    };
    
    // Remove all selected items (both lines and groups) from the canvas
    const selectedIds = new Set(selectedItems.map(item => item.id));
    this._items = this._items.filter(item => !selectedIds.has(item.id));
    
    // Add the group
    this.addGroup(newGroup);
    
    // Clear selection and select the new group
    this._selectedLineIds.clear();
    this._selectedLineIds.add(newGroup.id);
    
    this.notify();
  }
  
  // ===== Chord Management Actions =====
  
  toggleChordSection(id: string, hasChordSection: boolean): void {
    this.updateLine(id, { hasChordSection });
  }
  
  addChord(lineId: string, chord: Chord): void {
    const item = this._items.find(i => i.id === lineId);
    if (!item || item.type !== 'line') return;
    
    this.updateLine(lineId, {
      chords: [...(item.chords || []), chord]
    });
  }
  
  updateChord(lineId: string, chordId: string, name: string): void {
    const item = this._items.find(i => i.id === lineId);
    if (!item || item.type !== 'line') return;
    
    this.updateLine(lineId, {
      chords: item.chords.map(c => c.id === chordId ? { ...c, name } : c)
    });
  }
  
  deleteChord(lineId: string, chordId: string): void {
    const item = this._items.find(i => i.id === lineId);
    if (!item || item.type !== 'line') return;
    
    this.updateLine(lineId, {
      chords: item.chords.filter(c => c.id !== chordId)
    });
  }
  
  updateChordPosition(lineId: string, chordId: string, position: number): void {
    const item = this._items.find(i => i.id === lineId);
    if (!item || item.type !== 'line') return;
    
    this.updateLine(lineId, {
      chords: item.chords.map(c => c.id === chordId ? { ...c, position } : c)
    });
  }
  
  // ===== Song Management Actions =====
  
  saveSong(): boolean {
    if (!this._songName.trim()) {
      return false;
    }
    
    const song: SavedSong = {
      name: this._songName,
      items: this._items,
      wordLadderSets: this._wordLadderSets,
      lastModified: new Date().toISOString()
    };
    
    this._savedSongs = storageService.saveSong(song);
    this.notify();
    return true;
  }
  
  loadSong(song: SavedSong): void {
    this._songName = song.name;
    
    // Support both old format (lines) and new format (items)
    if (song.items) {
      // Close all chord sections by default when loading
      this._items = song.items.map(item => {
        if (item.type === 'line') {
          return { ...item, hasChordSection: false };
        }
        return item;
      });
    } else if (song.lines) {
      // Legacy format: convert lines to items
      this._items = song.lines.map(line => ({ 
        ...line, 
        type: 'line' as const,
        hasChordSection: false 
      }));
    } else {
      this._items = [];
    }

    // Load word ladder sets from song, or use default
    if (song.wordLadderSets && song.wordLadderSets.length > 0) {
      this._wordLadderSets = song.wordLadderSets;
      this._wordLadderSetIndex = 0;
      this._autoSelectRandomWords();
    } else {
      // Reset to default
      this._wordLadderSets = [{ ...DEFAULT_WORD_LADDER_SET }];
      this._wordLadderSetIndex = 0;
      this._wordLadderSelectedLeft = -1;
      this._wordLadderSelectedRight = -1;
    }
    
    this._showLoadDialog = false;
    this._selectedLineIds.clear();
    this.notify();
  }
  
  deleteSong(songName: string): void {
    this._savedSongs = storageService.deleteSong(songName);
    this.notify();
  }
  
  newSong(): void {
    this._songName = '';
    this._items = [];
    this._wordLadderSets = [{ ...DEFAULT_WORD_LADDER_SET }];
    this._wordLadderSetIndex = 0;
    this._wordLadderSelectedLeft = -1;
    this._wordLadderSelectedRight = -1;
    this._selectedLineIds.clear();
    this.notify();
  }
  
  // ===== Import/Export Actions =====
  
  exportToJSON(): void {
    const song: SavedSong = {
      name: this._songName || 'Untitled Song',
      items: this._items,
      lastModified: new Date().toISOString(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(song, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  importFromJSON(song: SavedSong): void {
    this._songName = song.name || 'Imported Song';
    
    // Support both old format (lines) and new format (items)
    if (song.items) {
      // Close all chord sections by default when loading
      this._items = song.items.map(item => {
        if (item.type === 'line') {
          return { ...item, hasChordSection: false };
        }
        return item;
      });
    } else if (song.lines) {
      // Legacy format: convert lines to items
      this._items = (song.lines || []).map(line => ({ 
        ...line, 
        type: 'line' as const,
        hasChordSection: false 
      }));
    } else {
      this._items = [];
    }
    
    this._selectedLineIds.clear();
    this.notify();
  }
  
  loadSampleSong(): void {
    if (this._sampleContent && this._sampleContent.sampleSongs.length > 0) {
      // Load the first sample song from the JSON
      const sampleSong = this._sampleContent.sampleSongs[0];
      this.loadSong(sampleSong);
    }
  }
  
  // ===== UI State Actions =====
  
  setShowLoadDialog(show: boolean): void {
    this._showLoadDialog = show;
    this.notify();
  }
  
  setShowFileModal(show: boolean): void {
    this._showFileModal = show;
    this.notify();
  }
  
  setCurrentPanel(panel: 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom'): void {
    this._currentPanel = panel;
    this.notify();
  }
  
  setStripRetracted(retracted: boolean): void {
    this._stripRetracted = retracted;
    this.notify();
  }
  
  setLyricsPanelWidth(width: number): void {
    this._lyricsPanelWidth = Math.max(200, Math.min(600, width));
    this.notify();
  }
  
  setLeftPanelWidth(width: number): void {
    this._leftPanelWidth = Math.max(200, Math.min(600, width));
    this.notify();
  }
  
  setSelectedLineIds(ids: string[]): void {
    this._selectedLineIds = new Set(ids);
    this.notify();
  }
  
  toggleLineSelection(id: string): void {
    if (this._selectedLineIds.has(id)) {
      this._selectedLineIds.delete(id);
    } else {
      this._selectedLineIds.add(id);
    }
    this.notify();
  }
  
  selectLine(id: string): void {
    this._selectedLineIds.clear();
    this._selectedLineIds.add(id);
    this.notify();
  }
  
  clearSelection(): void {
    this._selectedLineIds.clear();
    this.notify();
  }
  
  isLineSelected(id: string): boolean {
    return this._selectedLineIds.has(id);
  }
  
  setNewLineInputText(text: string): void {
    this._newLineInputText = text;
    this.notify();
  }
  
  // ===== Word Ladder Actions =====
  
  setWordLadderSetIndex(index: number): void {
    const maxIndex = this._wordLadderSets.length - 1;
    this._wordLadderSetIndex = Math.max(0, Math.min(index, maxIndex));
    this.notify();
  }

  setWordLadderSelection(leftIndex: number, rightIndex: number): void {
    this._wordLadderSelectedLeft = leftIndex;
    this._wordLadderSelectedRight = rightIndex;
    this.notify();
  }

  // Methods to update word ladder words in the current set
  setWordLadderLeftWords(words: string[]): void {
    if (this._wordLadderSets[this._wordLadderSetIndex]) {
      this._wordLadderSets[this._wordLadderSetIndex].leftColumn.words = words;
      this.notify();
    }
  }

  setWordLadderRightWords(words: string[]): void {
    if (this._wordLadderSets[this._wordLadderSetIndex]) {
      this._wordLadderSets[this._wordLadderSetIndex].rightColumn.words = words;
      this.notify();
    }
  }

  // Method to add a new word ladder set
  addWordLadderSet(): void {
    const newSet: WordLadderSet = {
      id: `set-${Date.now()}`,
      leftColumn: {
        title: 'Verbs',
        placeholder: 'word',
        words: []
      },
      rightColumn: {
        title: 'Nouns',
        placeholder: 'word',
        words: []
      }
    };
    this._wordLadderSets.push(newSet);
    this._wordLadderSetIndex = this._wordLadderSets.length - 1;
    this._wordLadderSelectedLeft = -1;
    this._wordLadderSelectedRight = -1;
    this.notify();
  }

  // Method to update column titles
  updateWordLadderColumnTitle(column: 'left' | 'right', title: string): void {
    const currentSet = this._wordLadderSets[this._wordLadderSetIndex];
    if (currentSet) {
      if (column === 'left') {
        currentSet.leftColumn.title = title;
      } else {
        currentSet.rightColumn.title = title;
      }
      this.notify();
    }
  }
  
  // Legacy setters for backwards compatibility (deprecated - use setWordLadderLeftWords/RightWords instead)
  setWordLadderVerbs(verbs: string[]): void {
    if (this._wordLadderSets[0]) {
      this._wordLadderSets[0].leftColumn.words = verbs;
      this.notify();
    }
  }
  
  setWordLadderNouns(nouns: string[]): void {
    if (this._wordLadderSets[0]) {
      this._wordLadderSets[0].rightColumn.words = nouns;
      this.notify();
    }
  }
  
  setWordLadderLocations(locations: string[]): void {
    if (this._wordLadderSets[1]) {
      this._wordLadderSets[1].leftColumn.words = locations;
      this.notify();
    }
  }
  
  setWordLadderAdjectives(adjectives: string[]): void {
    if (this._wordLadderSets[1]) {
      this._wordLadderSets[1].rightColumn.words = adjectives;
      this.notify();
    }
  }
  
  // ===== Utility Methods =====
  
  getSortedLines(): LyricLine[] {
    // For groups, we include their lines in the sorted list at the group's y position
    const allLines: Array<LyricLine & { sortY: number }> = [];
    
    this._items.forEach(item => {
      if (item.type === 'line') {
        allLines.push({ ...item, sortY: item.y });
      } else if (item.type === 'group') {
        // Add all lines from the group, using the group's y position for sorting
        item.lines.forEach(line => {
          allLines.push({ ...line, sortY: item.y });
        });
      }
    });
    
    return allLines.sort((a, b) => a.sortY - b.sortY);
  }
  
  getSortedItems(): CanvasItem[] {
    return [...this._items].sort((a, b) => a.y - b.y);
  }
  
  getMaxZIndex(): number {
    return this._items.length > 0 ? Math.max(...this._items.map(item => item.zIndex || 1)) : 0;
  }
  
  // ===== Alignment Actions =====
  
  alignSelectedItems(alignment: 'left' | 'center' | 'right', canvasWidth: number): void {
    const padding = 40; // Space from edges
    
    this._items = this._items.map(item => {
      if (!this._selectedLineIds.has(item.id)) return item;
      
      let newX = item.x;
      
      if (alignment === 'left') {
        newX = padding;
      } else if (alignment === 'center') {
        newX = canvasWidth / 2;
      } else if (alignment === 'right') {
        newX = canvasWidth - padding;
      }
      
      return { ...item, x: newX };
    });
    
    this.notify();
  }
}

// Singleton instance
export const songStore = new SongStore();

