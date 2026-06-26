/**
 * Nine of Moongates — station Compassion, number 9 (fulfilment, a held harvest of feeling).
 * A figure sits serene before nine softly glowing gates arrayed in a wide arc over calm water in
 * warm low light, arms loosely open, two moons gentle above. Feeling full and quietly radiant.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-nine",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // compassion: warm hearth-glow that breathes, everything enfolded

    const waterY = h * 0.68;
    const breath = 0.5 + 0.5 * Math.sin(kit.loop(8) * Math.PI * 2);

    // two gentle moons
    kit.fig.moon(kit, w * 0.3, h * 0.16, 0.045, 0.85, "#dfe6ff");
    kit.fig.moon(kit, w * 0.7, h * 0.15, 0.04, 0.7, "#e0506a");

    // nine gates in a wide enclosing arc around the figure
    const n = 9;
    const cx = kit.cx;
    const cy = h * 0.5;
    const rx = w * 0.4;
    const ry = kit.u(0.26);
    const drawArc = () => {
      for (let i = 0; i < n; i++) {
        const tt = i / (n - 1);
        const a = Math.PI * (1.08 - tt * 1.16); // top arc, slightly more than semicircle
        const x = cx + Math.cos(a) * rx;
        const y = cy - Math.sin(a) * ry + kit.u(0.08);
        const open = 0.55 + 0.35 * breath * (0.6 + 0.4 * Math.sin(kit.loop(8, i / n) * Math.PI * 2));
        kit.fig.moongateArch(kit, x, y, 0.09, 0.12, Math.min(1, open));
      }
    };
    kit.fig.reflect(kit, waterY, drawArc);

    // serene seated figure, arms loosely open
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    const fy = waterY + kit.u(0.02);
    const fh = kit.u(0.15);
    p.circle(cx, fy - fh, kit.u(0.045));
    p.beginShape();
    p.vertex(cx - kit.u(0.09), fy);
    p.vertex(cx - kit.u(0.04), fy - fh * 0.82);
    p.vertex(cx + kit.u(0.04), fy - fh * 0.82);
    p.vertex(cx + kit.u(0.09), fy);
    p.endShape(p.CLOSE);
    p.pop();
    kit.register.glow(kit, cx, fy - fh * 0.5, 0.08, kit.palette.accent, 0.2 + 0.15 * breath);

    kit.light.vignette(kit);
  },
});
