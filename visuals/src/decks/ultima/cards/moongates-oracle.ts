/**
 * Oracle of Moongates — station Honor (the empath whose long feeling has become still knowing).
 * A still figure sits at the center of a calm reflecting pool in formal vertical light, many faint
 * gates haloed around them, two moons mirrored exactly below. Feeling understood and quietly kept.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-oracle",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // honor: formal vertical columnar light, held and ceremonial

    const waterY = h * 0.62;
    const cx = kit.cx;
    const cy = h * 0.42;

    // two moons mirrored exactly (will be reflected by reflect())
    const drawSky = () => {
      kit.fig.moon(kit, cx - w * 0.14, cy - kit.u(0.04), 0.04, 0.85, "#dfe6ff");
      kit.fig.moon(kit, cx + w * 0.14, cy - kit.u(0.04), 0.04, 0.85, "#e0506a");
      // many faint gates haloed in a halo-ring around the seated figure
      const n = 9;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const r = kit.u(0.18);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.7 + kit.u(0.06);
        const open = 0.25 + 0.15 * (0.5 + 0.5 * Math.sin(kit.loop(14, i / n) * Math.PI * 2));
        kit.fig.moongateArch(kit, x, y, 0.06, 0.08, open);
      }
    };
    kit.fig.reflect(kit, waterY, drawSky);

    // a still seated figure at center
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    const fy = waterY + kit.u(0.01);
    const fh = kit.u(0.16);
    p.circle(cx, fy - fh, kit.u(0.048));
    p.beginShape();
    p.vertex(cx - kit.u(0.1), fy);
    p.vertex(cx - kit.u(0.035), fy - fh * 0.82);
    p.vertex(cx + kit.u(0.035), fy - fh * 0.82);
    p.vertex(cx + kit.u(0.1), fy);
    p.endShape(p.CLOSE);
    p.pop();
    kit.register.glow(kit, cx, fy - fh * 0.55, 0.07, kit.palette.accent, 0.22);

    kit.light.vignette(kit);
  },
});
