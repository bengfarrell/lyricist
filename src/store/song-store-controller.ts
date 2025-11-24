import { ReactiveController, ReactiveControllerHost } from 'lit';
import { songStore } from './song-store';
import { LyricLine, LyricGroup, CanvasItem, SavedSong, Chord } from './types';

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
  
  get sampleContent() {
    return songStore.sampleContent;
  }
  
  get showLoadDialog(): boolean {
    return songStore.showLoadDialog;
  }
  
  get showFileModal(): boolean {
    return songStore.showFileModal;
  }

  get editingLineId(): string | null {
    return songStore.editingLineId;
  }

  get showEmailPrompt(): boolean {
    return songStore.showEmailPrompt;
  }

  get userEmail(): string | null {
    return songStore.userEmail;
  }

  get lyricsPanelWidth(): number {
    return songStore.lyricsPanelWidth;
  }
  
  get leftPanelWidth(): number {
    return songStore.leftPanelWidth;
  }
  
  get selectedLineIds(): Set<string> {
    return songStore.selectedLineIds;
  }
  
  get newLineInputText(): string {
    return songStore.newLineInputText;
  }
  
  get currentPanel(): 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom' {
    return songStore.currentPanel;
  }
  
  get stripRetracted(): boolean {
    return songStore.stripRetracted;
  }
  
  get wordLadderSetIndex(): number {
    return songStore.wordLadderSetIndex;
  }
  
  get wordLadderVerbs(): string[] {
    return songStore.wordLadderVerbs;
  }
  
  get wordLadderNouns(): string[] {
    return songStore.wordLadderNouns;
  }
  
  get wordLadderLocations(): string[] {
    return songStore.wordLadderLocations;
  }
  
  get wordLadderAdjectives(): string[] {
    return songStore.wordLadderAdjectives;
  }

  get wordLadderSets() {
    return songStore.wordLadderSets;
  }

  get currentWordLadderSet() {
    return songStore.currentWordLadderSet;
  }

  get wordLadderSelectedLeft(): number {
    return songStore.wordLadderSelectedLeft;
  }

  get wordLadderSelectedRight(): number {
    return songStore.wordLadderSelectedRight;
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
  
  saveSong(): Promise<boolean> {
    return songStore.saveSong();
  }
  
  loadSong(song: SavedSong): void {
    songStore.loadSong(song);
  }
  
  deleteSong(songName: string): Promise<void> {
    return songStore.deleteSong(songName);
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
  
  async refreshSongsFromCloud(): Promise<void> {
    await songStore.refreshSongsFromCloud();
  }
  
  // ===== UI State Actions =====
  
  async setShowLoadDialog(show: boolean): Promise<void> {
    await songStore.setShowLoadDialog(show);
  }
  
  setShowFileModal(show: boolean): void {
    songStore.setShowFileModal(show);
  }

  setEditingLineId(id: string | null): void {
    songStore.setEditingLineId(id);
  }
  
  setShowEmailPrompt(show: boolean): void {
    songStore.setShowEmailPrompt(show);
  }
  
  setUserEmail(email: string): Promise<void> {
    return songStore.setUserEmail(email);
  }
  
  setCurrentPanel(panel: 'word-ladder' | 'canvas' | 'lyrics' | 'canvas-lyrics-left' | 'canvas-lyrics-right' | 'canvas-lyrics-top' | 'canvas-lyrics-bottom'): void {
    songStore.setCurrentPanel(panel);
  }
  
  setStripRetracted(retracted: boolean): void {
    songStore.setStripRetracted(retracted);
  }
  
  setLyricsPanelWidth(width: number): void {
    songStore.setLyricsPanelWidth(width);
  }
  
  setLeftPanelWidth(width: number): void {
    songStore.setLeftPanelWidth(width);
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
  
  // ===== Word Ladder Actions =====
  
  setWordLadderSetIndex(index: number): void {
    songStore.setWordLadderSetIndex(index);
  }
  
  setWordLadderVerbs(verbs: string[]): void {
    songStore.setWordLadderVerbs(verbs);
  }
  
  setWordLadderNouns(nouns: string[]): void {
    songStore.setWordLadderNouns(nouns);
  }
  
  setWordLadderLocations(locations: string[]): void {
    songStore.setWordLadderLocations(locations);
  }
  
  setWordLadderAdjectives(adjectives: string[]): void {
    songStore.setWordLadderAdjectives(adjectives);
  }

  setWordLadderLeftWords(words: string[]): void {
    songStore.setWordLadderLeftWords(words);
  }

  setWordLadderRightWords(words: string[]): void {
    songStore.setWordLadderRightWords(words);
  }

  setWordLadderSelection(leftIndex: number, rightIndex: number): void {
    songStore.setWordLadderSelection(leftIndex, rightIndex);
  }

  addWordLadderSet(): void {
    songStore.addWordLadderSet();
  }

  updateWordLadderColumnTitle(column: 'left' | 'right', title: string): void {
    songStore.updateWordLadderColumnTitle(column, title);
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
  
  // ===== Alignment Actions =====
  
  alignSelectedItems(alignment: 'left' | 'center' | 'right', canvasWidth: number): void {
    songStore.alignSelectedItems(alignment, canvasWidth);
  }
}

