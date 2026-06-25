/**
 * The Lantern (Major 9) — station Compassion (a low warm hearth-glow that BREATHES slowly,
 * edges soft, everything enfolded), number 9.
 * Scene: a cloaked hermit on a night road lifts a warm-glowing lantern back toward an unseen
 * traveler, their own face half in gentle shadow; the light pools low and golden and enfolding,
 * the three-fold flame inside the glass burning steady and inward.
 * Interactivity (a reading): the pointer IS the unseen traveler — the lantern reaches toward it
 * and the golden pool gathers where the cursor falls; compassion turning its light to meet you.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { reach: number; px: number; py: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { reach: 0.5, px: 0.62, py: 0.5 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-9",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("turn", { slug: "major-9" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const ctx = p.drawingContext as CanvasRenderingContext2D;
    // compassion breath — slow swell carried on the station pulse
    const breath = kit.light.pulse(kit.t); // 0..1, breathing
    const swell = 0.85 + 0.15 * breath;

    // --- the night road: a low dark band curving across the lower card ---
    const roadY = h * 0.78;
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    for (let x = 0; x <= w; x += kit.u(0.03)) {
      const yy = roadY + p.noise(x * 0.004, 11) * kit.u(0.05);
      p.vertex(x, yy);
    }
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // a few cool faint stars in the upper night (kept clear of the banner, dim)
    p.push();
    p.noStroke();
    for (let i = 0; i < 26; i++) {
      const sx = kit.rng() * w;
      const sy = kit.h * 0.14 + kit.rng() * kit.h * 0.4;
      p.fill(231, 217, 184, 22 + 18 * Math.sin(kit.t * 0.4 + i));
      p.circle(sx, sy, kit.u(0.003));
    }
    p.pop();

    // --- the unseen traveler's position drives the lantern's reach ---
    // default: the hermit holds the lantern out to the warm right side, breathing slowly.
    const defX = 0.66 + 0.03 * Math.sin(kit.t * 0.5);
    const defY = 0.5;
    const tx = kit.pointer.inside ? kit.pointer.x : defX;
    const ty = kit.pointer.inside ? kit.pointer.y : defY;
    s.px += (tx - s.px) * 0.07;
    s.py += (ty - s.py) * 0.07;

    // the hermit stands left of center; the lantern arm reaches toward the traveler
    const hermitX = kit.cx - kit.u(0.26);
    const feetY = roadY + kit.u(0.02);
    const hermitH = 0.34;

    // lantern target point — out and slightly up from the hermit, toward the traveler
    const aimX = s.px * w;
    const aimY = (0.30 + (s.py - 0.5) * 0.4) * h + kit.h * 0.08;
    const shoulderY = feetY - kit.u(hermitH) * 0.74;
    const lx = hermitX + (aimX - hermitX) * 0.55;
    const ly = shoulderY + (aimY - shoulderY) * 0.5;

    // --- the warm golden enfolding pool: the lantern is the bright source ---
    // pooled low and golden where the light falls, breathing on the station pulse.
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    // broad soft enfolding wash
    const pool = ctx.createRadialGradient(lx, ly, 0, lx, ly, kit.u(0.62) * swell);
    pool.addColorStop(0, `rgba(255,220,140,${0.34 * swell})`);
    pool.addColorStop(0.4, `rgba(232,168,70,${0.16 * swell})`);
    pool.addColorStop(1, "rgba(120,70,20,0)");
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.arc(lx, ly, kit.u(0.62) * swell, 0, Math.PI * 2);
    ctx.fill();
    // the pool spilling onto the road below — a golden puddle of warmth
    const groundPool = ctx.createRadialGradient(lx, roadY + kit.u(0.04), 0, lx, roadY + kit.u(0.04), kit.u(0.34) * swell);
    groundPool.addColorStop(0, `rgba(240,180,90,${0.22 * swell})`);
    groundPool.addColorStop(1, "rgba(120,70,20,0)");
    ctx.fillStyle = groundPool;
    ctx.beginPath();
    ctx.ellipse(lx, roadY + kit.u(0.045), kit.u(0.34) * swell, kit.u(0.10) * swell, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // register glow as the lantern core bloom
    kit.register.glow(kit, lx, ly, 0.16 * swell, "#ffd27a", 0.9 * swell);

    // --- the hermit: a cloaked, hooded figure, bowed/turning toward the traveler ---
    // far side half in gentle shadow; near side warmed by the lantern.
    // lean toward the lantern's side (positive lean tips toward the warm right)
    const lean = 0.5;
    // hood: draw the figure, then add a hood lump over the head + a cowl drape
    kit.fig.figure(kit, hermitX, feetY, hermitH, lean, kit.palette.ink);

    // cloak overlay — a tapering dark drape widening at the base, hood peak above the head
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    const hHead = kit.u(hermitH);
    const headY = feetY - hHead + hHead * 0.11;
    // hood: a rounded peak slightly forward (toward the lantern)
    p.beginShape();
    p.vertex(hermitX - hHead * 0.14, headY + hHead * 0.05);
    p.vertex(hermitX - hHead * 0.10, headY - hHead * 0.13);
    p.vertex(hermitX + hHead * 0.06, headY - hHead * 0.16);
    p.vertex(hermitX + hHead * 0.16, headY - hHead * 0.02);
    p.vertex(hermitX + hHead * 0.12, headY + hHead * 0.10);
    p.endShape(p.CLOSE);
    // cloak body drape
    p.beginShape();
    p.vertex(hermitX - hHead * 0.12, headY + hHead * 0.08);
    p.vertex(hermitX + hHead * 0.13, headY + hHead * 0.08);
    p.vertex(hermitX + hHead * 0.26, feetY);
    p.vertex(hermitX - hHead * 0.24, feetY);
    p.endShape(p.CLOSE);
    p.pop();

    // face half in gentle shadow: a soft warm rim on the lantern-facing side of the hood
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rim = ctx.createRadialGradient(
      hermitX + hHead * 0.05, headY, 0,
      hermitX + hHead * 0.05, headY, hHead * 0.4,
    );
    rim.addColorStop(0, `rgba(255,210,130,${0.16 * swell})`);
    rim.addColorStop(1, "rgba(255,210,130,0)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(hermitX + hHead * 0.05, headY, hHead * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- the raised arm: a thin dark line from the cloak to the lantern ---
    p.push();
    kit.register.stroke(kit, 0.012, kit.palette.shade);
    p.line(hermitX + hHead * 0.08, shoulderY, lx, ly + kit.u(0.05));
    p.pop();

    // --- the lantern itself: a glass case hung at (lx, ly) with a three-fold flame inside ---
    const lw = kit.u(0.07);
    const lh = kit.u(0.10);
    p.push();
    p.translate(lx, ly);
    // hanging ring + top cap
    kit.register.stroke(kit, 0.008, kit.palette.accent);
    p.noFill();
    p.circle(0, -lh * 0.62, lw * 0.28);
    // metal frame of the lantern (gilded outline)
    const frame: Array<[number, number]> = [
      [-lw * 0.5, -lh * 0.42],
      [-lw * 0.5, lh * 0.5],
      [lw * 0.5, lh * 0.5],
      [lw * 0.5, -lh * 0.42],
      [0, -lh * 0.58],
    ];
    // base
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(-lw * 0.5, lh * 0.5, lw, lh * 0.12);
    p.pop();
    // glowing glass interior fill
    const gctx = p.drawingContext as CanvasRenderingContext2D;
    gctx.save();
    gctx.globalCompositeOperation = "lighter";
    const glass = gctx.createLinearGradient(0, -lh * 0.42, 0, lh * 0.5);
    glass.addColorStop(0, `rgba(255,235,180,${0.5 * swell})`);
    glass.addColorStop(1, `rgba(232,160,60,${0.4 * swell})`);
    gctx.fillStyle = glass;
    gctx.fillRect(-lw * 0.46, -lh * 0.4, lw * 0.92, lh * 0.88);
    gctx.restore();
    // --- the three-fold flame, steady and inward ---
    gctx.save();
    gctx.globalCompositeOperation = "lighter";
    for (let i = -1; i <= 1; i++) {
      const fxOff = i * lw * 0.2;
      const fScale = i === 0 ? 1 : 0.7;
      const flick = 1 + 0.05 * Math.sin(kit.t * 1.1 + i); // steady, barely moving (inward)
      p.noStroke();
      const fl = gctx.createRadialGradient(fxOff, lh * 0.12, 0, fxOff, lh * 0.12, lh * 0.3 * fScale);
      fl.addColorStop(0, `rgba(255,245,210,${0.9 * swell})`);
      fl.addColorStop(0.5, `rgba(255,190,90,${0.55 * swell})`);
      fl.addColorStop(1, "rgba(255,140,40,0)");
      gctx.fillStyle = fl;
      gctx.beginPath();
      // teardrop flame
      gctx.moveTo(fxOff, lh * 0.26);
      gctx.quadraticCurveTo(fxOff - lw * 0.12 * fScale, lh * 0.06, fxOff, lh * (0.06 - 0.22 * fScale * flick));
      gctx.quadraticCurveTo(fxOff + lw * 0.12 * fScale, lh * 0.06, fxOff, lh * 0.26);
      gctx.fill();
    }
    gctx.restore();
    // gilded frame outline last, over the glow
    kit.register.outline(kit, frame, true);
    // vertical bars of the lantern frame
    p.push();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.line(0, -lh * 0.4, 0, lh * 0.5);
    p.pop();
    p.pop();

    // ankh motif — faint, hung at the hermit's breast, the recurring major sign
    kit.fig.ankh(kit, hermitX, feetY - hHead * 0.5, 0.045, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
