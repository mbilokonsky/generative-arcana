/**
 * Paragon of Moongates — station Spirituality (intuition wholly mastered, a light others steer by).
 * A luminous figure stands within a vast gate at the meeting of sea and night sky, countless smaller
 * gates haloed around them in diffuse radiant light, two moons and a rising third aligned. The complete height.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-paragon",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // spirituality: sourceless drifting radiance, weightless and haloed

    const waterY = h * 0.74;
    const drift = kit.loop(18);

    // two moons and a rising third, aligned vertically up the center
    kit.fig.moon(kit, kit.cx - w * 0.13, h * 0.18, 0.04, 0.8, "#dfe6ff");
    kit.fig.moon(kit, kit.cx + w * 0.13, h * 0.18, 0.04, 0.7, "#e0506a");
    kit.register.glow(kit, kit.cx, h * 0.1, 0.06, kit.palette.light, 0.4);

    const drawScene = () => {
      // countless smaller gates haloed around, in two drifting rings
      const rings = [
        { n: 10, r: kit.u(0.34), ry: 0.62, sz: 0.05, ph: 0 },
        { n: 7, r: kit.u(0.22), ry: 0.6, sz: 0.07, ph: 0.3 },
      ];
      rings.forEach((rg, ri) => {
        for (let i = 0; i < rg.n; i++) {
          const a = (i / rg.n) * Math.PI * 2 + (drift + rg.ph) * Math.PI * 2 * (ri === 0 ? 1 : -1);
          const x = kit.cx + Math.cos(a) * rg.r;
          const y = h * 0.46 + Math.sin(a) * rg.r * rg.ry + kit.u(0.06);
          const open = 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(kit.loop(12, i / rg.n) * Math.PI * 2));
          kit.fig.moongateArch(kit, x, y, rg.sz, rg.sz * 1.3, open);
        }
      });
      // the vast central gate
      kit.fig.moongateArch(kit, kit.cx, waterY, 0.34, 0.5, 0.95);
    };
    kit.fig.reflect(kit, waterY, drawScene);

    // the luminous figure standing within the vast gate
    kit.fig.figure(kit, kit.cx, waterY + kit.u(0.01), 0.24, 0, kit.palette.light);
    kit.register.glow(kit, kit.cx, waterY - kit.u(0.18), 0.12, kit.palette.accent, 0.4);

    kit.light.vignette(kit);
  },
});
