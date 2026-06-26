/**
 * Two of Moongates — station Valor, number 2 (duality: the heart pulled two ways).
 * A figure stands between two shimmering gates under a charged sky, one hand lifted toward each,
 * two moons high, water tense beneath. A felt choice held bravely open.
 * Interactivity: the pointer's horizontal position waxes one gate and wanes the other —
 * the choice of a threshold; clicking commits (signal('cross')).
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-two",

  onPointer(kit) {
    if (kit.pointer.pressed) kit.signal("cross", { side: kit.pointer.x < 0.5 ? "left" : "right" });
  },

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // valor: held tension before a storm, air faintly electric

    const waterY = h * 0.64;
    const charge = kit.light.pulse(kit.t);

    // two moons high in a charged sky
    kit.fig.moon(kit, w * 0.26, h * 0.17, 0.05, 0.9, "#dfe6ff");
    kit.fig.moon(kit, w * 0.74, h * 0.19, 0.05, 0.55, "#e0506a");

    // pointer biases which gate brightens
    const bias = kit.pointer.inside ? kit.pointer.x : 0.5 + 0.18 * Math.sin(kit.loop(8) * Math.PI * 2);
    const leftOpen = 0.4 + 0.6 * (1 - bias) + 0.1 * charge;
    const rightOpen = 0.4 + 0.6 * bias + 0.1 * charge;

    const lx = kit.cx - w * 0.26;
    const rx = kit.cx + w * 0.26;
    const drawGates = () => {
      kit.fig.moongateArch(kit, lx, waterY, 0.16, 0.22, Math.min(1, leftOpen));
      kit.fig.moongateArch(kit, rx, waterY, 0.16, 0.22, Math.min(1, rightOpen));
    };
    kit.fig.reflect(kit, waterY, drawGates);

    // figure between, leaning toward the brighter side
    const lean = (bias - 0.5) * 0.9;
    const fx = kit.cx;
    kit.fig.figure(kit, fx, waterY + kit.u(0.02), 0.22, lean, kit.palette.shade);

    // two lifted arms toward each gate
    p.push();
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.011));
    p.strokeCap(p.ROUND);
    const sy = waterY - kit.u(0.15);
    p.line(fx, sy, fx + (lx - fx) * 0.5, sy - kit.u(0.04) * (1.2 - bias));
    p.line(fx, sy, fx + (rx - fx) * 0.5, sy - kit.u(0.04) * (0.2 + bias));
    p.pop();

    kit.light.vignette(kit);
  },
});
