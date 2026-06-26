# Suits — Dialectical

Derive the four suits as the cross-product of two dialectics drawn from the theme. The default: best when the theme has no obvious four-fold structure and you want suits sitting on its deepest tensions.

## 1. Identify dialectics

Surface 4–6 candidate dialectics — genuine axes of tension, presented individually (not pre-paired). For each: **thesis**, **antithesis**, **context** (how it relates to the theme, what deck it would inform).

Criteria: each a real axis of difference; together covering different facets; paired, suggesting distinct quadrants.

*Cyberpunk example axes:* Individual⟷Collective, Technology⟷Human, Control⟷Chaos, Flesh⟷Digital (each with a paragraph of tension).

Present candidates with their tensions; optionally flag generative pairings. Let the user pick two or propose their own. **Finalize two before proceeding.**

## 2. Cross-product into four ordered suits

Take the four pole-combinations. Each is a quadrant; interpret it through the theme into a suit. **Assign each suit an `index` (0–3)** — this order is fixed and load-bearing (the transversal's minor walk reads it, and the first suit's Ace is the deck's origin station). Choose an order that reads as natural progression if the dialectics suggest one; otherwise any stable order.

For each suit, per `references/schema.md` → `Suit`:
- **index** — 0–3.
- **name** — prefer a single evocative term. **slug** — lowercase, hyphenated.
- **description** — what this quadrant is, in the theme.
- **symbol** + **svg** — a glyph per `references/svg_symbols.md`; the four distinct at 16px.
- **meaning** — 3–6 upright senses (a palette) and 3–6 chiral inverted (`references/integration.md`).
- **visual_style** — the declared aesthetic: colors, perspective, art movement, composition.

## 2b. Record the dialectic on the deck

Because the suits ARE a cross-product, capture it as first-class data so consumers can lay them out as
a labeled 2×2 (don't make them re-derive it from prose). Emit a deck-level `dialectic` per
`references/schema.md` → `SuitDialectic`: the two named **axes** (each `{ name, poles: [thesis, antithesis] }`)
and a **cells** map placing every suit (`{ [suit_slug]: [poleOfAxis0, poleOfAxis1] }`). Only the
`dialectical` strategy emits this; `manual` suits omit `Deck.dialectic` entirely.

## 3. Intra-suit coherence

Decide how alike the four styles are — small controlled variations (a shared world) vs. wildly divergent visual languages. A deliberate choice, not a default.

*Cyberpunk "Individual+Technology" → "Programs" (index 0):* glyph a radiating node; upright {individual agency, technical mastery, composable specialization, crafted solutions}; inverted {isolated expertise, over-optimization, tools become chains, solution seeking problems}; style "neon wireframes (pink/green/blue, red for errors) over dark grounds; close-up interfaces; angular precise compositions."

Present the four ordered suits for feedback before Stage 2.
