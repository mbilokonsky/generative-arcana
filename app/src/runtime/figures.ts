/**
 * Reusable vector forms — the shared "assets" that keep 78 cards in one family.
 *
 * Each is drawn IN the current register, so the same primitive reads as gilded on a Crown,
 * hatched on a Blade, glowing on a Moongate. Cards compose these into bespoke scenes and may
 * also draw their own one-off geometry; these exist so the recurring icons never drift.
 */
import type { Figures, SuitRegister, SketchKit } from "./types";
import { hexToRgb, rgba, TAU } from "./color";

export function buildFigures(register: SuitRegister): Figures {
  const pal = register.palette;

  return {
    moon(kit, x, y, rU, phase = 1, color) {
      const { p } = kit;
      const r = kit.u(rU);
      const col = color ?? pal.light;
      register.glow(kit, x, y, rU * 2.2, color ?? pal.accent, 0.5);
      p.push();
      p.noStroke();
      p.fill(col);
      p.circle(x, y, r * 2);
      // maria — faint surface mottling, deterministic
      p.fill(rgba(hexToRgb(pal.shade), 0.18));
      for (let i = 0; i < 5; i++) {
        const a = kit.rng() * TAU;
        const rr = kit.rng() * r * 0.6;
        p.circle(x + Math.cos(a) * rr, y + Math.sin(a) * rr, r * (0.18 + kit.rng() * 0.22));
      }
      // phase shadow — a dark crescent dims the unlit portion
      if (phase < 0.995) {
        p.fill(rgba(hexToRgb(pal.shade), 0.9));
        const off = (1 - phase) * 2 * r;
        p.circle(x + off, y, r * 2);
      }
      p.pop();
    },

    moongateArch(kit, x, yBase, wU, hU, open = 1) {
      const { p } = kit;
      const w = kit.u(wU);
      const h = kit.u(hU);
      const half = w / 2;
      const top = yBase - h;
      // inner luminous fill
      register.glow(kit, x, yBase - h * 0.55, Math.max(wU, hU) * 0.7, pal.accent, 0.5 + 0.5 * open);
      p.push();
      p.noStroke();
      const c = hexToRgb(pal.accent);
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      const g = ctx.createLinearGradient(0, yBase, 0, top);
      g.addColorStop(0, rgba(c, 0.05 + 0.25 * open));
      g.addColorStop(1, rgba(hexToRgb(pal.light), 0.15 + 0.45 * open));
      ctx.save();
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - half, yBase);
      ctx.lineTo(x - half, top + half);
      ctx.arc(x, top + half, half, Math.PI, 0);
      ctx.lineTo(x + half, yBase);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      p.pop();
      // the arch ring (outline in register idiom)
      const pts: Array<[number, number]> = [];
      pts.push([x - half, yBase]);
      pts.push([x - half, top + half]);
      const steps = 18;
      for (let i = 0; i <= steps; i++) {
        const a = Math.PI - (Math.PI * i) / steps;
        pts.push([x + Math.cos(a) * half, top + half - Math.sin(a) * half]);
      }
      pts.push([x + half, yBase]);
      register.outline(kit, pts, false);
    },

    figure(kit, x, yFeet, hU, lean = 0, color) {
      const { p } = kit;
      const h = kit.u(hU);
      const col = color ?? pal.shade;
      p.push();
      p.translate(x, yFeet);
      p.rotate(lean * 0.18);
      p.noStroke();
      p.fill(col);
      const headR = h * 0.11;
      // head
      p.circle(0, -h + headR, headR * 2);
      // torso + robe as a tapered body
      p.beginShape();
      p.vertex(-h * 0.085, -h + headR * 1.6);
      p.vertex(h * 0.085, -h + headR * 1.6);
      p.vertex(h * 0.16, 0);
      p.vertex(-h * 0.16, 0);
      p.endShape(p.CLOSE);
      // a faint rim of the station light on the lit side
      p.fill(rgba(hexToRgb(color ?? pal.ink), 0.0));
      p.pop();
    },

    crown(kit, x, y, wU, color) {
      const w = kit.u(wU);
      const hw = w / 2;
      const h = w * 0.62;
      const pts: Array<[number, number]> = [
        [x - hw, y], [x - hw, y - h * 0.55],
        [x - hw * 0.45, y - h * 0.15], [x, y - h],
        [x + hw * 0.45, y - h * 0.15], [x + hw, y - h * 0.55],
        [x + hw, y],
      ];
      kit.register.fill(kit, color ?? pal.accent);
      kit.p.push();
      kit.p.noStroke();
      kit.p.beginShape();
      for (const [px, py] of pts) kit.p.vertex(px, py);
      kit.p.endShape(kit.p.CLOSE);
      kit.p.rect(x - hw, y, w, h * 0.22);
      kit.p.pop();
      kit.register.outline(kit, [...pts, [x - hw, y + h * 0.22], [x + hw, y + h * 0.22]], false);
    },

    sword(kit, x, y, lenU, angle = 0, color) {
      const { p } = kit;
      const L = kit.u(lenU);
      p.push();
      p.translate(x, y);
      p.rotate(angle);
      const col = color ?? pal.ink;
      p.noStroke();
      p.fill(col);
      // blade
      p.beginShape();
      p.vertex(0, -L);
      p.vertex(L * 0.05, -L * 0.78);
      p.vertex(L * 0.05, -L * 0.1);
      p.vertex(-L * 0.05, -L * 0.1);
      p.vertex(-L * 0.05, -L * 0.78);
      p.endShape(p.CLOSE);
      // crossguard + grip + pommel
      p.rect(-L * 0.18, -L * 0.12, L * 0.36, L * 0.045);
      p.rect(-L * 0.03, -L * 0.08, L * 0.06, L * 0.18);
      p.circle(0, L * 0.12, L * 0.07);
      p.pop();
    },

    rune(kit, x, y, sU, complete = 1, color) {
      const { p } = kit;
      const s = kit.u(sU);
      const col = color ?? pal.accent;
      const c = Math.max(0, Math.min(1, complete));
      register.glow(kit, x, y, sU * 0.9, col, 0.6 * c);
      p.push();
      p.stroke(col);
      p.strokeWeight(kit.u(0.012));
      p.strokeCap(p.ROUND);
      const top = y - s * 0.55;
      const bot = y + s * 0.55 * c + s * 0.55 * (1 - c) * 0.0;
      p.line(x, top, x, top + (s * 1.1) * c);
      const b = s * 0.32;
      // three branches grow with completion
      if (c > 0.25) p.line(x, top + s * 0.2, x + b * Math.min(1, (c - 0.25) / 0.25), top + s * 0.2 - b * 0.6 * Math.min(1, (c - 0.25) / 0.25));
      if (c > 0.5) p.line(x, top + s * 0.5, x - b * Math.min(1, (c - 0.5) / 0.25), top + s * 0.5 - b * 0.6 * Math.min(1, (c - 0.5) / 0.25));
      if (c > 0.75) p.line(x, top + s * 0.8, x + b * Math.min(1, (c - 0.75) / 0.25), top + s * 0.8 - b * 0.6 * Math.min(1, (c - 0.75) / 0.25));
      p.pop();
    },

    ankh(kit, x, y, hU, color) {
      const { p } = kit;
      const h = kit.u(hU);
      const col = color ?? pal.accent;
      p.push();
      p.noFill();
      p.stroke(col);
      p.strokeWeight(kit.u(0.014));
      p.ellipse(x, y - h * 0.32, h * 0.34, h * 0.42);
      p.line(x, y - h * 0.1, x, y + h * 0.5);
      p.line(x - h * 0.22, y + h * 0.04, x + h * 0.22, y + h * 0.04);
      p.pop();
    },

    tower(kit, x, yBase, wU, hU, color) {
      const { p } = kit;
      const w = kit.u(wU);
      const h = kit.u(hU);
      const pts: Array<[number, number]> = [
        [x - w / 2, yBase], [x - w / 2, yBase - h],
        [x + w / 2, yBase - h], [x + w / 2, yBase],
      ];
      kit.register.fill(kit, color ?? pal.shade);
      p.push();
      p.noStroke();
      p.rect(x - w / 2, yBase - h, w, h);
      // battlements
      const bw = w / 5;
      for (let i = 0; i < 3; i++) p.rect(x - w / 2 + i * 2 * bw, yBase - h - bw, bw, bw);
      p.pop();
      kit.register.outline(kit, pts, false);
    },

    reflect(kit, yWater, drawAbove) {
      drawAbove();
      const { p } = kit;
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      p.push();
      ctx.save();
      // clip to below the waterline
      ctx.beginPath();
      ctx.rect(0, yWater, kit.w, kit.h - yWater);
      ctx.clip();
      ctx.globalAlpha = 0.28;
      p.translate(0, yWater * 2);
      p.scale(1, -1);
      // gentle horizontal shimmer
      p.translate(Math.sin(kit.t * 0.8) * kit.u(0.006), 0);
      drawAbove();
      ctx.restore();
      p.pop();
    },
  };
}
