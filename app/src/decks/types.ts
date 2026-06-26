import type { CardData } from "@/runtime/types";
import type { Spread } from "./spreads";

/** The raw shape of a deck's deck.json (as emitted by the generative-arcana skill). */
export interface DeckDataFile {
  name: string;
  slug: string;
  version: string;
  theme: { name: string; description: string; creator: string };
  suits: Record<string, unknown>;
  ranks: Record<string, unknown>;
  transversal: unknown;
  major_arcana: unknown;
  cards: Record<string, CardData>;
}

/**
 * A registered deck. A deck folder under src/decks/<id>/ provides:
 *   - deck.json   (the data)
 *   - cards/      (p5 sketches; importing them registers each via registerCard)
 *   - index.ts    (calls registerDeck with this manifest)
 * Spreads (generic + deck-native) attach here in the next pass.
 */
export interface DeckModule {
  id: string;
  name: string;
  tagline: string;
  data: DeckDataFile;
  /** ordered card list for the browser (majors first, then minors by suit/rank). */
  cards: CardData[];
  /** spreads native to this deck, offered alongside the generic ones. */
  spreads?: Spread[];
  /** true for decks loaded from pasted JSON (not bundled). */
  custom?: boolean;
}
