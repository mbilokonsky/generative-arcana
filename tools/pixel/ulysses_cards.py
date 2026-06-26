"""
Ulysses "Vico" pixel pack — per-card composition recipes.

Each card composes a Joycean subject inside its Vico age's palette + light, so the pack reads as
the cycle of history running under the day. A card's age is its station from the deck's Vico walk
(major_number mod 4): gods / heroes / men / ricorso.

Add a recipe, point CARDS at it, run build.py. Authoring loop: render -> look -> refine.
"""
import math
from pixelkit import Canvas, AGES, shade

W, H = 80, 120


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


# ── major-0 Forger — Age of Gods ──────────────────────────────────────────────
def forger():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 84, p["sky_top"], p["sky_bot"])
    c.scatter(0, 2, W, 40, p["ink"], 0.55, seed=11, falloff=0.9)
    c.scatter(0, 0, W, 30, p["stone_dk"], 0.4, seed=23, falloff=1.0, a=200)
    bolt = [(41, 4), (35, 24), (45, 30), (38, 50), (46, 64), (46, 88)]
    for i in range(len(bolt) - 1):
        c.line(*bolt[i], *bolt[i+1], p["accent"])
        c.line(bolt[i][0], bolt[i][1], bolt[i+1][0], bolt[i+1][1], p["bright"])
    c.line(38, 50, 28, 66, p["accent"]); c.line(38, 50, 29, 66, p["bright"])
    c.glow(46, 86, 16, p["accent"], 0.4)
    c.rect(0, 84, W, H-84, p["ground"])
    c.scatter(0, 80, W, 8, p["ink"], 0.5, seed=7, falloff=1.0)
    c.glow(46, 90, 13, p["ember"], 0.95)
    c.rect(42, 88, 9, 4, p["ink"]); c.rect(40, 91, 13, 3, p["ink"])
    figure(c, 31, 95, 22, p["figure"])
    c.line(35, 84, 40, 80, p["figure"]); c.rect(39, 78, 3, 3, p["ink"])
    for yy in range(80, 95):
        c.set(35, yy, p["ember"], 150)
    c.vignette(0.55)
    return c


