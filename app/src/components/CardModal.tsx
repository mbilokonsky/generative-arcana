/**
 * <CardModal> — a focused, at-a-glance view of one card: the animated card beside its meaning &
 * imagery, with a compact coordinate table (Suit · Rank · Virtue · Composition) at the bottom.
 * Closes on click-outside, the X, or Escape.
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CardArt } from "./CardArt";
import { AxisGlyph, rankLabel, suitLabel } from "./cardMeta";
import type { CardData } from "@/runtime/types";
import type { DeckDataFile } from "@/decks/types";
import type { PackKind } from "@/runtime/defineCard";

type Meaning = { upright: string[]; inverted: string[] };
type StationInfo = { name: string; description?: string; meaning: Meaning };
type AxisInfo = { name: string };

/** Compact prime/composite character of the card number. */
function composition(numStr: string): string {
  const n = parseInt(numStr, 10);
  if (Number.isNaN(n)) return numStr;
  if (n <= 1) return `identity · ${n}`;
  const f: number[] = [];
  let m = n;
  for (let d = 2; d * d <= m; d++) while (m % d === 0) { f.push(d); m /= d; }
  if (m > 1) f.push(m);
  return f.length === 1 ? `prime · ${n}` : `composite · ${n} = ${f.join(" × ")}`;
}

/** Interpolate a suit's name into a rank's generic phrasing ("{suit}" / "the suit" / "SUIT").
 *  Possessive forms (`{suit}'s` / "the suit's") render grammatically: a bare apostrophe when the
 *  suit name already ends in -s (e.g. "Crowns'"), otherwise "'s". */
