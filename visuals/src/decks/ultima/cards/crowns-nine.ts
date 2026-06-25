/**
 * Nine of Crowns — station Honesty, composite 9 = 3² (governance fulfilled to ripe plenty).
 * Composition: nine near-complete — a monarch stands amid a brimming treasury and golden fields
 * under clear noon, ledgers open and balanced for any eye, a content but solitary figure, nothing
 * tucked away. A full 3×3 array of coins crowns the abundance.
 * Interactivity: passing the pointer over the ledger keeps every figure plainly legible — wealth
 * that can stand any audit.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-nine",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // honesty: flat, even noon — everything accounted-for and bright

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const cx = kit.cx;
    // golden fields — a low band of ripe grain swaying in the bright air
    const fieldY = kit.h * 0.78;
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.0028));
    for (let i = 0; i < 48; i++) {
      const gx = kit.u(0.1) + (kit.rng()) * (w - kit.u(0.2));
      const gh = kit.u(0.03 + kit.rng() * 0.025);
      const sway = Math.sin(kit.t * 0.6 + gx * 0.03) * kit.u(0.006);
      const gy = fieldY + kit.rng() * kit.u(0.06);
      p.line(gx, gy, gx + sway, gy - gh);
    }
    p.pop();

    // 3×3 array of coins above — the full, visible plenty (9 = 3²)
    const gridY = kit.h * 0.36;
    const gap = kit.u(0.08);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = cx + (c - 1) * gap;
        const y = gridY + (r - 1) * gap;
        const shimmer = 0.4 + 0.2 * Math.sin(kit.t * 0.5 + r + c);
        kit.register.glow(kit, x, y, 0.03, kit.palette.accent, shimmer);
        p.push();
        p.noStroke();
        kit.register.fill(kit, kit.palette.accent);
        p.circle(x, y, kit.u(0.04));
        // a crown stamp on each coin, plainly legible
        p.fill(kit.palette.ground);
        p.circle(x, y, kit.u(0.026));
        p.pop();
        kit.fig.crown(kit, x, y + kit.u(0.008), 0.022, kit.palette.accent);
      }
    }

    // the solitary, content monarch standing amid the plenty
    kit.fig.figure(kit, cx, kit.h * 0.74, 0.22, 0, kit.palette.shade);

    // an open, balanced ledger at the figure's feet — legible for any audit
    const ledX = w * 0.74;
    const ledY = kit.h * 0.72;
    const near = kit.pointer.inside &&
      Math.hypot(kit.pointer.x * w - ledX, kit.pointer.y * h - ledY) < kit.u(0.14);
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(ledX - kit.u(0.07), ledY, kit.u(0.14), kit.u(0.06), kit.u(0.004));
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.0022 + (near ? 0.0008 : 0)));
    for (let i = 0; i < 5; i++) {
      const yy = ledY + kit.u(0.01) + i * kit.u(0.009);
      p.line(ledX - kit.u(0.055), yy, ledX - kit.u(0.005), yy);
      p.line(ledX + kit.u(0.005), yy, ledX + kit.u(0.055), yy);
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
