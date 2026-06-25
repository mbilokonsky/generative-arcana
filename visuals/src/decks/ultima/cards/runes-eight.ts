/**
 * Eight of Runes — station Honor, identity 8 (2^3, runes woven in disciplined motion).
 * An adept stands at the center of eight orbiting runes in formal vertical candlelight, weaving
 * them with both hands into a complex glowing lattice, robes ordered and grave. Honor light: a
 * formal vertical, columnar and held; burnished, ceremonial, a standard raised, upright and a
 * little cold. The flat space fills with disciplined gold geometry — mastery on display.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-eight",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = kit.h * 0.46;
    const feetY = kit.h * 0.9;

    // the adept, central, upright and grave
    kit.fig.figure(kit, cx, feetY, 0.36, 0, kit.palette.ink);
    // both hands raised, weaving
    p.push();
    kit.register.stroke(kit, 0.012, kit.palette.ink);
    for (const sgn of [-1, 1]) {
      p.line(cx + sgn * kit.u(0.02), feetY - kit.u(0.26), cx + sgn * kit.u(0.13), feetY - kit.u(0.34));
    }
    p.pop();

    // eight orbiting runes, two interlocking rings (2^3 lattice) in disciplined motion
    const rot = kit.loop(30) * Math.PI * 2;
    const lattice: Array<[number, number]> = [];
    for (let i = 0; i < 8; i++) {
      const a = rot + (i / 8) * Math.PI * 2;
      // slightly elliptical, taller than wide — vertical honor light
      const rx = kit.u(0.16);
      const ry = kit.u(0.2);
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry;
      lattice.push([x, y]);
    }

    // disciplined gold geometry: connect each rune to its neighbor and across
    p.push();
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.noFill();
    for (let i = 0; i < 8; i++) {
      const [ax, ay] = lattice[i];
      const [bx, by] = lattice[(i + 1) % 8];
      const [cxn, cyn] = lattice[(i + 3) % 8];
      p.line(ax, ay, bx, by);
      p.line(ax, ay, cxn, cyn);
    }
    p.pop();

    kit.register.glow(kit, cx, cy, 0.34, kit.palette.accent, 0.22);

    // the eight runes themselves
    for (const [x, y] of lattice) {
      kit.fig.rune(kit, x, y, 0.07, 1, kit.palette.accent);
    }

    // a columnar vertical glow rising — honor's raised standard
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const g = ctx.createLinearGradient(0, cy + kit.u(0.25), 0, cy - kit.u(0.3));
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(255,230,150,0.08)");
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(cx - kit.u(0.04), cy - kit.u(0.3), kit.u(0.08), kit.u(0.55));
    ctx.restore();
    p.pop();

    kit.light.vignette(kit);
  },
});
