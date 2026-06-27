/**
 * Deck registry surface + the list of bundled decks.
 * Add a deck by dropping a folder under ./<id>/ and importing its index here.
 */
export * from "./registry";
export type { DeckModule, DeckDataFile } from "./types";

import "./ultima"; // registers the Ultima deck (+ its sketches)
import "./byrne"; // registers the Byrne Journey Tarot (placeholder visuals)
import "./ulysses"; // registers the Ulysses Tarot (placeholder visuals)
import "./finalfantasy"; // registers the Final Fantasy Tarot (Pixel chibi skin)
import "./evolution"; // registers the Evolution and Consciousness Tarot (data-complete; skin pending)
