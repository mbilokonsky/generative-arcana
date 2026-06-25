/**
 * Seven of Moongates — station Humility, number 7 (prime: the many wants, one chooser).
 * A figure stands before seven faintly glowing gates rising from a misted plain in low earthbound
 * dusk-light, each a different dim vision, two moons clouded. The chooser small among their wants.
 * Interactivity: the gate nearest the pointer brightens — the longing one's attention settles on.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-seven",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // humility: low level earthbound dusk, weight settling downward

    const baseY = h * 0.6;

    // two clouded moons, faint
    kit.fig.moon(kit, w * 0.34, h * 0.16, 0.04, 0.6, "#cdd6ee");
    kit.fig.moon(kit, w * 0.66, h * 0.15, 0.035, 0.45, "#c4566a");

    // soft mist band across the plain
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.drawingContext.globalAlpha = 0.12;
    p.rect(0, baseY - kit.u(0.04), w, kit.u(0.12));
    p.drawingContext.globalAlpha = 1;
    p.pop();

    const n = 7;
    const sel = kit.pointer.inside ? kit.pointer.x : 0.5 + 0.3 * Math.sin(kit.loop(11) * Math.PI * 2);
    for (let i = 0; i < n; i++) {
      const tt = i / (n - 1);
      const x = kit.cx + (tt - 0.5) * w * 0.7;
      // staggered heights/depths — rising from mist
      const depth = ((i * 7) % 3) / 3;
      const y = baseY - kit.u(0.02) - depth * kit.u(0.06);
      const near = Math.max(0, 1 - Math.abs(tt - sel) * 4);
      const open = 0.18 + 0.6 * near + 0.06 * Math.sin(kit.loop(8, i / n) * Math.PI * 2);
      kit.fig.moongateArch(kit, x, y, 0.1 - depth * 0.02, 0.14 - depth * 0.03, Math.min(1, open));
    }

    // the small quiet chooser, near and low, back to us
    kit.fig.figure(kit, kit.cx, baseY + kit.u(0.06), 0.16, 0, kit.palette.shade);

    kit.light.vignette(kit);
  },
});
