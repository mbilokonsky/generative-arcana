import { navigate } from "./router";

type Tab = "about" | "browse" | "read";

/** Shared deck header: deck name, an "all decks" link, and the About / Browse / Reading tabs. */
export function DeckTabs({ deckId, deckName, active }: { deckId: string; deckName: string; active: Tab }) {
  const tabs: { key: Tab; label: string; path: string }[] = [
    { key: "about", label: "About", path: `/deck/${deckId}` },
    { key: "browse", label: "Browse cards", path: `/deck/${deckId}/browse` },
    { key: "read", label: "Reading", path: `/deck/${deckId}/read` },
  ];
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 28px 0" }}>
      <button onClick={() => navigate("/")} style={backLink}>← all decks</button>
      <div style={{ font: "600 22px/1.1 ui-serif, Georgia, serif", margin: "8px 0 10px" }}>{deckName}</div>
      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => navigate(t.path)}
              style={{
                all: "unset", cursor: "pointer", padding: "8px 14px", borderRadius: "8px 8px 0 0",
                font: "500 14px/1 ui-sans-serif, system-ui",
                color: on ? "#0b0b14" : "#c7c2b2",
                background: on ? "#e9dcc0" : "transparent",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const backLink: React.CSSProperties = { all: "unset", cursor: "pointer", color: "#9aa0b0", font: "400 13px/1 ui-sans-serif, system-ui" };
