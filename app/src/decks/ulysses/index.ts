/**
 * Ulysses Tarot — registered for the app.
 *
 * Migrated from the prior tool into v2 (transversal "Vico's Cycle" added; see /decks/ulysses/deck.json
 * via @decks). Intentionally 21 majors / 77 cards (Portrait → 18 episodes → Trieste-Zurich-Paris →
 * Riverrun). No card sketches yet — placeholder rendering, manifest-only registration.
 */
import deckJson from "@decks/ulysses/deck.json";
import { registerDeck } from "../registry";
import type { DeckDataFile, DeckModule } from "../types";
import type { CardData } from "@/runtime/types";

const data = deckJson as unknown as DeckDataFile;

export const ulyssesDeck: DeckModule = registerDeck({
  id: "ulysses",
  name: data.name,
  tagline: "One Dublin day as odyssey — wisdom in one's relationship to the ordinary.",
  data,
  cards: Object.values(data.cards) as CardData[],
});
