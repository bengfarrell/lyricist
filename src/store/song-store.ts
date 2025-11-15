import { ReactiveControllerHost } from 'lit';
import { LyricLine, SavedSong } from './types.js';
import { storageService } from './storage-service.js';
import { Chord } from '../lyric-line/index.js';

/**
 * Central store for song data and application state
 * Manages reactive updates to all connected Lit components
 */
export class SongStore {
  // Core song data
  private _lines: LyricLine[] = [];
  private _songName: string = '';
  
  // Saved songs list
  private _savedSongs: SavedSong[] = [];
  
  // UI state
  private _showLoadDialog: boolean = false;
  private _lyricsPanelWidth: number = 350;
  
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
  
  get lines(): LyricLine[] {
    return this._lines;
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
  
  // ===== Song Metadata Actions =====
  
  setSongName(name: string): void {
    this._songName = name;
    this.notify();
  }
  
  // ===== Line Management Actions =====
  
  addLine(line: LyricLine): void {
    this._lines = [...this._lines, line];
    this.notify();
  }
  
  updateLine(id: string, updates: Partial<LyricLine>): void {
    this._lines = this._lines.map(line => 
      line.id === id ? { ...line, ...updates } : line
    );
    this.notify();
  }
  
  deleteLine(id: string): void {
    this._lines = this._lines.filter(line => line.id !== id);
    this.notify();
  }
  
  duplicateLine(id: string): void {
    const originalLine = this._lines.find(line => line.id === id);
    if (!originalLine) return;
    
    const newLine: LyricLine = {
      ...originalLine,
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: originalLine.x + 30,
      y: originalLine.y + 30,
      rotation: (Math.random() * 10) - 5
    };
    
    this.addLine(newLine);
  }
  
  bringLineToFront(id: string): void {
    const maxZ = Math.max(...this._lines.map(line => line.zIndex || 1));
    this.updateLine(id, { zIndex: maxZ + 1 });
  }
  
  updateLinePosition(id: string, x: number, y: number): void {
    this.updateLine(id, { x, y });
  }
  
  updateLineText(id: string, text: string): void {
    this.updateLine(id, { text });
  }
  
  // ===== Chord Management Actions =====
  
  toggleChordSection(id: string, hasChordSection: boolean): void {
    this.updateLine(id, { hasChordSection });
  }
  
  addChord(lineId: string, chord: Chord): void {
    const line = this._lines.find(l => l.id === lineId);
    if (!line) return;
    
    this.updateLine(lineId, {
      chords: [...(line.chords || []), chord]
    });
  }
  
  updateChord(lineId: string, chordId: string, name: string): void {
    const line = this._lines.find(l => l.id === lineId);
    if (!line) return;
    
    this.updateLine(lineId, {
      chords: line.chords.map(c => c.id === chordId ? { ...c, name } : c)
    });
  }
  
  deleteChord(lineId: string, chordId: string): void {
    const line = this._lines.find(l => l.id === lineId);
    if (!line) return;
    
    this.updateLine(lineId, {
      chords: line.chords.filter(c => c.id !== chordId)
    });
  }
  
  updateChordPosition(lineId: string, chordId: string, position: number): void {
    const line = this._lines.find(l => l.id === lineId);
    if (!line) return;
    
    this.updateLine(lineId, {
      chords: line.chords.map(c => c.id === chordId ? { ...c, position } : c)
    });
  }
  
  // ===== Song Management Actions =====
  
  saveSong(): boolean {
    if (!this._songName.trim()) {
      return false;
    }
    
    const song: SavedSong = {
      name: this._songName,
      lines: this._lines,
      lastModified: new Date().toISOString()
    };
    
    this._savedSongs = storageService.saveSong(song);
    this.notify();
    return true;
  }
  
  loadSong(song: SavedSong): void {
    this._songName = song.name;
    // Close all chord sections by default when loading
    this._lines = song.lines.map(line => ({ ...line, hasChordSection: false }));
    this._showLoadDialog = false;
    this.notify();
  }
  
  deleteSong(songName: string): void {
    this._savedSongs = storageService.deleteSong(songName);
    this.notify();
  }
  
  newSong(): void {
    this._songName = '';
    this._lines = [];
    this.notify();
  }
  
  // ===== Import/Export Actions =====
  
  exportToJSON(): void {
    const song: SavedSong = {
      name: this._songName || 'Untitled Song',
      lines: this._lines,
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
    // Close all chord sections by default when loading
    this._lines = (song.lines || []).map(line => ({ ...line, hasChordSection: false }));
    this.notify();
  }
  
  loadSampleSong(): void {
    const sampleSong: SavedSong = {
      name: "Morning Coffee (Sample)",
      lastModified: new Date().toISOString(),
      lines: [
        {
          id: "line-sample-1",
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
  
  // ===== Utility Methods =====
  
  getSortedLines(): LyricLine[] {
    return [...this._lines].sort((a, b) => a.y - b.y);
  }
  
  getMaxZIndex(): number {
    return this._lines.length > 0 ? Math.max(...this._lines.map(line => line.zIndex || 1)) : 0;
  }
}

// Singleton instance
export const songStore = new SongStore();

