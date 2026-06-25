/**
 * Seeker of Blades — station Honor, the student watching/drilling with the emblem.
 * A young squire watches two knights spar from a parapet in formal vertical light,
 * a practice blade gripped too tightly, mouthing the forms — straining toward a
 * discipline not yet theirs. Iron-red and steel-grey, stark and upright.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-seeker",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    // formal vertical light — a cold columnar shaft (honor, upright and ceremonial)
    kit.register.glow(kit, w * 0.5, h * 0.28, 0.3, kit.palette.light, 0.28);

    // the parapet — a battlemented horizontal mass the squire stands on
    const wallY = h * 0.7;
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(0, wallY, w, h - wallY);
    const bw = kit.u(0.05);
    for (let i = 0; i * bw * 2 < w; i++) p.rect(i * bw * 2, wallY - bw, bw, bw);
    p.pop();
    kit.register.shade(kit, 0, wallY, w / mn, (h - wallY) / mn, 0.4);

    // two knights sparring below/beyond — small distant figures crossing blades
    const clash = Math.sin(kit.t * 1.6) * kit.u(0.012);
    kit.fig.figure(kit, w * 0.66 - clash, wallY - kit.u(0.005), 0.16, 0.4, kit.palette.ink);
    kit.fig.figure(kit, w * 0.8 + clash, wallY - kit.u(0.005), 0.16, -0.4, kit.palette.ink);
    kit.fig.sword(kit, w * 0.69 - clash, wallY - kit.u(0.1), 0.12, 0.8, kit.palette.ink);
    kit.fig.sword(kit, w * 0.77 + clash, wallY - kit.u(0.1), 0.12, -0.8, kit.palette.ink);

    // the squire on the parapet, watching — upright, intent
    const fx = w * 0.3;
    kit.fig.figure(kit, fx, wallY, 0.3, 0, kit.palette.shade);

    // practice blade gripped too tightly, raised, with a slight nervous tremor
    const tremor = Math.sin(kit.t * 5) * kit.u(0.003);
    kit.fig.sword(kit, fx + kit.u(0.08) + tremor, wallY - kit.u(0.18), 0.22, 0.2, kit.palette.ink);

    kit.light.vignette(kit);
  },
});
