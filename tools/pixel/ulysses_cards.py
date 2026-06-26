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


def crowd(c, cx, base, n, h, col, spread=6, a=255):
    """A row of small equal figures — the civic/ordinary register."""
    for i in range(n):
        figure(c, round(cx + (i - (n - 1) / 2) * spread), base, h, col, a)


def building(c, x, ybase, w, h, pal, win=True):
    """A shaded block (lit-left), optional lit windows."""
    for i in range(w):
        c.vline(x + i, ybase - h, ybase, shade(pal["stone"], 0.18 - 0.5 * (i / max(1, w - 1))))
    if win:
        for wy in range(ybase - h + 3, ybase - 5, 6):
            for wx in range(x + 2, x + w - 3, 4):
                c.set(wx, wy, pal["ink"]); c.set(wx, wy + 1, pal["ink"])


def headstone(c, x, ybase, h, pal):
    c.rect(x, ybase - h, 5, h, shade(pal["stone"], -0.1))
    c.rect(x, ybase - h, 5, 2, shade(pal["stone"], 0.2))
    c.set(x + 2, ybase - h - 1, shade(pal["stone"], 0.2))  # cross nub


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


# ── major-4 Calypso — Age of Gods ─────────────────────────────────────────────
def calypso():
    p = AGES["gods"]; c = Canvas(bg=p["ink"])
    c.rect(0, 0, W, 86, shade(p["stone_dk"], -0.15)); c.rect(0, 86, W, H-86, p["ink"])
    c.hline(0, W-1, 86, shade(p["stone_dk"], 0.1))
    c.rect(52, 8, 20, 22, p["ink"]); c.rect(54, 10, 16, 18, p["sky_bot"])      # window
    c.scatter(54, 10, 16, 18, p["accent"], 0.18, seed=4, a=130)                # charged dawn
    c.vline(62, 10, 27, p["ink"]); c.hline(54, 69, 19, p["ink"])
    c.rect(16, 58, 26, 12, p["stone_dk"])                                      # stove
    c.glow(29, 60, 11, p["ember"], 0.95)                                       # the small sacred fire
    c.rect(24, 55, 12, 4, p["ink"]); c.disc(29, 56, 2, p["ember"])             # pan + kidney
    c.rect(46, 64, 7, 4, p["figure"]); c.set(46, 62, p["figure"]); c.set(52, 62, p["figure"]); c.vline(53, 60, 64, p["figure"])  # cat
    figure(c, 30, 86, 20, p["figure"])
    c.vignette(0.5)
    return c


# ── major-5 Lotus Eaters — Age of Heroes ──────────────────────────────────────
def lotus_eaters():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["horizon"])
    c.glow(40, 64, 42, p["bright"], 0.3)
    for (fx, fy) in [(18, 84), (60, 92), (34, 98), (66, 72), (12, 66)]:                # lotus blooms
        c.disc(fx, fy, 3, p["accent"]); c.disc(fx, fy, 1, p["bright"])
        for a8 in range(8):
            c.set(fx+round(4*math.cos(a8*math.pi/4)), fy+round(4*math.sin(a8*math.pi/4)), p["ember"], 170)
    c.rect(24, 92, 32, 5, p["figure"]); c.disc(56, 90, 4, p["figure"])                  # reclining drifter
    c.scatter(20, 28, 44, 44, p["bright"], 0.05, seed=8, a=120, falloff=1.0)            # narcotic motes
    c.vignette(0.4)
    return c


# ── major-6 Hades — Age of Men ────────────────────────────────────────────────
def hades():
    p = AGES["men"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 70, p["sky_top"], p["sky_bot"])                                    # overcast
    c.rect(0, 70, W, H-70, shade(p["ground"], -0.1)); c.hline(0, W-1, 70, shade(p["ground"], 0.1))
    for (hx, hb, hh) in [(8, 80, 8), (20, 80, 8), (64, 82, 9), (54, 82, 9), (70, 94, 12), (8, 96, 12)]:
        headstone(c, hx, hb, hh, p)
    c.rect(30, 92, 16, 5, p["ink"])                                                     # open grave
    crowd(c, 38, 90, 4, 10, p["figure"], spread=5)
    c.vignette(0.25)
    return c


# ── major-7 Aeolus — The Ricorso ──────────────────────────────────────────────
def aeolus():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["stone"])
    c.rect(0, 86, W, H-86, p["ground"]); building(c, 8, 86, 22, 30, p)                  # the press
    for i, (sx, sy) in enumerate([(34, 28), (44, 44), (54, 24), (62, 52), (48, 64), (68, 36)]):
        c.rect(sx, sy, 7, 5, p["bright"]); c.hline(sx+1, sx+5, sy+2, p["ink"], 200)     # headline sheets
        c.scatter(sx+4, sy, 9, 6, p["bright"], 0.3, seed=i+1, a=120)                    # torn into wind
    for wy in (34, 48, 60):
        c.hline(24, 74, wy, p["stone_lt"], 60)
    c.vignette(0.4, col=p["ink"])
    return c


