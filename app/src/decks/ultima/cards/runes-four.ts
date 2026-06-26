/**
 * Four of Runes — station Compassion, identity 4 (a 2x2 foursquare canon).
 * Four runes anchor the corners of a richly illuminated codex-page; a gold border binds
 * them into a stable frame, and a reader's gentle hands rest on the vellum. Compassion light:
 * a low warm hearth-glow that breathes slowly, edges soft, everything enfolded.
 * The canon glows softly, made to hold.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-four",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const cx = kit.cx;
    const cy = kit.h * 0.47;
    const halfW = kit.u(0.2);
    const halfH = kit.u(0.24);

    const breath = kit.light.pulse(kit.t); // hearth breath 0..1

    // richly illuminated codex page
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx - halfW - kit.u(0.02), cy - halfH - kit.u(0.02), (halfW + kit.u(0.02)) * 2, (halfH + kit.u(0.02)) * 2, kit.u(0.01));
    p.pop();

    // gold border binding the frame — softly glowing, breathing
    kit.register.glow(kit, cx, cy, 0.3, kit.palette.accent, 0.18 + 0.1 * breath);
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.006, kit.palette.accent);
    p.rect(cx - halfW, cy - halfH, halfW * 2, halfH * 2);
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    p.rect(cx - halfW + kit.u(0.018), cy - halfH + kit.u(0.018), halfW * 2 - kit.u(0.036), halfH * 2 - kit.u(0.036));
    p.pop();

    // four corner runes — the 2x2 canon
    const corners: Array<[number, number]> = [
      [cx - halfW + kit.u(0.05), cy - halfH + kit.u(0.06)],
      [cx + halfW - kit.u(0.05), cy - halfH + kit.u(0.06)],
      [cx - halfW + kit.u(0.05), cy + halfH - kit.u(0.06)],
      [cx + halfW - kit.u(0.05), cy + halfH - kit.u(0.06)],
    ];
    const glowAmt = 0.85 + 0.15 * breath;
    for (const [vx, vy] of corners) {
      kit.fig.rune(kit, vx, vy, 0.08, glowAmt, kit.palette.accent);
    }

    // a reader's gentle hands resting on the lower vellum — two soft silhouette forms
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    const handY = cy + halfH + kit.u(0.04);
    for (const sgn of [-1, 1]) {
      const hx = cx + sgn * kit.u(0.08);
      p.beginShape();
      p.vertex(hx - kit.u(0.035), handY + kit.u(0.04));
      p.vertex(hx - kit.u(0.03), handY - kit.u(0.01));
      p.vertex(hx, handY - kit.u(0.025));
      p.vertex(hx + kit.u(0.03), handY - kit.u(0.01));
      p.vertex(hx + kit.u(0.035), handY + kit.u(0.04));
      p.endShape(p.CLOSE);
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
