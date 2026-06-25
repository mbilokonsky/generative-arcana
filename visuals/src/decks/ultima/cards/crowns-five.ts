/**
 * Five of Crowns — station Sacrifice, prime 5 (governance under pressure spends).
 * Composition: five emblems contending under strain — a ruler opens a granary to a thin crowd
 * in reddened ember light, the royal coffer behind visibly emptying, advisors grim.
 * Interactivity: reaching toward the outstretched hands spends another coin from the coffer —
 * there is no winning here; the gold only ever depletes.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-five",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // sacrifice: reddened ember pulse, glow depleting and rekindling

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const ember = kit.light.pulse(kit.t); // the spending breath
    const groundY = kit.h * 0.82;

    // the royal coffer behind, on the left, visibly emptying as the ember falls
    const cofX = w * 0.78;
    const cofY = groundY - kit.u(0.02);
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(cofX - kit.u(0.09), cofY - kit.u(0.07), kit.u(0.18), kit.u(0.09), kit.u(0.005));
    kit.register.outline(kit, [
      [cofX - kit.u(0.09), cofY - kit.u(0.07)], [cofX + kit.u(0.09), cofY - kit.u(0.07)],
      [cofX + kit.u(0.09), cofY + kit.u(0.02)], [cofX - kit.u(0.09), cofY + kit.u(0.02)],
    ], true);
    p.pop();
    // coins inside, level dropping with the ember
    const fill = 0.35 + 0.4 * ember;
    p.push();
    p.noStroke();
    for (let i = 0; i < 7; i++) {
      const cxi = cofX - kit.u(0.07) + (i % 4) * kit.u(0.045);
      const cyi = cofY - kit.u(0.005) - Math.floor(i / 4) * kit.u(0.02);
      if ((i / 7) > fill) continue;
      kit.register.glow(kit, cxi, cyi, 0.02, kit.palette.accent, 0.5 * ember);
      kit.register.fill(kit, kit.palette.accent);
      p.circle(cxi, cyi, kit.u(0.022));
    }
    p.pop();

    // the ruler at the granary mouth, leaning into the act of giving
    kit.fig.figure(kit, w * 0.5, groundY, 0.26, -0.3, kit.palette.shade);

    // two grim advisors behind the ruler
    kit.fig.figure(kit, w * 0.6, groundY, 0.2, 0, kit.palette.shade);
    kit.fig.figure(kit, w * 0.68, groundY, 0.19, 0, kit.palette.shade);

    // a thin crowd of reaching hands on the left, lit by the depleting glow
    const near = kit.pointer.inside && kit.pointer.x < 0.45;
    for (let i = 0; i < 5; i++) {
      const hx = w * (0.12 + i * 0.055);
      const reach = Math.sin(kit.t * 0.8 + i) * kit.u(0.01);
      kit.fig.figure(kit, hx, groundY + kit.u(0.005), 0.16 + i * 0.005, -0.7, kit.palette.shade);
      // outstretched hand catching the warm light
      kit.register.glow(kit, hx + kit.u(0.03), groundY - kit.u(0.12) + reach, 0.025,
        kit.palette.accent, 0.3 + 0.3 * ember + (near ? 0.2 : 0));
    }

    // a coin spent — arcs from coffer toward the crowd, gold given away
    const spend = kit.loop(3);
    const sx = cofX + (w * 0.2 - cofX) * spend;
    const sy = (groundY - kit.u(0.05)) - Math.sin(spend * Math.PI) * kit.u(0.12);
    kit.register.glow(kit, sx, sy, 0.025, kit.palette.accent, 0.7 * (1 - spend * 0.3));
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.circle(sx, sy, kit.u(0.02));
    p.pop();
    if (near && kit.pointer.pressed) kit.signal("spend");

    kit.light.vignette(kit);
  },
});
