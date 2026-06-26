/**
 * Three of Moongates — station Justice, number 3 (scattered feeling cohering into a fair shape).
 * Three gates form a glowing arc above calm water lit evenly from both sides, reflections meeting
 * in a balanced figure below, two moons centered. Poised, luminous, fairly ordered.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-three",

  draw(kit) {
    const { w, h } = kit;
    kit.light.wash(kit); // justice: two balanced sources, poised stillness before a verdict

    const waterY = h * 0.62;
    const sway = Math.sin(kit.loop(9) * Math.PI * 2) * 0.06;

    // two moons centered, balanced
    kit.fig.moon(kit, kit.cx - w * 0.12, h * 0.18, 0.045, 0.9, "#dfe6ff");
    kit.fig.moon(kit, kit.cx + w * 0.12, h * 0.18, 0.045, 0.9, "#e0506a");

    // three gates along a gentle arc, the center one highest
    const cols = [
      { x: kit.cx - w * 0.24, lift: 0.0, open: 0.7 },
      { x: kit.cx, lift: 0.06, open: 0.92 },
      { x: kit.cx + w * 0.24, lift: 0.0, open: 0.7 },
    ];
    const drawGates = () => {
      cols.forEach((c, i) => {
        const ph = 0.5 + 0.5 * Math.sin(kit.loop(9, i / 3) * Math.PI * 2);
        kit.fig.moongateArch(kit, c.x + sway * kit.u(0.3) * (i - 1), waterY - kit.u(c.lift), 0.15, 0.2, c.open * (0.85 + 0.15 * ph));
      });
    };
    kit.fig.reflect(kit, waterY, drawGates);

    // a centered, balanced figure below the arc, on the near shore
    kit.fig.figure(kit, kit.cx, waterY + kit.u(0.02), 0.2, 0, kit.palette.shade);
    kit.register.glow(kit, kit.cx, waterY - kit.u(0.1), 0.05, kit.palette.accent, 0.3);

    kit.light.vignette(kit);
  },
});
