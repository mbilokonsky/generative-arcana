/**
 * Knight of Runes — station Compassion (carrying the spell into motion as mercy).
 * A robed rune-worker kneels in a warm low-lit cottage casting a gentle glowing sigil over a
 * sick child, a satchel of scrolls open, the family close around. Compassion light: a low warm
 * hearth-glow that breathes slowly, edges soft, everything enfolded. The flat space is tender
 * and golden — knowledge brought lovingly into a real and grateful room.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-knight",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const breath = kit.light.pulse(kit.t); // hearth breath
    const cx = kit.cx;
    const floorY = kit.h * 0.86;

    // warm enfolding hearth-glow filling the room
    kit.register.glow(kit, cx, kit.h * 0.55, 0.5, kit.palette.accent, 0.12 + 0.06 * breath);

    // the sick child, lying low — a small horizontal silhouette on a pallet
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.04), floorY - kit.u(0.05), kit.u(0.26), kit.u(0.05), kit.u(0.01)); // pallet
    p.fill(kit.palette.ink);
    p.beginShape(); // reclining child
    p.vertex(cx + kit.u(0.0), floorY - kit.u(0.05));
    p.vertex(cx + kit.u(0.2), floorY - kit.u(0.06));
    p.vertex(cx + kit.u(0.2), floorY - kit.u(0.09));
    p.vertex(cx + kit.u(0.0), floorY - kit.u(0.08));
    p.endShape(p.CLOSE);
    p.circle(cx + kit.u(0.2), floorY - kit.u(0.08), kit.u(0.05)); // head
    p.pop();

    // the kneeling rune-worker on the left, leaning toward the child, hand raised
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.beginShape(); // kneeling robed mass
    p.vertex(cx - kit.u(0.22), floorY);
    p.vertex(cx - kit.u(0.2), floorY - kit.u(0.2));
    p.vertex(cx - kit.u(0.1), floorY - kit.u(0.24));
    p.vertex(cx - kit.u(0.08), floorY);
    p.endShape(p.CLOSE);
    p.circle(cx - kit.u(0.15), floorY - kit.u(0.27), kit.u(0.07)); // head
    // arm extended over the child
    kit.register.stroke(kit, 0.012, kit.palette.ink);
    p.line(cx - kit.u(0.11), floorY - kit.u(0.2), cx + kit.u(0.04), floorY - kit.u(0.16));
    p.pop();

    // the gentle glowing sigil cast over the child, breathing
    const sx = cx + kit.u(0.06);
    const sy = floorY - kit.u(0.18);
    kit.register.glow(kit, sx, sy, 0.16, kit.palette.accent, 0.4 + 0.2 * breath);
    kit.fig.rune(kit, sx, sy, 0.1, 0.85 + 0.15 * breath, kit.palette.accent);

    // an open satchel of scrolls at the worker's side
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.3), floorY - kit.u(0.06), kit.u(0.08), kit.u(0.06), kit.u(0.008));
    p.fill(kit.palette.ground);
    for (let i = 0; i < 3; i++) {
      p.rect(cx - kit.u(0.3) + i * kit.u(0.02) + kit.u(0.008), floorY - kit.u(0.085), kit.u(0.012), kit.u(0.03), kit.u(0.004));
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
