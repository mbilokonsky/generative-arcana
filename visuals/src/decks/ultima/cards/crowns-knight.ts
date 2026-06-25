/**
 * Knight of Crowns — station Justice, 12 (stewardship in active deed).
 * Composition: a figure in active motion carrying the emblem — an armored official rides into a remote
 * village bearing the royal seal, weighing a dispute at the well in even two-sided light, ledger and
 * sword both at the saddle. Interactivity: the pointer leans the verdict left or right, but the two
 * balanced sources hold it level — authority arrived to set things right.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-knight",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // justice: two balanced sources, poised weighted stillness

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const groundY = kit.h * 0.82;

    // the village well at center-right, two disputants at either hand (even, paired)
    const wellX = w * 0.66, wellY = groundY;
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(wellX - kit.u(0.05), wellY - kit.u(0.06), kit.u(0.1), kit.u(0.06), kit.u(0.004));
    p.pop();
    kit.register.outline(kit, [
      [wellX - kit.u(0.05), wellY - kit.u(0.06)], [wellX + kit.u(0.05), wellY - kit.u(0.06)],
      [wellX + kit.u(0.05), wellY], [wellX - kit.u(0.05), wellY],
    ], true);
    kit.fig.figure(kit, w * 0.84, groundY, 0.16, -0.3, kit.palette.shade);
    kit.fig.figure(kit, w * 0.5, groundY, 0.16, 0.3, kit.palette.shade);

    // a small village mass behind
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    for (let i = 0; i < 3; i++) {
      const hx = w * (0.5 + i * 0.12);
      p.rect(hx, kit.h * 0.5, kit.u(0.05), kit.u(0.1));
    }
    p.pop();

    // the mounted official entering from the left — a slow processional advance
    const ride = kit.loop(10);
    const baseX = w * 0.18 + Math.sin(ride * Math.PI * 2) * kit.u(0.01);
    const horseY = groundY;
    // horse silhouette (gestural mass)
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.ellipse(baseX, horseY - kit.u(0.06), kit.u(0.16), kit.u(0.07)); // body
    p.rect(baseX - kit.u(0.07), horseY - kit.u(0.06), kit.u(0.02), kit.u(0.06)); // legs
    p.rect(baseX + kit.u(0.05), horseY - kit.u(0.06), kit.u(0.02), kit.u(0.06));
    p.ellipse(baseX + kit.u(0.1), horseY - kit.u(0.1), kit.u(0.05), kit.u(0.05)); // head
    p.pop();
    // the rider, upright, bearing the seal
    kit.fig.figure(kit, baseX - kit.u(0.005), horseY - kit.u(0.1), 0.18, -0.05, kit.palette.shade);
    // royal seal glowing at the rider's hand
    kit.register.glow(kit, baseX + kit.u(0.05), horseY - kit.u(0.2), 0.045, kit.palette.accent, 0.5);
    kit.fig.crown(kit, baseX + kit.u(0.05), horseY - kit.u(0.19), 0.06, kit.palette.accent);
    // ledger + sword at the saddle — both instruments of authority
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(baseX - kit.u(0.09), horseY - kit.u(0.08), kit.u(0.03), kit.u(0.04)); // ledger
    p.pop();
    kit.fig.sword(kit, baseX + kit.u(0.085), horseY - kit.u(0.05), 0.12, 0.3, kit.palette.ink);

    // the verdict scale floating above the well — pointer tilts it, light holds it level
    const tilt = kit.pointer.inside ? (kit.pointer.x - 0.5) * 0.4 : 0;
    const settle = tilt * 0.4; // justice damps it back toward balance
    const pivotX = wellX, pivotY = kit.h * 0.42;
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.004));
    p.strokeCap(p.ROUND);
    p.line(pivotX, pivotY - kit.u(0.03), pivotX, pivotY);
    const bh = kit.u(0.11);
    p.line(pivotX - bh, pivotY + settle * kit.u(0.05), pivotX + bh, pivotY - settle * kit.u(0.05));
    p.strokeWeight(kit.u(0.0025));
    p.line(pivotX - bh, pivotY + settle * kit.u(0.05), pivotX - bh, pivotY + settle * kit.u(0.05) + kit.u(0.035));
    p.line(pivotX + bh, pivotY - settle * kit.u(0.05), pivotX + bh, pivotY - settle * kit.u(0.05) + kit.u(0.035));
    p.pop();
    kit.register.glow(kit, pivotX - bh, pivotY + kit.u(0.04), 0.03, kit.palette.accent, 0.4);
    kit.register.glow(kit, pivotX + bh, pivotY + kit.u(0.04), 0.03, kit.palette.accent, 0.4);

    kit.light.vignette(kit);
  },
});
