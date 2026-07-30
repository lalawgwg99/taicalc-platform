export type CarFuelType = 'gasoline' | 'hybrid' | 'diesel' | 'electric';

export interface CarPreset {
  id: string;
  label: string;
  price: number;
  cc: number;
  fuel: CarFuelType;
  efficiency: number;
  sourceLabel: string;
  sourceUrl: string;
  verifiedAt: string;
}

/**
 * 車價、排氣量與能源效率均取自台灣原廠公開規配。
 * 預設只負責降低第一次輸入門檻，使用者仍可依實際成交版本修改。
 */
export const carPresets: CarPreset[] = [
  {
    id: 'toyota-corolla-cross-gasoline',
    label: 'Toyota Corolla Cross 豪華（汽油）',
    price: 809_000,
    cc: 1_798,
    fuel: 'gasoline',
    efficiency: 14.3,
    sourceLabel: 'Toyota Corolla Cross 2026/5 規配',
    sourceUrl: 'https://www.toyota.com.tw/showroom/COROLLA_CROSS/',
    verifiedAt: '2026-07-30',
  },
  {
    id: 'toyota-corolla-cross-hybrid',
    label: 'Toyota Corolla Cross HYBRID 豪華',
    price: 849_000,
    cc: 1_798,
    fuel: 'hybrid',
    efficiency: 23.5,
    sourceLabel: 'Toyota Corolla Cross 2026/5 規配',
    sourceUrl: 'https://www.toyota.com.tw/showroom/COROLLA_CROSS/',
    verifiedAt: '2026-07-30',
  },
  {
    id: 'honda-crv-gasoline',
    label: 'Honda CR-V VTi-S（汽油）',
    price: 999_000,
    cc: 1_498,
    fuel: 'gasoline',
    efficiency: 15,
    sourceLabel: 'Honda CR-V 2026 規配',
    sourceUrl: 'https://www.honda-taiwan.com.tw/2026CR-V/',
    verifiedAt: '2026-07-30',
  },
  {
    id: 'honda-crv-hybrid',
    label: 'Honda CR-V e:HEV S',
    price: 1_229_000,
    cc: 1_993,
    fuel: 'hybrid',
    efficiency: 20.5,
    sourceLabel: 'Honda CR-V 2026 規配',
    sourceUrl: 'https://www.honda-taiwan.com.tw/2026CR-V/',
    verifiedAt: '2026-07-30',
  },
  {
    id: 'toyota-rav4-hybrid',
    label: 'Toyota RAV4 豪華（HYBRID）',
    price: 1_040_000,
    cc: 2_487,
    fuel: 'hybrid',
    efficiency: 24,
    sourceLabel: 'Toyota RAV4 2026/6 規配',
    sourceUrl: 'https://www.toyota.com.tw/showroom/RAV4/fullsepc.aspx',
    verifiedAt: '2026-07-30',
  },
];

export function getCarPreset(id: string): CarPreset | undefined {
  return carPresets.find((preset) => preset.id === id);
}
