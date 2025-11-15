import { Chord } from '../lyric-line/index.js';

export interface LyricLine {
  id: string;
  text: string;
  chords: Chord[];
  hasChordSection: boolean;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface SavedSong {
  name: string;
  lines: LyricLine[];
  lastModified: string;
  exportedAt?: string;
}

