/**
 * Ten of Runes — station Humility, identity 10 (overflowing toward a threshold; codex handed on).
 * An old scholar lays a completed, glowing ten-rune codex into a young student's hands in low
 * earthbound dusk-light, the study behind them dim and emptied. Humility light: a low, level,
 * earthbound dusk that settles downward, small under a wide sky, weight returning to the soil.
 * The flat space is humble and warm-grey — the great book given fully and freely away.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "runes-ten",

  draw(kit) {
    const { p } = kit;
    kit.light.wash(kit);

    const giveY = kit.h * 0.56; // the book, low and level, where hands meet
    const elderX = kit.cx - kit.u(0.16);
    const studentX = kit.cx + kit.u(0.16);

    // dim, emptied study behind — faint shelf lines, settling downward
    p.push();
    kit.register.stroke(kit, 0.002, kit.palette.shade);
    p.noFill();
    for (let i = 0; i < 3; i++) {
      const y = kit.h * 0.3 + i * kit.u(0.05);
      p.line(kit.cx - kit.u(0.28), y, kit.cx + kit.u(0.28), y);
    }
    p.pop();

    // the two figures, both low and bowed — giving and receiving
    kit.fig.figure(kit, elderX, kit.h * 0.94, 0.32, 0.3, kit.palette.ink);
    kit.fig.figure(kit, studentX, kit.h * 0.94, 0.26, -0.3, kit.palette.ink);

    // arms reaching toward the shared book
    p.push();
    kit.register.stroke(kit, 0.012, kit.palette.ink);
    p.line(elderX + kit.u(0.04), kit.h * 0.94 - kit.u(0.22), kit.cx - kit.u(0.03), giveY + kit.u(0.02));
    p.line(studentX - kit.u(0.04), kit.h * 0.94 - kit.u(0.18), kit.cx + kit.u(0.03), giveY + kit.u(0.02));
    p.pop();

    // the completed, glowing ten-rune codex, level between them
    p.push();
    p.noStroke();
    p.fill(kit.palette.shade);
    p.rect(kit.cx - kit.u(0.07), giveY - kit.u(0.05), kit.u(0.14), kit.u(0.07), kit.u(0.005));
    p.pop();
    kit.register.glow(kit, kit.cx, giveY - kit.u(0.015), 0.16, kit.palette.accent, 0.3);

    // ten small runes overflowing across the open page — two rows of five
    const breath = 0.7 + 0.3 * Math.sin(kit.t * 0.5);
    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = i < 5 ? 0 : 1;
      const x = kit.cx - kit.u(0.05) + col * kit.u(0.025);
      const y = giveY - kit.u(0.03) + row * kit.u(0.03);
      kit.fig.rune(kit, x, y, 0.022, breath, kit.palette.accent);
    }

    // a few runes lifting off, overflowing toward the threshold — given away, rising
    p.push();
    p.noStroke();
    for (let i = 0; i < 3; i++) {
      const ph = kit.loop(6, i / 3);
      const x = kit.cx + kit.u(0.04) + i * kit.u(0.02);
      const y = giveY - kit.u(0.05) - ph * kit.u(0.12);
      kit.register.glow(kit, x, y, 0.02, kit.palette.accent, 0.4 * (1 - ph));
      p.fill(kit.palette.light);
      p.circle(x, y, kit.u(0.005) * (1 - ph));
    }
    p.pop();

    kit.light.vignette(kit);
  },
});
