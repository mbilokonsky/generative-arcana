/**
 * Seeker of Moongates — station Justice (the young heart learning to weigh its feelings fairly).
 * A youth gazes into a small gate's glow, studying their rippling reflection in even two-sided light,
 * two moons balanced above, a journal of feelings open beside the water. The first fair lesson.
 * Interactivity: the reflection ripples toward the pointer — feeling stirred by attention.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-seeker",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // justice: two balanced sources, even from both sides

    const waterY = h * 0.62;

    // two balanced moons above
    kit.fig.moon(kit, kit.cx - w * 0.16, h * 0.16, 0.045, 0.85, "#dfe6ff");
    kit.fig.moon(kit, kit.cx + w * 0.16, h * 0.16, 0.045, 0.85, "#e0506a");

    const gateX = kit.cx + w * 0.08;
    const ripple = kit.pointer.inside ? 0.6 + 0.4 * (1 - Math.abs(kit.pointer.x - 0.6) * 2) : 0.5 + 0.3 * Math.sin(kit.loop(7) * Math.PI * 2);
    const drawGate = () => {
      kit.fig.moongateArch(kit, gateX, waterY, 0.16, 0.22, 0.6 + 0.3 * ripple);
    };
    kit.fig.reflect(kit, waterY, drawGate);

    // the youth at left, leaning to gaze in
    kit.fig.figure(kit, kit.cx - w * 0.22, waterY + kit.u(0.02), 0.19, 0.3, kit.palette.shade);

    // a small open journal beside the water (two pale leaning rectangles)
    p.push();
    p.noStroke();
    p.fill(kit.palette.light);
    p.drawingContext.globalAlpha = 0.5;
    const jx = kit.cx - w * 0.3;
    const jy = waterY + kit.u(0.04);
    p.push();
    p.translate(jx, jy);
    p.rotate(-0.1);
    p.rect(-kit.u(0.04), -kit.u(0.025), kit.u(0.04), kit.u(0.05));
    p.rect(0, -kit.u(0.025), kit.u(0.04), kit.u(0.05));
    p.pop();
    p.drawingContext.globalAlpha = 1;
    p.pop();

    kit.light.vignette(kit);
  },
});
