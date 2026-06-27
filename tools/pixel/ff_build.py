"""
Render the Final Fantasy chibi pixel pack into the app.

  python tools/pixel/ff_build.py --suit chocobo      # one suit -> PNGs + ff_montage_chocobo.png
  python tools/pixel/ff_build.py --module ff_majors_g1  # one module -> PNGs + ff_montage_ff_majors_g1.png
  python tools/pixel/ff_build.py --majors            # all ff_majors_*.py -> PNGs + ff_montage_majors.png
  python tools/pixel/ff_build.py                     # everything (majors + 4 suits)
  python tools/pixel/ff_build.py --montage           # ... and a full contact sheet

Run from repo root. Output filenames are card slugs so the app's image-pack glob pairs them directly.
"""
import os, sys, importlib
from pixelkit import Canvas

W, H = 80, 120
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "src", "decks", "finalfantasy", "pixel")
SCALE = 5


def _modules(prefix):
    here = os.path.dirname(__file__)
    return [fn[:-3] for fn in sorted(os.listdir(here)) if fn.startswith(prefix) and fn.endswith(".py")]


def load(names):
    merged = {}
    for n in names:
        merged.update(getattr(importlib.import_module(n), "CARDS", {}))
    return merged


def build(cards, tag="all"):
    os.makedirs(OUT, exist_ok=True)
    for slug, fn in cards.items():
        fn().save(os.path.join(OUT, f"{slug}.png"), scale=SCALE)
    print(f"rendered {len(cards)} cards ({tag}) -> {os.path.relpath(OUT)}")


def montage(cards, cols=7, name="ff_montage"):
    slugs = list(cards)
    rows = (len(slugs) + cols - 1) // cols
    pad = 4
    sheet = Canvas((W + pad) * cols + pad, (H + pad) * rows + pad, bg=(20, 20, 24))
    for i, slug in enumerate(slugs):
        cd = cards[slug]()
        cx = pad + (i % cols) * (W + pad)
        cy = pad + (i // cols) * (H + pad)
        for y in range(H):
            for x in range(W):
                sheet.set(cx + x, cy + y, cd.px[y][x])
    path = os.path.join(os.path.dirname(__file__), f"{name}.png")
    sheet.save(path, scale=3)
    print(f"{name} ({len(slugs)} cards) -> {os.path.relpath(path)}")


if __name__ == "__main__":
    a = sys.argv
    if "--suit" in a:
        s = a[a.index("--suit") + 1]
        cards = load([f"ff_chibi_{s}"]); build(cards, s); montage(cards, 7, f"ff_montage_{s}")
    elif "--module" in a:
        m = a[a.index("--module") + 1]
        cards = load([m]); build(cards, m); montage(cards, 6, f"ff_montage_{m}")
    elif "--majors" in a:
        cards = load(_modules("ff_majors")); build(cards, "majors"); montage(cards, 6, "ff_montage_majors")
    else:
        cards = load(_modules("ff_majors") + _modules("ff_chibi_")); build(cards)
        if "--montage" in a:
            montage(cards, 8, "ff_montage_all")
