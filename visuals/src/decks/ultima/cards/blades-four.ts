/**
 * Four of Blades — station Spirituality, composite 4 (a 2×2 guarded stillness, a truce).
 * Four swords rest in ordered stillness around a sleeping figure on a stone bier,
 * three sheathed/standing and one laid flat, under a diffuse sourceless radiant sky.
 * The stark forms soften into a held, almost holy quiet.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-four",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = h * 0.5;
    const drift = kit.light.pulse(kit.t); // spirituality's sourceless drift

    // sourceless radiance — a soft wide halo with no single sun, slowly drifting
    kit.register.glow(kit, cx, cy - kit.u(0.06), 0.5, kit.palette.light, 0.22 + 0.08 * drift);
    kit.register.glow(kit, cx + Math.sin(kit.t * 0.4) * kit.u(0.1), cy - kit.u(0.2), 0.3, kit.palette.light, 0.16);

    // the stone bier — a low flat mass
    const bierY = cy + kit.u(0.16);
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.26), bierY, kit.u(0.52), kit.u(0.07));
    p.pop();
    kit.register.shade(kit, (cx - kit.u(0.26)) / mn, bierY, 0.52, 0.07, 0.5);

    // sleeping figure laid upon it — a low recumbent silhouette
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(cx - kit.u(0.2), bierY);
    p.vertex(cx - kit.u(0.22), bierY - kit.u(0.03));
    p.vertex(cx - kit.u(0.16), bierY - kit.u(0.045));
    p.vertex(cx + kit.u(0.16), bierY - kit.u(0.035));
    p.vertex(cx + kit.u(0.2), bierY - kit.u(0.02));
    p.vertex(cx + kit.u(0.2), bierY);
    p.endShape(p.CLOSE);
    // bowed head at one end
    p.fill(kit.palette.ink);
    p.circle(cx - kit.u(0.19), bierY - kit.u(0.05), kit.u(0.05));
    p.pop();

    // four swords arrayed in 2×2 order: three standing point-up, one laid flat across
    kit.fig.sword(kit, cx - kit.u(0.24), bierY, 0.26, 0, kit.palette.ink);
    kit.fig.sword(kit, cx + kit.u(0.24), bierY, 0.26, 0, kit.palette.ink);
    kit.fig.sword(kit, cx, cy - kit.u(0.26), 0.24, 0, kit.palette.ink);
    // the one laid flat above the sleeper — horizontal truce
    kit.fig.sword(kit, cx + kit.u(0.18), cy - kit.u(0.06), 0.34, Math.PI / 2, kit.palette.ink);

    kit.light.vignette(kit);
  },
});
