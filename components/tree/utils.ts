// Shared helpers for the tree-component sub-system.
// Co-located so a future maintainer doesn't have to chase symbols
// across three files to understand the geometry math.

/** Round to 1 decimal — keeps SSR + client trig output bit-identical. */
export const r1 = (n: number) => Math.round(n * 10) / 10;

/** Round to 3 decimals for opacity / scale values. */
export const r3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Per-year canopy palette. Each branch picks one of these so the
 * top of the tree reads as a wreath of distinct colour zones.
 */
export const FOLIAGE_PALETTES: string[][] = [
  ["#E8826B", "#F2C5D1", "#D17A95", "#A82E2E"], // warm pink/coral
  ["#9FC5BD", "#5A8B7E", "#2D3D3A", "#7FA847"], // teal/forest
  ["#C8E07A", "#7FA847", "#5E8F4A", "#E8D9B0"], // green/lime
  ["#E8D9B0", "#C9A876", "#A89376", "#6B5740"], // honey/sand
  ["#F2C5D1", "#E8826B", "#C8E07A", "#9FC5BD"], // mixed pastel
  ["#D17A95", "#A82E2E", "#E8826B", "#F2C5D1"], // berry
  ["#9FC5BD", "#7FA847", "#E8D9B0", "#C9A876"], // sage/honey
  ["#C8E07A", "#9FC5BD", "#F2C5D1", "#E8826B"], // spring riot
  ["#5A8B7E", "#9FC5BD", "#E8D9B0", "#C8E07A"], // ocean+meadow
  ["#E8826B", "#F2C5D1", "#9FC5BD", "#C8E07A"], // sunset+sky
];

/** Returns the palette for a given calendar year (cycles after 10). */
export function paletteForYear(year: number): string[] {
  return FOLIAGE_PALETTES[(year - 2017) % FOLIAGE_PALETTES.length];
}
