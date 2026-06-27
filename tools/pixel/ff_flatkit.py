"""
Flat pixel toolkit — for the two FF creature directions (chibi + 16-bit). NO soft gradient shading;
everything is flat fills, hard outlines, and deliberate tonal clusters, the way real pixel art works.
"""
from pixelkit import Canvas, shade
import ff_elements as E
import math

W, H = 80, 120
OUT = (30, 26, 34)   # bold near-black outline for the chibi direction


def _thick(c, x1, y1, x2, y2, r, col):
    n = max(1, int(math.hypot(x2 - x1, y2 - y1)))
    for i in range(n + 1):
        t = i / n
        c.disc(round(x1 + (x2 - x1) * t), round(y1 + (y2 - y1) * t), r, col)


def blade(c, x0, y0, x1, y1, w, col, line):
    """A knife blade: a capsule that tapers from width w at the base to a point at the tip."""
    n = max(1, int(math.hypot(x1 - x0, y1 - y0)))
    for pa in (line, col):
        for i in range(n + 1):
            t = i / n
            r = max(0.0, (w * (1 - t)) / 2) + (0.7 if pa is line else 0)
            c.disc(round(x0 + (x1 - x0) * t), round(y0 + (y1 - y0) * t), r, pa)


def capsule(c, pts, r, fill, line):
    """A rounded, bendable limb: an outlined thick polyline through pts (sausage segments + round joints)."""
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        _thick(c, x1, y1, x2, y2, r + 1, line)
    for x, y in pts:
        c.disc(round(x), round(y), r + 1, line)
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        _thick(c, x1, y1, x2, y2, r, fill)
    for x, y in pts:
        c.disc(round(x), round(y), r, fill)


def fe(c, cx, cy, rx, ry, col, a=255):
    """flat filled ellipse (single color, no shading)."""
    cx, cy, rx, ry = round(cx), round(cy), max(1, rx), max(1, ry)
    for yy in range(-ry - 1, ry + 2):
        for xx in range(-rx - 1, rx + 2):
            if (xx / rx) ** 2 + (yy / ry) ** 2 <= 1.0:
                c.set(cx + xx, cy + yy, col, a)


def fblob(c, cx, cy, rx, ry, fill, line, lw=1):
    """flat ellipse with an outline of weight lw."""
    fe(c, cx, cy, rx + lw, ry + lw, line)
    fe(c, cx, cy, rx, ry, fill)


def frect(c, x, y, w, h, fill, line=None, lw=1):
    if line:
        c.rect(x - lw, y - lw, w + 2 * lw, h + 2 * lw, line)
    c.rect(x, y, w, h, fill)


def eye(c, cx, cy, r, look=0, dn=1, white=(252, 252, 255), pupil=(24, 20, 28)):
    """a big chibi eye: outline, white, low pupil, glint."""
    c.disc(cx, cy, r, OUT)
    c.disc(cx, cy, r - 1, white)
    c.disc(cx + look, cy + dn, max(1, r - 2), pupil)
    c.set(cx - 1 + look, cy - 1 + dn, white)


def cel(c, cx, cy, rx, ry, col):
    """one flat highlight patch (cel-shade), upper-left."""
    fe(c, cx, cy, rx, ry, col)


# ── flatter, retro backdrop: hard color bands + a chunky dither seam ─────────────
def flat_backdrop(c, el, hy=88):
    p = E.ELEMENTS[el]
    c.rect(0, 0, W, hy // 2, p["sky_top"])
    c.rect(0, hy // 2, W, hy - hy // 2, p["sky_bot"])
    c.dither_rect(0, hy // 2 - 5, W, 10, p["sky_bot"], 0.5)        # banded sky transition
    c.rect(0, hy, W, H - hy, p["ground"])
    c.dither_rect(0, hy - 4, W, 8, p["ground"], 0.5)              # horizon seam
    # element cue as a flat horizon glow BAND (never a box behind the subject)
    if el in ("fire", "holy", "dark", "thunder", "water"):
        c.rect(0, hy - 5, W, 5, shade(p["glow"], -0.05))
        c.dither_rect(0, hy - 11, W, 7, p["glow"], 0.4)
        if el in ("fire", "holy", "dark"):
            c.disc(W // 2, hy, 9, p["glow"])                      # a low flat sun
    elif el == "wind":
        for k in range(5):
            c.dither_rect(0, 14 + k * 13, W, 2, p["stone_lt"], 0.5)
    elif el == "ice":
        c.dither_rect(0, 0, W, hy, p["bright"], 0.05)
    elif el == "earth":
        c.dither_rect(0, hy, W, H - hy, p["stone_dk"], 0.12)


def contact(c, cx, feet, el, w=14):
    p = E.ELEMENTS[el]
    fe(c, cx, feet + 3, w, 3, p["ink"], a=90)
