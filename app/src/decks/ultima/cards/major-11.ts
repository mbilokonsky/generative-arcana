/**
 * The Tamed Wyrm (Major 11) — station Justice (TWO balanced sources, light from both sides in
 * equilibrium; a poised, weighted stillness), number 11 (a doubly-irreducible poise).
 * Scene: a calm figure rests one open palm on the lowered brow of an enormous wyrm in a hall lit
 * evenly from both sides; the creature's coils settled and unforced; the balance is absolute and
 * still, neither dominates, a poised equilibrium held by gentleness alone.
 * Interactivity (a reading): the pointer near the brow soothes the wyrm lower, a slow exhaled
 * breath — never aggression; justice as a stillness held, not a force imposed.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { soothe: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { soothe: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-11",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("soothe", { slug: "major-11" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // justice: two balanced sources, light from both sides, poised stillness.
    const cx = kit.cx;
    const breath = kit.light.pulse(kit.t); // justice ~ near-still; a very slow even swell

    // even bilateral light: two soft columns from left and right edges, matched in strength
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const lcol = `rgba(216,178,74,${0.12 + 0.03 * Math.sin(kit.t * 0.4)})`;
    const lg = ctx.createLinearGradient(0, 0, w * 0.45, 0);
    lg.addColorStop(0, lcol);
    lg.addColorStop(1, "rgba(216,178,74,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, w * 0.45, h);
    const rg = ctx.createLinearGradient(w, 0, w * 0.55, 0);
    rg.addColorStop(0, lcol);
    rg.addColorStop(1, "rgba(216,178,74,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(w * 0.55, 0, w * 0.45, h);
    ctx.restore();

    // the hall: two symmetrical columns framing the scene, even and balanced
    const drawColumn = (x: number) => {
      p.push();
      p.noStroke();
      p.fill(kit.palette.shade);
      const cw = kit.u(0.06);
      p.rect(x - cw / 2, kit.h * 0.12, cw, kit.h * 0.78);
      // capital + base
      p.fill(kit.palette.ink);
      p.rect(x - cw * 0.75, kit.h * 0.12, cw * 1.5, kit.u(0.03));
      p.rect(x - cw * 0.75, kit.h * 0.88, cw * 1.5, kit.u(0.03));
      p.pop();
      kit.register.outline(kit, [
        [x - cw / 2, kit.h * 0.15], [x - cw / 2, kit.h * 0.88],
        [x + cw / 2, kit.h * 0.88], [x + cw / 2, kit.h * 0.15],
      ], false);
    };
    drawColumn(kit.u(0.16));
    drawColumn(w - kit.u(0.16));

    // a level floor line — the ground of the verdict
    const floorY = kit.h * 0.82;
    p.push();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.line(kit.u(0.08), floorY, w - kit.u(0.08), floorY);
    p.pop();

    // soothe target: pointer near the brow lowers the wyrm a touch (a slow breath), never aggression
    const browX = cx + kit.u(0.10);
    const browY = kit.h * 0.5;
    const near = kit.pointer.inside &&
      Math.hypot(kit.pointer.x * w - browX, kit.pointer.y * h - browY) < kit.u(0.22);
    s.soothe += ((near ? 1 : 0) - s.soothe) * 0.04;
    // gentle settled breathing of the coils + soothe lowering
    const coilBreath = Math.sin(kit.t * 0.5) * kit.u(0.012) * (1 - 0.5 * s.soothe);
    const browDrop = s.soothe * kit.u(0.03);

    // --- the enormous wyrm: settled coils right of center, long neck lowering its head to the figure ---
    // Coils: layered overlapping arcs settled on the floor. Drawn as a thick filled sinuous body.
    const drawWyrm = () => {
      p.push();
      p.noStroke();
      // body color — deep shade with a faint warm edge
      p.fill(kit.palette.shade);

      // the settled coil mass — a few stacked loops on the right
      const coilX = cx + kit.u(0.24);
      const coilY = floorY - kit.u(0.04);
      for (let i = 0; i < 3; i++) {
        const rr = kit.u(0.16) - i * kit.u(0.035);
        p.push();
        p.translate(coilX, coilY - i * kit.u(0.03) + coilBreath * (i + 1));
        p.ellipse(0, 0, rr * 2, rr * 1.3);
        p.pop();
      }

      // the long sinuous neck: a tapering ribbon sweeping up-left then lowering toward the brow.
      // build two offset curves (top + bottom edge) and fill between via vertices.
      const spine: Array<[number, number]> = [];
      const segs = 40;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        // from the coil mass, arc up and over, then dip down to the brow point
        const ang = -Math.PI * 0.1 + t * Math.PI * 0.9;
        const baseX = coilX - kit.u(0.02);
        const baseY = coilY - kit.u(0.10);
        // a sweeping S: rise then descend to brow
        const sx = baseX - Math.sin(t * Math.PI) * kit.u(0.34) * (0.6 + 0.4 * t);
        const sy = baseY - Math.sin(t * Math.PI * 0.9) * kit.u(0.26) + t * (browDrop)
          + (t > 0.7 ? (t - 0.7) * kit.u(0.5) : 0);
        spine.push([sx, sy]);
      }
      // thickness tapers from neck (thick) to brow (thin)
      const top: Array<[number, number]> = [];
      const bot: Array<[number, number]> = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const thick = kit.u(0.06) * (1 - t * 0.7);
        const [px, py] = spine[i];
        // perpendicular estimate
        const [nx, ny] = spine[Math.min(segs, i + 1)];
        const dx = nx - px, dy = ny - py;
        const len = Math.hypot(dx, dy) || 1;
        const ox = -dy / len * thick, oy = dx / len * thick;
        top.push([px + ox, py + oy]);
        bot.push([px - ox, py - oy]);
      }
      p.beginShape();
      for (const [x, y] of top) p.vertex(x, y);
      for (let i = bot.length - 1; i >= 0; i--) p.vertex(bot[i][0], bot[i][1]);
      p.endShape(p.CLOSE);

      // the head: a lowered, gentle wedge at the spine's end (the brow the palm rests on)
      const headPt = spine[segs];
      p.push();
      p.translate(headPt[0], headPt[1]);
      p.rotate(Math.PI * 0.62);
      p.beginShape();
      p.vertex(0, -kit.u(0.05));
      p.vertex(kit.u(0.05), kit.u(0.01));
      p.vertex(kit.u(0.035), kit.u(0.06));
      p.vertex(-kit.u(0.03), kit.u(0.055));
      p.vertex(-kit.u(0.04), 0);
      p.endShape(p.CLOSE);
      // a single closed, calm eye — a soft gold lid line (not a glaring eye)
      p.stroke(kit.palette.accent);
      p.strokeWeight(kit.u(0.004));
      p.noFill();
      p.line(-kit.u(0.005), -kit.u(0.01), kit.u(0.02), -kit.u(0.005));
      p.pop();
      p.pop();

      // faint scale-glints along the neck (gilded stipple), even and quiet
      p.push();
      p.noStroke();
      p.fill(kit.palette.accent);
      ctx.save();
      ctx.globalAlpha = 0.4;
      for (let i = 4; i < segs - 2; i += 3) {
        const [px, py] = spine[i];
        p.circle(px, py, kit.u(0.005));
      }
      ctx.restore();
      p.pop();

      return spine[segs];
    };

    const browPt = drawWyrm();

    // --- the calm figure on the LEFT, balancing the wyrm's mass on the right ---
    const figX = cx - kit.u(0.20);
    const figFeet = floorY;
    kit.fig.figure(kit, figX, figFeet, 0.30, 0.18, kit.palette.ink);

    // the open palm resting on the lowered brow — a thin arm reaching to the wyrm's head
    p.push();
    kit.register.stroke(kit, 0.011, kit.palette.ink);
    const shoulderY = figFeet - kit.u(0.30) * 0.7;
    const palmX = browPt[0] - kit.u(0.02);
    const palmY = browPt[1] - kit.u(0.02);
    p.line(figX + kit.u(0.02), shoulderY, palmX, palmY);
    // open palm — a small fan of fingers
    p.strokeCap(p.ROUND);
    kit.register.stroke(kit, 0.006, kit.palette.light);
    for (let f = -2; f <= 2; f++) {
      p.line(palmX, palmY, palmX + f * kit.u(0.008), palmY - kit.u(0.018));
    }
    p.pop();

    // a soft point of meeting-light where palm touches brow — the equilibrium made visible
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const meet = ctx.createRadialGradient(palmX, palmY, 0, palmX, palmY, kit.u(0.1) * (0.8 + 0.2 * breath));
    meet.addColorStop(0, `rgba(255,240,200,${0.3 + 0.1 * s.soothe})`);
    meet.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = meet;
    ctx.beginPath();
    ctx.arc(palmX, palmY, kit.u(0.1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ankh motif — set centrally above, presiding over the balance (recurring major sign)
    kit.fig.ankh(kit, cx, kit.h * 0.24, 0.07, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
