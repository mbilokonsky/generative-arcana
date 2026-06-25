/**
 * The Offering (Major 12) — station Sacrifice (a reddened EMBER pulse; the glow slowly depletes
 * and rekindles), number 12.
 * Scene: a figure hangs serene and inverted from a living moongate-arch, suspended over a quiet
 * ember-lit pool; coins and a sword fall forgotten from open hands; the warm depleting light
 * gathers around the calm upside-down face, something freely spent, nothing clutched.
 * Interactivity (a reading): the pointer-click releases another coin to fall and the ember halo
 * brightens as something is given — sacrifice as an open hand, never a grasping one.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

interface Coin { x0: number; t0: number; side: number; }
const S = new WeakMap<SketchKit, { coins: Coin[]; give: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { coins: [], give: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-12",

  onPointer(kit) {
    const s = state(kit);
    if (kit.pointer.pressed && kit.pointer.inside) {
      s.coins.push({ x0: (kit.rng() - 0.5) * 0.2, t0: kit.t, side: kit.rng() < 0.5 ? -1 : 1 });
      if (s.coins.length > 10) s.coins.shift();
      s.give = 1; // halo brightens on the gift
      kit.signal("give", { slug: "major-12" });
    }
  },

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit);

    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // sacrifice: a reddened ember pulse that depletes and rekindles
    const ember = kit.light.pulse(kit.t); // 0..1, ember breath
    s.give *= 0.96; // the given-brightness fades back

    const cx = kit.cx;
    const waterY = kit.h * 0.74;

    // --- the living moongate-arch up top, from which the figure hangs ---
    const archBaseY = kit.h * 0.34; // arch springs from here, opening upward
    const archW = 0.42, archH = 0.22;
    // draw the arch as a "living" gate — vines/tendrils suggested by a slightly irregular crown.
    kit.fig.moongateArch(kit, cx, archBaseY, archW, archH, 0.4 + 0.3 * ember);
    // living tendrils curling off the arch crown
    p.push();
    kit.register.stroke(kit, 0.005, kit.palette.shade);
    p.noFill();
    for (let i = -1; i <= 1; i += 2) {
      const ax = cx + i * kit.u(archW) * 0.5;
      p.beginShape();
      for (let t = 0; t <= 1; t += 0.12) {
        const vx = ax + i * Math.sin(t * Math.PI * 2 + kit.t * 0.3) * kit.u(0.03) * t;
        const vy = archBaseY - kit.u(0.02) - t * kit.u(0.1);
        p.vertex(vx, vy);
      }
      p.endShape();
    }
    p.pop();

    // the hang-point at the crown of the arch
    const hangX = cx;
    const hangY = archBaseY - kit.u(archH);
    // the suspending cord
    const figTopY = hangY + kit.u(0.05);
    p.push();
    kit.register.stroke(kit, 0.006, kit.palette.ink);
    p.line(hangX, hangY, hangX, figTopY);
    p.pop();

    // serene sway of the suspended figure
    const sway = Math.sin(kit.t * 0.35) * 0.05;

    // --- the inverted figure: hung from the ankle, calm, one leg crossed, arms open downward ---
    // we draw the body upside down (head low, feet up at the cord).
    p.push();
    p.translate(hangX, figTopY);
    p.rotate(sway);
    const fh = kit.u(0.30);
    p.noStroke();
    p.fill(kit.palette.ink);

    // the bound ankle (top) — feet up near the cord
    // body: torso tapering DOWN to the (lowered) shoulders, head at the bottom
    // tapered robe (inverted): narrow at top (legs), wide at shoulders lower down
    p.beginShape();
    p.vertex(-fh * 0.06, 0);           // ankle/leg top
    p.vertex(fh * 0.06, 0);
    p.vertex(fh * 0.16, fh * 0.78);    // shoulders (lower)
    p.vertex(-fh * 0.16, fh * 0.78);
    p.endShape(p.CLOSE);
    // one leg crossed: a bent shin angling off the top
    p.push();
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.018));
    p.strokeCap(p.ROUND);
    p.noFill();
    p.line(fh * 0.03, fh * 0.02, fh * 0.18, fh * 0.12);
    p.line(fh * 0.18, fh * 0.12, fh * 0.02, fh * 0.2);
    p.pop();
    // the head, hanging calm and low
    const headCY = fh * 0.92;
    p.noStroke();
    p.fill(kit.palette.ink);
    p.circle(0, headCY, fh * 0.2);
    // open arms reaching down past the head, hands open (releasing)
    p.push();
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.014));
    p.strokeCap(p.ROUND);
    p.noFill();
    p.line(-fh * 0.14, fh * 0.74, -fh * 0.22, fh * 1.04);
    p.line(fh * 0.14, fh * 0.74, fh * 0.22, fh * 1.04);
    p.pop();

    p.pop(); // end inverted figure

    // hand world-positions (open, downturned) — coins fall from one, sword from the other
    const handL = { x: hangX - fh * 0.22 + sway * kit.u(0.1), y: figTopY + fh * 1.04 };
    const handR = { x: hangX + fh * 0.22 + sway * kit.u(0.1), y: figTopY + fh * 1.04 };

    // --- the calm head ember halo, depleting and rekindling, brighter on a gift ---
    const headWorldY = figTopY + headCY;
    const haloR = kit.u(0.16) * (0.7 + 0.3 * ember) + kit.u(0.05) * s.give;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const halo = ctx.createRadialGradient(hangX, headWorldY, 0, hangX, headWorldY, haloR);
    const haloA = 0.3 + 0.25 * ember + 0.3 * s.give;
    halo.addColorStop(0, `rgba(255,170,90,${haloA})`);
    halo.addColorStop(0.5, `rgba(220,90,50,${haloA * 0.5})`);
    halo.addColorStop(1, "rgba(160,40,20,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(hangX, headWorldY, haloR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- the still ember-lit pool below, with the reflection of figure + arch ---
    // pool ground
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(0, waterY, w, h - waterY);
    p.pop();
    // ember light pooled on the water surface
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const poolGlow = ctx.createRadialGradient(cx, waterY, 0, cx, waterY, kit.u(0.4) * (0.7 + 0.3 * ember));
    poolGlow.addColorStop(0, `rgba(230,110,60,${0.18 + 0.12 * ember})`);
    poolGlow.addColorStop(1, "rgba(160,40,20,0)");
    ctx.fillStyle = poolGlow;
    ctx.beginPath();
    ctx.ellipse(cx, waterY, kit.u(0.4), kit.u(0.08), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // reflection of the head-halo shimmering in the pool (use reflect for a faint mirrored glow)
    kit.fig.reflect(kit, waterY, () => {
      const rctx = p.drawingContext as CanvasRenderingContext2D;
      rctx.save();
      rctx.globalCompositeOperation = "lighter";
      const rg = rctx.createRadialGradient(hangX, headWorldY, 0, hangX, headWorldY, haloR);
      rg.addColorStop(0, `rgba(255,160,80,${haloA * 0.8})`);
      rg.addColorStop(1, "rgba(160,40,20,0)");
      rctx.fillStyle = rg;
      rctx.beginPath();
      rctx.arc(hangX, headWorldY, haloR, 0, Math.PI * 2);
      rctx.fill();
      rctx.restore();
    });

    // --- coins and a sword falling forgotten from the open hands ---
    // a continuous slow drift of coins from the left hand (ambient, default state complete)
    const fallTo = waterY;
    const drawCoin = (x: number, y: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      p.push();
      p.noStroke();
      p.fill(kit.palette.accent);
      p.ellipse(x, y, kit.u(0.022), kit.u(0.03) * (0.6 + 0.4 * Math.abs(Math.sin(y * 0.05))));
      p.fill(kit.palette.light);
      p.ellipse(x - kit.u(0.004), y, kit.u(0.008), kit.u(0.012));
      p.pop();
      ctx.restore();
    };
    // ambient coins: three on slow seam-free loops
    for (let i = 0; i < 3; i++) {
      const ph = kit.loop(5, i / 3);
      const cyP = handL.y + ph * (fallTo - handL.y);
      const cxP = handL.x + Math.sin(ph * 6 + i) * kit.u(0.015);
      const a = ph < 0.85 ? 1 - ph * 0.3 : (1 - ph) / 0.15;
      drawCoin(cxP, cyP, Math.max(0, a));
    }
    // user-released coins
    for (const c of s.coins) {
      const e = (kit.t - c.t0) / 1.6;
      if (e >= 1) continue;
      const cxP = handL.x + c.x0 * w * 0.0 + c.side * kit.u(0.02) + Math.sin(e * 6) * kit.u(0.012);
      const cyP = handL.y + e * (fallTo - handL.y);
      drawCoin(cxP, cyP, 1 - e);
    }

    // the sword slipping from the right hand — falling slowly, point-down, forgotten
    const swPh = kit.loop(7);
    const swY = handR.y + swPh * (fallTo - handR.y);
    const swX = handR.x + Math.sin(swPh * 3) * kit.u(0.01);
    ctx.save();
    ctx.globalAlpha = swPh < 0.85 ? 1 : (1 - swPh) / 0.15;
    // sword point-down, tumbling gently
    kit.fig.sword(kit, swX, swY, 0.16, Math.PI + Math.sin(swPh * 4) * 0.25, kit.palette.ink);
    ctx.restore();

    // a single tiny ripple where things meet the water, on the ember pulse
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.003, kit.palette.accent);
    ctx.save();
    ctx.globalAlpha = 0.4 + 0.3 * ember;
    const rip = kit.loop(4);
    p.ellipse(cx, waterY + kit.u(0.01), kit.u(0.05) + rip * kit.u(0.2), (kit.u(0.05) + rip * kit.u(0.2)) * 0.25);
    ctx.restore();
    p.pop();

    kit.light.vignette(kit);
  },
});
