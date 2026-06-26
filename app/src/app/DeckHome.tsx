import { getDeck } from "@/decks";
import { DeckTabs } from "./DeckTabs";
import { AxisExplorer } from "./AxisExplorer";
import { navigate } from "./router";

export function DeckHome({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);
  if (!deck) return <NotFound id={deckId} />;
  const d = deck.data;

  return (
    <div>
      <DeckTabs deckId={deckId} deckName={deck.name} active="about" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "26px 28px 60px" }}>
        <p style={{ font: "400 16px/1.65 ui-sans-serif, system-ui", color: "#d8cfb6", marginTop: 0 }}>{d.theme.description}</p>

        <div style={{ display: "flex", gap: 12, margin: "18px 0 28px" }}>
          <button onClick={() => navigate(`/deck/${deckId}/browse`)} style={cta(true)}>Browse the cards →</button>
          <button onClick={() => navigate(`/deck/${deckId}/read`)} style={cta(false)}>Cast a reading →</button>
        </div>

        <section>
          <h2 style={sectionH}>The four axes</h2>
          <p style={{ font: "400 15px/1.6 ui-sans-serif, system-ui", color: "#c7c2b2", maxWidth: 760, margin: "0 0 22px" }}>
            Every card in this deck is a single point where <strong>four axes</strong> meet. Two are woven
            into a grid you read directly — its <strong>suit</strong> and its <strong>rank</strong>. A third
            is laid <em>across</em> that grid as a substrate, dissolved into mood — the{" "}
            <strong>transversal</strong>. And a fourth is latent in the card's number — its{" "}
            <strong>prime factorization</strong>. A card's whole meaning is the integration of all four.
            Explore each below.
          </p>
          <AxisExplorer key={deckId} deck={d} />
        </section>
      </div>
    </div>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: 40 }}>
      <p>Unknown deck “{id}”.</p>
      <button onClick={() => navigate("/")} style={cta(false)}>← all decks</button>
    </div>
  );
}

const sectionH: React.CSSProperties = { font: "600 13px/1 ui-sans-serif, system-ui", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa0b0", margin: "0 0 12px" };
function cta(primary: boolean): React.CSSProperties {
  return { all: "unset", cursor: "pointer", padding: "10px 16px", borderRadius: 9, font: "600 14px/1 ui-sans-serif, system-ui", background: primary ? "#e9dcc0" : "transparent", color: primary ? "#0b0b14" : "#e9dcc0", border: primary ? "none" : "1px solid rgba(255,255,255,0.2)" };
}
