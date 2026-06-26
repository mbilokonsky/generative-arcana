/** Shared card-metadata helpers: suit/major glyphs and rank labels, used by the badge and the modal.
 *
 * Everything here resolves from the DECK DATA first (so any migrated/custom deck shows its own rank
 * names, suit names, and glyphs), falling back to the bundled Ultima maps only when a deck supplies
 * none. That fallback is what keeps a sparse pasted deck legible. */
import { useId } from "react";
import type { DeckDataFile } from "@/decks/types";
import type { CardData } from "@/runtime/types";

/** The Ultima glyphs, inlined and currentColor-recolorable (fallback when a deck supplies no SVG). */
export const GLYPHS: Record<string, string> = {
  crowns: `<path d="M15 70 L15 35 L35 55 L50 25 L65 55 L85 35 L85 70 Z" fill="currentColor"/><rect x="12" y="74" width="76" height="12" fill="currentColor"/><circle cx="50" cy="20" r="6" fill="currentColor"/><circle cx="15" cy="32" r="5" fill="currentColor"/><circle cx="85" cy="32" r="5" fill="currentColor"/>`,
  blades: `<polygon points="50,8 57,30 57,62 43,62 43,30" fill="currentColor"/><rect x="30" y="62" width="40" height="9" fill="currentColor"/><rect x="45" y="71" width="10" height="18" fill="currentColor"/><rect x="40" y="88" width="20" height="7" fill="currentColor"/>`,
  runes: `<line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="9"/><line x1="50" y1="30" x2="80" y2="12" stroke="currentColor" stroke-width="9"/><line x1="50" y1="50" x2="20" y2="32" stroke="currentColor" stroke-width="9"/><line x1="50" y1="70" x2="80" y2="52" stroke="currentColor" stroke-width="9"/>`,
  moongates: `<path d="M20 88 L20 50 A30 30 0 0 1 80 50 L80 88 L66 88 L66 50 A16 16 0 0 0 34 50 L34 88 Z" fill="currentColor"/><circle cx="50" cy="42" r="10" fill="currentColor"/>`,
  major: `<circle cx="50" cy="26" r="17" fill="none" stroke="currentColor" stroke-width="10"/><rect x="44" y="42" width="12" height="50" fill="currentColor"/><rect x="28" y="56" width="44" height="11" fill="currentColor"/>`,
};

/** Render a set of inline SVG inner-paths inside a 0 0 100 100 viewBox (Ultima glyph fallback). */
export function Glyph({ which, size = 16 }: { which: string; size?: number }) {
  const inner = GLYPHS[which] ?? GLYPHS.major;
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size, color: "currentColor", verticalAlign: "-0.15em" }}
      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">${inner}</svg>` }}
    />
  );
}

const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Per-instance-namespace any internal ids (mask/gradient/clip) so multiple copies of a deck SVG on
 *  one page don't collide on `url(#id)` (which otherwise resolves to a single, possibly-unmounted node). */
function namespaceIds(svg: string, uid: string): string {
  const ids = Array.from(svg.matchAll(/id="([^"]+)"/g), (m) => m[1]);
  let out = svg;
  for (const id of ids) {
    const u = `${id}-${uid}`;
    out = out
      .replace(new RegExp(`id="${reEsc(id)}"`, "g"), `id="${u}"`)
      .replace(new RegExp(`url\\(#${reEsc(id)}\\)`, "g"), `url(#${u})`)
      .replace(new RegExp(`(xlink:href|href)="#${reEsc(id)}"`, "g"), `$1="#${u}"`);
  }
  return out;
}

/** Render a deck-supplied FULL <svg> string, sized and recolored via currentColor (ids namespaced).
 *  Only the ROOT <svg> tag's width/height are normalized — stripping them globally would also delete
 *  every <rect width=… height=…>, which silently destroys rect-built glyphs (towers, key shafts). */
export function Svg({ svg, size = 16 }: { svg: string; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const sized = svg.replace(/<svg([^>]*)>/, (_m, attrs: string) =>
    `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, "")} width="${size}" height="${size}">`);
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size, color: "currentColor", verticalAlign: "-0.15em" }}
      dangerouslySetInnerHTML={{ __html: namespaceIds(sized, uid) }}
    />
  );
}

/**
 * The right glyph for a card: the deck's own suit/major SVG when present, else the Ultima fallback
 * (suit-keyed for known suits, the ankh for anything else / majors without a symbol).
 */
export function AxisGlyph({ deck, card, size = 16 }: { deck?: DeckDataFile; card: CardData; size?: number }) {
  const isMajor = card.arcana === "major";
  const raw = isMajor ? majorGlyphSvg(deck) : suitGlyphSvg(deck, card.suit_slug);
  if (raw) return <Svg svg={raw} size={size} />;
  return <Glyph which={isMajor ? "major" : card.suit_slug ?? "major"} size={size} />;
}

// ── deck-data resolvers ──────────────────────────────────────────────────────

type SuitInfo = { name?: string; symbol?: { svg?: string } };
type RankInfo = { name?: string; symbol?: string };

function suits(deck?: DeckDataFile) { return (deck?.suits ?? {}) as Record<string, SuitInfo>; }
function ranks(deck?: DeckDataFile) { return (deck?.ranks ?? {}) as Record<string, RankInfo>; }

function suitGlyphSvg(deck: DeckDataFile | undefined, slug?: string): string | undefined {
  return slug ? suits(deck)[slug]?.symbol?.svg : undefined;
}
function majorGlyphSvg(deck?: DeckDataFile): string | undefined {
  return (deck?.major_arcana as { symbol?: { svg?: string } } | undefined)?.symbol?.svg;
}

/** Full rank name for prose / detail table (e.g. "Two", "Homecoming"). */
export function rankLabel(deck: DeckDataFile | undefined, slug?: string): string {
  if (!slug) return "";
  return ranks(deck)[slug]?.name ?? RANK_NAME[slug] ?? slug;
}
/** Compact rank badge token (e.g. "II", "A"); falls back to the card's number. */
export function rankBadge(deck: DeckDataFile | undefined, slug?: string, fallback = ""): string {
  if (!slug) return fallback;
  return ranks(deck)[slug]?.symbol ?? RANK_ROMAN[slug] ?? fallback ?? slug;
}
/** Suit display name (e.g. "Crowns", "Structures"). */
export function suitLabel(deck: DeckDataFile | undefined, slug?: string): string {
  if (!slug) return "";
  return suits(deck)[slug]?.name ?? SUIT_LABEL[slug] ?? slug;
}

// ── Ultima fallback maps (used only when the deck supplies nothing) ───────────

/** Roman/initial form for the compact corner badge. */
export const RANK_ROMAN: Record<string, string> = {
  ace: "A", two: "II", three: "III", four: "IV", five: "V", six: "VI", seven: "VII",
  eight: "VIII", nine: "IX", ten: "X", seeker: "S", knight: "K", oracle: "O", paragon: "P",
};

/** Full word form for prose / the detail table. */
export const RANK_NAME: Record<string, string> = {
  ace: "Ace", two: "Two", three: "Three", four: "Four", five: "Five", six: "Six", seven: "Seven",
  eight: "Eight", nine: "Nine", ten: "Ten", seeker: "Seeker", knight: "Knight", oracle: "Oracle", paragon: "Paragon",
};

export const SUIT_LABEL: Record<string, string> = {
  crowns: "Crowns", blades: "Blades", runes: "Runes", moongates: "Moongates",
};
