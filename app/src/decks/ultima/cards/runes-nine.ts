/**
 * Nine of Runes — station Spirituality, identity 9 (near-complete; wisdom internalized).
 * An elder sits serene in a study where nine runes float closed-eyed around their head under a
 * diffuse radiant glow, the book shut on their lap, candles unneeded. Spirituality light:
 * sourceless radiance that drifts, light from everywhere and nowhere, weightless and haloed.
 * Knowledge fully internalized into quiet light — the spell that has become the self.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-nine",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const seatY = kit.h * 0.92;
    const headY = kit.h * 0.42;

    // the seated elder, serene — a low, settled silhouette
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    // robed seated mass
    p.beginShape();
    p.vertex(cx - kit.u(0.14), seatY);
    p.vertex(cx - kit.u(0.1), headY + kit.u(0.08));
    p.vertex(cx + kit.u(0.1), headY + kit.u(0.08));
    p.vertex(cx + kit.u(0.14), seatY);
    p.endShape(p.CLOSE);
    // head
    p.circle(cx, headY, kit.u(0.09));
    p.pop();

    // shut book resting on the lap
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.08), seatY - kit.u(0.18), kit.u(0.16), kit.u(0.04), kit.u(0.004));
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.noFill();
    p.line(cx - kit.u(0.08), seatY - kit.u(0.16), cx + kit.u(0.08), seatY - kit.u(0.16));
    p.pop();

    // nine runes floating closed around the head — a near-complete halo, drifting weightlessly
    const drift = kit.t * 0.12;
    for (let i = 0; i < 9; i++) {
      const a = drift + (i / 9) * Math.PI * 2;
      // a 3/4 halo, with a gap (near-complete, not closed)
      const open = (i / 9) * Math.PI * 1.7 - Math.PI * 0.85;
      const aa = open + drift * 0.5;
      const r = kit.u(0.15) + kit.u(0.02) * Math.sin(kit.t * 0.4 + i);
      const x = cx + Math.cos(aa - Math.PI / 2) * r;
      const y = headY + Math.sin(aa - Math.PI / 2) * r * 0.9;
      const shimmer = 0.6 + 0.4 * Math.sin(kit.t * 0.5 + i * 1.3);
      kit.fig.rune(kit, x, y, 0.06, shimmer, kit.palette.accent);
    }

    // diffuse, sourceless radiance haloing the whole head
    kit.register.glow(kit, cx, headY, 0.34, kit.palette.light, 0.3);
    kit.register.glow(kit, cx, headY, 0.2, kit.palette.accent, 0.22);

    kit.light.vignette(kit);
  },
});
