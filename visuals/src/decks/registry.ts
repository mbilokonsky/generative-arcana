import type { DeckModule } from "./types";

/** Global deck registry. Each deck's index.ts registers itself on import. */
const DECKS = new Map<string, DeckModule>();

export function registerDeck(deck: DeckModule): DeckModule {
  DECKS.set(deck.id, deck);
  return deck;
}

export function getDeck(id: string): DeckModule | undefined {
  return DECKS.get(id);
}

export function listDecks(): DeckModule[] {
  return [...DECKS.values()];
}
