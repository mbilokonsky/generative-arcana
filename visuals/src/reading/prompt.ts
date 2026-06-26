/** Build a self-contained, LLM-ready interpretation prompt from a resolved reading. Grounded
 *  entirely in the deck's authored data — no backend, no tokens, works pasted into any model. */
import type { DeckModule } from "@/decks/types";
import type { Spread } from "@/decks/spreads";
import type { DealtCard } from "./types";
import { RANK_NAME, SUIT_LABEL } from "@/components/cardMeta";

type Named = { name: string; description?: string };
type Station = { name: string; description?: string };

export function buildPrompt(deck: DeckModule, spread: Spread, dealt: DealtCard[], question: string): string {
  const data = deck.data;
  const suits = data.suits as Record<string, Named>;
  const transversal = data.transversal as { name?: string; description?: string; stations?: Record<string, Station> };
  const stations = transversal.stations ?? {};

  const suitLines = Object.values(suits)
    .map((s) => `  - ${s.name}: ${firstSentence(s.description ?? "")}`)
    .join("\n");

  const lines: string[] = [];
  lines.push(`You are a tarot reader interpreting a spread from "${data.name}".`);
  lines.push("");
  lines.push("ABOUT THE DECK");
  lines.push(firstSentence(data.theme.description));
  lines.push("Suits:");
  lines.push(suitLines);
  if (transversal.name) {
    lines.push(`${transversal.name} (a transversal axis coloring every card): ${firstSentence(transversal.description ?? "")}`);
  }
  lines.push("A reversed card expresses the shadow, excess, or blockage of its meaning rather than a simple negation.");
  lines.push("");
  lines.push("THE READING");
  lines.push(`Question: "${question || "(no explicit question — an open reading)"}"`);
  lines.push(`Spread: ${spread.name} — ${spread.description}`);
  lines.push("");

  dealt.forEach((dc, i) => {
    const card = deck.cards[dc.index];
    const pos = spread.positions[i];
    if (!card || !pos) return;
    const orient = dc.reversed ? "Reversed" : "Upright";
    const meaning = dc.reversed ? card.meaning.inverted : card.meaning.upright;
    lines.push(`${i + 1}. ${pos.name} — ${pos.prompt}`);
    lines.push(`   ${card.name} (${orient}) · ${axisSummary(card, stations)}`);
    lines.push(`   ${meaning}`);
    if (card.factorization?.gloss) lines.push(`   Number — ${card.factorization.gloss}`);
    lines.push("");
  });

  lines.push("TASK");
  lines.push(
    "Weave these positions into a single cohesive interpretation that answers the question. " +
      "Read each card in its position, honor reversals as shadow/excess/blocked energy, and call out " +
      "any patterns across the spread (a repeated suit, a recurring virtue/axis, a cluster of Major Arcana, " +
      "many reversals). Close with a grounded, actionable synthesis.",
  );
  return lines.join("\n");
}

function axisSummary(card: DeckModule["cards"][number], stations: Record<string, Station>): string {
  const virtue = stations[card.station_slug]?.name ?? card.station_slug;
  if (card.arcana === "major") return `Major Arcana ${card.number} · ${virtue}`;
  const rank = RANK_NAME[card.rank_slug ?? ""] ?? "";
  const suit = SUIT_LABEL[card.suit_slug ?? ""] ?? card.suit_slug ?? "";
  return `${rank} of ${suit} · ${virtue}`;
}

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}
