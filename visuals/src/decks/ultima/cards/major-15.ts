/**
 * The Guardian (Major 15) — station Humility, INVERTED/false: the light is low, EARTHBOUND,
 * and FALSE-WARM, a seductive false benevolence; weight settling downward under a wide sky.
 * THE DECK'S ANTAGONIST. Number 15.
 * Scene: an immense red face fills a darkening sky above a kneeling crowd, its calm gaze almost
 * benevolent, glowing fetters running from its open hands to every bowed neck; the light is low
 * and earthbound and false-warm, one figure alone beginning to look up and see the chains.
 * Interactivity (a reading): the pointer on the upright figure spreads the looking-up — more
 * heads raise, and the chain to the freed neck glows and loosens. Domination, refused.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { wake: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { wake: 0 }; S.set(k, s); }
  return s;
};

// the crowd: positions along the base; index 3 is the one beginning to look up
const CROWD = 7;
const woken = (kit: SketchKit) => kit.cx; // focal upright figure sits at center

export default registerCard({
  slug: "major-15",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      const fx = woken(kit);
      const near = Math.abs(kit.pointer.x * kit.w - fx) < kit.u(0.16) && kit.pointer.y > 0.55;
      if (near) kit.signal("look-up", { slug: "major-15" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // humility inverted: low, earthbound, false-warm

    const settle = kit.light.pulse(kit.t);
    const crowdY = kit.h * 0.92;

    // pointer on the upright figure spreads the waking
    const fx = woken(kit);
    const near = kit.pointer.inside &&
      Math.abs(kit.pointer.x * w - fx) < kit.u(0.16) && kit.pointer.y > 0.55;
    s.wake += ((near ? 1 : 0) - s.wake) * 0.04;

    // --- a darkening sky, false-warm and low: red glow pooling at the horizon, dark above ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "rgba(20,6,10,0.0)");
    sky.addColorStop(0.5, `rgba(70,12,16,${0.18 + 0.05 * settle})`);
    sky.addColorStop(0.85, `rgba(150,40,30,${0.3 + 0.08 * settle})`);
    sky.addColorStop(1, `rgba(90,24,18,${0.4})`);
    ctx.save();
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    p.pop();

    // --- the IMMENSE red face filling the upper sky — iconic, mask-like, calm-benevolent ---
    const faceCX = kit.cx;
    const faceCY = kit.h * 0.34;
    const faceR = kit.u(0.46);
    // a deep red glow behind the visage — the false halo of benevolence
    p.push();
    const fctx = p.drawingContext as CanvasRenderingContext2D;
    const halo = fctx.createRadialGradient(faceCX, faceCY, 0, faceCX, faceCY, faceR * 1.5);
    halo.addColorStop(0, `rgba(210,70,50,${0.34 + 0.08 * settle})`);
    halo.addColorStop(0.6, "rgba(150,30,24,0.16)");
    halo.addColorStop(1, "rgba(80,16,14,0)");
    fctx.save();
    fctx.fillStyle = halo;
    fctx.fillRect(0, 0, w, h * 0.7);
    fctx.restore();
    p.pop();

    // the visage itself — a great red mask: brow, slit eyes, calm mouth. Gestural, ominous.
    p.push();
    p.noStroke();
    // face mass — a broad rounded triangle/oval suggesting a vast looming face
    p.fill("rgba(120,22,18,0.55)");
    p.beginShape();
    p.vertex(faceCX - faceR, faceCY - faceR * 0.7);
    p.bezierVertex(faceCX - faceR * 1.05, faceCY + faceR * 0.4, faceCX - faceR * 0.5, faceCY + faceR, faceCX, faceCY + faceR * 1.05);
    p.bezierVertex(faceCX + faceR * 0.5, faceCY + faceR, faceCX + faceR * 1.05, faceCY + faceR * 0.4, faceCX + faceR, faceCY - faceR * 0.7);
    p.bezierVertex(faceCX + faceR * 0.6, faceCY - faceR * 1.0, faceCX - faceR * 0.6, faceCY - faceR * 1.0, faceCX - faceR, faceCY - faceR * 0.7);
    p.endShape(p.CLOSE);

    // heavy calm brow — a single dark bar arched low over the eyes
    p.fill("rgba(50,8,8,0.6)");
    p.beginShape();
    p.vertex(faceCX - faceR * 0.62, faceCY - faceR * 0.16);
    p.bezierVertex(faceCX - faceR * 0.3, faceCY - faceR * 0.34, faceCX + faceR * 0.3, faceCY - faceR * 0.34, faceCX + faceR * 0.62, faceCY - faceR * 0.16);
    p.vertex(faceCX + faceR * 0.62, faceCY - faceR * 0.05);
    p.bezierVertex(faceCX + faceR * 0.3, faceCY - faceR * 0.2, faceCX - faceR * 0.3, faceCY - faceR * 0.2, faceCX - faceR * 0.62, faceCY - faceR * 0.05);
    p.endShape(p.CLOSE);
    p.pop();

    // eyes as glowing slits — calm, almost kind, which is the horror of it
    p.push();
    const ectx = p.drawingContext as CanvasRenderingContext2D;
    ectx.save();
    ectx.globalCompositeOperation = "lighter";
    p.noStroke();
    const eyeGlow = 0.6 + 0.25 * Math.sin(kit.t * 0.6) - 0.3 * s.wake; // dims as the crowd wakes
    for (const ex of [faceCX - faceR * 0.34, faceCX + faceR * 0.34]) {
      p.fill(`rgba(255,180,120,${Math.max(0.1, eyeGlow)})`);
      p.ellipse(ex, faceCY - faceR * 0.08, faceR * 0.3, faceR * 0.07);
      p.fill(`rgba(255,240,220,${Math.max(0.1, eyeGlow) * 0.8})`);
      p.ellipse(ex, faceCY - faceR * 0.08, faceR * 0.16, faceR * 0.035);
    }
    ectx.restore();
    p.pop();

    // a calm, faintly benevolent mouth — a soft level curve
    p.push();
    p.noFill();
    p.stroke("rgba(40,6,6,0.5)");
    p.strokeWeight(kit.u(0.01));
    p.beginShape();
    p.vertex(faceCX - faceR * 0.34, faceCY + faceR * 0.42);
    p.bezierVertex(faceCX - faceR * 0.12, faceCY + faceR * 0.5, faceCX + faceR * 0.12, faceCY + faceR * 0.5, faceCX + faceR * 0.34, faceCY + faceR * 0.42);
    p.endShape();
    p.pop();

    // --- the open hands of the visage, low at its sides, from which the fetters descend ---
    const handL = { x: faceCX - faceR * 0.78, y: faceCY + faceR * 0.85 };
    const handR = { x: faceCX + faceR * 0.78, y: faceCY + faceR * 0.85 };
    p.push();
    p.noStroke();
    p.fill("rgba(120,22,18,0.5)");
    for (const hnd of [handL, handR]) {
      p.ellipse(hnd.x, hnd.y, kit.u(0.07), kit.u(0.05));
    }
    p.pop();

    // --- the kneeling crowd, bowed, and the glowing red fetters to each neck ---
    const positions: number[] = [];
    for (let i = 0; i < CROWD; i++) {
      positions.push(kit.u(0.13) + (w - kit.u(0.26)) * (i / (CROWD - 1)));
    }
    const wokenIdx = 3; // the central figure

    // chains first (behind figures)
    p.push();
    const cctx = p.drawingContext as CanvasRenderingContext2D;
    cctx.save();
    cctx.globalCompositeOperation = "lighter";
    p.strokeCap(p.ROUND);
    for (let i = 0; i < CROWD; i++) {
      const neckX = positions[i];
      const neckY = crowdY - kit.u(0.13);
      const src = i < CROWD / 2 ? handL : handR;
      // this figure's individual "wake" — only the central one wakes by default; pointer spreads it
      const distFromCenter = Math.abs(i - wokenIdx);
      let lift = 0;
      if (i === wokenIdx) lift = 0.7 + 0.3 * s.wake;
      else lift = s.wake * Math.max(0, 1 - distFromCenter * 0.45);
      const slack = lift * kit.u(0.05); // a woken chain droops loose
      const glowA = (0.5 + 0.25 * Math.sin(kit.t * 0.8 + i)) * (1 - 0.7 * lift);
      // outer chain glow
      p.noFill();
      p.stroke(`rgba(230,80,50,${0.28 * glowA + 0.05})`);
      p.strokeWeight(kit.u(0.014));
      p.beginShape();
      p.vertex(src.x, src.y);
      p.bezierVertex(
        (src.x + neckX) / 2, (src.y + neckY) / 2 + kit.u(0.04) + slack,
        (src.x + neckX) / 2, (src.y + neckY) / 2 + kit.u(0.04) + slack,
        neckX, neckY
      );
      p.endShape();
      // chain core
      p.stroke(`rgba(255,170,120,${0.7 * glowA + 0.1})`);
      p.strokeWeight(kit.u(0.004));
      p.beginShape();
      p.vertex(src.x, src.y);
      p.bezierVertex(
        (src.x + neckX) / 2, (src.y + neckY) / 2 + kit.u(0.04) + slack,
        (src.x + neckX) / 2, (src.y + neckY) / 2 + kit.u(0.04) + slack,
        neckX, neckY
      );
      p.endShape();
    }
    cctx.restore();
    p.pop();

    // the figures
    for (let i = 0; i < CROWD; i++) {
      const distFromCenter = Math.abs(i - wokenIdx);
      let lift = 0;
      if (i === wokenIdx) lift = 0.7 + 0.3 * s.wake;
      else lift = s.wake * Math.max(0, 1 - distFromCenter * 0.45);
      // bowed = strong forward lean; woken = upright, head raised
      const lean = (1 - lift) * 0.9;
      const figH = i === wokenIdx ? 0.2 : 0.16;
      const col = i === wokenIdx ? kit.palette.ink : kit.palette.shade;
      kit.fig.figure(kit, positions[i], crowdY, figH, lean, col);
    }

    // a faint upward gleam on the central woken figure — the dawn of seeing
    if (s.wake > -1) {
      const wx = positions[wokenIdx];
      const gctx = p.drawingContext as CanvasRenderingContext2D;
      gctx.save();
      gctx.globalCompositeOperation = "lighter";
      gctx.fillStyle = `rgba(200,210,240,${0.1 + 0.2 * s.wake})`;
      gctx.beginPath();
      gctx.arc(wx, crowdY - kit.u(0.18), kit.u(0.06 + 0.04 * s.wake), 0, Math.PI * 2);
      gctx.fill();
      gctx.restore();
    }

    kit.light.vignette(kit);
  },
});
