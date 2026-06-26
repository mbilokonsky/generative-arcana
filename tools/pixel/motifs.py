"""
Shared pixel motifs for the Ulysses "Vico" pack — the vocabulary distilled from the 21 majors so the
four suit packs stay consistent. Import these in suit modules:  from motifs import *

Conventions: every motif draws in a passed-in age palette `p` (a dict from pixelkit.AGES), uses
`shade()` for light/shadow tiers, and assumes light from the upper-left. Canvas is 80x120 logical.
"""
import math
from pixelkit import Canvas, AGES, shade  # re-exported for convenience

W, H = 80, 120


# ── figures & crowds ──────────────────────────────────────────────────────────
def figure(c, x, feet, h, col, a=255):
    """A proportioned standing silhouette: center x, bottom y, total height h."""
    head_r = max(1, round(h * 0.12))
    head_cy = feet - h + head_r
    c.disc(x, head_cy, head_r, col, a)
    body_top = head_cy + head_r
    body_bot = feet - round(h * 0.34)
    bw = max(1, round(h * 0.15))
    c.rect(x - bw, body_top, 2 * bw + 1, body_bot - body_top, col, a)
    legw = max(1, round(h * 0.08))
    c.rect(x - bw, body_bot, legw, feet - body_bot, col, a)
    c.rect(x + bw - legw + 1, body_bot, legw, feet - body_bot, col, a)


def crowd(c, cx, base, n, h, col, spread=6, a=255):
    for i in range(n):
        figure(c, round(cx + (i - (n - 1) / 2) * spread), base, h, col, a)


# ── architecture ──────────────────────────────────────────────────────────────
def building(c, x, ybase, w, h, pal, win=True):
    for i in range(w):
        c.vline(x + i, ybase - h, ybase, shade(pal["stone"], 0.18 - 0.5 * (i / max(1, w - 1))))
    if win:
        for wy in range(ybase - h + 3, ybase - 5, 6):
            for wx in range(x + 2, x + w - 3, 4):
                c.set(wx, wy, pal["ink"]); c.set(wx, wy + 1, pal["ink"])


def tower(c, x, ybase, w, h, pal, crenellate=True, door=True):
    """A Martello-style cylinder (lit-left), optional crenellations + doorway. The Towers suit core."""
    top = ybase - h
    for i in range(w):
        c.vline(x + i, top, ybase, shade(pal["stone"], 0.35 - 0.7 * (i / max(1, w - 1))))
    if crenellate:
        for i in range(0, w, max(3, w // 4)):
            c.rect(x + i, top - 4, max(2, w // 7), 4, pal["stone_lt"] if i < w / 2 else pal["stone_dk"])
    c.hline(x, x + w - 1, top, pal["stone_lt"])
    if door:
        c.rect(x + w // 2 - 2, ybase - 12, 5, 12, pal["ink"])
        c.rect(x + w // 2 - 1, top + 8, 2, 4, pal["ink"])


def column(c, x, ybase, h, pal):
    c.rect(x, ybase - h, 8, h, pal["stone"])
    c.rect(x - 2, ybase - h, 12, 3, pal["stone_lt"])   # capital
    c.rect(x - 2, ybase - 3, 12, 3, pal["stone_dk"])   # base
    for fy in range(ybase - h + 4, ybase - 4, 3):
        c.vline(x + 3, fy, fy + 1, shade(pal["stone"], -0.15))


def headstone(c, x, ybase, h, pal):
    c.rect(x, ybase - h, 5, h, shade(pal["stone"], -0.1))
    c.rect(x, ybase - h, 5, 2, shade(pal["stone"], 0.2))
    c.set(x + 2, ybase - h - 1, shade(pal["stone"], 0.2))


# ── suit cores: key, net, organ ───────────────────────────────────────────────
def key(c, x, y, pal, h=15):
    """A tumbling key — the Keys suit core. bow + shaft + bit."""
    c.ring(x, y, 3, pal["accent"]); c.set(x, y, pal["bright"])
    c.vline(x, y + 3, y + h, pal["accent"])
    c.hline(x, x + 3, y + h, pal["accent"]); c.hline(x, x + 2, y + h - 3, pal["accent"])


def net(c, x, y, w, h, pal, a=200, step=4):
    """A diamond mesh — the Nets suit core (entanglement)."""
    for gy in range(0, h, step):
        for gx in range(0, w, step):
            c.line(x + gx, y + gy, x + gx + step, y + gy + step, pal["stone_lt"], a)
            c.line(x + gx + step, y + gy, x + gx, y + gy + step, pal["stone_lt"], a)


def organ(c, cx, cy, rx, ry, col, notch=True):
    """A kidney/bean — the Kidneys suit core (the body, nourishment)."""
    for yy in range(-ry, ry + 1):
        for xx in range(-rx, rx + 1):
            if (xx / rx) ** 2 + (yy / ry) ** 2 <= 1:
                if notch and (xx) ** 2 + (yy + ry) ** 2 <= (ry * 0.7) ** 2:
                    continue
                c.set(cx + xx, cy + yy, col)


# ── light & sky ───────────────────────────────────────────────────────────────
def lamp(c, x, y, pal, r=12, strength=0.7):
    c.glow(x, y, r, pal["ember"], strength); c.rect(x - 1, y - 4, 2, 3, pal["accent"])


def starfield(c, x, y, w, h, pal, density=0.06, seed=1):
    c.scatter(x, y, w, h, pal["bright"], density, seed=seed, a=210)


def sky(c, pal, h=84, top="sky_top", bot="sky_bot"):
    c.vgrad(0, 0, W, h, pal[top], pal[bot])