function suitInterp(text: string, suitName: string): string {
  const possessive = /s$/i.test(suitName) ? `${suitName}'` : `${suitName}'s`;
  return text
    .replace(/\{suit\}'s\b/g, possessive)
    .replace(/\{suit\}/g, suitName)
    .replace(/\bthe suit's\b/gi, possessive)
    .replace(/\bthe suit\b/gi, suitName)
    .replace(/\bSUIT\b/g, suitName);
}

/** The rank's question, suit-interpolated. Prefers the v2 `question` field; falls back to parsing the description. */
function rankQuestion(rank: { question?: string; description?: string } | undefined, suitName: string): string | null {
  if (!rank) return null;
  if (rank.question) return suitInterp(rank.question.trim(), suitName);
  if (rank.description) {
    const m = rank.description.match(/^[^?]*\?/);
    if (m) return suitInterp(m[0].trim(), suitName);
  }
  return null;
}

/** Derive a concise singular label for the transversal axis, e.g. "The Eight Virtues" -> "Virtue". */
function axisLabel(name: string | undefined): string {
  if (!name) return "Axis";
  let s = name.replace(/^the\s+/i, "").replace(/^(one|two|three|four|five|six|seven|eight|nine|ten|twelve)\s+/i, "");
  if (/s$/i.test(s) && !/ss$/i.test(s)) s = s.replace(/s$/i, "");
  return s;
}

export interface CardModalProps {
  card: CardData;
  /** registry id of the deck — resolves which visual pack draws the preview. */
  deckId?: string;
  /** selected pack kind, preferred when resolving the preview's visual. */
  prefer?: PackKind;
  deck?: DeckDataFile;
  onClose: () => void;
}

export function CardModal({ card, deckId, prefer, deck, onClose }: CardModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const transversal = deck?.transversal as { name?: string; stations?: Record<string, StationInfo> } | undefined;
  const station = transversal?.stations?.[card.station_slug];
  const suit = card.suit_slug ? (deck?.suits as Record<string, AxisInfo> | undefined)?.[card.suit_slug] : undefined;
  const rank = card.rank_slug ? (deck?.ranks as Record<string, AxisInfo & { description?: string; question?: string }> | undefined)?.[card.rank_slug] : undefined;

  const isMajor = card.arcana === "major";
  const suitName = isMajor ? "Major Arcana" : (suit?.name ?? suitLabel(deck, card.suit_slug) ?? "—");
  const rankName = isMajor ? "—" : (rankLabel(deck, card.rank_slug) || "—");
  const rankQ = isMajor ? null : rankQuestion(rank, suitName);
  const virtueName = station?.name ?? card.station_slug;
  const virtueDesc = station?.description ?? station?.meaning.upright.slice(0, 3).join(", ");

  const subtitle = isMajor ? `Major Arcana · ${card.number}` : `${rankName} of ${suitName}`;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(4,4,10,0.74)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: "3vh 16px", overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "min(640px, 100%)",
          background: "#12121d", color: "#e9dcc0",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
          boxShadow: "0 20px 70px rgba(0,0,0,0.6)", padding: "18px 22px 20px",
        }}
      >
        <button aria-label="Close" onClick={onClose} style={closeBtn}>✕</button>

        <h2 style={{ font: "600 22px/1.15 ui-serif, Georgia, serif", margin: "2px 30px 0 0" }}>{card.name}</h2>
        <div style={subStyle}>{subtitle}</div>

        {/* card + meaning/imagery, side by side. The card keeps its fixed aspect (alignItems:
            flex-start, so a long card can't stretch it), and the text column scrolls within the
            card's height — so the modal stays a constant size no matter how much prose a card has. */}
        <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ position: "relative", width: 184, flex: "0 0 184px", aspectRatio: "0.66", borderRadius: 12, overflow: "hidden", background: "#0a0a14", border: "1px solid rgba(255,255,255,0.08)" }}>
            <CardArt card={card} deckId={deckId} deck={deck} prefer={prefer} mode="live" />
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 240, maxHeight: 288, overflowY: "auto", paddingRight: 8 }}>
            <Heading>Meaning</Heading>
            <p style={meaningP}><span style={tag}>Upright. </span><span style={{ color: "#d8cfb6" }}>{card.meaning.upright}</span></p>
            <p style={meaningP}><span style={tag}>Reversed. </span><span style={{ color: "#d8cfb6" }}>{card.meaning.inverted}</span></p>

            <Heading style={{ marginTop: 14 }}>Imagery</Heading>
            <p style={{ margin: "5px 0 0", color: "#c7c2b2", font: "400 13.5px/1.5 ui-sans-serif, system-ui" }}>
              {card.visuals.detailed_description}
            </p>
          </div>
        </div>

        {/* coordinate table, at the very bottom */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.09)", display: "grid", gridTemplateColumns: "88px 1fr", rowGap: 8, columnGap: 14, alignItems: "baseline" }}>
          <Row label="Suit">
            <AxisGlyph deck={deck} card={card} size={15} /> <span style={{ marginLeft: 6 }}>{suitName}</span>
          </Row>
          <Row label="Rank">
            <span style={{ fontWeight: 600 }}>{rankName}</span>
            {rankQ && <span style={{ color: "#9aa0b0" }}> — {rankQ}</span>}
          </Row>
          <Row label={axisLabel(transversal?.name)}>
            <span style={{ fontWeight: 600 }}>{virtueName}</span>
            {virtueDesc && <span style={{ color: "#9aa0b0" }}> — {virtueDesc}</span>}
          </Row>
          <Row label="Composition">
            <span>{composition(card.number)}</span>
            {card.factorization?.gloss && (
              <span style={{ flexBasis: "100%", marginTop: 4, color: "#9aa0b0", fontWeight: 400, font: "400 13px/1.5 ui-sans-serif, system-ui" }}>
                {card.factorization.gloss}
              </span>
            )}
          </Row>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ color: "#7c8295", font: "600 11px/1.5 ui-sans-serif, system-ui", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ font: "400 14px/1.4 ui-serif, Georgia, serif", display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>{children}</div>
    </>
  );
}

function Heading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h3 style={{ margin: 0, font: "600 11px/1 ui-sans-serif, system-ui", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9aa0b0", ...style }}>{children}</h3>;
}

const closeBtn: React.CSSProperties = {
  position: "absolute", top: 12, right: 12, width: 30, height: 30, display: "grid", placeItems: "center",
  cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "#e9dcc0",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, font: "400 16px/1 ui-sans-serif, system-ui",
};
const subStyle: React.CSSProperties = { marginTop: 3, color: "#9aa0b0", font: "400 12px/1.3 ui-sans-serif, system-ui", letterSpacing: "0.05em", textTransform: "uppercase" };
const meaningP: React.CSSProperties = { margin: "6px 0 0", font: "400 14px/1.5 ui-sans-serif, system-ui" };
const tag: React.CSSProperties = { color: "#c9a44a", fontWeight: 600 };
