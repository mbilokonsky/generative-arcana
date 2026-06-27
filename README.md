# Generative Arcana

Three things that go together:

1. **A method** for designing thematically coherent custom tarot decks, woven from four symbolic
   axes — suit, rank, a transversal substrate (generalizing tarot's Chaldean/decan order), and the
   prime/composite factorization of each card's number. Packaged as a Claude skill.
2. **A deck corpus** — the decks themselves, as portable, renderer-agnostic JSON. A `deck.json` carries
   only *data* (meanings, structure); it holds **no visual information**.
3. **An app** that renders those decks and composes readings into a shareable link any LLM can
   interpret. A static site that builds to GitHub Pages.

The split is deliberate: a deck is data; *how it looks* is a separate, pluggable layer. A deck can ship
one or more named **skins**, and each card's renderer is resolved per card — a typed p5 "kit" sketch, a
raw p5 sketch, or a static image — so the same deck data can wear animated generative art, hand-built
pixel art, scanned illustration, whatever. Skins are selectable in the browser.

The bundled decks:

| Deck | Cards | Transversal | Skin(s) |
|------|------:|-------------|---------|
| **The Ultima Tarot** | 78 | the eight Virtues | animated p5 (kit) |
| **The Byrne Journey Tarot** | 78 | The Room | illustrated images |
| **Ulysses Tarot** | 77 | Vico's Cycle | animated p5 · Pixel (Vico) |
| **Final Fantasy Tarot** | 78 | the Elemental Wheel | Pixel (chibi) |

## What's in here

```
skill/generative-arcana/      the method, as a Claude skill (SKILL.md + references/ + strategies/)
generative-arcana-v2.0.zip    the same skill, packaged for one-click install
decks/<id>/deck.json          the deck corpus — portable, renderer-agnostic data (no visuals)
app/                          the renderer (Vite + React + TypeScript)
tools/pixel/                  the Python pixel-art pipeline for the image skins
.github/workflows/deploy.yml  builds app/ and deploys to GitHub Pages
```

## The skill

The skill teaches Claude to generate a complete deck as a single JSON file. Read
**[`skill/generative-arcana/SKILL.md`](./skill/generative-arcana/SKILL.md)** for the formalism; the
`references/` define the schema and integration rules, and `strategies/` are the per-stage generators.

**Install:** upload **`generative-arcana-v2.0.zip`** to Claude (Skills), or copy
`skill/generative-arcana/` into your skills directory. Then ask for a deck — e.g. *"design a deep-sea
mythology tarot deck"* — and it emits a `deck.json`. Drop it under `decks/<id>/` and the app can render it.

This is **v2.0**: the prime/composite axis is stored as an authored `factorization` gloss on the majors
(a gloss that won't cohere signals a miscast slot); stations carry a concise `description` and optional
`symbol`; numbered ranks carry a `{suit}`-placeholder `question`; suits may be a `dialectic` cross-product.

## The app

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # -> app/dist (static)
```

- **[app/README.md](./app/README.md)** — architecture, the visual-skin system, adding a deck or skin.
- **[app/PRINCIPLES.md](./app/PRINCIPLES.md)** — the Ultima p5 illustration spec (suit = line, virtue = light, number = composition).

Landing → pick a deck (bundled or paste your own `deck.json`) → an "about" page with a four-axis
explorer → a filterable card browser (with a skin selector) → a reading composer (question + spread →
dealt cards, inversion-aware, + a compact shareable URL and a self-contained LLM prompt). The chrome is
a token-based design system: a light core theme with a per-deck "world" (`data-theme`) for each deck.

```
app/src/
  runtime/     the visual-skin registry + the p5 kit engine (lighting, registers, figures) — no React
  components/  card UI: CardArt (resolves a card's skin), CardFrame, CardModal, DeckGrid, TarotCard, RawP5Card
  decks/       the deck LAYER: registry, types, generic spreads, paste-loader, and each deck's skin(s)
               (cards.ts / cards/) — reads deck DATA from the top-level decks/ via @decks
  reading/     deal, encode/decode the reading token, build the LLM prompt
  styles/      the design-system tokens (light core + per-deck themes)
  app/         the shell: hash router, landing, deck about (axis explorer), browser, reading
```

`@` → `app/src` (the renderer); `@decks` → the top-level `decks/` corpus (the data).

## Deploy (GitHub Pages)

Pushing to `main` runs [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds
`app/` (Vite reads `../decks` for deck data) and publishes it. Enable Pages with **Source: GitHub
Actions**. The build uses a relative base, so it works under `https://<user>.github.io/generative-arcana/`.
