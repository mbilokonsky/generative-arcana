/**
 * Eight of Blades — station Valor, composite 8 (2³, disciplined compounded motion).
 * A warrior moves through a whirl of eight blades in a charged storm-lit arena,
 * every stroke precise and connected, caught mid-spin on a hard diagonal.
 * Valor's held tension before the storm: a single bright focal point, air faintly electric.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-eight",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = h * 0.5;
    const charge = kit.light.pulse(kit.t); // valor's electric held tension

    // storm-lit arena floor
    const groundY = h * 0.78;
    kit.register.shade(kit, 0, groundY, w / mn, (h - groundY) / mn, 0.4);

    // a single bright focal point at the warrior's core — the charged center
    kit.register.glow(kit, cx, cy, 0.26, kit.palette.light, 0.3 + 0.18 * charge);

    // eight blades whirling on a hard diagonal — disciplined, connected, mid-spin
    const spin = kit.t * 1.1;
    const tilt = -0.5; // hard diagonal cant to the whole whirl
    p.push();
    p.translate(cx, cy);
    p.rotate(tilt);
    for (let i = 0; i < 8; i++) {
      const a = spin + (i / 8) * Math.PI * 2;
      const r = kit.u(0.2 + 0.02 * Math.sin(spin * 2 + i));
      const bx = Math.cos(a) * r;
      const by = Math.sin(a) * r * 0.7; // slight ellipse for the diagonal foreshortening
      // motion-blur ghost trailing the blade — a faint shade just behind it
      const ga = a - 0.18;
      kit.fig.sword(kit, Math.cos(ga) * r, Math.sin(ga) * r * 0.7, 0.2, ga + Math.PI / 2, kit.palette.shade);
      kit.fig.sword(kit, bx, by, 0.22, a + Math.PI / 2, kit.palette.ink);
    }
    p.pop();

    // the warrior at the eye of the whirl — committed, leaning into the spin
    kit.fig.figure(kit, cx, cy + kit.u(0.16), 0.3, -0.4, kit.palette.shade);

    // faint electric streaks in the air
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.0035));
    for (let i = 0; i < 5; i++) {
      const ph = kit.loop(1.6, i * 0.2);
      const sa = (i / 5) * Math.PI * 2 + spin * 0.3;
      const r0 = kit.u(0.28), r1 = kit.u(0.36 + ph * 0.04);
      const ca = p.color(kit.palette.accent);
      ca.setAlpha(120 * (1 - ph) * charge);
      p.stroke(ca);
      p.line(cx + Math.cos(sa) * r0, cy + Math.sin(sa) * r0, cx + Math.cos(sa) * r1, cy + Math.sin(sa) * r1);
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
