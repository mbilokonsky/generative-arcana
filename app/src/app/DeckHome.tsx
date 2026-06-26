import { getDeck } from "@/decks";
import { AxisExplorer } from "./AxisExplorer";
import { navigate } from "./router";

export function DeckHome({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);
  if (!deck) return <NotFound id={deckId} />;
  const d = deck.data;
  const transversalName = (d.transversal as { name?: string } | undefined)?.name ?? "";
  const creator = d.theme.creator;

  return (
    <div>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(16px,4vw,28px) 60px" }}>
        <p style={kicker}>
          {transversalName}{transversalName && creator ? " · " : ""}{creator ? `a deck by ${creator}` : ""}
        </p>

        <h1 style={headline}>{deck.name}</h1>

        <p style={description}>{d.theme.description}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)", margin: "var(--s-4) 0 var(--s-5)" }}>
          <button onClick={() => navigate(`/deck/${deckId}/browse`)} style={cta(true)}>Browse the cards →</button>
          <button onClick={() => navigate(`/deck/${deckId}/read`)} style={cta(false)}>Cast a reading</button>
        </div>

        <section>
          <h2 style={sectionH}>The four axes</h2>
          <p style={introBody}>
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
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "var(--s-5)" }}>
      <p style={{ font: "400 16px/1.6 var(--font-body)", color: "var(--ink)" }}>Unknown deck “{id}”.</p>
      <button onClick={() => navigate("/")} style={cta(false)}>← all decks</button>
    </div>
  );
}

const kicker: React.CSSProperties = {
  font: "400 12px/1.4 var(--font-mono)",
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  margin: "0 0 var(--s-3)",
};

const headline: React.CSSProperties = {
  font: "400 clamp(34px,4.5vw,64px)/1.05 var(--font-display)",
  color: "var(--ink)",
  margin: "0 0 var(--s-3)",
};

const description: React.CSSProperties = {
  font: "400 17px/1.65 var(--font-body)",
  color: "var(--ink-2)",
  maxWidth: "68ch",
  margin: 0,
};

const sectionH: React.CSSProperties = {
  font: "400 12px/1 var(--font-mono)",
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  margin: "0 0 var(--s-3)",
};

const introBody: React.CSSProperties = {
  font: "400 15px/1.6 var(--font-body)",
  color: "var(--ink-2)",
  maxWidth: 760,
  margin: "0 0 var(--s-4)",
};

function cta(primary: boolean): React.CSSProperties {
  return {
    all: "unset",
    cursor: "pointer",
    padding: "12px 18px",
    borderRadius: "var(--r-2)",
    font: "600 14px/1 var(--font-body)",
    background: primary ? "var(--accent)" : "transparent",
    color: primary ? "var(--accent-ink)" : "var(--ink)",
    border: primary ? "1px solid var(--accent)" : "1px solid var(--line-2)",
    transition: "background var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease)",
  };
}
