/**
 * Ace of Crowns — station Honesty, identity 1 (governance in its seed).
 * Composition leans on the identity: a single emergent crown, central, much void — the honest offer.
 * Scene: a gold crown rests on an open parchment ledger atop a stone pedestal, flat noon light,
 * the seal unbroken, every figure legible. Interactivity: the unbroken seal brightens under regard,
 * an offer that only sharpens the more plainly it is looked at.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-ace",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // honesty: flat, merciless noon — nothing hidden

    // gilded illuminated-margin border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    kit.register.stroke(kit, 0.002, kit.palette.shade);
    p.rect(kit.u(0.07), kit.u(0.07), w - kit.u(0.14), h - kit.u(0.14), kit.u(0.015));
    p.pop();

    const cx = kit.cx;
    const baseY = kit.h * 0.74;

    // stone pedestal
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(cx - kit.u(0.13), baseY, kit.u(0.26), kit.u(0.07), kit.u(0.005));
    p.rect(cx - kit.u(0.16), baseY + kit.u(0.06), kit.u(0.32), kit.u(0.03), kit.u(0.004));
    kit.register.outline(kit, [
      [cx - kit.u(0.13), baseY], [cx + kit.u(0.13), baseY],
      [cx + kit.u(0.13), baseY + kit.u(0.07)], [cx - kit.u(0.13), baseY + kit.u(0.07)],
    ], true);
    p.pop();

    // open parchment ledger on the pedestal — two legible leaves
    const ledY = baseY - kit.u(0.005);
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.beginShape();
    p.vertex(cx - kit.u(0.12), ledY);
    p.vertex(cx - kit.u(0.005), ledY - kit.u(0.02));
    p.vertex(cx - kit.u(0.005), ledY);
    p.endShape(p.CLOSE);
    p.beginShape();
    p.vertex(cx + kit.u(0.12), ledY);
    p.vertex(cx + kit.u(0.005), ledY - kit.u(0.02));
    p.vertex(cx + kit.u(0.005), ledY);
    p.endShape(p.CLOSE);
    // legible ruled lines — every figure in the accounts plain
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.0025));
    for (let i = 0; i < 4; i++) {
      const yy = ledY - kit.u(0.004) - i * kit.u(0.004);
      p.line(cx - kit.u(0.1), yy, cx - kit.u(0.01), yy - kit.u(0.0015) * i);
      p.line(cx + kit.u(0.01), yy - kit.u(0.0015) * i, cx + kit.u(0.1), yy);
    }
    p.pop();

    // the single emergent crown — the seed, breathing gently in clear light
    const crownY = ledY - kit.u(0.02);
    const breath = 0.5 + 0.5 * Math.sin(kit.t * 0.5);
    kit.register.glow(kit, cx, crownY - kit.u(0.04), 0.12, kit.palette.accent, 0.35 + 0.15 * breath);
    kit.fig.crown(kit, cx, crownY, 0.17, kit.palette.accent);

    // the unbroken seal below the ledger — brightens under honest regard
    const sealY = baseY + kit.u(0.075);
    const near = kit.pointer.inside
      ? Math.max(0, 1 - Math.hypot(kit.pointer.x * w - cx, kit.pointer.y * h - sealY) / kit.u(0.2))
      : 0;
    kit.register.glow(kit, cx, sealY, 0.03, kit.palette.accent, 0.4 + near * 0.5);
    p.push();
    kit.register.fill(kit, kit.palette.accent);
    p.noStroke();
    p.circle(cx, sealY, kit.u(0.03 + near * 0.006));
    p.fill(kit.palette.ground);
    p.circle(cx, sealY, kit.u(0.018));
    p.pop();
    if (near > 0.6 && kit.pointer.pressed) kit.signal("attest");

    kit.light.vignette(kit);
  },
});
