/**
 * Three of Crowns — station Valor, prime 3 (governance first takes built form).
 * Composition: three forming a first structure — three masons raise the first gold-capped towers
 * of a new town against a charged bright sky, scaffolding stark and frontal, a banner planted.
 * Interactivity: bringing the pointer up lifts the topmost course of stone a touch higher —
 * the nerve to commit to a thing that does not yet exist.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-three",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // valor: hard frontal charge, the held tension before a storm

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const groundY = kit.h * 0.8;
    const charge = kit.light.pulse(kit.t); // electric air before the storm

    // fresh-turned earth line
    p.push();
    p.stroke(kit.palette.shade);
    p.strokeWeight(kit.u(0.004));
    p.line(kit.u(0.08), groundY, w - kit.u(0.08), groundY);
    p.pop();

    // an extra lift on the topmost course when the pointer rises
    const lift = kit.pointer.inside ? Math.max(0, 0.5 - kit.pointer.y) * kit.u(0.06) : 0;

    // three rising towers, gold-capped, at different heights (freshly begun)
    const cols: Array<[number, number]> = [
      [w * 0.3, 0.26], [w * 0.5, 0.34], [w * 0.7, 0.22],
    ];
    cols.forEach(([x, hU], i) => {
      const th = kit.u(hU) + (i === 1 ? lift : 0);
      const tw = kit.u(0.1);
      // scaffolding — stark frontal lines flanking the tower
      p.push();
      p.stroke(kit.palette.shade);
      p.strokeWeight(kit.u(0.0035));
      p.line(x - tw * 0.75, groundY, x - tw * 0.75, groundY - th - kit.u(0.02));
      p.line(x + tw * 0.75, groundY, x + tw * 0.75, groundY - th - kit.u(0.02));
      for (let r = 1; r < 4; r++) {
        const yy = groundY - (th / 4) * r;
        p.line(x - tw * 0.75, yy, x + tw * 0.75, yy);
      }
      p.pop();
      // the masonry block
      kit.fig.tower(kit, x, groundY, 0.1, hU + (i === 1 ? lift / kit.u(1) : 0), kit.palette.shade);
      // gold cap glints with the charge
      const capY = groundY - th - kit.u(0.02);
      kit.register.glow(kit, x, capY, 0.05, kit.palette.accent, 0.4 + 0.4 * charge);
      kit.fig.crown(kit, x, capY, 0.07, kit.palette.accent);
    });

    // three masons — gestural silhouettes at the work
    kit.fig.figure(kit, w * 0.22, groundY + kit.u(0.005), 0.14, 0.6, kit.palette.shade);
    kit.fig.figure(kit, w * 0.5, groundY + kit.u(0.005), 0.14, -0.4, kit.palette.shade);
    kit.fig.figure(kit, w * 0.78, groundY + kit.u(0.005), 0.14, 0.5, kit.palette.shade);

    // a banner planted in the fresh earth, snapping in the charged air
    const bx = w * 0.86;
    const flutter = Math.sin(kit.t * 1.6) * kit.u(0.01);
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.004));
    p.line(bx, groundY, bx, groundY - kit.u(0.16));
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.beginShape();
    p.vertex(bx, groundY - kit.u(0.16));
    p.vertex(bx + kit.u(0.08) + flutter, groundY - kit.u(0.14));
    p.vertex(bx + kit.u(0.06) + flutter, groundY - kit.u(0.115));
    p.vertex(bx, groundY - kit.u(0.1));
    p.endShape(p.CLOSE);
    p.pop();

    kit.light.vignette(kit);
  },
});
