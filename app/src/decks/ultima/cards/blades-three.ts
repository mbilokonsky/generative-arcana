/**
 * Three of Blades — station Honor, number 3 (a structure forming, a pact of arms).
 * Three swords bound upright into a single standing trophy on a windswept height,
 * a banner lashed across them in formal vertical light — a brotherhood freshly, gravely formed.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-three",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const cx = kit.cx;
    const baseY = h * 0.78;

    // windswept height — a low hatched ground, the trophy planted on it
    kit.register.shade(kit, 0, baseY, w / mn, (h - baseY) / mn, 0.4);

    // formal vertical light: a cold columnar shaft holding the trophy
    kit.register.glow(kit, cx, h * 0.3, 0.34, kit.palette.light, 0.32);

    // three swords bound upright into one trophy — splayed slightly, lashed at center
    const lashY = baseY - kit.u(0.18);
    const angles = [-0.16, 0, 0.16];
    angles.forEach((a) => {
      kit.fig.sword(kit, cx, baseY, 0.5, a, kit.palette.ink);
    });

    // the binding — a hard wrap where the three meet (the pact)
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.055), lashY, kit.u(0.11), kit.u(0.05));
    p.pop();

    // a banner lashed across them, snapping in the wind (iron-red against storm-grey)
    p.push();
    p.noStroke();
    p.fill(kit.palette.accent);
    const flY = lashY - kit.u(0.02);
    const sway = (x: number) => Math.sin(kit.t * 1.1 + x * 14) * kit.u(0.012);
    p.beginShape();
    p.vertex(cx + kit.u(0.05), flY);
    for (let i = 0; i <= 6; i++) {
      const f = i / 6;
      p.vertex(cx + kit.u(0.05) + f * kit.u(0.2), flY + sway(f) + f * kit.u(0.02));
    }
    p.vertex(cx + kit.u(0.05) + kit.u(0.2), flY + kit.u(0.1));
    for (let i = 6; i >= 0; i--) {
      const f = i / 6;
      p.vertex(cx + kit.u(0.05) + f * kit.u(0.2), flY + sway(f) + kit.u(0.08) + f * kit.u(0.02));
    }
    p.vertex(cx + kit.u(0.05), flY + kit.u(0.08));
    p.endShape(p.CLOSE);
    p.pop();

    kit.light.vignette(kit);
  },
});
