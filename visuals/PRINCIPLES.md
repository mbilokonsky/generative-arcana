# The Ultima Tarot — Illustration Principles

These principles govern every animated card in the deck. They exist so that 78 hand-authored
p5 sketches read as **one deck** — coherent in light, palette, and motion — while each card
illustrates something true only of itself. They are the visual restatement of the deck's own
generative grammar: *declare the suit, sublimate the station, originate the scene.*

---

## 1. The three axes become three visual layers

The deck is woven from four axes. Three of them have a direct visual job; the fourth is a tint.

| Axis | In the JSON | On the card | Directive |
|---|---|---|---|
| **Suit** | `suit.visual_style` | the **rendering register** — linework, palette, texture | **declare** (foreground) |
| **Rank** | `rank.visual_content` | the **subject** — what is depicted | **declare** (foreground) |
| **Station (virtue)** | `station.visual_motif` | the **light** — color temperature, source, motion of the light | **sublimate** (it is the weather, never the subject) |
| **Number (prime/composite)** | derived | the **composition logic** — singular vs. assembled | **latent** (a tint, used only when it sharpens) |

The single most important rule follows from this table: **the station is light, not an object.**
Two cards showing the same scene on different stations must *feel* different before a word is read.
Never draw "a small virtue-symbol in the corner." Draw the time of day the virtue is.

---

## 2. The station is the soul of the motion

Animation is not decoration laid on top of a still image — it is how the station lives. Each of the
eight virtues has a signature behavior of light that the runtime supplies as a **lighting kernel**:

- **Honesty** — flat, even, merciless noon. *Does not flicker.* Nothing is occluded; no shadow hides anything. Stillness is the animation.
- **Compassion** — a low warm hearth-glow that **breathes** slowly, edges soft, everything enfolded.
- **Valor** — a hard frontal charge, the **held tension before a storm**; a single bright focal point, the air faintly electric.
- **Justice** — **two balanced sources**, light from both sides in equilibrium; a poised, weighted stillness, the pause before a verdict.
- **Sacrifice** — a reddened **ember pulse**, something spending itself to give warmth; the glow slowly depletes and rekindles.
- **Honor** — a formal **vertical** light, columnar and held; burnished, ceremonial, a standard raised. Upright and a little cold.
- **Spirituality** — **sourceless** radiance that drifts; light from everywhere and nowhere, weightless, haloed, rarefied.
- **Humility** — a low, level, **earthbound** dusk that settles downward; small under a wide sky, weight returning to the soil.

A card *uses* its kernel: `kit.light.wash()` lays the station's ground; `kit.light.pulse(t)` gives the
card a single 0–1 value carrying the station's heartbeat (the ember's breath, the drift, the charge) that
the scene's own motion can ride. **You never name the virtue. You let it be the lighting on the set.**

---

## 3. The suit is the hand that draws

Where the station is light, the suit is **line and surface** — the rendering register, declared and visible:

- **Crowns** — heraldic & civic: gold-leaf on parchment, **symmetrical** frontal compositions like a coin or seal, gilded double-lines, royal blue ink. Ordered, balanced, illuminated-margin borders.
- **Blades** — stark woodcut: iron-grey and blood-iron-red on storm/cave grounds, **hatched** shading, high-contrast, angular, kinetic diagonals. The bite of an early manual woodcut.
- **Runes** — illuminated manuscript: deep indigo and **gold ink**, flattened iconographic space, glyphs glowing in the margins, candle-quiet. Sacred-book flatness, not perspective.
- **Moongates** — luminous nocturne: phosphor-red and silver-blue on indigo night, **soft glows and bloom**, rounded haloed forms, reflective water, the shimmer of an opening gate.
- **Major Arcana** — the superset register: all four fused into full-bleed frontispiece illumination, an ankh recurring, more ornate and hieratic than any single suit.

The register is delivered through `kit.register` and `kit.fig` (reusable forms drawn *in* the current
register). A sword drawn by the Blades register is hatched and angular; the same primitive in the major
register is gilded. The shared forms guarantee family resemblance; the register guarantees suit identity.

---

## 4. "Ah — I see it." (Fidelity target)

