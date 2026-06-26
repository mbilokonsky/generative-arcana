/**
 * Paragon of Runes — station Justice (a commanding loremaster, runes mastered/arrayed).
 * A great loremaster sits enthroned among shelves of glowing codices in even two-sided light,
 * a perfectly balanced page held forth, students arrayed in attentive symmetry. Justice light:
 * two balanced sources in equilibrium, a poised weighted stillness, the pause before a verdict.
 * The flat space is poised and golden — knowledge at its complete and exacting height.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-paragon",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const headY = kit.h * 0.36;
    const seatY = kit.h * 0.88;

    // symmetrical shelves of glowing codices behind, both sides equal
    p.push();
    p.noStroke();
    for (const sgn of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const y = kit.h * 0.28 + row * kit.u(0.07);
        for (let i = 0; i < 3; i++) {
          const x = cx + sgn * (kit.u(0.18) + i * kit.u(0.03));
          p.fill(kit.palette.shade);
          p.rect(x, y, kit.u(0.022), kit.u(0.05), kit.u(0.003));
          kit.register.glow(kit, x + kit.u(0.011), y + kit.u(0.025), 0.02, kit.palette.accent, 0.2);
        }
      }
    }
    p.pop();

    // the loremaster, enthroned, central and grave, perfectly symmetrical
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(cx - kit.u(0.15), seatY);
    p.vertex(cx - kit.u(0.1), headY + kit.u(0.07));
    p.vertex(cx + kit.u(0.1), headY + kit.u(0.07));
    p.vertex(cx + kit.u(0.15), seatY);
    p.endShape(p.CLOSE);
    p.circle(cx, headY, kit.u(0.1));
    p.pop();

    // a throne back / nimbus — formal symmetrical frame
    kit.register.glow(kit, cx, headY, 0.26, kit.palette.accent, 0.18);

    // the perfectly balanced page held forth — a level scale of runes
    const settle = 0.9 + 0.1 * Math.sin(kit.t * 0.5);
    const pageY = headY + kit.u(0.18);
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx - kit.u(0.1), pageY - kit.u(0.06), kit.u(0.2), kit.u(0.12), kit.u(0.006));
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.noFill();
    p.line(cx, pageY - kit.u(0.06), cx, pageY + kit.u(0.06)); // central axis
    p.pop();
    // two balanced runes, one each side of the axis, level
    kit.fig.rune(kit, cx - kit.u(0.05), pageY, 0.06, settle, kit.palette.accent);
    kit.fig.rune(kit, cx + kit.u(0.05), pageY, 0.06, settle, kit.palette.accent);

    // students arrayed in attentive symmetry at the foot
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    for (const sgn of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        const x = cx + sgn * (kit.u(0.1) + i * kit.u(0.07));
        const fy = kit.h * 0.97;
        p.beginShape();
        p.vertex(x - kit.u(0.03), fy);
        p.vertex(x - kit.u(0.02), fy - kit.u(0.1));
        p.vertex(x + kit.u(0.02), fy - kit.u(0.1));
        p.vertex(x + kit.u(0.03), fy);
        p.endShape(p.CLOSE);
        p.circle(x, fy - kit.u(0.12), kit.u(0.04));
      }
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
