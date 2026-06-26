/**
 * Two of Blades — station Sacrifice, prime 2 (the first duality, a standoff).
 * Two crossed swords lock at center in reddened ember light, two shadowed combatants
 * straining at equal force, sparks falling like spent embers. Diagonal and taut.
 * Interactivity: leaning the cursor left/right strains one fighter harder, but the
 * lock holds — neither wins; the only motion is what is given up (the falling sparks).
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-two",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = h * 0.48;
    const ember = kit.light.pulse(kit.t); // sacrifice's depleting/rekindling breath

    // the two combatants — shadowed masses pressing in from each side
    const lean = kit.pointer.inside ? (kit.pointer.x - 0.5) * 0.5 : 0;
    kit.fig.figure(kit, cx - kit.u(0.26), cy + kit.u(0.34), 0.34, 0.5 + lean, kit.palette.shade);
    kit.fig.figure(kit, cx + kit.u(0.26), cy + kit.u(0.34), 0.34, -0.5 + lean, kit.palette.shade);

    // the lock-point glow — where steel meets steel, ember-bright
    kit.register.glow(kit, cx, cy, 0.16, kit.palette.accent, 0.4 + 0.35 * ember);

    // two crossed swords meeting at the center, diagonal tension
    const tremor = Math.sin(kit.t * 3.0) * kit.u(0.004);
    kit.fig.sword(kit, cx - kit.u(0.19) + tremor, cy + kit.u(0.2), 0.4, -0.7 + lean * 0.3, kit.palette.ink);
    kit.fig.sword(kit, cx + kit.u(0.19) - tremor, cy + kit.u(0.2), 0.4, 0.7 + lean * 0.3, kit.palette.ink);

    // sparks falling like spent embers from the clash
    p.push();
    p.noStroke();
    for (let i = 0; i < 9; i++) {
      const ph = kit.loop(2.2, i * 0.31);
      const sx = cx + (kit.rng() - 0.5) * kit.u(0.12);
      const sy = cy + ph * kit.u(0.3);
      const c = p.color(kit.palette.accent);
      c.setAlpha(255 * (1 - ph) * (0.5 + 0.5 * ember));
      p.fill(c);
      p.circle(sx, sy, kit.u(0.01 * (1 - ph) + 0.004));
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
