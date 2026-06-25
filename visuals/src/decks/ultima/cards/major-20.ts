/**
 * The Summoning (Major 20) — station Sacrifice, number 20.
 * A vast horn sounds from a castle-gate wreathed in ember light; across a moonlit field, figures
 * rise from the earth with faces turned upward toward the call. The warm, depleting ember glow
 * gathers them; each leaves a faint mark in the soil as it answers and stands. Two faint moons.
 * The motion rides the sacrifice-pulse: the ember glow depletes and rekindles, sound-rings rolling.
 * Interactivity (a reading of the card): click to sound the horn — a new ring rolls out across the
 * field and another figure rises. Signal "call".
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

interface Riser { x: number; depth: number; rise: number; seed: number }
interface Ring { born: number }
const S = new WeakMap<SketchKit, { risers: Riser[]; rings: Ring[] }>();

function getState(kit: SketchKit) {
  let s = S.get(kit);
  if (!s) {
    const risers: Riser[] = [];
    for (let i = 0; i < 7; i++) {
      const depth = kit.rng();
      risers.push({
        x: (0.12 + kit.rng() * 0.76) * kit.w,
        depth,
        rise: kit.rng() * 0.6, // initial rising progress, staggered
        seed: kit.rng() * 100,
      });
    }
    s = { risers, rings: [{ born: 0 }] };
    S.set(kit, s);
  }
  return s;
}

export default registerCard({
  slug: "major-20",

  onPointer(kit) {
    if (kit.pointer.pressed) {
      const s = getState(kit);
      s.rings.push({ born: kit.t });
      // wake the least-risen figure
      let idx = -1, lo = 2;
      for (let i = 0; i < s.risers.length; i++) {
        if (s.risers[i].rise < lo) { lo = s.risers[i].rise; idx = i; }
      }
      if (idx >= 0) s.risers[idx].rise = Math.max(s.risers[idx].rise, 0.02);
      kit.signal("call", { slug: "major-20" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = getState(kit);
    kit.light.wash(kit);

    const ember = kit.light.pulse(kit.t); // depleting/rekindling ember 0..1
    const horizon = h * 0.52;
    const gate = { x: kit.cx, base: horizon + kit.u(0.02) };

    // --- moonlit sky: two faint moons + a few stars ---
    kit.fig.moon(kit, w * 0.2, h * 0.22, 0.05, 0.6, "#cdd6e8");
    kit.fig.moon(kit, w * 0.82, h * 0.18, 0.04, 0.45, "#c0c8da");
    p.push();
    p.noStroke();
    for (let i = 0; i < 30; i++) {
      p.fill(210, 200, 220, 40 + 50 * Math.sin(kit.t * 0.5 + i));
      p.circle(kit.rng() * w, kit.rng() * horizon * 0.9, kit.u(0.003));
    }
    p.pop();

    // --- the moonlit field ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    for (let x = 0; x <= w; x += kit.u(0.04)) {
      p.vertex(x, horizon + p.noise(x * 0.005, 51) * kit.u(0.04));
    }
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- expanding sound-rings rolling across the field (ride ember pulse) ---
    drawRings(kit, gate, s, ember);

    // --- the castle-gate wreathed in ember glow ---
    drawGate(kit, gate, ember);

    // --- the vast horn sounding from the gate ---
    drawHorn(kit, gate.x + kit.u(0.16), gate.base - kit.u(0.16), ember);

    // --- figures rising from the earth, faces turned upward ---
    for (const r of s.risers) {
      // advance rising slowly, gathered by the ember's rekindle
      r.rise = Math.min(1, r.rise + (r.rise > 0 ? 0.0012 + 0.0016 * ember : 0));
      const y = horizon + kit.u(0.04) + r.depth * (h - horizon - kit.u(0.08));
      const scale = 0.16 + (1 - r.depth) * 0.08;
      drawRiser(kit, r, r.x, y, scale, ember);
    }

    kit.light.vignette(kit);
  },
});

/** Concentric sound-rings rolling outward from the gate; oldest fade. */
function drawRings(kit: SketchKit, gate: { x: number; base: number }, s: { rings: { born: number }[] }, ember: number) {
  const { p } = kit;
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  // continuous ambient ring riding the ember pulse, plus discrete click rings
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  // ambient pulse ring
  const amb = ember;
  drawOneRing(kit, gate, amb, 0.5 + 0.4 * ember);
  // discrete rings
  for (let i = s.rings.length - 1; i >= 0; i--) {
    const age = (kit.t - s.rings[i].born) / 3.2;
    if (age > 1) { s.rings.splice(i, 1); continue; }
    drawOneRing(kit, gate, age, 1 - age);
  }
  ctx.restore();
}

function drawOneRing(kit: SketchKit, gate: { x: number; base: number }, prog: number, alpha: number) {
  const { p } = kit;
  const rw = kit.u(0.05 + prog * 0.55);
  const rh = rw * 0.32; // flattened across the ground plane
  p.push();
  p.noFill();
  p.stroke(232, 138, 76, 150 * Math.max(0, alpha));
  p.strokeWeight(kit.u(0.006));
  p.ellipse(gate.x, gate.base + kit.u(0.04), rw * 2, rh * 2);
  p.pop();
}

