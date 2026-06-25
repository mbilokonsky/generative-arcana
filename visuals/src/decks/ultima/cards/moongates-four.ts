/**
 * Four of Moongates — station Sacrifice, number 4 (a 2x2 foursquare bond, costly and steady).
 * Four gates anchor the corners of a still reflecting pool in reddened ember light, glows linking
 * into a steady frame around two figures at center, two moons low. A warm bond quietly upheld.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-four",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // sacrifice: ember pulse, glow depleting and rekindling

    const waterY = h * 0.66;
    const ember = kit.light.pulse(kit.t);

    // two moons low on the horizon
    kit.fig.moon(kit, w * 0.3, h * 0.16, 0.045, 0.8, "#dfe6ff");
    kit.fig.moon(kit, w * 0.7, h * 0.14, 0.04, 0.6, "#e0506a");

    const dx = w * 0.26;
    const topY = waterY - kit.u(0.16);
    const corners = [
      { x: kit.cx - dx, y: topY },
      { x: kit.cx + dx, y: topY },
      { x: kit.cx - dx, y: waterY },
      { x: kit.cx + dx, y: waterY },
    ];

    const drawGates = () => {
      // linking frame between the four corners
      p.push();
      p.stroke(kit.palette.accent);
      p.strokeWeight(kit.u(0.006));
      p.noFill();
      const o = 0.2 + 0.3 * ember;
      const c = kit.palette.accent;
      p.drawingContext.globalAlpha = o;
      p.rect(kit.cx - dx, topY - kit.u(0.18), dx * 2, kit.u(0.16) + (waterY - topY));
      p.drawingContext.globalAlpha = 1;
      p.pop();
      corners.forEach((c2, i) => {
        kit.fig.moongateArch(kit, c2.x, c2.y, 0.13, 0.17, 0.55 + 0.4 * ember * (i % 2 === 0 ? 1 : 0.8));
      });
    };
    kit.fig.reflect(kit, waterY, drawGates);

    // two figures at the center, close together
    kit.fig.figure(kit, kit.cx - kit.u(0.05), waterY + kit.u(0.02), 0.17, 0.08, kit.palette.shade);
    kit.fig.figure(kit, kit.cx + kit.u(0.05), waterY + kit.u(0.02), 0.17, -0.08, kit.palette.shade);
    kit.register.glow(kit, kit.cx, waterY - kit.u(0.08), 0.06, kit.palette.accent, 0.25 + 0.2 * ember);

    kit.light.vignette(kit);
  },
});
