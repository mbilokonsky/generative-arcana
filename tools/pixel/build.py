"""
Render the Ulysses Vico pixel pack into the app.

  python tools/pixel/build.py            # render all CARDS -> app/src/decks/ulysses/pixel/<slug>.png
  python tools/pixel/build.py --montage  # also write a contact sheet for reviewing the whole set

Run from the repo root. Output filenames are the card slugs (major-0.png, towers-3.png, …) so the
app's image-pack glob pairs them to cards with no zero-pad gymnastics.
"""
import os
import sys
from ulysses_cards import CARDS, W, H
from pixelkit import Canvas

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "src", "decks", "ulysses", "pixel")
SCALE = 5


def build():
    os.makedirs(OUT, exist_ok=True)
    for slug, fn in CARDS.items():
        fn().save(os.path.join(OUT, f"{slug}.png"), scale=SCALE)
    print(f"rendered {len(CARDS)} cards -> {os.path.relpath(OUT)}")


def montage(cols=7):
    """Contact sheet of every rendered card at logical size, for one-glance review."""
    slugs = list(CARDS)
    rows = (len(slugs) + cols - 1) // cols
    pad = 4
    sheet = Canvas((W + pad) * cols + pad, (H + pad) * rows + pad, bg=(20, 20, 24))
    for i, slug in enumerate(slugs):
        cx = pad + (i % cols) * (W + pad)
        cy = pad + (i // cols) * (H + pad)
        card = CARDS[slug]()
        for y in range(H):
            for x in range(W):
                sheet.set(cx + x, cy + y, card.px[y][x])
    path = os.path.join(os.path.dirname(__file__), "montage.png")
    sheet.save(path, scale=2)
    print(f"montage ({len(slugs)} cards) -> {os.path.relpath(path)}")


if __name__ == "__main__":
    build()
    if "--montage" in sys.argv:
        montage()
