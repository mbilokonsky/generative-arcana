/** Tiny color helpers (no p5 dependency) so lighting/registers can share them without cycles. */
import type { RGB } from "./types";

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mix(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Re-light a color to brightness level `f` (~0..255): multiply each channel by f/255, clamp to 255. */
export function scale(c: RGB, f: number): RGB {
  const k = f / 255;
  return [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)];
}

export function rgba(c: RGB, a = 1): string {
  return `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${clamp01(a)})`;
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const frac = (n: number) => n - Math.floor(n);
export const TAU = Math.PI * 2;
