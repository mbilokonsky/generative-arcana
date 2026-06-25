# Generative Arcana

An interactive, animated browser for **custom tarot decks** — and a reading composer that turns a
dealt spread into a shareable link any LLM can interpret. Each card is illustrated generatively with
**p5.js**; the whole thing is a static site that builds straight to **GitHub Pages**.

The first bundled deck is **The Ultima Tarot** (78 cards, themed on the *Ultima* games), designed with
the four-axis *generative-arcana* method: four suits, fourteen ranks, an eight-virtue transversal axis,
and the latent prime/composite character of each card's number.

## Live app

The app lives in **[`visuals/`](./visuals)** (a Vite + React + TypeScript SPA).

```bash
cd visuals
npm install
npm run dev        # http://localhost:5173
npm run build      # -> visuals/dist (static)
```

- **[visuals/README.md](./visuals/README.md)** — architecture, the card-sketch interface, how to add a deck or a card.
- **[visuals/PRINCIPLES.md](./visuals/PRINCIPLES.md)** — the per-card illustration spec (suit = line, virtue = light, number = composition).

## How it's organized

```
visuals/src/
  runtime/     the p5 engine (lighting kernels, suit registers, figures) — no React
  components/  card UI: TarotCard, CardFrame (banner + detail modal), DeckGrid
  decks/       deck registry + per-deck folders (deck.json + p5 card sketches)
  app/         the shell: hash router, deck list, deck view
```

Add a deck by dropping a folder under `src/decks/<id>/` (its `deck.json` plus card sketches) and
registering it — the app discovers decks through a registry.

## Deploy (GitHub Pages)

Pushing to `main` runs [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds
`visuals/` and publishes it. Enable Pages with **Source: GitHub Actions** in the repo settings.
The build uses a relative base, so it works under `https://<user>.github.io/generative-arcana/`.

## Status

Deck data: all 78 Ultima cards authored. Illustrations: 5 of 78 so far. Reading composer: designed,
landing/deck-selection and spreads in progress.
