/**
 * Two of Crowns — station Compassion, number 2 (the crown's first duality).
 * Composition: two emblems in tender balance — a steward holds two small crowns above a
 * balanced scale in a warm low-lit hall, two petitioners waiting at either hand.
 * Interactivity: the pointer's horizontal position tips the scale toward the nearer petitioner,
 * but the warm light never lets either fall — care holds both needs in balance.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-two",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // compassion: low warm hearth-glow, breathing, everything enfolded

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const cx = kit.cx;
    const breath = kit.light.pulse(kit.t); // hearth breath
    // tilt toward whichever petitioner the pointer favors; warm light keeps it gentle
    const lean = kit.pointer.inside ? (kit.pointer.x - 0.5) * 0.6 : Math.sin(kit.t * 0.4) * 0.18;

    // the steward at center, holding the choice
    kit.fig.figure(kit, cx, kit.h * 0.78, 0.28, 0, kit.palette.shade);

    // two petitioners waiting at either hand, smaller, enfolded by the glow
    kit.register.glow(kit, w * 0.2, kit.h * 0.7, 0.12, kit.palette.accent, 0.25 + 0.1 * breath);
    kit.register.glow(kit, w * 0.8, kit.h * 0.7, 0.12, kit.palette.accent, 0.25 + 0.1 * breath);
    kit.fig.figure(kit, w * 0.2, kit.h * 0.8, 0.18, 0, kit.palette.shade);
    kit.fig.figure(kit, w * 0.8, kit.h * 0.8, 0.18, 0, kit.palette.shade);

    // the balanced scale held above — beam tilts with lean
    const pivotX = cx;
    const pivotY = kit.h * 0.42;
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.006));
    p.strokeCap(p.ROUND);
    // central post down to the steward's hands
    p.line(pivotX, pivotY, pivotX, kit.h * 0.5);
    // the beam
    const beamHalf = kit.u(0.16);
    const dy = lean * kit.u(0.05);
    const lx = pivotX - beamHalf, ly = pivotY + dy;
    const rx = pivotX + beamHalf, ry = pivotY - dy;
    p.line(lx, ly, rx, ry);
    // pan cords + pans
    p.strokeWeight(kit.u(0.003));
    const panDrop = kit.u(0.05);
    p.line(lx, ly, lx, ly + panDrop);
    p.line(rx, ry, rx, ry + panDrop);
    p.noStroke();
    p.pop();

    // two small crowns, one over each pan — the duality the crown must hold
    const leftBright = 0.6 + 0.3 * Math.max(0, -lean) + 0.1 * breath;
    const rightBright = 0.6 + 0.3 * Math.max(0, lean) + 0.1 * breath;
    kit.register.glow(kit, lx, ly + panDrop, 0.06, kit.palette.accent, leftBright);
    kit.register.glow(kit, rx, ry + panDrop, 0.06, kit.palette.accent, rightBright);
    kit.fig.crown(kit, lx, ly + panDrop + kit.u(0.03), 0.08, kit.palette.accent);
    kit.fig.crown(kit, rx, ry + panDrop + kit.u(0.03), 0.08, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
