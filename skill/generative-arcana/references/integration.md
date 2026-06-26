# Integration

Every card is an integration over its axes. This file defines that pass. It is the same regardless of which strategies built the axes. Two outputs are produced here for every card and stored on it: the integrated **meaning** (`{upright, inverted}` prose) and the integrated **visual** (`detailed_description`). A **major** produces a third — its **factorization gloss** (`factorization.gloss`); a minor does not (its number is its rank's). Everything else about a card is reference.

## The three directives

The four axes hand the integrator material with different marching orders. This asymmetry is the design; honor it.

**DECLARE — suit, rank, major-arcana-as-suit.** Foreground it. The axis is *visible* on the finished card: its glyph is stamped, its style or content is plainly present, its meaning is read directly. Suit declares **style**; rank declares **content**; the major-arcana suit declares **style**.

**SUBLIMATE — transversal station.** Dissolve it. The station is handed to you *explicitly and in full* — name, charge, motif — precisely so you can integrate it *well*, not restate it. Its contribution becomes the card's **key signature**: palette temperature, quality of light, density, the compositional constraint the declared scene plays out *within*. It is the lighting on the set, not a character in the scene; the key the melody is in, not a note. A novice reads suit and rank and never names the station — yet the station is structuring what they feel. It is **not occult to the structure**; it is an ordinary axis with an extraordinary instruction. Make it explicit *to yourself* to sublimate it; do not make it explicit *on the card* by default.

**LATENT in the weather; GLOSSED on the majors — prime/composite (the numeric axis).** In the *meaning and visual* it stays an undertone, never declared: a prime card reads more irreducible, a composite as derived from its factors, an identity as precondition or pure operator — leaned on where it clarifies, ignored where it would be noise. On a **major** its **gloss is also authored and stored** (`factorization.gloss`) — the one place the axis is written plainly, read as a quality signal when it resists; on a **minor** it stays purely latent (the number is the rank's, so the gloss, if any, lives on the rank). See `references/numeric_axis.md`, including the gloss-as-signal rule and the station resonance ("extra prime" reinforcement, crossing tension).

## Surfacing

Sublimation is a default, not a vow. A card may let its station rise above the fold *when the card's own needs call for it* — most don't, and most pips shouldn't. This is a per-card judgment, not a rule keyed to card class: ask whether *this* card is better served naming its key signature or letting it stay weather. When in doubt, keep it weather. When a card *does* surface — and only then — it may also let the station's `symbol` (if it has one) appear in the scene: the tasteful, occasional flourish of `references/svg_symbols.md`, never the default.

## Producing the integrated meaning

For each orientation (upright, then inverted):

1. **Gather the palettes.** Collect `meaning[orientation]` from each axis the card sits on: suit + rank for a pip (none for a major's "suit"), plus the station's charge. Suit and rank are declared inputs; the station is a sublimated input; the numeric character is a latent input you may consult.
2. **Synthesize, don't concatenate.** Read the declared palettes *against each other* and write prose describing what this specific intersection means in this theme — usable by a reader in a spread. Two or three sentences. Say something neither axis says alone.
3. **Fold the station in as valence.** Let the station's charge color the synthesis — warm/cold, expansive/constrained, fated/free — *without naming it*, unless this card is surfacing. The station is why two cards with the same suit+rank charge read differently on different stations.
4. **Optionally let the number tint it.** If the card's prime/composite character (or its resonance with the station) clarifies the reading, let it — a prime card's meaning resisting decomposition, a composite's leaning on its factors. Skip silently if it doesn't help.
5. **Write one integrated string** per orientation into `card.meaning`.

Inversion is **chiral**, never negation — the same energy turned shadow, excess, blocked, or misdirected:
- growth, abundance → overextension, waste, excess without purpose (not "stagnation")
- clarity, revelation → blinding certainty, truth without mercy (not "confusion")
- community, belonging → enmeshment, loss of self, forced conformity (not "isolation")

## Producing the integrated visual

Write one `detailed_description`: a single, concrete, unique scene specific enough that an illustrator implementing it would produce an image sharing a recognizable **style** with the suit, recognizable **content** with the rank, and a felt **key signature** from the station, while depicting something true only of *this* card.

Compose by directive:

- **Style — DECLARE (suit).** `suit.visual_style` as the rendering register (major cards: `major_arcana.visual_style`). Bend via `style_override` only if needed; else inherit.
- **Content — DECLARE (rank).** `rank.visual_content` as the thing depicted, specialized concretely for this suit (major cards: content from the chosen majors strategy). Bend via `content_override` only if needed; else inherit.
- **Key signature — SUBLIMATE (station).** `station.visual_motif` sets the *conditions* the scene obtains under — light, color temperature, spatial constraint, atmosphere — not an object in the frame. By default, never "a small [station symbol] in the corner": write the scene as though the station were the time of day it happens at. (Lone exception: a card deliberately *surfacing* its station may let the station's `symbol` appear — rare and chosen, per `references/svg_symbols.md`.)
- **Numeric undertone — LATENT (optional).** A prime card's image may feel more singular and unfactorable; a composite's may visibly carry the trace of its factors. Use only if it sharpens the image.

The test: a reader names the suit and rank from the picture and cannot name the station — yet remove the station and the picture loses its weather.

### Worked sketch

*Card: the "Five" rank ("what emerges under pressure?") × a "Currents" suit (cold tidal blues, deep-focus, drifting composition) × the "Ebb" station (withdrawal, low tide, the receding; cool thinning light). Five is prime — an irreducible pressure.*

- meaning.upright: pressure revealing what was submerged — but read through Ebb, a *receding* revelation: not a flood breaking but a tide pulling back to leave the structure bare. What emerges does so by subtraction. (Five's primality reinforces the irreducibility — this is a pressure that won't decompose into gentler parts.)
- detailed_description: "A drowned colonnade at the lowest tide, cold blue-green water thinned to a film over the flagstones, deep-focus drawing the eye down a receding row of salt-crusted pillars; the light is flat and withdrawing, as if the scene were being exhaled — barnacled thresholds emerge not by rising but by being left behind." (Suit style declared in palette and deep-focus; rank content declared in the pressure-reveal; Ebb sublimated entirely into the withdrawing light and the by-subtraction logic — never an "ebb symbol"; Five's primality felt as the unsoftenable starkness.)

## Producing the factorization gloss (majors only)

This step runs **only for major cards** — a minor's number is its rank's, so minors produce no `factorization` here (a rank's optional gloss is authored back in Stage 4, chiefly under `strategies/ranks/prime_scaffold.md`).

For each **major**, write `factorization.character` (derived: identity/prime/composite), `factorization.factors` (derived; composites only), and `factorization.gloss` (authored — one or two sentences on what the number's character means *for this major*):

- **Identity / prime** — name the precondition (0), the transparent operator (1), or the irreducible energy (prime), in this trump's own terms. Don't over-explain a prime; its point is that it simply *is*.
- **Composite** — make the factor-**majors** meet: an x² as the base major stabilized into structure, an x³ as mastery or excess, an x⁴ as collapse/breakthrough, an x·y as "what happens when [Major x] meets [Major y]."

**The gloss is a signal, not a checkbox.** If it won't follow from the factor-majors, the slot is probably miscast or a factor-major mis-defined — revise rather than write around it (`references/numeric_axis.md` → "The gloss as signal"). When the majors were *generated* from their primes (`majors/primes.md`) the gloss should be load-bearing and tight; when built another way (journey/borrowed), a brief honest note suffices — but still write one.

## Checklist

- Meanings synthesized, not concatenated; station as valence, named only when surfacing; numeric tint optional.
- Inversions chiral.
- One concrete, unique `detailed_description`; style/content declared, station sublimated into conditions.
- Each **major's** `factorization.gloss` authored and coherent — follows from its factor-majors (composite), names the irreducible energy (prime), or the precondition/operator (identity). A forced gloss is signal to recast the slot, not a box to tick. (Minor cards carry no gloss.)
- Overrides written only where a card actually deviates; otherwise inherit.
