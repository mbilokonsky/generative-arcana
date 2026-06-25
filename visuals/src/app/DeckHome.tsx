import { getDeck } from "@/decks";
import { Glyph } from "@/components/cardMeta";
import { DeckTabs } from "./DeckTabs";
import { navigate } from "./router";

type Suit = { index: number; name: string; slug: string; description: string };
type Rank = { index: number; name: string; description: string };
type Station = { index: number; name: string; description?: string };
type Transversal = { name: string; description: string; ordering_rationale?: string; stations: Record<string, Station> };

export function DeckHome({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);
  if (!deck) return <NotFound id={deckId} />;
  const d = deck.data;
  const suits = (Object.values(d.suits) as Suit[]).sort((a, b) => a.index - b.index);
  const ranks = (Object.values(d.ranks) as Rank[]).sort((a, b) => a.index - b.index);
  const tx = d.transversal as Transversal;
  const stations = (Object.values(tx.stations) as Station[]).sort((a, b) => a.index - b.index);

  return (
    <div>
      <DeckTabs deckId={deckId} deckName={deck.name} active="about" />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "26px 28px 60px" }}>
        <p style={{ font: "400 16px/1.65 ui-sans-serif, system-ui", color: "#d8cfb6", marginTop: 0 }}>{d.theme.description}</p>

        <div style={{ display: "flex", gap: 12, margin: "18px 0 6px" }}>
          <button onClick={() => navigate(`/deck/${deckId}/browse`)} style={cta(true)}>Browse the cards →</button>
          <button onClick={() => navigate(`/deck/${deckId}/read`)} style={cta(false)}>Cast a reading →</button>
        </div>

        <Section title="The four suits">
          <p style={lede}>The grid axes. Each suit is a quadrant of the deck's deepest tensions, declared in line and color.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 14 }}>
            {suits.map((s) => (
              <div key={s.slug} style={panel}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#d8b24a" }}><Glyph which={s.slug} size={22} /></span>
                  <span style={{ font: "600 16px/1 ui-serif, Georgia, serif" }}>{s.name}</span>
                </div>
                <p style={{ ...body, marginTop: 8 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="The ranks">
          <p style={lede}>The other grid axis — fourteen frameworks each suit answers in its own way.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "8px 18px" }}>
            {ranks.map((r) => (
              <div key={r.index} style={{ display: "flex", gap: 8, font: "400 13.5px/1.4 ui-sans-serif, system-ui" }}>
                <span style={{ color: "#c9a44a", fontWeight: 600, minWidth: 64 }}>{r.name}</span>
                <span style={{ color: "#b9b3a2" }}>{firstSentence(r.description)}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={tx.name}>
          <p style={{ ...body, marginTop: 0 }}>{tx.description}</p>
          {tx.ordering_rationale && (
            <p style={{ ...body, color: "#9aa0b0", fontStyle: "italic" }}>{tx.ordering_rationale}</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "8px 18px", marginTop: 10 }}>
            {stations.map((st) => (
              <div key={st.index} style={{ display: "flex", gap: 8, font: "400 13.5px/1.4 ui-sans-serif, system-ui" }}>
                <span style={{ color: "#c9a44a", fontWeight: 600, minWidth: 92 }}>{st.name}</span>
                <span style={{ color: "#b9b3a2" }}>{st.description ?? ""}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="The fourth axis">
          <p style={{ ...body, marginTop: 0 }}>
            Every card's number carries a latent character — an <strong>identity</strong> (0, 1), a{" "}
            <strong>prime</strong> (irreducible), or a <strong>composite</strong> (derived from its factors).
            It tints each card's meaning without ever being declared, and it's surfaced in each card's detail view.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 34 }}>
      <h2 style={{ font: "600 13px/1 ui-sans-serif, system-ui", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa0b0", margin: "0 0 12px" }}>{title}</h2>
      {children}
    </section>
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

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

const body: React.CSSProperties = { font: "400 14px/1.6 ui-sans-serif, system-ui", color: "#c7c2b2" };
const lede: React.CSSProperties = { ...body, color: "#9aa0b0", margin: "0 0 12px" };
const panel: React.CSSProperties = { padding: 16, borderRadius: 12, background: "#13131f", border: "1px solid rgba(255,255,255,0.08)" };
function cta(primary: boolean): React.CSSProperties {
  return { all: "unset", cursor: "pointer", padding: "10px 16px", borderRadius: 9, font: "600 14px/1 ui-sans-serif, system-ui", background: primary ? "#e9dcc0" : "transparent", color: primary ? "#0b0b14" : "#e9dcc0", border: primary ? "none" : "1px solid rgba(255,255,255,0.2)" };
}
