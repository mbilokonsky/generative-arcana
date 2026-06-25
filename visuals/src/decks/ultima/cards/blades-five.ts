/**
 * Five of Blades — station Humility, prime 5 (the grim ground of conflict under pressure).
 * Interactivity that REFUSES triumph: the fallen blade nearest the cursor catches a cold glint,
 * but there is nothing to win — the affordance enacts the card's point.
 */
import { registerCard } from "@/runtime/defineCard";

const SWORDS: Array<[number, number, number]> = [
  [0.3, 0.66, 2.4], [0.46, 0.74, 1.7], [0.6, 0.62, -2.1], [0.7, 0.78, 2.9], [0.4, 0.85, 1.2],
];

export default registerCard({
  slug: "blades-five",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const horizon = h * 0.58;

    // earthbound ground, woodcut hatching
    kit.register.shade(kit, 0, horizon, w / mn, (h - horizon) / mn, 0.55);

    // wind moving the grasses (humility: low, settling, no glory)
    p.push();
    p.stroke(kit.palette.shade);
    p.strokeWeight(kit.u(0.003));
    for (let i = 0; i < 64; i++) {
      const gx = kit.rng() * w;
      const gh = kit.u(0.025 + kit.rng() * 0.03);
      const sway = Math.sin(kit.t * 0.9 + gx * 0.02) * kit.u(0.01);
      const gy = horizon + kit.rng() * (h - horizon) * 0.5;
      p.line(gx, gy, gx + sway, gy - gh);
    }
    p.pop();

    // five fallen blades (prime: five distinct, irreducible)
    let bestI = -1;
    let bestD = Infinity;
    SWORDS.forEach((q, i) => {
      const d = Math.hypot(kit.pointer.x * w - q[0] * w, kit.pointer.y * h - q[1] * h);
      if (d < bestD) { bestD = d; bestI = i; }
    });
    SWORDS.forEach((q, i) => {
      const x = q[0] * w;
      const y = q[1] * h;
      if (i === bestI && kit.pointer.inside) kit.register.glow(kit, x, y, 0.07, kit.palette.light, 0.5);
      kit.fig.sword(kit, x, y, 0.15, q[2], kit.palette.ink);
    });

    // lone stooped figure gathering what is left
    kit.fig.figure(kit, w * 0.5, horizon + kit.u(0.02), 0.2, 0.95, kit.palette.shade);

    kit.light.vignette(kit);
  },
});
