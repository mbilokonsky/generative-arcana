/** Load a deck from pasted JSON (a generative-arcana deck file). Cards render as placeholders
 *  (no p5 sketches), but full data, browsing, and readings work. */
import { registerDeck } from "./registry";
import type { DeckDataFile, DeckModule } from "./types";
import type { CardData } from "@/runtime/types";

type Result = { ok: true; deck: DeckModule } | { ok: false; error: string };

export function loadCustomDeck(jsonText: string): Result {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(jsonText);
  } catch {
    return { ok: false, error: "That isn't valid JSON." };
  }

  const required = ["name", "theme", "suits", "ranks", "transversal", "cards"];
  const missing = required.filter((k) => data[k] == null);
  if (missing.length) return { ok: false, error: `Missing required field(s): ${missing.join(", ")}.` };
  if (typeof data.cards !== "object") return { ok: false, error: "`cards` must be an object keyed by slug." };

  const cards = Object.values(data.cards as Record<string, CardData>);
  if (!cards.length) return { ok: false, error: "The deck has no cards." };
  if (!cards[0]?.meaning || !cards[0]?.station_slug) return { ok: false, error: "Cards don't match the expected schema (need meaning, station_slug, …)." };

  const slug = (data.slug as string) || (data.name as string) || "custom";
  const id = slug.toString().replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "custom";
  const theme = data.theme as { description?: string; creator?: string };

  const deck = registerDeck({
    id,
    name: data.name as string,
    tagline: theme?.description ? firstSentence(theme.description) : "A custom deck.",
    data: data as unknown as DeckDataFile,
    cards,
    custom: true,
  });
  return { ok: true, deck };
}

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}
