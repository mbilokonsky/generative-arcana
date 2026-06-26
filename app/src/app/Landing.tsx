import { useState } from "react";
import { listDecks } from "@/decks";
import { loadCustomDeck } from "@/decks/custom";
import { hasCardSketch } from "@/runtime/defineCard";
import { navigate } from "./router";

export function Landing() {
  const decks = listDecks();
  const [pasting, setPasting] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function load() {
    const res = loadCustomDeck(text);
    if (!res.ok) { setError(res.error); return; }
    navigate(`/deck/${res.deck.id}`);
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 28px 60px" }}>
      <h1 style={{ font: "600 38px/1.05 ui-serif, Georgia, serif", margin: 0 }}>Generative Arcana</h1>
      <p style={{ color: "#c7c2b2", font: "400 17px/1.6 ui-sans-serif, system-ui", maxWidth: 680, marginTop: 14 }}>
        A home for <em>custom tarot decks</em> — each woven from four symbolic axes (suit, rank, a
        transversal substrate, and the prime/composite character of every number), illustrated with
        animated p5.js cards. Browse a deck's structure and art, or compose a reading: ask a question,
        deal a spread, and get a shareable link any LLM can interpret — no account, no tokens.
      </p>

      <h2 style={sectionH}>Decks</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {decks.map((d) => {
          const illustrated = d.cards.filter((c) => hasCardSketch(c.slug)).length;
          return (
            <button key={d.id} onClick={() => navigate(`/deck/${d.id}`)} style={deckCard}>
              <div style={{ font: "600 20px/1.2 ui-serif, Georgia, serif" }}>{d.name}</div>
              <div style={{ marginTop: 6, color: "#9aa0b0", font: "400 14px/1.45 ui-sans-serif, system-ui" }}>{d.tagline}</div>
              <div style={metaLine}>
                {d.custom ? "pasted deck" : d.data.theme.creator} · {d.cards.length} cards · {illustrated} illustrated
              </div>
            </button>
          );
        })}

        <button onClick={() => { setPasting((p) => !p); setError(null); }} style={{ ...deckCard, borderStyle: "dashed", color: "#9aa0b0" }}>
          <div style={{ font: "600 20px/1.2 ui-serif, Georgia, serif", color: "#e9dcc0" }}>+ Paste your own</div>
          <div style={{ marginTop: 6, font: "400 14px/1.45 ui-sans-serif, system-ui" }}>
            Load any generative-arcana deck JSON. Data, browsing, and readings work; cards show as
            placeholders until illustrated.
          </div>
        </button>
      </div>

      {pasting && (
        <div style={{ marginTop: 20 }}>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
            placeholder="Paste a deck.json here…"
            spellCheck={false}
            style={{
              width: "100%", minHeight: 160, resize: "vertical", boxSizing: "border-box",
              background: "#0c0c16", color: "#d8cfb6", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, padding: 12, font: "400 12px/1.5 ui-monospace, monospace",
            }}
          />
          {error && <div style={{ color: "#e0506a", marginTop: 8, font: "400 13px/1.4 ui-sans-serif, system-ui" }}>{error}</div>}
          <div style={{ marginTop: 10 }}>
            <button onClick={load} disabled={!text.trim()} style={primaryBtn(!text.trim())}>Load deck</button>
          </div>
        </div>
      )}
    </div>
  );
}

const sectionH: React.CSSProperties = { font: "600 14px/1 ui-sans-serif, system-ui", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa0b0", margin: "40px 0 14px" };
const deckCard: React.CSSProperties = { all: "unset", cursor: "pointer", display: "block", padding: 20, borderRadius: 14, background: "#13131f", border: "1px solid rgba(255,255,255,0.08)", boxSizing: "border-box" };
const metaLine: React.CSSProperties = { marginTop: 12, opacity: 0.55, font: "400 12px/1 ui-sans-serif, system-ui", letterSpacing: "0.05em", textTransform: "uppercase" };
function primaryBtn(disabled: boolean): React.CSSProperties {
  return { all: "unset", cursor: disabled ? "default" : "pointer", padding: "10px 18px", borderRadius: 9, background: disabled ? "#3a3a48" : "#e9dcc0", color: disabled ? "#888" : "#0b0b14", font: "600 14px/1 ui-sans-serif, system-ui" };
}
