/**
 * The Gatewarden (Major 8) — station Honesty, number 8 (2³, a built sequence).
 * A weathered keeper stands astride a stone moongate at clear noon, one hand on each pillar,
 * a ring of keys and many small moons etched into the arch behind; the light is flat and total,
 * the warden's stance entirely readable, hiding nothing of the toll. The light is honesty's:
 * flat, even, merciless noon that does NOT flicker — stillness is the animation.
 * Interactivity (a reading of the card): the pointer over the gate turns a key in the ring and
 * the gate-glow steadies honestly, brightening without hiding — the toll shown plainly.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { turn: number; open: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { turn: 0, open: 0.5 }; S.set(k, s); }
  return s;
};

const MOONS = 8; // 2³ — a built sequence of small moons etched along the arch

export default registerCard({
  slug: "major-8",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // honesty: flat, even, merciless noon — does NOT flicker

    const gateX = kit.cx;
    const gateBase = kit.h * 0.82;
    const gateW = 0.4;
    const gateH = 0.5;
    const archHpx = kit.u(gateH);
    const archTopY = gateBase - archHpx;
    const half = kit.u(gateW) / 2;

    const near = kit.pointer.inside &&
      Math.abs(kit.pointer.x * w - gateX) < kit.u(0.32);
    s.turn += ((near ? 1 : 0) - s.turn) * 0.06;
    // honesty: the gate-glow STEADIES — no flicker; pointer only raises a steady level
    s.open += ((0.5 + 0.35 * (near ? 1 : 0)) - s.open) * 0.04;

    // --- the big stone moongate ---
    kit.fig.moongateArch(kit, gateX, gateBase, gateW, gateH, s.open);

    // --- a built course of stone blocks framing the gate (2³ readable masonry) ---
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    const blkH = kit.u(0.05);
    for (let side = -1; side <= 1; side += 2) {
      const px = gateX + side * (half + kit.u(0.04));
      for (let i = 0; i < 8; i++) {
        const by = gateBase - i * blkH;
        if (by - blkH < archTopY + half) continue; // stop where the arch curves in
        p.rect(px - kit.u(0.04), by - blkH, kit.u(0.08), blkH - kit.u(0.004));
      }
    }
    p.pop();

    // --- MANY small moons etched along the arch (echo the 8 / 2³) ---
    for (let i = 0; i < MOONS; i++) {
      const a = Math.PI - (Math.PI * (i + 0.5)) / MOONS; // around the arch curve
      const mr = half * 0.86;
      const mx = gateX + Math.cos(a) * mr;
      const my = (archTopY + half) - Math.sin(a) * mr;
      // a built sequence of phases: 8 etched moons stepping through their cycle
      const phase = 0.25 + 0.75 * (i / (MOONS - 1));
      kit.fig.moon(kit, mx, my, 0.026, phase, "#e7e2cf");
    }

    // --- the ring of keys hanging from the keystone ---
    const ringX = gateX;
    const ringY = archTopY + half - kit.u(0.02);
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.006, kit.palette.accent);
    p.circle(ringX, ringY, kit.u(0.05)); // the iron ring itself
    p.pop();
    // three keys hanging from the ring, one turning under the pointer
    for (let i = 0; i < 3; i++) {
      const baseAng = Math.PI / 2 + (i - 1) * 0.5; // splayed downward
      const turn = i === 1 ? s.turn * 1.1 : 0; // the middle key turns
      const ang = baseAng + turn;
      const kx = ringX + Math.cos(ang) * kit.u(0.025);
      const ky = ringY + Math.sin(ang) * kit.u(0.025);
      const klen = kit.u(0.07);
      const ex = kx + Math.cos(ang) * klen;
      const ey = ky + Math.sin(ang) * klen;
      p.push();
      kit.register.stroke(kit, 0.006, kit.palette.accent);
      p.line(kx, ky, ex, ey); // shaft
      // bow (loop at the ring end)
      p.noFill();
      p.circle(kx, ky, kit.u(0.02));
      // bit teeth at the far end
      p.line(ex, ey, ex - Math.sin(ang) * kit.u(0.014), ey + Math.cos(ang) * kit.u(0.014));
      p.line(ex - Math.cos(ang) * kit.u(0.018), ey - Math.sin(ang) * kit.u(0.018),
        ex - Math.cos(ang) * kit.u(0.018) - Math.sin(ang) * kit.u(0.014),
        ey - Math.sin(ang) * kit.u(0.018) + Math.cos(ang) * kit.u(0.014));
      p.pop();
    }
    // when the key turns, the gate-glow brightens HONESTLY (steady, hiding nothing)
    if (s.turn > 0.02) {
      kit.register.glow(kit, gateX, archTopY + half * 1.3, gateH * 0.5,
        kit.palette.light, 0.2 * s.turn);
    }

    // --- the weathered keeper, astride the gate, a hand on each pillar ---
    // draw the figure centered at the gate mouth, then add outstretched arms to both pillars.
    const feetY = gateBase + kit.u(0.005);
    const figH = kit.u(0.34);
    kit.fig.figure(kit, gateX, feetY, 0.34, 0, kit.palette.ink);
    // arms reaching out to touch both pillars — flat, total, readable
    const shoulderY = feetY - figH * 0.74;
    p.push();
    kit.register.stroke(kit, 0.014, kit.palette.ink);
    p.strokeCap(p.ROUND);
    for (let side = -1; side <= 1; side += 2) {
      const handX = gateX + side * (half - kit.u(0.01));
      const handY = shoulderY + kit.u(0.06);
      p.line(gateX + side * kit.u(0.02), shoulderY, handX, handY);
    }
    p.pop();

    // --- the flat noon: a high, even key-light wash that does not move ---
    // (no flicker — a single steady additive lift, constant in time, reading as total daylight)
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const noon = ctx.createLinearGradient(0, 0, 0, h);
    noon.addColorStop(0, "rgba(248,247,238,0.10)");
    noon.addColorStop(0.5, "rgba(248,247,238,0.05)");
    noon.addColorStop(1, "rgba(248,247,238,0.0)");
    ctx.fillStyle = noon;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    if (near && kit.pointer.pressed) kit.signal("turn-key", { slug: "major-8" });

    kit.light.vignette(kit);
  },
});
