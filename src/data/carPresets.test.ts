import { describe, expect, it } from 'vitest';
import { carPresets } from './carPresets';

describe('car presets', () => {
  it('keeps every preset identifiable, sourced, and numerically usable', () => {
    expect(new Set(carPresets.map((preset) => preset.id)).size).toBe(carPresets.length);

    carPresets.forEach((preset) => {
      expect(preset.price).toBeGreaterThan(0);
      expect(preset.cc).toBeGreaterThan(0);
      expect(preset.efficiency).toBeGreaterThan(0);
      expect(preset.sourceUrl.startsWith('https://')).toBe(true);
      expect(preset.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
