/**
 * Seven of Blades — station Compassion, prime 7 (a crossroads, choosing which to take).
 * A figure slips away from a camp at a low golden hour carrying several swords while
 * leaving others planted in the earth, glancing back with something like regret.
 * Warm enfolding light, soft diagonal motion — a hard choice made tenderly.
 * Interactivity: the blade nearest the cursor warms (the one being chosen to take or spare);
 * the figure leans toward what you regard — strategy weighed by the heart.
 */
import { registerCard } from "@/runtime/defineCard";

// planted blades left behind, and the few being carried, in field coords
const PLANTED: Array<[number, number, number]> = [
  [0.62, 0.66, 0.12], [0.7, 0.74, -0.1], [0.78, 0.68, 0.18], [0.84, 0.78, -0.06],
];

export default registerCard({
  slug: "blades-seven",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const hearth = kit.light.pulse(kit.t); // compassion's slow warm breath

    // low golden hour — a warm enfolding glow over the camp side
    kit.register.glow(kit, w * 0.72, h * 0.5, 0.4, kit.palette.light, 0.22 + 0.08 * hearth);
    kit.register.glow(kit, w * 0.74, h * 0.42, 0.16, kit.palette.accent, 0.18 + 0.1 * hearth);

    // ground
    const groundY = h * 0.7;
    kit.register.shade(kit, 0, groundY, w / mn, (h - groundY) / mn, 0.35);

    // planted blades left behind — pick the one nearest the cursor to warm
    let bestI = -1, bestD = Infinity;
    PLANTED.forEach((q, i) => {
      const d = Math.hypot(kit.pointer.x - q[0], kit.pointer.y - q[1]);
      if (d < bestD) { bestD = d; bestI = i; }
    });
    PLANTED.forEach((q, i) => {
      const x = q[0] * w, y = q[1] * h;
      if (kit.pointer.inside && i === bestI) {
        kit.register.glow(kit, x, y - kit.u(0.08), 0.06, kit.palette.accent, 0.5);
      }
      kit.fig.sword(kit, x, y, 0.16, q[2], kit.palette.ink);
    });

    // the scout slipping away on a soft diagonal toward the left, glancing back
    const slip = kit.loop(10);
    const fx = w * 0.36 - slip * kit.u(0.02);
    const lookBack = kit.pointer.inside ? -0.2 - (kit.pointer.x - 0.5) * 0.3 : -0.2;
    kit.fig.figure(kit, fx, groundY + kit.u(0.02), 0.3, lookBack, kit.palette.shade);

    // several swords carried over the shoulder, angled the way they're walking
    for (let i = 0; i < 3; i++) {
      kit.fig.sword(kit, fx + kit.u(0.04 + i * 0.012), groundY - kit.u(0.18), 0.2, -0.9 - i * 0.06, kit.palette.ink);
    }

    kit.light.vignette(kit);
  },
});
