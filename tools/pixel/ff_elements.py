"""
Final Fantasy "Elemental Wheel" pixel pack — the THEMING engine.

The deck's transversal is the eight magicks; each card's `station_slug` (fire/thunder/earth/holy/ice/
water/wind/dark) picks its palette AND its light. This is the analog of Ulysses' Vico AGES: the same
semantic keys across all elements, different values to carry each element's mood — plus a per-element
*register* (backdrop + atmosphere + rim-light) so the creature subject is felt to stand under that
element's sky without the element ever being named.

Keys (match pixelkit.AGES so motifs.py works): sky_top/sky_bot/horizon, ground, ink, bright, accent,
glow (the element's signature light; aliased as `ember` for motif compatibility), stone/stone_lt/
stone_dk, figure. Plus tuning: vig (vignette strength), vigcol (key), rim (rim-light key).
"""
from pixelkit import Canvas, shade
import math

W, H = 80, 120

ELEMENTS = {
    "fire": dict(
        sky_top=(26, 16, 18), sky_bot=(92, 38, 28), horizon=(184, 86, 44),
        ground=(30, 18, 16), ink=(12, 8, 8),
        bright=(255, 228, 170), accent=(240, 150, 60), glow=(232, 96, 38),
        stone=(86, 58, 52), stone_lt=(142, 96, 78), stone_dk=(50, 32, 30), figure=(18, 12, 12),
        vig=0.5, vigcol="ink", rim="glow",
    ),
    "thunder": dict(
        sky_top=(30, 24, 52), sky_bot=(74, 54, 112), horizon=(154, 130, 204),
        ground=(28, 24, 42), ink=(12, 10, 20),
        bright=(246, 244, 255), accent=(154, 132, 232), glow=(124, 152, 255),
        stone=(74, 68, 98), stone_lt=(122, 116, 152), stone_dk=(44, 40, 62), figure=(20, 16, 30),
        vig=0.42, vigcol="ink", rim="glow",
    ),
    "earth": dict(
        sky_top=(150, 128, 96), sky_bot=(198, 172, 128), horizon=(182, 152, 110),
        ground=(118, 90, 58), ink=(48, 36, 26),
        bright=(240, 218, 172), accent=(172, 122, 64), glow=(150, 110, 60),
        stone=(148, 118, 84), stone_lt=(190, 158, 116), stone_dk=(96, 72, 50), figure=(64, 48, 34),
        vig=0.26, vigcol="ink", rim="bright",
    ),
    "holy": dict(
        sky_top=(196, 206, 226), sky_bot=(240, 238, 226), horizon=(252, 248, 228),
        ground=(200, 200, 204), ink=(122, 112, 98),
        bright=(255, 252, 238), accent=(242, 208, 122), glow=(255, 242, 196),
        stone=(208, 202, 198), stone_lt=(240, 236, 230), stone_dk=(170, 162, 158), figure=(150, 140, 128),
        vig=0.2, vigcol="ink", rim="glow",
    ),
    "ice": dict(
        sky_top=(176, 200, 224), sky_bot=(218, 234, 246), horizon=(234, 244, 251),
        ground=(182, 202, 216), ink=(86, 108, 128),
        bright=(250, 253, 255), accent=(150, 202, 232), glow=(202, 234, 251),
        stone=(172, 196, 212), stone_lt=(220, 236, 246), stone_dk=(122, 148, 168), figure=(96, 120, 140),
        vig=0.3, vigcol="stone_dk", rim="bright",
    ),
    "water": dict(
        sky_top=(18, 52, 72), sky_bot=(36, 98, 118), horizon=(80, 162, 170),
        ground=(20, 60, 72), ink=(8, 28, 38),
        bright=(198, 240, 238), accent=(70, 182, 182), glow=(92, 202, 202),
        stone=(40, 86, 98), stone_lt=(96, 158, 162), stone_dk=(24, 56, 66), figure=(16, 40, 50),
        vig=0.4, vigcol="ink", rim="glow",
    ),
    "wind": dict(
        sky_top=(204, 216, 224), sky_bot=(234, 240, 242), horizon=(226, 234, 236),
        ground=(196, 206, 208), ink=(110, 120, 124),
        bright=(253, 254, 255), accent=(172, 202, 212), glow=(222, 238, 242),
        stone=(196, 206, 210), stone_lt=(234, 240, 244), stone_dk=(150, 162, 168), figure=(120, 132, 138),
        vig=0.16, vigcol="ink", rim="bright",
    ),
    "dark": dict(
        sky_top=(10, 8, 18), sky_bot=(26, 18, 40), horizon=(50, 32, 70),
        ground=(12, 10, 20), ink=(4, 4, 8),
        bright=(184, 162, 214), accent=(122, 82, 182), glow=(96, 62, 146),
        stone=(40, 34, 54), stone_lt=(80, 66, 100), stone_dk=(22, 18, 32), figure=(14, 12, 20),
        vig=0.62, vigcol="ink", rim="glow",
    ),
}

