/**
 * Oracle of Runes — station Valor (a still seer, runes as inner vision).
 * A blind-eyed seer sits upright in charged candlelight, runes rising unbidden and glowing
 * around their brow, mouth open to speak a hard truth. Valor light: a hard frontal charge, the
 * held tension before a storm, a single bright focal point, the air faintly electric. The flat
 * space crackles — knowledge arriving as fearless inward vision.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-oracle",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const charge = kit.light.pulse(kit.t);
    const cx = kit.cx;
    const headY = kit.h * 0.4;
    const seatY = kit.h * 0.94;

    // the seer, upright and still — a stern vertical silhouette
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(cx - kit.u(0.13), seatY);
    p.vertex(cx - kit.u(0.09), headY + kit.u(0.06));
    p.vertex(cx + kit.u(0.09), headY + kit.u(0.06));
    p.vertex(cx + kit.u(0.13), seatY);
    p.endShape(p.CLOSE);
    p.circle(cx, headY, kit.u(0.1)); // head, upright
    // mouth open to speak — a small dark gap
    p.fill(kit.palette.shade);
    p.ellipse(cx, headY + kit.u(0.025), kit.u(0.018), kit.u(0.025));
    // blind eyes — two faint pale level marks
    p.fill(kit.palette.light);
    p.rect(cx - kit.u(0.035), headY - kit.u(0.01), kit.u(0.02), kit.u(0.004));
    p.rect(cx + kit.u(0.015), headY - kit.u(0.01), kit.u(0.02), kit.u(0.004));
    p.pop();

    // runes rising unbidden around the brow — a crackling arc above the head
    const n = 5;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const a = Math.PI * (0.2 + 0.6 * f); // an arc over the brow
      const r = kit.u(0.16);
      const rise = kit.u(0.02) * Math.sin(kit.t * 1.5 + i * 1.7);
      const x = cx + Math.cos(a) * r;
      const y = headY - kit.u(0.04) - Math.sin(a) * r * 0.7 - rise;
      const flare = 0.6 + 0.4 * Math.sin(kit.t * 3 + i * 2);
      kit.fig.rune(kit, x, y, 0.06, flare, kit.palette.accent);
    }

    // charged focal glow at the brow, electric crackle
    kit.register.glow(kit, cx, headY - kit.u(0.04), 0.24, kit.palette.accent, 0.4 + 0.25 * charge);

    // faint electric filaments cracking outward
    p.push();
    kit.register.stroke(kit, 0.002, kit.palette.light);
    p.noFill();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + kit.t * 0.3;
      const flick = 0.5 + 0.5 * Math.sin(kit.t * 13 + i * 3);
      if (flick > 0.55) {
        const r1 = kit.u(0.1);
        const r2 = kit.u(0.16);
        const mx = cx + Math.cos(a + 0.3) * r1 * 1.2;
        const my = headY - kit.u(0.04) + Math.sin(a + 0.3) * r1 * 1.2;
        p.beginShape();
        p.vertex(cx + Math.cos(a) * r1, headY - kit.u(0.04) + Math.sin(a) * r1);
        p.vertex(mx, my);
        p.vertex(cx + Math.cos(a) * r2, headY - kit.u(0.04) + Math.sin(a) * r2);
        p.endShape();
      }
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
