/**
 * Ace of Moongates — station Compassion, number 1 (identity: a single originating gate).
 * A single small moongate shimmers open above still water; one figure reaches toward its glow,
 * two faint moons reflected below. Tenderness as the heart's first warm pull.
 * Interactivity: as the pointer nears the gate, the figure leans toward it and the arch brightens.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-ace",

  draw(kit) {
    const { w, h, p } = kit;
    kit.light.wash(kit); // compassion: a low warm glow that breathes

    const waterY = h * 0.62;
    const breath = 0.5 + 0.5 * Math.sin(kit.loop(7) * Math.PI * 2);

    // two faint moons high in the warm sky
    kit.fig.moon(kit, w * 0.32, h * 0.2, 0.05, 0.85, "#dfe6ff");
    kit.fig.moon(kit, w * 0.7, h * 0.16, 0.038, 0.7, "#e0506a");

    const gateX = kit.cx + kit.u(0.04);
    const gateBase = waterY;
    const reach = kit.pointer.inside
      ? Math.max(0, 1 - Math.abs(kit.pointer.x - 0.5) * 2 - Math.abs(kit.pointer.y - 0.5))
      : 0;
    const open = 0.55 + 0.35 * breath + 0.4 * reach;

    const drawGate = () => {
      kit.fig.moongateArch(kit, gateX, gateBase, 0.18, 0.24, Math.min(1, open));
    };
    kit.fig.reflect(kit, waterY, drawGate);

    // a lone figure on the near shore, reaching a hand toward the glow
    const lean = -0.25 - 0.35 * reach;
    kit.fig.figure(kit, w * 0.3, waterY + kit.u(0.02), 0.2, lean, kit.palette.shade);
    // the reaching arm — a simple gestural line toward the gate
    p.push();
    p.stroke(kit.palette.ink);
    p.strokeWeight(kit.u(0.012));
    p.strokeCap(p.ROUND);
    const sx = w * 0.3 + kit.u(0.02);
    const sy = waterY - kit.u(0.13);
    const hx = sx + (gateX - sx) * (0.42 + 0.12 * reach);
    const hy = sy - kit.u(0.02);
    p.line(sx, sy, hx, hy);
    p.pop();
    kit.register.glow(kit, hx, hy, 0.03, kit.palette.accent, 0.4 + 0.4 * reach);

    kit.light.vignette(kit);
  },
});
