/**
 * Suit rendering registers — the declared suit, realized as LINE and SURFACE.
 *
 * Built from a RegisterToken. Each register draws the same primitives in its own idiom:
 * Crowns gild, Blades bite (woodcut + hatching), Runes lie flat and illuminated, Moongates bloom.
 */
import type { SuitRegister, SketchKit } from "./types";
import { REGISTER_TOKENS, type RegisterToken } from "./tokens";
import { hexToRgb, rgba } from "./color";

export function buildRegister(token: RegisterToken): SuitRegister {
  const pal = token.palette;

  function strokeWeightPx(kit: SketchKit, weightU?: number) {
    return kit.u(weightU ?? token.weightU);
  }

  return {
    key: token.key,
    palette: pal,

    stroke(kit, weightU, color) {
      const { p } = kit;
      p.stroke(color ?? pal.ink);
      p.strokeWeight(strokeWeightPx(kit, weightU));
      p.strokeJoin(token.line === "woodcut" ? p.MITER : p.ROUND);
      p.strokeCap(token.line === "woodcut" ? p.PROJECT : p.ROUND);
    },

    fill(kit, color) {
      kit.p.fill(color ?? pal.ink);
    },

    outline(kit, pts, close = true) {
      const { p } = kit;
      const drawPath = () => {
        p.beginShape();
        for (const [x, y] of pts) p.vertex(x, y);
        p.endShape(close ? p.CLOSE : undefined);
      };
      if (token.line === "woodcut") {
        // the woodcut "bite": a heavier dark pass, then the ink contour slightly offset.
        p.push();
        p.noFill();
        this.stroke(kit, token.weightU * 1.7, pal.shade);
        p.translate(kit.u(0.004), kit.u(0.004));
        drawPath();
        p.pop();
        p.push();
        p.noFill();
        this.stroke(kit);
        drawPath();
        p.pop();
      } else if (token.line === "gilded") {
        // ink contour with a thin inner gold highlight.
        p.push();
        p.noFill();
        this.stroke(kit);
        drawPath();
        this.stroke(kit, token.weightU * 0.4, pal.accent);
        drawPath();
        p.pop();
      } else if (token.line === "phosphor" || token.line === "fused") {
        // glowing contour: a bloom underlay then a bright thin line.
        const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length;
        const cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
        this.glow(kit, cx, cy, 0.18, pal.accent, 0.5);
        p.push();
        p.noFill();
        this.stroke(kit, token.weightU * 0.8, pal.light);
        drawPath();
        p.pop();
      } else {
        // illuminated: clean flat contour.
        p.push();
        p.noFill();
        this.stroke(kit);
        drawPath();
        p.pop();
      }
    },

    glow(kit, x, y, radiusU, color, strength = 0.6) {
      const intensity = strength * token.bloom;
      if (intensity <= 0.02) return;
      const { p } = kit;
      const r = kit.u(radiusU);
      const c = hexToRgb(color ?? pal.accent);
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, rgba(c, 0.55 * intensity));
      grad.addColorStop(0.5, rgba(c, 0.22 * intensity));
      grad.addColorStop(1, rgba(c, 0));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    shade(kit, x, y, wU, hU, density = 0.5) {
      const { p } = kit;
      const w = kit.u(wU);
      const h = kit.u(hU);
      if (token.line === "woodcut") {
        // diagonal hatching — the manual woodcut tell.
        p.push();
        p.stroke(pal.shade);
        p.strokeWeight(kit.u(0.004));
        const step = kit.u(0.02) * (1.2 - density);
        for (let o = -h; o < w + h; o += Math.max(step, 1)) {
          p.line(x + o, y, x + o - h, y + h);
        }
        p.pop();
      } else if (token.line === "gilded") {
        // sparse gold stipple.
        p.push();
        p.noStroke();
        p.fill(pal.accent);
        const n = Math.floor(40 * density);
        for (let i = 0; i < n; i++) {
          const rx = x + kit.rng() * w;
          const ry = y + kit.rng() * h;
          p.circle(rx, ry, kit.u(0.004));
        }
        p.pop();
      } else if (token.line === "phosphor" || token.line === "fused") {
        // a soft wash of bloom.
        this.glow(kit, x + w / 2, y + h / 2, Math.max(wU, hU) * 0.6, pal.shade, 0.4 * density);
      }
      // illuminated: intentionally flat — no shading.
    },
  };
}

export const buildRegisterByKey = (key: keyof typeof REGISTER_TOKENS) =>
  buildRegister(REGISTER_TOKENS[key]);
