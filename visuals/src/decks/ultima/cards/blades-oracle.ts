/**
 * Oracle of Blades — station Humility, a still seated veteran, the blade long at rest.
 * A scarred elder sits sword across knees at the mouth of a cave in low earthbound dusk-light,
 * gazing out over a quiet valley, the weapon clearly long undrawn. The stark lines soften;
 * the figure is small and grounded, holding a stillness paid for in blood.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-oracle",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    // low earthbound dusk — settles downward, small under a wide sky (humility)
    kit.register.glow(kit, kit.cx, h * 0.82, 0.5, kit.palette.light, 0.16);

    // the cave mouth — a dark arched mass framing the seated elder from behind
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(kit.cx - kit.u(0.34), h * 0.86);
    p.vertex(kit.cx - kit.u(0.34), h * 0.34);
    p.bezierVertex(
      kit.cx - kit.u(0.2), h * 0.18,
      kit.cx + kit.u(0.2), h * 0.18,
      kit.cx + kit.u(0.34), h * 0.34,
    );
    p.vertex(kit.cx + kit.u(0.34), h * 0.86);
    p.endShape(p.CLOSE);
    p.pop();

    // quiet valley beyond, glimpsed past the elder — a faint distant horizon band
    const valleyY = h * 0.58;
    p.push();
    const vc = p.color(kit.palette.shade);
    vc.setAlpha(120);
    p.stroke(vc);
    p.strokeWeight(kit.u(0.003));
    for (let i = 0; i < 4; i++) {
      p.line(kit.cx - kit.u(0.28), valleyY + i * kit.u(0.03), kit.cx + kit.u(0.28), valleyY + i * kit.u(0.03));
    }
    p.pop();

    // the seated veteran — a grounded mass, very slow contemplative breath
    const breath = Math.sin(kit.t * 0.4) * kit.u(0.004);
    const sx = kit.cx;
    const sy = h * 0.78 + breath;
    p.push();
    p.translate(sx, sy);
    p.noStroke();
    p.fill(kit.palette.shade);
    // seated body — broad, low, settled
    p.beginShape();
    p.vertex(-kit.u(0.13), 0);
    p.vertex(-kit.u(0.1), -kit.u(0.2));
    p.vertex(kit.u(0.1), -kit.u(0.2));
    p.vertex(kit.u(0.13), 0);
    p.endShape(p.CLOSE);
    // bowed/gazing head
    p.fill(kit.palette.ink);
    p.circle(0, -kit.u(0.25), kit.u(0.09));
    p.pop();

    // the blade laid flat across the knees, long undrawn (horizontal, at rest)
    kit.fig.sword(kit, sx + kit.u(0.18), sy - kit.u(0.07), 0.34, Math.PI / 2, kit.palette.ink);

    kit.light.vignette(kit);
  },
});
