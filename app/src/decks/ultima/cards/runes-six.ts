/**
 * Six of Runes — station Justice, identity 6 (2x3, two triads in accord).
 * Six runes arrange into a balanced ring on a vellum page lit evenly from both sides; three
 * pairs joined by gold threads in symmetry, the margins resolved and calm. Justice light: two
 * balanced sources in equilibrium, a poised weighted stillness, the pause before a verdict.
 * Many words brought into measured agreement.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-six",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = kit.h * 0.48;
    const R = kit.u(0.18);

    // vellum page
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx - kit.u(0.26), cy - kit.u(0.26), kit.u(0.52), kit.u(0.52), kit.u(0.01));
    p.pop();

    // slow, poised rotation — the pause before a verdict, barely moving
    const rot = kit.loop(40) * Math.PI * 2;
    const settle = 0.9 + 0.1 * Math.sin(kit.t * 0.5);

    const pos: Array<[number, number]> = [];
    for (let i = 0; i < 6; i++) {
      const a = rot + (i / 6) * Math.PI * 2 - Math.PI / 2;
      pos.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
    }

    // ring glow, even
    kit.register.glow(kit, cx, cy, 0.3, kit.palette.accent, 0.2 * settle);

    // three pairs joined by gold threads (opposite runes = a pair)
    p.push();
    kit.register.stroke(kit, 0.004, kit.palette.accent);
    p.noFill();
    for (let i = 0; i < 3; i++) {
      const [ax, ay] = pos[i];
      const [bx, by] = pos[i + 3];
      p.line(ax, ay, bx, by);
    }
    // the connecting ring itself
    p.beginShape();
    for (const [vx, vy] of pos) p.vertex(vx, vy);
    p.endShape(p.CLOSE);
    p.pop();

    // six runes in the balanced ring
    for (const [vx, vy] of pos) {
      kit.fig.rune(kit, vx, vy, 0.08, settle, kit.palette.accent);
    }

    // resolved margins — a calm centered point of equilibrium
    kit.register.glow(kit, cx, cy, 0.04, kit.palette.light, 0.3 * settle);
    p.push();
    p.noStroke();
    p.fill(kit.palette.light);
    p.circle(cx, cy, kit.u(0.012));
    p.pop();

    kit.light.vignette(kit);
  },
});
