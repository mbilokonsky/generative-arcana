/**
 * Two of Runes — station Humility, identity 2 (a first duality).
 * Two angular runes face each other across a low candle on a vellum scroll; a thin gold
 * thread links them. Earthbound dusk-light: low, level, settling downward. Neither mark is
 * raised above the other — they sit small and humble on the same line.
 * Interactivity: bringing the pointer between them tautens the gold thread, each rune leaning
 * a hair toward the other — meaning held open between two terms.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-two",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const baseY = kit.h * 0.5;
    const gap = kit.u(0.16);

    // a low unrolled vellum scroll, flat and plain-margined
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(kit.cx - kit.u(0.3), baseY - kit.u(0.13), kit.u(0.6), kit.u(0.26), kit.u(0.01));
    // rolled ends, darker
    p.fill(kit.palette.shade);
    p.rect(kit.cx - kit.u(0.33), baseY - kit.u(0.14), kit.u(0.04), kit.u(0.28), kit.u(0.02));
    p.rect(kit.cx + kit.u(0.29), baseY - kit.u(0.14), kit.u(0.04), kit.u(0.28), kit.u(0.02));
    p.pop();

    // low candle between them, dusk-quiet
    const flick = 0.5 + 0.5 * Math.sin(kit.t * 2.1) * 0.4 + 0.2 * Math.sin(kit.t * 5.3);
    const candleY = baseY - kit.u(0.02);
    kit.register.glow(kit, kit.cx, candleY - kit.u(0.03), 0.07, kit.palette.accent, 0.35 + 0.12 * flick);
    p.push();
    p.noStroke();
    p.fill(kit.palette.light);
    p.rect(kit.cx - kit.u(0.006), candleY, kit.u(0.012), kit.u(0.05));
    p.fill(kit.palette.accent);
    p.beginShape();
    p.vertex(kit.cx, candleY - kit.u(0.04) - kit.u(0.008) * flick);
    p.vertex(kit.cx + kit.u(0.01), candleY);
    p.vertex(kit.cx - kit.u(0.01), candleY);
    p.endShape(p.CLOSE);
    p.pop();

    // thread linking the two — leans taut toward the pointer if it hovers between
    let pull = 0;
    if (kit.pointer.inside) {
      const px = kit.pointer.x * kit.w;
      pull = Math.max(0, 1 - Math.abs(px - kit.cx) / kit.u(0.2));
    }
    const leftX = kit.cx - gap + kit.u(0.02) * pull;
    const rightX = kit.cx + gap - kit.u(0.02) * pull;
    const runeY = baseY - kit.u(0.005);

    p.push();
    kit.register.stroke(kit, 0.004, kit.palette.accent);
    const sag = kit.u(0.02) * (1 - pull);
    p.noFill();
    p.beginShape();
    p.vertex(leftX, runeY);
    p.vertex(kit.cx, runeY + sag);
    p.vertex(rightX, runeY);
    p.endShape();
    p.pop();

    // two small level runes, neither above the other
    kit.fig.rune(kit, leftX, runeY, 0.12, 1, kit.palette.accent);
    kit.fig.rune(kit, rightX, runeY, 0.12, 1, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
