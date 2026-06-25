/**
 * <DeckGrid> — a responsive grid of cards. Renders every card it's given: illustrated cards animate
 * on hover (live), un-illustrated cards show a static placeholder face. Filtering is the caller's job.
 */
import { useState } from "react";
import { CardFrame } from "./CardFrame";
import { getCardSketch } from "../runtime/defineCard";
import type { CardData } from "../runtime/types";
import type { DeckDataFile } from "@/decks/types";

export interface DeckGridProps {
  cards: CardData[];
  /** deck data so each card's modal can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  minColPx?: number;
  onSignal?: (slug: string, name: string, detail?: unknown) => void;
}

export function DeckGrid({ cards, deck, minColPx = 200, onSignal }: DeckGridProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColPx}px, 1fr))`,
        gap: 18,
      }}
    >
      {cards.map((card) => {
        const sketch = getCardSketch(card.slug);
        const live = activeSlug === card.slug;
        return (
          <div
            key={card.slug}
            onMouseEnter={() => setActiveSlug(card.slug)}
            onMouseLeave={() => setActiveSlug((s) => (s === card.slug ? null : s))}
            onFocus={() => setActiveSlug(card.slug)}
            tabIndex={0}
            style={{ outline: "none", transition: "transform 160ms ease", transform: live && sketch ? "translateY(-3px)" : "none" }}
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
