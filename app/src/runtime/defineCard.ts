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

// ── Raw-p5 packs ─────────────────────────────────────────────────────────────
// A second kind of visual pack: standalone p5 instance-mode sketch *source strings*
// (`function sketch(p) { p.setup=…; p.draw=… }`), as migrated from decks authored in the prior
// tool (e.g. Ulysses). They render via <RawP5Card>, which compiles and runs them. Kept separate
// from the typed CardSketch registry so a deck can ship either kind (or, later, both — selectable).

/** deckId → (slug → p5 source string). */
const RAW_PACKS = new Map<string, Map<string, string>>();

export function registerRawPack(deckId: string, codes: Record<string, string>): void {
  const pack = RAW_PACKS.get(deckId) ?? new Map<string, string>();
  for (const [slug, code] of Object.entries(codes)) pack.set(slug, code);
  RAW_PACKS.set(deckId, pack);
}

export function getRawSketch(deckId: string, slug: string): string | undefined {
  return RAW_PACKS.get(deckId)?.get(slug);
}

export function hasRawSketch(deckId: string, slug: string): boolean {
  return RAW_PACKS.get(deckId)?.has(slug) ?? false;
}

// ── Image packs ──────────────────────────────────────────────────────────────
// A third visual kind: pre-rendered static images (one URL per slug), as migrated from decks whose
// art shipped as raster files (e.g. Byrne's PNGs). Rendered by <CardArt> as a plain <img>.

/** deckId → (slug → image URL). */
const IMAGE_PACKS = new Map<string, Map<string, string>>();

export function registerImagePack(deckId: string, urls: Record<string, string>): void {
  const pack = IMAGE_PACKS.get(deckId) ?? new Map<string, string>();
  for (const [slug, url] of Object.entries(urls)) pack.set(slug, url);
  IMAGE_PACKS.set(deckId, pack);
}

export function getCardImage(deckId: string, slug: string): string | undefined {
  return IMAGE_PACKS.get(deckId)?.get(slug);
}

export function hasCardImage(deckId: string, slug: string): boolean {
  return IMAGE_PACKS.get(deckId)?.has(slug) ?? false;
}

/** True if a card has ANY visual (kit sketch, raw p5, or image) — for "illustrated" counts/affordances. */
export function isIllustrated(deckId: string, slug: string): boolean {
  return hasCardSketch(deckId, slug) || hasRawSketch(deckId, slug) || hasCardImage(deckId, slug);
}

// ── Selectable visual packs ──────────────────────────────────────────────────
// A deck can offer more than one art treatment (e.g. Ulysses: animated p5 + a pixel "Vico" set).
// A pack is just a label over one of the three content kinds above; the content lives in the
// per-kind registries (one pack per kind per deck, which is all any deck needs today). The first
// registered pack is the default. <CardArt> renders the selected pack, falling back per-card to any
// other pack that has the card — so a partial pack (e.g. pixel majors only) degrades gracefully.
export type PackKind = "kit" | "p5" | "image";
export interface VisualPack { id: string; label: string; kind: PackKind }

const PACK_LISTS = new Map<string, VisualPack[]>();

export function registerPack(deckId: string, pack: VisualPack): void {
  const list = PACK_LISTS.get(deckId) ?? [];
  if (!list.some((p) => p.id === pack.id)) list.push(pack);
  PACK_LISTS.set(deckId, list);
}

export function listPacks(deckId: string): VisualPack[] {
  return PACK_LISTS.get(deckId) ?? [];
}

/** Resolve which content kind to draw for a card: prefer `kind`, else fall back to whatever exists. */
export function resolveKind(deckId: string, slug: string, prefer?: PackKind): PackKind | null {
  const order: PackKind[] = [];
  const add = (k: PackKind) => { if (!order.includes(k)) order.push(k); };
  if (prefer) add(prefer);
  for (const p of listPacks(deckId)) add(p.kind);
  (["kit", "p5", "image"] as PackKind[]).forEach(add);
  for (const k of order) {
    if (k === "kit" && hasCardSketch(deckId, slug)) return "kit";
    if (k === "p5" && hasRawSketch(deckId, slug)) return "p5";
    if (k === "image" && hasCardImage(deckId, slug)) return "image";
  }
  return null;
}
