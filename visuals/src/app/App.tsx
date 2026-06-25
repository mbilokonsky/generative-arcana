import { useHashRoute, navigate } from "./router";
import { DeckList } from "./DeckList";
import { DeckView } from "./DeckView";

/**
 * App shell + router.
 * Routes:
 *   #/                  -> deck list
 *   #/deck/:id          -> one deck's browser
 *   #/deck/:id/r/:token -> a reading (added in the reading-system pass)
 */
export function App() {
  const route = useHashRoute();
  const deckMatch = route.match(/^\/deck\/([^/]+)/);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b14", color: "#e9dcc0" }}>
      <header
        style={{
          display: "flex", alignItems: "baseline", gap: 14, padding: "18px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            all: "unset", cursor: "pointer",
            font: "600 20px/1 ui-serif, Georgia, serif", letterSpacing: "0.02em",
          }}
        >
          Arcana
        </button>
        <span style={{ opacity: 0.5, font: "400 13px/1 ui-sans-serif, system-ui" }}>
          a deck browser &amp; reading composer
        </span>
      </header>

      <main>{deckMatch ? <DeckView deckId={deckMatch[1]} /> : <DeckList />}</main>
    </div>
  );
}
