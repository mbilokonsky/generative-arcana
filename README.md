# Generative Arcana

Three things that go together:

1. **A method** for designing thematically coherent custom tarot decks, woven from four symbolic
   axes — suit, rank, a transversal substrate (generalizing tarot's Chaldean/decan order), and the
   prime/composite factorization of each card's number. Packaged as a Claude skill.
2. **A deck corpus** — the decks themselves, as portable, renderer-agnostic JSON. A `deck.json` carries
   only *data* (meanings, structure); it holds **no visual information**.
3. **An app** that renders those decks — illustrating each card generatively with **p5.js** — and
   composes readings into a shareable link any LLM can interpret. A static site that builds to GitHub Pages.

The split is deliberate: a deck is data; *how it looks* is an incidental, pluggable layer (p5 today;
could be SVG, AI-generated images, or scanned art tomorrow). The app pairs a deck with a visual pack by
deck id. The bundled deck is **The Ultima Tarot** (78 cards, themed on the *Ultima* games): four suits,
fourteen ranks, the **eight Virtues** as the transversal axis, and the factorization of each number.

## What's in here

```
skill/generative-arcana/      the method, as a Claude skill (SKILL.md + references/ + strategies/)
generative-arcana-v2.0.zip    the same skill, packaged for one-click install
decks/<id>/deck.json          the deck corpus — portable, renderer-agnostic data (no visuals)
app/                          the renderer (Vite + React + TypeScript + p5.js)
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
`symbol`; numbered ranks carry a `{suit}`-placeholder `question`.

## The app

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # -> app/dist (static)
```

- **[app/README.md](./app/README.md)** — architecture, the card-sketch interface, adding a deck or card.
- **[app/PRINCIPLES.md](./app/PRINCIPLES.md)** — the per-card illustration spec (suit = line, virtue = light, number = composition).

Landing → pick a deck (bundled or paste your own `deck.json`) → an "about" page (theme, suits,
ranks, the virtue axis) → a filterable card browser → a reading composer (question + spread → dealt
cards, inversion-aware, + a compact shareable URL and a self-contained LLM prompt).

```
app/src/
  runtime/     the p5 engine (lighting kernels, suit registers, figures) — no React
  components/  card UI: TarotCard, CardFrame (banner + detail modal), DeckGrid
  decks/       the deck LAYER: registry, types, generic spreads, paste-loader, and each deck's
               visual pack (cards/*.ts sketches) — reads deck DATA from the top-level decks/ via @decks
  reading/     deal, encode/decode the reading token, build the LLM prompt
  app/         the shell: hash router, landing, deck about, browser, reading
```

`@` → `app/src` (the renderer); `@decks` → the top-level `decks/` corpus (the data).

## Deploy (GitHub Pages)

Pushing to `main` runs [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds
`app/` (Vite reads `../decks` for deck data) and publishes it. Enable Pages with **Source: GitHub
Actions**. The build uses a relative base, so it works under `https://<user>.github.io/generative-arcana/`.

## Status

The Ultima deck is complete: all 78 cards authored **and illustrated**, conformant to the v2 schema.
The full app flow — landing, deck about, filterable browser, and reading composer with shareable
links — is built and deployed.
