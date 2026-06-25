/**
 * The Stranger (Major 0) — station Honesty (flat merciless noon; does NOT flicker; nothing
 * hidden; stillness is the animation), number 0 (a single originating form, much void).
 * Scene: a lone traveler steps out of a shimmering moongate onto an empty Britannian road at
 * high noon, casting almost no shadow; the land is utterly legible to the horizon, an ankh
 * pendant catching the clear flat light.
 * Interactivity (a reading): the pointer guides the figure's first step; the road brightens
 * ahead under regard — honesty: the way forward is plainly lit, nothing concealed.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { step: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { step: 0 }; S.set(k, s); }
  return s;
};

const gate = (kit: SketchKit) => ({ x: kit.cx, base: kit.h * 0.58, w: 0.26, h: 0.34 });
const horizonY = (kit: SketchKit) => kit.h * 0.5;

export default registerCard({
  slug: "major-0",

  onPointer(kit) {
    // bringing the cursor down the road commits the first step forward
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("step", { slug: "major-0" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const hy = horizonY(kit);
    const g = gate(kit);

    // honesty: nothing flickers. The only motion is a barely-there shimmer of heat off the
    // road and the figure's settling step — stillness IS the animation.
    const px = kit.pointer.inside ? kit.pointer.x : 0.5;
    // step eases toward the pointer's reach down the road; rests at standstill otherwise
    const reach = kit.pointer.inside ? Math.max(0, (kit.pointer.y - 0.5)) * 1.4 : 0;
    s.step += (Math.min(1, reach) - s.step) * 0.05;

    // --- the legible land: pale flat fields flanking the road, readable to the horizon ---
    p.push();
    p.noStroke();
    // sky above horizon — clean, even, no clouds to hide behind
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const sky = ctx.createLinearGradient(0, 0, 0, hy);
    const lr = kit.palette.light, gr = kit.palette.ground;
    sky.addColorStop(0, gr);
    sky.addColorStop(1, lr);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, hy);
    ctx.restore();
    // ground plane
    p.fill(kit.palette.shade);
    p.rect(0, hy, w, h - hy);
    p.pop();

    // gridded fields — faint lines converging on the horizon vanishing point, everything
    // square and accountable (noon honesty: the survey of an open land)
    p.push();
    kit.register.stroke(kit, 0.004, kit.palette.ink);
    const vp = kit.cx;
    p.drawingContext.globalAlpha = 0.18;
    for (let i = -6; i <= 6; i++) {
      const fx = vp + i * kit.u(0.5);
      p.line(fx, h, vp + i * kit.u(0.02), hy);
    }
    // horizontal field rows, denser toward the horizon
    for (let j = 1; j <= 8; j++) {
      const ty = hy + Math.pow(j / 8, 2.2) * (h - hy);
      p.line(0, ty, w, ty);
    }
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // --- the road: a bright pale band running from the gate to the horizon ---
    const roadTopW = kit.u(0.03);
    const roadBotW = kit.u(0.42);
    p.push();
    p.noStroke();
    const road = ctx.createLinearGradient(0, hy, 0, h);
    // brighten ahead under the pointer — the way forward made plain
    const bright = 0.55 + 0.4 * (kit.pointer.inside ? (1 - Math.abs(px - 0.5) * 1.4) : 0.0);
    const lrgb = lr;
    road.addColorStop(0, `rgba(255,250,235,${0.25 * bright})`);
    road.addColorStop(1, `rgba(255,250,235,${0.9 * bright})`);
    ctx.save();
    ctx.fillStyle = road;
    p.beginShape();
    p.vertex(kit.cx - roadTopW, hy);
    p.vertex(kit.cx + roadTopW, hy);
    p.vertex(kit.cx + roadBotW, h);
    p.vertex(kit.cx - roadBotW, h);
    p.endShape(p.CLOSE);
    ctx.restore();
    // road edge stones — small, evenly spaced, perfectly legible
    p.fill(kit.palette.ink);
    p.drawingContext.globalAlpha = 0.5;
    for (let j = 0; j < 9; j++) {
      const f = j / 9;
      const yy = hy + Math.pow(f, 1.8) * (h - hy);
      const hw = roadTopW + (roadBotW - roadTopW) * Math.pow(f, 1.8);
      const r = kit.u(0.006 + 0.02 * f);
      p.circle(kit.cx - hw, yy, r);
      p.circle(kit.cx + hw, yy, r);
    }
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // --- the moongate behind the figure, a shimmering threshold just stepped through ---
    // honesty does not flicker, so the gate's shimmer is held nearly constant
    kit.fig.moongateArch(kit, g.x, g.base, g.w, g.h, 0.62);

    // --- the lone traveler, stepping out onto the road ---
    const fFeetX = g.x;
    const fFeetY = g.base - kit.u(0.005) + s.step * kit.u(0.10);
    const fH = 0.27 + s.step * 0.02;
    // lean forward slightly as the step is taken
    const lean = 0.12 + s.step * 0.5;

    // almost no shadow at high noon — a tiny pooled ellipse directly underfoot
    p.push();
    p.noStroke();
    p.fill(0, 0, 0, 55);
    p.ellipse(fFeetX, fFeetY + kit.u(0.006), kit.u(0.10), kit.u(0.022));
    p.pop();

    kit.fig.figure(kit, fFeetX, fFeetY, fH, lean, kit.palette.ink);

    // ankh pendant at the chest, catching the flat noon light with a clean glint
    const chestY = fFeetY - kit.u(fH) * 0.62;
    kit.fig.ankh(kit, fFeetX, chestY, 0.06, kit.palette.accent);
    // a small specular glint on the ankh's loop — steady, not flickering
    p.push();
    const gctx = p.drawingContext as CanvasRenderingContext2D;
    gctx.save();
    gctx.globalCompositeOperation = "lighter";
    p.noStroke();
    p.fill(255, 252, 230, 180);
    p.circle(fFeetX + kit.u(0.012), chestY - kit.u(fH) * 0.30, kit.u(0.01));
    gctx.restore();
    p.pop();

    kit.light.vignette(kit);
  },

});
