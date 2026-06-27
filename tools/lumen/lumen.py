"""
The Lumen skin for the Evolution & Consciousness deck — palettes, lighting registers, suit forms,
and the rank operation library. A card is derived from its coordinates:
    form(suit) · operation(rank) · light(station) · modulation(number)
which is the deck's own thesis (every card an integration of its axes) made into a renderer.
"""
import math
from lumenkit import Lumen, W, H, _lerp


def sh(c, f):
    return _lerp(c, (255, 255, 255), f) if f >= 0 else _lerp(c, (0, 0, 0), -f)


# ── the four suit climates ─────────────────────────────────────────────────────
SUITS = {
    "names":   dict(g1=(216, 224, 232), g2=(188, 200, 213), ink=(38, 52, 67), accent=(74, 120, 156), light=(250, 252, 255), glow=(150, 198, 228), pale=True),
    "claims":  dict(g1=(30, 15, 13),    g2=(54, 21, 16),    ink=(255, 226, 198), accent=(236, 86, 50), light=(255, 234, 184), glow=(248, 122, 60), pale=False),
    "tells":   dict(g1=(28, 20, 15),    g2=(50, 35, 24),    ink=(238, 210, 176), accent=(210, 144, 80), light=(248, 212, 150), glow=(236, 170, 96), pale=False),
    "avowals": dict(g1=(15, 14, 19),    g2=(30, 26, 22),    ink=(238, 230, 206), accent=(216, 178, 88), light=(255, 244, 206), glow=(255, 226, 150), pale=False),
    "major":   dict(g1=(11, 11, 15),    g2=(22, 21, 28),    ink=(232, 228, 216), accent=(216, 178, 90), light=(255, 246, 214), glow=(255, 230, 158), pale=False),
}

STATIONS = ["in-formation", "signification", "assertion", "thematization", "thesis-making", "self-presence", "sedimentation"]


# ── the seven Involution lighting registers (station → ground + finish) ─────────
def ground(c, P, station):
    if P["pale"]:
        c.vgrad(sh(P["g1"], 0.05), P["g2"]); return
    if station == "assertion":
        c.vgrad(sh(P["g1"], -0.32), sh(P["g2"], -0.22))
    elif station == "thematization":
        c.fill(sh(P["g2"], -0.4))
    elif station == "self-presence":
        c.rgrad(W / 2, H / 2, H * 0.62, sh(P["g2"], -0.02), sh(P["g1"], -0.45))
    elif station == "sedimentation":
        c.vgrad(sh(P["g2"], -0.12), sh(P["g1"], 0.08))
        for i, yy in enumerate((H * 0.68, H * 0.78, H * 0.88, H * 0.96)):
            c.line(0, yy, W, yy, sh(P["g2"], 0.14 - i * 0.03), 1.3)
    else:
        c.vgrad(P["g1"], P["g2"])


def finish(c, P, station, fx, fy):
    if station == "in-formation":
        c.glow(W / 2, H * 0.34, H * 0.55, sh(P["g1"], 0.2 if not P["pale"] else 0.0), 0.4)
        c.vignette(0.2, sh(P["g2"], -0.5))
    elif station == "signification":
        c.vignette(0.26, sh(P["g2"], -0.5))
    elif station == "assertion":
        c.glow(fx, fy, 64, P["accent"], 0.6); c.vignette(0.52, (4, 3, 3))
    elif station == "thematization":
        c.glow(fx, fy, 48, P["light"], 0.5); c.vignette(0.64, (3, 3, 4))
    elif station == "thesis-making":
        c.glow(fx - 36, fy, 34, P["accent"], 0.38); c.glow(fx + 36, fy, 34, P["accent"], 0.38)
        c.glow(fx, fy, 30, P["light"], 0.42); c.vignette(0.42, (4, 3, 4))
    elif station == "self-presence":
        c.glow(fx, fy, 78, P["glow"], 0.6); c.glow(fx, fy, 34, P["light"], 0.5)
        c.bloom(0.45, 7); c.vignette(0.16, (3, 3, 5))
    elif station == "sedimentation":
        c.glow(W / 2, H * 0.74, 86, sh(P["glow"], -0.18), 0.32); c.vignette(0.42, sh(P["g1"], -0.6))
    c.grain(6)


