import { describe, expect, it } from 'vitest';
import { minmax } from './math.utils.js';

describe('math utilities', () => {
  it('clamps values to a minimum and maximum', () => {
    expect(minmax(5, 0, 10)).toBe(5);
    expect(minmax(-2, 0, 10)).toBe(0);
    expect(minmax(12, 0, 10)).toBe(10);
  });
});