# ── major-1 Telemachus — Age of Heroes ────────────────────────────────────────
def telemachus():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 84, p["sky_top"], p["horizon"])
    c.glow(64, 26, 18, p["bright"], 0.4)
    c.disc(64, 26, 6, p["bright"]); c.disc(64, 26, 6, p["accent"], 110)
    c.rect(0, 84, W, H-84, p["ground"])
    c.hline(0, W-1, 84, shade(p["ground"], 0.15))
    for i in range(40):
        c.hline(8-i//3, 30 - i//4, 86+i, p["ink"], 120)
    tx, tw, ttop, tbot = 24, 22, 40, 86
    for i in range(tw):
        f = i/(tw-1)
        c.vline(tx+i, ttop, tbot, shade(p["stone"], 0.35 - 0.7*f))
    for i in range(0, tw, 6):
        c.rect(tx+i, ttop-4, 3, 4, p["stone_lt"] if i < tw/2 else p["stone_dk"])
    c.hline(tx, tx+tw-1, ttop, p["stone_lt"])
    c.rect(tx+tw//2-2, tbot-12, 5, 12, p["ink"])
    c.rect(tx+tw//2-1, ttop+8, 2, 4, p["ink"])
    kx, ky = 13, 40
    c.ring(kx, ky, 3, p["accent"]); c.set(kx, ky, p["bright"])
    c.vline(kx, ky+3, ky+12, p["accent"])
    c.hline(kx, kx+3, ky+12, p["accent"]); c.hline(kx, kx+2, ky+9, p["accent"])
    figure(c, tx+tw+9, 86, 13, p["figure"])
    c.vignette(0.4)
    return c


# ── major-2 Nestor — Age of Men ───────────────────────────────────────────────
def nestor():
    p = AGES["men"]; c = Canvas(bg=p["sky_bot"])
    c.rect(0, 0, W, 84, p["stone"])
    c.rect(0, 84, W, H-84, p["stone_dk"])
    c.hline(0, W-1, 84, shade(p["stone_dk"], 0.25))
    for vx in (16, 40, 64):
        c.vline(vx, 84, H-1, shade(p["stone_dk"], 0.12))
    c.rect(6, 12, 18, 24, shade(p["stone_dk"], -0.2))
    c.rect(8, 14, 14, 20, p["bright"])
    c.vline(15, 14, 33, shade(p["stone_dk"], -0.1)); c.hline(8, 21, 24, shade(p["stone_dk"], -0.1))
    c.rect(36, 10, 38, 24, shade(p["ink"], 0.12))
    for yy, xs in [(16, (40, 60)), (21, (40, 68)), (26, (40, 54)), (30, (58, 70))]:
        c.hline(xs[0], xs[1], yy, shade(p["bright"], -0.08), 200)
    c.line(40, 33, 70, 33, p["accent"], 160)
    c.disc(31, 16, 3, p["bright"]); c.ring(31, 16, 3, p["ink"]); c.set(31, 14, p["ink"]); c.set(32, 16, p["ink"])
    figure(c, 70, 84, 15, p["figure"])
    for dx in (10, 28, 46):
        c.rect(dx, 74, 14, 5, shade(p["stone"], -0.35))
        c.rect(dx+2, 79, 2, 5, shade(p["stone"], -0.4)); c.rect(dx+10, 79, 2, 5, shade(p["stone"], -0.4))
        figure(c, dx+4, 74, 9, p["figure"]); figure(c, dx+10, 74, 9, p["figure"])
    c.rect(60, 78, 12, 4, shade(p["stone"], -0.35))
    for cx in (62, 65, 68):
        c.disc(cx, 77, 1, p["accent"])
    c.vignette(0.16)
    return c


# ── major-3 Proteus — The Ricorso ─────────────────────────────────────────────
def proteus():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 58, p["sky_top"], p["horizon"])
    c.glow(40, 56, 34, p["horizon"], 0.45)
    for t in range(0, 28):
        ang = math.radians(190 + t*7)
        c.set(40 + 18*math.cos(ang), 46 + 9*math.sin(ang), p["stone_lt"], 70)
    c.scatter(20, 30, 40, 24, p["horizon"], 0.25, seed=5, a=70)
    c.scatter(0, 48, W, 16, p["bright"], 0.4, seed=31, a=110, falloff=0.6)
    sea_top = 58
    c.rect(0, sea_top, W, 28, p["stone"])
    c.scatter(0, sea_top, W, 28, p["stone_lt"], 0.5, seed=17, a=160, falloff=0.85)
    c.scatter(0, sea_top, W, 28, p["horizon"], 0.16, seed=42, a=120, falloff=1.0)
    c.rect(0, 86, W, H-86, p["ground"])
    c.scatter(0, 84, W, 7, p["stone"], 0.4, seed=9)
    figure(c, 30, 88, 24, p["figure"])
    for j in range(16):
        if (j % 3) != 2:
            c.hline(27, 33, 90+j, p["figure"], max(0, 160 - j*9))
    c.scatter(23, 90, 16, 18, p["ground"], 0.5, seed=3)
    for (mx, my) in [(58, 68), (64, 58), (52, 48), (61, 42), (48, 62), (68, 50)]:
        c.set(mx, my, p["bright"], 160); c.set(mx+1, my, p["accent"], 90)
    c.scatter(0, 0, W, 10, p["sky_top"], 0.5, seed=2)
    c.vignette(0.45, col=p["ink"])
    return c


# slug -> recipe. Fill out to all 77; missing cards fall back to the p5 pack in-app.
CARDS = {
    "major-0": forger,
    "major-1": telemachus,
    "major-2": nestor,
    "major-3": proteus,
}
