/**
 * Eight of Crowns — station Humility, composite 8 = 2³ (a built sequence, mastered governance).
 * Composition: eight in disciplined array — an aging steward moves quietly through a vast hall where
 * eight clerks manage the realm's ledgers in smooth order, the crown set aside on a low desk.
 * Interactivity: the desk nearest the pointer turns a ledger-page; the machinery runs on regardless,
 * power grown humble through sheer competence.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-eight",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // humility: low, level, earthbound dusk settling downward

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    p.pop();

    // a vast hall: two receding rows of four desks (2³ = 4×2), disciplined array
    const rows = [
      { y: kit.h * 0.5, scale: 0.85 },
      { y: kit.h * 0.7, scale: 1.0 },
    ];
    let idx = 0;
    let nearDesk = -1;
    let nearD = Infinity;
    const desks: Array<{ x: number; y: number; s: number; i: number }> = [];
    rows.forEach((row) => {
      for (let c = 0; c < 4; c++) {
        const x = w * (0.2 + c * 0.2);
        const s = row.scale;
        desks.push({ x, y: row.y, s, i: idx });
        if (kit.pointer.inside) {
          const d = Math.hypot(kit.pointer.x * w - x, kit.pointer.y * h - row.y);
          if (d < nearD) { nearD = d; nearDesk = idx; }
        }
        idx++;
      }
    });

    // draw desks back-to-front for depth
    desks.forEach((d) => {
      const dw = kit.u(0.1 * d.s);
      const dh = kit.u(0.03 * d.s);
      // clerk
      kit.fig.figure(kit, d.x, d.y - dh, 0.12 * d.s, 0, kit.palette.shade);
      // desk
      p.push();
      p.noStroke();
      kit.register.fill(kit, kit.palette.shade);
      p.rect(d.x - dw / 2, d.y, dw, dh, kit.u(0.003));
      // ledger page on the desk, turning when near the pointer
      const turn = d.i === nearDesk && kit.pointer.inside ? 0.6 : 0;
      const flick = (Math.sin(kit.t * 0.5 + d.i) * 0.5 + 0.5) * 0.15 + turn;
      p.fill(kit.palette.ground);
      p.rect(d.x - dw * 0.25, d.y - dh * 0.4, dw * (0.5 - flick * 0.3), dh * 0.7, kit.u(0.002));
      p.pop();
      // a faint, steady gold tally-mark — the running machinery
      kit.register.glow(kit, d.x, d.y - dh * 0.1, 0.02, kit.palette.accent, 0.2);
    });

    // the aging steward, small and unhurried, crossing the hall
    const walk = kit.loop(12);
    const sx = w * (0.12 + walk * 0.18);
    kit.fig.figure(kit, sx, kit.h * 0.84, 0.18, 0.1, kit.palette.shade);

    // the crown set ASIDE on a low desk — lightly worn, almost forgotten
    const deskX = w * 0.85;
    const deskY = kit.h * 0.82;
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    p.rect(deskX - kit.u(0.06), deskY, kit.u(0.12), kit.u(0.025), kit.u(0.003));
    p.pop();
    kit.register.glow(kit, deskX, deskY - kit.u(0.01), 0.05, kit.palette.accent, 0.3);
    kit.fig.crown(kit, deskX, deskY - kit.u(0.005), 0.08, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
