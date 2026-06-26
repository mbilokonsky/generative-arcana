/**
 * Six of Crowns — station Honor, composite 6 = 2×3 (reciprocal exchange, two triads in accord).
 * Composition: six in a flowing ring — a crowned figure distributes coins from a balanced platform
 * to townsfolk who return baskets of grain, the exchange flowing both ways under formal vertical light.
 * Interactivity: the pointer sets the ring's pace; give and return always remain in equilibrium.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-six",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // honor: formal vertical columnar light, burnished, ceremonial

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const cx = kit.cx;
    const cy = kit.h * 0.5;
    const ringR = kit.u(0.26);

    // raised formal banners flanking — vertical, ceremonial
    [-1, 1].forEach((s) => {
      const bx = cx + s * kit.u(0.34);
      p.push();
      p.stroke(kit.palette.accent);
      p.strokeWeight(kit.u(0.004));
      p.line(bx, kit.h * 0.2, bx, kit.h * 0.82);
      p.noStroke();
      kit.register.fill(kit, kit.palette.accent);
      p.beginShape();
      p.vertex(bx, kit.h * 0.24);
      p.vertex(bx + s * kit.u(0.05), kit.h * 0.26);
      p.vertex(bx + s * kit.u(0.05), kit.h * 0.34);
      p.vertex(bx, kit.h * 0.36);
      p.endShape(p.CLOSE);
      p.pop();
    });

    // central balanced platform with the crowned figure
    const platY = cy + kit.u(0.06);
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(cx - kit.u(0.08), platY, kit.u(0.16), kit.u(0.03), kit.u(0.004));
    p.pop();
    kit.fig.figure(kit, cx, platY, 0.2, 0, kit.palette.shade);
    kit.fig.crown(kit, cx, cy - kit.u(0.13), 0.07, kit.palette.accent);

    // pace of the reciprocal ring set by the pointer
    const speed = kit.pointer.inside ? 0.3 + kit.pointer.y * 0.5 : 0.35;
    const phase = kit.t * speed;

    // six townsfolk in a flowing ring around the platform
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const fx = cx + Math.cos(a) * ringR;
      const fy = cy + Math.sin(a) * ringR * 0.7 + kit.u(0.08);
      const scale = 0.13 + 0.02 * Math.sin(a);
      kit.fig.figure(kit, fx, fy, scale, 0, kit.palette.shade);
    }

    // coins flowing OUT from center, grain-baskets flowing IN — give and return
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const tx = cx + Math.cos(a) * ringR;
      const ty = cy + Math.sin(a) * ringR * 0.7 + kit.u(0.05);
      // coin going out
      const out = (phase + i / 6) % 1;
      const ox = cx + (tx - cx) * out;
      const oy = (cy + kit.u(0.02)) + (ty - (cy + kit.u(0.02))) * out;
      kit.register.glow(kit, ox, oy, 0.018, kit.palette.accent, 0.6 * (1 - Math.abs(out - 0.5)));
      p.push();
      p.noStroke();
      kit.register.fill(kit, kit.palette.accent);
      p.circle(ox, oy, kit.u(0.016));
      // grain coming back (offset half-phase, opposite direction)
      const inn = (phase + i / 6 + 0.5) % 1;
      const ix = tx + (cx - tx) * inn;
      const iy = ty + ((cy + kit.u(0.02)) - ty) * inn;
      kit.register.fill(kit, kit.palette.shade);
      p.circle(ix, iy, kit.u(0.018));
      p.pop();
    }

    kit.light.vignette(kit);
  },
});
