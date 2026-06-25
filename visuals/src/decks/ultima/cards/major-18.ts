/**
 * The Moonshadow (Major 18) — station Valor.
 * A narrow winding path threads between two pale standing stones toward a low blood-red moon;
 * the moor on either side is alive with half-seen shapes that may be beasts or only gorse —
 * never resolved. A lone walker presses forward through their own fear. The light is charged,
 * uncertain, frontal, faintly electric (a valor-pulse flash, as in major-2).
 * Interactivity (a reading of the card): hover a moor shape and it half-resolves toward a beast
 * or toward gorse — but stays ambiguous; the walker keeps going regardless.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

interface Lump { x: number; y: number; s: number; seed: number; beast: number }
const S = new WeakMap<SketchKit, { lumps: Lump[] }>();

function getState(kit: SketchKit) {
  let s = S.get(kit);
  if (!s) {
    const lumps: Lump[] = [];
    for (let i = 0; i < 9; i++) {
      const left = i % 2 === 0;
      const depth = kit.rng(); // 0 near, 1 far
      const x = (left ? 0.1 + kit.rng() * 0.28 : 0.62 + kit.rng() * 0.28) * kit.w;
      const y = kit.h * (0.6 + depth * 0.28);
      const sc = kit.u(0.05 + (1 - depth) * 0.07);
      lumps.push({ x, y, s: sc, seed: kit.rng() * 100, beast: 0 });
    }
    s = { lumps };
    S.set(kit, s);
  }
  return s;
}

export default registerCard({
  slug: "major-18",

  draw(kit) {
    const { p, w, h } = kit;
    const s = getState(kit);
    kit.light.wash(kit);

    const pulse = kit.light.pulse(kit.t);
    // valor's charged sky — a faint electric flash on tension spikes (echo of major-2)
    if (pulse > 0.8) {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(150,90,110,${(pulse - 0.8) * 0.5})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    const horizon = h * 0.56;
    const moon = { x: kit.cx, y: horizon - kit.u(0.02) };

    // --- the blood-red moon low on the horizon ---
    kit.fig.moon(kit, moon.x, moon.y, 0.11, 0.92, "#c2354a");

    // a few cold faint stars above
    p.push();
    p.noStroke();
    for (let i = 0; i < 26; i++) {
      const sx = kit.rng() * w;
      const sy = kit.rng() * horizon * 0.85;
      p.fill(200, 190, 210, 50 + 50 * Math.sin(kit.t * 0.6 + i));
      p.circle(sx, sy, kit.u(0.003));
    }
    p.pop();

    // --- the dark moor mass ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    for (let x = 0; x <= w; x += kit.u(0.03)) {
      p.vertex(x, horizon + p.noise(x * 0.006, 31) * kit.u(0.05));
    }
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- half-seen ambiguous shapes on the moor (beasts or gorse, never resolved) ---
    for (const L of s.lumps) {
      // pointer proximity tips it toward beast or gorse — but only halfway
      let resolve = 0;
      if (kit.pointer.inside) {
        const d = Math.hypot(kit.pointer.x * w - L.x, kit.pointer.y * h - L.y);
        resolve = Math.max(0, 1 - d / kit.u(0.16));
      }
      const target = L.seed % 2 < 1 ? 1 : -1; // which way this lump leans when prodded
      L.beast += (resolve * target - L.beast) * 0.08;
      drawLump(kit, L, pulse);
    }

    // --- the narrow winding path receding toward the moon ---
    drawPath(kit, moon, horizon);

    // --- two pale standing stones flanking the path ---
    drawStone(kit, kit.cx - kit.u(0.2), h * 0.74, kit.u(0.07), kit.u(0.26));
    drawStone(kit, kit.cx + kit.u(0.21), h * 0.7, kit.u(0.065), kit.u(0.23));

    // --- the lone walker pressing forward up the path ---
    // a slow determined trudge that never stops — small forward sway
    const wx = kit.cx + Math.sin(kit.t * 0.4) * kit.u(0.012);
    const wlean = 0.45 + 0.1 * Math.sin(kit.t * 0.4); // leaning into the path/fear
    kit.fig.figure(kit, wx, h * 0.82, 0.2, wlean, kit.palette.ink);

    kit.light.vignette(kit);
  },
});

/** A lump that blends between a gorse bush (rounded, many small mounds) and a crouched beast. */
function drawLump(kit: SketchKit, L: Lump, pulse: number) {
  const { p } = kit;
  const breathe = 0.04 * Math.sin(kit.t * 0.6 + L.seed);
  const b = L.beast; // -1 gorse .. +1 beast
  p.push();
  p.translate(L.x, L.y);
  p.noStroke();
  // body fill: faintly lit on the moon side
  const lit = 0.5 + 0.3 * pulse;
  p.fill(40 + 30 * lit, 30 + 18 * lit, 44 + 26 * lit, 235);
  p.beginShape();
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI - (Math.PI * i) / n; // upper dome
    let rr = L.s * (1 + breathe);
    // gorse: jagged rounded clumps; beast: a smoother hunched back with a raised head
    const gorse = rr * (0.85 + 0.3 * p.noise(i * 0.6, L.seed));
    const beast = rr * (0.7 + 0.5 * Math.pow(Math.max(0, Math.sin(a)), 0.6));
    rr = gorse * (1 - Math.max(0, b)) + beast * Math.max(0, b);
    // beast lean adds a forward head bump near one side
    let bx = Math.cos(a) * rr;
    const by = -Math.abs(Math.sin(a)) * rr;
    if (b > 0 && a < Math.PI * 0.35) bx += b * L.s * 0.5; // a head jutting out
    p.vertex(bx, by);
  }
  p.endShape(p.CLOSE);
  // two faint eye-glints emerge only when leaning beast
  if (b > 0.3) {
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    p.fill(220, 120, 110, 200 * (b - 0.3));
    p.circle(L.s * 0.55, -L.s * 0.55, L.s * 0.1);
    p.circle(L.s * 0.72, -L.s * 0.5, L.s * 0.1);
    ctx.restore();
  }
  p.pop();
}

