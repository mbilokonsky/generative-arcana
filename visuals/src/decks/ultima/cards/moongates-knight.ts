/**
 * Knight of Moongates — station Sacrifice (the heart that acts, the romantic who crosses worlds).
 * A cloaked figure rides through a shimmering gate on a hard diagonal in reddened ember light,
 * bearing a single token, two moons streaking behind. Something given up in the crossing.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-knight",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // sacrifice: reddened ember pulse, spending itself

    const ember = kit.light.pulse(kit.t);
    const waterY = h * 0.72;

    // the great gate the rider passes through, set on a diagonal
    const gateX = kit.cx + w * 0.04;
    const drawGate = () => {
      kit.fig.moongateArch(kit, gateX, waterY, 0.24, 0.34, 0.7 + 0.3 * ember);
    };
    kit.fig.reflect(kit, waterY, drawGate);

    // two moons streaking behind (motion trails on a diagonal)
    p.push();
    p.noStroke();
    const mk = (mx: number, my: number, col: string, ph: number) => {
      for (let s = 0; s < 4; s++) {
        p.drawingContext.globalAlpha = 0.18 * (1 - s / 4);
        kit.fig.moon(kit, mx + s * kit.u(0.03), my + s * kit.u(0.02), 0.03 * (1 - s * 0.1), ph, col);
      }
      p.drawingContext.globalAlpha = 1;
    };
    mk(w * 0.7, h * 0.2, "#dfe6ff", 0.7);
    mk(w * 0.82, h * 0.28, "#e0506a", 0.5);
    p.pop();

    // the cloaked rider on a hard diagonal, mid-crossing — a leaning gestural mass
    const ride = kit.loop(9);
    const rx = kit.cx - w * 0.12 + Math.sin(ride * Math.PI * 2) * kit.u(0.02);
    const ry = waterY - kit.u(0.02);
    p.push();
    p.translate(rx, ry);
    p.rotate(-0.34);
    p.noStroke();
    p.fill(kit.palette.shade);
    // cloak/body as a streaming diagonal shape
    const fh = kit.u(0.2);
    p.circle(0, -fh, kit.u(0.05));
    p.beginShape();
    p.vertex(-kit.u(0.05), 0);
    p.vertex(-kit.u(0.02), -fh * 0.85);
    p.vertex(kit.u(0.04), -fh * 0.8);
    p.vertex(kit.u(0.13), kit.u(0.02)); // cloak trailing back
    p.vertex(kit.u(0.05), 0);
    p.endShape(p.CLOSE);
    p.pop();
    // the single token, glowing, held forward
    kit.register.glow(kit, rx + kit.u(0.04), ry - kit.u(0.14), 0.03, kit.palette.accent, 0.5 + 0.3 * ember);

    kit.light.vignette(kit);
  },
});
