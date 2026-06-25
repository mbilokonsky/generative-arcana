/**
 * The Lord of Britannia (Major 5) — station Honor, number 5 (irreducible center).
 * A crowned king enthroned beneath a raised standard, scepter upright, the composition
 * formal and columnar and lit from straight above; courtiers at ceremonial distance, the
 * whole scene grave with the gravity of office. The light is honor's: vertical, cold, held.
 * Interactivity (a reading of the card): the pointer near the throne steadies and raises the
 * standard to its full height and the scepter's finial gleams — office answered with bearing.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { raise: number; gleam: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { raise: 0, gleam: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-5",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // honor: a columnar vertical light, held and a little cold

    const hold = kit.light.pulse(kit.t); // the steady ceremonial rise
    const throneX = kit.cx;
    const seatY = kit.h * 0.66; // where the king's feet/hem rest

    // a near-throne pointer steadies & raises the standard
    const near = kit.pointer.inside &&
      Math.abs(kit.pointer.x * w - throneX) < kit.u(0.34) && kit.pointer.y > 0.18;
    s.raise += ((near ? 1 : 0.62) - s.raise) * 0.05;
    s.gleam += ((near ? 1 : 0) - s.gleam) * 0.07;

    // --- the columnar shaft of light from straight above, falling on the throne ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const shaftW = kit.u(0.42);
    const g = ctx.createLinearGradient(0, kit.h * 0.1, 0, kit.h);
    const a = 0.1 + 0.06 * hold;
    g.addColorStop(0, `rgba(255,243,214,${a})`);
    g.addColorStop(0.6, `rgba(216,204,168,${a * 0.6})`);
    g.addColorStop(1, "rgba(216,204,168,0)");
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(throneX - shaftW * 0.32, kit.h * 0.1);
    ctx.lineTo(throneX + shaftW * 0.32, kit.h * 0.1);
    ctx.lineTo(throneX + shaftW * 0.5, kit.h);
    ctx.lineTo(throneX - shaftW * 0.5, kit.h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    p.pop();

    // --- the dais: stacked stone steps, columnar and grave ---
    p.push();
    p.noStroke();
    for (let i = 0; i < 3; i++) {
      const dw = kit.u(0.5) - i * kit.u(0.08);
      const dy = kit.h * 0.86 - i * kit.u(0.045);
      kit.register.fill(kit, i % 2 === 0 ? kit.palette.shade : kit.palette.ground);
      p.rect(throneX - dw / 2, dy, dw, kit.u(0.05));
    }
    p.pop();

    // --- the tall vertical standard/banner behind, with an ankh sigil ---
    const poleTop = kit.h * (0.34 - 0.12 * s.raise);
    const poleX = throneX;
    const banTop = poleTop + kit.u(0.02);
    const banH = kit.u(0.24);
    const banW = kit.u(0.16);
    // pole
    p.push();
    kit.register.stroke(kit, 0.01, kit.palette.accent);
    p.line(poleX, poleTop - kit.u(0.02), poleX, seatY - kit.u(0.02));
    // finial orb atop the pole
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.circle(poleX, poleTop - kit.u(0.02), kit.u(0.022));
    p.pop();
    // hanging banner cloth (held, only the faintest ceremonial sway)
    const sway = Math.sin(kit.t * 0.5) * kit.u(0.006) * (0.4 + 0.6 * (1 - s.raise));
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.ground);
    p.beginShape();
    p.vertex(poleX - banW / 2, banTop);
    p.vertex(poleX + banW / 2, banTop);
    p.vertex(poleX + banW / 2 + sway, banTop + banH);
    p.vertex(poleX, banTop + banH + kit.u(0.03)); // notched swallowtail
    p.vertex(poleX - banW / 2 + sway, banTop + banH);
    p.endShape(p.CLOSE);
    kit.register.outline(kit, [
      [poleX - banW / 2, banTop], [poleX + banW / 2, banTop],
      [poleX + banW / 2 + sway, banTop + banH], [poleX, banTop + banH + kit.u(0.03)],
      [poleX - banW / 2 + sway, banTop + banH],
    ], true);
    p.pop();
    // the ankh sigil on the banner
    kit.fig.ankh(kit, poleX, banTop + banH * 0.52, 0.14, kit.palette.accent);

    // --- the bespoke throne: a high columnar back flanking the king ---
    const backW = kit.u(0.3);
    const backTop = kit.h * 0.4;
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.shade);
    // two side columns
    p.rect(throneX - backW / 2 - kit.u(0.02), backTop, kit.u(0.05), seatY - backTop + kit.u(0.04));
    p.rect(throneX + backW / 2 - kit.u(0.03), backTop, kit.u(0.05), seatY - backTop + kit.u(0.04));
    // column finials
    kit.register.fill(kit, kit.palette.accent);
    p.circle(throneX - backW / 2 + kit.u(0.005), backTop, kit.u(0.03));
    p.circle(throneX + backW / 2 - kit.u(0.005), backTop, kit.u(0.03));
    // low seat block
    kit.register.fill(kit, kit.palette.ground);
    p.rect(throneX - backW / 2, seatY - kit.u(0.02), backW, kit.u(0.06));
    p.pop();

    // --- the seated king silhouette: a figure foreshortened to read as seated ---
    // (draw the figure, then mask its lower legs with the seat block & a lap rectangle)
    kit.fig.figure(kit, throneX, seatY + kit.u(0.05), 0.27, 0, "#2c3a6e"); // burnished royal blue
    // lap / knees block to seat him
    p.push();
    p.noStroke();
    p.fill("#243056");
    p.rect(throneX - kit.u(0.12), seatY - kit.u(0.02), kit.u(0.24), kit.u(0.05), kit.u(0.01));
    p.pop();

    // crown above his head
    const headY = seatY + kit.u(0.05) - kit.u(0.27) + kit.u(0.015);
    kit.fig.crown(kit, throneX, headY - kit.u(0.022), 0.1, kit.palette.accent);

    // --- the upright scepter, held to the king's right, finial gleaming ---
    const scepX = throneX + kit.u(0.11);
    const scepTop = seatY - kit.u(0.2);
    const scepBot = seatY + kit.u(0.02);
    p.push();
    kit.register.stroke(kit, 0.008, kit.palette.accent);
    p.line(scepX, scepTop, scepX, scepBot);
    p.pop();
    const finR = kit.u(0.018);
    kit.register.glow(kit, scepX, scepTop, 0.04 + 0.05 * s.gleam, kit.palette.light,
      0.4 + 0.5 * s.gleam + 0.15 * hold);
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.circle(scepX, scepTop, finR * 2);
    p.pop();
    // gleam flash on the finial when honored
    if (s.gleam > 0.05) {
      const fctx = p.drawingContext as CanvasRenderingContext2D;
      fctx.save();
      fctx.globalCompositeOperation = "lighter";
      fctx.fillStyle = `rgba(255,243,214,${0.5 * s.gleam})`;
      fctx.beginPath();
      fctx.arc(scepX, scepTop, finR * (1.2 + 0.6 * Math.sin(kit.t * 2)), 0, Math.PI * 2);
      fctx.fill();
      fctx.restore();
    }

    // --- courtiers flanking at ceremonial distance, small and grave ---
    const courtY = kit.h * 0.84;
    for (const cxp of [w * 0.16, w * 0.84]) {
      kit.fig.figure(kit, cxp, courtY, 0.18, 0, kit.palette.shade);
    }
    for (const cxp of [w * 0.27, w * 0.73]) {
      kit.fig.figure(kit, cxp, courtY + kit.u(0.01), 0.155, 0, kit.palette.shade);
    }

    if (near && kit.pointer.pressed) kit.signal("standard", { slug: "major-5" });

    kit.light.vignette(kit);
  },
});
