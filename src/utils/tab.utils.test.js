import { describe, expect, it } from 'vitest';
import { getTabFretPosition, getTabLineWidth } from './tab.utils.js';

describe('tablature layout helpers', () => {
    it.each([
        [4, 14],
        [6, 20],
        [8, 26],
    ])('allocates three characters per string for %i strings', (stringCount, expectedWidth) => {
        expect(getTabLineWidth(stringCount)).toBe(expectedWidth);
    });

    it('places ascending passes from the lowest physical string toward string 1', () => {
        for (const stringCount of [4, 6, 8]) {
            expect(getTabFretPosition({ string: stringCount, dir: 'up' }, stringCount)).toBe(1);
            expect(getTabFretPosition({ string: 1, dir: 'up' }, stringCount)).toBe(1 + (stringCount - 1) * 3);
        }
    });

    it('places descending passes from string 1 toward the lowest physical string', () => {
        for (const stringCount of [4, 6, 8]) {
            expect(getTabFretPosition({ string: 1, dir: 'down' }, stringCount)).toBe(1);
            expect(getTabFretPosition({ string: stringCount, dir: 'down' }, stringCount)).toBe(1 + (stringCount - 1) * 3);
        }
    });

    it('keeps every three-character slot inside the computed line width', () => {
        for (const stringCount of [4, 6, 8]) {
            for (const dir of ['up', 'down']) {
                for (let string = 1; string <= stringCount; string++) {
                    const position = getTabFretPosition({ string, dir }, stringCount);
                    expect(position).toBeGreaterThanOrEqual(1);
                    expect(position + 2).toBeLessThan(getTabLineWidth(stringCount));
                }
            }
        }
    });

    it('rejects invalid string counts, string indices, and directions', () => {
        expect(() => getTabLineWidth(0)).toThrow(RangeError);
        expect(() => getTabLineWidth(4.5)).toThrow(RangeError);
        expect(() => getTabFretPosition({ string: 5, dir: 'up' }, 4)).toThrow(RangeError);
        expect(() => getTabFretPosition({ string: 1, dir: 'sideways' }, 4)).toThrow(TypeError);
    });
});
