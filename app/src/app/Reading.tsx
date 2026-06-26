import { useEffect, useMemo, useState } from "react";
import { getDeck } from "@/decks";
import { spreadsForDeck, resolveSpread, type Spread } from "@/decks/spreads";
import { CardFrame } from "@/components/CardFrame";
import { deal } from "@/reading/deal";
import { encodeReading, decodeReading, tokenToDealt } from "@/reading/encode";
import { buildPrompt } from "@/reading/prompt";
import type { DealtCard } from "@/reading/types";
import type { DeckModule } from "@/decks/types";
import { DeckTabs } from "./DeckTabs";
import { navigate } from "./router";
import { getPackId } from "./packPref";
import { listPacks } from "@/runtime/defineCard";

export function Reading({ deckId, token }: { deckId: string; token?: string }) {
  const deck = getDeck(deckId);
  if (!deck) {
    return <div style={{ padding: 40 }}><p>Unknown deck “{deckId}”.</p><button onClick={() => navigate("/")} style={link}>← all decks</button></div>;
  }
  return (
    <div>
      <DeckTabs deckId={deckId} deckName={deck.name} active="read" />
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 22px 60px" }}>
        {token ? <ReadingResult deck={deck} token={token} /> : <ReadingComposer deck={deck} />}
      </div>
    </div>
  );
}

