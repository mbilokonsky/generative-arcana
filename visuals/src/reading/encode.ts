import type { Spread } from "@/decks/spreads";
import type { DealtCard, ReadingToken } from "./types";

function b64urlEncode(str: string): string {
  const bin = unescape(encodeURIComponent(str)); // UTF-8 -> binary string
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4;
  if (pad) t += "=".repeat(4 - pad);
  return decodeURIComponent(escape(atob(t)));
}

export function encodeReading(
  deckId: string,
  spread: string | Spread,
  question: string,
  cards: DealtCard[],
): string {
  const token: ReadingToken = {
    v: 1,
    d: deckId,
    s: spread,
    q: question,
    c: cards.map((c) => [c.index, c.reversed ? 1 : 0]),
  };
  return b64urlEncode(JSON.stringify(token));
}

export function decodeReading(encoded: string): ReadingToken | null {
  try {
    const o = JSON.parse(b64urlDecode(encoded));
    if (o && o.v === 1 && typeof o.d === "string" && Array.isArray(o.c)) return o as ReadingToken;
  } catch {
    /* malformed token */
  }
  return null;
}

export function tokenToDealt(token: ReadingToken): DealtCard[] {
  return token.c.map(([index, rev]) => ({ index, reversed: rev === 1 }));
}
