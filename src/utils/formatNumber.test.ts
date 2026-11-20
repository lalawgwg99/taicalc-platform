import { describe, expect, it } from 'vitest';

import { clampNumber, formatThousands, parseThousands } from './formatNumber';

describe('formatThousands', () => {
  it('groups thousands', () => {
    expect(formatThousands(1000000)).toBe('1,000,000');
    expect(formatThousands(1000)).toBe('1,000');
    expect(formatThousands(123)).toBe('123');
    expect(formatThousands(0)).toBe('0');
  });

  it('keeps negatives and decimals', () => {
    expect(formatThousands(-100)).toBe('-100');
    expect(formatThousands(-1234567)).toBe('-1,234,567');
    expect(formatThousands(1234.5)).toBe('1,234.5');
  });

  it('returns empty string for null/undefined/NaN', () => {
    expect(formatThousands(null)).toBe('');
    expect(formatThousands(undefined)).toBe('');
    expect(formatThousands(NaN)).toBe('');
  });
});

describe('parseThousands', () => {
  it('parses grouped input', () => {
    expect(parseThousands('1,000,000')).toBe(1000000);
    expect(parseThousands('1000')).toBe(1000);
    expect(parseThousands('1,234.5')).toBe(1234.5);
    expect(parseThousands('-100')).toBe(-100);
  });

  it('returns null for empty or incomplete input', () => {
    expect(parseThousands('')).toBeNull();
    expect(parseThousands('   ')).toBeNull();
    expect(parseThousands(null)).toBeNull();
    expect(parseThousands('-')).toBeNull();
    expect(parseThousands('.')).toBeNull();
  });

  it('returns null for non-numeric input', () => {
    expect(parseThousands('abc')).toBeNull();
    expect(parseThousands('12a3')).toBeNull();
    expect(parseThousands('--100')).toBeNull();
  });
});

describe('clampNumber', () => {
  it('clamps to range', () => {
    expect(clampNumber(5, 0, 10)).toBe(5);
    expect(clampNumber(-3, 0, 10)).toBe(0);
    expect(clampNumber(99, 0, 10)).toBe(10);
  });

  it('returns min for non-finite input', () => {
    expect(clampNumber(NaN, 0, 10)).toBe(0);
    expect(clampNumber(Infinity, 0, 10)).toBe(10);
  });
});
