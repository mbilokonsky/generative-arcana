"""
suit_nets — the "Nets" minor suit for the Ulysses "Vico" pixel pack (Mundane Resistance).

Core motif: the diamond mesh (motifs.net) — snares, webs, bars — and a figure caught or
straining in/against it. The crushing of the small and quotidian. Rank modulates the
arrangement; the card's Vico age (station_slug) sets palette + compositional register.

Render:  python tools/pixel/build.py --suit nets
"""
from motifs import *

W, H = 80, 120


# ── local helpers ──────────────────────────────────────────────────────────────
def _bg(c, p, age):
    """Age-appropriate backdrop (sky/ground)."""
    if age == "gods":
        c.vgrad(0, 0, W, 88, p["sky_top"], p["sky_bot"])
        c.scatter(0, 0, W, 50, p["ink"], 0.32, a=170, seed=7, falloff=0.6)
        c.rect(0, 88, W, H - 88, p["ground"])
    elif age == "heroes":
        c.vgrad(0, 0, W, 92, p["sky_top"], p["horizon"])
        c.rect(0, 92, W, H - 92, p["ground"])
    elif age == "men":
        c.vgrad(0, 0, W, 70, p["sky_top"], p["sky_bot"])
        c.rect(0, 70, W, H - 70, p["ground"])
    else:  # ricorso
        c.vgrad(0, 0, W, 96, p["sky_top"], p["sky_bot"])
        c.scatter(0, 40, W, 60, p["horizon"], 0.16, a=120, seed=4)
        c.rect(0, 96, W, H - 96, p["ground"])


def _finish(c, age):
    p = AGES[age]
    if age == "gods":
        c.vignette(0.55)
    elif age == "heroes":
        c.vignette(0.4)
    elif age == "men":
        c.vignette(0.2)
    else:
        c.vignette(0.45, col=p["ink"])


def _mesh(c, x, y, w, h, p, a=200, step=4, col=None, jitter=0):
    """A diamond net patch with optional per-vertex jitter for a tangled, irregular weave."""
    col = col or p["stone_lt"]
    for gy in range(0, h, step):
        for gx in range(0, w, step):
            j1 = ((gx * 31 + gy * 17) % (2 * jitter + 1)) - jitter if jitter else 0
            j2 = ((gx * 13 + gy * 29) % (2 * jitter + 1)) - jitter if jitter else 0
            c.line(x + gx + j1, y + gy, x + gx + step + j2, y + gy + step, col, a)
            c.line(x + gx + step + j2, y + gy, x + gx + j1, y + gy + step, col, a)


def _knots(c, x, y, w, h, p, step=4, col=None, a=220):
    """Knot dots at mesh vertices — reads the weave as a real net."""
    col = col or shade(p["stone_lt"], 0.15)
    for gy in range(0, h + 1, step):
        for gx in range(0, w + 1, step):
            c.set(x + gx, y + gy, col, a)


