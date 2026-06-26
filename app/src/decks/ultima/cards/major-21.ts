/**
 * The Codex (Major 21) — station Honor, number 21 (the completion; everything in accord).
 * EIGHT pillars ring a central pedestal; above it hovers a radiant open book of pure light.
 * A robed figure stands fulfilled before it, crowned in soft burnished light. The four suit
 * emblems (Crown, Blade, Rune, Moongate) and eight virtue-sigil motes orbit in slow integrated
 * motion. An ankh burns at the book's heart. The deck's culminating card — the most ornate,
 * whole, formal, and alive.
 * Interactivity (a reading of the card): the pointer slows and steadies the orbit toward perfect
 * symmetry and the book brightens — integration. Signal "codex".
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { steady: number; signalled: boolean }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { steady: 0, signalled: false }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-21",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const pulse = kit.light.pulse(kit.t);
    // honor's vertical, ceremonial column of light down the center
    drawColumn(kit, pulse);

    // pointer near center steadies the orbit toward perfect symmetry
    const center = { x: kit.cx, y: kit.h * 0.46 };
    let want = 0;
    if (kit.pointer.inside) {
      const d = Math.hypot(kit.pointer.x * w - center.x, kit.pointer.y * h - center.y);
      want = Math.max(0, 1 - d / kit.u(0.4));
    }
    s.steady += (want - s.steady) * 0.04;
    if (s.steady > 0.92 && !s.signalled) { kit.signal("codex", { slug: "major-21" }); s.signalled = true; }
    if (s.steady < 0.5) s.signalled = false;

    const cx = center.x;
    const cy = center.y;
    const ringR = kit.u(0.34);

    // --- eight pillars in a flattened octagon ring around the pedestal ---
    drawPillars(kit, cx, cy, ringR);

    // --- the central pedestal ---
    drawPedestal(kit, cx, cy + ringR * 0.62);

    // --- the robed figure standing fulfilled before the book ---
    kit.fig.figure(kit, cx, cy + ringR * 0.62, 0.24, 0, kit.palette.ink);
    // soft burnished crown above the figure's head
    {
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.2 * pulse;
      kit.fig.crown(kit, cx, cy + ringR * 0.62 - kit.u(0.24), 0.1, "#e8d9a8");
      ctx.restore();
    }

    // --- the orbit of the four suit emblems + eight virtue motes ---
    drawOrbit(kit, cx, cy, ringR, s.steady, pulse);

    // --- the radiant open book of pure light hovering above the pedestal ---
    drawBook(kit, cx, cy - kit.u(0.04), s.steady, pulse);

    kit.light.vignette(kit);
  },
});

/** A vertical ceremonial shaft of light down the card's spine. */
function drawColumn(kit: SketchKit, pulse: number) {
  const { p, w, h } = kit;
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const cw = kit.u(0.34);
  const grd = ctx.createLinearGradient(kit.cx - cw, 0, kit.cx + cw, 0);
  grd.addColorStop(0, "rgba(232,217,168,0)");
  grd.addColorStop(0.5, `rgba(244,232,190,${0.1 + 0.06 * pulse})`);
  grd.addColorStop(1, "rgba(232,217,168,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(kit.cx - cw, 0, cw * 2, h);
  ctx.restore();
  void w;
}

/** Eight pillars in a flattened-perspective ring; symmetrical and formal. */
function drawPillars(kit: SketchKit, cx: number, cy: number, ringR: number) {
  const { p } = kit;
  // draw back pillars first (smaller / dimmer), front pillars last
  const order: Array<{ i: number; sy: number }> = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    order.push({ i, sy: Math.sin(a) });
  }
  order.sort((a, b) => a.sy - b.sy);
  for (const { i } of order) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(a) * ringR;
    const depth = (Math.sin(a) + 1) / 2; // 0 back, 1 front
    const py = cy + Math.sin(a) * ringR * 0.42; // flatten the ring vertically
    const ph = kit.u(0.16 + depth * 0.08);
    const pw = kit.u(0.026 + depth * 0.012);
    const shade = 90 + depth * 70;
    p.push();
    p.noStroke();
    // shaft
    p.fill(shade, shade * 0.95, shade * 0.78);
    p.rect(px - pw / 2, py - ph, pw, ph, kit.u(0.004));
    // capital + base
    p.fill(shade + 30, (shade + 30) * 0.95, (shade + 30) * 0.78);
    p.rect(px - pw * 0.62, py - ph - kit.u(0.012), pw * 1.24, kit.u(0.014), kit.u(0.003));
    p.rect(px - pw * 0.62, py - kit.u(0.006), pw * 1.24, kit.u(0.012), kit.u(0.003));
    // a faint flute line
    p.stroke(shade - 40, (shade - 40) * 0.9, (shade - 40) * 0.7, 120);
    p.strokeWeight(kit.u(0.003));
    p.line(px, py - ph + kit.u(0.01), px, py - kit.u(0.01));
    p.pop();
  }
}

/** A tiered ceremonial pedestal. */
function drawPedestal(kit: SketchKit, cx: number, yTop: number) {
  const { p } = kit;
  p.push();
  p.noStroke();
  const w0 = kit.u(0.14);
  p.fill(120, 112, 92);
  p.rect(cx - w0 / 2, yTop, w0, kit.u(0.02), kit.u(0.004));
  p.fill(104, 97, 80);
  p.rect(cx - w0 * 0.62, yTop + kit.u(0.02), w0 * 1.24, kit.u(0.018), kit.u(0.004));
  p.fill(92, 86, 70);
  p.rect(cx - w0 * 0.74, yTop + kit.u(0.038), w0 * 1.48, kit.u(0.02), kit.u(0.004));
  p.pop();
}

