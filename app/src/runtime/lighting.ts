/**
 * Station lighting kernels — the sublimated transversal, realized as LIGHT.
 *
 * One generic builder reads a StationToken and returns a StationLight whose `wash`, `vignette`,
 * `tint`, and `pulse` carry that virtue's signature. No card ever names its virtue; it just
 * sits inside this weather.
 */
import type { StationLight, SketchKit, RGB } from "./types";
import { STATION_TOKENS, type StationToken } from "./tokens";
import { clamp01, frac, mix, rgba, scale, TAU } from "./color";

/** The motion signature of each station, as a 0..1 heartbeat over time. */
function pulseFor(motion: StationToken["motion"], t: number): number {
  switch (motion) {
    case "still": // noon does not flicker; a barely-there shimmer of air
      return clamp01(0.5 + 0.02 * Math.sin(t * 0.6));
    case "breathe": // slow warm hearth-swell, ~6s
      return clamp01(0.5 + 0.5 * Math.sin((t / 6) * TAU));
    case "charge": { // held tension + faint electric jitter + occasional hotspot
      const base = 0.38 + 0.1 * Math.sin(t * 2.4);
      const jitter = 0.05 * Math.sin(t * 31.0);
      const spike = 0.2 * Math.pow(Math.max(0, Math.sin(t * 0.9 - 1)), 6);
      return clamp01(base + jitter + spike);
    }
    case "poise": // two balanced sources, a very slow settle
      return clamp01(0.5 + 0.06 * Math.sin((t / 11) * TAU));
    case "ember": { // rekindle then deplete, ~5s
      const ph = frac(t / 5);
      return clamp01(0.3 + 0.55 * Math.pow(1 - ph, 1.8));
    }
    case "hold": // a standard slowly raised, then reset
      return clamp01(0.4 + 0.42 * frac(t / 8));
    case "drift": // sourceless wandering radiance
      return clamp01(0.5 + 0.25 * Math.sin(t * 0.5) + 0.2 * Math.sin(t * 0.27 + 1.3));
    case "settle": // low, earthbound, weight sinking
      return clamp01(0.34 + 0.16 * (0.5 + 0.5 * Math.sin(t * 0.4)));
    default:
      return 0.5;
  }
}

export function buildStationLight(token: StationToken): StationLight {
  const dark: RGB = scale(token.temp, 24); // the unlit ground (deep, moody)

  return {
    station: token.slug,

    pulse: (t) => pulseFor(token.motion, t),

    tint(t) {
      // ember/charge warm up with the pulse; others hold near temperature.
      const p = pulseFor(token.motion, t);
      const warm = token.motion === "ember" || token.motion === "charge" ? 0.5 + 0.5 * p : 1;
      return scale(token.temp, 120 + warm * 110);
    },

    dir: () => token.dir,

    wash(kit: SketchKit) {
      const { p, w, h } = kit;
      const t = kit.t;
      const pulse = pulseFor(token.motion, t);
      const lit: RGB = scale(token.temp, 60 + token.ambient * 120 * (0.85 + 0.15 * pulse));
      const ctx = p.drawingContext as CanvasRenderingContext2D;

      let grad: CanvasGradient;
      if (token.pool === "sourceless" || token.pool === "center") {
        // radial: light pools at/around center; sourceless drifts the center slowly.
        let dx = w / 2;
        let dy = h / 2;
        if (token.pool === "sourceless") {
          dx += Math.sin(t * 0.21) * w * 0.12;
          dy += Math.cos(t * 0.17) * h * 0.12;
        }
        grad = ctx.createRadialGradient(dx, dy, Math.min(w, h) * 0.04, w / 2, h / 2, Math.max(w, h) * 0.72);
        grad.addColorStop(0, rgba(lit, 1));
        grad.addColorStop(1, rgba(dark, 1));
      } else {
        // linear vertical: pool at top / bottom / even
        const x0 = 0;
        const y0 = token.pool === "bottom" ? h : 0;
        const y1 = token.pool === "bottom" ? 0 : h;
        grad = ctx.createLinearGradient(x0, y0, x0, y1);
        if (token.pool === "even") {
          grad.addColorStop(0, rgba(mix(lit, dark, 0.25), 1));
          grad.addColorStop(0.5, rgba(lit, 1));
          grad.addColorStop(1, rgba(mix(lit, dark, 0.25), 1));
        } else {
          grad.addColorStop(0, rgba(lit, 1));
          grad.addColorStop(1, rgba(dark, 1));
        }
      }
      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },

    vignette(kit: SketchKit) {
      const { p, w, h } = kit;
      const t = kit.t;
      const strength = clamp01(token.vignette * (0.85 + 0.15 * pulseFor(token.motion, t)));
      if (strength <= 0.01) return;
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      const grad = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.32,
        w / 2, h / 2, Math.max(w, h) * 0.72,
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, rgba(scale(token.temp, 10), strength));
      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },
  };
}

export const buildStationLightBySlug = (slug: keyof typeof STATION_TOKENS) =>
  buildStationLight(STATION_TOKENS[slug]);
