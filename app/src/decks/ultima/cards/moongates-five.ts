/**
 * Five of Moongates — station Honor, number 5 (feeling under strain, met unbowed).
 * A lone figure kneels at the edge of dark water before three dim and two bright gates in formal
 * vertical light, reflection trembling, two moons stark above. A feeling held up against its weight.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-five",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // honor: formal vertical columnar light, upright and a little cold

    const waterY = h * 0.68;
    const waver = Math.sin(kit.loop(6) * Math.PI * 2);

    // two stark moons high
    kit.fig.moon(kit, w * 0.28, h * 0.15, 0.05, 0.95, "#dfe6ff");
    kit.fig.moon(kit, w * 0.72, h * 0.15, 0.045, 0.5, "#e0506a");

    // five gates in a row; two bright, three dim, all wavering
    const n = 5;
    const bright = [false, true, false, true, false];
    const drawGates = () => {
      for (let i = 0; i < n; i++) {
        const tt = i / (n - 1);
        const x = kit.cx + (tt - 0.5) * w * 0.62;
        const wob = Math.sin(kit.loop(6, i / n) * Math.PI * 2) * kit.u(0.012);
        const open = bright[i] ? 0.8 + 0.1 * waver : 0.2 + 0.08 * waver;
        kit.fig.moongateArch(kit, x + wob, waterY - kit.u(0.02), 0.12, 0.18, Math.max(0.08, open));
      }
    };
    kit.fig.reflect(kit, waterY, drawGates);

    // a lone kneeling figure at the water's edge — a low bowed mass
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    const fx = kit.cx;
    const fy = waterY + kit.u(0.04);
    const fh = kit.u(0.13);
    p.circle(fx + kit.u(0.02), fy - fh, kit.u(0.05)); // bowed head, forward
    p.beginShape();
    p.vertex(fx - kit.u(0.06), fy);
    p.vertex(fx - kit.u(0.02), fy - fh * 0.85);
    p.vertex(fx + kit.u(0.05), fy - fh * 0.75);
    p.vertex(fx + kit.u(0.07), fy);
    p.endShape(p.CLOSE);
    p.pop();

    kit.light.vignette(kit);
  },
});
