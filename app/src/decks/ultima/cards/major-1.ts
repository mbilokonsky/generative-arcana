/**
 * The Initiate (Major 1) — station Compassion (low warm hearth-glow that BREATHES slowly,
 * edges soft, everything enfolded). Scene: a young initiate speaks a glowing rune-word over
 * cupped hands in a warm candlelit shrine-cell; a small flame answers from nothing; the light
 * is low, golden, tender; an elder's hand rests unseen-supportive at the frame's edge.
 * Interactivity (a reading): the pointer near the cupped hands completes the rune and brightens
 * the answering flame — compassion: the first word is coaxed, not commanded, into being.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { warmth: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { warmth: 0 }; S.set(k, s); }
  return s;
};

// the hands sit at the focal center, a little below middle
const hands = (kit: SketchKit) => ({ x: kit.cx, y: kit.h * 0.56 });

export default registerCard({
  slug: "major-1",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("kindle", { slug: "major-1" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const breath = kit.light.pulse(kit.t); // compassion's slow tidal breath, 0..1
    const hd = hands(kit);

    // pointer nearness to the cupped hands kindles the word fuller
    const pxr = (kit.pointer.x * w - hd.x) / kit.u(0.5);
    const pyr = (kit.pointer.y * h - hd.y) / kit.u(0.5);
    const dist = Math.sqrt(pxr * pxr + pyr * pyr);
    const near = kit.pointer.inside ? Math.max(0, 1 - dist) : 0;
    s.warmth += (near - s.warmth) * 0.06;

    // --- the shrine-cell: a low vaulted niche, walls warm and close, edges soft ---
    p.push();
    p.noStroke();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    // an enfolding radial pool of hearth-light centered on the hands, breathing
    const glowR = kit.u(0.5) * (0.9 + 0.12 * breath + 0.18 * s.warmth);
    const rg = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, glowR);
    const warm = 0.5 + 0.18 * breath + 0.3 * s.warmth;
    rg.addColorStop(0, `rgba(255,214,150,${0.42 * warm})`);
    rg.addColorStop(0.5, `rgba(210,150,80,${0.2 * warm})`);
    rg.addColorStop(1, `rgba(60,40,70,0)`);
    ctx.save();
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    p.pop();

    // the niche's rounded arch behind the initiate — a moongate-like vault, dim and intimate
    p.push();
    kit.register.stroke(kit, 0.006, kit.palette.ink);
    p.noFill();
    p.drawingContext.globalAlpha = 0.4;
    const archW = kit.u(0.62), archTop = kit.h * 0.16, archBase = kit.h * 0.9;
    p.beginShape();
    p.vertex(hd.x - archW, archBase);
    p.vertex(hd.x - archW, archTop + archW);
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI - (Math.PI * i) / 16;
      p.vertex(hd.x + Math.cos(a) * archW, archTop + archW - Math.sin(a) * archW);
    }
    p.vertex(hd.x + archW, archBase);
    p.endShape();
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // --- the seated initiate, head bowed over cupped hands ---
    const feetY = kit.h * 0.92;
    const figH = 0.46;
    kit.fig.figure(kit, hd.x, feetY, figH, 0, kit.palette.ink);

    // cupped hands: a small pale crescent cradle just below the bowed head, holding the light
    p.push();
    p.noStroke();
    p.fill(kit.palette.light);
    p.drawingContext.globalAlpha = 0.8;
    p.beginShape();
    p.vertex(hd.x - kit.u(0.07), hd.y);
    p.bezierVertex(
      hd.x - kit.u(0.05), hd.y + kit.u(0.05),
      hd.x + kit.u(0.05), hd.y + kit.u(0.05),
      hd.x + kit.u(0.07), hd.y
    );
    p.bezierVertex(
      hd.x + kit.u(0.04), hd.y + kit.u(0.02),
      hd.x - kit.u(0.04), hd.y + kit.u(0.02),
      hd.x - kit.u(0.07), hd.y
    );
    p.endShape(p.CLOSE);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // --- the small flame answering from nothing, just above the cupped palms ---
    const flameBase = hd.y - kit.u(0.01);
    const flicker = 0.85 + 0.15 * breath + 0.2 * s.warmth;
    p.push();
    const fctx = p.drawingContext as CanvasRenderingContext2D;
    fctx.save();
    fctx.globalCompositeOperation = "lighter";
    p.noStroke();
    // outer warm bloom
    p.fill(`rgba(255,170,70,${0.5 * flicker})`);
    p.ellipse(hd.x, flameBase - kit.u(0.03), kit.u(0.05) * flicker, kit.u(0.09) * flicker);
    // inner bright tongue
    p.fill(`rgba(255,235,180,${0.9 * flicker})`);
    p.beginShape();
    p.vertex(hd.x, flameBase - kit.u(0.085) * flicker);
    p.bezierVertex(
      hd.x + kit.u(0.025), flameBase - kit.u(0.04),
      hd.x + kit.u(0.012), flameBase,
      hd.x, flameBase
    );
    p.bezierVertex(
      hd.x - kit.u(0.012), flameBase,
      hd.x - kit.u(0.025), flameBase - kit.u(0.04),
      hd.x, flameBase - kit.u(0.085) * flicker
    );
    p.endShape(p.CLOSE);
    fctx.restore();
    p.pop();

    // --- the glowing rune-word, hovering above the hands, growing complete on the breath ---
    const complete = Math.min(1, 0.45 + 0.35 * breath + 0.55 * s.warmth);
    kit.fig.rune(kit, hd.x, hd.y - kit.u(0.18), 0.14, complete, kit.palette.accent);

    // --- the elder's hand: a faint silhouette entering from the lower-right frame edge,
    //     resting unseen-supportive near the initiate's shoulder ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.drawingContext.globalAlpha = 0.5;
    const ehX = w - kit.u(0.02), ehY = feetY - kit.u(figH) * 0.55;
    // a simple cupping hand mass reaching in from the edge
    p.beginShape();
    p.vertex(w, ehY - kit.u(0.06));
    p.vertex(ehX - kit.u(0.14), ehY - kit.u(0.02));
    p.bezierVertex(
      ehX - kit.u(0.20), ehY + kit.u(0.01),
      ehX - kit.u(0.18), ehY + kit.u(0.05),
      ehX - kit.u(0.12), ehY + kit.u(0.045)
    );
    p.vertex(w, ehY + kit.u(0.07));
    p.endShape(p.CLOSE);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    kit.light.vignette(kit);
  },
});
