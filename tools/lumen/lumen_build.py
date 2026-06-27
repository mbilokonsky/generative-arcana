"""
Render the Evolution & Consciousness "Lumen" skin into the app, deriving each card from its
suit/rank/station/number coordinates in decks/evolution/deck.json.

  python tools/lumen/lumen_build.py --suit names   # one suit + montage
  python tools/lumen/lumen_build.py --majors        # the 22 majors + montage
  python tools/lumen/lumen_build.py                 # everything (+ per-group montages)

Run from repo root. Output filenames are card slugs -> app/src/decks/evolution/lumen/<slug>.png.
"""
import os, sys, json
from PIL import Image
from lumenkit import Lumen, W, H
from lumen import SUITS, ground, finish, modulate, compose
from lumen_majors import MAJORS

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DECK = os.path.join(ROOT, "decks", "evolution", "deck.json")
OUT = os.path.join(ROOT, "app", "src", "decks", "evolution", "lumen")
OUT_SCALE = 2


def render(card):
    slug = card["slug"]; station = card["station_slug"]; char = card.get("factorization", {}).get("character", "composite")
    if card["arcana"] == "major":
        P = SUITS["major"]; c = Lumen(P["g2"]); ground(c, P, station)
        fx, fy = MAJORS[slug](c, P); modulate(c, P, char, fx, fy); finish(c, P, station, fx, fy)
        return c
    return compose(card["suit_slug"], card["rank_slug"], station, char)


def montage(cards, cols, name):
    pad = 6
    rows = (len(cards) + cols - 1) // cols
    sheet = Image.new("RGB", ((W + pad) * cols + pad, (H + pad) * rows + pad), (12, 12, 16))
    for i, card in enumerate(cards):
        c = render(card)
        c.paste_logical(sheet, pad + (i % cols) * (W + pad), pad + (i // cols) * (H + pad))
    p = os.path.join(os.path.dirname(__file__), f"lumen_montage_{name}.png")
    sheet.save(p); print(f"montage {name}: {len(cards)} -> {os.path.relpath(p)}")


def main():
    data = json.load(open(DECK, encoding="utf-8"))
    cards = list(data["cards"].values())
    os.makedirs(OUT, exist_ok=True)
    a = sys.argv

    if "--suit" in a:
        suit = a[a.index("--suit") + 1]
        sel = [c for c in cards if c.get("suit_slug") == suit]
        order = {s: i for i, s in enumerate(["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "novice", "wielder", "keeper", "sovereign"])}
        sel.sort(key=lambda c: order.get(c["rank_slug"], 99))
        for c in sel: render(c).save(os.path.join(OUT, f"{c['slug']}.png"), OUT_SCALE)
        montage(sel, 7, suit); print(f"rendered {len(sel)} {suit}")
        return
    if "--majors" in a:
        sel = sorted([c for c in cards if c["arcana"] == "major"], key=lambda c: int(c["number"]))
        for c in sel: render(c).save(os.path.join(OUT, f"{c['slug']}.png"), OUT_SCALE)
        montage(sel, 6, "majors"); print(f"rendered {len(sel)} majors")
        return

    for c in cards:
        render(c).save(os.path.join(OUT, f"{c['slug']}.png"), OUT_SCALE)
    print(f"rendered all {len(cards)} -> {os.path.relpath(OUT)}")
    montage(sorted([c for c in cards if c["arcana"] == "major"], key=lambda c: int(c["number"])), 6, "majors")
    for suit in ("names", "claims", "tells", "avowals"):
        sel = [c for c in cards if c.get("suit_slug") == suit]
        order = {s: i for i, s in enumerate(["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "novice", "wielder", "keeper", "sovereign"])}
        sel.sort(key=lambda c: order.get(c["rank_slug"], 99))
        montage(sel, 7, suit)


if __name__ == "__main__":
    main()
