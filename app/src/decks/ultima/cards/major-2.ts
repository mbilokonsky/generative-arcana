/**
 * The Two Moons (Major 2) — station Valor, prime 2 (duality / the threshold).
 * Interactivity (a reading of the card): the pointer's x chooses which moon waxes; bring the
 * cursor to the gate and the lone figure leans toward crossing; click commits the step.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { cross: number; lean: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { cross: -1, lean: 0.15 }; S.set(k, s); }
  return s;
};
const gate = (kit: SketchKit) => ({ x: kit.cx, base: kit.h * 0.66, w: 0.3, h: 0.4 });

export default registerCard({
  slug: "major-2",

  onPointer(kit) {
    const s = state(kit);
    const g = gate(kit);
    const near = kit.pointer.inside && Math.abs(kit.pointer.x * kit.w - g.x) < kit.u(0.28);
    if (kit.pointer.pressed && near && s.cross < 0) {
      s.cross = kit.t;
      kit.signal("cross", { slug: "major-2" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    // valor: charged sky — a faint additive flash on the light's tension spikes
    const pulse = kit.light.pulse(kit.t);
    if (pulse > 0.78) {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(120,140,200,${(pulse - 0.78) * 0.45})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // stars
    p.push();
    p.noStroke();
    for (let i = 0; i < 40; i++) {
      const sx = kit.rng() * w;
      const sy = kit.rng() * h * 0.58;
      p.fill(255, 255, 255, 70 + 70 * Math.sin(kit.t * 0.7 + i));
      p.circle(sx, sy, kit.u(0.004));
    }
    p.pop();

    // two moons — near-full discs; the pointer shifts which one DOMINATES (size + glow), and
    // tips each toward a waxing/waning crescent without ever going dark.
    const px = kit.pointer.inside ? kit.pointer.x : 0.5 + 0.14 * Math.sin(kit.t * 0.3);
    const domL = 0.5 + 0.5 * (1 - px);
    const domR = 0.5 + 0.5 * px;
    kit.fig.moon(kit, w * 0.3, h * 0.24, 0.062 * (0.82 + 0.4 * domL), 0.82 + 0.16 * domL, "#e9ecf5"); // Trammel
    kit.fig.moon(kit, w * 0.7, h * 0.24, 0.062 * (0.82 + 0.4 * domR), 0.82 + 0.16 * domR, "#e0506a"); // Felucca

    // moor
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    for (let x = 0; x <= w; x += kit.u(0.03)) {
      p.vertex(x, h * 0.62 + p.noise(x * 0.005, 7) * kit.u(0.06));
    }
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // the moongate, shimmering brighter as the pointer nears it
    const g = gate(kit);
    const near = Math.abs(px * w - g.x) < kit.u(0.28);
    const open = Math.min(1, 0.5 + 0.12 * Math.sin(kit.t * 0.8) + (near ? 0.3 : 0));
    kit.fig.moongateArch(kit, g.x, g.base, g.w, g.h, open);

    // lone figure at the gate's lip
    const targetLean = near ? 1 : 0.15;
    s.lean += (targetLean - s.lean) * 0.06;
    let fx = g.x - kit.u(0.11);
    let alpha = 1;
    if (s.cross >= 0) {
      const e = (kit.t - s.cross) / 1.2;
      if (e >= 1) s.cross = -1;
      else {
        fx = g.x - kit.u(0.11) + e * kit.u(0.11);
        alpha = 1 - e;
      }
    }
    if (alpha > 0.02) {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalAlpha = alpha;
      kit.fig.figure(kit, fx, g.base + kit.u(0.01), 0.26, s.lean, kit.palette.ink);
      ctx.restore();
    }

    kit.light.vignette(kit);
  },
});
