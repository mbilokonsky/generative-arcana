/** Shared card-metadata helpers: suit/major glyphs and rank labels, used by the badge and the modal. */

/** The deck's own glyphs, inlined and currentColor-recolorable. */
export const GLYPHS: Record<string, string> = {
  crowns: `<path d="M15 70 L15 35 L35 55 L50 25 L65 55 L85 35 L85 70 Z" fill="currentColor"/><rect x="12" y="74" width="76" height="12" fill="currentColor"/><circle cx="50" cy="20" r="6" fill="currentColor"/><circle cx="15" cy="32" r="5" fill="currentColor"/><circle cx="85" cy="32" r="5" fill="currentColor"/>`,
  blades: `<polygon points="50,8 57,30 57,62 43,62 43,30" fill="currentColor"/><rect x="30" y="62" width="40" height="9" fill="currentColor"/><rect x="45" y="71" width="10" height="18" fill="currentColor"/><rect x="40" y="88" width="20" height="7" fill="currentColor"/>`,
  runes: `<line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="9"/><line x1="50" y1="30" x2="80" y2="12" stroke="currentColor" stroke-width="9"/><line x1="50" y1="50" x2="20" y2="32" stroke="currentColor" stroke-width="9"/><line x1="50" y1="70" x2="80" y2="52" stroke="currentColor" stroke-width="9"/>`,
  moongates: `<path d="M20 88 L20 50 A30 30 0 0 1 80 50 L80 88 L66 88 L66 50 A16 16 0 0 0 34 50 L34 88 Z" fill="currentColor"/><circle cx="50" cy="42" r="10" fill="currentColor"/>`,
  major: `<circle cx="50" cy="26" r="17" fill="none" stroke="currentColor" stroke-width="10"/><rect x="44" y="42" width="12" height="50" fill="currentColor"/><rect x="28" y="56" width="44" height="11" fill="currentColor"/>`,
};

export function Glyph({ which, size = 16 }: { which: string; size?: number }) {
  const inner = GLYPHS[which] ?? GLYPHS.major;
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size, color: "currentColor", verticalAlign: "-0.15em" }}
      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">${inner}</svg>` }}
    />
  );
}

/** Roman/initial form for the compact corner badge. */
export const RANK_ROMAN: Record<string, string> = {
  ace: "A", two: "II", three: "III", four: "IV", five: "V", six: "VI", seven: "VII",
  eight: "VIII", nine: "IX", ten: "X", seeker: "S", knight: "K", oracle: "O", paragon: "P",
};

/** Full word form for prose / the detail table. */
export const RANK_NAME: Record<string, string> = {
  ace: "Ace", two: "Two", three: "Three", four: "Four", five: "Five", six: "Six", seven: "Seven",
  eight: "Eight", nine: "Nine", ten: "Ten", seeker: "Seeker", knight: "Knight", oracle: "Oracle", paragon: "Paragon",
};

export const SUIT_LABEL: Record<string, string> = {
  crowns: "Crowns", blades: "Blades", runes: "Runes", moongates: "Moongates",
};
