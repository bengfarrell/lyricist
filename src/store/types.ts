import { Chord } from '../lyric-line/index.js';

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
  items?: CanvasItem[]; // New format: mixed lines and groups
  lines?: LyricLine[]; // Legacy format: only lines
  lastModified: string;
  exportedAt?: string;
}

