/**
 * The Three Principles (Major 3) — station Justice (TWO balanced sources, light from both sides
 * in equilibrium, poised weighted stillness, the pause before a verdict). Number 3 (an
 * irreducible trinity). Scene: three luminous pillars — white, rose, and gold — rise from a
 * single root of light in a hall lit evenly from both sides; a clear crystal scale balanced
 * between them; the stillness is that of a verdict about to be spoken.
 * Interactivity (a reading): the pointer's x tips which pillar brightens, but they rebalance —
 * justice cannot be permanently leaned; equilibrium reasserts itself.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { tip: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { tip: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-3",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("weigh", { slug: "major-3" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const breath = kit.light.pulse(kit.t); // justice's poised, weighted near-stillness
    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // pointer leans the balance; it always rebalances back to 0 (equilibrium reasserts)
    const target = kit.pointer.inside ? (kit.pointer.x - 0.5) * 1.0 : 0;
    s.tip += (target - s.tip) * 0.04;
    s.tip *= 0.96; // restoring force — never holds a lean

    // --- the hall: even bilateral light, two soft sources left and right in equilibrium ---
    for (const side of [-1, 1] as const) {
      const sx = side < 0 ? 0 : w;
      const rg = ctx.createRadialGradient(sx, h * 0.46, 0, sx, h * 0.46, kit.u(0.9));
      rg.addColorStop(0, `rgba(220,210,235,${0.16 + 0.05 * breath})`);
      rg.addColorStop(1, "rgba(220,210,235,0)");
      ctx.save();
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // hall floor — a level dark plane, the ground of judgment
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(0, h * 0.78, w, h * 0.22);
    p.pop();

    const rootX = kit.cx, rootY = h * 0.78;
    const pillarTop = h * 0.18;

    // --- the single root of light at the base, from which all three pillars rise ---
    p.push();
    const rctx = p.drawingContext as CanvasRenderingContext2D;
    rctx.save();
    rctx.globalCompositeOperation = "lighter";
    p.noStroke();
    const root = rctx.createRadialGradient(rootX, rootY, 0, rootX, rootY, kit.u(0.28));
    root.addColorStop(0, `rgba(255,248,225,${0.7 + 0.2 * breath})`);
    root.addColorStop(1, "rgba(255,248,225,0)");
    rctx.fillStyle = root;
    p.circle(rootX, rootY, kit.u(0.56));
    rctx.restore();
    p.pop();

    // --- the three pillars: white, rose, gold — irreducible trinity, evenly weighted ---
    const cols: Array<[string, string]> = [
      ["#f2eef7", "rgba(242,238,247,"], // white
      ["#e0a0b8", "rgba(224,160,184,"], // rose
      ["#e8c270", "rgba(232,194,112,"], // gold
    ];
    const spread = kit.u(0.24);
    const pillarW = kit.u(0.07);
    // base brightness equal; pointer adds a transient extra to the leaned-toward pillar
    for (let i = 0; i < 3; i++) {
      const offset = (i - 1) * spread;
      const px = rootX + offset;
      // pillars converge slightly at their single root, fan to their tops
      const topX = rootX + offset * 1.15;
      // tip brightens pillars on the pointer side; magnitude small, fades via restoring s.tip
      const sideBias = Math.max(0, s.tip * (i - 1)); // >0 when leaning toward this pillar
      const lit = 0.7 + 0.12 * breath + 0.5 * sideBias;
      const [core, rgbHead] = cols[i];

      // luminous column body (gradient, additive bloom)
      p.push();
      const pctx = p.drawingContext as CanvasRenderingContext2D;
      pctx.save();
      pctx.globalCompositeOperation = "lighter";
      const grad = pctx.createLinearGradient(0, pillarTop, 0, rootY);
      grad.addColorStop(0, `${rgbHead}${0.35 * lit})`);
      grad.addColorStop(0.5, `${rgbHead}${0.55 * lit})`);
      grad.addColorStop(1, `${rgbHead}${0.25 * lit})`);
      pctx.fillStyle = grad;
      pctx.beginPath();
      pctx.moveTo(topX - pillarW * 0.5, pillarTop);
      pctx.lineTo(topX + pillarW * 0.5, pillarTop);
      pctx.lineTo(px + pillarW * 0.5, rootY);
      pctx.lineTo(px - pillarW * 0.5, rootY);
      pctx.closePath();
      pctx.fill();
      pctx.restore();
      p.pop();

      // bright crisp core line up the pillar's center
      p.push();
      p.stroke(core);
      p.strokeWeight(kit.u(0.01));
      p.drawingContext.globalAlpha = 0.7 * lit;
      p.line(topX, pillarTop, px, rootY);
      p.drawingContext.globalAlpha = 1;
      p.pop();

      // a small luminous capital at each pillar's crown
      p.push();
      p.noStroke();
      p.fill(core);
      p.drawingContext.globalAlpha = 0.9 * lit;
      p.circle(topX, pillarTop, kit.u(0.035));
      p.drawingContext.globalAlpha = 1;
      p.pop();
    }

    // --- the crystal scale, balanced between the pillars, just above the root ---
    const beamY = h * 0.40;
    const beamLen = kit.u(0.34);
    // the beam tilts a hair with the lean, then rights itself (restoring s.tip)
    const tilt = s.tip * 0.12;
    p.push();
    p.translate(rootX, beamY);
    p.rotate(tilt);
    // central fulcrum post down to the root
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.008));
    p.line(0, 0, 0, kit.u(0.06));
    // the beam
    p.line(-beamLen / 2, 0, beamLen / 2, 0);
    // fulcrum jewel
    p.noStroke();
    p.fill(kit.palette.light);
    p.push();
    const jctx = p.drawingContext as CanvasRenderingContext2D;
    jctx.save();
    jctx.globalCompositeOperation = "lighter";
    p.circle(0, 0, kit.u(0.03));
    jctx.restore();
    p.pop();
    // two crystal pans hanging from the beam ends — clear faceted lozenges
    for (const side of [-1, 1] as const) {
      const ex = (side * beamLen) / 2;
      p.stroke(kit.palette.accent);
      p.strokeWeight(kit.u(0.005));
      p.line(ex, 0, ex - kit.u(0.05), kit.u(0.07));
      p.line(ex, 0, ex + kit.u(0.05), kit.u(0.07));
      // crystal pan (diamond)
      p.noStroke();
      p.fill(`rgba(220,230,250,${0.35 + 0.25 * breath})`);
      const py = kit.u(0.085);
      p.beginShape();
      p.vertex(ex, py - kit.u(0.02));
      p.vertex(ex + kit.u(0.055), py);
      p.vertex(ex, py + kit.u(0.025));
      p.vertex(ex - kit.u(0.055), py);
      p.endShape(p.CLOSE);
      // a facet glint
      p.stroke(255, 255, 255, 140);
      p.strokeWeight(kit.u(0.003));
      p.line(ex - kit.u(0.02), py - kit.u(0.005), ex + kit.u(0.01), py + kit.u(0.008));
    }
    p.pop();

    // --- the ankh, the major motif, faint and high above the trinity as a presiding sign ---
    p.push();
    p.drawingContext.globalAlpha = 0.35 + 0.15 * breath;
    kit.fig.ankh(kit, rootX, h * 0.16, 0.1, kit.palette.accent);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    kit.light.vignette(kit);
  },
});
