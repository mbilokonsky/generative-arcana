/**
 * The Companions (Major 6) — station Spirituality, number 6 (2×3, two triads in accord).
 * A circle of diverse companions clasp hands beneath an open sky of soft sourceless light,
 * two faint moons and three motes of colored radiance hovering over their joined center; the
 * air is weightless and luminous, no cast shadows, a quiet numinous belonging. The light is
 * spirituality's: drifting, haloed, from everywhere and nowhere.
 * Interactivity (a reading of the card): the pointer gathers the three motes toward the joined
 * center and brightens it — attention drawing the company into accord.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { gather: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { gather: 0 }; S.set(k, s); }
  return s;
};

// six companions: two triads (number 6 = 2×3) — alternating to read as two accordant threes
const N = 6;
const MOTE_COLORS = ["#d8b24a", "#7fb4e0", "#d98f9a"]; // gold, sky, rose — three radiances

export default registerCard({
  slug: "major-6",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // spirituality: sourceless drifting radiance, no shadows

    const drift = kit.light.pulse(kit.t);
    const ringCx = kit.cx;
    const ringCy = kit.h * 0.56;
    const ringR = kit.u(0.3);

    const near = kit.pointer.inside;
    s.gather += ((near ? 1 : 0) - s.gather) * 0.05;

    // --- the open luminous sky: faint drifting haloes, no horizon, weightless ---
    p.push();
    p.noStroke();
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2 + kit.t * 0.04;
      const rad = kit.u(0.15 + 0.32 * kit.rng());
      const hx = ringCx + Math.cos(ang) * rad + Math.sin(kit.t * 0.2 + i) * kit.u(0.02);
      const hy = ringCy * (0.5 + 0.7 * kit.rng()) + Math.cos(kit.t * 0.18 + i) * kit.u(0.02);
      kit.register.glow(kit, hx, hy, 0.05, kit.palette.light, 0.06 + 0.05 * drift);
    }
    p.pop();

    // --- two faint moons, drifting high and weightless ---
    const mDrift = Math.sin(kit.t * 0.15) * kit.u(0.02);
    kit.fig.moon(kit, ringCx - kit.u(0.22) + mDrift, kit.h * 0.26, 0.05, 0.92, "#e9ecf5");
    kit.fig.moon(kit, ringCx + kit.u(0.24) - mDrift, kit.h * 0.3, 0.042, 0.86, "#dfe6f5");

    // --- the joined center: a soft brightening core where hands meet ---
    const coreBright = 0.4 + 0.25 * drift + 0.6 * s.gather;
    kit.register.glow(kit, ringCx, ringCy, 0.1 + 0.05 * s.gather, kit.palette.light, coreBright);

    // --- the ring of companions, clasping hands; gestural silhouettes, no shadows ---
    // each leans slightly inward (toward the center) so the circle reads as joined.
    const figs: Array<{ x: number; y: number; lean: number; tri: number }> = [];
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2; // start at top
      const bob = Math.sin(kit.t * 0.3 + i * 1.1) * kit.u(0.008); // weightless float
      const fx = ringCx + Math.cos(ang) * ringR;
      const fyFeet = ringCy + Math.sin(ang) * ringR * 0.62 + bob; // ellipse (perspective ring)
      // lean toward center: negative on right side, positive on left (figure rotates by lean*0.18)
      const lean = Math.cos(ang) * 0.5;
      figs.push({ x: fx, y: fyFeet, lean, tri: i % 2 });
    }
    // draw back-row (top of ellipse) first, front-row last, for depth
    const order = [...figs].map((f, i) => ({ f, i })).sort((p1, p2) => p1.f.y - p2.f.y);
    for (const { f } of order) {
      // two triads tinted subtly different (warm vs cool) to read as 2×3
      const tone = f.tri === 0 ? "#b9c6e8" : "#cdbfe2";
      // soft halo around each — sourceless, no cast shadow
      kit.register.glow(kit, f.x, f.y - kit.u(0.16), 0.07, kit.palette.light, 0.18 + 0.12 * drift);
      kit.fig.figure(kit, f.x, f.y, 0.2, f.lean, tone);
      // clasped-hand link: a faint luminous arc to the next companion
    }
    // luminous links between adjacent clasped hands (drawn over figures, under motes)
    p.push();
    kit.register.stroke(kit, 0.006, kit.palette.light);
    const lctx = p.drawingContext as CanvasRenderingContext2D;
    lctx.save();
    lctx.globalAlpha = 0.35 + 0.2 * drift;
    for (let i = 0; i < N; i++) {
      const a = figs[i];
      const b = figs[(i + 1) % N];
      const ay = a.y - kit.u(0.09), by = b.y - kit.u(0.09);
      // gentle inward bow toward center
      const mx = (a.x + b.x) / 2 + (ringCx - (a.x + b.x) / 2) * 0.18;
      const my = (ay + by) / 2 + (ringCy - (ay + by) / 2) * 0.18;
      p.noFill();
      p.beginShape();
      p.vertex(a.x, ay);
      p.quadraticVertex(mx, my, b.x, by);
      p.endShape();
    }
    lctx.restore();
    p.pop();

    // --- three motes of colored radiance hovering over the joined center ---
    // they orbit; the pointer gathers them inward to the core.
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    for (let i = 0; i < 3; i++) {
      const orbit = kit.loop(7, i / 3) * Math.PI * 2;
      const baseR = kit.u(0.1) * (1 - 0.85 * s.gather);
      const mx = ringCx + Math.cos(orbit) * baseR;
      const my = ringCy - kit.u(0.05) + Math.sin(orbit) * baseR * 0.7
        - kit.u(0.04) * (1 - s.gather);
      const col = MOTE_COLORS[i];
      kit.register.glow(kit, mx, my, 0.05 + 0.02 * s.gather, col, 0.7 + 0.3 * s.gather);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(mx, my, kit.u(0.012 + 0.004 * Math.sin(kit.t * 1.5 + i)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (near && kit.pointer.pressed) kit.signal("gather", { slug: "major-6" });

    kit.light.vignette(kit);
  },
});
