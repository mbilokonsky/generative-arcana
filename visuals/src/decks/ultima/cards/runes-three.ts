/**
 * Three of Runes — station Honesty, identity 3 (a first true sentence).
 * Three runes lock into a glowing triangular sigil on an open page under flat, clear,
 * merciless light — nothing flickers, nothing hides. A small flame answers at the page's edge.
 * The gold ink is legible and exact: a first true spell laid bare and working.
 * Interactivity: regard closes the triangle's connecting threads, the spell "completing" and
 * brightening — meaning that says exactly what it is.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-three",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = kit.h * 0.48;
    const R = kit.u(0.17);

    // open page, flat and bright
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx - kit.u(0.24), cy - kit.u(0.26), kit.u(0.48), kit.u(0.52), kit.u(0.01));
    p.noFill();
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.line(cx, cy - kit.u(0.24), cx, cy + kit.u(0.24)); // spine, an open book
    p.pop();

    // three vertices of the sigil
    const verts: Array<[number, number]> = [
      [cx, cy - R],
      [cx - R * 0.87, cy + R * 0.5],
      [cx + R * 0.87, cy + R * 0.5],
    ];

    // how locked the spell reads — honesty light is steady, so a gentle constant breath
    const breath = 0.85 + 0.15 * Math.sin(kit.t * 0.7);
    let lock = breath;
    if (kit.pointer.inside) {
      const d = Math.hypot(kit.pointer.x * kit.w - cx, kit.pointer.y * kit.h - cy);
      lock = Math.min(1, breath + Math.max(0, 1 - d / kit.u(0.25)) * 0.3);
    }

    // connecting threads forming the triangle
    p.push();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.noFill();
    p.beginShape();
    for (const [vx, vy] of verts) p.vertex(vx, vy);
    p.endShape(p.CLOSE);
    kit.register.glow(kit, cx, cy + kit.u(0.02), 0.18, kit.palette.accent, 0.45 * lock);
    p.pop();

    // the three runes at the vertices
    for (const [vx, vy] of verts) {
      kit.fig.rune(kit, vx, vy, 0.1, lock, kit.palette.accent);
    }

    // a small flame answering at the page's edge
    const flick = 0.5 + 0.4 * Math.sin(kit.t * 3.0);
    const fx = cx + kit.u(0.21);
    const fy = cy + kit.u(0.2);
    kit.register.glow(kit, fx, fy - kit.u(0.02), 0.05, kit.palette.accent, 0.3 + 0.1 * flick);
    p.push();
    p.noStroke();
    p.fill(kit.palette.accent);
    p.beginShape();
    p.vertex(fx, fy - kit.u(0.035) - kit.u(0.006) * flick);
    p.vertex(fx + kit.u(0.008), fy);
    p.vertex(fx - kit.u(0.008), fy);
    p.endShape(p.CLOSE);
    p.pop();

    kit.light.vignette(kit);
  },
});
