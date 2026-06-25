/**
 * Seven of Runes — station Sacrifice, identity 7 (choices/doors; a scholar choosing).
 * A robed seeker stands before seven glowing runes set into seven doors in an ember-lit vault,
 * hand hovering, several already dimming. Sacrifice light: a reddened ember pulse, something
 * spending itself; the glow depletes and rekindles. The warm depleting light gathers around the
 * choice — some doors of knowing open only if others are given up.
 * Interactivity: the door nearest the pointer brightens while the rest dim — choosing one path
 * dims the others, the cost of the choice.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-seven",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const ember = kit.light.pulse(kit.t); // depleting/rekindling
    const baseY = kit.h * 0.72;
    const n = 7;
    const spread = kit.u(0.46);

    // seven doors in an arc across the vault, runes set into them
    const doors: Array<{ x: number; y: number; dim: number }> = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const x = kit.cx - spread / 2 + spread * f;
      // arc: outer doors lower, center higher (a vault recess)
      const y = baseY - kit.u(0.18) - kit.u(0.06) * Math.sin(f * Math.PI);
      // several already dimming — deterministic
      const baseDim = 0.3 + 0.7 * kit.rng();
      doors.push({ x, y, dim: baseDim });
    }

    // pointer chooses one door; it brightens, others fade
    let chosen = -1;
    if (kit.pointer.inside) {
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(kit.pointer.x * kit.w - doors[i].x);
        if (d < best) { best = d; chosen = i; }
      }
    }

    // draw doors back-to-front
    for (let i = 0; i < n; i++) {
      const d = doors[i];
      const dw = kit.u(0.055);
      const dh = kit.u(0.16);
      let lit = d.dim * (0.5 + 0.5 * ember);
      if (chosen >= 0) lit = i === chosen ? 1 : lit * 0.3;

      // door recess (arch)
      kit.register.glow(kit, d.x, d.y - dh * 0.4, 0.09, kit.palette.accent, 0.4 * lit);
      kit.fig.moongateArch(kit, d.x, d.y + dh * 0.5, 0.055, 0.18, lit);
      // the rune set into the door
      kit.fig.rune(kit, d.x, d.y - dh * 0.15, 0.06, lit, kit.palette.accent);
    }

    // the robed seeker before the doors, hand hovering toward the center
    const fx = kit.cx;
    kit.fig.figure(kit, fx, kit.h * 0.94, 0.28, 0, kit.palette.ink);
    p.push();
    kit.register.stroke(kit, 0.012, kit.palette.ink);
    const reach = chosen >= 0 ? doors[chosen].x : fx;
    p.line(fx - kit.u(0.02), kit.h * 0.94 - kit.u(0.2), reach * 0.4 + fx * 0.6, kit.h * 0.94 - kit.u(0.26));
    p.pop();

    kit.light.vignette(kit);
  },
});
