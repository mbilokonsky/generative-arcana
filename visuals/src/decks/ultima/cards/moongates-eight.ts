/**
 * Eight of Moongates — station Honesty, composite 8 = 2³ (mastery of passage).
 * Composition leans on the number: a built sequence of eight arches receding over water.
 * Interactivity: the path lights AHEAD of where you look — sure intuition lighting the next step.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

function archAt(kit: SketchKit, i: number) {
  const tt = i / 7;
  const x = kit.cx + (tt - 0.5) * kit.w * 0.72 * (1 - 0.28 * tt) + Math.sin(tt * 3) * kit.u(0.04);
  const yBase = kit.h * 0.56 - tt * kit.u(0.03);
  const sz = 0.24 * (1 - 0.66 * tt);
  return { tt, x, yBase, sz };
}

export default registerCard({
  slug: "moongates-eight",

  draw(kit) {
    const { w, h } = kit;
    kit.light.wash(kit); // honesty: flat, even, everything legible

    const waterY = h * 0.56;

    // two moons in a clear honest sky
    kit.fig.moon(kit, w * 0.24, h * 0.19, 0.06, 0.92, "#dfe9ff");
    kit.fig.moon(kit, w * 0.8, h * 0.15, 0.042, 0.82, "#e0506a");

    // a pulse of light travels the path; the pointer leads it where you look
    const head = kit.pointer.inside ? kit.pointer.x : kit.loop(6);

    const drawArches = () => {
      for (let i = 0; i < 8; i++) {
        const a = archAt(kit, i);
        const lit = Math.max(0, 1 - Math.abs(a.tt - head) * 3.5);
        kit.fig.moongateArch(kit, a.x, a.yBase, a.sz, a.sz * 1.3, 0.3 + 0.7 * lit);
      }
    };

    kit.fig.reflect(kit, waterY, drawArches);

    kit.light.vignette(kit);
  },
});
