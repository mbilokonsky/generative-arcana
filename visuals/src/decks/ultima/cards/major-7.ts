/**
 * The Quest (Major 7) — station Humility, number 7 (irreducible).
 * A lone rider on a plain road crests a low hill at dusk, the land settling earthbound and
 * wide around them, a distant goal no more than a notch on the horizon; the figure is small
 * under an enormous dimming sky, ankh-standard furled, set on going anyway. The light is
 * humility's: low, level, earthbound dusk, weight returning to the soil.
 * Interactivity (a reading of the card): the pointer marks the goal on the horizon and the
 * rider presses on toward it — humility is going anyway, the small step under the wide sky.
 */
import { registerCard } from "@/runtime/defineCard";
import type { SketchKit } from "@/runtime/types";

const S = new WeakMap<SketchKit, { goal: number; press: number }>();
const state = (k: SketchKit) => {
  let s = S.get(k);
  if (!s) { s = { goal: 0.72, press: 0 }; S.set(k, s); }
  return s;
};

export default registerCard({
  slug: "major-7",

  draw(kit) {
    const { p, w, h } = kit;
    const s = state(kit);
    kit.light.wash(kit); // humility: low earthbound dusk, settling downward

    const settle = kit.light.pulse(kit.t); // the slow sinking of the dusk
    const horizon = kit.h * 0.74; // a LOW horizon — the sky takes most of the frame

    // --- the vast dimming dusk sky (most of the frame) ---
    p.push();
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#0b0820");
    sky.addColorStop(0.55, "#241a3a");
    sky.addColorStop(0.85, `rgba(120,78,86,${0.55 + 0.15 * settle})`); // dusk band
    sky.addColorStop(1, `rgba(190,130,96,${0.5 + 0.2 * (1 - settle)})`); // warm low glow
    ctx.save();
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon + kit.u(0.01));
    ctx.restore();
    p.pop();

    // a few faint early stars high in the dimming sky
    p.push();
    p.noStroke();
    for (let i = 0; i < 22; i++) {
      const sx = kit.rng() * w;
      const sy = kit.rng() * horizon * 0.55;
      p.fill(255, 255, 255, 30 + 35 * Math.sin(kit.t * 0.4 + i) * (1 - settle * 0.5));
      p.circle(sx, sy, kit.u(0.003));
    }
    p.pop();

    // the dimming sun, low and nearly set, a soft earthbound glow
    const sunX = w * 0.78;
    const sunY = horizon - kit.u(0.01);
    kit.register.glow(kit, sunX, sunY, 0.16, "#e8a86a", 0.35 + 0.1 * (1 - settle));
    p.push();
    p.noStroke();
    p.fill(`rgba(232,168,106,${0.4 + 0.12 * (1 - settle)})`);
    p.circle(sunX, sunY, kit.u(0.07));
    p.pop();

    // --- the wide settling land: a low hill the rider crests, layered earthbound bands ---
    p.push();
    p.noStroke();
    // far flat land
    p.fill("#1a1426");
    p.beginShape();
    p.vertex(0, horizon);
    for (let x = 0; x <= w; x += kit.u(0.03)) {
      p.vertex(x, horizon + p.noise(x * 0.004, 11) * kit.u(0.02));
    }
    p.vertex(w, h);
    p.vertex(0, h);
    p.endShape(p.CLOSE);
    // the low hill in the mid-foreground that the rider crests
    p.fill("#120e1e");
    p.beginShape();
    p.vertex(0, h);
    p.vertex(0, horizon + kit.u(0.08));
    for (let x = 0; x <= w; x += kit.u(0.02)) {
      // a single gentle rise peaking under the rider, settling to either side
      const crest = Math.exp(-Math.pow((x - w * 0.46) / (w * 0.34), 2)) * kit.u(0.07);
      p.vertex(x, horizon + kit.u(0.08) - crest + p.noise(x * 0.006, 3) * kit.u(0.01));
    }
    p.vertex(w, horizon + kit.u(0.08));
    p.vertex(w, h);
    p.endShape(p.CLOSE);
    p.pop();

    // --- the plain road, a pale thread climbing the hill toward the goal ---
    const crestX = w * 0.46;
    const crestY = horizon + kit.u(0.01);
    p.push();
    kit.register.stroke(kit, 0.012, "#3a2f44");
    p.noFill();
    p.beginShape();
    p.vertex(w * 0.5, h);
    p.quadraticVertex(crestX + kit.u(0.04), h * 0.88, crestX, crestY);
    p.endShape();
    p.pop();

    // --- the distant goal: a tiny notch on the horizon (a far spire/keep) ---
    const goalX = s.goal * w;
    const goalY = horizon;
    p.push();
    p.noStroke();
    p.fill("#0c0a16");
    p.rect(goalX - kit.u(0.006), goalY - kit.u(0.03), kit.u(0.012), kit.u(0.03));
    p.triangle(goalX - kit.u(0.009), goalY - kit.u(0.03), goalX + kit.u(0.009),
      goalY - kit.u(0.03), goalX, goalY - kit.u(0.045));
    p.pop();
    kit.register.glow(kit, goalX, goalY - kit.u(0.03), 0.03, kit.palette.accent,
      0.2 + 0.4 * s.press);

    // --- the small lone rider cresting the hill: horse + figure, gestural, SMALL ---
    const near = kit.pointer.inside;
    if (near) s.goal += (kit.pointer.x - s.goal) * 0.04; // pointer marks the goal
    s.press += ((near ? 1 : 0) - s.press) * 0.04;
    // the rider presses toward the goal: a small drift along the crest
    const ride = crestX + (goalX - crestX) * 0.14 * s.press
      + Math.sin(kit.t * 0.4) * kit.u(0.004);
    const rideY = crestY - kit.u(0.002);
    const scale = kit.u(1); // unit

    p.push();
    p.translate(ride, rideY);
    p.noStroke();
    p.fill(kit.palette.shade);
    // horse body (a low gestural mass)
    p.beginShape();
    p.vertex(-0.05 * scale, 0);
    p.vertex(-0.055 * scale, -0.022 * scale);
    p.vertex(0.02 * scale, -0.03 * scale);
    p.vertex(0.05 * scale, -0.024 * scale); // neck base
    p.vertex(0.06 * scale, -0.05 * scale); // up the neck
    p.vertex(0.072 * scale, -0.05 * scale);
    p.vertex(0.066 * scale, -0.022 * scale);
    p.vertex(0.045 * scale, 0);
    p.endShape(p.CLOSE);
    // four suggested legs
    p.rect(-0.045 * scale, 0, 0.008 * scale, 0.03 * scale);
    p.rect(-0.02 * scale, 0, 0.008 * scale, 0.032 * scale);
    p.rect(0.025 * scale, 0, 0.008 * scale, 0.03 * scale);
    p.rect(0.05 * scale, 0, 0.008 * scale, 0.032 * scale);
    // the small rider seated upright on the horse's back
    p.fill(kit.palette.ink);
    p.beginShape();
    p.vertex(-0.012 * scale, -0.03 * scale);
    p.vertex(0.012 * scale, -0.03 * scale);
    p.vertex(0.016 * scale, -0.066 * scale);
    p.vertex(-0.016 * scale, -0.066 * scale);
    p.endShape(p.CLOSE);
    p.circle(0, -0.078 * scale, 0.022 * scale); // head

    // --- the ankh-standard, furled, carried upright by the rider ---
    p.stroke(kit.palette.accent);
    p.strokeWeight(kit.u(0.004));
    p.line(0.02 * scale, -0.066 * scale, 0.03 * scale, -0.12 * scale); // pole, slightly raked
    p.noStroke();
    // furled cloth: a tight wrap near the top of the pole
    p.fill(kit.palette.shade);
    p.beginShape();
    p.vertex(0.03 * scale, -0.12 * scale);
    p.vertex(0.04 * scale, -0.108 * scale);
    p.vertex(0.036 * scale, -0.082 * scale);
    p.vertex(0.028 * scale, -0.09 * scale);
    p.endShape(p.CLOSE);
    p.pop();
    // a tiny ankh finial atop the furled standard
    kit.fig.ankh(kit, ride + 0.03 * scale, rideY - 0.13 * scale, 0.03, kit.palette.accent);

    if (near && kit.pointer.pressed) kit.signal("press-on", { slug: "major-7" });

    kit.light.vignette(kit);
  },
});
