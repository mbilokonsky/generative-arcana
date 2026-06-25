/**
 * Oracle of Crowns — station Sacrifice, 13 (governance ripened into quiet, sacrificial knowing).
 * Composition: a still, seated figure with the emblem as inner vision — a silver-haired regent sits
 * alone in an ember-lit council chamber after everyone has gone, reading the realm's troubles in a
 * spread of maps and ledgers, a face spent with long giving. Interactivity: lingering near the spread
 * kindles one more trouble into clarity; the warm light depletes a little more for the seeing.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-oracle",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // sacrifice: reddened ember pulse, depleting and rekindling

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    const ember = kit.light.pulse(kit.t);
    const cx = kit.cx;

    // empty council chairs behind, everyone gone — faint, vacated
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.0025, kit.palette.shade);
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i - 1.5) * 0.5;
      const chx = cx + Math.cos(a) * kit.u(0.26);
      const chy = kit.h * 0.4 + Math.sin(a) * kit.u(0.08);
      p.rect(chx - kit.u(0.02), chy - kit.u(0.05), kit.u(0.04), kit.u(0.06), kit.u(0.003));
    }
    p.pop();

    // the long council table with a spread of maps and ledgers
    const tableY = kit.h * 0.66;
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(cx - kit.u(0.22), tableY, kit.u(0.44), kit.u(0.05), kit.u(0.005));
    p.pop();

    // the spread — overlapping parchments, each a trouble of the realm
    const near = kit.pointer.inside && kit.pointer.y > 0.5;
    for (let i = 0; i < 5; i++) {
      const px = cx - kit.u(0.18) + i * kit.u(0.09);
      const py = tableY - kit.u(0.015);
      const lit = i === Math.floor((kit.t * 0.3) % 5) || (near && i === Math.floor(kit.pointer.x * 5));
      p.push();
      p.translate(px, py);
      p.rotate((kit.rng() - 0.5) * 0.3);
      p.noStroke();
      p.fill(kit.palette.ground);
      p.rect(-kit.u(0.04), -kit.u(0.03), kit.u(0.08), kit.u(0.06), kit.u(0.003));
      // ledger lines
      p.stroke(kit.palette.ink);
      p.strokeWeight(kit.u(0.0018));
      for (let l = 0; l < 3; l++) p.line(-kit.u(0.03), -kit.u(0.015) + l * kit.u(0.012), kit.u(0.03), -kit.u(0.015) + l * kit.u(0.012));
      p.pop();
      if (lit) kit.register.glow(kit, px, py, 0.04, kit.palette.accent, 0.4 + 0.3 * ember);
    }

    // the seated regent, still, head slightly bowed over the spread
    kit.fig.figure(kit, cx, kit.h * 0.62, 0.22, 0.12, kit.palette.shade);

    // the crown as INNER vision — a faint emblem haloed above the bowed head, seen not worn
    const visY = kit.h * 0.34;
    kit.register.glow(kit, cx, visY, 0.1, kit.palette.accent, 0.2 + 0.2 * ember);
    p.push();
    p.drawingContext.globalAlpha = 0.5 + 0.25 * ember;
    kit.fig.crown(kit, cx, visY, 0.09, kit.palette.accent);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    kit.light.vignette(kit);
  },
});
