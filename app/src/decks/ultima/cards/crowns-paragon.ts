/**
 * Paragon of Crowns — station Honor, 14 (the exemplary sovereign, mastery embodied).
 * Composition: a commanding figure, the emblem raised and mastered — a monarch in full burnished
 * regalia stands beneath a high raised standard, the whole court arranged in honor around them,
 * every line vertical and grave, formal golden light. Interactivity: regard makes the standard rise
 * and the crown blaze a touch brighter — authority at its complete and exacting peak.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "crowns-paragon",

  draw(kit) {
    const { p, w, h } = kit;
    kit.light.wash(kit); // honor: formal vertical columnar light, burnished, ceremonial, a little cold

    // gilded border
    p.push();
    p.noFill();
    kit.register.stroke(kit, 0.005, kit.palette.accent);
    p.rect(kit.u(0.05), kit.u(0.05), w - kit.u(0.1), h - kit.u(0.1), kit.u(0.02));
    kit.register.stroke(kit, 0.002, kit.palette.shade);
    p.rect(kit.u(0.07), kit.u(0.07), w - kit.u(0.14), h - kit.u(0.14), kit.u(0.015));
    p.pop();

    const cx = kit.cx;
    const groundY = kit.h * 0.84;
    const regard = kit.pointer.inside ? 1 : 0;

    // the high raised standard, vertical and central — the columnar light made object
    const poleTop = kit.h * 0.16 - regard * kit.u(0.01);
    p.push();
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.005));
    p.strokeCap(p.ROUND);
    p.line(cx, poleTop, cx, groundY - kit.u(0.1));
    // the standard's pennon, held formally vertical with a slow grave sway
    const sway = Math.sin(kit.t * 0.5) * kit.u(0.008);
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.beginShape();
    p.vertex(cx, poleTop);
    p.vertex(cx + kit.u(0.06) + sway, poleTop + kit.u(0.03));
    p.vertex(cx + kit.u(0.05) + sway, poleTop + kit.u(0.06));
    p.vertex(cx + kit.u(0.07) + sway, poleTop + kit.u(0.09));
    p.vertex(cx, poleTop + kit.u(0.1));
    p.endShape(p.CLOSE);
    p.pop();

    // the court arranged in honor around the sovereign — symmetric, grave, all vertical
    [-1, 1].forEach((s) => {
      for (let i = 0; i < 3; i++) {
        const fx = cx + s * kit.u(0.12 + i * 0.09);
        kit.fig.figure(kit, fx, groundY + kit.u(0.01), 0.16 - i * 0.012, 0, kit.palette.shade);
      }
    });

    // the sovereign at center, commanding, in full regalia (a taller, broader silhouette)
    kit.fig.figure(kit, cx, groundY, 0.3, 0, kit.palette.shade);
    // burnished mantle suggested by a gold-edged taper at the shoulders
    p.push();
    p.noStroke();
    kit.register.fill(kit, kit.palette.accent);
    p.drawingContext.globalAlpha = 0.5;
    p.beginShape();
    p.vertex(cx - kit.u(0.05), groundY - kit.u(0.24));
    p.vertex(cx + kit.u(0.05), groundY - kit.u(0.24));
    p.vertex(cx + kit.u(0.07), groundY - kit.u(0.02));
    p.vertex(cx - kit.u(0.07), groundY - kit.u(0.02));
    p.endShape(p.CLOSE);
    p.drawingContext.globalAlpha = 1;
    p.pop();

    // the crown worn so rightly it seems part of the wearer — blazing at the peak
    const crownY = groundY - kit.u(0.3);
    const blaze = 0.55 + 0.2 * Math.sin(kit.t * 0.5) + regard * 0.25;
    kit.register.glow(kit, cx, crownY - kit.u(0.01), 0.13, kit.palette.accent, blaze);
    kit.fig.crown(kit, cx, crownY, 0.1, kit.palette.accent);

    kit.light.vignette(kit);
  },
});
