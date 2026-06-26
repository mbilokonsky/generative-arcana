/**
 * <DeckGrid> — a responsive grid of cards. Renders every card it's given: illustrated cards animate
 * on hover (live), un-illustrated cards show a static placeholder face. Filtering is the caller's job.
 */
import { useState } from "react";
import { CardFrame } from "./CardFrame";
import { isIllustrated } from "../runtime/defineCard";
import type { CardData } from "../runtime/types";
import type { DeckDataFile } from "@/decks/types";
import type { PackKind } from "@/runtime/defineCard";

export interface DeckGridProps {
  cards: CardData[];
  /** deck data so each card's modal can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  /** registry id of the deck, used to resolve its (namespaced) card sketches. */
  deckId?: string;
  /** selected pack kind, preferred when resolving each card's visual. */
  prefer?: PackKind;
  minColPx?: number;
  onSignal?: (slug: string, name: string, detail?: unknown) => void;
}

export function DeckGrid({ cards, deck, deckId, prefer, minColPx = 200, onSignal }: DeckGridProps) {
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
        const live = activeSlug === card.slug;
        const lift = live && !!deckId && isIllustrated(deckId, card.slug);
        return (
          <div
            key={card.slug}
            onMouseEnter={() => setActiveSlug(card.slug)}
            onMouseLeave={() => setActiveSlug((s) => (s === card.slug ? null : s))}
            onFocus={() => setActiveSlug(card.slug)}
            tabIndex={0}
            style={{ outline: "none", transition: "transform 160ms ease", transform: lift ? "translateY(-3px)" : "none" }}
          >
            <CardFrame
              card={card}
              deckId={deckId}
              prefer={prefer}
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
