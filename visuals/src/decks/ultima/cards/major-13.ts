/**
 * The Black Gate (Major 13) — station Honor (formal VERTICAL light, columnar and held,
 * burnished and ceremonial, upright and a little cold). Number 13.
 * Scene: a towering gate of black stone stands open on a windswept height at the formal
 * vertical hour; one figure passes through it upright and unbowed while withered banners
 * stream sideways in the wind; the light is burnished and grave, the threshold absolute —
 * what enters does not return the same.
 * Interactivity (a reading): the pointer at the gate draws the lone figure across the
 * threshold, upright; crossing committed signals a passage.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { cross: number; draw: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { cross: -1, draw: 0 }; S.set(k, s); }
  return s;
};

const gate = (kit: SketchKit) => ({ x: kit.cx, base: kit.h * 0.86, w: 0.34, h: 0.62 });

export default registerCard({
  slug: "major-13",

  onPointer(kit) {
    const s = state(kit);
    const g = gate(kit);
    const near = kit.pointer.inside && Math.abs(kit.pointer.x * kit.w - g.x) < kit.u(0.24);
    if (kit.pointer.pressed && near && s.cross < 0) {
      s.cross = kit.t;
      kit.signal("passage", { slug: "major-13" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // honor: a columnar vertical light, burnished and cold

    const hold = kit.light.pulse(kit.t);
    const g = gate(kit);
    const top = g.base - kit.u(g.h);

    // pointer nearness draws the figure toward the threshold
    const near = kit.pointer.inside && Math.abs(kit.pointer.x * w - g.x) < kit.u(0.24);
    s.draw += ((near ? 1 : 0) - s.draw) * 0.05;

    // --- a cold, grave sky: a thin burnished band low across the height, dark above ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.86);
    sky.addColorStop(0, "rgba(7,5,18,0)");
    sky.addColorStop(0.72, "rgba(120,108,84,0.10)");
    sky.addColorStop(0.92, `rgba(216,178,74,${0.18 + 0.06 * hold})`);
    sky.addColorStop(1, "rgba(60,46,20,0.0)");
    ctx.save();
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.86);
    ctx.restore();
    p.pop();

    // cold stars, sparse, high
    p.push();
    p.noStroke();
    for (let i = 0; i < 28; i++) {
      const sx = kit.rng() * w;
      const sy = kit.rng() * h * 0.5;
      p.fill(231, 217, 184, 40 + 50 * (0.5 + 0.5 * Math.sin(kit.t * 0.5 + i * 1.7)));
      p.circle(sx, sy, kit.u(0.0035));
    }
    p.pop();

    // --- the windswept height: a bare ridge falling away on both sides ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    p.vertex(0, h * 0.9);
    for (let x = 0; x <= w; x += kit.u(0.03)) {
      const r = Math.abs(x - g.x) / w;
      p.vertex(x, h * 0.86 + r * kit.u(0.12) + p.noise(x * 0.006, 11) * kit.u(0.03));
    }
    p.vertex(w, h * 0.9);
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- the towering BLACK STONE gate: a tall portal, grave and dark, with a faint inner threshold ---
    const half = kit.u(g.w) / 2;
    const archTop = top + half;

    // a luminous-but-grave threshold WITHIN the opening — cold pale light, not the usual bright gate
    p.push();
    const tctx = p.drawingContext as CanvasRenderingContext2D;
    const inX = g.x, inTop = top + half * 0.6, inHalf = half * 0.62;
    const thr = tctx.createLinearGradient(0, g.base, 0, inTop);
    const ta = 0.10 + 0.10 * hold + 0.18 * s.draw;
    thr.addColorStop(0, `rgba(20,16,30,${0.9})`);
    thr.addColorStop(0.5, `rgba(120,120,140,${ta})`);
    thr.addColorStop(1, `rgba(231,217,184,${ta * 1.4})`);
    tctx.save();
    tctx.fillStyle = thr;
    tctx.beginPath();
    tctx.moveTo(inX - inHalf, g.base);
    tctx.lineTo(inX - inHalf, inTop + inHalf * 0.4);
    tctx.arc(inX, inTop + inHalf * 0.4, inHalf, Math.PI, 0);
    tctx.lineTo(inX + inHalf, g.base);
    tctx.closePath();
    tctx.fill();
    tctx.restore();
    p.pop();

    // the black stone jambs and arch — drawn as solid near-black masses framing the threshold
    const drawBlackGate = () => {
      p.push();
      p.noStroke();
      // black stone body, faintly warmer than the void so it reads as carved stone
      const stone = "#14101f";
      p.fill(stone);
      // left jamb
      p.rect(g.x - half - kit.u(0.05), top + half, kit.u(0.11), g.base - (top + half));
      // right jamb
      p.rect(g.x + half - kit.u(0.06), top + half, kit.u(0.11), g.base - (top + half));
      // the heavy arch over the top — an annulus between outer and inner radius
      const ctx2 = p.drawingContext as CanvasRenderingContext2D;
      ctx2.save();
      ctx2.fillStyle = stone;
      ctx2.beginPath();
      ctx2.arc(g.x, archTop, half + kit.u(0.055), Math.PI, 0);
      ctx2.arc(g.x, archTop, half, 0, Math.PI, true);
      ctx2.closePath();
      ctx2.fill();
      // a flat lintel cap above the arch — columnar and formal
      ctx2.fillRect(g.x - half - kit.u(0.07), top - kit.u(0.04), kit.u(g.w) + kit.u(0.14), kit.u(0.05));
      ctx2.restore();
      p.pop();
    };
    drawBlackGate();

    // a burnished gold edge-line tracing the arch (honor: ceremonial, cold gilt)
    const arcPts: Array<[number, number]> = [];
    arcPts.push([g.x - half, g.base]);
    arcPts.push([g.x - half, archTop]);
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI - (Math.PI * i) / 20;
      arcPts.push([g.x + Math.cos(a) * half, archTop - Math.sin(a) * half]);
    }
    arcPts.push([g.x + half, g.base]);
    p.push();
    p.drawingContext.globalAlpha = 0.55 + 0.2 * hold;
    kit.register.outline(kit, arcPts, false);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // a vertical shaft of cold burnished light falling straight down through the open gate
    p.push();
    const sctx = p.drawingContext as CanvasRenderingContext2D;
    const shaft = sctx.createLinearGradient(0, top, 0, g.base);
    shaft.addColorStop(0, `rgba(255,243,214,${0.0})`);
    shaft.addColorStop(0.3, `rgba(231,217,184,${0.06 + 0.05 * hold})`);
    shaft.addColorStop(1, "rgba(231,217,184,0)");
    sctx.save();
    sctx.fillStyle = shaft;
    sctx.fillRect(g.x - inHalf * 0.9, top, inHalf * 1.8, g.base - top);
    sctx.restore();
    p.pop();

    // --- two withered banners on poles flanking the gate, streaming sideways in the wind ---
    const windPhase = kit.loop(7);
    const drawBanner = (poleX: number, side: number) => {
      const poleTop = top + kit.u(0.02);
      const poleBase = g.base - kit.u(0.02);
      p.push();
      kit.register.stroke(kit, 0.008, kit.palette.shade);
      p.line(poleX, poleTop, poleX, poleBase);
      p.pop();
      // tattered cloth streaming downwind (away from gate center)
      const banTop = poleTop + kit.u(0.04);
      const banH = kit.u(0.26);
      const reach = kit.u(0.2);
      p.push();
      p.noStroke();
      p.fill(kit.palette.shade);
      p.drawingContext.globalAlpha = 0.85;
      // upper edge — taut at pole, streaming out
      p.beginShape();
      p.vertex(poleX, banTop);
      const segs = 7;
      for (let i = 0; i <= segs; i++) {
        const f = i / segs;
        const wind = Math.sin(kit.t * 1.3 + f * 3 + windPhase * 6.283) * kit.u(0.018) * f;
        const x = poleX + side * (reach * f);
        const y = banTop + wind + f * kit.u(0.02);
        p.vertex(x, y);
      }
      // tattered lower edge — ragged tongues of withered cloth
      for (let i = segs; i >= 0; i--) {
        const f = i / segs;
        const wind = Math.sin(kit.t * 1.3 + f * 3 + windPhase * 6.283) * kit.u(0.018) * f;
        const x = poleX + side * (reach * f);
        const tatter = (0.6 + 0.4 * p.noise(i * 1.3, kit.t * 0.4)) * banH * (0.5 + 0.5 * f);
        const y = banTop + wind + tatter;
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
      p.drawingContext.globalAlpha = 1;
      p.pop();
    };
    drawBanner(g.x - half - kit.u(0.1), -1);
    drawBanner(g.x + half + kit.u(0.1), 1);

    // --- the lone figure, upright and unbowed, mid-passage through the opening ---
    let fx = g.x;
    let alpha = 1;
    // resting position: just before the threshold, drawn toward it on hover
    const restX = g.x - kit.u(0.13) + s.draw * kit.u(0.08);
    fx = restX;
    if (s.cross >= 0) {
      const e = (kit.t - s.cross) / 1.6;
      if (e >= 1) s.cross = -1;
      else {
        fx = restX + e * (g.x - restX + kit.u(0.02));
        // fade as the figure passes into the threshold light — what enters does not return the same
        alpha = e < 0.6 ? 1 : 1 - (e - 0.6) / 0.4;
      }
    }
    if (alpha > 0.02) {
      const fctx = p.drawingContext as CanvasRenderingContext2D;
      fctx.save();
      fctx.globalAlpha = alpha;
      // upright: lean 0, dignified
      kit.fig.figure(kit, fx, g.base - kit.u(0.01), 0.34, 0, kit.palette.ink);
      fctx.restore();
    }

    // an ankh, faint and gilded, set into the lintel keystone — the major motif over the threshold
    kit.fig.ankh(kit, g.x, archTop - kit.u(0.02), 0.1, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
