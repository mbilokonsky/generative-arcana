import { useEffect, type CSSProperties } from "react";
import { useHashRoute, navigate } from "./router";
import { Landing } from "./Landing";
import { DeckHome } from "./DeckHome";
import { CardBrowser } from "./CardBrowser";
import { Reading } from "./Reading";

/**
 * App shell + hash router. Stepping into a deck sets `data-theme="<deckId>"` on <html>, which
 * re-resolves every Vitrine token to that deck's "world" (see styles/tokens.css). The landing uses
 * the neutral core theme. The sticky header carries the brand (home) and, inside a deck, the tab bar.
 *
 *   #/                       landing: intro + deck selection (bundled or paste-your-own)
 *   #/deck/:id               deck "about" — the four-axis explorer
 *   #/deck/:id/browse        filterable card browser
 *   #/deck/:id/read          reading composer (question + spread + deal)
 *   #/deck/:id/r/:token      a dealt reading (compact token in the # fragment; shareable)
 */
type Tab = "about" | "browse" | "read";

export function App() {
  const route = useHashRoute();

  let content: React.ReactNode;
  let m: RegExpMatchArray | null;
  let deckId: string | null = null;
  let tab: Tab | null = null;
  if ((m = route.match(/^\/deck\/([^/]+)\/browse\/?$/))) { deckId = m[1]; tab = "browse"; content = <CardBrowser deckId={deckId} />; }
  else if ((m = route.match(/^\/deck\/([^/]+)\/read\/?$/))) { deckId = m[1]; tab = "read"; content = <Reading deckId={deckId} />; }
  else if ((m = route.match(/^\/deck\/([^/]+)\/r\/(.+)$/))) { deckId = m[1]; tab = "read"; content = <Reading deckId={deckId} token={m[2]} />; }
  else if ((m = route.match(/^\/deck\/([^/]+)\/?$/))) { deckId = m[1]; tab = "about"; content = <DeckHome deckId={deckId} />; }
  else content = <Landing />;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", deckId ?? "core");
  }, [deckId]);

  const tabs: { key: Tab; label: string; path: string }[] = deckId ? [
    { key: "about", label: "About", path: `/deck/${deckId}` },
    { key: "browse", label: "Browse cards", path: `/deck/${deckId}/browse` },
    { key: "read", label: "Reading", path: `/deck/${deckId}/read` },
  ] : [];

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={header}>
        <button onClick={() => navigate("/")} style={brand} aria-label="Generative Arcana — home">
          <BrandMark />
          <span style={{ font: "400 19px/1 var(--font-display)", letterSpacing: "0.01em" }}>Generative Arcana</span>
        </button>
        {tabs.length > 0 && (
          <nav aria-label="Deck sections" style={{ display: "flex", gap: 4 }}>
            {tabs.map((t) => {
              const on = t.key === tab;
              return (
                <button key={t.key} onClick={() => navigate(t.path)} aria-current={on ? "page" : undefined} style={tabPill(on)}>
                  {t.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>
      <main>{content}</main>
    </div>
  );
}

function BrandMark() {
  return (
    <span aria-hidden style={{ display: "inline-flex", color: "var(--accent)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3.2" fill="currentColor" /></svg>
    </span>
  );
}

const header: CSSProperties = {
  position: "sticky", top: 0, zIndex: 50,
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
  padding: "10px clamp(16px, 4vw, 28px)",
  borderBottom: "1px solid var(--line)",
  background: "color-mix(in srgb, var(--paper) 82%, transparent)",
  backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
  flexWrap: "wrap",
};
const brand: CSSProperties = { all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9, color: "var(--ink)" };
function tabPill(on: boolean): CSSProperties {
  return {
    all: "unset", cursor: "pointer", padding: "7px 13px", borderRadius: 999,
    font: "600 13px/1 var(--font-body)",
    color: on ? "var(--accent)" : "var(--ink-2)",
    background: on ? "var(--accent-wash)" : "transparent",
  };
}
