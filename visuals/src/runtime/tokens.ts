/**
 * Design tokens: the normalization layer.
 *
 * The 8 station tokens drive the lighting kernels (sublimated virtue = light).
 * The 4 suit tokens + the major token drive the rendering registers (declared suit = line/surface).
 *
 * Everything visual that is SUPPOSED to recur across the deck lives here. Per-card uniqueness
 * lives in the card sketches, not here. Editing a token re-tunes the whole family at once.
 */
import type { StationSlug, RegisterKey, RGB, Palette } from "./types";

/** How a station's light moves. Consumed by lighting.ts to shape `pulse()` and `wash()`. */
export type LightMotion =
  | "still"     // honesty — no flicker; stillness is the animation
  | "breathe"   // compassion — slow warm swell
  | "charge"    // valor — held tension, faint electric jitter, one focal hotspot
  | "poise"     // justice — two balanced sources, near-still, a slow settle
  | "ember"     // sacrifice — deplete/rekindle pulse
  | "hold"      // honor — vertical, ceremonial, a slow steady rise
  | "drift"     // spirituality — sourceless, wandering radiance
  | "settle";   // humility — low, earthbound, weight sinking

export interface StationToken {
  slug: StationSlug;
  index: number;
  /** light color temperature (the tint of the station's light). */
  temp: RGB;
  /** base ambient brightness 0..1 (how lit the ground is). */
  ambient: number;
  /** vignette strength 0..1 (how much the frame closes in). */
  vignette: number;
  /** contrast 0..1 (hard frontal vs. soft diffuse). */
  contrast: number;
  motion: LightMotion;
  /** dominant light direction (unit-ish; {0,-1} = from above, {0,0} = sourceless). */
  dir: { x: number; y: number };
  /** ground wash: where the light pools — 'top','bottom','center','even','sourceless'. */
  pool: "top" | "bottom" | "center" | "even" | "sourceless";
}

export const STATION_TOKENS: Record<StationSlug, StationToken> = {
  honesty: {
    slug: "honesty", index: 0, temp: [248, 247, 238], ambient: 0.94, vignette: 0.08,
    contrast: 0.85, motion: "still", dir: { x: 0, y: -1 }, pool: "even",
  },
  compassion: {
    slug: "compassion", index: 1, temp: [255, 198, 132], ambient: 0.62, vignette: 0.42,
    contrast: 0.3, motion: "breathe", dir: { x: -0.4, y: 0.5 }, pool: "bottom",
  },
  valor: {
    slug: "valor", index: 2, temp: [255, 214, 150], ambient: 0.55, vignette: 0.34,
    contrast: 0.92, motion: "charge", dir: { x: 0, y: -0.7 }, pool: "center",
  },
  justice: {
    slug: "justice", index: 3, temp: [228, 226, 214], ambient: 0.7, vignette: 0.22,
    contrast: 0.55, motion: "poise", dir: { x: 0, y: -0.5 }, pool: "even",
  },
  sacrifice: {
    slug: "sacrifice", index: 4, temp: [255, 138, 86], ambient: 0.46, vignette: 0.5,
    contrast: 0.6, motion: "ember", dir: { x: 0, y: 0.3 }, pool: "center",
  },
  honor: {
    slug: "honor", index: 5, temp: [216, 204, 168], ambient: 0.58, vignette: 0.34,
    contrast: 0.62, motion: "hold", dir: { x: 0, y: -1 }, pool: "top",
  },
  spirituality: {
    slug: "spirituality", index: 6, temp: [236, 238, 255], ambient: 0.82, vignette: 0.06,
    contrast: 0.25, motion: "drift", dir: { x: 0, y: 0 }, pool: "sourceless",
  },
  humility: {
    slug: "humility", index: 7, temp: [150, 138, 118], ambient: 0.4, vignette: 0.55,
    contrast: 0.4, motion: "settle", dir: { x: 0.3, y: 0.8 }, pool: "bottom",
  },
};

/** Prime positions in the 8-station canonical order (2,3,5,7) — "transversally prime" stations. */
export const PRIME_STATION_INDICES = new Set([2, 3, 5, 7]);

// ---------------------------------------------------------------------------

export type RegisterLine = "gilded" | "woodcut" | "illuminated" | "phosphor" | "fused";

export interface RegisterToken {
  key: RegisterKey;
  palette: Palette;
  line: RegisterLine;
  /** base stroke weight as fraction of short side. */
  weightU: number;
  /** glow/bloom intensity 0..1 (Moongates high, Blades ~0). */
  bloom: number;
  /** prefers symmetry (Crowns/major) vs. kinetic asymmetry (Blades). */
  symmetric: boolean;
}

export const REGISTER_TOKENS: Record<RegisterKey, RegisterToken> = {
  crowns: {
    key: "crowns", line: "gilded", weightU: 0.006, bloom: 0.25, symmetric: true,
    palette: { ground: "#f2e8cf", ink: "#23306b", accent: "#d4a02a", shade: "#8a7a3a", light: "#fff6da" },
  },
  blades: {
    key: "blades", line: "woodcut", weightU: 0.009, bloom: 0.05, symmetric: false,
    palette: { ground: "#2b2f37", ink: "#cfd3d8", accent: "#9d2b2b", shade: "#14161b", light: "#e9edf1" },
  },
  runes: {
    key: "runes", line: "illuminated", weightU: 0.008, bloom: 0.55, symmetric: true,
    palette: { ground: "#171a3a", ink: "#e9c75a", accent: "#f2dd8c", shade: "#0c0e24", light: "#fff7d0" },
  },
  moongates: {
    key: "moongates", line: "phosphor", weightU: 0.006, bloom: 0.85, symmetric: false,
    palette: { ground: "#10142e", ink: "#9fb6e8", accent: "#e0506a", shade: "#070a1c", light: "#dfe9ff" },
  },
  major: {
    key: "major", line: "fused", weightU: 0.007, bloom: 0.6, symmetric: true,
    palette: { ground: "#171232", ink: "#e7d9b8", accent: "#d8b24a", shade: "#0b0820", light: "#fff3d6" },
  },
};