function ReadingComposer({ deck }: { deck: DeckModule }) {
  const spreads = useMemo(() => spreadsForDeck(deck.spreads), [deck]);
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState(spreads[1]?.id ?? spreads[0].id);
  const spread = spreads.find((s) => s.id === spreadId)!;

  function castReading() {
    const dealt = deal(spread, deck.cards.length);
    const tk = encodeReading(deck.id, spread.id, question.trim(), dealt);
    navigate(`/deck/${deck.id}/r/${tk}`);
  }

  return (
    <div>
      <h2 style={{ font: "600 24px/1.1 ui-serif, Georgia, serif", margin: "0 0 4px" }}>Cast a reading</h2>
      <p style={{ color: "#9aa0b0", marginTop: 0 }}>Ask a question, choose a spread, and deal. You'll get a shareable link and an LLM-ready prompt.</p>

      <label style={fieldLabel}>Your question <span style={{ opacity: 0.5 }}>(optional)</span></label>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What should I focus on right now?"
        style={{ width: "100%", minHeight: 70, boxSizing: "border-box", resize: "vertical", background: "#0c0c16", color: "#e9dcc0", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: 12, font: "400 15px/1.5 ui-sans-serif, system-ui" }}
      />

      <label style={{ ...fieldLabel, marginTop: 18 }}>Spread</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {spreads.map((s) => {
          const on = s.id === spreadId;
          return (
            <button key={s.id} onClick={() => setSpreadId(s.id)} style={{ ...spreadCard, borderColor: on ? "#d8b24a" : "rgba(255,255,255,0.1)", background: on ? "#191628" : "#13131f" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <span style={{ font: "600 15px/1.2 ui-serif, Georgia, serif" }}>{s.name}</span>
                <span style={{ color: "#6b7080", font: "400 11px/1 ui-sans-serif, system-ui" }}>{s.positions.length} card{s.positions.length > 1 ? "s" : ""}{s.deckId ? " · native" : ""}</span>
              </div>
              <div style={{ marginTop: 5, color: "#9aa0b0", font: "400 12.5px/1.4 ui-sans-serif, system-ui" }}>{s.description}</div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 22 }}>
        <button onClick={castReading} style={dealBtn}>Deal {spread.positions.length} card{spread.positions.length > 1 ? "s" : ""}</button>
      </div>
    </div>
  );
}

function ReadingResult({ deck, token }: { deck: DeckModule; token: string }) {
  const decoded = useMemo(() => decodeReading(token), [token]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { setCopied(null); }, [token]);

  if (!decoded) return <p style={{ color: "#e0506a" }}>This reading link is malformed.</p>;
  const spread: Spread | undefined = resolveSpread(decoded.s, deck.spreads);
  if (!spread) return <p style={{ color: "#e0506a" }}>Unknown spread in this reading.</p>;

  const dealt: DealtCard[] = tokenToDealt(decoded);
  const prompt = buildPrompt(deck, spread, dealt, decoded.q);
  const packs = listPacks(deck.id);
  const prefer = (packs.find((p) => p.id === getPackId(deck.id, packs[0]?.id ?? "")) ?? packs[0])?.kind;

  function copy(text: string, which: string) {
    navigator.clipboard?.writeText(text).then(() => { setCopied(which); setTimeout(() => setCopied(null), 1800); });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ font: "600 24px/1.1 ui-serif, Georgia, serif", margin: "0 0 2px" }}>{spread.name}</h2>
          {decoded.q && <p style={{ margin: 0, color: "#d8cfb6", font: "400 15px/1.4 ui-sans-serif, system-ui" }}>“{decoded.q}”</p>}
        </div>
        <button onClick={() => navigate(`/deck/${deck.id}/read`)} style={link}>↻ new reading</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 18, marginTop: 22 }}>
        {dealt.map((dc, i) => {
          const card = deck.cards[dc.index];
          const pos = spread.positions[i];
          if (!card || !pos) return null;
          const meaning = dc.reversed ? card.meaning.inverted : card.meaning.upright;
          return (
            <div key={i}>
              <div style={{ color: "#c9a44a", font: "600 12px/1.2 ui-sans-serif, system-ui", letterSpacing: "0.04em", textTransform: "uppercase" }}>{i + 1}. {pos.name}</div>
              <div style={{ color: "#6b7080", font: "400 11px/1.3 ui-sans-serif, system-ui", margin: "2px 0 8px" }}>{pos.prompt}</div>
              <div style={{ transform: dc.reversed ? "rotate(180deg)" : "none" }}>
                <CardFrame card={card} deckId={deck.id} prefer={prefer} deck={deck.data} showBanner={false} mode="poster" />
              </div>
              <div style={{ marginTop: 8, font: "600 14px/1.25 ui-serif, Georgia, serif" }}>
                {card.name} {dc.reversed && <span style={{ color: "#e0506a", font: "600 11px/1 ui-sans-serif, system-ui" }}>· Reversed</span>}
              </div>
              <p style={{ margin: "5px 0 0", color: "#b9b3a2", font: "400 12.5px/1.45 ui-sans-serif, system-ui" }}>{meaning}</p>
            </div>
          );
        })}
      </div>

      <section style={{ marginTop: 34, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ font: "600 13px/1 ui-sans-serif, system-ui", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa0b0", margin: "0 0 10px" }}>Take it to an LLM</h3>
        <p style={{ color: "#9aa0b0", font: "400 13.5px/1.5 ui-sans-serif, system-ui", marginTop: 0 }}>
          Share the link (a browsing model can open it), or copy the self-contained prompt into any model. Nothing is sent to a server — the whole reading lives in the URL fragment.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => copy(window.location.href, "link")} style={secondaryBtn}>{copied === "link" ? "Copied link ✓" : "Copy share link"}</button>
          <button onClick={() => copy(prompt, "prompt")} style={dealBtn}>{copied === "prompt" ? "Copied prompt ✓" : "Copy reading for an LLM"}</button>
        </div>
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: "pointer", color: "#9aa0b0", font: "400 13px/1 ui-sans-serif, system-ui" }}>Preview the prompt</summary>
          <pre style={{ marginTop: 10, padding: 14, background: "#0c0c16", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#c7c2b2", font: "400 12px/1.5 ui-monospace, monospace", whiteSpace: "pre-wrap", overflowX: "auto" }}>{prompt}</pre>
        </details>
      </section>
    </div>
  );
}

const fieldLabel: React.CSSProperties = { display: "block", color: "#9aa0b0", font: "600 12px/1 ui-sans-serif, system-ui", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" };
const spreadCard: React.CSSProperties = { all: "unset", cursor: "pointer", display: "block", padding: 14, borderRadius: 11, border: "1px solid", boxSizing: "border-box" };
const dealBtn: React.CSSProperties = { all: "unset", cursor: "pointer", padding: "11px 20px", borderRadius: 9, background: "#e9dcc0", color: "#0b0b14", font: "600 14px/1 ui-sans-serif, system-ui" };
const secondaryBtn: React.CSSProperties = { all: "unset", cursor: "pointer", padding: "11px 18px", borderRadius: 9, background: "transparent", color: "#e9dcc0", border: "1px solid rgba(255,255,255,0.2)", font: "600 14px/1 ui-sans-serif, system-ui" };
const link: React.CSSProperties = { all: "unset", cursor: "pointer", color: "#9aa0b0", font: "400 13px/1 ui-sans-serif, system-ui" };
