# Arcana — deck app

A static deck browser & (soon) reading composer for custom tarot decks. Cards are animated with
**p5.js** rendered as **React components**; the whole thing builds to static files for **GitHub Pages**.
Bundles the **Ultima Tarot** deck (78 cards, 5 illustrated so far).

Read **[PRINCIPLES.md](./PRINCIPLES.md)** for the per-card illustration spec.

## Structure

```
visuals/                      # the app (rename / promote to repo root as you like)
  index.html                  # mounts src/main.tsx
  vite.config.ts              # base "./" + "@/" -> src alias (GitHub-Pages-ready)
  src/
    main.tsx                  # entry: registers decks, renders <App>
    app/                      # the shell — hash router, deck list, deck view
      App.tsx  router.ts  DeckList.tsx  DeckView.tsx
    runtime/                  # the p5 engine (no React): lighting, registers, figures, kit, types
    components/               # deck-agnostic card UI: TarotCard, CardFrame, DeckGrid
    decks/                    # the deck registry + per-deck folders
      registry.ts  types.ts  index.ts
      ultima/
        deck.json             # the deck data (generative-arcana output) — canonical, owned here
        cards/                # one p5 sketch per illustrated card (5 of 78)
        index.ts              # registers the deck manifest + its sketches
../.github/workflows/deploy.yml   # CI build + deploy to GitHub Pages
```

**Layers, by dependency direction:** `runtime` (pure, no React) ← `components` (React, deck-agnostic)
← `decks` (data + sketches) ← `app` (shell). A deck never imports the app; the app discovers decks
through the registry.

## Run / build

```bash
cd visuals
npm install
npm run dev        # http://localhost:5173  (#/  ->  #/deck/ultima)
npm run build      # -> dist/ (static; deploys via the Pages workflow)
npm run typecheck
```

GitHub Pages: push to `main`; the workflow builds `visuals/` and deploys `dist/`. `base: "./"` means it
works under any `/<repo>/` path, and **hash routing** means no 404/SPA-fallback config is needed — and
(important for readings) a `#fragment` is never sent to a server, so reading URLs stay client-side.

## Adding a deck

1. `src/decks/<id>/deck.json` — the deck data (run the generative-arcana skill).
2. `src/decks/<id>/cards/*.ts` — a `registerCard({ slug, draw, … })` sketch per card; you author only
   the *scene* — station lighting + suit register come free from the slug's deck data.
3. `src/decks/<id>/index.ts` — `registerDeck({ id, name, tagline, data, cards })`.
4. Add `import "./<id>";` to `src/decks/index.ts`.

## Adding a card sketch

```ts
import { registerCard } from "@/runtime/defineCard";
export default registerCard({
  slug: "crowns-ace",
  draw(kit)       { /* per-frame; the only required method */ },
  onPointer?(kit) { /* interactivity; kit.pointer is normalized 0..1 */ },
  poster?(kit)    { /* the still frame for thumbnails / reduced-motion */ },
});
```

`kit` (`SketchKit`) hands you the p5 instance, the card JSON, geometry helpers (`u`, `cx`, `cy`, `safe`),
a looping clock + seeded RNG, the shared library pre-bound (`light`, `register`, `fig`, `palette`),
`pointer`, and a `signal(name, detail)` channel to the host. Never import React from a sketch.

## Coming next (designed, not yet built)

- **Reading composer:** ask a question → deal a spread → encode `{deck, spread, cards, question}` into a
  compact `#/deck/:id/r/:token` URL → the reading page rebuilds the spread *and* generates a one-click,
  self-contained LLM prompt grounded in the deck's authored meanings. No backend, no tokens.
- **Spreads:** generic (Single, Three-Card, Celtic Cross) + per-deck + user-defined; spreads are data and
  a custom spread can travel inside the reading token.

## Status

`npm run typecheck` and `npm run build` both pass. The 5 illustrated cards (`ultima/cards/`) exercise
5 of 8 station lighting kernels (Valor, Justice, Humility, Spirituality, Honesty).
