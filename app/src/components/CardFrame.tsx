/**
 * <CardFrame> — the host chrome the deck browser wraps around a card.
 *
 * THIS is where the banner lives (Suit+Rank corner badge + card name) — NOT inside the canvas.
 * It is a DOM overlay on top of <TarotCard>, so it is restyleable independently of the art:
 * every visual is driven by CSS custom properties (override via `style` or a class) and the
 * banner can be turned off, restyled, or replaced wholesale without touching a single sketch.
 */
import { type CSSProperties, useState } from "react";
import type { TarotCardProps } from "./TarotCard";
import { CardModal } from "./CardModal";
import { CardArt } from "./CardArt";
import { AxisGlyph, rankBadge, rankLabel, suitLabel } from "./cardMeta";
import type { DeckDataFile } from "@/decks/types";

export interface CardFrameProps extends Omit<TarotCardProps, "className" | "style" | "sketch"> {
  /** registry id of the deck — resolves which visual pack (if any) draws this card. */
  deckId?: string;
  showBanner?: boolean;
  /** aspect ratio width/height; tarot ~ 0.66. */
  aspect?: number;
  /** show a hover-reveal info button that opens the full card modal. */
  expandable?: boolean;
  /** deck data, so the banner/modal can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  className?: string;
  style?: CSSProperties;
}

export function CardFrame({ card, deckId, showBanner = true, aspect = 0.66, expandable = false, deck, className, style, ...cardProps }: CardFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const isMajor = card.arcana === "major";
  const label = isMajor ? card.number : rankBadge(deck, card.rank_slug, card.number);
  const subtitle = isMajor
    ? `Major Arcana · ${card.number}`
    : `${rankLabel(deck, card.rank_slug)} of ${suitLabel(deck, card.suit_slug)}`;

  const frameStyle: CSSProperties = {
    position: "relative",
    aspectRatio: String(aspect),
    width: "100%",
    borderRadius: "var(--card-radius, 14px)",
    overflow: "hidden",
    background: "var(--card-bg, #0a0a14)",
    boxShadow: "var(--card-shadow, 0 6px 24px rgba(0,0,0,0.45))",
    border: "var(--card-border, 1px solid rgba(255,255,255,0.08))",
    color: "var(--banner-fg, #f3ead0)",
    ...style,
  };

  return (
    <div
      className={className}
      style={frameStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardArt card={card} deckId={deckId} deck={deck} {...cardProps} />

      {showBanner && (
        <>
          {/* corner badge: Suit/Major glyph + Rank/number */}
          <div
            style={{
              position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", gap: 6,
              padding: "6px 9px", margin: 8, borderRadius: "var(--banner-radius, 10px)",
              background: "var(--banner-badge-bg, rgba(8,8,18,0.5))",
              backdropFilter: "var(--banner-blur, blur(3px))",
              font: "var(--banner-badge-font, 600 13px/1 ui-serif, Georgia, serif)",
              letterSpacing: "0.04em",
            }}
          >
            <AxisGlyph deck={deck} card={card} size={16} />
            <span>{label}</span>
          </div>

          {/* title bar */}
          <div
            style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              padding: "14px 14px 12px",
              background: "var(--banner-title-bg, linear-gradient(to top, rgba(6,6,14,0.78), rgba(6,6,14,0)))",
              pointerEvents: "none",
            }}
          >
            <div style={{ font: "var(--banner-name-font, 600 18px/1.15 ui-serif, Georgia, serif)" }}>{card.name}</div>
            <div style={{ marginTop: 3, opacity: 0.72, font: "var(--banner-sub-font, 400 11px/1.2 ui-sans-serif, system-ui)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {subtitle}
            </div>
          </div>
        </>
      )}

      {expandable && (
        <button
          aria-label="Card details"
          onClick={() => setOpen(true)}
          style={{
            position: "absolute", top: 0, left: 0, margin: 8, width: 30, height: 30,
            display: "grid", placeItems: "center", cursor: "pointer",
            background: "var(--info-btn-bg, rgba(8,8,18,0.55))", color: "inherit",
            border: "1px solid rgba(255,255,255,0.16)", borderRadius: 9,
            backdropFilter: "blur(3px)", font: "600 14px/1 ui-serif, Georgia, serif",
            opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 160ms ease",
          }}
        >
          ⤢
        </button>
      )}

      {open && (
        <CardModal card={card} deckId={deckId} deck={deck} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
