import { useHashRoute, navigate } from "./router";
import { Landing } from "./Landing";
import { DeckHome } from "./DeckHome";
import { CardBrowser } from "./CardBrowser";
import { Reading } from "./Reading";

/**
 * App shell + hash router.
 *   #/                       landing: intro + deck selection (bundled or paste-your-own)
 *   #/deck/:id               deck "about" page (theme, suits, ranks, transversal)
 *   #/deck/:id/browse        filterable card browser
 *   #/deck/:id/read          reading composer (question + spread + deal)
 *   #/deck/:id/r/:token      a dealt reading (compact token in the # fragment; shareable, private)
 */
export function App() {
  const route = useHashRoute();

  let content: React.ReactNode;
  let m: RegExpMatchArray | null;
  if ((m = route.match(/^\/deck\/([^/]+)\/browse\/?$/))) content = <CardBrowser deckId={m[1]} />;
  else if ((m = route.match(/^\/deck\/([^/]+)\/read\/?$/))) content = <Reading deckId={m[1]} />;
  else if ((m = route.match(/^\/deck\/([^/]+)\/r\/(.+)$/))) content = <Reading deckId={m[1]} token={m[2]} />;
  else if ((m = route.match(/^\/deck\/([^/]+)\/?$/))) content = <DeckHome deckId={m[1]} />;
  else content = <Landing />;

  const onHome = route === "/" || route === "";

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b14", color: "#e9dcc0" }}>
      {!onHome && (
        <header style={{ padding: "12px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => navigate("/")} style={{ all: "unset", cursor: "pointer", font: "600 15px/1 ui-serif, Georgia, serif", letterSpacing: "0.02em" }}>
            Generative Arcana
          </button>
        </header>
      )}
      <main>{content}</main>
    </div>
  );
}
