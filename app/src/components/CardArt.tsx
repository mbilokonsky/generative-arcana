/**
 * <CardArt> — resolves and renders a card's visual for a given deck and selected pack.
 * `prefer` is the selected pack's kind; resolveKind() honors it but falls back per-card to any other
 * pack that has this card (so a partial pack degrades gracefully), or a placeholder if none does.
 *   kit -> <TarotCard>  ·  p5 -> <RawP5Card>  ·  image -> <img>  ·  none -> <CardPlaceholder>
 */
import { TarotCard } from "./TarotCard";
import { RawP5Card } from "./RawP5Card";
import { CardPlaceholder } from "./CardPlaceholder";
import { getCardSketch, getRawSketch, getCardImage, resolveKind } from "@/runtime/defineCard";
import type { PackKind } from "@/runtime/defineCard";
import type { CardData } from "@/runtime/types";
import type { DeckDataFile } from "@/decks/types";

const FILL: React.CSSProperties = { position: "absolute", inset: 0 };

export interface CardArtProps {
  card: CardData;
  /** registry id of the deck (namespaces its visual packs). */
  deckId?: string;
  /** deck data, for the placeholder's glyph/labels when there's no art. */
  deck?: DeckDataFile;
  /** the selected pack's kind, preferred during resolution. */
  prefer?: PackKind;
  mode?: "live" | "poster";
  paused?: boolean;
  onSignal?: (name: string, detail?: unknown) => void;
}

export function CardArt({ card, deckId, deck, prefer, mode = "live", paused, onSignal }: CardArtProps) {
  const kind = deckId ? resolveKind(deckId, card.slug, prefer) : null;

  if (kind === "kit") {
    return <TarotCard card={card} sketch={getCardSketch(deckId!, card.slug)!} mode={mode} paused={paused} onSignal={onSignal} style={FILL} />;
  }
  if (kind === "p5") {
    return <RawP5Card slug={card.slug} code={getRawSketch(deckId!, card.slug)!} mode={mode} paused={paused} style={FILL} />;
  }
  if (kind === "image") {
    return <img src={getCardImage(deckId!, card.slug)!} alt={card.name} loading="lazy" draggable={false}
      style={{ ...FILL, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  return <CardPlaceholder card={card} deck={deck} />;
}
