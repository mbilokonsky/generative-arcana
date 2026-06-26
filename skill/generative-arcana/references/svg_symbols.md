# Glyph Symbols (SVG)

Constraints for the vector glyphs that *declared* axes stamp on cards: the four **suit** symbols and the optional **major-arcana** symbol. The numeric axis is intrinsic and carries no glyph. The transversal is sublimated, so it carries no glyph *on the card by default* — but a station may define an optional `symbol` for the meta-layer, which may also surface on a card face tastefully and by exception (see "The station symbol" below). So glyphs are mostly a suit-and-major affair, with the station symbol as a deliberate, occasional guest.

Think *playing-card pip* or *road sign*: instant recognition from silhouette alone, not illustration.

## Hard requirements

- **ViewBox `0 0 100 100`** for every glyph, for consistent scaling.
- **Transparency via `<mask>` only.** Use SVG masks for cut-outs (eye-holes, gaps). Never use `fill="#fff"` as a fake hole — it turns solid white when recolored.
- **No partial opacity.** Avoid opacity values between 0.1 and 0.9 on glyph elements; they go muddy at small sizes.
- **Recolorable.** Use `fill="currentColor"` / `stroke="currentColor"`.
- **Bold.** Stroke width ≥ 4–5 on primary elements; prefer filled shapes.
- **Small.** Typically under ~500 bytes. Escape SVG properly in JSON.

## Design rules

- **Fill the box.** Each glyph occupies the full viewBox on at least one dimension (ideally both); center on any axis with slack.
- **Distinct at 16px.** The four suit glyphs must be instantly distinguishable from each other — different *form language* per suit, not four variations on a circle. Blur test: defocused, can you still tell them apart?
- **1–3 elements max.** A circle with a triangle inside, not ten small details. Negative space deliberate; keep ≥ 5–8 units between combined shapes.
- **Thematic, not generic.** Favor a shape that *belongs* to its concept over a bare primitive.

## Example (a suit glyph)

```svg
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="8" fill="currentColor"/>
  <line x1="50" y1="50" x2="50" y2="15" stroke="currentColor" stroke-width="3"/>
  <line x1="50" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="3"/>
  <line x1="50" y1="50" x2="50" y2="85" stroke="currentColor" stroke-width="3"/>
  <line x1="50" y1="50" x2="15" y2="50" stroke="currentColor" stroke-width="3"/>
  <circle cx="50" cy="15" r="4" fill="currentColor"/>
  <circle cx="85" cy="50" r="4" fill="currentColor"/>
  <circle cx="50" cy="85" r="4" fill="currentColor"/>
  <circle cx="15" cy="50" r="4" fill="currentColor"/>
</svg>
```

A radiating node — reads as "network/program" from silhouette, fills the box, recolors cleanly.

## The station symbol (optional)

The transversal is sublimated — felt as light, not stamped — so by default it leaves no glyph on the card. But a station may carry an optional `symbol` (same constraints as above), for two uses:

1. **The meta-layer — the main use.** Deck browsers, legends, filter chips, and detail tables want a compact mark per station so a reader can pull "all the [station] cards" at a glance. This never touches the card art.
2. **Tasteful surfacing on a card — the exception.** Traditional tarot lets a planet's glyph appear on a card now and then, when it genuinely belongs — not as routine vocabulary, but as an occasional, deliberate flourish. A station symbol may do the same: a card that plainly *embodies* its station (see `references/integration.md` → Surfacing) may let the symbol appear in its `detailed_description`. This is the rare exception, a per-card judgment, never the default register — the station is still weather, not a stamp.

When the transversal is the planets (`strategies/transversal/chaldean.md`), the symbols are obvious and well-loved: ☉ ☽ ☿ ♀ ♂ ♃ ♄ — provide each as SVG (not just the unicode point) for consistent rendering. For a themed cycle, design a small glyph per station where one is natural; leave `symbol` unset where none is. A station carrying a symbol it never earns is worse than no symbol.

Constraints are identical to the suit glyphs: viewBox `0 0 100 100`, `currentColor`, masks for holes, bold, distinct at 16px.
