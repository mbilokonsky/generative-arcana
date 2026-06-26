/**
 * <AxisExplorer> — the viewer's peek behind the curtain. Every card sits at the intersection of four
 * axes; this tabbed component lets the reader bounce between them and see, from the deck's own
 * metadata, what each axis contributes and what each point on it means.
 *
 *   Axis 1 · Suits             — the grid axis, declared in line & color (a 2×2 if it's dialectical)
 *   Axis 2 · Ranks             — the other grid axis, a linear progression (A = 1 …)
 *   Axis 3 · <transversal>     — the substrate axis: a named cycle laid across the grid
 *   Axis 4 · Prime Factorization — invariant: the character latent in every card's number
 */
import { useState, Fragment } from "react";
import { Svg } from "@/components/cardMeta";
import type { DeckDataFile } from "@/decks/types";

type Meaning = { upright?: string[]; inverted?: string[] };
type Suit = { index: number; name: string; slug: string; description: string; symbol?: { svg?: string }; meaning?: Meaning; visual_style?: string };
type Rank = { index: number; numeric_value: number; name: string; symbol?: string; description?: string; question?: string; meaning?: Meaning };
type Station = { index: number; slug: string; name: string; description?: string; symbol?: { svg?: string }; meaning?: Meaning; visual_motif?: string };
type Transversal = { name: string; description: string; ordering_rationale?: string; suit_stride?: number; stations: Record<string, Station> };
type Major = { story?: string; visual_style?: string };

const GOLD = "#c9a44a";
const TEXT = "#c7c2b2";
const MUTE = "#9aa0b0";
const PANEL = "#13131f";
const LINE = "rgba(255,255,255,0.08)";

export function AxisExplorer({ deck }: { deck: DeckDataFile }) {
  const tx = deck.transversal as Transversal;
  const tabs = ["Suits", "Ranks", tx?.name ?? "Transversal", "Prime Factorization"];
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* tab bar */}
      <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {tabs.map((label, i) => {
          const on = i === active;
          return (
            <button key={i} role="tab" aria-selected={on} onClick={() => setActive(i)}
              style={{
                all: "unset", cursor: "pointer", padding: "9px 13px", borderRadius: 9,
                font: "600 13px/1.1 ui-sans-serif, system-ui",
                background: on ? "#e9dcc0" : "rgba(255,255,255,0.04)",
                color: on ? "#0b0b14" : TEXT, border: `1px solid ${on ? "transparent" : LINE}`,
              }}>
              <span style={{ opacity: on ? 0.55 : 0.5, fontWeight: 700 }}>Axis {i + 1}</span>
              <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>{label}
            </button>
          );
        })}
      </div>

      {active === 0 && <SuitsPanel deck={deck} />}
      {active === 1 && <RanksPanel deck={deck} />}
      {active === 2 && <TransversalPanel tx={tx} suitCount={Object.keys(deck.suits).length} />}
      {active === 3 && <PrimePanel deck={deck} />}
    </div>
  );
}

