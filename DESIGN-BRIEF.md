# Generative Arcana — Design Brief

A spec for generating a **design system and visual language** for the Generative Arcana web app.
This document is self-contained: it describes the product, its data, every screen and component, the
content realities the design must survive, and the non-functional requirements — but **not** the
visual design itself. That's what you're producing.

---

## 0. The one-paragraph challenge

Generative Arcana is a browser for **custom tarot decks**, where each deck is generated from a shared
four-axis formalism but can look like *anything* — a heroic-fantasy deck of gold-leaf heraldry, an
art-rock deck of stark documentary illustration, a modernist literary deck of dissolving pixel scenes.
The app's chrome must therefore be a **neutral, premium "gallery frame"**: it has to feel like one
cohesive, intelligent product, yet recede so that each deck's own palette and art dominate without
clashing. At the same time it must make the deck's *intellectual structure* — the four axes every card
sits on — legible and even delightful, a "peek behind the curtain." The core design problem is this
tension: **a consistent system that hosts radically inconsistent content.**

---

## 1. Product overview

- **What it is:** a static, no-account web app to (a) browse the structure and art of custom tarot
  decks, and (b) compose a tarot "reading" that produces a shareable link + an LLM-ready prompt.
- **Audience:** thoughtful, literate hobbyists and makers — people who enjoy tarot *and* systems,
  symbolism, and craft. Comfortable with a little intellectual depth. Not New-Age kitsch shoppers.
- **Business/tech model:** fully client-side SPA. No backend, no accounts, no payments. Decks are
  bundled JSON; users can also paste their own deck JSON. Deploys to GitHub Pages.
- **Current state:** functional but visually unrefined (hand-written inline styles, dark theme). It
  works on desktop and roughly on mobile. We want a real design system applied across it.

---

## 2. Brand & tone

**North stars**
- *A museum / laboratory for symbolic systems.* Curated, precise, quietly luxurious.
- *Literary and contemplative.* It should feel like a beautifully typeset book or a gallery wall label,
  not a game UI.
- *The structure is a feature.* The four-axis formalism should be exposed elegantly and made to feel
  like insight, not homework.
- *The art is the star; the chrome is the frame.* Restraint. Generous negative space. Let card art
  carry the color.

**Anti-goals**
- No mystical clichés (purple haze, glowing runes everywhere, Papyrus/Cinzel overload, crystal-ball
  kitsch).
- No heavy, opinionated chrome color that fights the decks.
- No dense, tabular "data dump" feeling (a current problem — see §8).

**Current palette (for reference, not prescription):** near-black grounds (`#0b0b14`, panels
`#13131f`), warm parchment text (`#e9dcc0`, `#c7c2b2`), muted slate (`#9aa0b0`), a single gold accent
(`#c9a44a` / `#d8b24a`), error rose (`#e0506a`). Dark theme only today; a light mode is optional but
welcome if it doesn't compromise the "art-on-dark-wall" feel.

**Typography (current):** serif (`ui-serif`/Georgia) for card names, deck names, display headings;
sans (`ui-sans-serif`/system-ui) for all UI text and body; monospace for pasted JSON. A real
typographic system (a distinctive serif + clean sans pairing) is wanted.

---

## 3. The domain model (why the design must understand it)

Every card is the intersection of **four axes**. The UI exists largely to make these legible.

1. **Suit** *(grid axis, declared)* — 4 ordered suits. Minor cards only. Each suit has: name, a
   **glyph** (deck-supplied inline SVG, recolorable via `currentColor`), a description, a meaning
   palette (`upright[]` / `inverted[]` word-lists), and a `visual_style` blurb. Some decks' suits form
   a **2×2 dialectic** (e.g. *World/Soul × Throne/Road*) that should render as a labeled quadrant.
2. **Rank** *(grid axis, declared)* — 14 ranks for **minor** cards (Ace=1 … Ten=10, then four face
   ranks 11–14), each with a number/symbol, name, description, an optional `question`, and a meaning
   palette. **Major** cards have *no rank*; instead each is numbered **0–21**, a named station of the
   deck's arc. The design must present these as **two distinct numbering systems.**
3. **Transversal** *(substrate axis, sublimated)* — a single **named cycle** of N stations (e.g.
   "The Eight Virtues", "Vico's Cycle") laid *across* the grid. It is never declared on the card face;
   it's dissolved into each card's palette/mood. Each station has name, description, a meaning palette,
   and a `visual_motif`. The deck names its own system; the UI labels the *axis* generically
   ("Transversal") and reveals the specific system inside.
4. **Prime factorization** *(intrinsic, invariant across all decks)* — each card's number has a
   character: **identity** (0,1), **prime** (irreducible), or **composite** (a product of factors).
   Majors may carry an authored one-line "gloss" of this character. This axis is the same in every deck.

