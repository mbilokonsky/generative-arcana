/**
 * Nine of Blades — station Justice, number 9 (a reckoning, the count of wounds weighed).
 * A figure sits upright on the edge of a bed in even grey pre-dawn light, nine swords
 * ranged on the wall behind in exact order, hands over a bowed face. Balanced and stark,
 * every blade accounted for — the weighing relentless and clear.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-nine",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const cx = kit.cx;

    // even grey pre-dawn from both sides — Justice's balanced poised stillness
    kit.register.glow(kit, cx - kit.u(0.32), h * 0.4, 0.3, kit.palette.light, 0.16);
    kit.register.glow(kit, cx + kit.u(0.32), h * 0.4, 0.3, kit.palette.light, 0.16);

    // nine swords ranged on the wall behind in exact order (3×3 ledger)
    const top = h * 0.2;
    const gap = kit.u(0.13);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = cx + (c - 1) * gap;
        const y = top + r * kit.u(0.11) + kit.u(0.14);
        // a faint relentless flicker as each is "counted", staggered, seam-free
        const idx = r * 3 + c;
        const ph = kit.loop(9, idx / 9);
        const lit = Math.max(0, 1 - Math.abs(ph - 0.5) * 6);
        if (lit > 0) kit.register.glow(kit, x, y - kit.u(0.05), 0.04, kit.palette.light, 0.4 * lit);
        kit.fig.sword(kit, x, y, 0.11, 0, kit.palette.ink);
      }
    }

    // the bed's edge — a low horizontal mass
    const bedY = h * 0.78;
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.3), bedY, kit.u(0.6), kit.u(0.08));
    p.pop();

    // the figure sitting upright, hands over a bowed face — sleepless reckoning
    p.push();
    p.translate(cx, bedY);
    p.noStroke();
    p.fill(kit.palette.shade);
    // torso
    p.beginShape();
    p.vertex(-kit.u(0.09), 0);
    p.vertex(-kit.u(0.07), -kit.u(0.16));
    p.vertex(kit.u(0.07), -kit.u(0.16));
    p.vertex(kit.u(0.09), 0);
    p.endShape(p.CLOSE);
    // bowed head
    p.fill(kit.palette.ink);
    p.circle(0, -kit.u(0.2), kit.u(0.08));
    // hands raised over the face
    p.fill(kit.palette.shade);
    p.circle(-kit.u(0.04), -kit.u(0.21), kit.u(0.04));
    p.circle(kit.u(0.04), -kit.u(0.21), kit.u(0.04));
    p.pop();

    kit.light.vignette(kit);
  },
});
