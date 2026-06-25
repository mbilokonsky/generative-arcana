/**
 * Four of Crowns — station Justice, composite 4 = 2² (governance stabilized into structure).
 * Composition leans on the number: a foursquare 2×2 frame of crowns stabilizing a central keep.
 * Interactivity: the crown nearest the pointer brightens, the realm acknowledging where you look.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-four",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit);

    // manuscript-illumination border (Crowns: gilded, symmetric)
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    kit.register.stroke(kit, 0.002, kit.palette.shade);
    p.rect(kit.u(0.07), kit.u(0.07), w - kit.u(0.14), h - kit.u(0.14), kit.u(0.015));
    p.pop();

    // central keep
    const baseY = kit.cy + kit.u(0.2);
    kit.fig.tower(kit, kit.cx, baseY, 0.24, 0.3, kit.palette.shade);
    // two balanced windows (justice: even, paired), glowing softly in phase
    const glow = 0.4 + 0.3 * (0.5 + 0.5 * Math.sin(kit.t * 0.6));
    [-1, 1].forEach((sgn) => kit.register.glow(kit, kit.cx + sgn * kit.u(0.06), baseY - kit.u(0.16), 0.04, kit.palette.accent, glow));

    // four crowns at the corners of a square — the rank-four stabilizing the structure
    const d = kit.u(0.24);
    const cy0 = kit.cy + kit.u(0.04);
    const corners: Array<[number, number]> = [
      [kit.cx - d, cy0], [kit.cx + d, cy0],
      [kit.cx - d, cy0 + kit.u(0.22)], [kit.cx + d, cy0 + kit.u(0.22)],
    ];
    for (const [x, y] of corners) {
      const near = kit.pointer.inside && Math.hypot(kit.pointer.x * w - x, kit.pointer.y * h - y) < kit.u(0.11);
      if (near) kit.register.glow(kit, x, y - kit.u(0.03), 0.1, kit.palette.accent, 0.9);
      kit.fig.crown(kit, x, y, 0.1, kit.palette.accent);
    }

    kit.light.vignette(kit);
  },
});
