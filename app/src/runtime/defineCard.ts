/** Authoring helper + the per-deck slug→sketch registry the deck browser resolves cards through.
 *
 * Sketches are namespaced BY DECK: many decks share slugs ("major-0", …), so a flat slug registry
 * would let one deck's art bleed into another. Card modules still call `registerCard({...})` with no
 * deck id (they can't know it at import time); their registrations land in a PENDING bucket, and the
 * deck's index.ts calls `claimSketchesFor(deckId)` right after importing its `./cards` barrel to move
 * that batch under its own namespace. A deck with no card pack simply never claims anything. */
import type { CardSketch } from "./types";

/** Identity helper that pins the type so card modules get full inference. */
export function defineCard(sketch: CardSketch): CardSketch {
  return sketch;
}

/** Registrations awaiting a claim (filled as a deck's card modules import). */
const PENDING = new Map<string, CardSketch>();
/** deckId → (slug → sketch). */
const PACKS = new Map<string, Map<string, CardSketch>>();

export function registerCard(sketch: CardSketch): CardSketch {
  PENDING.set(sketch.slug, sketch);
  return sketch;
}

/** Move everything registered since the last claim under `deckId`. Call in the deck's index.ts. */
export function claimSketchesFor(deckId: string): void {
  if (!PENDING.size) return;
  const pack = PACKS.get(deckId) ?? new Map<string, CardSketch>();
  for (const [slug, sketch] of PENDING) pack.set(slug, sketch);
  PACKS.set(deckId, pack);
  PENDING.clear();
}

export function getCardSketch(deckId: string, slug: string): CardSketch | undefined {
  return PACKS.get(deckId)?.get(slug);
}

export function hasCardSketch(deckId: string, slug: string): boolean {
  return PACKS.get(deckId)?.has(slug) ?? false;
}

export function registeredSlugsFor(deckId: string): string[] {
  return [...(PACKS.get(deckId)?.keys() ?? [])];
}