# alias glow->ember so motifs.py (lamp/starfield) works unchanged
for _p in ELEMENTS.values():
    _p["ember"] = _p["glow"]


def pal(el):
    return ELEMENTS[el]


def backdrop(c, el, horizon_y=84):
    """Lay the element's sky + ground. Each element gets a distinct compositional register."""
    p = ELEMENTS[el]
    c.vgrad(0, 0, W, horizon_y, p["sky_top"], p["sky_bot"])
    c.rect(0, horizon_y, W, H - horizon_y, p["ground"])
    # a faint horizon seam
    c.hline(0, W - 1, horizon_y, shade(p["horizon"], -0.05))

    if el == "fire":
        c.glow(W // 2, horizon_y + 4, 54, p["glow"], 0.45)            # molten low light
        c.scatter(0, 0, W, horizon_y, p["ink"], 0.28, seed=3, falloff=0.9, a=150)  # smoke
        c.scatter(0, 6, W, horizon_y - 6, p["glow"], 0.04, seed=7, a=160)          # rising embers
    elif el == "thunder":
        c.scatter(0, 0, W, horizon_y, p["ink"], 0.35, seed=4, falloff=0.85, a=150)  # storm clouds
        c.line(48, 6, 40, 30, p["bright"], 220); c.line(40, 30, 46, 44, p["bright"], 200)  # a bolt
        c.glow(43, 30, 16, p["glow"], 0.35)
    elif el == "earth":
        c.scatter(0, horizon_y - 8, W, 24, p["stone_dk"], 0.12, seed=5, a=120)      # dust haze
    elif el == "holy":
        c.glow(W // 2, 8, 70, p["glow"], 0.5)                          # light from above
        c.scatter(8, 4, W - 16, horizon_y, p["bright"], 0.03, seed=6, a=120)        # motes of grace
    elif el == "ice":
        c.scatter(0, 0, W, horizon_y, p["bright"], 0.05, seed=8, a=150)             # drifting frost
    elif el == "water":
        c.scatter(0, horizon_y, W, H - horizon_y, p["glow"], 0.08, seed=9, a=120)   # caustics on the floor
        c.scatter(0, 0, W, horizon_y, p["stone_lt"], 0.04, seed=2, a=90)
    elif el == "wind":
        for k in range(6):                                             # drifting streaks
            yy = 12 + k * 12
            c.scatter(0, yy, W, 2, p["stone_lt"], 0.5, seed=10 + k, a=110)
    elif el == "dark":
        c.glow(W // 2, H // 2, 40, p["glow"], 0.3)                     # one weak source
        c.scatter(0, 0, W, H, p["ink"], 0.2, seed=11, a=130)


def atmosphere(c, el, fx=None, fy=None):
    """Finish: the element's signature glow on the focal point + its vignette. Call last."""
    p = ELEMENTS[el]
    if fx is not None and el in ("fire", "thunder", "holy", "water", "dark"):
        c.glow(fx, fy, 26, p["glow"], 0.30)
    c.vignette(p["vig"], p[p["vigcol"]])


def rimlight(el):
    """The color a creature's lit edge should take under this element."""
    return ELEMENTS[el][ELEMENTS[el]["rim"]]
