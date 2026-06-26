/** Remembers which visual pack the viewer chose, per deck (localStorage; safe if unavailable). */
const KEY = (deckId: string) => `arcana:pack:${deckId}`;

export function getPackId(deckId: string, fallback: string): string {
  try {
    return localStorage.getItem(KEY(deckId)) || fallback;
  } catch {
    return fallback;
  }
}

export function setPackId(deckId: string, id: string): void {
  try {
    localStorage.setItem(KEY(deckId), id);
  } catch {
    /* ignore */
  }
}
