/** A static "face" for cards with no shipped art (and pasted decks). In production a card with a live
 *  p5 sketch renders that instead; this is the graceful fallback. Striped Vitrine well + glyph + name. */
import { AxisGlyph } from "./cardMeta";
import type { CardData } from "@/runtime/types";
import type { DeckDataFile } from "@/decks/types";

export function CardPlaceholder({ card, deck }: { card: CardData; deck?: DeckDataFile }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12, padding: 16, textAlign: "center",
        color: "var(--ink-3)",
        background:
          "repeating-linear-gradient(45deg, var(--paper-2) 0 10px, var(--card) 10px 20px)",
      }}
    >
      <div style={{ color: "var(--ink-2)" }}>
        <AxisGlyph deck={deck} card={card} size={44} />
      </div>
      <div style={{ font: "400 16px/1.2 var(--font-display)", color: "var(--ink-2)" }}>{card.name}</div>
    </div>
  );
}
