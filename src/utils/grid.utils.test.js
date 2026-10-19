import { describe, expect, it } from 'vitest';
import { GRID_BASE_WIDTH, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN, NOTES_NUM } from '../config/frets.config.js';
import { calcWidth, columnWidth, fretPosition, gridColumns, gridHeight, gridMinHeight } from './grid.utils.js';

describe('fretboard grid utilities', () => {
  it('calculates fret positions with a halving ratio across an octave', () => {
    expect(fretPosition(0)).toBe(100);
    expect(fretPosition(NOTES_NUM)).toBe(50);
    expect(fretPosition(NOTES_NUM * 2)).toBe(25);
  });

  it('calculates positive fret column widths', () => {
    expect(columnWidth(0)).toBeGreaterThan(0);
    expect(columnWidth(1)).toBeGreaterThan(0);
    expect(columnWidth(0)).toBeCloseTo((100 - fretPosition(1)) / 100 * GRID_BASE_WIDTH, 4);
  });

  it('sums column widths and returns a CSS grid column list', () => {
    expect(calcWidth(0)).toBe(0);
    expect(calcWidth(3)).toBeCloseTo(columnWidth(0) + columnWidth(1) + columnWidth(2), 8);
    expect(gridColumns(3).split(' ')).toHaveLength(3);
    expect(gridColumns(3).split(' ').every((value) => value.endsWith('vw'))).toBe(true);
  });

  it('scales grid heights to the number of strings', () => {
    expect(gridHeight(6)).toBe(`${GRID_ROW_HEIGHT * 6}vh`);
    expect(gridMinHeight(4)).toBe(`${GRID_ROW_HEIGHT_MIN * 4}px`);
  });
});
