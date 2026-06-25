/**
 * Six of Blades — station Honesty, composite 6 (two triads in a flowing crossing-away).
 * A small party poles a barge of six upright swords across calm water toward a far shore,
 * in flat clear merciless noon light, the battlefield receding plainly behind. Nothing hidden.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-six",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const waterY = h * 0.62;

    // flat clear noon: even bright wash, no occluding shadow (honesty does not flicker)
    kit.register.glow(kit, kit.cx, h * 0.32, 0.6, kit.palette.light, 0.18);

    // calm water — the lower band, faintly hatched, with a slow honest shimmer
    p.push();
    p.stroke(kit.palette.shade);
    p.strokeWeight(kit.u(0.003));
    for (let i = 0; i < 7; i++) {
      const ly = waterY + kit.u(0.03) + i * kit.u(0.045);
      const off = Math.sin(kit.t * 0.6 + i) * kit.u(0.01);
      p.line(0, ly + off, w, ly - off);
    }
    p.pop();

    // far shore receding plainly behind — a thin low band near the horizon
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(0, waterY - kit.u(0.02), w, kit.u(0.02));
    p.pop();

    // the barge drifting across — slow seam-free progress
    const prog = kit.loop(16);
    const bx = kit.cx + (prog - 0.5) * kit.u(0.18);
    const bob = Math.sin(kit.t * 0.8) * kit.u(0.006);
    const deckY = waterY + kit.u(0.04) + bob;

    // hull
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(bx - kit.u(0.2), deckY);
    p.vertex(bx + kit.u(0.2), deckY);
    p.vertex(bx + kit.u(0.15), deckY + kit.u(0.04));
    p.vertex(bx - kit.u(0.15), deckY + kit.u(0.04));
    p.endShape(p.CLOSE);
    p.pop();

    // six upright swords stood in the barge — blades carried but lowered, calm
    const sx = [-0.14, -0.085, -0.03, 0.025, 0.08, 0.135];
    sx.forEach((dx) => {
      kit.fig.sword(kit, bx + kit.u(dx), deckY, 0.18, 0, kit.palette.ink);
    });

    // the poler — a standing figure with a long pole
    kit.fig.figure(kit, bx + kit.u(0.16), deckY, 0.22, -0.1, kit.palette.shade);
    p.push();
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.006));
    p.line(bx + kit.u(0.18), deckY - kit.u(0.2), bx + kit.u(0.24), deckY + kit.u(0.06));
    p.pop();

    kit.light.vignette(kit);
  },
});
