/**
 * Knight of Blades — station Spirituality, a figure charging in motion, blade raised (diagonal).
 * An armored knight charges across an open moor on a hard diagonal, sword raised,
 * beneath a diffuse sourceless radiant sky that seems to bless the motion.
 * The woodcut lines streak with speed, the figure aglow at the edges — force and faith fused.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-knight",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const drift = kit.light.pulse(kit.t); // spirituality's sourceless drift

    // diffuse radiant sky — sourceless, weightless, haloing the charge from everywhere
    kit.register.glow(kit, w * 0.5, h * 0.34, 0.6, kit.palette.light, 0.2 + 0.06 * drift);
    kit.register.glow(kit, w * 0.4 + Math.sin(kit.t * 0.5) * kit.u(0.12), h * 0.3, 0.3, kit.palette.light, 0.14);

    // open moor — low ground band
    const groundY = h * 0.74;
    kit.register.shade(kit, 0, groundY, w / mn, (h - groundY) / mn, 0.36);

    // a slight gallop-bob, seam-free
    const bob = Math.sin(kit.loop(0.9) * Math.PI * 2) * kit.u(0.012);
    const cx = kit.cx;
    const cy = h * 0.52 + bob;

    // speed streaks trailing behind the charge (motion to the left)
    p.push();
    for (let i = 0; i < 6; i++) {
      const ph = kit.loop(0.7, i * 0.16);
      const sy = cy - kit.u(0.16) + i * kit.u(0.07);
      const sc = p.color(kit.palette.shade);
      sc.setAlpha(120 * (1 - ph));
      p.stroke(sc);
      p.strokeWeight(kit.u(0.004));
      const x0 = cx + kit.u(0.06) - ph * kit.u(0.2);
      p.line(x0, sy, x0 - kit.u(0.16), sy);
    }
    p.pop();

    // the steed — a low charging mass on a hard diagonal
    p.push();
    p.translate(cx, cy);
    p.rotate(-0.12);
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(-kit.u(0.2), kit.u(0.02));
    p.vertex(-kit.u(0.12), -kit.u(0.06));
    p.vertex(kit.u(0.16), -kit.u(0.05));
    p.vertex(kit.u(0.24), kit.u(0.0));
    p.vertex(kit.u(0.2), kit.u(0.06));
    p.vertex(-kit.u(0.18), kit.u(0.08));
    p.endShape(p.CLOSE);
    // legs mid-gallop
    p.stroke(kit.palette.shade);
    p.strokeWeight(kit.u(0.012));
    const leg = Math.sin(kit.loop(0.45) * Math.PI * 2) * kit.u(0.04);
    p.line(-kit.u(0.1), kit.u(0.06), -kit.u(0.14) + leg, kit.u(0.2));
    p.line(kit.u(0.12), kit.u(0.06), kit.u(0.16) - leg, kit.u(0.2));
    p.pop();

    // the knight astride, edges aglow — sword raised high on the diagonal
    kit.fig.figure(kit, cx + kit.u(0.04), cy - kit.u(0.02), 0.26, -0.5, kit.palette.ink);
    kit.register.glow(kit, cx + kit.u(0.04), cy - kit.u(0.16), 0.1, kit.palette.light, 0.3);
    kit.fig.sword(kit, cx + kit.u(0.16), cy - kit.u(0.18), 0.3, 0.5, kit.palette.ink);

    kit.light.vignette(kit);
  },
});
