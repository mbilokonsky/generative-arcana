/**
 * The Byrne Journey Tarot — registered for the app.
 *
 * Migrated from the prior tool into v2 (transversal "The Room" added; see /decks/byrne/deck.json
 * via @decks). No card sketches yet — cards render as placeholders until a visual pack is wired,
 * so this module registers the manifest only (no ./cards side-effect).
 */
import deckJson from "@decks/byrne/deck.json";
import { registerDeck } from "../registry";
import type { DeckDataFile, DeckModule } from "../types";
import type { CardData } from "@/runtime/types";

const data = deckJson as unknown as DeckDataFile;

export const byrneDeck: DeckModule = registerDeck({
  id: "byrne",
  name: data.name,
  tagline: "David Byrne's journey, from nervous art to embodied communion.",
  data,
  cards: Object.values(data.cards) as CardData[],
});