**The Major Arcana** is special: it has *no suit and no rank*, yet **functions like a fifth suit** — a
register that contributes a single shared `visual_style` across its 22 trumps. The design should treat
it as a peer to the suits where suits are shown.

**A deck (JSON) contains:** `name`, `slug`, `theme {name, description, creator}`, 4 `suits`, 14
`ranks`, 1 `transversal` (with N stations), `major_arcana {story, visual_style, symbol?}`, and 78
`cards` (22 major + 56 minor; some decks intentionally fewer, e.g. 77). Each card has a name, number,
meaning (`upright`/`inverted` prose), and a `detailed_description` of its imagery.

**Three reference decks (use these to prove neutrality — they look nothing alike):**
- **The Ultima Tarot** — heroic fantasy (Britannia). Gold-leaf/heraldic, royal blue, manuscript
  illumination. Suits: Crowns/Blades/Runes/Moongates. Transversal: "The Eight Virtues."
- **The Byrne Journey Tarot** — David Byrne / Talking Heads. Documentary, clean, mid-century-modern
  graphic. Suits: Structures/Rivers/Curiosity/Dance.
- **Ulysses Tarot** — James Joyce. Modernist, austere → experimental. Suits: Towers/Keys/Nets/Kidneys.
  Transversal: "Vico's Cycle" (4 ages of history).

---

## 4. Visual packs (a card can be drawn multiple ways)

A card's *art* is separate from its *data*, and a deck may ship **more than one art "pack"**, which the
viewer can switch between. There are three kinds of pack, all rendered into a fixed **2:3 card frame**:

- **animated (p5.js sketch)** — a live, looping generative canvas. Animates on hover/focus; shows a
  static "poster" frame otherwise and under `prefers-reduced-motion`.
- **static image** — a pre-rendered PNG (e.g. pixel art), shown as an `<img>` (object-fit: cover).
- **placeholder** — when no art exists for a card/pack: a generated face showing the suit glyph + name.

Ulysses, for example, offers **two packs** ("Animated" and "Pixel · Vico") selectable in the browser.
The design needs a **pack selector** (segmented control) that appears only when a deck has >1 pack, and
the selection persists. Packs can be partial; missing cards fall back to another pack gracefully.

---

## 5. Information architecture & navigation

Hash-based routing (static SPA). Five screens:

- `#/` — **Landing / deck gallery**
- `#/deck/:id` — **Deck "About"** (the four-axis explorer)
- `#/deck/:id/browse` — **Card Browser** (grid + filters + pack selector)
- `#/deck/:id/read` — **Reading composer**
- `#/deck/:id/r/:token` — **Reading result** (shareable; the token encodes the deal)

Within a deck, a persistent **deck-level tab bar** switches About / Browse cards / Reading. A global
header shows the product name ("Generative Arcana", links home). A "← all decks" affordance returns to
the gallery. There is also a **card detail modal** reachable from any card.

---

## 6. Screen-by-screen spec

### 6.1 Landing / deck gallery
- **Purpose:** choose a deck, or paste your own.
- **Content:** product title + a one-paragraph mission blurb (explains the four-axis idea & the reading
  feature). A responsive grid of **deck cards** — each shows deck name, a one-line tagline, and a meta
  line (`creator · N cards · M illustrated`). A dashed **"+ Paste your own"** card toggles a JSON
  textarea with a "Load deck" button and inline error text.
- **States:** valid paste → navigate to the deck; invalid → error message. Empty textarea disables load.
- **Design notes:** the deck cards are the hero; consider showing a representative card/preview or the
  deck's accent so the gallery feels like a shelf of distinct objects. Must scale from 1 to many decks.

### 6.2 Deck "About" — the four-axis explorer
- **Purpose:** the "peek behind the curtain" — explain how this specific deck is built, richly, from
  its metadata.
- **Content:** deck theme description; two CTAs (Browse the cards / Cast a reading); an intro stating
  each card is the meeting of four axes; then a **tabbed explorer** with four panels:
  1. **Suits** — the 4 suits (as a labeled **2×2 quadrant** if the deck is dialectical, else a grid),
     each with glyph + description + meaning palette + visual style; PLUS the **Major Arcana** as a
     "no suit, yet functions as one" entry.
  2. **Ranks** — the minor ranks 1–14 as a **linear progression** (number, name, question, description),
     and separately the majors' **0–21 named-station** list. Clarify they are different systems.
  3. **Transversal** — labeled generically; inside, the deck's system name, description, ordering
     rationale, and **the cycle mapped out** (stations in order, looping) with per-station detail.
  4. **Prime Factorization** — an explanation of the invariant axis + a visualization coloring every
     number (majors 0–N, minors 1–14) by identity/prime/composite, with factors.
