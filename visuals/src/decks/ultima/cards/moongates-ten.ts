/**
 * Ten of Moongates — station Valor, number 10 (the great passage made, a cycle completing).
 * A family stands before a great bright gate at the close of night, ten smaller arches dimming
 * behind them across the water, two moons setting and a third light rising beyond. A life carried through.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-ten",

  draw(kit) {
    const { w, h } = kit;
    kit.light.wash(kit); // valor: held tension, a single bright focal point, faintly electric

    const waterY = h * 0.7;
    const charge = kit.light.pulse(kit.t);

    // two moons setting low, a third light rising beyond the great gate
    kit.fig.moon(kit, w * 0.18, h * 0.24, 0.04, 0.5, "#dfe6ff");
    kit.fig.moon(kit, w * 0.32, h * 0.22, 0.035, 0.4, "#e0506a");
    kit.register.glow(kit, kit.cx + kit.u(0.02), h * 0.3, 0.07, kit.palette.light, 0.4 + 0.2 * charge);

    // ten smaller arches dimming behind, receding across the water
    const drawSmall = () => {
      for (let i = 0; i < 10; i++) {
        const tt = i / 9;
        const x = kit.cx + (tt - 0.5) * w * 0.78;
        const y = waterY - kit.u(0.04) - Math.abs(tt - 0.5) * kit.u(0.05);
        kit.fig.moongateArch(kit, x, y, 0.06, 0.08, 0.12 + 0.08 * (1 - Math.abs(tt - 0.5) * 2));
      }
    };
    // the great bright central gate
    const drawGreat = () => {
      kit.fig.moongateArch(kit, kit.cx, waterY + kit.u(0.02), 0.26, 0.36, 0.85 + 0.15 * charge);
    };
    kit.fig.reflect(kit, waterY, () => { drawSmall(); drawGreat(); });

    // a family — three figures of stepped height — opening toward the crossing
    kit.fig.figure(kit, kit.cx - kit.u(0.09), waterY + kit.u(0.03), 0.18, 0.05, kit.palette.shade);
    kit.fig.figure(kit, kit.cx + kit.u(0.09), waterY + kit.u(0.03), 0.18, -0.05, kit.palette.shade);
    kit.fig.figure(kit, kit.cx, waterY + kit.u(0.04), 0.11, 0, kit.palette.shade);

    kit.light.vignette(kit);
  },
});
