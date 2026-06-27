# app — the Generative Arcana renderer

A static deck browser & reading composer for custom tarot decks. It renders decks from the top-level
**`../decks/`** corpus (portable, renderer-agnostic JSON) and gives each one one or more visual
**skins**. The whole thing builds to static files for **GitHub Pages**.

Read **[PRINCIPLES.md](./PRINCIPLES.md)** for the Ultima p5 illustration spec.

## The data / renderer boundary

A `deck.json` holds only data (meanings, the four axes, structure) — **no visual information**. It lives
in the top-level `decks/<id>/` corpus and any renderer can read it. *This* app is one renderer.

## Visual skins

A **skin is just a name.** Each card's renderer is resolved *per card* from whatever content is
registered for that (deck, skin): a typed p5 **"kit"** sketch (`TarotCard`), a **raw p5** source string
(`RawP5Card`), or a **static image** (`<img>`). A deck can offer several skins, selectable in the
browser; per-card fallback means a partial skin degrades to whichever other skin has the card. The
registry + resolver live in `runtime/defineCard.ts` (`registerPack` / `registerImagePack` /
`registerRawPack` / `claimSketchesFor` / `resolveVisual`).

## Structure

```
app/                            # the renderer
  index.html                    # mounts src/main.tsx
  vite.config.ts                # base "./", "@" -> src, "@decks" -> ../decks (the data corpus)
  src/
    main.tsx                    # entry: imports design tokens, registers decks, renders <App>
    app/                        # the shell — hash router + screens
      App.tsx router.ts Landing.tsx DeckHome.tsx AxisExplorer.tsx CardBrowser.tsx Reading.tsx packPref.ts
    runtime/                    # the skin registry (defineCard) + the p5 kit engine (no React)
    components/                 # card UI: CardArt (resolves a card's skin), CardFrame, CardModal,
                                #   CardPlaceholder, DeckGrid, TarotCard, RawP5Card, cardMeta
    decks/                      # the deck LAYER: registry, types, spreads, custom-loader + each deck's skin(s)
      registry.ts types.ts spreads.ts custom.ts index.ts
      ultima/                   #   cards/ (typed p5 "kit" skin) + index.ts
      ulysses/                  #   cards.ts (raw-p5 + Pixel image skins) + pixel/*.png
      byrne/                    #   cards.ts (image skin) + cards/*.png
      finalfantasy/             #   cards.ts (Pixel chibi skin) + pixel/*.png
    reading/                    # deal, encode/decode the reading token, build the LLM prompt
    styles/                     # the design-system tokens: light core + per-deck data-theme "worlds"
../decks/<id>/deck.json         # the DATA (top-level, outside this app) — read via @decks
../.github/workflows/deploy.yml # CI build + deploy to GitHub Pages
```

**Layers, by dependency direction:** `runtime` (pure, no React) ← `components` (React, deck-agnostic)
← `decks` (registry + skins, reads data via `@decks`) ← `app` (shell). A sketch never imports React; the
app discovers decks through the registry.

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
2. Add a skin (optional): `src/decks/<id>/cards.ts` — register a static-image pack
   (`registerImagePack(deckId, skinId, urls)` + `registerPack(...)`), or for generative art put typed p5
   sketches in `src/decks/<id>/cards/*.ts` and claim them with `claimSketchesFor`. A deck may register
   several skins; un-illustrated cards fall back to an automatic placeholder, so a data-only (or pasted)
   deck works with no skin at all.
3. `src/decks/<id>/index.ts` — `import deckJson from "@decks/<id>/deck.json"` (+ `import "./cards"` if it
   has a skin), then `registerDeck({ id, name, tagline, data, cards, spreads? })`.
4. Add `import "./<id>";` to `src/decks/index.ts`, and a `[data-theme="<id>"]` block in `styles/tokens.css`.

## Adding a p5 card sketch (a "kit" skin)

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

## Pixel skins

The image skins (Ulysses' "Pixel · Vico", Final Fantasy's "Pixel") are generated by the Python pipeline
in `../tools/pixel/` and rendered out to each deck's `pixel/*.png` (filenames are bare card slugs).