- **This screen is the current pain point:** it must be **rich but not overwhelming.** Use progressive
  disclosure, strong hierarchy, restrained density. The tabbed structure is good; the *content density*
  inside each tab needs a designer's hand.
- **A11y:** tabs must be a real `tablist`/`tab`/`tabpanel` with arrow-key navigation.

### 6.3 Card Browser
- **Purpose:** find and view any of the deck's cards.
- **Content:** a **filter bar** — text search; selects for Arcana (major/minor), Suit, Rank,
  Transversal-station (label = the axis name), and Number-character (identity/prime/composite); an
  "Illustrated only" toggle; a **pack selector** (only if >1 pack); and a live "X of N" count. Below:
  a **responsive grid of card frames.** Illustrated cards animate on hover/focus and lift slightly;
  each has a hover-revealed "expand" affordance that opens the detail modal.
- **States:** no matches → empty message. Mixed illustrated/placeholder cards. Many filters at once.
- **Design notes:** the filter bar has a lot of controls — needs a clean, compact, mobile-collapsible
  treatment. The grid is the gallery wall.

### 6.4 Card detail modal
- **Purpose:** focus on one card.
- **Content:** the card art (animated/live) beside its **meaning** (Upright + Reversed prose) and
  **Imagery** (the scene description), plus a **coordinate table** at the bottom: Suit · Rank ·
  ⟨Transversal axis⟩ · Composition (the prime character; majors also show the authored gloss).
- **Constraint:** card art is fixed 2:3 and must **not stretch**; the text column **scrolls** within a
  constant modal height so a 30-word card and a 200-word card produce the same modal size. Closes on
  X / click-outside / Escape.

### 6.5 Reading composer
- **Purpose:** cast a reading.
- **Content:** an optional **question** textarea; a **spread** picker (cards of name + position-count +
  description; some spreads are deck-native); a "Deal N cards" button.
- **On deal:** navigates to a result URL whose token encodes the deal (shareable, reproducible).

