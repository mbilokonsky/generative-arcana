import type { Spread } from "@/decks/spreads";

/** One dealt card: an index into the deck's ordered card list, plus orientation. */
export interface DealtCard {
  index: number;
  reversed: boolean;
}

/** The compact, URL-encodable reading payload (kept in the # fragment, never sent to a server). */
export interface ReadingToken {
  v: 1;
  /** deck id */
  d: string;
  /** spread id (generic/per-deck) OR an inline custom Spread */
  s: string | Spread;
  /** question text */
  q: string;
  /** dealt cards: [cardIndex, reversed(0|1)] */
  c: [number, 0 | 1][];
}
