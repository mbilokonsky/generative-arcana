/**
 * Ten of Blades — station Sacrifice, composite 10 (the final fall, overflow toward a threshold).
 * A figure lies fallen beneath ten swords on a dusk field washed in reddened ember light,
 * one hand open and empty, a thin dawn-line at the far horizon. The spent body is still,
 * the woodcut harshness softening — an ending wholly given over, seeding a new cycle.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-ten",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const ember = kit.light.pulse(kit.t); // sacrifice's depleting/rekindling glow

    // reddened ember light over the dusk field, slowly spending and rekindling
    kit.register.glow(kit, kit.cx, h * 0.46, 0.5, kit.palette.accent, 0.18 + 0.12 * ember);

    // dusk field
    const groundY = h * 0.66;
    kit.register.shade(kit, 0, groundY, w / mn, (h - groundY) / mn, 0.42);

    // a thin dawn-line at the far horizon — the promise of the next cycle
    p.push();
    const dawn = p.color(kit.palette.light);
    dawn.setAlpha(160 + 60 * ember);
    p.stroke(dawn);
    p.strokeWeight(kit.u(0.004));
    p.line(0, groundY - kit.u(0.005), w, groundY - kit.u(0.005));
    p.pop();

    // the fallen figure — a recumbent silhouette laid along the ground, one hand open
    const fy = groundY + kit.u(0.06);
    p.push();
    p.translate(kit.cx - kit.u(0.04), fy);
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(-kit.u(0.22), 0);
    p.vertex(-kit.u(0.24), -kit.u(0.035));
    p.vertex(-kit.u(0.12), -kit.u(0.05));
    p.vertex(kit.u(0.18), -kit.u(0.04));
    p.vertex(kit.u(0.22), 0);
    p.endShape(p.CLOSE);
    // bowed head at the left end
    p.fill(kit.palette.ink);
    p.circle(-kit.u(0.22), -kit.u(0.055), kit.u(0.055));
    // the open, empty hand reaching out to the right
    p.fill(kit.palette.shade);
    p.circle(kit.u(0.24), -kit.u(0.02), kit.u(0.03));
    p.pop();

    // ten swords fallen into the body, fanned — the overflow, final and complete
    const angles = [-0.6, -0.45, -0.3, -0.16, -0.04, 0.06, 0.18, 0.32, 0.46, 0.6];
    angles.forEach((a, i) => {
      const x = kit.cx - kit.u(0.18) + (i / 9) * kit.u(0.34);
      kit.fig.sword(kit, x, fy - kit.u(0.02), 0.28, a, kit.palette.ink);
    });

    kit.light.vignette(kit);
  },
});
