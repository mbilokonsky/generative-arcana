/**
 * Seven of Crowns — station Spirituality, prime 7 (the crossroads of purpose).
 * Composition: seven diverging roads from a single point — a monarch stands alone before them,
 * crown held in hand rather than on head, each road marked with a different sigil, under a wide
 * sourceless radiant sky. Interactivity: the road nearest the pointer kindles its sigil — the choice
 * held in quiet vastness, weighed not by advantage but by what the realm is for.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-seven",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // spirituality: sourceless, drifting radiance, weightless and haloed

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const cx = kit.cx;
    // the single point the roads radiate from, near the figure's feet
    const px = cx;
    const py = kit.h * 0.74;

    const drift = kit.t * 0.15;

    // pick the road nearest the pointer
    let bestI = -1;
    let bestD = Infinity;
    const ang = (i: number) => -Math.PI / 2 + ((i - 3) / 3) * (Math.PI * 0.42);
    if (kit.pointer.inside) {
      for (let i = 0; i < 7; i++) {
        const a = ang(i);
        const ex = px + Math.cos(a) * kit.u(0.3);
        const ey = py + Math.sin(a) * kit.u(0.3);
        const d = Math.hypot(kit.pointer.x * w - ex, kit.pointer.y * h - ey);
        if (d < bestD) { bestD = d; bestI = i; }
      }
    }

    // seven roads diverging upward/outward, each ending in a sigil
    for (let i = 0; i < 7; i++) {
      const a = ang(i);
      const len = kit.u(0.34);
      const ex = px + Math.cos(a) * len;
      const ey = py + Math.sin(a) * len;
      const lit = i === bestI ? 1 : 0.35 + 0.2 * Math.sin(drift * 6 + i);
      p.push();
      p.stroke(kit.palette.shade);
      p.strokeWeight(kit.u(0.003 + 0.0015 * lit));
      p.line(px, py, ex, ey);
      p.pop();
      // a distinct sigil at each road's end — a small varied gold glyph
      kit.register.glow(kit, ex, ey, 0.03, kit.palette.accent, 0.3 + 0.5 * lit);
      p.push();
      p.translate(ex, ey);
      p.stroke(kit.palette.accent);
      p.strokeWeight(kit.u(0.0035));
      p.noFill();
      const s = kit.u(0.022);
      const kind = i % 4;
      if (kind === 0) p.circle(0, 0, s * 1.6);
      else if (kind === 1) { p.line(-s, -s, s, s); p.line(-s, s, s, -s); }
      else if (kind === 2) { p.triangle(0, -s, -s, s, s, s); }
      else { p.line(0, -s, 0, s); p.line(-s, 0, s, 0); }
      p.pop();
    }

    // the monarch standing alone at the point of choice
    kit.fig.figure(kit, px, py + kit.u(0.005), 0.24, 0, kit.palette.shade);
    // crown held in hand (low, at the side), not on the head
    const handX = px - kit.u(0.1);
    const handY = py - kit.u(0.08);
    kit.register.glow(kit, handX, handY, 0.05, kit.palette.accent, 0.35);
    kit.fig.crown(kit, handX, handY, 0.07, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
