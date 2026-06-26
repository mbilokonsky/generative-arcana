/**
 * The Wheel of Ages (Major 10) — station Valor (a hard frontal charge, the HELD TENSION before
 * a storm; a single bright focal point, the air faintly electric).
 * Scene: an immense stone wheel rimmed with the sigils of three ages turns against a charged
 * storm-lit sky; two moons and a crowned tower set among its spokes, small figures rising and
 * falling on its rim; the air crackles, frontal and electric, a thing vast and impersonal in motion.
 * Interactivity (a reading): the pointer can nudge the wheel's turn slightly — but fate continues;
 * valor is meeting an impersonal motion head-on, not stopping it.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { nudge: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { nudge: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-10",

  onPointer(kit) {
    // dragging at the rim adds a small impulse to the turn; it decays — fate continues regardless
    const s = state(kit);
    if (kit.pointer.inside && kit.pointer.down) {
      const dir = kit.pointer.x < 0.5 ? -1 : 1;
      s.nudge += dir * 0.012;
      s.nudge = Math.max(-0.5, Math.min(0.5, s.nudge));
    }
    if (kit.pointer.pressed) kit.signal("nudge", { slug: "major-10" });
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // valor: charged storm sky — an occasional electric flash on the tension spikes (as major-2)
    const pulse = kit.light.pulse(kit.t);
    if (pulse > 0.8) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(150,165,225,${(pulse - 0.8) * 0.5})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // distant storm clouds massing — drifting dark bands behind the wheel
    p.push();
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      const cy = kit.h * (0.18 + i * 0.13);
      const drift = Math.sin(kit.t * 0.12 + i) * kit.u(0.04);
      p.fill(11, 8, 32, 90 + i * 14);
      p.beginShape();
      p.vertex(0, cy);
      for (let x = 0; x <= w; x += kit.u(0.05)) {
        const yy = cy + p.noise(x * 0.003 + i, kit.t * 0.05) * kit.u(0.10) + drift;
        p.vertex(x, yy);
      }
      p.vertex(w, cy + kit.u(0.16));
      p.vertex(0, cy + kit.u(0.16));
      p.endShape(p.CLOSE);
    }
    p.pop();

    // occasional forked lightning on a strong pulse, struck toward the wheel
    if (pulse > 0.9) {
      p.push();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      kit.register.stroke(kit, 0.006, "#cfe0ff");
      const seed = Math.floor(kit.t * 2);
      let bx = kit.cx + (kit.rng() - 0.5 + (seed % 3 - 1)) * kit.u(0.5);
      let by = kit.h * 0.06;
      p.beginShape();
      p.noFill();
      p.vertex(bx, by);
      for (let k = 0; k < 6; k++) {
        bx += (kit.rng() - 0.5) * kit.u(0.12);
        by += kit.u(0.05);
        p.vertex(bx, by);
      }
      p.endShape();
      ctx.restore();
      p.pop();
    }

    // --- the immense wheel, centered, slowly rotating ---
    const cx = kit.cx;
    const cy = kit.h * 0.5;
    const R = kit.u(0.42);
    const turn = kit.loop(12) * Math.PI * 2 + s.nudge;
    s.nudge *= 0.985; // decay — the nudge fades, fate continues

    // the single bright focal point: a charged hub glow at the wheel's center
    kit.register.glow(kit, cx, cy, 0.22 + 0.04 * pulse, "#e9c25a", 0.8 + 0.3 * pulse);

    p.push();
    p.translate(cx, cy);
    p.rotate(turn);

    // outer stone rim — a thick gilded ring (two concentric outlines)
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.018, kit.palette.shade);
    p.circle(0, 0, R * 2);
    kit.register.stroke(kit, 0.01, kit.palette.accent);
    p.circle(0, 0, R * 1.86);
    p.circle(0, 0, R * 1.5);
    p.pop();

    // spokes radiating from the hub
    p.push();
    kit.register.stroke(kit, 0.009, kit.palette.ink);
    const spokes = 8;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2;
      p.line(Math.cos(a) * R * 0.22, Math.sin(a) * R * 0.22, Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92);
    }
    p.pop();

    // three age-sigils set on the rim (equally spaced thirds) — bespoke glyphs in gold
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const sx = Math.cos(a) * R * 1.68;
      const sy = Math.sin(a) * R * 1.68;
      p.push();
      p.translate(sx, sy);
      p.rotate(a + Math.PI / 2);
      p.noFill();
      kit.register.stroke(kit, 0.007, kit.palette.accent);
      const sg = kit.u(0.05);
      if (i === 0) {
        // first age: a rising triangle (dawn)
        p.beginShape(); p.vertex(0, -sg); p.vertex(sg * 0.8, sg * 0.6); p.vertex(-sg * 0.8, sg * 0.6); p.endShape(p.CLOSE);
      } else if (i === 1) {
        // middle age: a quartered circle (the held present)
        p.circle(0, 0, sg * 1.4);
        p.line(-sg * 0.7, 0, sg * 0.7, 0);
        p.line(0, -sg * 0.7, 0, sg * 0.7);
      } else {
        // last age: a spiral arc (the turning to come)
        p.beginShape();
        for (let t = 0; t < Math.PI * 1.6; t += 0.2) {
          const rr = sg * 0.2 + t * sg * 0.16;
          p.vertex(Math.cos(t) * rr, Math.sin(t) * rr);
        }
        p.endShape();
      }
      p.pop();
    }
    p.pop(); // end wheel rotation

    // --- elements set AMONG the spokes (counter-rotated so they stay upright on the turning rim) ---
    // two moons riding the rim at opposite shoulders, a crowned tower at the top spoke.
    const place = (frac: number, radius: number) => {
      const a = turn + frac * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius, a };
    };

    const m1 = place(0.16, R * 1.18);
    kit.fig.moon(kit, m1.x, m1.y, 0.05, 0.9, "#e9ecf5");
    const m2 = place(0.84, R * 1.18);
    kit.fig.moon(kit, m2.x, m2.y, 0.05, 0.7, "#e0506a");

    // crowned tower riding the top inner spoke, kept upright
    const tw = place(0.0, R * 0.62);
    const towerW = 0.075, towerH = 0.13;
    kit.fig.tower(kit, tw.x, tw.y + kit.u(towerH) * 0.5, towerW, towerH, kit.palette.shade);
    kit.fig.crown(kit, tw.x, tw.y - kit.u(towerH) * 0.5, 0.07, kit.palette.accent);

    // --- tiny figures: rising on the ascending side, falling on the descending side ---
    // ascending (left side rotating up) cling and rise; descending (right) tumble.
    for (let i = 0; i < 4; i++) {
      const frac = 0.30 + i * 0.05; // clustered on the left, rising
      const pos = place(frac, R * 1.34);
      const lean = -0.6; // braced, climbing
      kit.fig.figure(kit, pos.x, pos.y + kit.u(0.045), 0.06, lean, kit.palette.ink);
    }
    for (let i = 0; i < 4; i++) {
      const frac = 0.55 + i * 0.05; // right side, falling
      const pos = place(frac, R * 1.34);
      // a tumbling figure: draw inverted-ish via a rotated small body
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(pos.a + Math.PI * 0.9 + Math.sin(kit.t + i) * 0.2);
      p.noStroke();
      p.fill(kit.palette.ink);
      const fh = kit.u(0.06);
      p.circle(0, -fh, fh * 0.22);
      p.beginShape();
      p.vertex(-fh * 0.12, -fh * 0.85);
      p.vertex(fh * 0.12, -fh * 0.85);
      p.vertex(fh * 0.2, 0);
      p.vertex(-fh * 0.2, 0);
      p.endShape(p.CLOSE);
      p.pop();
    }

    // a faint electric crackle ring at the rim on tension — frontal, air alive
    if (pulse > 0.7) {
      p.push();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      kit.register.stroke(kit, 0.004, "#bcd0ff");
      p.noFill();
      ctx.globalAlpha = (pulse - 0.7) * 1.2;
      p.beginShape();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.25) {
        const jitter = 1 + (kit.rng() - 0.5) * 0.06;
        p.vertex(cx + Math.cos(a) * R * 1.04 * jitter, cy + Math.sin(a) * R * 1.04 * jitter);
      }
      p.endShape(p.CLOSE);
      ctx.restore();
      p.pop();
    }

    kit.light.vignette(kit);
  },
});
