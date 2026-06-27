/**
 * Final Fantasy Tarot — registered for the app.
 *
 * Built with the generative-arcana skill around the recurring FF mythos. Four axes:
 *   suits     — Chocobo / Moogle / Cactuar / Tonberry, a dialectic of Boon↔Bane × Place↔Journey
 *   transversal — "The Elemental Wheel" (8 magicks: Fire/Thunder/Earth/Holy/Ice/Water/Wind/Dark)
 *   majors    — the FF monomyth cast through the prime/composite number axis
 *   ranks     — 14 (10 numbered questions + the Page/Knight/Sage/Monarch court)
 *
 * Foundation stage: data axes only. Cards (22 majors, then 56 minors) and a visual skin land next.
 */
import deckJson from "@decks/finalfantasy/deck.json";
import { registerDeck } from "../registry";
import type { DeckDataFile, DeckModule } from "../types";
import type { CardData } from "@/runtime/types";

const data = deckJson as unknown as DeckDataFile;

export const finalFantasyDeck: DeckModule = registerDeck({
  id: "finalfantasy",
  name: data.name,
  tagline: "Crystals, creatures, and the cycle of light — the recurring myth as a deck.",
  data,
  cards: Object.values(data.cards) as CardData[],
});
