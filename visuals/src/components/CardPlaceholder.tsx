/** A static "face" for cards that have no p5 sketch yet (most of a deck, and pasted decks).
 *  Shows the card's name + axis glyph so the browser and readings still read as complete. */
import { Glyph, RANK_ROMAN, SUIT_LABEL } from "./cardMeta";
import type { CardData } from "@/runtime/types";

const ACCENT: Record<string, string> = {
  crowns: "#d4a02a", blades: "#9d2b2b", runes: "#e9c75a", moongates: "#e0506a", major: "#d8b24a",
};

export function CardPlaceholder({ card }: { card: CardData }) {
  const which = card.arcana === "major" ? "major" : (card.suit_slug ?? "major");
  const accent = ACCENT[which] ?? "#d8b24a";
  const subtitle =
    card.arcana === "major"
      ? `Major Arcana · ${card.number}`
      : `${RANK_ROMAN[card.rank_slug ?? ""] ?? ""} · ${SUIT_LABEL[card.suit_slug ?? ""] ?? ""}`;

  return (
    <div
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 10, padding: 16, textAlign: "center",
        background: "radial-gradient(120% 90% at 50% 35%, #1b1b2b 0%, #0c0c16 100%)",
        color: "#e9dcc0",
      }}
    >
      <div style={{ color: accent, opacity: 0.85, filter: "drop-shadow(0 0 8px rgba(0,0,0,0.4))" }}>
        <Glyph which={which} size={46} />
      </div>
      <div style={{ font: "600 16px/1.2 ui-serif, Georgia, serif" }}>{card.name}</div>
      <div style={{ opacity: 0.55, font: "400 10px/1.2 ui-sans-serif, system-ui", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {subtitle}
      </div>
      <div style={{ position: "absolute", inset: 6, border: `1px solid ${accent}33`, borderRadius: 10, pointerEvents: "none" }} />
    </div>
  );
}
