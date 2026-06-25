/**
 * Seeker of Runes — station Honesty (the novice tracing/studying a rune).
 * A young novice copies runes by clear daylight at a plain desk, comparing each carefully to
 * the master's page, errors openly crossed out. Honesty light: flat, even, merciless noon —
 * does not flicker, nothing occluded, no shadow hides anything. The gold ink is wobbly but
 * honest, nothing of the struggle hidden.
 * Interactivity: regard steadies the novice's hand — the traced rune firms up toward completion.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-seeker",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const deskY = kit.h * 0.66;
    const cx = kit.cx;

    // plain flat desk
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(cx - kit.u(0.32), deskY, kit.u(0.64), kit.u(0.06));
    p.pop();

    // master's page (reference) on the left — the clean exemplar rune
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx - kit.u(0.28), deskY - kit.u(0.18), kit.u(0.16), kit.u(0.2), kit.u(0.006));
    p.pop();
    kit.fig.rune(kit, cx - kit.u(0.2), deskY - kit.u(0.07), 0.09, 1, kit.palette.accent);

    // novice's own page (right) — the wobbly copy, with a crossed-out error
    p.push();
    p.noStroke();
    p.fill(kit.palette.ground);
    p.rect(cx + kit.u(0.04), deskY - kit.u(0.18), kit.u(0.16), kit.u(0.2), kit.u(0.006));
    p.pop();

    // how steady the hand is — honesty is flat/steady, so a slow constant wobble; regard firms it
    let steady = 0.45 + 0.15 * Math.sin(kit.t * 0.8);
    if (kit.pointer.inside) {
      const d = Math.hypot(kit.pointer.x * kit.w - (cx + kit.u(0.12)), kit.pointer.y * kit.h - (deskY - kit.u(0.07)));
      steady = Math.min(1, steady + Math.max(0, 1 - d / kit.u(0.2)) * 0.5);
    }
    // wobble offset on the in-progress rune
    const wob = kit.u(0.004) * (1 - steady) * Math.sin(kit.t * 4.0);
    kit.fig.rune(kit, cx + kit.u(0.12) + wob, deskY - kit.u(0.07), 0.09, steady, kit.palette.accent);

    // an error openly crossed out above the copy — honest, unhidden
    p.push();
    kit.register.stroke(kit, 0.004, kit.palette.ink);
    p.line(cx + kit.u(0.06), deskY - kit.u(0.15), cx + kit.u(0.16), deskY - kit.u(0.13));
    p.line(cx + kit.u(0.06), deskY - kit.u(0.13), cx + kit.u(0.16), deskY - kit.u(0.15));
    p.pop();

    // the young novice, bowed over the work, hand to the page
    kit.fig.figure(kit, cx + kit.u(0.02), kit.h * 0.95, 0.3, -0.25, kit.palette.ink);
    p.push();
    kit.register.stroke(kit, 0.011, kit.palette.ink);
    p.line(cx, kit.h * 0.95 - kit.u(0.22), cx + kit.u(0.12), deskY - kit.u(0.06));
    p.pop();

    kit.light.vignette(kit);
  },
});
