import { ReactiveControllerHost } from 'lit';
import { LyricLine, LyricGroup, CanvasItem, SavedSong, Chord, WordLadderSet, WordLadderColumn, SampleContent } from './types';
import { storageService } from './storage-service';
import { cloudSyncService } from './cloud-sync-service';

/**
 * Central store for song data and application state
 * Manages reactive updates to all connected Lit components
 */
// Default starting word ladder columns
const DEFAULT_WORD_LADDER_COLUMNS: WordLadderColumn[] = [
  {
    id: 'col-1',
    title: 'Verbs',
    placeholder: 'run',
    words: []
  },
  {
    id: 'col-2',
    title: 'Nouns',
    placeholder: 'table',
    words: []
  }
];

export class SongStore {
  // Core song data
  private _items: CanvasItem[] = [];
  private _songName: string = '';
  
  // Saved songs list
  private _savedSongs: SavedSong[] = [];
  
  // UI state
  private _showLoadDialog: boolean = false;
  private _showFileModal: boolean = false;
  private _showEmailPrompt: boolean = false;
  private _editingLineId: string | null = null;
  private _lyricsPanelWidth: number = 350;
  private _leftPanelWidth: number = 300;
  private _selectedLineIds: Set<string> = new Set();
  private _newLineInputText: string = '';
  private _currentPanel: 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom' = 'canvas';
  private _stripRetracted: boolean = false;
  
  // Word Ladder state - part of the current song
  private _wordLadderColumns: WordLadderColumn[] = [...DEFAULT_WORD_LADDER_COLUMNS];
  private _wordLadderColumnViewOffset: number = 0; // For paging through columns (shows 2 at a time)
  private _wordLadderSelectedIndices: number[] = []; // Array of selected word indices, one per column
  
  // Sample content for loading
  private _sampleContent: SampleContent | null = null;

  // Reactive hosts (Lit components)
  private _hosts = new Set<ReactiveControllerHost>();

  // Debounce timer for auto-save when song name changes
  private _autoSaveTimer: number | null = null;

  constructor() {
    // Load saved songs from localStorage first (immediate)
    this._savedSongs = storageService.loadSongs();
    
    // Check if user has set their email for cross-device sync
    if (!storageService.hasEmail()) {
      this._showEmailPrompt = true;
    }
    
    // Try to load from cloud and merge with local (async, non-blocking)
    this._loadFromCloud();
    
    // Load sample content asynchronously
    this._loadSampleContent();
  }
  