# ── suit forms (the act each suit performs) ─────────────────────────────────────
def f_names(c, P, x, y, s, lit=False):
    # a specimen + tag + label: ink line on pale, diagrammatic
    c.disc(x, y, 4.2 * s, P["ink"]); c.ring(x, y, 6.6 * s, P["accent"], 1.3 * s)
    c.line(x + 6.6 * s, y, x + 16 * s, y - 9 * s, P["ink"], 1.1)
    c.rect(x + 16 * s, y - 14 * s, 15 * s, 9 * s, P["accent"], 1.3)


def f_claims(c, P, x, y, s, lit=True):
    c.poly([(x, y - 13 * s), (x + 9 * s, y + 7 * s), (x, y + 1.5 * s), (x - 9 * s, y + 7 * s)], P["accent"])
    c.line(x - 15 * s, y + 12 * s, x + 15 * s, y + 12 * s, P["light"], 1.5)
    if lit: c.glow(x, y, 13 * s, P["glow"], 0.5)


def f_tells(c, P, x, y, s, lit=True):
    c.disc(x, y, 2.6 * s, P["light"])
    c.ring(x, y, 6.5 * s, P["accent"], 1.3 * s); c.ring(x, y, 11 * s, sh(P["accent"], -0.2), 1.1 * s)
    if lit: c.glow(x, y, 13 * s, P["glow"], 0.45)


def f_avowals(c, P, x, y, s, lit=True):
    c.line(x, y - 12 * s, x, y + 12 * s, P["light"], 1.8)
    c.ring(x, y, 9 * s, P["accent"], 1.5 * s)
    if lit: c.glow(x, y, 14 * s, P["glow"], 0.55)


FORMS = {"names": f_names, "claims": f_claims, "tells": f_tells, "avowals": f_avowals}


# ── rank operations (14) — the geometric move the rank makes ────────────────────
def _seam(c, P, vertical=True):
    col = P["ink"] if P["pale"] else P["light"]
    if vertical: c.line(W / 2, 38, W / 2, H - 38, col, 0.8)
    else: c.line(34, H / 2, W - 34, H / 2, col, 0.8)


def op_ace(c, P, form): form(c, P, W / 2, H / 2, 1.6); return W / 2, H / 2

def op_two(c, P, form):
    _seam(c, P); form(c, P, W / 2 - 36, H / 2, 1.0); form(c, P, W / 2 + 36, H / 2, 1.0); return W / 2, H / 2

def op_three(c, P, form):
    form(c, P, W / 2 - 30, H / 2 + 26, 0.85); form(c, P, W / 2 + 30, H / 2 + 26, 0.85)
    form(c, P, W / 2, H / 2 - 30, 1.0); return W / 2, H / 2 - 30

def op_four(c, P, form):
    col = P["ink"] if P["pale"] else sh(P["accent"], -0.1)
    for gy in (H / 2 - 36, H / 2 + 36):
        c.line(W / 2 - 34, gy, W / 2 + 34, gy, col, 0.7)
    for gx in (W / 2 - 34, W / 2 + 34):
        c.line(gx, H / 2 - 36, gx, H / 2 + 36, col, 0.7)
    for gx in (W / 2 - 34, W / 2 + 34):
        for gy in (H / 2 - 36, H / 2 + 36):
            form(c, P, gx, gy, 0.62)
    return W / 2, H / 2

