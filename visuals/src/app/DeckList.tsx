import { listDecks } from "@/decks";
import { hasCardSketch } from "@/runtime/defineCard";
import { navigate } from "./router";

export function DeckList() {
  const decks = listDecks();
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: 28 }}>
      <h1 style={{ font: "600 30px/1.1 ui-serif, Georgia, serif", margin: "6px 0 4px" }}>Decks</h1>
      <p style={{ color: "#9aa0b0", margin: "0 0 24px" }}>
        Choose a deck to browse its cards. Reading composer arrives next.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {decks.map((d) => {
          const total = d.cards.length;
          const illustrated = d.cards.filter((c) => hasCardSketch(c.slug)).length;
          return (
            <button
              key={d.id}
              onClick={() => navigate(`/deck/${d.id}`)}
              style={{
                all: "unset", cursor: "pointer", display: "block",
                padding: 20, borderRadius: 14, background: "#13131f",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ font: "600 20px/1.2 ui-serif, Georgia, serif" }}>{d.name}</div>
              <div style={{ marginTop: 6, color: "#9aa0b0", font: "400 14px/1.4 ui-sans-serif, system-ui" }}>
                {d.tagline}
              </div>
              <div style={{ marginTop: 12, opacity: 0.5, font: "400 12px/1 ui-sans-serif, system-ui", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {d.data.theme.creator} · {illustrated} of {total} illustrated
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
