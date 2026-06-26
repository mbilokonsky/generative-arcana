# Transversal — Themed Cycle

Build the substrate axis from a canonically-ordered cycle native to the theme — the general case, the move that makes the transversal a true generalization rather than a planetary bolt-on. Best for any theme with its own sequence that *means something in order*.

Read `references/tarot_structure.md` → "The Chaldean Decan Order" to see the template you're re-instantiating; you abstract its *function*, not its planets.

## 1. Choose the cycle

Find a sequence in the theme satisfying all four properties — miss any and it's decoration, not a transversal:

1. **A small fixed alphabet of N stations** (roughly 5–9, small enough to recur visibly across 78 cards).
2. **A canonical order that carries meaning** — a process, descent, maturation, or circuit, not an arbitrary list.
3. **N skew to the grid** — N ≥ 4 (so each rank's four suits land on distinct stations). The per-suit kick `suit_stride` (coprime to N, default 1) keeps the cycle cross-cutting regardless of whether N divides 14, so a meaningful 7-cycle is fine — don't reject it on coprimality grounds. **Avoid N = 4** (you'd just re-derive the suits).
4. **A cross-cutting payoff** — walking it should create families ("all the [station] cards") that slice diagonally to the suits.

*Candidate cycles:* the seven alchemical operations (calcination → dissolution → separation → conjunction → fermentation → distillation → coagulation); the seven OSI layers or a boot sequence; lunar/tidal phases or depth zones; the modes of a scale or the circle of fifths; days of creation; a hero's circuit. Many *historically rhyme with the planets* — a feature.

State the cycle and its order as `ordering_rationale`.

## 2. Build the stations

For each, a `Station` per `references/schema.md`:
- **index** — position in the canonical order (0-based).
- **description** — a concise one-line statement of what the station represents, for the meta-layer (legends, filters, the card detail table). One plain sentence.
- **meaning** — its charge in the theme, upright and chiral-inverted. Carried as valence, sublimated by default.
- **symbol** *(optional)* — a small glyph for the station, if one is natural to the cycle (per `references/svg_symbols.md`). Used in the meta-layer, and — rarely, by exception — surfaced on a card that embodies the station. Leave unset if no honest glyph exists; a forced station glyph is worse than none.
- **visual_motif** — palette temperature, light, density, the compositional constraint the scene plays out within. *Conditions, not objects.* (For "calcination": scorched, high-contrast, reduced-to-essentials, ash-and-ember. For "physical layer": raw, granular, low-level, copper-and-noise.)

## 3. The walk (structural)

Nothing to anchor. The minor walk is `(rank_index + suit_stride · suit_index) mod N` from the first suit's Ace at station 0; the major walk is `major_number mod N` from Major 0 at station 0 (schema → "The walk"). `suit_stride` defaults to 1 and must be coprime to N — the kick that de-aligns the suits so the cycle cross-cuts even when N divides 14. Every card gets a station. Where a card sits on a station it plainly embodies, it may *surface* it (`references/integration.md`) — a per-card judgment.

**Folding.** `suit_stride` is how wide a chord the four suits strike through the cycle: 1 is a close voicing (suits on adjacent stations), and unfolding toward ⌊N/2⌋ spreads them — more correspondence surface, less legibility. The unfold target is N-relative (the largest coprime ≤ ⌊N/2⌋); see schema → "The walk." Default to 1; unfold where the theme wants denser cross-suit rhymes.

For the deeper question of *what a transversal is for* — why it must be a qualitative register orthogonal to the grid rather than a third category, and how the decans generalize — see `references/tarot_structure.md` → "What a decan captures." A good cycle is the theme's *second worldview*, not a second taxonomy.

## 4. Resonance to watch (optional)

The station at a prime position in the canonical order is "transversally prime." A numerically-prime card landing there is doubly-irreducible (`references/numeric_axis.md`); a composite landing there, or a prime on a composite-position station, is a productive crossing. Soft tool — lean in where it clarifies, ignore otherwise.
