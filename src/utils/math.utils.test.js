import { describe, expect, it } from 'vitest';
import { convertCoordsToIdx, convertIdxToCoords, distanceTo, ellipseDistanceCheck, minmax, withinEllipse, withinSquare } from './math.utils.js';

describe('math utilities', () => {
  it('clamps values to a minimum and maximum', () => {
    expect(minmax(5, 0, 10)).toBe(5);
    expect(minmax(-2, 0, 10)).toBe(0);
    expect(minmax(12, 0, 10)).toBe(10);
  });

  it('calculates Euclidean distance', () => {
    expect(distanceTo(0, 0, 3, 4)).toBe(5);
    expect(distanceTo(2, 2, 2, 2)).toBe(0);
  });

  it('checks strict square bounds', () => {
    expect(withinSquare(5, 5, 0, 10, 0, 10)).toBe(true);
    expect(withinSquare(0, 5, 0, 10, 0, 10)).toBe(false);
    expect(withinSquare(10, 5, 0, 10, 0, 10)).toBe(false);
  });

  it('calculates normalized ellipse distance and checks inclusion', () => {
    expect(ellipseDistanceCheck(3, 4, 0, 0, 6, 8)).toBeCloseTo(0.5, 8);
    expect(withinEllipse(0, 0, 0, 0, 6, 8)).toBe(true);
    expect(withinEllipse(6, 0, 0, 0, 6, 8)).toBe(true);
    expect(withinEllipse(7, 0, 0, 0, 6, 8)).toBe(false);
  });

  it('converts pixel-buffer indices and coordinates', () => {
    expect(convertIdxToCoords(20, 10)).toEqual({ x: 5, y: 0 });
    expect(convertCoordsToIdx(5, 2, 10)).toBe(100);
    expect(convertIdxToCoords(15, 10, 1)).toEqual({ x: 5, y: 1 });
    expect(convertCoordsToIdx(5, 2, 10, 1)).toBe(25);
  });
});
