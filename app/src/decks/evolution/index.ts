/**
 * Evolution and Consciousness Tarot — registered for the app.
 *
 * Built on Leslie Dewart's account of speech bootstrapping consciousness. Four axes:
 *   suits       — Names / Claims / Tells / Avowals, a dialectic of Force (Signify↔Assert) × Object (World↔Self)
 *   transversal — "The Involution" (7 phases: In-formation → Signification → Assertion → Thematization
 *                 → Thesis-making → Self-presence → Sedimentation, a true cycle)
 *   majors      — the developmental arc built on the primes (caused-by / reducible-to = prime / composite)
 *   ranks       — 14 (10 numbered questions + the Novice/Wielder/Keeper/Sovereign court)
 *
 * 78/78 cards; the "Lumen" generative skin (./cards) gives every card luminous-abstract art
 * derived from its suit · rank · station · number coordinates ("form emerging as light").
 */
import deckJson from "@decks/evolution/deck.json";
import { registerDeck } from "../registry";
import type { DeckDataFile, DeckModule } from "../types";
import type { CardData } from "@/runtime/types";
import "./cards"; // side effect: registers the "Lumen" luminous-abstract visual skin under "evolution"

const data = deckJson as unknown as DeckDataFile;

export const evolutionDeck: DeckModule = registerDeck({
  id: "evolution",
  name: data.name,
  tagline: "How speech bootstraps consciousness — Dewart's involution as a deck.",
  data,
  cards: Object.values(data.cards) as CardData[],
});
