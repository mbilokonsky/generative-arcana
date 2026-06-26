# Ulysses "Vico" pixel pack — style guide

What the four suit packs must share so they read as one deck. Distilled from the 21 majors.

## The engine: Vico drives palette + light
Every card's **station** is its Vico age (read `card.station_slug` from `decks/ulysses/deck.json`:
`gods | heroes | men | ricorso`). The age picks the palette **and the compositional register**:

- **gods** — primal dark. Storm sky (`scatter` dark clouds, `falloff`), high contrast, a small focal
  subject under huge weather, an ember/lightning glow, **strong vignette (~0.55)**. Thunder, fire, the
  giant, the primal force.
- **heroes** — monumental twilight. `vgrad(sky_top→horizon)`, a low sun + glow, ONE large central
  form, long shadow, burnished bronze/purple, **medium vignette (~0.4)**. Grandeur edged with pride.
- **men** — flat civic daylight. Even fields (wall+floor or skyline+street), muted browns/greys,
  **many small equal figures** (`crowd`), minimal vignette (~0.2). The ordinary, none exalted.
- **ricorso** — dissolution. night→dawn `vgrad`, `scatter` fog, melting/`reflect`-ed forms, drifting
  motes, water, **soft vignette (~0.45, col=ink)**. Flux, dream, return.

Palettes live in `pixelkit.AGES[station]` with semantic keys: `sky_top/sky_bot/horizon`, `ground`,
`ink`, `bright`, `accent`, `ember`, `stone/stone_lt/stone_dk`, `figure`. Use the SAME keys across ages.

## Composition principles
1. **Background (age sky/ground) → midground → one clear focal subject → atmosphere overlay (glow/
   fog/vignette).** Always set the backdrop first, finish with vignette.
2. **One readable focal idea per card.** Iconic, not busy. Silhouettes read; use `shade()` for 2–3
   light tiers on any solid form (light upper-left).
3. **Rank modulates; age colors; suit is the subject.** A minor = its suit's core motif, arranged by
   the rank's idea, painted in the card's age. (e.g. Two = a pair/split; Trinity = three; The City =
   a foursquare frame; Recurrence = a ring/cycle; the face ranks Child/Father/Mother/Affirmation = a
   `figure` of the right scale + the motif.)
4. **Use the shared `motifs.py`** (figure, crowd, building, tower, column, headstone, key, net, organ,
   lamp, starfield, sky). Add new motifs there if reused; keep one-offs local.
5. **Gradients for skies/fog, hard pixels for forms.** Organic `scatter` (not `dither_rect`) for
   clouds/sea/fog so it isn't grid-uniform.

## Suit cores
- **towers** (Mythic Resistance — aspiration, vertical thrust, isolation, breaking): the `tower`
  (spire). Rank varies height/number/integrity (Five/Outsider = cracked/leaning; Affirmation = the
  tower whole and crowned).
- **keys** (Mythic Acceptance — wisdom, unlocking-without-breaking, flow): the `key`, locks, doors,
  thresholds opening. Gentle, never forced.
- **nets** (Mundane Resistance — entrapment, petty resentment, the nets flung at the soul): the `net`/
  mesh, snares, a figure caught/straining in it.
- **kidneys** (Mundane Acceptance — the body, nourishment, sensual pleasure, daily living): the
  `organ`/bean, food, hearth, cup, bed, the warm body. Warmest, most domestic.

## Output
- Recipe file `tools/pixel/suit_<suit>.py` exporting `CARDS = {slug: fn}` (slugs `towers-0`…`towers-13`).
- Render with `python tools/pixel/build.py --suit <suit>` → PNGs into `app/src/decks/ulysses/pixel/`
  and a `montage_<suit>.png` to review all 14 at once.
- **Iterate by looking**: render → Read the montage → critique → refine. Quality comes from this loop.
- Match the majors: Read a few of `app/src/decks/ulysses/pixel/major-*.png` first.
