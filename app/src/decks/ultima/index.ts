/**
 * The Ultima Tarot deck — the app's renderer for it. Importing this module:
 *   1. registers all implemented card sketches (side effect of ./cards)
 *   2. registers the deck manifest into the global deck registry
 *
 * The canonical DATA lives in the top-level corpus (`/decks/ultima/deck.json`, via `@decks`);
 * the card sketches here are this app's *visual pack* for that data, paired by deck id.
 */
import deckJson from "@decks/ultima/deck.json";
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
  spreads: [
    {
      id: "three-principles",
      name: "The Three Principles",
      description: "Britannia's three roots of virtue — Truth, Love, and Courage — read the matter.",
      deckId: "ultima",
      positions: [
        { name: "Truth", prompt: "what is honestly so; what must be seen clearly" },
        { name: "Love", prompt: "where compassion and connection lie" },
        { name: "Courage", prompt: "what valor the situation asks of you" },
      ],
    },
  ],
});
