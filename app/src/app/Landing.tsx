import { useState } from "react";
import { listDecks } from "@/decks";
import { loadCustomDeck } from "@/decks/custom";
import { isIllustrated } from "@/runtime/defineCard";
import { Svg } from "@/components/cardMeta";
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
    <div style={page}>
      {/* Editorial hero */}
      <header style={{ marginBottom: "var(--s-6)" }}>
        <div style={kicker}>The Vitrine · custom tarot</div>
        <h1 style={hero}>Generative Arcana</h1>
        <p style={lede}>
          A home for <em>custom tarot decks</em> — each woven from four symbolic axes (suit, rank, a
          transversal substrate, and the prime/composite character of every number), illustrated with
          animated p5.js cards. Browse a deck's structure and art, or compose a reading: ask a question,
          deal a spread, and get a shareable link any LLM can interpret — no account, no tokens.
        </p>
      </header>

      <div style={grid}>
        {decks.map((d) => {
          const illustrated = d.cards.filter((c) => isIllustrated(d.id, c.slug)).length;
          const glyphSvg = deckGlyphSvg(d);
          return (
            <button key={d.id} onClick={() => navigate(`/deck/${d.id}`)} style={tileBtn} onMouseEnter={lift} onMouseLeave={drop}>
              {/* data-theme makes --accent / glyph resolve to THIS deck's world */}
              <div data-theme={d.id} style={tileInner}>
                <div style={previewBand}>
                  {glyphSvg && (
                    <span style={watermark} aria-hidden>
                      <Svg svg={glyphSvg} size={92} />
                    </span>
                  )}
                </div>
                <div style={tileBody}>
                  <div style={deckName}>{d.name}</div>
                  <div style={tagline}>{d.tagline}</div>
                  <div style={metaLine}>
                    {(d.custom ? "pasted deck" : d.data.theme.creator)} · {d.cards.length} cards ·{" "}
                    {illustrated === 0 ? "(generative)" : `${illustrated} illustrated`}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Paste-your-own tile */}
        <button
          onClick={() => { setPasting((p) => !p); setError(null); }}
          style={pasteTile}
          onMouseEnter={lift}
          onMouseLeave={drop}
        >
          <div style={pasteInner}>
            <div style={pasteTitle}>+ Paste your own</div>
            <div style={pasteCopy}>
              Load any generative-arcana deck JSON. Data, browsing, and readings work; cards show as
              placeholders until illustrated.
            </div>
          </div>
        </button>
      </div>

      {pasting && (
        <div style={{ marginTop: "var(--s-4)" }}>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
            placeholder="Paste a deck.json here…"
            spellCheck={false}
            style={textarea}
          />
          {error && <div style={errorMsg}>{error}</div>}
          <div style={{ marginTop: "var(--s-3)" }}>
            <button onClick={load} disabled={!text.trim()} style={primaryBtn(!text.trim())}>Load deck</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The watermark glyph for a tile: the deck's first suit symbol, falling back to its major-arcana symbol. */
function deckGlyphSvg(d: { data: { suits: Record<string, unknown>; major_arcana: unknown } }): string | undefined {
  const firstSuit = Object.values(d.data.suits)[0] as { symbol?: { svg?: string } } | undefined;
  const major = d.data.major_arcana as { symbol?: { svg?: string } } | undefined;
  return firstSuit?.symbol?.svg ?? major?.symbol?.svg;
}

// ── hover handlers (CSS-var-driven lift; no transition on var()-fed colors) ──
function lift(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.transform = "translateY(-4px)";
  e.currentTarget.style.boxShadow = "var(--e-2)";
}
function drop(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "var(--e-1)";
}

// ── styles (tokens only) ──────────────────────────────────────────────────────
const page: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "clamp(var(--s-4), 5vw, var(--s-6)) clamp(var(--s-3), 4vw, 28px) var(--s-6)",
  boxSizing: "border-box",
};

const kicker: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  marginBottom: "var(--s-3)",
};

const hero: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: "clamp(40px, 6vw, 84px)",
  lineHeight: 1.02,
  letterSpacing: "-0.01em",
  color: "var(--ink)",
  maxWidth: "16ch",
  margin: 0,
};

const lede: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  fontSize: "clamp(16px, 1.6vw, 19px)",
  lineHeight: 1.6,
  color: "var(--ink-2)",
  maxWidth: "60ch",
  marginTop: "var(--s-4)",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))",
  gap: "var(--s-4)",
};

const tileBtn: React.CSSProperties = {
  all: "unset",
  cursor: "pointer",
  display: "block",
  boxSizing: "border-box",
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: "var(--r-3)",
  boxShadow: "var(--e-1)",
  overflow: "hidden",
  transition: "transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease)",
};

const tileInner: React.CSSProperties = { display: "block" };

const previewBand: React.CSSProperties = {
  position: "relative",
  height: 108,
  overflow: "hidden",
  // a subtle identity gradient built from the deck's own accent
  background:
    "linear-gradient(135deg, var(--accent-wash), transparent 70%), linear-gradient(0deg, var(--card), var(--paper-2))",
  borderBottom: "1px solid var(--line)",
  color: "var(--accent)",
};

const watermark: React.CSSProperties = {
  position: "absolute",
  right: -8,
  bottom: -10,
  opacity: 0.46,
  display: "inline-flex",
  pointerEvents: "none",
};

const tileBody: React.CSSProperties = { padding: "var(--s-3) var(--s-4) var(--s-4)" };

const deckName: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: 21,
  lineHeight: 1.15,
  color: "var(--ink)",
};

const tagline: React.CSSProperties = {
  marginTop: "var(--s-1)",
  fontFamily: "var(--font-body)",
  fontSize: 13.5,
  lineHeight: 1.45,
  color: "var(--ink-2)",
};

const metaLine: React.CSSProperties = {
  marginTop: "var(--s-3)",
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};

const pasteTile: React.CSSProperties = {
  all: "unset",
  cursor: "pointer",
  display: "block",
  boxSizing: "border-box",
  background: "var(--card)",
  border: "1px dashed var(--line-2)",
  borderRadius: "var(--r-3)",
  boxShadow: "var(--e-1)",
  overflow: "hidden",
  transition: "transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease)",
};

const pasteInner: React.CSSProperties = {
  padding: "var(--s-4)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 108,
};

const pasteTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: 21,
  lineHeight: 1.15,
  color: "var(--ink)",
};

const pasteCopy: React.CSSProperties = {
  marginTop: "var(--s-2)",
  fontFamily: "var(--font-body)",
  fontSize: 13.5,
  lineHeight: 1.45,
  color: "var(--ink-2)",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 160,
  resize: "vertical",
  boxSizing: "border-box",
  background: "var(--paper-2)",
  color: "var(--ink)",
  border: "1px solid var(--line)",
  borderRadius: "var(--r-2)",
  padding: "var(--s-3)",
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
  lineHeight: 1.5,
};

const errorMsg: React.CSSProperties = {
  color: "var(--error)",
  marginTop: "var(--s-2)",
  fontFamily: "var(--font-body)",
  fontSize: 13,
  lineHeight: 1.4,
};

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    all: "unset",
    cursor: disabled ? "default" : "pointer",
    padding: "10px 18px",
    borderRadius: "var(--r-2)",
    background: disabled ? "var(--paper-2)" : "var(--accent)",
    color: disabled ? "var(--ink-3)" : "var(--accent-ink)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1,
  };
}
