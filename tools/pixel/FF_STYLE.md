# Final Fantasy "Elemental Wheel" chibi pixel pack — style guide

What every card shares so the deck reads as one set. The chibi direction: bold dark outlines, flat cel
fills, big eyes, clean rounded forms. NEVER soft-gradient 3D shading.

## The two engines (palette vs. content — keep them separate)

1. **Element = palette + light, NOT content.** Each card's `station_slug` (read it from
   `decks/finalfantasy/deck.json`) is one of `fire thunder earth holy ice water wind dark`. It picks
   the card's colors and lighting register only — lay it down first with
   `ff_flatkit.flat_backdrop(c, station)` and read scene colors from `ff_elements.ELEMENTS[station]`
   (keys: sky_top/sky_bot/horizon, ground, ink, bright, accent, glow, stone/stone_lt/stone_dk). The
   element is the weather; it never decides WHAT is in the frame.
2. **Card = content.** What's actually drawn — how many creatures, their poses, orientation, props,
   the staging — is dictated by the card's SUIT (which creature) and RANK (the idea), informed by the
   card's `meaning` + `visuals.detailed_description` in deck.json. Do NOT stamp one centered creature
   on every card. Compose.

## The creature vocabulary (your hero sprites)

`ff_chibi.chibi_chocobo / chibi_moogle / chibi_cactuar / chibi_tonberry (c, cx, feet, station)` draw the
full detailed hero, ~46px tall, centered on (cx, feet). Use the hero for single-subject cards (Ace,
the court, a lone trial). For other compositions you compose freely:
- **Multiple / smaller:** draw simplified MINIs from toolkit primitives (a small body fblob + the
  creature's ONE signature cue — chocobo: beak+crest; moogle: red pom; cactuar: right-angle stub limbs
  + O-mouth; tonberry: tan hood + lantern dot). Keep minis to the suit's silhouette.
- **Pose / orientation:** vary stance and facing. The cactuar especially should take different
  right-angle limb poses per card (limbs always perpendicular, shooting out, never crossing the body).
- **Props & scene:** roads, hearths, spines/fences, lanterns in the dark, crystals, the rank's object.

## Rank → composition idea (the RANK shapes the scene)

- **Ace (0):** the suit's pure seed — one hero + a single spark/origin of its essence.
- **Two (1):** a pair / a balance or tension between two.
- **Three (2):** three / first fruit, a small growth.
- **Four (3):** structure — a stable foursquare frame, something made solid.
- **Five (4):** conflict / disruption — a broken, contending, or scattered arrangement.
- **Six (5):** exchange / harmony — give-and-receive, reciprocity.
- **Seven (6):** the lone trial — one hero against a threshold/dark/doubt.
- **Eight (7):** craft in motion — dynamic, accelerating, several in movement.
- **Nine (8):** burden — near-fullness carried, many/heavy, the last hard stretch.
- **Ten (9):** fullness / overflow — the most, the cycle complete and brimming.
- **Freelancer (10):** the fresh beginner — a single plain hero, all potential.
- **Knight (11):** the active vocation — the hero posed in deed/action, a tool raised.
- **Sage (12):** mastery — the hero calm, inward, knowing; quieter, centered.
- **Warrior of Light (13):** the realized capstone — grand, radiant, crowned; the hero at full power.

## Suit cores (what the creature MEANS — express it)

- **Chocobo** (Boon·Journey): the road, motion, travel, freedom, glad arrival, help on the way.
- **Moogle** (Boon·Place): hearth, home, community, shelter, the saved moment, kupo-warmth.
- **Cactuar** (Bane·Place): territory, boundary, the guarded ground, spines, the sudden needle.
- **Tonberry** (Bane·Journey): the inexorable passage, the slow lantern-lit march, mortality, reckoning.

## Composition principles

1. Backdrop (`flat_backdrop`) → midground/scene → focal subject(s) by rank → finish.
2. ONE clear readable idea per card. Iconic, not busy. Silhouettes read.
3. Flat fills + bold outlines. Use `ff_flatkit` helpers: `fblob`(flat ellipse+outline), `fe`(flat
   ellipse), `frect`, `capsule`(rounded bendable limb), `blade`, `eye`, `cel`, `OUT`(outline color).
   Pull scene colors from `ELEMENTS[station]` so everything sits in the element's world.
4. The hero keeps its identity colors (chocobo yellow, moogle cream+red pom, cactuar green, tonberry
   tan robe + green head + amber eyes + lantern + chef's knife); the element lights the WORLD around it.

## Output & loop

- One module `tools/pixel/ff_chibi_<suit>.py` exporting `CARDS = {slug: fn}` where fn()->Canvas, slugs
  `<suit>-0` … `<suit>-13` (0-based rank index; matches deck.json card slugs).
- Render + review:  `python tools/pixel/ff_build.py --suit <suit>`  (run from repo root) →
  PNGs into `app/src/decks/finalfantasy/pixel/` + `tools/pixel/ff_montage_<suit>.png`.
- **Iterate by looking**: render → Read the montage → critique → refine. Quality comes from the loop.
