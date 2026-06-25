/**
 * The Ultima Tarot deck. Importing this module:
 *   1. registers all implemented card sketches (side effect of ./cards)
 *   2. registers the deck manifest into the global deck registry
 */
import deckJson from "./deck.json";
import { registerDeck } from "../registry";
import type { DeckDataFile, DeckModule } from "../types";
import type { CardData } from "@/runtime/types";
import "./cards"; // side effect: registers the 5 (of 78) sketches via registerCard

const data = deckJson as unknown as DeckDataFile;

export const ultimaDeck: DeckModule = registerDeck({
  id: "ultima",
  name: data.name,
  tagline: "The Avatar's quest, from Stranger to Codex.",
  data,
  cards: Object.values(data.cards) as CardData[],
});