/** The four suit emblems and eight virtue motes orbiting the book in slow integrated motion. */
function drawOrbit(kit: SketchKit, cx: number, cy: number, ringR: number, steady: number, pulse: number) {
  const { p } = kit;
  // slow 12s orbit; steadiness slows it and snaps phases toward symmetry
  const base = kit.loop(12) * Math.PI * 2 * (1 - 0.7 * steady);
  const orbR = ringR * 0.7;
  const flat = 0.42;

  // eight virtue motes on the inner orbit
  for (let i = 0; i < 8; i++) {
    let a = base + (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(a) * orbR * 0.78;
    const py = cy + Math.sin(a) * orbR * 0.78 * flat;
    const depth = (Math.sin(a) + 1) / 2;
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const mr = kit.u(0.012) * (0.7 + 0.5 * depth);
    kit.register.glow(kit, px, py, 0.03 * (0.7 + 0.5 * depth), "#f0e0a8", 0.5 + 0.3 * pulse);
    p.noStroke();
    p.fill(248, 238, 200, 200 * (0.5 + 0.5 * depth));
    p.circle(px, py, mr * 2);
    ctx.restore();
  }

  // four suit emblems on the outer orbit, evenly placed (Crown, Blade, Rune, Moongate)
  const emblems = ["crown", "blade", "rune", "moon"] as const;
  // depth-sort so far ones draw first
  const placed = emblems.map((e, i) => {
    const a = base * 0.8 + (i / 4) * Math.PI * 2 + Math.PI / 4;
    return { e, a, depth: (Math.sin(a) + 1) / 2 };
  }).sort((u, v) => u.depth - v.depth);

  for (const { e, a, depth } of placed) {
    const px = cx + Math.cos(a) * orbR;
    const py = cy + Math.sin(a) * orbR * flat;
    const sc = 0.7 + 0.5 * depth;
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * depth;
    if (e === "crown") kit.fig.crown(kit, px, py + kit.u(0.02 * sc), 0.07 * sc, "#e8cf7a");
    else if (e === "blade") kit.fig.sword(kit, px, py + kit.u(0.04 * sc), 0.13 * sc, 0, "#c9d2dc");
    else if (e === "rune") kit.fig.rune(kit, px, py, 0.09 * sc, 1, "#e0c878");
    else kit.fig.moon(kit, px, py, 0.035 * sc, 0.85, "#d8b0c0");
    ctx.restore();
  }
}

/** The radiant open book of pure light hovering above the pedestal, ankh at its heart. */
function drawBook(kit: SketchKit, cx: number, cy: number, steady: number, pulse: number) {
  const { p } = kit;
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  const bob = Math.sin(kit.t * 0.5) * kit.u(0.008);
  const y = cy + bob;
  const bw = kit.u(0.16);
  const bh = kit.u(0.11);

  // strong bloom behind the book, brighter as it steadies
  kit.register.glow(kit, cx, y, 0.34 * (0.9 + 0.2 * pulse + 0.25 * steady), "#fff2c8", 0.6 + 0.3 * steady);

  // the two glowing pages forming an open V
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const side of [-1, 1]) {
    const grd = ctx.createLinearGradient(cx, y, cx + side * bw * 0.55, y - bh * 0.2);
    const a = 0.5 + 0.25 * pulse + 0.2 * steady;
    grd.addColorStop(0, `rgba(255,248,220,${a})`);
    grd.addColorStop(1, `rgba(245,225,160,${a * 0.5})`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cx, y + bh * 0.12);          // spine bottom
    ctx.lineTo(cx, y - bh * 0.42);          // spine top
    ctx.lineTo(cx + side * bw * 0.5, y - bh * 0.5); // far top corner
    ctx.lineTo(cx + side * bw * 0.52, y + bh * 0.3); // far bottom corner
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // page edges + faint text lines (lines of light)
  p.push();
  p.stroke(255, 250, 225, 200);
  p.strokeWeight(kit.u(0.0035));
  p.noFill();
  for (const side of [-1, 1]) {
    p.line(cx, y - bh * 0.42, cx + side * bw * 0.5, y - bh * 0.5);
    p.line(cx, y + bh * 0.12, cx + side * bw * 0.52, y + bh * 0.3);
    // text lines
    p.stroke(250, 235, 180, 130);
    p.strokeWeight(kit.u(0.002));
    for (let i = 0; i < 4; i++) {
      const ly = y - bh * 0.28 + i * bh * 0.14;
      p.line(cx + side * bw * 0.08, ly, cx + side * bw * (0.42 - i * 0.02), ly + side * 0 + bh * 0.04);
    }
    p.stroke(255, 250, 225, 200);
    p.strokeWeight(kit.u(0.0035));
  }
  p.pop();

  // the ankh burning at the book's heart, at the spine
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.6 + 0.3 * pulse + 0.1 * steady;
  kit.fig.ankh(kit, cx, y - bh * 0.05, 0.12, "#fff4cc");
  ctx.restore();
}
