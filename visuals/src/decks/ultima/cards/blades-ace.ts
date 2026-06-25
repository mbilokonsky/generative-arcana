/**
 * Ace of Blades — station Justice, number 1 (identity, the seed).
 * A single sword driven point-up into bare stone, lit evenly from both sides
 * (Justice's two balanced sources) — the first righteous cut held in poised judgment.
 * Interactivity: the cursor's horizontal position tips the balance of the two lights,
 * but the blade holds its level — force answerable to a scale that wants to stay even.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "blades-ace",

  draw(kit) {
    const { p, w, h } = kit;
    const mn = Math.min(w, h);
    kit.light.wash(kit);

    const cx = kit.cx;
    const groundY = h * 0.74;
    const bladeBaseY = groundY - kit.u(0.01);

    // bare stone the sword is driven into — a low hatched plinth
    kit.register.shade(kit, 0, groundY, w / mn, (h - groundY) / mn, 0.45);
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(cx - kit.u(0.16), groundY + kit.u(0.02));
    p.vertex(cx - kit.u(0.1), groundY - kit.u(0.03));
    p.vertex(cx + kit.u(0.1), groundY - kit.u(0.03));
    p.vertex(cx + kit.u(0.16), groundY + kit.u(0.02));
    p.endShape(p.CLOSE);
    p.pop();

    // the two balanced sources — a slow even sway, tilted by the pointer
    const tip = kit.pointer.inside ? (kit.pointer.x - 0.5) * 0.8 : 0;
    const breath = Math.sin(kit.t * 0.5) * 0.06;
    const leftStr = 0.5 + breath - tip * 0.5;
    const rightStr = 0.5 - breath + tip * 0.5;
    kit.register.glow(kit, cx - kit.u(0.22), h * 0.34, 0.3, kit.palette.light, 0.35 * leftStr);
    kit.register.glow(kit, cx + kit.u(0.22), h * 0.34, 0.3, kit.palette.light, 0.35 * rightStr);

    // the single emergent sword — central, clean, much void around it (identity)
    kit.fig.sword(kit, cx, bladeBaseY, 0.46, 0, kit.palette.ink);

    // a hard cold glint riding up the edge, restating the clean new blade
    p.push();
    p.stroke(kit.palette.light);
    p.strokeWeight(kit.u(0.005));
    const gl = kit.loop(5);
    const gy = bladeBaseY - kit.u(0.04) - gl * kit.u(0.34);
    p.line(cx - kit.u(0.018), gy, cx - kit.u(0.018), gy - kit.u(0.05));
    p.pop();

    kit.light.vignette(kit);
  },

  onPointer(kit) {
    if (kit.pointer.pressed) kit.signal("verdict");
  },
});
