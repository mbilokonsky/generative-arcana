import { getDeck } from "@/decks";
import { hasCardSketch } from "@/runtime/defineCard";
import { DeckGrid } from "@/components/DeckGrid";
import { navigate } from "./router";

export function DeckView({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);

  if (!deck) {
    return (
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: 28 }}>
        <p>Unknown deck “{deckId}”.</p>
        <button onClick={() => navigate("/")} style={linkBtn}>← all decks</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 10px 40px" }}>
      <div style={{ padding: "0 18px" }}>
        <button onClick={() => navigate("/")} style={linkBtn}>← all decks</button>
        <h1 style={{ font: "600 30px/1.1 ui-serif, Georgia, serif", margin: "10px 0 4px" }}>{deck.name}</h1>
        <p style={{ color: "#9aa0b0", margin: "0 0 6px", maxWidth: 760 }}>{deck.data.theme.description.split(". ")[0]}.</p>
        <p style={{ color: "#6b7080", margin: 0, font: "400 12px/1 ui-sans-serif, system-ui" }}>
          Hover a card to animate it. {deck.cards.filter((c) => hasCardSketch(c.slug)).length} of {deck.cards.length} cards illustrated so far.
        </p>
      </div>
      <DeckGrid cards={deck.cards} deck={deck.data} onSignal={(slug, name) => console.log(slug, "->", name)} />
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  all: "unset", cursor: "pointer", color: "#9aa0b0",
  font: "400 13px/1 ui-sans-serif, system-ui",
};
