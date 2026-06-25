/**
 * The Castle (Major 4) — station Sacrifice (reddened EMBER pulse; something spending itself to
 * give warmth; the glow slowly depletes and rekindles; ride motion on light.pulse). Number 4
 * (foursquare 2x2 symmetrical structure). Scene: Lord British's white castle stands four-square
 * and symmetrical above its town, banners still, every gate accounted for; the light is a
 * reddened ember-glow as of hearths burning low to keep the halls warm — something steadily
 * spent to hold it all in place.
 * Interactivity (a reading): the pointer warms the nearest window/hearth — the warmth is given,
 * spent toward whoever stands near; tending a hearth keeps it burning.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

type Win = { x: number; y: number; r: number };

const S = new WeakMap<SketchKit, { wins: Win[]; warm: number[] }>();

export default registerCard({
  slug: "major-4",

  onPointer(kit) {
    if (kit.pointer.pressed && kit.pointer.inside) {
      kit.signal("tend", { slug: "major-4" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit);

    const ember = kit.light.pulse(kit.t); // sacrifice's ember breath — depletes & rekindles
    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // composition center: the keep sits on the focal axis, town below
    const cx = kit.cx;
    const groundY = kit.h * 0.86;     // town roofline / hill base
    const keepBase = kit.h * 0.7;     // base of central keep
    const keepW = kit.u(0.26);
    const keepH = 0.34;
    const towerW = 0.1;
    const towerH = 0.42;
    const towerSpread = kit.u(0.34);  // distance of corner towers from center

    // 2x2 foursquare corner tower x positions (two front, two implied rear by stagger)
    const towerXs = [cx - towerSpread, cx + towerSpread];

    // --- the hill the castle stands on ---
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0, kit.h);
    p.vertex(0, groundY + kit.u(0.04));
    for (let x = 0; x <= w; x += kit.u(0.04)) {
      const d = (x - cx) / w;
      p.vertex(x, groundY - Math.cos(d * Math.PI) * kit.u(0.05));
    }
    p.vertex(w, groundY + kit.u(0.04));
    p.vertex(w, kit.h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- the town: rows of small roofs below the castle, symmetrically clustered ---
    p.push();
    p.noStroke();
    for (let row = 0; row < 2; row++) {
      const ry = groundY + kit.u(0.02) + row * kit.u(0.05);
      const count = 9 + row * 2;
      for (let i = 0; i < count; i++) {
        const f = (i - (count - 1) / 2) / count;
        const rx = cx + f * w * 0.85;
        const rw = kit.u(0.035);
        // roof
        p.fill(kit.palette.ink);
        p.drawingContext.globalAlpha = 0.55 - row * 0.1;
        p.beginShape();
        p.vertex(rx - rw, ry);
        p.vertex(rx, ry - kit.u(0.022));
        p.vertex(rx + rw, ry);
        p.endShape(p.CLOSE);
        p.drawingContext.globalAlpha = 1;
      }
    }
    p.pop();

    // --- the four-square white castle ---
    // helper: a white wall block in the major register
    const wall = (bx: number, base: number, bw: number, bh: number) => {
      p.push();
      p.noStroke();
      p.fill("#ede9e2"); // warm white stone
      p.rect(bx - bw / 2, base - bh, bw, bh);
      // ember light catches the right face faintly
      const eg = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0);
      eg.addColorStop(0, `rgba(255,150,90,${0.05 + 0.06 * ember})`);
      eg.addColorStop(1, `rgba(180,60,40,${0.08 + 0.08 * ember})`);
      ctx.save();
      ctx.fillStyle = eg;
      ctx.fillRect(bx - bw / 2, base - bh, bw, bh);
      ctx.restore();
      p.pop();
    };

    // rear curtain wall connecting the towers, behind the keep
    p.push();
    p.noStroke();
    p.fill("#e4e0d8");
    p.rect(cx - towerSpread, keepBase - kit.u(0.22), towerSpread * 2, kit.u(0.22));
    // crenellations along the curtain
    const merl = kit.u(0.03);
    for (let mx = cx - towerSpread; mx < cx + towerSpread; mx += merl * 2) {
      p.rect(mx, keepBase - kit.u(0.22) - merl, merl, merl);
    }
    p.pop();

    // four corner towers (use kit.fig.tower) — the 2x2 foursquare frame
    for (const tx of towerXs) {
      // a near tower and a (smaller, set-back) far tower at each side -> 2x2 reading
      kit.fig.tower(kit, tx, keepBase, towerW * 0.78, towerH * 0.82, "#e7e3db"); // far/back
      kit.fig.tower(kit, tx, keepBase + kit.u(0.02), towerW, towerH, "#efebe4");  // near/front
    }

    // central keep — taller, the heart of the four-square mass
    wall(cx, keepBase, keepW, kit.u(keepH));
    // keep battlements
    p.push();
    p.noStroke();
    p.fill("#efebe4");
    const km = kit.u(0.032);
    for (let mx = cx - keepW / 2; mx < cx + keepW / 2 - km; mx += km * 1.8) {
      p.rect(mx, keepBase - kit.u(keepH) - km, km, km);
    }
    p.pop();
    // keep outline in register idiom
    kit.register.outline(kit, [
      [cx - keepW / 2, keepBase],
      [cx - keepW / 2, keepBase - kit.u(keepH)],
      [cx + keepW / 2, keepBase - kit.u(keepH)],
      [cx + keepW / 2, keepBase],
    ], false);

    // --- the main gate, central and accounted-for, with two flanking posterns ---
    const gateW = kit.u(0.08), gateH = kit.u(0.12);
    p.push();
    p.noStroke();
    p.fill(kit.palette.ink);
    // central arched gate
    p.rect(cx - gateW / 2, keepBase - gateH, gateW, gateH, gateW / 2, gateW / 2, 0, 0);
    p.pop();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.noFill();
    p.arc(cx, keepBase - gateH + gateW / 2, gateW, gateW, Math.PI, 0);

    // --- still banners atop keep and towers (sacrifice: held, not waving) ---
    const banner = (bx: number, topY: number) => {
      p.push();
      p.stroke(kit.palette.ink);
      p.strokeWeight(kit.u(0.004));
      p.line(bx, topY, bx, topY - kit.u(0.05));
      p.noStroke();
      p.fill(kit.palette.accent);
      p.drawingContext.globalAlpha = 0.8;
      // a still, hanging pennant — barely a sway, on the slow ember breath
      const sway = Math.sin(kit.t * 0.4 + bx) * kit.u(0.004) * (0.3 + 0.3 * ember);
      p.beginShape();
      p.vertex(bx, topY - kit.u(0.05));
      p.vertex(bx + kit.u(0.05) + sway, topY - kit.u(0.043));
      p.vertex(bx + sway * 0.5, topY - kit.u(0.036));
      p.endShape(p.CLOSE);
      p.drawingContext.globalAlpha = 1;
      p.pop();
    };
    banner(cx, keepBase - kit.u(keepH) - kit.u(0.03));
    for (const tx of towerXs) banner(tx, keepBase - kit.u(towerH) - kit.u(0.06));

    // --- windows glowing warm, pulsing with ember light; pointer warms the nearest ---
    // assemble the window list once (deterministic), keep per-window warmth that tends back
    let st = S.get(kit);
    if (!st) {
      const wins: Win[] = [];
      // keep windows: a 2x2 + central grid (foursquare)
      const kr = kit.u(0.012);
      for (let r = 0; r < 3; r++) {
        for (let c = -1; c <= 1; c++) {
          wins.push({ x: cx + c * kit.u(0.07), y: keepBase - kit.u(keepH) + kit.u(0.06) + r * kit.u(0.07), r: kr });
        }
      }
      // tower windows
      for (const tx of towerXs) {
        for (let r = 0; r < 3; r++) {
          wins.push({ x: tx, y: keepBase - kit.u(towerH) + kit.u(0.06) + r * kit.u(0.08), r: kr });
        }
      }
      st = { wins, warm: wins.map(() => 0) };
      S.set(kit, st);
    }

    // find nearest window to pointer; warm it, let all relax toward base ember
    let nearest = -1, best = Infinity;
    if (kit.pointer.inside) {
      const pxp = kit.pointer.x * w, pyp = kit.pointer.y * h;
      st.wins.forEach((win, i) => {
        const d = (win.x - pxp) ** 2 + (win.y - pyp) ** 2;
        if (d < best) { best = d; nearest = i; }
      });
    }
    p.push();
    const wctx = p.drawingContext as CanvasRenderingContext2D;
    wctx.save();
    wctx.globalCompositeOperation = "lighter";
    p.noStroke();
    st.wins.forEach((win, i) => {
      const tgt = i === nearest && best < kit.u(0.12) ** 2 ? 1 : 0;
      st!.warm[i] += (tgt - st!.warm[i]) * 0.08;
      // base ember glow (depletes/rekindles with the pulse) + tended warmth
      const lit = 0.45 + 0.35 * ember + 0.5 * st!.warm[i];
      const wg = wctx.createRadialGradient(win.x, win.y, 0, win.x, win.y, win.r * 4);
      wg.addColorStop(0, `rgba(255,180,90,${0.9 * lit})`);
      wg.addColorStop(0.4, `rgba(220,90,50,${0.5 * lit})`);
      wg.addColorStop(1, "rgba(220,90,50,0)");
      wctx.fillStyle = wg;
      p.circle(win.x, win.y, win.r * 8);
      // bright window core
      p.fill(`rgba(255,225,170,${0.8 * lit})`);
      p.rect(win.x - win.r * 0.6, win.y - win.r, win.r * 1.2, win.r * 2);
    });
    wctx.restore();
    p.pop();

    // --- a low reddened ember haze rising from the town, the warmth spent outward ---
    p.push();
    const hctx = p.drawingContext as CanvasRenderingContext2D;
    const haze = hctx.createLinearGradient(0, groundY - kit.u(0.1), 0, groundY + kit.u(0.06));
    haze.addColorStop(0, "rgba(200,70,50,0)");
    haze.addColorStop(1, `rgba(200,70,50,${0.1 + 0.1 * ember})`);
    hctx.save();
    hctx.fillStyle = haze;
    hctx.fillRect(0, groundY - kit.u(0.1), w, kit.u(0.16));
    hctx.restore();
    p.pop();

    kit.light.vignette(kit);
  },
});
