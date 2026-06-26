# Generative Arcana

Two things that go together:

1. **A method** for designing thematically coherent custom tarot decks, woven from four symbolic
   axes — suit, rank, a transversal substrate (generalizing tarot's Chaldean/decan order), and the
   prime/composite factorization of each card's number. Packaged as a Claude skill.
2. **An app** that browses those decks — each card illustrated generatively with **p5.js** — and
   composes readings into a shareable link any LLM can interpret. A static site that builds to GitHub Pages.

The bundled deck is **The Ultima Tarot** (78 cards, themed on the *Ultima* games): four suits, fourteen
ranks, the **eight Virtues** as the transversal axis, and the prime/composite character of each number.

## What's in here

```
skill/generative-arcana/      the method, as a Claude skill (SKILL.md + references/ + strategies/)
generative-arcana-v2.0.zip    the same skill, packaged for one-click install
visuals/                      the deck app (Vite + React + TypeScript + p5.js)
.github/workflows/deploy.yml  builds visuals/ and deploys to GitHub Pages
```

## The skill

The skill teaches Claude to generate a complete deck as a single JSON file. Read
**[`skill/generative-arcana/SKILL.md`](./skill/generative-arcana/SKILL.md)** for the formalism; the
`references/` define the schema and integration rules, and `strategies/` are the per-stage generators.

**Install:** upload **`generative-arcana-v2.0.zip`** to Claude (Skills), or copy
`skill/generative-arcana/` into your skills directory. Then ask for a deck — e.g. *"design a deep-sea
mythology tarot deck"* — and it emits a `deck.json` the app can render.

This is **v2.0**: the prime/composite axis is stored as an authored `factorization` gloss on the majors
(a gloss that won't cohere signals a miscast slot); stations carry a concise `description` and optional
`symbol`; numbered ranks carry a `{suit}`-placeholder `question`.

## The app

```bash
cd visuals
npm install
npm run dev        # http://localhost:5173
npm run build      # -> visuals/dist (static)
```

- **[visuals/README.md](./visuals/README.md)** — architecture, the card-sketch interface, adding a deck or card.
- **[visuals/PRINCIPLES.md](./visuals/PRINCIPLES.md)** — the per-card illustration spec (suit = line, virtue = light, number = composition).

Landing → pick a deck (bundled or paste your own `deck.json`) → an "about" page (theme, suits,
ranks, the virtue axis) → a filterable card browser → a reading composer (question + spread → dealt
cards, inversion-aware, + a compact shareable URL and a self-contained LLM prompt).

```
visuals/src/
  runtime/     the p5 engine (lighting kernels, suit registers, figures) — no React
  components/  card UI: TarotCard, CardFrame (banner + detail modal), DeckGrid
  decks/       deck registry + per-deck folders (deck.json + p5 card sketches) + spreads
  reading/     deal, encode/decode the reading token, build the LLM prompt
  app/         the shell: hash router, landing, deck about, browser, reading
```

## Deploy (GitHub Pages)

Pushing to `main` runs [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds
`visuals/` and publishes it. Enable Pages with **Source: GitHub Actions**. The build uses a relative
base, so it works under `https://<user>.github.io/generative-arcana/`.

## Status

The Ultima deck is complete: all 78 cards authored **and illustrated**, conformant to the v2 schema.
The full app flow — landing, deck about, filterable browser, and reading composer with shareable
links — is built and deployed.
