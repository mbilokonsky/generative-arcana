/**
 * The Cataclysm (Major 16) — station Honesty (flat, even, MERCILESS noon; nothing shadowed,
 * nothing hidden — but here a single WHITE FLASH lays all bare at once). Number 16.
 * Scene: a great tower and its moongate split apart in a single white flash at high noon;
 * stone and shattered moons flung outward, figures falling into a merciless clear light;
 * nothing is shadowed, nothing hidden, the explosion lays the whole truth bare.
 * Interactivity (a reading): a pointer click re-triggers the flash — honesty's revelation
 * forced again; signals a "break".
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { burst: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { burst: -1 }; S.set(k, s); }
  return s;
};

// deterministic debris field, computed once per kit
const DBG = new WeakMap<SketchKit, Array<{ a: number; r0: number; spin: number; kind: number; sz: number; sp: number }>>();
const debris = (kit: SketchKit) => {
  let d = DBG.get(kit);
  if (!d) {
    d = [];
    for (let i = 0; i < 26; i++) {
      d.push({
        a: kit.rng() * Math.PI * 2,
        r0: kit.rng() * 0.04,
        spin: (kit.rng() - 0.5) * 6,
        kind: kit.rng(), // <0.4 stone shard, else moon-shard
        sz: 0.01 + kit.rng() * 0.022,
        sp: 0.7 + kit.rng() * 0.6, // outward speed multiplier
      });
    }
    DBG.set(kit, d);
  }
  return d;
};

export default registerCard({
  slug: "major-16",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      state(kit).burst = kit.t;
      kit.signal("break", { slug: "major-16" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // honesty: flat, even, merciless noon — does not flicker

    // the cataclysm rides a slow ~7s build-and-release loop so it pulses seam-free.
    const loop = kit.loop(7);
    // a smooth 0..1 burst envelope: long build to a sharp peak near the seam-safe point, then release
    const ambient = Math.pow(Math.sin(loop * Math.PI), 4); // 0 at seam, peaks mid-loop
    // a click overrides with its own quick envelope
    let clickEnv = 0;
    if (s.burst >= 0) {
      const e = (kit.t - s.burst) / 1.3;
      if (e >= 1) s.burst = -1;
      else clickEnv = Math.pow(1 - e, 2);
    }
    const flash = Math.max(ambient, clickEnv);
    const cxp = kit.cx;
    const cyp = kit.h * 0.5;

    // --- the flat merciless noon sky: pale, even, nothing shadowed ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "rgba(220,224,235,0.08)");
    sky.addColorStop(1, "rgba(200,206,224,0.04)");
    ctx.save();
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    p.pop();

    // ground line — a bare clear horizon, evenly lit
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(0, h * 0.9, w, h * 0.1);
    p.pop();

    const towerBase = h * 0.9;
    const split = flash; // how far the structure has been driven apart

    // --- the tower and moongate at center, split/cracked apart on the flash ---
    // draw the two halves of the tower sheared apart by `split`
    const shear = split * kit.u(0.07);
    const tilt = split * 0.12;

    const drawTowerHalf = (side: number) => {
      p.push();
      p.translate(cxp + side * shear, towerBase);
      p.rotate(side * tilt);
      p.translate(-cxp, -towerBase);
      // half-width tower mass
      const tw = kit.u(0.12), th = kit.u(0.4);
      p.noStroke();
      kit.register.fill(kit, kit.palette.shade);
      if (side < 0) p.rect(cxp - tw, towerBase - th, tw, th);
      else p.rect(cxp, towerBase - th, tw, th);
      // a crenellation block on the outer top corner
      kit.register.fill(kit, kit.palette.ink);
      const bw = tw * 0.4;
      if (side < 0) p.rect(cxp - tw, towerBase - th - bw, bw, bw);
      else p.rect(cxp + tw - bw, towerBase - th - bw, bw, bw);
      p.pop();
    };
    drawTowerHalf(-1);
    drawTowerHalf(1);

    // a jagged white crack splitting the tower up the middle, widening with the flash
    if (flash > 0.02) {
      p.push();
      const kctx = p.drawingContext as CanvasRenderingContext2D;
      kctx.save();
      kctx.globalCompositeOperation = "lighter";
      p.stroke(`rgba(255,255,255,${0.4 + 0.5 * flash})`);
      p.strokeWeight(kit.u(0.004 + 0.01 * flash));
      p.noFill();
      p.beginShape();
      const segs = 8;
      for (let i = 0; i <= segs; i++) {
        const f = i / segs;
        const y = (towerBase - kit.u(0.4)) + f * kit.u(0.4);
        const jx = cxp + Math.sin(f * 12 + 1) * kit.u(0.012) * (1 - f) + (kit.rng() - 0.5) * 0;
        p.vertex(jx, y);
      }
      p.endShape();
      kctx.restore();
      p.pop();
    }

    // the moongate at the tower's foot, also cracking apart
    p.push();
    p.translate(0, -split * kit.u(0.0)); // gate stays grounded; it shatters in place
    const gateOpen = 0.4 + 0.5 * flash;
    // draw two sheared arch halves
    const half = kit.u(0.13);
    const gtop = towerBase - kit.u(0.22);
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    // left half-arch, pushed left on flash
    p.push();
    p.translate(-shear * 1.2, 0);
    p.beginShape();
    p.vertex(cxp - half - kit.u(0.03), towerBase);
    p.vertex(cxp - half - kit.u(0.03), gtop + half);
    for (let i = 0; i <= 9; i++) {
      const a = Math.PI - (Math.PI * 0.5 * i) / 9;
      p.vertex(cxp + Math.cos(a) * half, gtop + half - Math.sin(a) * half);
    }
    p.vertex(cxp, gtop + half - half);
    p.vertex(cxp, towerBase);
    p.endShape(p.CLOSE);
    p.pop();
    // right half-arch, pushed right
    p.push();
    p.translate(shear * 1.2, 0);
    p.beginShape();
    p.vertex(cxp + half + kit.u(0.03), towerBase);
    p.vertex(cxp + half + kit.u(0.03), gtop + half);
    for (let i = 0; i <= 9; i++) {
      const a = (Math.PI * 0.5 * i) / 9;
      p.vertex(cxp + Math.cos(a) * half, gtop + half - Math.sin(a) * half);
    }
    p.vertex(cxp, gtop + half - half);
    p.vertex(cxp, towerBase);
    p.endShape(p.CLOSE);
    p.pop();
    p.pop();
    // a luminous gate threshold flaring with the break
    kit.register.glow(kit, cxp, gtop + half * 0.3, 0.2 * (1 + flash), kit.palette.light, gateOpen);
    p.pop();

    // --- stone debris and shattered moon-shards flung radially outward on the loop ---
    p.push();
    const dctx = p.drawingContext as CanvasRenderingContext2D;
    for (const frag of debris(kit)) {
      const reach = (kit.u(0.05) + kit.u(0.34) * frag.sp) * split;
      const fx = cxp + Math.cos(frag.a) * (kit.u(frag.r0) + reach);
      const fy = cyp + Math.sin(frag.a) * (kit.u(frag.r0) + reach) - kit.u(0.05) * split * frag.sp; // slight upward bias
      const sz = kit.u(frag.sz);
      const fade = 0.3 + 0.7 * split;
      p.push();
      p.translate(fx, fy);
      p.rotate(frag.spin * split + frag.a);
      p.noStroke();
      if (frag.kind < 0.4) {
        // stone shard — angular grey chip, fully lit (no shadow side: merciless even light)
        kit.register.fill(kit, kit.palette.ink);
        p.drawingContext.globalAlpha = fade;
        p.beginShape();
        p.vertex(-sz * 0.5, -sz * 0.4);
        p.vertex(sz * 0.6, -sz * 0.2);
        p.vertex(sz * 0.3, sz * 0.5);
        p.vertex(-sz * 0.4, sz * 0.3);
        p.endShape(p.CLOSE);
        p.drawingContext.globalAlpha = 1;
      } else {
        // moon-shard — a pale curved fragment, faintly luminous
        dctx.save();
        dctx.globalCompositeOperation = "lighter";
        p.fill(`rgba(231,233,245,${0.55 * fade})`);
        p.beginShape();
        p.vertex(-sz * 0.6, -sz * 0.3);
        p.vertex(sz * 0.5, -sz * 0.5);
        p.vertex(sz * 0.2, sz * 0.4);
        p.endShape(p.CLOSE);
        dctx.restore();
      }
      p.pop();
    }
    p.pop();

    // --- small figures falling, flung from the structure into the clear light ---
    const fallers = [
      { ang: -0.7, d: 0.18, hh: 0.13 },
      { ang: -2.3, d: 0.2, hh: 0.12 },
      { ang: -1.3, d: 0.26, hh: 0.11 },
    ];
    for (const fr of fallers) {
      const reach = kit.u(fr.d) * (0.4 + 0.9 * split);
      const fx = cxp + Math.cos(fr.ang) * reach;
      const fy = cyp + Math.sin(fr.ang) * reach * 0.7 + split * kit.u(0.06);
      p.push();
      p.translate(fx, fy);
      p.rotate(fr.ang + split * 1.4); // tumbling
      kit.fig.figure(kit, 0, kit.u(fr.hh) * 0.5, fr.hh, 0, kit.palette.ink);
      p.pop();
    }

    // --- the brilliant white flash at center, additive, riding the build-and-release loop ---
    if (flash > 0.01) {
      const flc = p.drawingContext as CanvasRenderingContext2D;
      flc.save();
      flc.globalCompositeOperation = "lighter";
      // core bloom
      const rg = flc.createRadialGradient(cxp, cyp, 0, cxp, cyp, kit.u(0.55) * (0.4 + 0.8 * flash));
      rg.addColorStop(0, `rgba(255,255,255,${0.85 * flash})`);
      rg.addColorStop(0.3, `rgba(255,253,245,${0.5 * flash})`);
      rg.addColorStop(1, "rgba(255,250,235,0)");
      flc.fillStyle = rg;
      flc.fillRect(0, 0, w, h);
      // radiating spokes of bared light — nothing hidden
      flc.strokeStyle = `rgba(255,255,255,${0.4 * flash})`;
      flc.lineWidth = kit.u(0.004);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + 0.2;
        flc.beginPath();
        flc.moveTo(cxp, cyp);
        flc.lineTo(cxp + Math.cos(a) * kit.u(0.5) * flash, cyp + Math.sin(a) * kit.u(0.5) * flash);
        flc.stroke();
      }
      flc.restore();
    }

    // an ankh briefly seared into the flash core — the major motif laid bare at the heart of the break
    if (flash > 0.3) {
      const actx = p.drawingContext as CanvasRenderingContext2D;
      actx.save();
      actx.globalCompositeOperation = "lighter";
      actx.globalAlpha = (flash - 0.3) / 0.7;
      kit.fig.ankh(kit, cxp, cyp, 0.13, "#ffffff");
      actx.restore();
    }

    kit.light.vignette(kit);
  },
});
