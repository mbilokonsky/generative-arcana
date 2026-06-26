/**
 * <CardArt> — resolves and renders a card's visual for a given deck, picking the right kind:
 *   1. a typed CardSketch (Ultima's SketchKit pack)        -> <TarotCard>
 *   2. a raw p5 source string (Ulysses's migrated pack)    -> <RawP5Card>
 *   3. nothing registered                                   -> <CardPlaceholder>
 *
 * Centralizing the choice keeps every host (CardFrame, CardModal, readings) agnostic to how a deck's
 * art is authored — and is the seam a future visual-pack *selector* would hook into.
 */
import { TarotCard } from "./TarotCard";
import { RawP5Card } from "./RawP5Card";
import { CardPlaceholder } from "./CardPlaceholder";
import { getCardSketch, getRawSketch, getCardImage } from "@/runtime/defineCard";
import type { CardData } from "@/runtime/types";
import type { DeckDataFile } from "@/decks/types";

const FILL: React.CSSProperties = { position: "absolute", inset: 0 };

export interface CardArtProps {
  card: CardData;
  /** registry id of the deck (namespaces its visual packs). */
  deckId?: string;
  /** deck data, for the placeholder's glyph/labels when there's no art. */
  deck?: DeckDataFile;
  mode?: "live" | "poster";
  paused?: boolean;
  onSignal?: (name: string, detail?: unknown) => void;
}

export function CardArt({ card, deckId, deck, mode = "live", paused, onSignal }: CardArtProps) {
  const sketch = deckId ? getCardSketch(deckId, card.slug) : undefined;
  if (sketch) {
    return <TarotCard card={card} sketch={sketch} mode={mode} paused={paused} onSignal={onSignal} style={FILL} />;
  }
  const raw = deckId ? getRawSketch(deckId, card.slug) : undefined;
  if (raw) {
    return <RawP5Card slug={card.slug} code={raw} mode={mode} paused={paused} style={FILL} />;
  }
  const img = deckId ? getCardImage(deckId, card.slug) : undefined;
  if (img) {
    return <img src={img} alt={card.name} loading="lazy" draggable={false}
      style={{ ...FILL, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  return <CardPlaceholder card={card} deck={deck} />;
}
