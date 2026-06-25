/**
 * Ten of Crowns — station Compassion, composite 10 (completion; the crown handed on).
 * Composition: ten overflowing toward a threshold — an old monarch lays a crown gently into a young
 * successor's hands amid a generous household of many faces, warm low golden light, a thriving town
 * beyond the window. Interactivity: the pointer nudges the crown across the gap between the two pairs
 * of hands; the passing-on is freely and lovingly made.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-ten",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // compassion: low warm hearth-glow breathing, everything enfolded

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const breath = kit.light.pulse(kit.t);

    // a window with a thriving town beyond, upper-right, warm light spilling
    const winX = w * 0.74, winY = kit.h * 0.34;
    p.push();
    p.noStroke();
    kit.register.glow(kit, winX, winY, 0.14, kit.palette.accent, 0.25 + 0.1 * breath);
    p.fill(kit.palette.ground);
    p.rect(winX - kit.u(0.09), winY - kit.u(0.1), kit.u(0.18), kit.u(0.2), kit.u(0.006));
    // little town silhouette in the window
    kit.register.fill(kit, kit.palette.shade);
    for (let i = 0; i < 4; i++) {
      const tx = winX - kit.u(0.07) + i * kit.u(0.045);
      const th = kit.u(0.05 + (i % 2) * 0.025);
      p.rect(tx, winY + kit.u(0.08) - th, kit.u(0.03), th);
    }
    p.noFill();
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.rect(winX - kit.u(0.09), winY - kit.u(0.1), kit.u(0.18), kit.u(0.2), kit.u(0.006));
    p.pop();

    const groundY = kit.h * 0.78;
    // the generous household — many faces gathered, warmly enfolded
    const householdX = [0.16, 0.24, 0.84, 0.9];
    householdX.forEach((fx, i) => {
      kit.fig.figure(kit, w * fx, groundY + kit.u(0.01), 0.14 + 0.01 * (i % 2), 0, kit.palette.shade);
    });

    // the old monarch (left) and the young successor (right), facing, hands meeting at center
    const oldX = w * 0.4, youngX = w * 0.6;
    kit.fig.figure(kit, oldX, groundY, 0.24, 0.25, kit.palette.shade);
    kit.fig.figure(kit, youngX, groundY, 0.21, -0.25, kit.palette.shade);

    // the crown passing across the gap — pointer nudges it toward the successor
    const handY = groundY - kit.u(0.16);
    const auto = 0.5 + 0.18 * Math.sin(kit.t * 0.5);
    const t = kit.pointer.inside ? Math.min(1, Math.max(0, kit.pointer.x)) : auto;
    const crownX = oldX + kit.u(0.04) + (youngX - oldX - kit.u(0.08)) * t;
    kit.register.glow(kit, crownX, handY, 0.07, kit.palette.accent, 0.5 + 0.2 * breath);
    kit.fig.crown(kit, crownX, handY, 0.08, kit.palette.accent);
    if (t > 0.85 && kit.pointer.pressed) kit.signal("bequeath");

    kit.light.vignette(kit);
  },
});
