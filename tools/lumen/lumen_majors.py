"""
The 22 major plates for the Lumen skin — bespoke luminous-abstract compositions, one charged gesture
each, drawn on the deep 'major' palette. Ground + finish (the station's lighting) are applied by the
build; each recipe draws the central form and returns its focal point.
"""
import math
from lumenkit import W, H
from lumen import sh

COLD = (150, 196, 224)
HOT = (248, 120, 60)


def _ring_gap(c, x, y, r, col, w, gap_a=0.0):
    # a ring with a small opening (a "channel")
    steps = 64
    for i in range(steps):
        a = i / steps * math.tau
        if abs(((a - gap_a + math.pi) % math.tau) - math.pi) < 0.35:
            continue
        c.disc(x + math.cos(a) * r, y + math.sin(a) * r, w, col)


def _lattice(c, P, cx, cy, n, sp, col, dot=None):
    for i in range(n):
        c.line(cx - (n - 1) * sp / 2 + i * sp, cy - (n - 1) * sp / 2, cx - (n - 1) * sp / 2 + i * sp, cy + (n - 1) * sp / 2, col, 0.7)
        c.line(cx - (n - 1) * sp / 2, cy - (n - 1) * sp / 2 + i * sp, cx + (n - 1) * sp / 2, cy - (n - 1) * sp / 2 + i * sp, col, 0.7)


def _I(c, P, x, y, s, col=None):
    col = col or P["light"]
    c.line(x, y - 13 * s, x, y + 13 * s, col, 1.8); c.ring(x, y, 9 * s, P["accent"], 1.5 * s)


def m0(c, P):  # The Unformed
    c.glow(W / 2, H / 2, 52, sh(P["g1"], 0.5), 0.35); c.disc(W / 2, H / 2 + 6, 2.4, sh(P["glow"], -0.2)); return W / 2, H / 2

def m1(c, P):  # The Organism
    _ring_gap(c, W / 2, H / 2, 17, P["light"], 1.4, gap_a=0.0); c.glow(W / 2, H / 2, 16, P["glow"], 0.5)
    c.line(W / 2 + 17, H / 2, W - 30, H / 2, P["accent"], 1.0); return W / 2, H / 2

def m2(c, P):  # The Difference
    c.line(W / 2, 36, W / 2, H - 36, P["light"], 2.6); return W / 2, H / 2

def m3(c, P):  # The Utterance
    c.line(W / 2, H / 2 + 18, W / 2, H / 2 - 30, P["light"], 1.8); c.disc(W / 2, H / 2 - 34, 4, P["light"]); return W / 2, H / 2 - 30

def m4(c, P):  # The Frame
    _lattice(c, P, W / 2, H / 2, 4, 22, sh(P["accent"], -0.05)); c.disc(W / 2, H / 2, 4, P["light"]); return W / 2, H / 2

def m5(c, P):  # The Pressure
    for a in (0.4, -0.4, math.pi - 0.4, math.pi + 0.4, 1.9, -1.9):
        c.line(W / 2 + math.cos(a) * 78, H / 2 + math.sin(a) * 78, W / 2 + math.cos(a) * 22, H / 2 + math.sin(a) * 22, sh(P["accent"], -0.1), 0.8)
    c.disc(W / 2, H / 2, 5, P["light"]); return W / 2, H / 2

def m6(c, P):  # The Naming
    for i, (dx, dy) in enumerate(((-26, 8), (8, -6), (30, 14), (-6, 22))):
        c.disc(W / 2 + dx, H / 2 + dy, 4.5, sh(P["glow"], -0.1 * i)); c.ring(W / 2 + dx, H / 2 + dy, 8, P["accent"], 1.0)
    return W / 2, H / 2

def m7(c, P):  # The Theme
    c.disc(W / 2, H / 2, 6, P["light"]); c.ring(W / 2, H / 2, 12, P["accent"], 1.4); return W / 2, H / 2

def m8(c, P):  # The Severance
    c.ring(W / 2, H / 2, 14, COLD, 1.6); c.disc(W / 2, H / 2, 3, COLD); return W / 2, H / 2

def m9(c, P):  # The Discourse — the involution spiral of charged forms
    for i in range(28):
        t = i / 28
        a = t * math.tau * 1.8
        r = 8 + t * 60
        c.disc(W / 2 + math.cos(a) * r, H / 2 + math.sin(a) * r * 1.2, 2.6, sh(P["glow"], 0.1));
    c.glow(W / 2, H / 2, 30, P["glow"], 0.4); return W / 2, H / 2

def m10(c, P):  # The Turn
    c.ring(W / 2, H / 2, 16, P["light"], 1.6)
    c.poly([(W / 2, H / 2 - 16), (W / 2 + 16, H / 2), (W / 2, H / 2 + 16)], sh(P["g2"], -0.3))  # half in shadow
    c.line(W / 2 + 18, H / 2 - 18, W / 2 + 30, H / 2 - 8, P["accent"], 1.0); return W / 2, H / 2