def op_five(c, P, form):
    form(c, P, W / 2, H / 2, 1.4)
    for a in (-0.5, 0.5, 2.6, -2.6):  # converging stress
        c.line(W / 2 + math.cos(a) * 70, H / 2 + math.sin(a) * 70, W / 2 + math.cos(a) * 26, H / 2 + math.sin(a) * 26, sh(P["accent"], -0.1), 0.8)
    c.line(W / 2 - 3, H / 2 - 18, W / 2 + 4, H / 2 + 18, P["g2"] if not P["pale"] else P["light"], 0.7)  # fracture
    return W / 2, H / 2

def op_six(c, P, form):
    c.line(W / 2 - 40, H / 2 + 34, W / 2 + 40, H / 2 - 34, P["light"] if not P["pale"] else P["ink"], 0.8)  # clean diagonal seam
    form(c, P, W / 2, H / 2, 1.3); return W / 2, H / 2

def op_seven(c, P, form):
    form(c, P, W / 2, H / 2 + 22, 1.2)
    col = P["ink"] if P["pale"] else sh(P["light"], -0.1)
    c.line(W / 2, H / 2 - 6, W / 2 - 30, 44, col, 0.8); c.line(W / 2, H / 2 - 6, W / 2 + 30, 44, col, 0.8)  # the fork
    return W / 2, H / 2 + 22

def op_eight(c, P, form):
    form(c, P, W / 2, H / 2, 1.5); form(c, P, W / 2 + 30, H / 2 - 34, 0.55)  # the form wielding a smaller one
    return W / 2, H / 2

def op_nine(c, P, form):
    for i in range(8):
        a = i / 8 * math.tau - math.pi / 2
        form(c, P, W / 2 + math.cos(a) * 44, H / 2 + math.sin(a) * 58, 0.42)
    return W / 2, H / 2

def op_ten(c, P, form):
    for gx in (W / 2 - 32, W / 2 + 32):
        for gy in (H / 2 - 34, H / 2 + 34):
            form(c, P, gx, gy, 0.55)
    c.line(W / 2 - 6, 40, W / 2 + 10, H - 40, P["light"] if not P["pale"] else P["ink"], 1.0)  # the breaking seam
    return W / 2, H / 2

def op_novice(c, P, form): form(c, P, W / 2, H / 2 + 26, 1.0); return W / 2, H / 2 + 26

def op_wielder(c, P, form):
    for k, (dx, dy, s) in enumerate(((-34, 30, 0.7), (0, 6, 1.0), (34, -22, 1.25))):  # thrown outward, growing
        form(c, P, W / 2 + dx, H / 2 + dy, s)
    return W / 2 + 34, H / 2 - 22

def op_keeper(c, P, form): form(c, P, W / 2, H / 2, 1.5); return W / 2, H / 2

def op_sovereign(c, P, form):
    form(c, P, W / 2, H / 2 - 26, 1.5)
    for i in range(5):
        form(c, P, W / 2 + (i - 2) * 30, H / 2 + 52, 0.4)  # the ordered field beneath
    return W / 2, H / 2 - 26


OPS = {
    "ace": op_ace, "two": op_two, "three": op_three, "four": op_four, "five": op_five,
    "six": op_six, "seven": op_seven, "eight": op_eight, "nine": op_nine, "ten": op_ten,
    "novice": op_novice, "wielder": op_wielder, "keeper": op_keeper, "sovereign": op_sovereign,
}


# ── number modulation (subtle undertone) ────────────────────────────────────────
def modulate(c, P, char, fx, fy):
    if char == "prime":
        c.glow(fx, fy, 16, P["light"], 0.32)      # a single tight struck core
    elif char == "identity":
        c.glow(fx, fy, 24, sh(P["glow"], -0.1), 0.22)  # nascent, faint


def compose(suit, rank, station, char):
    P = SUITS[suit]
    c = Lumen(P["g2"])
    ground(c, P, station)
    fx, fy = OPS[rank](c, P, FORMS[suit])
    modulate(c, P, char, fx, fy)
    finish(c, P, station, fx, fy)
    return c
