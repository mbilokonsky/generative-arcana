/**
 * <CardFrame> — the host chrome the deck browser wraps around a card.
 *
 * THIS is where the banner lives (Suit+Rank corner badge + card name) — NOT inside the canvas.
 * It is a DOM overlay on top of <TarotCard>, so it is restyleable independently of the art:
 * every visual is driven by CSS custom properties (override via `style` or a class) and the
 * banner can be turned off, restyled, or replaced wholesale without touching a single sketch.
 */
import { type CSSProperties } from "react";
import type { TarotCardProps } from "./TarotCard";
import { CardArt } from "./CardArt";
import { AxisGlyph, rankBadge, suitLabel, stationName, omega, facVar, facWord } from "./cardMeta";
import type { DeckDataFile } from "@/decks/types";
import type { PackKind } from "@/runtime/defineCard";

const SHADOW = "0 1px 3px rgba(0,0,0,0.6)";

export interface CardFrameProps extends Omit<TarotCardProps, "className" | "style" | "sketch"> {
  /** registry id of the deck — resolves which visual pack (if any) draws this card. */
  deckId?: string;
  /** selected pack kind, preferred when resolving the card's visual. */
  prefer?: PackKind;
  showBanner?: boolean;
  /** aspect ratio width/height; tarot ~ 0.66. */
  aspect?: number;
  /** when set, a full-bleed overlay button invites a click and calls this (the host opens the modal,
   *  so prev/next can walk the host's ordered list). */
  onOpen?: () => void;
  /** deck data, so the banner can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  className?: string;
  style?: CSSProperties;
}

export function CardFrame({ card, deckId, prefer, showBanner = true, aspect = 0.66, onOpen, deck, className, style, ...cardProps }: CardFrameProps) {
  const isMajor = card.arcana === "major";
  const label = isMajor ? card.number : rankBadge(deck, card.rank_slug, card.number);
  const station = stationName(deck, card.station_slug);
  const subtitle = isMajor
    ? "Major Arcana"
    : [suitLabel(deck, card.suit_slug), station].filter(Boolean).join(" · ");
  const o = omega(parseInt(card.number, 10));

  const frameStyle: CSSProperties = {
    position: "relative", aspectRatio: String(aspect), width: "100%",
    borderRadius: "var(--r-2)", overflow: "hidden",
    background: "var(--card)", boxShadow: "var(--e-1)", border: "1px solid var(--line)",
    color: "var(--banner-fg)", ...style,
  };

  return (
    <div className={className} style={frameStyle}>
      <CardArt card={card} deckId={deckId} deck={deck} prefer={prefer} {...cardProps} />

      {showBanner && (
        <>
          <div style={{ position: "absolute", inset: "0 0 auto 0", height: "38%", background: "linear-gradient(to bottom, var(--scrim-soft), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "auto 0 0 0", height: "56%", background: "linear-gradient(to top, var(--scrim), transparent)", pointerEvents: "none" }} />

          {/* top-left: suit/major glyph + number */}
          <div style={{ position: "absolute", top: 0, left: 0, margin: 9, display: "flex", alignItems: "center", gap: 5, color: "#fff", pointerEvents: "none" }}>
            <AxisGlyph deck={deck} card={card} size={15} />
            <span style={{ font: "600 12px/1 var(--font-mono)", textShadow: SHADOW }}>{label}</span>
          </div>

          {/* top-right: the Ω composition dot */}
          <span aria-hidden title={`${card.number} · ${facWord(o)} (Ω${o})`}
            style={{ position: "absolute", top: 0, right: 0, margin: 11, width: 9, height: 9, borderRadius: "50%", background: `var(${facVar(o)})`, boxShadow: "0 0 0 2px var(--scrim-soft)", pointerEvents: "none" }} />

          {/* bottom: title bar */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 13px 11px", pointerEvents: "none" }}>
            <div style={{ font: "400 17px/1.12 var(--font-display)", color: "#fff", textShadow: SHADOW }}>{card.name}</div>
            <div style={{ marginTop: 3, font: "400 10px/1.2 var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)", textShadow: SHADOW }}>{subtitle}</div>
          </div>
        </>
      )}

      {onOpen && (
        <button aria-label={`Open ${card.name}`} onClick={onOpen}
          style={{ all: "unset", position: "absolute", inset: 0, cursor: "pointer" }} />
      )}
    </div>
  );
}
