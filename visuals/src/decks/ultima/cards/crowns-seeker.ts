/**
 * Seeker of Crowns — station Valor, 11 (the newcomer studying how a realm is held).
 * Composition: a student figure observing the emblem — a young apprentice in plain clothes studies a
 * council in session from a doorway, a borrowed circlet turning nervously in their hands, sketching
 * the seating of power. Interactivity: the pointer steadies the nervous circlet; bright charged
 * frontal light, the youth poised at the edge of a daunting world.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-seeker",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // valor: hard frontal charge, the held tension, air faintly electric

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const charge = kit.light.pulse(kit.t);

    // the council chamber, seen through a doorway (right side, brightly lit)
    const doorX = w * 0.62;
    p.push();
    // doorway opening
    p.noStroke();
    kit.register.glow(kit, w * 0.78, kit.h * 0.46, 0.2, kit.palette.accent, 0.18 + 0.12 * charge);
    p.fill(kit.palette.ground);
    p.rect(doorX, kit.h * 0.18, w - doorX - kit.u(0.08), kit.h * 0.66, kit.u(0.006));
    // doorframe
    p.noFill();
    kit.register.stroke(kit, 0.004, kit.palette.shade);
    p.rect(doorX, kit.h * 0.18, w - doorX - kit.u(0.08), kit.h * 0.66, kit.u(0.006));
    p.pop();

    // the council in session — a ring of seated silhouettes around a table
    const ccx = w * 0.81, ccy = kit.h * 0.5;
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.ellipse(ccx, ccy + kit.u(0.05), kit.u(0.16), kit.u(0.06)); // table
    p.pop();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const fx = ccx + Math.cos(a) * kit.u(0.1);
      const fy = ccy + Math.sin(a) * kit.u(0.045);
      kit.fig.figure(kit, fx, fy + kit.u(0.05), 0.1, 0, kit.palette.shade);
    }
    // a crown at the head of the council table — the seat of power studied
    kit.register.glow(kit, ccx, ccy - kit.u(0.08), 0.04, kit.palette.accent, 0.4 + 0.3 * charge);
    kit.fig.crown(kit, ccx, ccy - kit.u(0.06), 0.06, kit.palette.accent);

    // the apprentice at the threshold (left), poised, watching
    const appX = w * 0.28;
    const appFeet = kit.h * 0.8;
    kit.fig.figure(kit, appX, appFeet, 0.3, 0.08, kit.palette.shade);

    // the borrowed circlet turning nervously in their hands — pointer steadies it
    const handX = appX + kit.u(0.04);
    const handY = appFeet - kit.u(0.18);
    const jitter = kit.pointer.inside
      ? 0.2 * Math.sin(kit.t * 3)
      : 0.6 * Math.sin(kit.t * 4);
    p.push();
    p.translate(handX, handY);
    p.rotate(jitter * 0.4);
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.ellipse(0, 0, kit.u(0.07), kit.u(0.03));
    p.pop();
    kit.register.glow(kit, handX, handY, 0.04, kit.palette.accent, 0.3);

    kit.light.vignette(kit);
  },
});
