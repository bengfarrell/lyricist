import { ReactiveController, ReactiveControllerHost } from 'lit';
import { songStore } from './song-store.js';
import { LyricLine, LyricGroup, CanvasItem, SavedSong } from './types.js';
import { Chord } from '../lyric-line/index.js';

/**
 * Reactive Controller that connects Lit components to the SongStore
 * Automatically registers/unregisters the host component for reactive updates
 * 
 * Usage in a Lit component:
 *   private store = new SongStoreController(this);
 * 
 * The component will automatically re-render when store data changes
 */
export class SongStoreController implements ReactiveController {
  private host: ReactiveControllerHost;
  
  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }
  
  // ===== Lifecycle Hooks =====
  
  hostConnected(): void {
    songStore.addHost(this.host);
  }
  
  hostDisconnected(): void {
    songStore.removeHost(this.host);
  }
  
  // ===== Getters (Proxied from Store) =====
  
  get items(): CanvasItem[] {
    return songStore.items;
  }
  
  get lines(): LyricLine[] {
    return songStore.lines;
  }
  
  get groups(): LyricGroup[] {
    return songStore.groups;
  }
  
  get songName(): string {
    return songStore.songName;
  }
  
  get savedSongs(): SavedSong[] {
    return songStore.savedSongs;
  }
  
  get showLoadDialog(): boolean {
    return songStore.showLoadDialog;
  }
  
  get lyricsPanelWidth(): number {
    return songStore.lyricsPanelWidth;
  }
  
  get selectedLineIds(): Set<string> {
    return songStore.selectedLineIds;
  }
  
  get newLineInputText(): string {
    return songStore.newLineInputText;
  }
  
  // ===== Song Metadata Actions =====
  
  setSongName(name: string): void {
    songStore.setSongName(name);
  }
  
  // ===== Line Management Actions =====
  
  addLine(line: LyricLine): void {
    songStore.addLine(line);
  }
  
  updateLine(id: string, updates: Partial<LyricLine>): void {
    songStore.updateLine(id, updates);
  }
  
  deleteLine(id: string): void {
    songStore.deleteLine(id);
  }
  
  duplicateLine(id: string): void {
    songStore.duplicateLine(id);
  }
  
  bringLineToFront(id: string): void {
    songStore.bringLineToFront(id);
  }
  
  updateLinePosition(id: string, x: number, y: number): void {
    songStore.updateLinePosition(id, x, y);
  }
  
  updateLineText(id: string, text: string): void {
    songStore.updateLineText(id, text);
  }
  
  // ===== Group Management Actions =====
  
  addGroup(group: LyricGroup): void {
    songStore.addGroup(group);
  }
  
  updateGroup(id: string, updates: Partial<LyricGroup>): void {
    songStore.updateGroup(id, updates);
  }
  
  deleteGroup(id: string): void {
    songStore.deleteGroup(id);
  }

  ungroupGroup(id: string): void {
    songStore.ungroupGroup(id);
  }
  
  createGroup(sectionName: string): void {
    songStore.createGroup(sectionName);
  }
  
  // ===== Chord Management Actions =====
  
  toggleChordSection(id: string, hasChordSection: boolean): void {
    songStore.toggleChordSection(id, hasChordSection);
  }
  
  addChord(lineId: string, chord: Chord): void {
    songStore.addChord(lineId, chord);
  }
  
  updateChord(lineId: string, chordId: string, name: string): void {
    songStore.updateChord(lineId, chordId, name);
  }
  
  deleteChord(lineId: string, chordId: string): void {
    songStore.deleteChord(lineId, chordId);
  }
  
  updateChordPosition(lineId: string, chordId: string, position: number): void {
    songStore.updateChordPosition(lineId, chordId, position);
  }
  
  // ===== Song Management Actions =====
  
  saveSong(): boolean {
    return songStore.saveSong();
  }
  
  loadSong(song: SavedSong): void {
    songStore.loadSong(song);
  }
  
  deleteSong(songName: string): void {
    songStore.deleteSong(songName);
  }
  
  newSong(): void {
    songStore.newSong();
  }
  
  // ===== Import/Export Actions =====
  
  exportToJSON(): void {
    songStore.exportToJSON();
  }
  
  importFromJSON(song: SavedSong): void {
    songStore.importFromJSON(song);
  }
  
  loadSampleSong(): void {
    songStore.loadSampleSong();
  }
  
  // ===== UI State Actions =====
  
  setShowLoadDialog(show: boolean): void {
    songStore.setShowLoadDialog(show);
  }
  
  setLyricsPanelWidth(width: number): void {
    songStore.setLyricsPanelWidth(width);
  }
  
  setSelectedLineIds(ids: string[]): void {
    songStore.setSelectedLineIds(ids);
  }
  
  toggleLineSelection(id: string): void {
    songStore.toggleLineSelection(id);
  }
  
  selectLine(id: string): void {
    songStore.selectLine(id);
  }
  
  clearSelection(): void {
    songStore.clearSelection();
  }
  
  isLineSelected(id: string): boolean {
    return songStore.isLineSelected(id);
  }
  
  setNewLineInputText(text: string): void {
    songStore.setNewLineInputText(text);
  }
  
  // ===== Utility Methods =====
  
  getSortedLines(): LyricLine[] {
    return songStore.getSortedLines();
  }
  
  getSortedItems(): CanvasItem[] {
    return songStore.getSortedItems();
  }
  
  getMaxZIndex(): number {
    return songStore.getMaxZIndex();
  }
}