  private async _loadFromCloud(): Promise<void> {
    try {
      const userId = storageService.getUserId();
      const cloudSongs = await cloudSyncService.getSongs(userId);
      
      if (cloudSongs.length > 0) {
        // Merge cloud songs with local songs
        // Use songId as the unique identifier and keep the most recent version
        const mergedMap = new Map<string, SavedSong>();
        
        // Add local songs first
        this._savedSongs.forEach(song => {
          mergedMap.set(song.songId, song);
        });
        
        // Add/update with cloud songs, keeping whichever is more recent
        cloudSongs.forEach(cloudSong => {
          const existing = mergedMap.get(cloudSong.songId);
          if (!existing || new Date(cloudSong.lastModified) > new Date(existing.lastModified)) {
            mergedMap.set(cloudSong.songId, cloudSong);
          }
        });
        
        this._savedSongs = Array.from(mergedMap.values());
        
        // Update localStorage with merged data
        storageService.saveSongs(this._savedSongs);
        
        console.log(`📥 Loaded ${cloudSongs.length} songs from cloud, ${this._savedSongs.length} total after merge`);
        this.notify();
      }
    } catch (error) {
      console.warn('Could not load from cloud, using local songs only:', error);
      // Continue with local songs - no error thrown
    }
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
    if (this._wordLadderColumns.length === 0) {
      return;
    }

    // Pick random word indices for each column
    this._wordLadderSelectedIndices = this._wordLadderColumns.map(col => {
      return col.words.length > 0 ? Math.floor(Math.random() * col.words.length) : -1;
    });

    // Build combined text from all selected words
    const selectedWords = this._wordLadderSelectedIndices
      .map((index, colIndex) => {
        return index !== -1 ? this._wordLadderColumns[colIndex].words[index] : null;
      })
      .filter(word => word !== null);

    if (selectedWords.length > 0) {
      this._newLineInputText = selectedWords.join(' ');
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
  
  /**
   * Auto-save current song to localStorage
   * This happens on every content change for local persistence
   */
  private autoSave(): void {
    // Only auto-save if there's a song name
    if (!this._songName.trim()) {
      return;
    }
    
    // Get existing song to preserve IDs
    const existingSong = this._savedSongs.find(s => s.name === this._songName);
    const songId = existingSong?.songId || crypto.randomUUID();
    const userId = existingSong?.userId || storageService.getUserId();
    
    const song: SavedSong = {
      name: this._songName,
      songId: songId,
      userId: userId,
      items: this._items,
      wordLadderColumns: this._wordLadderColumns,
      lastModified: new Date().toISOString()
    };
    
    this._savedSongs = storageService.saveSong(song);
  }
  
  /**
   * Notify hosts and auto-save
   * Use this for song content changes
   */
  private notifyAndAutoSave(): void {
    this.notify();
    this.autoSave();
  }

  /**
   * Notify hosts and auto-save with debounce
   * Use this for song name changes to avoid saving on every keystroke
   */
  private notifyAndAutoSaveDebounced(): void {
    this.notify();

    // Clear existing timer
    if (this._autoSaveTimer !== null) {
      clearTimeout(this._autoSaveTimer);
    }

    // Set new timer to auto-save after 500ms of no changes
    this._autoSaveTimer = window.setTimeout(() => {
      this.autoSave();
      this._autoSaveTimer = null;
    }, 500);
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
  
  get sampleContent(): SampleContent | null {
    return this._sampleContent;
  }
  
  get showLoadDialog(): boolean {
    return this._showLoadDialog;
  }
  
  get showFileModal(): boolean {
    return this._showFileModal;
  }

  get editingLineId(): string | null {
    return this._editingLineId;
  }
  
  get showEmailPrompt(): boolean {
    return this._showEmailPrompt;
  }
  
  get userEmail(): string | null {
    return storageService.getEmail();
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
  
  get wordLadderColumns(): WordLadderColumn[] {
    return this._wordLadderColumns;
  }

  get wordLadderColumnViewOffset(): number {
    return this._wordLadderColumnViewOffset;
  }

  get wordLadderSelectedIndices(): number[] {
    return this._wordLadderSelectedIndices;
  }

  // Legacy getters for backwards compatibility
  get wordLadderSelectedLeft(): number {
    return this._wordLadderSelectedIndices[0] ?? -1;
  }

  get wordLadderSelectedRight(): number {
    return this._wordLadderSelectedIndices[1] ?? -1;
  }

  // Legacy getter - returns a fake "set" wrapper for backward compatibility
  get currentWordLadderSet(): WordLadderSet {
    return {
      id: 'legacy-set',
      columns: this._wordLadderColumns
    };
  }

  // Legacy getter
  get wordLadderSets(): WordLadderSet[] {
    return [{
      id: 'legacy-set',
      columns: this._wordLadderColumns
    }];
  }

  // Legacy getter
  get wordLadderSetIndex(): number {
    return 0;
  }
  
  // Legacy getters for backwards compatibility (deprecated - use wordLadderColumns instead)
  get wordLadderVerbs(): string[] {
    return this._wordLadderColumns[0]?.words || [];
  }

  get wordLadderNouns(): string[] {
    return this._wordLadderColumns[1]?.words || [];
  }

  get wordLadderLocations(): string[] {
    return this._wordLadderColumns[2]?.words || [];
  }

  get wordLadderAdjectives(): string[] {
    return this._wordLadderColumns[3]?.words || [];
  }
  
  // ===== Song Metadata Actions =====

  setSongName(name: string): void {
    this._songName = name;
    this.notifyAndAutoSaveDebounced();
  }
  
  // ===== Line Management Actions =====
  
  addLine(line: LyricLine): void {
    this._items = [...this._items, { ...line, type: 'line' as const }];
    this.notifyAndAutoSave();
  }
  
  updateLine(id: string, updates: Partial<LyricLine>): void {
    this._items = this._items.map(item => 
      item.id === id && item.type === 'line' ? { ...item, ...updates } : item
    );
    this.notifyAndAutoSave();
  }
  
  deleteLine(id: string): void {
    // Clear selection if the deleted line is selected
    if (this._selectedLineIds.has(id)) {
      this._selectedLineIds.delete(id);
    }
    this._items = this._items.filter(item => item.id !== id);
    this.notifyAndAutoSave();
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
    this.notifyAndAutoSave();
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
    this.notifyAndAutoSave();
  }
  
  updateGroup(id: string, updates: Partial<LyricGroup>): void {
    this._items = this._items.map(item => 
      item.id === id && item.type === 'group' ? { ...item, ...updates } : item
    );
    this.notifyAndAutoSave();
  }
  
  deleteGroup(id: string): void {
    // Clear selection if the deleted group is selected
    if (this._selectedLineIds.has(id)) {
      this._selectedLineIds.delete(id);
    }
    this._items = this._items.filter(item => item.id !== id);
    this.notifyAndAutoSave();
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

    this.notifyAndAutoSave();
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
    
    this.notifyAndAutoSave();
  }
  
  // ===== Chord Management Actions =====
  // Note: These all call updateLine which already does notifyAndAutoSave
  
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
  
  async saveSong(): Promise<boolean> {
    if (!this._songName.trim()) {
      return false;
    }
    
    // Get existing song to preserve IDs, or generate new ones
    const existingSong = this._savedSongs.find(s => s.name === this._songName);
    const songId = existingSong?.songId || crypto.randomUUID();
    const userId = existingSong?.userId || storageService.getUserId();
    
    const song: SavedSong = {
      name: this._songName,
      songId: songId,
      userId: userId,
      items: this._items,
      wordLadderColumns: this._wordLadderColumns,
      lastModified: new Date().toISOString()
    };
    
    // Save to localStorage (immediate)
    this._savedSongs = storageService.saveSong(song);
    this.notify();
    
    // Save to cloud (async, non-blocking)
    try {
      await cloudSyncService.saveSong(song);
      console.log('☁️ Song synced to cloud:', song.name);
    } catch (error) {
      console.error('Failed to sync to cloud (saved locally):', error);
      // Don't fail the save - local storage succeeded
    }
    
    return true;
  }
  
  loadSong(song: SavedSong): void {
    // Clear any pending auto-save timer
    if (this._autoSaveTimer !== null) {
      clearTimeout(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }

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

    // Load word ladder columns from song, or use default
    if (song.wordLadderColumns && song.wordLadderColumns.length > 0) {
      this._wordLadderColumns = song.wordLadderColumns;
      this._autoSelectRandomWords();
    } else {
      // Reset to default
      this._wordLadderColumns = [...DEFAULT_WORD_LADDER_COLUMNS];
      this._wordLadderColumnViewOffset = 0;
      this._wordLadderSelectedIndices = [];
    }
    
    this._showLoadDialog = false;
    this._selectedLineIds.clear();
    this.notify();
  }
  
  async deleteSong(songName: string): Promise<void> {
    // Find the song to get its IDs for cloud deletion
    const songToDelete = this._savedSongs.find(s => s.name === songName);
    
    // Delete from localStorage
    this._savedSongs = storageService.deleteSong(songName);
    this.notify();
    
    // Delete from cloud if it exists
    if (songToDelete?.userId && songToDelete?.songId) {
      try {
        await cloudSyncService.deleteSong(songToDelete.userId, songToDelete.songId);
        console.log('☁️ Song deleted from cloud:', songName);
      } catch (error) {
        console.error('Failed to delete from cloud (deleted locally):', error);
        // Don't fail the delete - local deletion succeeded
      }
    }
  }
  
  newSong(): void {
    // Clear any pending auto-save timer
    if (this._autoSaveTimer !== null) {
      clearTimeout(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }

    this._songName = '';
    this._items = [];
    this._wordLadderColumns = [...DEFAULT_WORD_LADDER_COLUMNS];
    this._wordLadderColumnViewOffset = 0;
    this._wordLadderSelectedIndices = [];
    this._selectedLineIds.clear();
    this.notify();
  }
  
  // ===== Import/Export Actions =====
  
  exportToJSON(): void {
    // Get IDs - either from existing song or generate new ones
    const existingSong = this._savedSongs.find(s => s.name === this._songName);
    const songId = existingSong?.songId || crypto.randomUUID();
    const userId = existingSong?.userId || storageService.getUserId();

    const song: SavedSong = {
      name: this._songName || 'Untitled Song',
      songId: songId,
      userId: userId,
      items: this._items,
      wordLadderColumns: this._wordLadderColumns,
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

    // Import word ladder columns if present
    if (song.wordLadderColumns && song.wordLadderColumns.length > 0) {
      this._wordLadderColumns = song.wordLadderColumns;
      this._autoSelectRandomWords();
    } else {
      // Reset to default if not present
      this._wordLadderColumns = [...DEFAULT_WORD_LADDER_COLUMNS];
      this._wordLadderColumnViewOffset = 0;
      this._wordLadderSelectedIndices = [];
    }

    // Preserve IDs if present, otherwise generate new ones
    const songId = song.songId || crypto.randomUUID();
    const userId = song.userId || storageService.getUserId();

    // Save the imported song with IDs
    const importedSong: SavedSong = {
      ...song,
      name: this._songName,
      songId: songId,
      userId: userId,
      items: this._items,
      wordLadderColumns: this._wordLadderColumns,
      lastModified: new Date().toISOString()
    };

    this._savedSongs = storageService.saveSong(importedSong);

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
  
  async setShowLoadDialog(show: boolean): Promise<void> {
    this._showLoadDialog = show;
    
    // When opening the dialog, refresh songs from cloud
    if (show) {
      await this.refreshSongsFromCloud();
    }
    
    this.notify();
  }
  
  /**
   * Refresh songs list from cloud and merge with local
   * Call this when opening the load dialog to get latest songs
   */
  async refreshSongsFromCloud(): Promise<void> {
    // Reload from localStorage first
    this._savedSongs = storageService.loadSongs();
    
    // Then load and merge from cloud
    await this._loadFromCloud();
  }
  
  setShowFileModal(show: boolean): void {
    this._showFileModal = show;
    this.notify();
  }

  setEditingLineId(id: string | null): void {
    this._editingLineId = id;
    this.notify();
  }
  
  setShowEmailPrompt(show: boolean): void {
    this._showEmailPrompt = show;
    this.notify();
  }
  
  async setUserEmail(email: string): Promise<void> {
    // Set email and get the hashed userId
    const userId = await storageService.setEmail(email);
    console.log('✅ Email set:', email);
    console.log('🔑 User ID:', userId);
    
    // Reload songs from cloud with new userId
    await this._loadFromCloud();
    
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

  setWordLadderColumnViewOffset(offset: number): void {
    this._wordLadderColumnViewOffset = Math.max(0, offset);
    this.notify();
  }

  setWordLadderSelection(indices: number[]): void {
    this._wordLadderSelectedIndices = [...indices];
    this.notify();
  }

  // Legacy method for backwards compatibility
  setWordLadderSelectionLegacy(leftIndex: number, rightIndex: number): void {
    this._wordLadderSelectedIndices = [leftIndex, rightIndex];
    this.notify();
  }

  // Update words for a specific column
  setWordLadderColumnWords(columnIndex: number, words: string[]): void {
    if (this._wordLadderColumns[columnIndex]) {
      this._wordLadderColumns[columnIndex].words = words;
      this.notifyAndAutoSave();
    }
  }

  // Legacy methods for backwards compatibility
  setWordLadderLeftWords(words: string[]): void {
    this.setWordLadderColumnWords(0, words);
  }

  setWordLadderRightWords(words: string[]): void {
    this.setWordLadderColumnWords(1, words);
  }

  // Method to add a new column
  addWordLadderColumn(): void {
    const newColumn: WordLadderColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      placeholder: 'word',
      words: []
    };
    this._wordLadderColumns.push(newColumn);
    this.notifyAndAutoSave();
  }

  // Method to update column title by index
  updateWordLadderColumnTitle(columnIndex: number, title: string): void {
    if (this._wordLadderColumns[columnIndex]) {
      this._wordLadderColumns[columnIndex].title = title;
      this.notifyAndAutoSave();
    }
  }

  // Method to toggle column muted state
  toggleWordLadderColumnMuted(columnIndex: number): void {
    if (this._wordLadderColumns[columnIndex]) {
      this._wordLadderColumns[columnIndex].muted = !this._wordLadderColumns[columnIndex].muted;
      this.notifyAndAutoSave();
    }
  }

  // Legacy methods for backward compatibility
  setWordLadderSetIndex(index: number): void {
    // No-op - kept for backward compatibility
    this.notify();
  }

  addWordLadderSet(): void {
    // Just add a column instead
    this.addWordLadderColumn();
  }

  updateWordLadderColumnTitleLegacy(column: 'left' | 'right', title: string): void {
    const columnIndex = column === 'left' ? 0 : 1;
    this.updateWordLadderColumnTitle(columnIndex, title);
  }
  
  // Legacy setters for backwards compatibility (deprecated - use setWordLadderColumnWords instead)
  setWordLadderVerbs(verbs: string[]): void {
    this.setWordLadderColumnWords(0, verbs);
  }

  setWordLadderNouns(nouns: string[]): void {
    this.setWordLadderColumnWords(1, nouns);
  }

  setWordLadderLocations(locations: string[]): void {
    this.setWordLadderColumnWords(2, locations);
  }

  setWordLadderAdjectives(adjectives: string[]): void {
    this.setWordLadderColumnWords(3, adjectives);
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
    
    this.notifyAndAutoSave();
  }
}

// Singleton instance
export const songStore = new SongStore();