// ── shared bits ───────────────────────────────────────────────────────────────
function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ ...body, color: MUTE, margin: "0 0 16px", maxWidth: 760 }}>{children}</p>;
}
function Chips({ items, tone }: { items?: string[]; tone: "up" | "down" }) {
  if (!items?.length) return null;
  const c = tone === "up" ? GOLD : "#7c8295";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
      {items.map((t, i) => (
        <span key={i} style={{ font: "400 11px/1.3 ui-sans-serif, system-ui", color: c, background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}`, borderRadius: 6, padding: "2px 7px" }}>{t}</span>
      ))}
    </div>
  );
}

// ── Axis 1: Suits ─────────────────────────────────────────────────────────────
/** Detect a leading "A x B." dialectic in every suit description; if all four resolve to a clean
 *  2×2 (two distinct A's × two distinct B's), return the axis labels + cell map. */
function dialectic(suits: Suit[]) {
  const parsed = suits.map((s) => {
    const m = s.description.match(/^\s*([A-Za-z]+)\s*[x×]\s*([A-Za-z]+)\b/);
    return m ? { s, a: m[1], b: m[2] } : null;
  });
  if (parsed.some((p) => !p)) return null;
  const as = [...new Set(parsed.map((p) => p!.a))];
  const bs = [...new Set(parsed.map((p) => p!.b))];
  if (as.length !== 2 || bs.length !== 2 || suits.length !== 4) return null;
  const at = (a: string, b: string) => parsed.find((p) => p!.a === a && p!.b === b)?.s;
  const cells = as.map((a) => bs.map((b) => at(a, b)));
  if (cells.flat().some((x) => !x)) return null;
  return { rows: as, cols: bs, cells: cells as Suit[][] };
}

function SuitCard({ s }: { s: Suit }) {
  return (
    <div style={panel}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ color: "#d8b24a" }}>{s.symbol?.svg ? <Svg svg={s.symbol.svg} size={24} /> : null}</span>
        <span style={{ font: "600 16px/1 ui-serif, Georgia, serif" }}>{s.name}</span>
      </div>
      <p style={{ ...body, margin: "9px 0 0" }}>{s.description}</p>
      <Chips items={s.meaning?.upright} tone="up" />
      <Chips items={s.meaning?.inverted} tone="down" />
      {s.visual_style && <p style={{ ...body, color: MUTE, fontStyle: "italic", margin: "9px 0 0", fontSize: 12.5 }}>{s.visual_style}</p>}
    </div>
  );
}

function SuitsPanel({ deck }: { deck: DeckDataFile }) {
  const suits = (Object.values(deck.suits) as Suit[]).sort((a, b) => a.index - b.index);
  const di = dialectic(suits);
  return (
    <div>
      <Lead>
        The first grid axis. Each suit is one quadrant of the deck's space, <strong>declared</strong> openly
        in line and color — it stamps its glyph on every minor card and lends its palette of meanings.
        {di && <> Here the four are a true cross-product: <strong>{di.rows.join(" / ")}</strong> against <strong>{di.cols.join(" / ")}</strong>.</>}
      </Lead>
      {di ? (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 10, alignItems: "stretch" }}>
          <div />
          {di.cols.map((b) => <AxisLabel key={b} text={b} />)}
          {di.rows.map((a, ri) => (
            <Fragment key={a}>
              <AxisLabel text={a} vertical />
              {di.cells[ri].map((s) => <SuitCard key={s.slug} s={s} />)}
            </Fragment>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
          {suits.map((s) => <SuitCard key={s.slug} s={s} />)}
        </div>
      )}
    </div>
  );
}
function AxisLabel({ text, vertical }: { text: string; vertical?: boolean }) {
  return (
    <div style={{ display: "grid", placeItems: "center", color: GOLD, font: "700 11px/1 ui-sans-serif, system-ui", letterSpacing: "0.12em", textTransform: "uppercase", writingMode: vertical ? "vertical-rl" : undefined, transform: vertical ? "rotate(180deg)" : undefined, padding: vertical ? "0 2px" : "0 0 4px" }}>{text}</div>
  );
}

// ── Axis 2: Ranks ─────────────────────────────────────────────────────────────
function RanksPanel({ deck }: { deck: DeckDataFile }) {
  const ranks = (Object.values(deck.ranks) as Rank[]).sort((a, b) => a.index - b.index);
  return (
    <div>
      <Lead>
        The second grid axis — {ranks.length} frameworks, each an abstract question or stage that every
        suit answers in its own way. Also <strong>declared</strong>: a rank stamps its number (A = 1) and
        lends its sense. They run as a progression from seed to fullness, then through the face ranks.
      </Lead>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ranks.map((r) => (
          <div key={r.index} style={{ display: "flex", gap: 14, padding: "12px 0", borderTop: `1px solid ${LINE}` }}>
            <div style={{ flex: "0 0 44px", textAlign: "center" }}>
              <div style={{ font: "700 20px/1 ui-serif, Georgia, serif", color: GOLD }}>{r.symbol || r.numeric_value}</div>
              <div style={{ font: "400 10px/1.4 ui-sans-serif, system-ui", color: MUTE }}>{r.numeric_value}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 15px/1.2 ui-serif, Georgia, serif", color: "#e9dcc0" }}>{r.name}</div>
              {r.question && <div style={{ ...body, color: GOLD, fontStyle: "italic", margin: "3px 0 0" }}>{r.question.replace(/\{suit\}/g, "the suit")}</div>}
              {r.description && <p style={{ ...body, margin: "4px 0 0" }}>{r.description}</p>}
              <Chips items={r.meaning?.upright} tone="up" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Axis 3: Transversal ───────────────────────────────────────────────────────
function TransversalPanel({ tx, suitCount }: { tx: Transversal; suitCount: number }) {
  const stations = (Object.values(tx.stations) as Station[]).sort((a, b) => a.index - b.index);
  const k = tx.suit_stride ?? 1;
  return (
    <div>
      <Lead>
        The third axis is a <strong>substrate</strong>, not a grid line: a single named cycle —{" "}
        <strong>{tx.name}</strong> — laid <em>across</em> the suit×rank grid so it refuses to align with it.
        Unlike suits and ranks it is never declared; it is <strong>sublimated</strong> into each card's
        palette, light and mood. {tx.description}
      </Lead>
      {tx.ordering_rationale && <p style={{ ...body, color: MUTE, fontStyle: "italic", maxWidth: 760, margin: "0 0 14px" }}>{tx.ordering_rationale}</p>}
      <p style={{ ...body, color: MUTE, margin: "0 0 16px" }}>
        The cycle has <strong>{stations.length}</strong> stations; each card lands on one by a fixed walk
        (suit stride {k}{k === 1 ? ", the cleanest diagonal" : ""}), so the same station recurs across
        suits and ranks, binding cross-cutting families of cards.
      </p>
      {/* the cycle, mapped out */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 18 }}>
        {stations.map((st, i) => (
          <Fragment key={st.slug}>
            <span style={{ font: "600 12px/1 ui-sans-serif, system-ui", color: GOLD, background: "rgba(201,164,74,0.12)", border: `1px solid rgba(201,164,74,0.3)`, borderRadius: 20, padding: "5px 10px" }}>
              {st.index}. {st.name}
            </span>
            <span style={{ color: MUTE }}>{i < stations.length - 1 ? "→" : "↺"}</span>
          </Fragment>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {stations.map((st) => (
          <div key={st.slug} style={panel}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ font: "700 13px/1 ui-sans-serif, system-ui", color: MUTE }}>{st.index}</span>
              <span style={{ font: "600 15px/1 ui-serif, Georgia, serif" }}>{st.name}</span>
            </div>
            {st.description && <p style={{ ...body, margin: "7px 0 0" }}>{st.description}</p>}
            {st.visual_motif && <p style={{ ...body, color: MUTE, fontStyle: "italic", margin: "7px 0 0", fontSize: 12.5 }}>{st.visual_motif}</p>}
            <Chips items={st.meaning?.upright} tone="up" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Axis 4: Prime Factorization ───────────────────────────────────────────────
function factorize(n: number): { character: "identity" | "prime" | "composite"; factors: number[] } {
  if (n <= 1) return { character: "identity", factors: [] };
  let m = n; const f: number[] = [];
  for (let d = 2; d * d <= m; d++) while (m % d === 0) { f.push(d); m /= d; }
  if (m > 1) f.push(m);
  return { character: f.length === 1 ? "prime" : "composite", factors: f };
}
const CHAR_COLOR = { identity: "#7c8295", prime: GOLD, composite: "#6f8fbf" } as const;

function NumCell({ n }: { n: number }) {
  const { character, factors } = factorize(n);
  return (
    <div title={`${n} — ${character}${factors.length > 1 ? ` (${factors.join("×")})` : ""}`}
      style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 7, background: "rgba(255,255,255,0.03)", border: `1px solid ${CHAR_COLOR[character]}55` }}>
      <span style={{ font: "700 14px/1 ui-serif, Georgia, serif", color: CHAR_COLOR[character] }}>{n}</span>
      {factors.length > 1 && <span style={{ font: "400 8px/1 ui-sans-serif, system-ui", color: MUTE }}>{factors.join("·")}</span>}
    </div>
  );
}

function PrimePanel({ deck }: { deck: DeckDataFile }) {
  const cards = Object.values(deck.cards) as { arcana: string; number: string }[];
  const majors = [...new Set(cards.filter((c) => c.arcana === "major").map((c) => parseInt(c.number, 10)))].sort((a, b) => a - b);
  const minors = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <div>
      <Lead>
        The fourth axis isn't woven into the deck's space — it's <strong>intrinsic</strong> to each card's
        number, and it's the same in every deck. Every number has a factorization, and that gives the card
        a character: an <strong style={{ color: CHAR_COLOR.identity }}>identity</strong> (0 the void, 1 the
        unit of agency), a <strong style={{ color: CHAR_COLOR.prime }}>prime</strong> (irreducible — it
        simply <em>is</em>), or a <strong style={{ color: CHAR_COLOR.composite }}>composite</strong> (derived
        from its factors). Powers intensify (x² stabilizes, x³ masters or overreaches); products combine two
        energies. It rides under every card as a quiet undertone — the fourth quantum number.
      </Lead>
      <Legend />
      <Group title="Major Arcana" subtitle="numbered by position, 0 upward">
        {majors.map((n) => <NumCell key={n} n={n} />)}
      </Group>
      <Group title="Minor Arcana" subtitle="each suit's ranks, 1–14">
        {minors.map((n) => <NumCell key={n} n={n} />)}
      </Group>
    </div>
  );
}
function Legend() {
  const items: [string, string][] = [["identity", "0, 1 — the void & the unit"], ["prime", "irreducible"], ["composite", "a product of primes"]];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "0 0 18px" }}>
      {items.map(([k, label]) => (
        <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, font: "400 12px/1 ui-sans-serif, system-ui", color: TEXT }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: CHAR_COLOR[k as keyof typeof CHAR_COLOR] }} />
          <strong style={{ color: CHAR_COLOR[k as keyof typeof CHAR_COLOR], textTransform: "capitalize" }}>{k}</strong>
          <span style={{ color: MUTE }}>· {label}</span>
        </span>
      ))}
    </div>
  );
}
function Group({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ font: "600 12px/1 ui-sans-serif, system-ui", color: MUTE, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title} <span style={{ opacity: 0.6, textTransform: "none", letterSpacing: 0 }}>— {subtitle}</span></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{children}</div>
    </div>
  );
}

const body: React.CSSProperties = { font: "400 14px/1.6 ui-sans-serif, system-ui", color: TEXT };
const panel: React.CSSProperties = { padding: 14, borderRadius: 12, background: PANEL, border: `1px solid ${LINE}` };
