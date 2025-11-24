export interface Chord {
  id: string;
  name: string;
  position: number;
}

export interface LyricLine {
  id: string;
  type: 'line';
  text: string;
  chords: Chord[];
  hasChordSection: boolean;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface LyricGroup {
  id: string;
  type: 'group';
  sectionName: string; // e.g., "Verse", "Chorus", "Bridge"
  lines: LyricLine[]; // The lines contained in this group, ordered by y position
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export type CanvasItem = LyricLine | LyricGroup;

export interface SavedSong {
  name: string;
  songId: string; // Unique ID for this song
  userId: string; // Unique ID of the user who created this song
  items?: CanvasItem[]; // New format: mixed lines and groups
  lines?: LyricLine[]; // Legacy format: only lines
  wordLadderSets?: WordLadderSet[]; // Word ladder data for this song
  lastModified: string;
  exportedAt?: string;
}

export interface WordLadderColumn {
  title: string;
  placeholder: string;
  words: string[];
}

export interface WordLadderSet {
  id: string;
  leftColumn: WordLadderColumn;
  rightColumn: WordLadderColumn;
}

export interface SampleSong {
  song: SavedSong;
}

export interface SampleContent {
  sampleSongs: SavedSong[];
}

