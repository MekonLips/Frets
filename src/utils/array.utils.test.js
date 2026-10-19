import { describe, expect, it } from 'vitest';
import { arrayShuffle } from './array.utils.js';

describe('arrayShuffle', () => {
  it('shuffles the supplied array in place and returns it', () => {
    const items = [1, 2, 3, 4, 5];
    const original = [...items];

    const result = arrayShuffle(items);

    expect(result).toBe(items);
    expect(items).toHaveLength(original.length);
    expect([...items].sort()).toEqual(original);
  });

  it('handles empty and single-item arrays', () => {
    const empty = [];
    const single = [42];

    expect(arrayShuffle(empty)).toBe(empty);
    expect(arrayShuffle(empty)).toEqual([]);
    expect(arrayShuffle(single)).toBe(single);
    expect(arrayShuffle(single)).toEqual([42]);
  });
});