def m11(c, P):  # The Self — the I meeting its own gaze across a joint
    _I(c, P, W / 2 - 22, H / 2, 0.9); _I(c, P, W / 2 + 22, H / 2, 0.9)
    c.disc(W / 2, H / 2, 3.5, P["light"]); return W / 2, H / 2

def m12(c, P):  # The Suspension — inverted lattice, inner-lit
    for gy in (H / 2 - 24, H / 2 + 2, H / 2 + 28):
        c.line(W / 2 - 30, gy, W / 2 + 30, gy, sh(P["accent"], -0.05), 0.7)
    c.poly([(W / 2 - 32, H / 2 - 26), (W / 2 + 32, H / 2 - 26), (W / 2, H / 2 + 34)], None) if False else None
    c.line(W / 2 - 30, H / 2 - 24, W / 2, H / 2 + 32, sh(P["accent"], -0.05), 0.7); c.line(W / 2 + 30, H / 2 - 24, W / 2, H / 2 + 32, sh(P["accent"], -0.05), 0.7)
    c.glow(W / 2, H / 2 + 4, 26, P["glow"], 0.5); return W / 2, H / 2 + 4

def m13(c, P):  # The Crossing — threshold, two grounds
    c.line(0, H / 2, W, H / 2, P["light"], 1.4)
    for i in range(7):
        c.disc(24 + i * 26, H / 2 - 22, 2, sh(P["glow"], 0.0))   # near side: scattered
    for yy in (H / 2 + 16, H / 2 + 30, H / 2 + 44):
        c.line(0, yy, W, yy, sh(P["g1"], 0.1), 1.0)              # far side: strata
    return W / 2, H / 2

def m14(c, P):  # The Measure — standard against current
    c.line(W / 2, H / 2 - 28, W / 2, H / 2 + 28, P["light"], 1.6)
    for yy in (H / 2 - 14, H / 2, H / 2 + 14):
        c.line(W / 2 - 4, yy, W / 2 + 4, yy, P["accent"], 1.0)   # the scale marks
    c.line(W / 2 + 6, H / 2, W - 28, H / 2, sh(P["glow"], -0.1), 0.9); return W / 2, H / 2

def m15(c, P):  # The Compulsion — chain-lattice, cold
    for r in range(3):
        for col_ in range(4):
            x = W / 2 - 33 + col_ * 22; y = H / 2 - 22 + r * 22
            c.ring(x, y, 8, COLD, 1.2)
    return W / 2, H / 2

def m16(c, P):  # The Rupture — detonation
    for i in range(12):
        a = i / 12 * math.tau
        c.line(W / 2 + math.cos(a) * 14, H / 2 + math.sin(a) * 14, W / 2 + math.cos(a) * 64, H / 2 + math.sin(a) * 64, HOT, 1.0)
    c.glow(W / 2, H / 2, 30, (255, 240, 200), 0.8); return W / 2, H / 2

def m17(c, P):  # The Opening — aperture of new light
    c.glow(W / 2, H / 2, 18, P["light"], 0.9); c.line(W / 2, H / 2 - 30, W / 2, H / 2 + 30, P["light"], 3.0)
    c.glow(W / 2, H / 2, 40, P["glow"], 0.35); return W / 2, H / 2

def m18(c, P):  # The Veil — teeming, obscured
    import random
    rnd = random.Random(18)
    for _ in range(20):
        x = rnd.uniform(40, W - 40); y = rnd.uniform(60, H - 60)
        c.disc(x, y, 3, sh(P["glow"], -0.3)); c.disc(x + 4, y + 3, 2, sh(P["g2"], 0.2))  # doubtful double
    c.glow(W / 2, H / 2, 70, sh(P["g2"], 0.1), 0.4); return W / 2, H / 2

def m19(c, P):  # The Logos — radiant I, lit from within
    _I(c, P, W / 2, H / 2, 1.5, col=P["light"]); return W / 2, H / 2

def m20(c, P):  # The Summons — strata stirring upward
    for i, yy in enumerate((H * 0.82, H * 0.72, H * 0.62)):
        c.line(20, yy, W - 20, yy, sh(P["glow"], -0.1 * i), 1.2)
    for dx in (-30, -8, 14, 32):
        c.line(W / 2 + dx, H * 0.62, W / 2 + dx, H * 0.4, sh(P["glow"], 0.0), 0.8)  # rising
    return W / 2, H * 0.5

def m21(c, P):  # The Spoken World — many forms resolving into one whole
    import random
    rnd = random.Random(21)
    for _ in range(22):
        a = rnd.uniform(0, math.tau); r = rnd.uniform(30, 78)
        c.disc(W / 2 + math.cos(a) * r, H / 2 + math.sin(a) * r * 1.1, 2.4, sh(P["glow"], 0.0))
    c.ring(W / 2, H / 2, 18, P["light"], 1.6); c.glow(W / 2, H / 2, 34, P["glow"], 0.5); return W / 2, H / 2


MAJORS = {f"major-{i}": fn for i, fn in enumerate(
    [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21])}
