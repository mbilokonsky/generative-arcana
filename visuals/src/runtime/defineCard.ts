/** Authoring helper + the slug→sketch registry the deck browser resolves cards through. */
import type { CardSketch } from "./types";

/** Identity helper that pins the type so card modules get full inference. */
export function defineCard(sketch: CardSketch): CardSketch {
  return sketch;
}

const REGISTRY = new Map<string, CardSketch>();

export function registerCard(sketch: CardSketch): CardSketch {
  REGISTRY.set(sketch.slug, sketch);
  return sketch;
}

export function getCardSketch(slug: string): CardSketch | undefined {
  return REGISTRY.get(slug);
}

export function hasCardSketch(slug: string): boolean {
  return REGISTRY.has(slug);
}

export function allRegisteredSlugs(): string[] {
  return [...REGISTRY.keys()];
}