/** A pale standing stone — a weathered upright monolith. */
function drawStone(kit: SketchKit, x: number, yBase: number, w: number, h: number) {
  const { p } = kit;
  p.push();
  p.noStroke();
  p.fill(168, 162, 176);
  p.beginShape();
  p.vertex(x - w * 0.42, yBase);
  p.vertex(x - w * 0.5, yBase - h * 0.5);
  p.vertex(x - w * 0.34, yBase - h);
  p.vertex(x + w * 0.3, yBase - h * 0.96);
  p.vertex(x + w * 0.5, yBase - h * 0.45);
  p.vertex(x + w * 0.44, yBase);
  p.endShape(p.CLOSE);
  // a darker fissure
  p.stroke(110, 104, 120);
  p.strokeWeight(kit.u(0.006));
  p.noFill();
  p.line(x - w * 0.05, yBase - h * 0.9, x + w * 0.08, yBase - h * 0.2);
  p.pop();
}

/** The narrow winding path: a pale ribbon snaking from the foreground up to the moon. */
function drawPath(kit: SketchKit, moon: { x: number; y: number }, horizon: number) {
  const { p, h } = kit;
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  const grd = ctx.createLinearGradient(0, h, 0, horizon);
  grd.addColorStop(0, "rgba(150,138,150,0.55)");
  grd.addColorStop(1, "rgba(194,53,74,0.25)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  const segs = 24;
  const left: Array<[number, number]> = [];
  const right: Array<[number, number]> = [];
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const y = h * 1.0 - u * (h - moon.y); // from bottom up to moon
    const wind = Math.sin(u * 6 + 1.2) * kit.u(0.06) * (1 - u);
    const cx = kit.cx + wind + (moon.x - kit.cx) * u;
    const halfW = kit.u(0.11) * (1 - u) + kit.u(0.006);
    left.push([cx - halfW, y]);
    right.push([cx + halfW, y]);
  }
  ctx.moveTo(left[0][0], left[0][1]);
  for (const [x, y] of left) ctx.lineTo(x, y);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
