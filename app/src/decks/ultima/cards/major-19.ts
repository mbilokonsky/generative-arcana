/**
 * The Daystar (Major 19) — station Justice, number 19 (the prime, irreducible radiance).
 * A brilliant sun stands at the zenith over a green Britannian valley lit evenly to every
 * corner; two children play in a field where nothing casts a deceiving shadow. The light is
 * clear, balanced, joyful — the whole scene legible and fair and alive. A faint ankh burns in
 * the sun's heart.
 * Interactivity (a reading of the card): the pointer warms the rays where it falls and the two
 * figures turn and play toward it, joyful in the even light.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { ax: number; bx: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { ax: 0.38, bx: 0.62 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-19",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const pulse = kit.light.pulse(kit.t);
    // sun sits at the zenith but its core stays just below the banner safe line
    const sun = { x: kit.cx, y: kit.safe.y + kit.u(0.13) };

    // --- the green valley: rolling fields lit evenly to every corner ---
    drawValley(kit);

    // --- the brilliant radiant sun with shimmering rays ---
    drawSun(kit, sun, pulse);

    // --- two playful figures in the field, no deceiving shadows ---
    // each gently bounces; pointer draws them toward it, joyful
    const ground = h * 0.84;
    let ta = 0.38, tb = 0.62;
    if (kit.pointer.inside) {
      const px = Math.max(0.18, Math.min(0.82, kit.pointer.x));
      ta = px - 0.1;
      tb = px + 0.1;
    }
    s.ax += (ta - s.ax) * 0.04;
    s.bx += (tb - s.bx) * 0.04;
    drawChild(kit, s.ax * w, ground, kit.t * 1.3, "#3a6f55");
    drawChild(kit, s.bx * w, ground + kit.u(0.01), kit.t * 1.3 + 1.6, "#4a7a48");

    kit.light.vignette(kit);
  },
});

/** Rolling green fields, balanced and even, with soft furrow lines — no deceiving shadow. */
function drawValley(kit: SketchKit) {
  const { p, w, h } = kit;
  const horizon = h * 0.5;
  // sky-to-field is handled by wash; lay the land in even bands
  const bands = [
    { y: horizon, col: [120, 168, 110] as const },
    { y: h * 0.62, col: [98, 156, 96] as const },
    { y: h * 0.74, col: [82, 142, 84] as const },
    { y: h * 0.86, col: [70, 128, 74] as const },
  ];
  p.push();
  p.noStroke();
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const next = i < bands.length - 1 ? bands[i + 1].y : h;
    const [r, g, bl] = b.col;
    p.fill(r, g, bl);
    p.beginShape();
    p.vertex(0, next + kit.u(0.04));
    for (let x = 0; x <= w; x += kit.u(0.05)) {
      const roll = Math.sin(x * 0.004 + i * 1.3) * kit.u(0.025);
      p.vertex(x, b.y + roll);
    }
    p.vertex(w, next + kit.u(0.04));
    p.endShape(p.CLOSE);
  }
  // a few even furrow strokes catching the daylight
  p.stroke(150, 195, 140, 90);
  p.strokeWeight(kit.u(0.004));
  p.noFill();
  for (let i = 0; i < 5; i++) {
    const y = h * (0.64 + i * 0.05);
    p.beginShape();
    for (let x = 0; x <= w; x += kit.u(0.06)) {
      p.vertex(x, y + Math.sin(x * 0.006 + i) * kit.u(0.012));
    }
    p.endShape();
  }
  p.pop();
}

/** The radiant sun at the zenith: glowing disc, shimmering even rays, ankh in its heart. */
function drawSun(kit: SketchKit, sun: { x: number; y: number }, pulse: number) {
  const { p } = kit;
  const rU = 0.1;
  const r = kit.u(rU);
  const ctx = p.drawingContext as CanvasRenderingContext2D;

  // big soft halo
  kit.register.glow(kit, sun.x, sun.y, rU * 3.2, "#ffe89a", 0.55 + 0.15 * pulse);

  // shimmering rays radiating to every corner (even, balanced)
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const rays = 24;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const shimmer = 0.6 + 0.4 * Math.sin(kit.t * 0.8 + i * 0.7);
    const len = r * (1.7 + 0.5 * shimmer) + (i % 2 === 0 ? r * 0.5 : 0);
    // warm where the pointer falls
    let warm = 0;
    if (kit.pointer.inside) {
      const dx = Math.cos(a), dy = Math.sin(a);
      const pa = Math.atan2(kit.pointer.y * kit.h - sun.y, kit.pointer.x * kit.w - sun.x);
      const align = Math.cos(a - pa);
      warm = Math.max(0, align) * (kit.pointer.inside ? 0.5 : 0);
      void (dx + dy);
    }
    p.push();
    p.translate(sun.x, sun.y);
    p.rotate(a);
    p.noStroke();
    p.fill(255, 230 + 20 * warm, 150 + 60 * warm, (60 + 70 * shimmer) * (1 + warm));
    p.beginShape();
    p.vertex(r * 0.92, -r * 0.06);
    p.vertex(len, 0);
    p.vertex(r * 0.92, r * 0.06);
    p.endShape(p.CLOSE);
    p.pop();
  }
  ctx.restore();

  // the solar disc
  p.push();
  p.noStroke();
  p.fill(255, 224, 130);
  p.circle(sun.x, sun.y, r * 2);
  p.fill(255, 240, 180);
  p.circle(sun.x, sun.y, r * 1.4);
  p.pop();

  // ankh burning faint in the sun's heart
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.5 + 0.3 * pulse;
  kit.fig.ankh(kit, sun.x, sun.y + r * 0.1, rU * 1.4, "#fff3c0");
  ctx.restore();
}

/** A small playful child figure — a bouncing silhouette with a raised arm. */
function drawChild(kit: SketchKit, x: number, yFeet: number, phase: number, col: string) {
  const { p } = kit;
  const hU = 0.14;
  const hpx = kit.u(hU);
  const bounce = Math.abs(Math.sin(phase)) * kit.u(0.02);
  const arm = Math.sin(phase * 1.3) * 0.5; // arm swing
  p.push();
  p.translate(x, yFeet - bounce);
  p.noStroke();
  p.fill(col);
  const headR = hpx * 0.13;
  // head
  p.circle(0, -hpx + headR, headR * 2);
  // body
  p.beginShape();
  p.vertex(-hpx * 0.1, -hpx + headR * 1.6);
  p.vertex(hpx * 0.1, -hpx + headR * 1.6);
  p.vertex(hpx * 0.14, -hpx * 0.3);
  p.vertex(-hpx * 0.14, -hpx * 0.3);
  p.endShape(p.CLOSE);
  // two little legs
  p.stroke(col);
  p.strokeWeight(hpx * 0.1);
  p.line(-hpx * 0.05, -hpx * 0.3, -hpx * 0.08, 0);
  p.line(hpx * 0.05, -hpx * 0.3, hpx * 0.08, 0);
  // a raised, playful arm
  p.line(0, -hpx * 0.62, hpx * (0.22 + 0.1 * arm), -hpx * (0.7 + 0.2 * arm));
  p.line(0, -hpx * 0.62, -hpx * 0.2, -hpx * 0.5);
  p.pop();
}
