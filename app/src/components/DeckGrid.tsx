/**
 * <DeckGrid> — a responsive grid of cards. Renders every card it's given: illustrated cards animate
 * on hover (live), un-illustrated cards show a static placeholder face. Filtering is the caller's job.
 */
import { useState } from "react";
import { CardFrame } from "./CardFrame";
import { CardModal } from "./CardModal";
import { isIllustrated } from "../runtime/defineCard";
import type { CardData } from "../runtime/types";
import type { DeckDataFile } from "@/decks/types";

export interface DeckGridProps {
  cards: CardData[];
  /** deck data so each card's modal can resolve suit/rank/virtue meanings. */
  deck?: DeckDataFile;
  /** registry id of the deck, used to resolve its (namespaced) card sketches. */
  deckId?: string;
  /** selected pack id, preferred when resolving each card's visual. */
  prefer?: string;
  minColPx?: number;
  /** a short note shown in the modal's nav strip, e.g. "filtered" — so prev/next reads as scoped. */
  contextLabel?: string;
  onSignal?: (slug: string, name: string, detail?: unknown) => void;
}

export function DeckGrid({ cards, deck, deckId, prefer, minColPx = 200, contextLabel, onSignal }: DeckGridProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  // modal lives here (not in CardFrame) so prev/next can walk THIS list, in this order.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColPx}px, 1fr))`,
        gap: 16,
      }}
    >
      {cards.map((card, i) => {
        const live = activeSlug === card.slug;
        const lift = live && !!deckId && isIllustrated(deckId, card.slug);
        return (
          <div
            key={card.slug}
            onMouseEnter={() => setActiveSlug(card.slug)}
            onMouseLeave={() => setActiveSlug((s) => (s === card.slug ? null : s))}
            onFocus={() => setActiveSlug(card.slug)}
            tabIndex={0}
            style={{
              outline: "none",
              borderRadius: "var(--r-2)",
              transition: "transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease)",
              transform: lift ? "translateY(-5px)" : "none",
              boxShadow: lift ? "var(--e-2)" : "none",
            }}
          >
            <CardFrame
              card={card}
              deckId={deckId}
              prefer={prefer}
              deck={deck}
              onOpen={() => setOpenIndex(i)}
              mode={live ? "live" : "poster"}
              onSignal={(name, detail) => onSignal?.(card.slug, name, detail)}
            />
          </div>
        );
      })}

      {openIndex !== null && (
        <CardModal
          cards={cards}
          index={openIndex}
          onNavigate={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          contextLabel={contextLabel}
          deckId={deckId}
          prefer={prefer}
          deck={deck}
        />
      )}
    </div>
  );
}
