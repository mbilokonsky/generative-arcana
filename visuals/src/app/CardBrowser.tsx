import { useMemo, useState } from "react";
import { getDeck } from "@/decks";
import { hasCardSketch } from "@/runtime/defineCard";
import { DeckGrid } from "@/components/DeckGrid";
import { DeckTabs } from "./DeckTabs";
import { navigate } from "./router";
import type { CardData } from "@/runtime/types";

type Named = { slug?: string; name: string; index?: number };

function numericKind(numStr: string): "identity" | "prime" | "composite" {
  const n = parseInt(numStr, 10);
  if (n <= 1) return "identity";
  let m = n;
  const f: number[] = [];
  for (let dd = 2; dd * dd <= m; dd++) while (m % dd === 0) { f.push(dd); m /= dd; }
  if (m > 1) f.push(m);
  return f.length === 1 ? "prime" : "composite";
}

export function CardBrowser({ deckId }: { deckId: string }) {
  const deck = getDeck(deckId);
  const [q, setQ] = useState("");
  const [arcana, setArcana] = useState("");
  const [suit, setSuit] = useState("");
  const [rank, setRank] = useState("");
  const [virtue, setVirtue] = useState("");
  const [comp, setComp] = useState("");
  const [illustratedOnly, setIllustratedOnly] = useState(false);

  const opts = useMemo(() => {
    if (!deck) return { suits: [], ranks: [], virtues: [] as Named[] };
    const byIndex = (a: Named, b: Named) => (a.index ?? 0) - (b.index ?? 0);
    const suits = (Object.entries(deck.data.suits) as [string, Named][]).map(([slug, s]) => ({ ...s, slug })).sort(byIndex);
    const ranks = (Object.entries(deck.data.ranks) as [string, Named][]).map(([slug, r]) => ({ ...r, slug })).sort(byIndex);
    const stations = (deck.data.transversal as { stations: Record<string, Named> }).stations;
    const virtues = (Object.entries(stations) as [string, Named][]).map(([slug, v]) => ({ ...v, slug })).sort(byIndex);
    return { suits, ranks, virtues };
  }, [deck]);

  const filtered = useMemo(() => {
    if (!deck) return [] as CardData[];
    const needle = q.trim().toLowerCase();
    return deck.cards.filter((c) => {
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      if (arcana && c.arcana !== arcana) return false;
      if (suit && c.suit_slug !== suit) return false;
      if (rank && c.rank_slug !== rank) return false;
      if (virtue && c.station_slug !== virtue) return false;
      if (comp && numericKind(c.number) !== comp) return false;
      if (illustratedOnly && !hasCardSketch(c.slug)) return false;
      return true;
    });
  }, [deck, q, arcana, suit, rank, virtue, comp, illustratedOnly]);

  if (!deck) {
    return <div style={{ padding: 40 }}><p>Unknown deck “{deckId}”.</p><button onClick={() => navigate("/")} style={linkBtn}>← all decks</button></div>;
  }

  return (
    <div>
      <DeckTabs deckId={deckId} deckName={deck.name} active="browse" />
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "18px 18px 50px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name…" style={input} />
          <Select value={arcana} onChange={setArcana} label="Arcana" options={[["major", "Major"], ["minor", "Minor"]]} />
          <Select value={suit} onChange={setSuit} label="Suit" options={opts.suits.map((s) => [s.slug!, s.name])} />
          <Select value={rank} onChange={setRank} label="Rank" options={opts.ranks.map((r) => [r.slug!, r.name])} />
          <Select value={virtue} onChange={setVirtue} label="Virtue" options={opts.virtues.map((v) => [v.slug!, v.name])} />
          <Select value={comp} onChange={setComp} label="Number" options={[["identity", "Identity"], ["prime", "Prime"], ["composite", "Composite"]]} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#c7c2b2", font: "400 13px/1 ui-sans-serif, system-ui", cursor: "pointer" }}>
            <input type="checkbox" checked={illustratedOnly} onChange={(e) => setIllustratedOnly(e.target.checked)} /> Illustrated only
          </label>
          <span style={{ color: "#6b7080", font: "400 12px/1 ui-sans-serif, system-ui", marginLeft: "auto" }}>{filtered.length} of {deck.cards.length}</span>
        </div>

        {filtered.length ? (
          <DeckGrid cards={filtered} deck={deck.data} />
        ) : (
          <p style={{ color: "#9aa0b0", padding: "40px 0", textAlign: "center" }}>No cards match those filters.</p>
        )}
      </div>
    </div>
  );
}

function Select({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle} aria-label={label}>
      <option value="">{label}: Any</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

const input: React.CSSProperties = { background: "#0c0c16", color: "#e9dcc0", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "8px 10px", font: "400 13px/1 ui-sans-serif, system-ui", minWidth: 150 };
const selectStyle: React.CSSProperties = { ...input, cursor: "pointer", minWidth: 0 };
const linkBtn: React.CSSProperties = { all: "unset", cursor: "pointer", color: "#9aa0b0", font: "400 13px/1 ui-sans-serif, system-ui" };
