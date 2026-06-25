/**
 * Paragon of Blades — station Honesty, a commanding figure, the blade mastered and raised.
 * A master swordbearer stands in full clear merciless noon light atop a bare rise, blade held
 * level and unhidden, every scar and line of the weapon plainly visible. The woodcut is crisp
 * and total, nothing in shadow — force at its most honest and complete.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-paragon",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    // flat even merciless noon — does not flicker, nothing occluded (honesty)
    kit.register.glow(kit, kit.cx, h * 0.34, 0.62, kit.palette.light, 0.18);

    // bare rise — a low broad crest the figure stands atop, fully lit
    const riseY = h * 0.72;
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, h);
    p.vertex(0, riseY + kit.u(0.04));
    p.bezierVertex(w * 0.3, riseY - kit.u(0.04), w * 0.7, riseY - kit.u(0.04), w, riseY + kit.u(0.04));
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();
    kit.register.shade(kit, 0, riseY + kit.u(0.02), w / mn, (h - riseY) / mn, 0.3);

    // the master swordbearer — standing square, commanding, fully visible
    const cx = kit.cx;
    const feet = riseY;
    kit.fig.figure(kit, cx, feet, 0.34, 0, kit.palette.ink);

    // the blade held level and unhidden, raised before them — horizontal, total
    const lift = Math.sin(kit.t * 0.5) * kit.u(0.004); // a slow steady held breath
    const bladeY = feet - kit.u(0.24) + lift;
    kit.fig.sword(kit, cx + kit.u(0.22), bladeY, 0.44, Math.PI / 2, kit.palette.ink);

    // a clean cold glint travelling the whole edge — every line plainly shown
    p.push();
    const gl = kit.loop(4);
    const glc = p.color(kit.palette.light);
    glc.setAlpha(220);
    p.stroke(glc);
    p.strokeWeight(kit.u(0.005));
    const gx = cx + kit.u(0.22) - kit.u(0.2) + gl * kit.u(0.4);
    p.line(gx, bladeY - kit.u(0.018), gx, bladeY + kit.u(0.018));
    p.pop();

    kit.light.vignette(kit);
  },
});