/** A battlemented castle-gate: a pair of towers joined by an arched gateway, ember-wreathed. */
function drawGate(kit: SketchKit, gate: { x: number; base: number }, ember: number) {
  const { p } = kit;
  const tw = 0.1, th = 0.26;
  const span = kit.u(0.16);
  // ember wreath behind the gate
  kit.register.glow(kit, gate.x, gate.base - kit.u(0.14), 0.5 * (0.8 + 0.3 * ember), "#e07a3a", 0.5 + 0.3 * ember);

  // two flanking towers
  kit.fig.tower(kit, gate.x - span, gate.base, tw, th, kit.palette.ink);
  kit.fig.tower(kit, gate.x + span, gate.base, tw, th, kit.palette.ink);

  // curtain wall + arched gateway between them
  p.push();
  p.noStroke();
  p.fill(kit.palette.ink);
  const wallH = kit.u(th * 0.7);
  p.rect(gate.x - span, gate.base - wallH, span * 2, wallH);
  // battlements on the wall
  const bw = kit.u(0.02);
  for (let x = gate.x - span; x < gate.x + span; x += bw * 2) {
    p.rect(x, gate.base - wallH - bw, bw, bw);
  }
  // the glowing archway mouth
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const aw = kit.u(0.07);
  const grd = ctx.createLinearGradient(0, gate.base, 0, gate.base - aw * 1.4);
  const a = 0.4 + 0.4 * ember;
  grd.addColorStop(0, `rgba(245,170,90,${a})`);
  grd.addColorStop(1, `rgba(220,110,60,${a * 0.4})`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(gate.x - aw, gate.base);
  ctx.lineTo(gate.x - aw, gate.base - aw);
  ctx.arc(gate.x, gate.base - aw, aw, Math.PI, 0);
  ctx.lineTo(gate.x + aw, gate.base);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  p.pop();
}

/** A great curved horn shape projecting from the gate, mouth flaring outward. */
function drawHorn(kit: SketchKit, x: number, y: number, ember: number) {
  const { p } = kit;
  p.push();
  p.translate(x, y);
  p.rotate(-0.18);
  p.noStroke();
  p.fill(60, 48, 40);
  // a tapering curved horn: narrow at the gate, flaring bell at the far end
  const L = kit.u(0.3);
  const top: Array<[number, number]> = [];
  const bot: Array<[number, number]> = [];
  const segs = 16;
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const px = u * L;
    const curve = Math.sin(u * 1.1) * kit.u(0.04);
    const thick = kit.u(0.012) + Math.pow(u, 2.2) * kit.u(0.05); // bell flare
    top.push([px, curve - thick]);
    bot.push([px, curve + thick]);
  }
  p.beginShape();
  for (const [px, py] of top) p.vertex(px, py);
  for (let i = bot.length - 1; i >= 0; i--) p.vertex(bot[i][0], bot[i][1]);
  p.endShape(p.CLOSE);
  // ember glint inside the bell
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  p.fill(245, 160, 80, 120 + 90 * ember);
  p.ellipse(L * 0.96, Math.sin(1.1) * kit.u(0.04), kit.u(0.05), kit.u(0.09));
  ctx.restore();
  p.pop();
}

/** A figure rising from the soil; rise 0=buried mound, 1=standing, head tipped upward. */
function drawRiser(kit: SketchKit, r: Riser, x: number, yGround: number, hU: number, ember: number) {
  const { p } = kit;
  const rise = r.rise;
  const hpx = kit.u(hU);
  // faint mark left in the soil
  p.push();
  p.noStroke();
  p.fill(0, 0, 0, 60);
  p.ellipse(x, yGround, hpx * 0.5, hpx * 0.16);
  p.pop();

  if (rise <= 0) return;

  // emergence: clip the figure so it appears to rise out of the ground
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - hpx, yGround - hpx * 1.4, hpx * 2, hpx * 1.4 * rise + 1);
  ctx.clip();
  const emerge = yGround + hpx * (1 - rise) * 1.0; // feet line slides up
  p.push();
  p.translate(x, emerge);
  // head tipped back, looking up toward the call (lean negative = looking up/back)
  p.noStroke();
  p.fill(kit.palette.ink);
  const headR = hpx * 0.12;
  p.circle(headR * 0.5 * (1 - rise), -hpx + headR, headR * 2);
  p.beginShape();
  p.vertex(-hpx * 0.09, -hpx + headR * 1.6);
  p.vertex(hpx * 0.09, -hpx + headR * 1.6);
  p.vertex(hpx * 0.16, 0);
  p.vertex(-hpx * 0.16, 0);
  p.endShape(p.CLOSE);
  // ember rim-light on the upturned face
  const ctx2 = p.drawingContext as CanvasRenderingContext2D;
  ctx2.save();
  ctx2.globalCompositeOperation = "lighter";
  p.fill(240, 150, 80, 120 * ember * rise);
  p.circle(headR * 0.5 * (1 - rise), -hpx + headR, headR * 1.3);
  ctx2.restore();
  p.pop();
  ctx.restore();
}