The art is **semi-figurative, leaning figurative**. The bar: a viewer who reads the card's
`detailed_description` and looks at the animation should think *"yes, I see it"* — even if they could not
have named the scene cold. So:

- **Compose the real scene.** If the description says a lone figure steps from a moongate onto an empty road, there is a figure, a gate, a road, a horizon — in clean vector form, in the suit's register, under the station's light.
- **Simplify toward the iconic, not the cartoonish.** Heraldic silhouettes, manuscript flatness, woodcut massing. We are illustrating a *tarot card*, which has always stylized rather than rendered. Lean on that license.
- **Faces and fine anatomy are where vector code fails** — keep figures as gestural silhouettes and postures (a bowed head, a raised arm, a kneeling line), never detailed faces. Posture carries the meaning.
- **Let light and motion do the emotional work** the linework can't.

---

## 5. A tarot card breathes; it does not strobe

- **Ambient, slow, seamless.** Motion is on the order of a breath (3–12s cycles), looping without a visible seam. The card should be calm enough to contemplate and read a spread by.
- **Loop-friendly time.** Use the runtime's looping clock and phase relationships, not raw frame counts, so a card looks the same on every machine.
- **Reduced motion is first-class.** Under `prefers-reduced-motion` (or grid-thumbnail mode) the card renders a single deterministic **poster frame** — its most legible instant — and stops. Every card must have a poster that reads.
- **Performance is a feature.** Off-screen cards pause. A 78-card browser cannot run 78 live loops; the grid shows posters and only the focused/expanded card animates.

---

## 6. Interactivity is a reading, never a gimmick

Every card may carry one **interactive affordance**, and it must *express the card's meaning*:

- **The Two Moons** (duality, the threshold): the pointer's horizontal position shifts which moon waxes; as you bring the cursor to the gate, the lone figure leans toward crossing. Clicking commits the step (`signal('cross')`). The card is *about* the nerve to choose a threshold — so the interaction is choosing a threshold.
- **Ace of Runes** (the first word emerging): the rune completes its strokes toward the pointer and its sourceless motes gather where attention falls — meaning surfacing under regard.
- **Eight of Moongates** (mastery of passage): the path of gates lights *ahead of where you look*, the way sure intuition lights the next step.
- **Five of Blades** (the grim ground of conflict): the field's fallen blades catch a cold glint toward the cursor; there is nothing to "win" by interacting — the affordance refuses triumph, which is the card's point.

Principle: if the interaction could be swapped onto any other card unchanged, it is wrong. The easter
egg is a tiny enactment of the upright meaning. Default state (no pointer) must always be complete and
beautiful on its own — interaction is a grace note, not a requirement.

---

## 7. The number, used sparingly

The prime/composite character (latent in the deck) becomes an optional **compositional logic**:

- **Identity (Ace / 0 / 1)** — a single, central, originating form; lots of void around it.
- **Prime** — one **irreducible** focal element that does not decompose into parts; resist visual factoring. The doubly-atomic majors (The Three Principles, The Tamed Wyrm, The Daystar) lean hardest into a single unsplittable radiance.
- **Composite** — the scene visibly **assembles from repeated or factored units** (Four = a 2×2 / foursquare structure; Eight = 2³, a built sequence; Six = 2×3, two triads in accord).

Use it when it sharpens the image; ignore it when it would be noise. Most cards never need it.

---

## 8. Determinism & the safe frame

- **Seeded.** Every card seeds p5's RNG and noise from its slug, so it looks identical on every load while every card differs. No `Math.random()`.
- **Resolution-independent.** All geometry is expressed in `kit.u(fraction)` of the card's short side; cards are correct at a thumbnail and at full-bleed. Retina via `pixelDensity`.
- **Respect the banner.** The host draws the Suit+Rank+name banner as a DOM overlay; the card keeps focal content inside `kit.safe` (clear of the top title band and the rank corner). Atmosphere may go full-bleed underneath.

---

### The one-line test for any finished card
> Cover the banner. Can a stranger feel the **suit** in the linework, read the **subject** of the rank,
> sense the **virtue** purely as the light — and *not* be able to name that virtue? If yes, the card is right.
