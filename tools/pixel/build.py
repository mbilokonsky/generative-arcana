"""
Render the Ulysses Vico pixel pack into the app.

  python tools/pixel/build.py            # render all CARDS -> app/src/decks/ulysses/pixel/<slug>.png
  python tools/pixel/build.py --montage  # also write a contact sheet for reviewing the whole set

Run from the repo root. Output filenames are the card slugs (major-0.png, towers-3.png, …) so the
app's image-pack glob pairs them to cards with no zero-pad gymnastics.
"""
import os
import sys
import importlib
from pixelkit import Canvas

W, H = 80, 120
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "src", "decks", "ulysses", "pixel")
SCALE = 5


def load_cards():
    """All majors + every suit_*.py module's CARDS, merged."""
    from ulysses_cards import CARDS as cards
    merged = dict(cards)
    here = os.path.dirname(__file__)
    for fn in sorted(os.listdir(here)):
        if fn.startswith("suit_") and fn.endswith(".py"):
            mod = importlib.import_module(fn[:-3])
            merged.update(getattr(mod, "CARDS", {}))
    return merged


def build(cards, tag="all"):
    os.makedirs(OUT, exist_ok=True)
    for slug, fn in cards.items():
        fn().save(os.path.join(OUT, f"{slug}.png"), scale=SCALE)
    print(f"rendered {len(cards)} cards ({tag}) -> {os.path.relpath(OUT)}")


def montage(cards, cols=7, name="montage"):
    """Contact sheet of the given cards at logical size, for one-glance review."""
    slugs = list(cards)
    CARDS = cards
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
    path = os.path.join(os.path.dirname(__file__), f"{name}.png")
    sheet.save(path, scale=3)
    print(f"{name} ({len(slugs)} cards) -> {os.path.relpath(path)}")


if __name__ == "__main__":
    if "--suit" in sys.argv:
        suit = sys.argv[sys.argv.index("--suit") + 1]
        mod = importlib.import_module(f"suit_{suit}")
        cards = getattr(mod, "CARDS")
        build(cards, tag=suit)
        montage(cards, cols=7, name=f"montage_{suit}")
    else:
        cards = load_cards()
        build(cards)
        if "--montage" in sys.argv:
            montage(cards, name="montage")
