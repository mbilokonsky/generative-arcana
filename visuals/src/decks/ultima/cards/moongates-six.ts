/**
 * Six of Moongates — station Spirituality, number 6 (2x3, two triads in flowing accord).
 * Six gates form a gentle ring above mirror-still water under a diffuse radiant sky, glows flowing
 * into one another, figures passing freely between them. Feeling in weightless accord.
 */
import { registerCard } from "@/runtime/defineCard";

export default registerCard({
  slug: "moongates-six",

  draw(kit) {
    const { w, h } = kit;
    kit.light.wash(kit); // spirituality: sourceless radiance that drifts, haloed

    const waterY = h * 0.66;
    const drift = kit.loop(16);
    const cx = kit.cx;
    const cy = h * 0.42;
    const ringR = kit.u(0.22);

    // two faint moons
    kit.fig.moon(kit, w * 0.22, h * 0.16, 0.04, 0.7, "#dfe6ff");
    kit.fig.moon(kit, w * 0.8, h * 0.18, 0.035, 0.6, "#e0506a");

    const n = 6;
    const drawRing = () => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + drift * Math.PI * 2;
        const x = cx + Math.cos(a) * ringR;
        const y = cy + Math.sin(a) * ringR * 0.62;
        const open = 0.5 + 0.4 * (0.5 + 0.5 * Math.sin(kit.loop(10, i / n) * Math.PI * 2));
        // smaller haloed gates around the ring
        kit.fig.moongateArch(kit, x, y + kit.u(0.05), 0.08, 0.1, open);
        kit.register.glow(kit, x, y, 0.06, kit.palette.accent, 0.18);
      }
    };
    kit.fig.reflect(kit, waterY, drawRing);

    // figures passing freely between the gates — small gestural silhouettes on the shore
    kit.fig.figure(kit, cx - kit.u(0.1), waterY + kit.u(0.03), 0.13, 0.12, kit.palette.shade);
    kit.fig.figure(kit, cx + kit.u(0.1), waterY + kit.u(0.03), 0.13, -0.12, kit.palette.shade);

    kit.light.vignette(kit);
  },
});