def _caught(c, x, feet, h, p):
    """A figure with mesh laid over it — the snared soul."""
    figure(c, x, feet, h, p["figure"])
    _mesh(c, x - h // 3, feet - h, int(h * 0.66), h, p, a=180, step=3, jitter=1)


def _door(c, x, ybase, w, h, p):
    """A simple stone doorway/threshold (lit-left jambs, dark opening)."""
    c.rect(x, ybase - h, w, h, p["ink"])               # dark opening
    c.rect(x - 3, ybase - h - 3, w + 6, 3, p["stone_lt"])  # lintel
    c.vline(x - 1, ybase - h, ybase, p["stone_lt"])
    c.vline(x - 2, ybase - h, ybase, p["stone"])
    c.vline(x + w, ybase - h, ybase, p["stone_dk"])
    c.vline(x + w + 1, ybase - h, ybase, p["stone_dk"])


# ── cards ───────────────────────────────────────────────────────────────────────
def nets_0():
    """Homecoming (men): the tower threshold webbed shut; a figure arrives with a netted key."""
    age = "men"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    # the doorway home, webbed with obligation
    _door(c, 30, 96, 20, 46, p)
    _mesh(c, 26, 50, 30, 50, p, a=210, step=4, jitter=1)
    _knots(c, 26, 50, 28, 48, p)
    # figure arriving at the threshold with a key tangled in net
    figure(c, 60, 100, 30, p["figure"])
    key(c, 60, 70, p, h=11)
    _mesh(c, 53, 64, 16, 22, p, a=150, step=3, jitter=1)
    _finish(c, age)
    return c


def nets_1():
    """Replacement (ricorso): split — tower-net fading left, school-net tightening right; figure between."""
    age = "ricorso"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    # left: loose fading net
    _mesh(c, 2, 18, 34, 86, p, a=110, step=6, jitter=2, col=shade(p["stone"], 0.05))
    # right: tight tightening net
    _mesh(c, 44, 18, 34, 86, p, a=230, step=3, jitter=1)
    _knots(c, 44, 18, 33, 84, p)
    # connecting threads across the divide
    for k in range(20, 100, 14):
        c.line(34, k, 46, k + 4, shade(p["stone_lt"], -0.1), 150)
    # figure mid-exchange
    figure(c, 40, 102, 32, p["figure"])
    _finish(c, age)
    return c


def nets_2():
    """Trinity (gods): three nets form a triangular prison around a central figure; storm."""
    age = "gods"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(40, 36, 22, p["ember"], 0.3)
    # three nets, three tints, meeting at center (triangle of entrapment)
    nation = shade(p["accent"], -0.2)
    tongue = p["stone_lt"]
    faith = shade(p["ink"], 0.25)
    _mesh(c, 22, 14, 36, 30, p, a=200, step=4, jitter=1, col=tongue)        # top — language
    _mesh(c, 8, 60, 34, 40, p, a=200, step=4, jitter=1, col=nation)         # left — nationality
    _mesh(c, 42, 60, 32, 40, p, a=200, step=4, jitter=1, col=faith)         # right — religion
    # triangle frame edges
    c.line(40, 16, 14, 96, p["accent"], 220)
    c.line(40, 16, 70, 96, p["accent"], 220)
    c.line(14, 96, 70, 96, p["accent"], 220)
    # caught figure at center
    figure(c, 40, 92, 30, p["figure"])
    _mesh(c, 28, 62, 24, 30, p, a=160, step=3, jitter=1)
    _finish(c, age)
    return c


def nets_3():
    """The City (heroes): Dublin grid as a net over civic blocks; the Liffey a net-rope; twilight."""
    age = "heroes"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(58, 26, 16, p["accent"], 0.45)  # low heroic sun
    c.disc(58, 26, 7, p["accent"])
    # city blocks
    for bx in range(6, 74, 18):
        for by in range(48, 104, 18):
            c.rect(bx, by, 12, 12, shade(p["stone"], 0.1 - 0.4 * (bx / W)))
            c.rect(bx + 2, by + 2, 8, 8, p["stone_dk"])
    # the grid laid over as a net — streets become mesh, prison bars
    _mesh(c, 2, 44, 76, 62, p, a=210, step=6, jitter=0, col=shade(p["ink"], 0.3))
    _knots(c, 2, 44, 76, 60, p)
    # the Liffey as a thick net-rope binding through
    for yy in range(44, 106):
        c.set(2 + (yy - 44), yy, p["accent"], 180)
        c.set(3 + (yy - 44), yy, shade(p["accent"], -0.3), 180)
    # tiny figure caught in the streets
    figure(c, 40, 92, 14, p["figure"])
    _finish(c, age)
    return c


def nets_4():
    """The Outsider (men): one figure densely over-netted while others pass through single-layer mesh."""
    age = "men"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    # city-wide single-layer mesh
    _mesh(c, 0, 30, W, 74, p, a=120, step=8, jitter=0, col=shade(p["stone"], 0.0))
    # background figures, freer
    figure(c, 16, 96, 22, shade(p["figure"], 0.18))
    figure(c, 66, 96, 22, shade(p["figure"], 0.18))
    # the outsider — central, wrapped in layer upon layer (figure stays readable on top)
    _mesh(c, 24, 58, 32, 46, p, a=150, step=4, jitter=2, col=shade(p["accent"], -0.3))
    _mesh(c, 28, 64, 24, 38, p, a=130, step=5, jitter=2, col=p["ink"])
    figure(c, 40, 100, 34, p["figure"])
    _mesh(c, 26, 62, 28, 40, p, a=200, step=3, jitter=2)
    _knots(c, 26, 60, 27, 40, p)
    _finish(c, age)
    return c


def nets_5():
    """Identity (ricorso): two netted figures whose nets reach toward and touch each other; fog."""
    age = "ricorso"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    # two caught figures, apart
    _caught(c, 22, 100, 30, p)
    _caught(c, 58, 100, 30, p)
    # their nets reach across the gap and connect — recognition through entanglement
    _mesh(c, 30, 56, 22, 30, p, a=150, step=4, jitter=2, col=p["accent"])
    for k in range(58, 92, 6):
        c.line(30, k, 50, k - 4, shade(p["accent"], 0.1), 170)
    c.glow(40, 70, 12, p["accent"], 0.35)
    _finish(c, age)
    return c


def nets_6():
    """Asymmetry (gods): seven nets bind a figure unevenly — three tight, four loose; storm."""
    age = "gods"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(40, 30, 20, p["ember"], 0.25)
    # left side: 3 tight cutting nets (kept clear of the central figure column)
    for yy in (40, 60, 80):
        _mesh(c, 4, yy, 24, 18, p, a=230, step=3, jitter=0, col=shade(p["accent"], -0.2))
    # right side: 4 looser, more numerous nets
    for yy in (36, 54, 72, 90):
        _mesh(c, 52, yy, 26, 14, p, a=150, step=5, jitter=2, col=p["stone_lt"])
    # the figure pulled between them, readable on top
    figure(c, 40, 98, 34, p["figure"])
    _mesh(c, 28, 60, 24, 40, p, a=150, step=3, jitter=1)
    _finish(c, age)
    return c


def nets_7():
    """History (heroes): nets layered like sediment through time; a figure drowning under the weight."""
    age = "heroes"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    # strata of accumulated nets, oldest at bottom, darkening with depth
    strata = [(20, p["stone_lt"], 130), (40, shade(p["stone"], 0.0), 160),
              (62, shade(p["stone"], -0.2), 190), (84, shade(p["ink"], 0.3), 220)]
    for sy, col, a in strata:
        _mesh(c, 0, sy, W, 26, p, a=a, step=5, jitter=2, col=col)
    # figure submerged — drawn low, then the heavy lower strata layered back over it so
    # only head and shoulders surface above the accumulated weight
    figure(c, 40, 96, 40, p["figure"])
    for sy, col, a in strata[2:]:
        _mesh(c, 0, sy, W, 26, p, a=a, step=5, jitter=2, col=col)
    _mesh(c, 22, 64, 36, 34, p, a=210, step=4, jitter=2, col=shade(p["ink"], 0.2))
    _finish(c, age)
    return c


def nets_8():
    """Invitation (men): an open doorway hung with an undeniable net; a figure reaching toward it."""
    age = "men"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    _door(c, 32, 100, 22, 56, p)
    # the net hung obviously across the open threshold
    _mesh(c, 30, 46, 26, 54, p, a=225, step=4, jitter=1)
    _knots(c, 30, 46, 24, 52, p)
    # figure at the threshold, hand reaching out
    figure(c, 14, 102, 30, p["figure"])
    c.line(20, 84, 30, 80, p["figure"])   # reaching arm toward the net
    c.rect(29, 79, 2, 2, p["figure"])
    _finish(c, age)
    return c


def nets_9():
    """Recurrence (ricorso): a single net repeating around a ring — the wheel of entanglement; fog."""
    age = "ricorso"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    cx, cy = 40, 58
    # spiral/ring of net segments — escape one, enter the next
    import math as _m
    n = 10
    for i in range(n):
        t = 2 * _m.pi * i / n
        r = 30 - i * 1.2
        px = cx + int(r * _m.cos(t)); py = cy + int(r * 0.9 * _m.sin(t))
        _mesh(c, px - 6, py - 6, 12, 12, p, a=190, step=4, jitter=1,
              col=shade(p["stone_lt"], -0.1))
    c.ring(cx, cy, 30, p["accent"], 150)
    c.ring(cx, cy, 29, shade(p["accent"], -0.3), 120)
    # the figure caught on the wheel
    figure(c, cx, 100, 26, p["figure"])
    _mesh(c, cx - 9, 80, 18, 24, p, a=160, step=3, jitter=1)
    _finish(c, age)
    return c


def nets_10():
    """Child (gods): a small young figure freshly, tightly wrapped — the nets new and hurting; storm."""
    age = "gods"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(40, 34, 18, p["ember"], 0.28)
    # small figure, lower-center
    figure(c, 40, 96, 26, p["figure"])
    # fresh, tight nets binding arms / torso / legs (three zones)
    _mesh(c, 28, 72, 24, 12, p, a=235, step=3, jitter=0, col=p["stone_lt"])   # arms
    _mesh(c, 30, 82, 20, 12, p, a=235, step=3, jitter=0, col=shade(p["accent"], -0.2))  # torso
    _mesh(c, 30, 92, 20, 8, p, a=235, step=3, jitter=0, col=p["stone_lt"])    # legs
    _knots(c, 28, 72, 22, 26, p)
    _finish(c, age)
    return c


def nets_11():
    """Father (heroes): a large figure so long-netted the mesh has faded into his skin; twilight."""
    age = "heroes"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(60, 28, 14, p["accent"], 0.35)
    # large central figure
    figure(c, 38, 106, 52, p["figure"])
    # nets faded toward the figure's own tone — nearly invisible, become his skin
    faded = shade(p["figure"], 0.22)
    _mesh(c, 18, 56, 40, 50, p, a=150, step=4, jitter=2, col=faded)
    _mesh(c, 16, 54, 44, 54, p, a=90, step=6, jitter=3, col=shade(p["stone_dk"], 0.1))
    _finish(c, age)
    return c


def nets_12():
    """Mother (men): a figure in bed; nets radiate outward from her like a web she is the center of."""
    age = "men"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    cx, cy = 40, 60
    # the bed
    c.rect(18, 64, 44, 18, shade(p["stone"], -0.1))
    c.rect(18, 62, 44, 3, p["stone_lt"])
    # reclining figure (head + body under sheet)
    c.disc(28, 60, 4, p["figure"])
    c.rect(30, 58, 28, 8, shade(p["figure"], 0.1))
    # web radiating from her — she is the center the net is built around
    import math as _m
    for i in range(14):
        t = 2 * _m.pi * i / 14
        c.line(cx, cy, cx + int(46 * _m.cos(t)), cy + int(46 * _m.sin(t)),
               shade(p["stone"], 0.05), 150)
    # concentric web rings
    for r in (12, 22, 32):
        c.ring(cx, cy, r, shade(p["stone_lt"], -0.05), 140)
    # a small caught figure (the son) snared in the outer web
    figure(c, 64, 100, 22, p["figure"])
    _mesh(c, 56, 80, 16, 22, p, a=170, step=3, jitter=1)
    _finish(c, age)
    return c


def nets_13():
    """Affirmation (ricorso): the word YES formed of net mesh, loosened and glowing through; dawn."""
    age = "ricorso"; p = AGES[age]; c = Canvas()
    _bg(c, p, age)
    c.glow(40, 56, 30, p["accent"], 0.4)
    # faint residual nets behind — the whole suit's entanglement, accepted
    _mesh(c, 6, 16, 68, 90, p, a=70, step=8, jitter=3, col=shade(p["stone"], 0.0))
    # YES, built from a glowing net mesh
    col = p["bright"]
    strokes = []
    # Y
    strokes += [(14, 44, 20, 56), (26, 44, 20, 56), (20, 56, 20, 72)]
    # E
    strokes += [(34, 44, 34, 72), (34, 44, 44, 44), (34, 57, 42, 57), (34, 72, 44, 72)]
    # S
    strokes += [(60, 44, 50, 44), (50, 44, 50, 57), (50, 57, 60, 57),
                (60, 57, 60, 72), (60, 72, 50, 72)]
    for x0, y0, x1, y1 in strokes:
        c.line(x0, y0, x1, y1, col)
        c.line(x0 + 1, y0, x1 + 1, y1, col)
    # net texture caught inside the letters' glow
    _mesh(c, 12, 42, 52, 32, p, a=120, step=4, jitter=1, col=shade(p["accent"], 0.2))
    # a small figure standing within the affirmation
    figure(c, 40, 104, 24, p["figure"])
    _finish(c, age)
    return c


CARDS = {
    "nets-0": nets_0, "nets-1": nets_1, "nets-2": nets_2, "nets-3": nets_3,
    "nets-4": nets_4, "nets-5": nets_5, "nets-6": nets_6, "nets-7": nets_7,
    "nets-8": nets_8, "nets-9": nets_9, "nets-10": nets_10, "nets-11": nets_11,
    "nets-12": nets_12, "nets-13": nets_13,
}
