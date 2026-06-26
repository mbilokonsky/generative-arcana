# Transversal — Chaldean

Use the seven classical planets, in Chaldean order, as the substrate axis — the literal traditional transversal. Best for esoteric, astrological, alchemical, or classical themes where the planets genuinely belong.

Read `references/tarot_structure.md` → "The Chaldean Decan Order" first.

## The seven stations

Canonical order (index 0→6), slowest to fastest:

**Saturn · Jupiter · Mars · Sun · Venus · Mercury · Moon**

Fixed and meaningful — a descent from the slow, heavy, bounding outer planets inward to the swift, personal Moon. Record it as `ordering_rationale`. N = 7 ≥ 4 (each rank's four suits land on distinct stations), and although 7 divides the 14-rank suit length, the diagonal minor walk keeps it cross-cutting (see schema → "The walk").

For each station, a `Station` per `references/schema.md`:
- **index** — 0–6 in the order above.
- **description** — a concise one-line gloss of the planet's register (Saturn: "limit, time, and structure"; Venus: "attraction, harmony, and value"; Mars: "drive, the cut, courage"). For the meta-layer.
- **meaning** — the planet's classical charge, upright and chiral-inverted (Saturn: limitation/time/structure/discipline ↔ rigidity/dread/sterile delay; Venus: attraction/harmony/value ↔ indulgence/vanity/appeasement; Mars: drive/cut/courage ↔ aggression/heat/wound; etc.). Carried as valence, sublimated unless a card surfaces.
- **symbol** — the planet's glyph (☉ ☽ ☿ ♀ ♂ ♃ ♄), authored as SVG per `references/svg_symbols.md` (not just the unicode code-point). The planets are the *canonical* station symbol: well-loved, instantly legible, and apt to surface tastefully on a trump that genuinely *is* its planet.
- **visual_motif** — palette temperature, light, density, compositional constraint — NOT a depicted planet. (Saturn: cold, leaden, heavy-bounded, sparse, downward weight. Sun: central, radiant, gold, symmetrical, high-key. Moon: silvered, ambiguous, reflective, tidal, low contrast.) These dissolve into cards per `references/integration.md`.

## The walk (structural)

Deterministic from the canonical order (schema → "The walk"). N = 7, and the per-suit kick `suit_stride` defaults to 1 (any value coprime to 7 works). The minor walk is `(rank_index + suit_stride · suit_index) mod 7` with the first suit's Ace at Saturn (station 0); the major walk is `major_number mod 7` from Major 0 at Saturn. Every card — pip, court, and trump — gets a station. The kick is what keeps the seven-station cycle cross-cutting across the 14-rank suits (a plain count would collapse, since 7 divides 14); traditional tarot supplied the same de-alignment by scattering each suit across non-adjacent triplicities.

**Folding the planetary ring.** `suit_stride` 1 gives a close voicing — the four suits land on four adjacent planets (Saturn, Jupiter, Mars, Sun). Unfolding to 2 or (maximally) **3** spreads them around the ring, juxtaposing slow and fast planets across the suits — a Saturn suit beside a Sun suit beside a Moon suit. The Chaldean order's slow→fast gradient rewards this; reach for stride 3 when you want each rank to strike a wide planetary chord rather than a tight one (schema → "The walk" for the general rule). The trumps that land on a station they embody are good candidates to *surface* their station per `references/integration.md` — a per-card judgment.

## Resonance to watch (optional)

With N = 7 the prime-position stations are at indices 2, 3, 5 (Mars, Sun, Venus by the order above). A card that is **numerically prime** *and* lands on one of these is "extra prime" — doubly-irreducible (`references/numeric_axis.md`). Lean into that where it clarifies; ignore it otherwise.
