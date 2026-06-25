/**
 * <DeckGrid> — a minimal reference deck browser. Demonstrates the performance pattern the
 * principles require: the grid renders every card as a static POSTER, and only the hovered/
 * focused card animates LIVE. Swap this for your real browser; it shows the intended contract.
 */
import { useState } from "react";
import { CardFrame } from "./CardFrame";
import { getCardSketch, hasCardSketch } from "../runtime/defineCard";
import type { CardData } from "../runtime/types";
import type { DeckDataFile } from "@/decks/types";

export interface DeckGridProps {
  cards: CardData[];
  /** deck data so each card's modal can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  minColPx?: number;
  onSignal?: (slug: string, name: string, detail?: unknown) => void;
}

export function DeckGrid({ cards, deck, minColPx = 220, onSignal }: DeckGridProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const playable = cards.filter((c) => hasCardSketch(c.slug));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColPx}px, 1fr))`,
        gap: 18,
        padding: 18,
      }}
    >
      {playable.map((card) => {
        const sketch = getCardSketch(card.slug)!;
        const live = activeSlug === card.slug;
        return (
          <div
            key={card.slug}
            onMouseEnter={() => setActiveSlug(card.slug)}
            onMouseLeave={() => setActiveSlug((s) => (s === card.slug ? null : s))}
            onFocus={() => setActiveSlug(card.slug)}
            tabIndex={0}
            style={{ outline: "none", cursor: "pointer", transition: "transform 160ms ease", transform: live ? "translateY(-3px)" : "none" }}
          >
            <CardFrame
              card={card}
              sketch={sketch}
              deck={deck}
              expandable
              mode={live ? "live" : "poster"}
              onSignal={(name, detail) => onSignal?.(card.slug, name, detail)}
            />
          </div>
        );
      })}
    </div>
  );
}
