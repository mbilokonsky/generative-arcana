/**
 * Five of Runes — station Valor, identity 5 (straining/fracturing under pressure).
 * A mage speaks a straining, fracturing rune against an onrushing dark; the gold sigil cracks
 * even as it blazes, candles guttering sideways. Valor light: a hard frontal charge, the held
 * tension before a storm, a single bright focal point, the air faintly electric.
 * The flat space tilts with pressure; the word is held forward bravely at the breaking point.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-five",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const charge = kit.light.pulse(kit.t); // held tension
    const cx = kit.cx;
    const cy = kit.h * 0.46;

    // onrushing dark from the right — a tilted advancing shadow
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(kit.w, 0);
    p.vertex(kit.w, kit.h);
    p.vertex(kit.w * 0.62 + kit.u(0.03) * Math.sin(kit.t * 1.7), kit.h);
    p.vertex(kit.w * 0.72 + kit.u(0.03) * Math.sin(kit.t * 1.7), 0);
    p.endShape(p.CLOSE);
    p.pop();

    // the mage, leaning into the dark, arm out — gestural silhouette
    const feetY = kit.h * 0.78;
    kit.fig.figure(kit, cx - kit.u(0.12), feetY, 0.34, 0.5, kit.palette.ink);
    // outstretched arm holding the word forward
    p.push();
    kit.register.stroke(kit, 0.014, kit.palette.ink);
    p.line(cx - kit.u(0.09), feetY - kit.u(0.24), cx + kit.u(0.02), feetY - kit.u(0.3));
    p.pop();

    // the straining, fracturing rune held forward, blazing
    const rx = cx + kit.u(0.08);
    const ry = feetY - kit.u(0.34);
    const jitter = kit.u(0.004) * Math.sin(kit.t * 9.0);
    kit.register.glow(kit, rx, ry, 0.22, kit.palette.accent, 0.5 + 0.3 * charge);
    kit.fig.rune(kit, rx + jitter, ry, 0.17, 1, kit.palette.accent);

    // cracks racing across the sigil — deterministic, flickering with the charge
    p.push();
    kit.register.stroke(kit, 0.003, kit.palette.light);
    for (let i = 0; i < 4; i++) {
      const a = kit.rng() * Math.PI * 2;
      const len = kit.u(0.05 + kit.rng() * 0.05);
      const flick = 0.5 + 0.5 * Math.sin(kit.t * 11 + i * 2);
      if (flick > 0.4) {
        const ex = rx + Math.cos(a) * len;
        const ey = ry + Math.sin(a) * len;
        const mx = rx + Math.cos(a) * len * 0.5 + kit.u(0.01) * Math.cos(a + 1.5);
        const my = ry + Math.sin(a) * len * 0.5 + kit.u(0.01) * Math.sin(a + 1.5);
        p.noFill();
        p.beginShape();
        p.vertex(rx, ry);
        p.vertex(mx, my);
        p.vertex(ex, ey);
        p.endShape();
      }
    }
    p.pop();

    // candles guttering sideways at the page's foot
    p.push();
    p.noStroke();
    for (const sgn of [-1, 1]) {
      const fxp = cx + sgn * kit.u(0.16);
      const fyp = feetY - kit.u(0.02);
      p.fill(kit.palette.light);
      p.rect(fxp - kit.u(0.005), fyp, kit.u(0.01), kit.u(0.04));
      p.fill(kit.palette.accent);
      const bend = kit.u(0.02) * (1 + 0.3 * Math.sin(kit.t * 6));
      p.beginShape();
      p.vertex(fxp + bend, fyp - kit.u(0.03));
      p.vertex(fxp + kit.u(0.006), fyp);
      p.vertex(fxp - kit.u(0.006), fyp);
      p.endShape(p.CLOSE);
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
