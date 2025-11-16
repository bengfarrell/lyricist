import { ReactiveControllerHost } from 'lit';
import { LyricLine, LyricGroup, CanvasItem, SavedSong } from './types.js';
import { storageService } from './storage-service.js';
import { Chord } from '../lyric-line/index.js';

/**
 * Central store for song data and application state
 * Manages reactive updates to all connected Lit components
 */
export class SongStore {
  // Core song data
  private _items: CanvasItem[] = [];
  private _songName: string = '';
  
  // Saved songs list
  private _savedSongs: SavedSong[] = [];
  
  // UI state
  private _showLoadDialog: boolean = false;
  private _lyricsPanelWidth: number = 350;
  private _selectedLineIds: Set<string> = new Set();
  
  // Reactive hosts (Lit components)
  private _hosts = new Set<ReactiveControllerHost>();
  
  constructor() {
    // Load saved songs on initialization
    this._savedSongs = storageService.loadSongs();
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
  
  get lyricsPanelWidth(): number {
    return this._lyricsPanelWidth;
  }
  
  get selectedLineIds(): Set<string> {
    return this._selectedLineIds;
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
    const sampleSong: SavedSong = {
      name: "Morning Coffee (Sample)",
      lastModified: new Date().toISOString(),
      items: [
        {
          id: "line-sample-1",
          type: 'line' as const,
          text: "Wake up to the sunrise glow",
          chords: [
            { id: "chord-1-1", name: "C", position: 0 },
            { id: "chord-1-2", name: "G", position: 60 }
          ],
          hasChordSection: false,
          x: 150,
          y: 100,
          rotation: -2,
          zIndex: 1
        },
        {
          id: "line-sample-2",
          type: 'line' as const,
          text: "Pour a cup and take it slow",
          chords: [
            { id: "chord-2-1", name: "Am", position: 15 },
            { id: "chord-2-2", name: "F", position: 65 }
          ],
          hasChordSection: false,
          x: 160,
          y: 180,
          rotation: 1,
          zIndex: 2
        },
        {
          id: "line-sample-3",
          type: 'line' as const,
          text: "Every morning feels brand new",
          chords: [
            { id: "chord-3-1", name: "C", position: 20 },
            { id: "chord-3-2", name: "G", position: 70 }
          ],
          hasChordSection: false,
          x: 140,
          y: 260,
          rotation: -1,
          zIndex: 3
        },
        {
          id: "line-sample-4",
          type: 'line' as const,
          text: "Simple moments just me and you",
          chords: [
            { id: "chord-4-1", name: "Am", position: 25 },
            { id: "chord-4-2", name: "F", position: 55 },
            { id: "chord-4-3", name: "G", position: 85 }
          ],
          hasChordSection: false,
          x: 155,
          y: 340,
          rotation: 2,
          zIndex: 4
        },
        {
          id: "line-sample-5",
          type: 'line' as const,
          text: "Morning coffee, warm and sweet",
          chords: [
            { id: "chord-5-1", name: "F", position: 10 },
            { id: "chord-5-2", name: "C", position: 60 }
          ],
          hasChordSection: false,
          x: 145,
          y: 450,
          rotation: -3,
          zIndex: 5
        },
        {
          id: "line-sample-6",
          type: 'line' as const,
          text: "Makes my day feel complete",
          chords: [
            { id: "chord-6-1", name: "G", position: 15 },
            { id: "chord-6-2", name: "C", position: 70 }
          ],
          hasChordSection: false,
          x: 170,
          y: 530,
          rotation: 1,
          zIndex: 6
        }
      ]
    };
    
    this.loadSong(sampleSong);
  }
  
  // ===== UI State Actions =====
  
  setShowLoadDialog(show: boolean): void {
    this._showLoadDialog = show;
    this.notify();
  }
  
  setLyricsPanelWidth(width: number): void {
    this._lyricsPanelWidth = Math.max(200, Math.min(600, width));
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
}

// Singleton instance
export const songStore = new SongStore();

