/**
 * The Shrine (Major 17) — station Compassion.
 * A traveler kneels at a low stone shrine under a soft night sky; warm golden light wells up
 * from the shrine-stone and washes over them, breathing slowly on the hearth-pulse, wounds
 * easing in the glow. An ankh sigil glimmers faint on the stone.
 * Interactivity (a reading of the card): bring the pointer near the shrine and the welling glow
 * brightens, the kneeling figure eases lower into the grace.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { ease: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { ease: 0 }; S.set(k, s); }
  return s;
};

const shrine = (kit: SketchKit) => ({ x: kit.cx, top: kit.h * 0.6, w: kit.u(0.34), h: kit.u(0.16) });

export default registerCard({
  slug: "major-17",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const breath = kit.light.pulse(kit.t); // hearth breath 0..1
    const g = shrine(kit);

    // proximity of the pointer to the shrine eases the figure and swells the glow
    const near = kit.pointer.inside
      ? Math.max(0, 1 - Math.hypot(kit.pointer.x * w - g.x, kit.pointer.y * h - g.top) / kit.u(0.45))
      : 0;
    s.ease += (near - s.ease) * 0.05;

    // --- soft night sky: a scatter of faint stars, one bright, two faint moons ---
    p.push();
    p.noStroke();
    for (let i = 0; i < 46; i++) {
      const sx = kit.rng() * w;
      const sy = kit.rng() * h * 0.5;
      const tw = 50 + 60 * Math.sin(kit.t * 0.5 + i * 1.7);
      p.fill(238, 230, 210, tw);
      p.circle(sx, sy, kit.u(0.0035));
    }
    p.pop();

    // two faint moons high in the sky
    kit.fig.moon(kit, w * 0.24, h * 0.2, 0.05, 0.7, "#cfd6e6");
    kit.fig.moon(kit, w * 0.78, h * 0.17, 0.04, 0.55, "#d8c9b0");

    // the single bright star, just under the banner safe line, gently pulsing
    const star = { x: kit.cx + kit.u(0.02), y: kit.safe.y + kit.u(0.06) };
    drawStar(kit, star.x, star.y, kit.u(0.03), 0.7 + 0.3 * Math.sin(kit.t * 0.7));

    // --- ground: a soft low rise around the shrine ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    for (let x = 0; x <= w; x += kit.u(0.04)) {
      p.vertex(x, h * 0.72 + p.noise(x * 0.004, 19) * kit.u(0.05));
    }
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- the welling glow: golden light rising from the shrine-stone, breathing ---
    const glowR = 0.42 * (0.78 + 0.22 * breath) * (1 + 0.35 * s.ease);
    kit.register.glow(kit, g.x, g.top, glowR, "#f4c873", 0.55 + 0.3 * breath + 0.2 * s.ease);
    // an additive welling core so the light reads as rising warmth
    {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const rise = kit.u(glowR);
      const grd = ctx.createRadialGradient(g.x, g.top, 0, g.x, g.top, rise);
      const a = 0.22 + 0.16 * breath + 0.14 * s.ease;
      grd.addColorStop(0, `rgba(248,210,140,${a})`);
      grd.addColorStop(0.5, `rgba(230,160,90,${a * 0.5})`);
      grd.addColorStop(1, "rgba(230,160,90,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(g.x, g.top - kit.u(0.04), rise, rise * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // --- the low stone shrine: a tapered block with a flat lit crown-stone ---
    p.push();
    p.noStroke();
    // base
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(g.x - g.w / 2, g.top + g.h);
    p.vertex(g.x - g.w * 0.36, g.top);
    p.vertex(g.x + g.w * 0.36, g.top);
    p.vertex(g.x + g.w / 2, g.top + g.h);
    p.endShape(p.CLOSE);
    // crown-stone (the welling source) — warm-lit slab
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    p.fill(244, 206, 138, 110 + 90 * breath);
    p.rect(g.x - g.w * 0.4, g.top - kit.u(0.018), g.w * 0.8, kit.u(0.03), kit.u(0.01));
    ctx.restore();
    p.pop();

    // faint ankh sigil glowing on the shrine face
    {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalAlpha = 0.4 + 0.4 * breath + 0.2 * s.ease;
      kit.fig.ankh(kit, g.x, g.top + g.h * 0.5, 0.1, "#f6d79a");
      ctx.restore();
    }

    // --- the kneeling traveler beside the shrine: a bowed, folded silhouette ---
    drawKneeler(kit, g.x - kit.u(0.2), g.top + g.h - kit.u(0.005), s.ease);

    kit.light.vignette(kit);
  },
});

function drawStar(kit: SketchKit, x: number, y: number, rU: number, intensity: number) {
  const { p } = kit;
  const r = rU;
  kit.register.glow(kit, x, y, rU / kit.u(1) * 2.4, "#fff4d8", 0.5 * intensity);
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  p.push();
  p.noStroke();
  p.fill(255, 248, 224, 230 * intensity);
  p.beginShape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.34;
    p.vertex(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  p.endShape(p.CLOSE);
  p.circle(x, y, r * 0.6);
  p.pop();
  ctx.restore();
}

/** A folded, bowed-over kneeling figure — head low, back curved toward the shrine. */
function drawKneeler(kit: SketchKit, x: number, yGround: number, ease: number) {
  const { p } = kit;
  const hU = 0.2;
  const hpx = kit.u(hU);
  const bow = 0.5 + 0.18 * ease + 0.05 * Math.sin(kit.t * 0.5); // how far the head drops
  p.push();
  p.translate(x, yGround);
  p.noStroke();
  p.fill(kit.palette.ink);
  // kneeling robe: a wide low triangular mass pooled on the ground
  p.beginShape();
  p.vertex(-hpx * 0.34, 0);
  p.vertex(-hpx * 0.16, -hpx * 0.42);
  p.vertex(hpx * 0.2, -hpx * 0.46);
  p.vertex(hpx * 0.42, 0);
  p.endShape(p.CLOSE);
  // curved back rising from the robe toward the bowed head
  const hx = hpx * (0.16 + 0.28 * bow);
  const hy = -hpx * (0.7 - 0.18 * bow);
  p.beginShape();
  p.vertex(-hpx * 0.12, -hpx * 0.4);
  p.vertex(hx - hpx * 0.12, hy + hpx * 0.04);
  p.vertex(hx + hpx * 0.04, hy + hpx * 0.06);
  p.vertex(hpx * 0.16, -hpx * 0.42);
  p.endShape(p.CLOSE);
  // bowed head
  p.circle(hx, hy, hpx * 0.2);
  p.pop();
}