### 6.6 Reading result
- **Purpose:** present the dealt spread + an interpretation prompt.
- **Content:** spread name + the question; a **layout of the dealt cards** (each in position, **reversed
  cards rendered rotated 180°**), each with its position name/prompt, the card name (+ "Reversed"),
  and the orientation-appropriate meaning; and a generated **LLM-ready prompt** (grounded entirely in
  the deck's data) with **copy-to-clipboard** buttons. A "↻ new reading" action.
- **Design notes:** spreads have varying shapes/counts (1–N positions). A flexible positional layout is
  needed; today it's a simple responsive grid. Consider true spread layouts (e.g. cross, line) as an
  enhancement, but a clean grid is acceptable.

---

## 7. Component inventory

The design system should define, at minimum:

- **App header** (brand, home link) and **deck tab bar** (About / Browse / Reading).
- **Deck card** (gallery tile) and the **paste-deck** affordance + textarea/error.
- **Card frame** — the chrome around any card: fixed 2:3 ratio; a **corner badge** (suit/major glyph +
  rank/number); a **bottom title bar** (card name + subtitle); a hover-revealed **expand** button. It
  overlays the art and is already driven by CSS custom properties so it can be restyled without
  touching the art — keep that separation. **Must stay legible over arbitrary art** (light, dark, busy,
  sparse) → needs scrims/contrast strategy.
- **Card grid** (responsive, hover-lift).
- **Card placeholder** (glyph + name face for unillustrated cards).
- **Card modal** (see 6.4).
- **Tabs** (accessible), **segmented control** (pack selector), **select/dropdown**, **text input**,
  **textarea**, **buttons** (primary / secondary / ghost / disabled), **chips/tags** (meaning palettes),
  **panels/cards**, **badges/pills**, **glyph** renderer (inline deck SVG, recolored).
- **Axis explorer** panels (4) with their distinct content layouts (quadrant, linear list, cycle map,
  number grid).
- **Spread layout** for readings.
- **Empty / error / loading** states.

---

## 8. Content realities the design MUST survive

These are the things that break naive designs:

- **Wildly variable text length.** Card meanings range from ~10 words (Byrne) to ~200 words (Ulysses).
  Suit/station descriptions vary similarly. Layouts must handle both without looking broken or empty.
- **Deck-supplied glyphs are arbitrary SVGs** using `currentColor` (some with masks/gradients). They
  render at small sizes (badges ~16px) and larger (explorer ~24px). The system tints them via text
  color; design should assume simple monochrome marks that may be intricate.
- **Radically different deck palettes & art.** The chrome cannot assume a color mood. Prove every chrome
  decision against all three reference decks.
- **Three art kinds + selectable packs** (animated / image / placeholder) in the same grid at once.
- **78 cards per deck** rendered in a grid — many simultaneous canvases/images (performance, §9).
- **Fixed 2:3 card aspect**, art is full-bleed; chrome is an overlay.
- **Custom pasted decks** with sparse/odd metadata must still render sensibly (graceful fallbacks).

---

## 9. Non-functional requirements

- **Mobile-first & responsive.** Must be genuinely good on a ~380px phone through wide desktop. Tab
  bars scroll/collapse; multi-column grids reflow to one column; the dialectic 2×2 degrades to a list;
  touch targets ≥ 44px.
- **Accessibility — target WCAG 2.1 AA.** Full keyboard operation; visible focus; correct roles/ARIA
  (tablist, dialog, etc.); color contrast on text *and* on chrome that sits over art; respect
  `prefers-reduced-motion` (the app already swaps animation for a static poster). Decorative glyphs
  `aria-hidden`; meaningful images get alt text (the card name).
- **Performance.** Up to ~78 animated canvases or images per grid. The app pauses off-screen canvases
  and lazy-loads images; the design shouldn't require always-live animation. Prefer CSS over JS for
  motion where possible.
- **Platform.** Static SPA, hash routing, GitHub Pages (relative asset base). No server, so no
  server-rendered states; everything is client-side.
- **Theming hook.** Chrome already uses CSS custom properties (e.g. `--card-bg`, `--banner-fg`,
  `--banner-title-bg`); the design system should formalize this so chrome is themeable centrally.

---

## 10. Theming model (the crux — please design this explicitly)

We need a clear answer to: **how does one neutral system host three (or N) opposite-looking decks
without looking generic or clashing?** Desired direction (open to your judgment):

- A **base "frame" theme** — neutral, premium, deck-agnostic — used for all global chrome (header,
  tabs, gallery, filter bar, modal shell, explorer).
- A subtle **per-deck accent** the chrome can adopt (e.g. derived from a single deck accent color), used
  sparingly (active states, hairlines, the gold-equivalent) so each deck *feels* a little different
  without the chrome competing with the art.
- A **scrim/elevation system** so badges and title bars stay readable over any card art.
- Define **design tokens** as CSS custom properties so this is centrally controllable: color (neutrals,
  text tiers, accent, semantic/error, scrims), typography (families, scale, weights, line-heights),
  spacing scale, radii, shadows/elevation, motion (durations + easings), z-index, breakpoints.

---

## 11. Current technical context (so the output is implementable)

- **Stack:** React 18 + TypeScript + Vite. No CSS framework; styles are currently inline objects. We're
  happy to move to **CSS custom properties + a small set of styled primitives/utility classes**; please
  design around tokens that map cleanly to CSS variables.
- **Card art is framework-agnostic** (p5 instance-mode canvases or `<img>`); the React layer owns the
  frame/chrome. Keep art and chrome decoupled.
- **No build-time design dependency** beyond what Vite supports; prefer a token/CSS approach over a
  heavy component library.

---

## 12. What we'd like out of the designer tool

1. A **design language** statement: the concept, mood, and the "frame vs. art" philosophy in practice.
2. **Design tokens** (color, type, spacing, radius, elevation, motion, breakpoints) as a named set,
   ready to express as CSS custom properties.
3. **Typography system** (font pairing + scale + usage rules).
4. **Component designs** for the inventory in §7, with states (default/hover/focus/active/disabled/
   empty/error) and responsive behavior.
5. **Layouts** for each of the six screens (§6), at mobile / tablet / desktop.
6. The **theming model** from §10, including how a per-deck accent is applied and how chrome stays
   legible over art (scrims/contrast).
7. **Accessibility annotations** per component (roles, focus order, contrast targets, reduced-motion).
8. **Glyph/iconography** guidance for hosting arbitrary monochrome deck SVGs.
9. A short **"applied" demonstration**: the same screen (ideally the Card Browser and the Card modal)
   shown themed for two opposite decks (Ultima vs. Ulysses) to prove neutrality.

---

## 13. Open questions for the designer

- Light mode — worth offering, or is "art on a dark wall" the identity?
- How far to lean into per-deck theming vs. a single fixed accent (risk: decks fighting the chrome).
- Should the gallery/landing show card previews, or stay text-forward?
- Reading: real spread geometries (cross, Celtic, line) vs. a clean responsive grid — how ambitious?
- How expressive can the four-axis explorer be (e.g. an actual diagram of the axes) before it tips from
  "insightful" into "overwhelming"?
