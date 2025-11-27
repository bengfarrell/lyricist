import { describe, it, expect } from 'vitest';
import { DEFAULT_LINE_TEXT } from '../../../src/store/constants.js';

describe('Constants', () => {
  describe('DEFAULT_LINE_TEXT', () => {
    it('should be defined', () => {
      expect(DEFAULT_LINE_TEXT).toBeDefined();
    });

    it('should be a non-empty string', () => {
      expect(typeof DEFAULT_LINE_TEXT).toBe('string');
      expect(DEFAULT_LINE_TEXT.length).toBeGreaterThan(0);
    });

    it('should have the expected value', () => {
      expect(DEFAULT_LINE_TEXT).toBe('Enter a line of lyrics...');
    });
  });
});








