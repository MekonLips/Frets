import { describe, expect, it } from 'vitest';
import { pad } from './string.utils.js';

describe('pad', () => {
  it('appends the requested padding until the target length', () => {
    expect(pad('E', '-', 4)).toBe('E---');
    expect(pad('12', '0', 5)).toBe('12000');
  });

  it('leaves strings at or above the target length unchanged', () => {
    expect(pad('notes', '-', 5)).toBe('notes');
    expect(pad('notes', '-', 3)).toBe('notes');
  });

  it('supports empty strings and multi-character padding', () => {
    expect(pad('', 'x', 3)).toBe('xxx');
    expect(pad('A', 'ab', 4)).toBe('Aababab');
  });
});
