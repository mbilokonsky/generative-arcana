/**
 * The Tempering (Major 14) — station Spirituality (SOURCELESS radiance that drifts; light
 * from everywhere and nowhere, weightless, haloed, rarefied; no shadows). Number 14.
 * Scene: a robed figure pours a luminous stream between two vessels — one moon-silver, one
 * sun-gold — the liquid hanging in a perfect unbroken arc; the light is diffuse and sourceless
 * and weightless, two faint moons above, everything held in rarefied suspended balance.
 * Interactivity (a reading): the pointer tilts the pour balance between the vessels, but the
 * arc never breaks — temperance: the measure shifts, the flow holds.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { tilt: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { tilt: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-14",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // spirituality: sourceless drifting radiance, no shadows

    const drift = kit.light.pulse(kit.t);
    const cx = kit.cx;
    const midY = kit.h * 0.5;

    // pointer tilts the balance: -1 pours fully left->right, +1 the reverse; rests centered
    const target = kit.pointer.inside ? (kit.pointer.x - 0.5) * 1.6 : 0.18 * Math.sin(kit.t * 0.25);
    s.tilt += (Math.max(-1, Math.min(1, target)) - s.tilt) * 0.05;

    // --- a sourceless rarefied haze: a soft full-field bloom that drifts, casting no direction ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const hazeR = kit.u(0.7) * (0.95 + 0.08 * drift);
    const hx = cx + Math.sin(kit.t * 0.18) * kit.u(0.04);
    const hy = midY + Math.cos(kit.t * 0.15) * kit.u(0.03);
    const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hazeR);
    rg.addColorStop(0, `rgba(245,240,255,${0.16 + 0.05 * drift})`);
    rg.addColorStop(0.5, "rgba(210,214,240,0.07)");
    rg.addColorStop(1, "rgba(180,190,230,0)");
    ctx.save();
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    p.pop();

    // --- two faint moons above, weightless and high ---
    kit.fig.moon(kit, w * 0.34, kit.h * 0.2, 0.05, 0.92, "#e9ecf5");
    kit.fig.moon(kit, w * 0.66, kit.h * 0.2, 0.05, 0.88, "#f1e6c4");

    // drifting motes of rarefied light, seam-free
    p.push();
    const moteLoop = kit.loop(9);
    const lctx = p.drawingContext as CanvasRenderingContext2D;
    lctx.save();
    lctx.globalCompositeOperation = "lighter";
    p.noStroke();
    for (let i = 0; i < 30; i++) {
      const a = kit.rng() * Math.PI * 2;
      const rad = kit.u(0.12 + kit.rng() * 0.4);
      const ph = (moteLoop + kit.rng()) % 1;
      const mx = cx + Math.cos(a + ph * 6.283) * rad;
      const my = midY + Math.sin(a + ph * 6.283) * rad * 0.7 - ph * kit.u(0.05);
      const fade = Math.sin(ph * Math.PI);
      p.fill(`rgba(255,250,235,${0.22 * fade})`);
      p.circle(mx, my, kit.u(0.005));
    }
    lctx.restore();
    p.pop();

    // --- geometry of the two vessels, set apart, held at slightly different heights by the tilt ---
    const span = kit.u(0.26);
    const lift = s.tilt * kit.u(0.05); // the tilt raises one vessel, lowers the other
    const lipL = { x: cx - span, y: midY - kit.u(0.02) - lift }; // moon-silver (left)
    const lipR = { x: cx + span, y: midY + kit.u(0.06) + lift };  // sun-gold (right)
    // when tilt > 0 the pour visually favors right->left; the SOURCE is always the higher lip
    const pourFromLeft = lipL.y <= lipR.y;
    const src = pourFromLeft ? lipL : lipR;
    const dst = pourFromLeft ? lipR : lipL;

    const drawVessel = (vx: number, vy: number, color: string, silver: boolean) => {
      const vw = kit.u(0.11), vh = kit.u(0.14);
      kit.register.glow(kit, vx, vy + vh * 0.4, 0.12, color, 0.4 + 0.2 * drift);
      p.push();
      p.noStroke();
      // ewer body — a rounded vessel with a pouring lip
      p.fill(color);
      p.beginShape();
      p.vertex(vx - vw * 0.5, vy);
      p.bezierVertex(vx - vw * 0.62, vy + vh * 0.5, vx - vw * 0.38, vy + vh, vx, vy + vh);
      p.bezierVertex(vx + vw * 0.38, vy + vh, vx + vw * 0.62, vy + vh * 0.5, vx + vw * 0.5, vy);
      p.endShape(p.CLOSE);
      // neck/lip
      p.fill(color);
      p.beginShape();
      p.vertex(vx - vw * 0.5, vy);
      p.vertex(vx - vw * 0.28, vy - kit.u(0.018));
      p.vertex(vx + vw * 0.28, vy - kit.u(0.018));
      p.vertex(vx + vw * 0.5, vy);
      p.endShape(p.CLOSE);
      // a soft inner highlight — sourceless, no cast shadow
      p.fill(silver ? "rgba(255,255,255,0.35)" : "rgba(255,243,214,0.4)");
      p.ellipse(vx, vy + vh * 0.45, vw * 0.4, vh * 0.5);
      p.pop();
      // gilded rim line in the major register
      kit.register.outline(kit, [
        [vx - vw * 0.5, vy], [vx - vw * 0.28, vy - kit.u(0.018)],
        [vx + vw * 0.28, vy - kit.u(0.018)], [vx + vw * 0.5, vy],
      ], false);
    };

    // --- the robed figure, centered, holding the two vessels apart ---
    kit.fig.figure(kit, cx, kit.h * 0.88, 0.5, 0, kit.palette.ink);

    drawVessel(lipL.x, lipL.y, "#dfe7f4", true);  // moon-silver
    drawVessel(lipR.x, lipR.y, "#e7c860", false); // sun-gold

    // --- the perfect unbroken luminous arc of liquid streaming from the higher lip to the lower ---
    // control point dips below to make a graceful catenary; the stream never breaks regardless of tilt
    const sx = src.x + (src === lipL ? kit.u(0.04) : -kit.u(0.04));
    const sy = src.y - kit.u(0.01);
    const dx2 = dst.x + (dst === lipL ? kit.u(0.04) : -kit.u(0.04));
    const dy2 = dst.y + kit.u(0.02);
    const sag = Math.max(sy, dy2) + kit.u(0.1);
    const midX = (sx + dx2) / 2;

    p.push();
    const actx = p.drawingContext as CanvasRenderingContext2D;
    actx.save();
    actx.globalCompositeOperation = "lighter";
    // outer luminous halo of the stream
    p.noFill();
    p.strokeCap(p.ROUND);
    p.stroke("rgba(255,250,235,0.22)");
    p.strokeWeight(kit.u(0.026));
    p.beginShape();
    p.vertex(sx, sy);
    p.bezierVertex(midX, sag, midX, sag, dx2, dy2);
    p.endShape();
    // bright core of the stream
    p.stroke("rgba(255,253,245,0.85)");
    p.strokeWeight(kit.u(0.009));
    p.beginShape();
    p.vertex(sx, sy);
    p.bezierVertex(midX, sag, midX, sag, dx2, dy2);
    p.endShape();
    actx.restore();
    p.pop();

    // small drifting droplets travelling along the arc, seam-free, reinforcing "steady, unbroken"
    p.push();
    const flow = kit.loop(2.2);
    const dctx = p.drawingContext as CanvasRenderingContext2D;
    dctx.save();
    dctx.globalCompositeOperation = "lighter";
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      const t = (flow + i / 5) % 1;
      // quadratic-ish bezier eval (both controls equal -> quadratic)
      const mt = 1 - t;
      const bx = mt * mt * sx + 2 * mt * t * midX + t * t * dx2;
      const by = mt * mt * sy + 2 * mt * t * sag + t * t * dy2;
      p.fill("rgba(255,255,250,0.8)");
      p.circle(bx, by, kit.u(0.008));
    }
    dctx.restore();
    p.pop();

    // an ankh hovering above the figure's bowed head — the major motif, weightless and haloed
    kit.fig.ankh(kit, cx, kit.h * 0.36, 0.1, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
