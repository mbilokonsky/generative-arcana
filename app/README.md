# app — the Generative Arcana renderer

A static deck browser & reading composer for custom tarot decks. Cards are animated with **p5.js** as
**React components**; the whole thing builds to static files for **GitHub Pages**. It renders decks from
the top-level **`../decks/`** corpus (portable, renderer-agnostic JSON) and supplies each one a *visual
pack* of p5 sketches. The bundled deck is the **Ultima Tarot** (all 78 cards illustrated).

Read **[PRINCIPLES.md](./PRINCIPLES.md)** for the per-card illustration spec.

## The data/renderer boundary

A `deck.json` holds only data (meanings, the four axes, structure) — **no visual information**. It lives
in the top-level `decks/<id>/` corpus and any renderer can read it. *This* app is one renderer: its p5
sketches are a visual pack paired to a deck **by id**. (A future SVG / image / scanned-art renderer would
read the same `decks/` and bring its own pack.)

## Structure

```
app/                            # the renderer
  index.html                    # mounts src/main.tsx
  vite.config.ts                # base "./", "@" -> src, "@decks" -> ../decks (the data corpus)
  src/
    main.tsx                    # entry: registers decks, renders <App>
    app/                        # the shell — hash router + screens
      App.tsx  router.ts  Landing.tsx  DeckHome.tsx  CardBrowser.tsx  Reading.tsx  DeckTabs.tsx
    runtime/                    # the p5 engine (no React): lighting, registers, figures, kit, types
    components/                 # card UI: TarotCard, CardFrame (banner + detail modal), CardModal,
                                #   CardPlaceholder, DeckGrid, cardMeta
    decks/                      # the deck LAYER (app-side): registry, types, spreads, custom-loader,
      registry.ts  types.ts  spreads.ts  custom.ts  index.ts
      ultima/                   #   + each deck's visual pack:
        cards/                  #     78 p5 sketches (the Ultima skin)
        index.ts                #     imports @decks/ultima/deck.json + ./cards, registers the deck
    reading/                    # deal, encode/decode the reading token, build the LLM prompt
../decks/ultima/deck.json       # the DATA (top-level, outside this app) — read via @decks
../.github/workflows/deploy.yml # CI build + deploy to GitHub Pages
```

**Layers, by dependency direction:** `runtime` (pure, no React) ← `components` (React, deck-agnostic)
← `decks` (registry + visual packs, reads data via `@decks`) ← `app` (shell). A sketch never imports
React; the app discovers decks through the registry.

## Run / build

```bash
cd app
npm install
npm run dev        # http://localhost:5173  (#/  ->  #/deck/ultima)
npm run build      # -> dist/  (Vite reads ../decks for data)
npm run typecheck
```

GitHub Pages: push to `main`; the workflow builds `app/` and deploys `dist/`. `base: "./"` works under
any `/<repo>/` path, and **hash routing** needs no 404/SPA-fallback — and (key for readings) a
`#fragment` is never sent to a server, so reading URLs stay client-side.

## Adding a deck

1. Drop the data: `../decks/<id>/deck.json` (run the generative-arcana skill).
2. Visual pack: `src/decks/<id>/cards/*.ts` — a `registerCard({ slug, draw, … })` sketch per card; you
   author only the *scene* — station lighting + suit register come free from the slug's deck data.
3. `src/decks/<id>/index.ts` — `import deckJson from "@decks/<id>/deck.json"` + `import "./cards"`, then
   `registerDeck({ id, name, tagline, data, cards, spreads? })`.
4. Add `import "./<id>";` to `src/decks/index.ts`.

(Un-illustrated cards render an automatic placeholder, so a data-only deck — or a pasted one — works
without any sketches.)

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

## Status

`npm run typecheck` and `npm run build` both pass. The Ultima deck is fully illustrated (78/78) and on
the v2 schema; the full flow — landing, deck about, filterable browser, reading composer with shareable
links + self-contained LLM prompts — is built and deployed.
