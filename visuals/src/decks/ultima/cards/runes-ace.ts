/**
 * Ace of Runes — station Spirituality, identity 1 (the first word emerging).
 * Composition leans on the identity number: a single central form, much void around it.
 * Interactivity: the rune completes its strokes toward your regard; the sourceless motes gather
 * where attention falls — meaning surfacing under the gaze.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-ace",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit);

    // vellum page (illuminated, flat)
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(kit.cx - kit.u(0.21), kit.cy - kit.u(0.27), kit.u(0.42), kit.u(0.54), kit.u(0.012));
    p.noFill();
    kit.register.stroke(kit, 0.004, kit.palette.accent);
    p.rect(kit.cx - kit.u(0.19), kit.cy - kit.u(0.25), kit.u(0.38), kit.u(0.5));
    p.pop();

    // sourceless motes (spirituality drift), gathering toward the pointer
    p.push();
    p.noStroke();
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      let mx = kit.cx + Math.cos(a + kit.t * 0.2) * kit.u(0.12 + 0.06 * Math.sin(kit.t * 0.3 + i));
      let my = kit.cy + Math.sin(a + kit.t * 0.2) * kit.u(0.12 + 0.06 * Math.cos(kit.t * 0.27 + i));
      if (kit.pointer.inside) {
        mx += (kit.pointer.x * w - mx) * 0.15;
        my += (kit.pointer.y * h - my) * 0.15;
      }
      kit.register.glow(kit, mx, my, 0.02, kit.palette.accent, 0.6);
      p.fill(kit.palette.light);
      p.circle(mx, my, kit.u(0.005));
    }
    p.pop();

    // the single rune, breathing and completing toward attention
    const breath = 0.45 + 0.25 * (0.5 + 0.5 * Math.sin(kit.t * 0.6));
    const near = kit.pointer.inside
      ? Math.max(0, 1 - Math.hypot(kit.pointer.x * w - kit.cx, kit.pointer.y * h - kit.cy) / kit.u(0.3))
      : 0;
    const complete = Math.min(1, breath + near * 0.5);
    kit.fig.rune(kit, kit.cx, kit.cy - kit.u(0.01), 0.3, complete, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
