import { describe, expect, it } from 'vitest';
import { formatTime } from './datetime.utils.js';

describe('formatTime', () => {
  it('formats milliseconds as minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(1000)).toBe('0:01');
    expect(formatTime(59000)).toBe('0:59');
    expect(formatTime(60000)).toBe('1:00');
    expect(formatTime(125000)).toBe('2:05');
  });

  it('does not round fractional seconds up', () => {
    expect(formatTime(1599)).toBe('0:01.599');
  });

  it('formats overtime as a positive elapsed duration', () => {
    expect(formatTime(-1000)).toBe('+0:01');
    expect(formatTime(-61000)).toBe('+1:01');
    expect(formatTime(-300000)).toBe('+5:00');
  });
});