# ── major-8 Lestrygonians — Age of Gods ───────────────────────────────────────
def lestrygonians():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["ink"], p["stone_dk"])
    c.scatter(0, 0, W, 44, p["ink"], 0.4, seed=12, falloff=1.0)
    for (mx, my, mw) in [(20, 40, 10), (58, 34, 9), (40, 56, 12), (66, 60, 8), (16, 66, 8)]:  # devouring maws
        c.disc(mx, my, mw//2, p["ink"]); c.ring(mx, my, mw//2, p["ember"], 160)
        c.hline(mx-mw//3, mx+mw//3, my, p["ember"], 200)
    figure(c, 40, 96, 20, p["figure"]); c.glow(40, 84, 8, p["accent"], 0.3)             # the moderate passer
    c.vignette(0.55)
    return c


# ── major-9 Scylla and Charybdis — Age of Heroes ──────────────────────────────
def scylla():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["horizon"])
    for yy in range(40, H):                                                             # the rock
        c.hline(0, (yy-40)//3, yy, shade(p["stone"], -0.2))
    for r in range(2, 16, 2):                                                           # the whirlpool
        c.ring(66, 80, r, shade(p["stone_dk"], 0.08*(r//2)), 180)
    c.rect(36, 30, 8, 56, p["stone"]); c.rect(34, 28, 12, 3, p["stone_lt"]); c.rect(34, 84, 12, 3, p["stone_dk"])  # column
    c.disc(40, 24, 4, p["stone_lt"])                                                    # bust (the intellect)
    figure(c, 52, 96, 15, p["figure"])
    c.vignette(0.4)
    return c


# ── major-10 Wandering Rocks — Age of Men ─────────────────────────────────────
def wandering_rocks():
    p = AGES["men"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 40, p["sky_top"], p["sky_bot"]); c.rect(0, 40, W, H-40, p["ground"])
    for (bx, bw, bh) in [(2, 14, 26), (18, 10, 18), (30, 16, 30), (48, 10, 20), (60, 18, 28)]:
        building(c, bx, 56, bw, bh, p)
    c.rect(0, 56, W, 8, shade(p["ground"], 0.08))                                       # street
    crowd(c, 40, 66, 9, 7, p["figure"], spread=8)
    c.rect(30, 62, 8, 4, p["accent"]); c.disc(31, 66, 1, p["ink"]); c.disc(37, 66, 1, p["ink"])  # cavalcade
    crowd(c, 24, 78, 5, 6, p["figure"], spread=10)
    c.vignette(0.2)
    return c


# ── major-11 Sirens — The Ricorso ─────────────────────────────────────────────
def sirens():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["stone"])
    c.rect(0, 88, W, H-88, p["ground"]); c.rect(0, 84, W, 4, shade(p["ground"], 0.15))  # bar
    figure(c, 24, 88, 16, p["figure"]); figure(c, 40, 88, 16, p["figure"])              # barmaids
    for i, (nx, ny) in enumerate([(50, 70), (58, 60), (64, 48), (70, 38), (54, 52)]):   # notes dissolving
        c.disc(nx, ny, 2, p["accent"]); c.vline(nx+2, ny-6, ny, p["accent"])
        c.scatter(nx, ny-4, 8, 8, p["bright"], 0.25, seed=i+3, a=110)
    for r in (10, 18, 26):
        c.ring(20, 78, r, p["stone_lt"], 70)
    c.vignette(0.4, col=p["ink"])
    return c


# ── major-12 Cyclops — Age of Gods ────────────────────────────────────────────
def cyclops():
    p = AGES["gods"]; c = Canvas(bg=p["ink"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["ink"]); c.scatter(0, 0, W, 30, p["ink"], 0.4, seed=13, falloff=1.0)
    c.disc(40, 54, 30, shade(p["ink"], 0.15)); c.rect(16, 54, 48, 40, shade(p["ink"], 0.1))   # the giant
    c.glow(40, 44, 13, p["ember"], 0.9)                                                 # the single eye
    c.disc(40, 44, 5, p["ink"]); c.disc(40, 44, 3, p["ember"]); c.disc(40, 44, 1, p["bright"])
    c.rect(62, 30, 5, 4, p["accent"])                                                   # thrown biscuit-tin
    for t in range(6):
        c.set(60-t*2, 30+t, p["accent"], 150)
    figure(c, 70, 96, 12, p["figure"])                                                  # Bloom fleeing
    c.vignette(0.5)
    return c


# ── major-13 Nausicaa — Age of Heroes ─────────────────────────────────────────
def nausicaa():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 86, p["sky_top"], p["horizon"])
    c.rect(0, 78, W, 8, shade(p["stone"], -0.1)); c.rect(0, 86, W, H-86, p["ground"])   # sea + strand
    for (fx, fy, fr, col) in [(56, 24, 9, p["accent"]), (24, 34, 6, p["ember"]), (66, 42, 5, p["bright"])]:  # fireworks
        for a16 in range(16):
            c.line(fx, fy, fx+round(fr*math.cos(a16*math.pi/8)), fy+round(fr*math.sin(a16*math.pi/8)), col, 200)
        c.disc(fx, fy, 1, p["bright"])
    c.rect(8, 80, 12, 6, shade(p["stone"], -0.2))                                       # rock
    figure(c, 14, 80, 14, p["figure"]); c.glow(14, 70, 8, p["bright"], 0.25)            # Gerty, romantic aura
    c.vignette(0.4)
    return c


# ── major-14 Oxen of the Sun — Age of Men ─────────────────────────────────────
def oxen():
    p = AGES["men"]; c = Canvas(bg=p["stone"])
    c.rect(0, 0, W, 88, p["stone"]); c.rect(0, 88, W, H-88, p["stone_dk"]); c.hline(0, W-1, 88, shade(p["stone_dk"], 0.2))
    c.glow(40, 24, 16, p["bright"], 0.5); c.disc(40, 22, 3, p["bright"]); c.vline(40, 8, 19, p["ink"])   # lamp
    c.rect(20, 70, 34, 12, shade(p["stone"], -0.25)); c.rect(18, 66, 7, 16, shade(p["stone"], -0.3))     # bed + headboard
    c.rect(24, 66, 12, 5, p["bright"]); c.rect(28, 72, 22, 7, shade(p["ember"], -0.15))                  # pillow + blanket
    c.glow(33, 74, 5, p["bright"], 0.6)                                                 # the newborn
    crowd(c, 60, 88, 3, 11, p["figure"], spread=6); figure(c, 12, 88, 13, p["figure"])  # students + Bloom
    c.vignette(0.2)
    return c


# ── major-15 Circe — The Ricorso ──────────────────────────────────────────────
def circe():
    p = AGES["ricorso"]; c = Canvas(bg=p["ink"])
    c.vgrad(0, 0, W, H, p["ink"], shade(p["ember"], -0.35))                             # red-dark night
    c.glow(40, 52, 42, p["ember"], 0.5); c.scatter(0, 0, W, H, p["ember"], 0.08, seed=15, a=90)
    for (hx, hy, hh) in [(18, 70, 18), (60, 66, 16), (40, 60, 22)]:                     # melting figures
        figure(c, hx, hy, hh, shade(p["ink"], 0.2)); c.scatter(hx-5, hy-hh, 11, hh, p["ember"], 0.4, seed=hx, a=120)
    c.disc(40, 28, 6, p["bright"], 120)                                                 # the rising dead mother
    for j in range(14):
        c.hline(36, 44, 30+j, p["bright"], max(0, 120-j*8))
    for (ex, ey) in [(12, 40), (68, 44), (30, 34), (52, 26)]:                           # eyes in the dark
        c.set(ex, ey, p["bright"], 200); c.set(ex+2, ey, p["bright"], 200)
    c.vignette(0.55, col=p["ink"])
    return c


# ── major-16 Eumaeus — Age of Gods ────────────────────────────────────────────
def eumaeus():
    p = AGES["gods"]; c = Canvas(bg=p["ink"])
    c.vgrad(0, 0, W, 60, p["sky_top"], p["ink"]); c.scatter(0, 0, W, 30, p["ink"], 0.45, seed=16, falloff=1.0)
    c.set(20, 14, p["bright"], 120); c.set(60, 10, p["bright"], 90)                     # faint stars
    c.rect(0, 86, W, H-86, p["ink"]); c.rect(18, 58, 44, 30, shade(p["stone_dk"], -0.1)); c.rect(16, 56, 48, 3, p["stone_dk"])  # shelter
    c.glow(40, 70, 12, p["ember"], 0.7); c.rect(39, 66, 2, 3, p["accent"])              # lamp
    c.rect(30, 76, 20, 3, p["ink"]); figure(c, 28, 76, 12, p["figure"]); figure(c, 50, 76, 12, p["figure"])  # two tired men at a table
    c.vignette(0.6)
    return c


# ── major-17 Ithaca — Age of Heroes ───────────────────────────────────────────
def ithaca():
    p = AGES["heroes"]; c = Canvas(bg=(14, 12, 30))
    c.vgrad(0, 0, W, H, (14, 12, 30), p["sky_top"])
    c.scatter(0, 0, W, 84, p["bright"], 0.06, seed=17, a=220); c.scatter(0, 0, W, 50, p["accent"], 0.03, seed=18, a=200)  # heaventree
    c.rect(0, 92, W, H-92, p["ground"]); building(c, 26, 92, 28, 22, p)                 # the house
    c.rect(36, 84, 8, 8, p["ink"]); c.glow(46, 84, 5, p["accent"], 0.5)                 # door + lit window/cocoa
    figure(c, 14, 92, 12, p["figure"]); figure(c, 64, 92, 12, p["figure"])             # two under the stars
    c.vignette(0.45)
    return c


# ── major-18 Penelope — Age of Men ────────────────────────────────────────────
def penelope():
    p = AGES["men"]; c = Canvas(bg=p["stone"])
    c.rect(0, 0, W, 90, shade(p["stone"], -0.08)); c.rect(0, 90, W, H-90, p["stone_dk"])
    c.hline(0, W-1, 90, shade(p["stone_dk"], 0.15))
    c.rect(50, 12, 22, 26, p["stone_dk"]); c.vgrad(52, 14, 18, 22, p["accent"], p["bright"])  # window, common dawn
    c.vline(61, 14, 35, p["stone_dk"]); c.hline(52, 69, 25, p["stone_dk"])
    c.rect(20, 16, 14, 16, shade(p["stone"], -0.2)); c.rect(22, 18, 10, 12, shade(p["accent"], -0.3))  # framed portrait
    c.rect(6, 66, 60, 24, shade(p["stone"], -0.22)); c.rect(4, 60, 9, 30, shade(p["stone"], -0.28))    # bed + headboard
    c.rect(10, 60, 18, 8, p["bright"])                                                   # pillow
    for i in range(46):                                                                  # the reclining body, a warm mound
        c.vline(20+i, 78 - round(5*math.sin(i/46*math.pi)), 88, shade(p["ember"], -0.08))
    c.disc(20, 64, 5, p["figure"])                                                       # Molly's head
    c.glow(61, 26, 12, p["bright"], 0.3)                                                 # the dawning yes
    c.vignette(0.2)
    return c


# ── major-19 Trieste-Zurich-Paris — The Ricorso ───────────────────────────────
def trieste_zurich_paris():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["stone"])
    for (bx, base, seed) in [(4, 70, 19), (30, 80, 20), (56, 90, 21)]:                  # three skylines into fog
        for (ox, bw, bh) in [(0, 8, 16), (9, 6, 22), (16, 9, 14), (24, 6, 20)]:
            building(c, bx+ox, base, bw, bh, p, win=False)
        c.scatter(bx, base-24, 30, 26, p["sky_top"], 0.3, seed=seed, a=120)
    for yy in range(96, H):                                                             # a river threading through
        c.hline(0, W-1, yy, shade(p["stone_lt"], -0.1)); c.scatter(0, yy, W, 1, p["bright"], 0.2, seed=yy, a=90)
    c.scatter(0, 0, W, H, p["sky_top"], 0.12, seed=22, a=90)
    c.vignette(0.45, col=p["ink"])
    return c


# ── major-20 Riverrun — Age of Gods ───────────────────────────────────────────
def riverrun():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 70, p["sky_top"], p["sky_bot"]); c.scatter(0, 0, W, 36, p["ink"], 0.5, seed=20, falloff=1.0)
    for (a, b) in [((30, 4), (34, 24)), ((34, 24), (28, 40)), ((28, 40), (36, 58))]:    # the thunderword
        c.line(*a, *b, p["accent"]); c.line(a[0]+1, a[1], b[0]+1, b[1], p["bright"])
    c.rect(0, 70, W, H-70, p["stone_dk"])                                               # the great river
    for yy in range(70, H):
        c.hline(0, W-1, yy, shade(p["stone"], -0.1+0.2*((yy-70)/(H-70))))
        c.scatter(0, yy, W, 1, p["stone_lt"], 0.35, seed=yy+1, a=150)
    for r in range(2, 14, 2):
        c.ring(40, 92, r, p["stone_lt"], 120)                                           # the recirculating eddy
    c.glow(33, 58, 8, p["accent"], 0.5)                                                 # bolt meets river
    c.vignette(0.5)
    return c


# slug -> recipe. Majors complete (21); minors next, seeded from these patterns.
CARDS = {
    "major-0": forger, "major-1": telemachus, "major-2": nestor, "major-3": proteus,
    "major-4": calypso, "major-5": lotus_eaters, "major-6": hades, "major-7": aeolus,
    "major-8": lestrygonians, "major-9": scylla, "major-10": wandering_rocks,
    "major-11": sirens, "major-12": cyclops, "major-13": nausicaa, "major-14": oxen,
    "major-15": circe, "major-16": eumaeus, "major-17": ithaca, "major-18": penelope,
    "major-19": trieste_zurich_paris, "major-20": riverrun,
}
