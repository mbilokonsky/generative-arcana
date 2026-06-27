"""
Final Fantasy Tarot — MAJOR ARCANA 15..21 (the monomyth's dark turn and its healing).
Bespoke chibi pixel scenes, one clear iconic idea per card. Flat fills, bold OUT outlines, big eyes;
NO soft-gradient 3D. The card's `station_slug` (dark/fire/thunder/earth/holy/ice/water) sets palette
and light only (flat_backdrop + ELEMENTS colors); the meaning + detailed_description pick the scene.

  major-15 The Throne of Power (dark)  — a dark throne, chains to small bound figures; power as darkness.
  major-16 The Calamity     (fire)     — a burning mass over a cracking city, towers toppling, ash.
  major-17 The Last Light    (thunder)  — one bright star in a charged sky over ruin, one upturned face.
  major-18 The World of Ruin  (earth)    — a lone figure crossing a broken ochre plain, after-images.
  major-19 The Reunion        (holy)     — the full company together again in rising gold light, dawn.
  major-20 The Final Ascent   (ice)      — the fellowship climbing a vast spire into a freezing sky.
  major-21 The World Reborn   (water)    — green returns to a flooded healing land, figures at peace.
"""
import math
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT, W, H,
                        flat_backdrop, contact)
import ff_elements as E


# ════════════════════════════════════════════════════════════════════════════════
# reusable chibi helpers — flat, outlined, lit by the station palette
# ════════════════════════════════════════════════════════════════════════════════
def chibi_person(c, cx, feet, h, body, line=OUT, skin=None, look=0, dn=1,
                 arms="down", a=255, eyes=True):
    """A tiny chibi adventurer: big head, stubby body, two legs, two arms. h = total height.
    body = tunic color, skin = head color (default a warm tone). arms: 'down','up','wave','side'."""
    if skin is None:
        skin = (236, 200, 168)
    hr = max(3, round(h * 0.26))            # chibi head (a touch smaller for clustered groups)
    head_cy = feet - h + hr
    body_top = head_cy + hr - 1
    body_bot = feet - max(3, round(h * 0.24))
    bw = max(2, round(h * 0.17))
    # legs
    lw = max(1, bw - 1)
    c.rect(cx - bw + 1, body_bot, lw, feet - body_bot + 1, line)
    c.rect(cx + bw - lw, body_bot, lw, feet - body_bot + 1, line)
    c.set(cx - bw + 1, feet, line); c.set(cx + bw - 1, feet, line)
    # torso (tunic)
    fblob(c, cx, (body_top + body_bot) // 2, bw, (body_bot - body_top) // 2 + 1, body, line)
    # arms
    ay = body_top + 1
    if arms == "up":
        capsule(c, [(cx - bw, ay), (cx - bw - 2, ay - 5)], 1, body, line)
        capsule(c, [(cx + bw, ay), (cx + bw + 2, ay - 5)], 1, body, line)
    elif arms == "wave":
        capsule(c, [(cx - bw, ay), (cx - bw - 3, ay + 3)], 1, body, line)
        capsule(c, [(cx + bw, ay), (cx + bw + 2, ay - 5)], 1, body, line)
    elif arms == "side":
        capsule(c, [(cx - bw, ay), (cx - bw - 3, ay + 2)], 1, body, line)
        capsule(c, [(cx + bw, ay), (cx + bw + 3, ay + 2)], 1, body, line)
    else:  # down
        capsule(c, [(cx - bw, ay), (cx - bw - 1, ay + 4)], 1, body, line)
        capsule(c, [(cx + bw, ay), (cx + bw + 1, ay + 4)], 1, body, line)
    # head
    fblob(c, cx, head_cy, hr, hr, skin, line)
    if eyes:
        er = max(1, hr // 3)
        eye(c, cx - hr // 2, head_cy, er, look=look, dn=dn)
        eye(c, cx + hr // 2, head_cy + 1, er, look=look, dn=dn)
    return head_cy, hr


def silhouette(c, cx, feet, h, col, a=255, arms="down"):
    """A flat dark silhouette person (no face) — for distant / fleeing / bound figures."""
    hr = max(2, round(h * 0.30))
    head_cy = feet - h + hr
    body_top = head_cy + hr - 1
    body_bot = feet - max(2, round(h * 0.24))
    bw = max(1, round(h * 0.15))
    c.rect(cx - bw, body_bot, max(1, bw - 1), feet - body_bot + 1, col, a)
    c.rect(cx + 1, body_bot, max(1, bw - 1), feet - body_bot + 1, col, a)
    fe(c, cx, (body_top + body_bot) // 2, bw, (body_bot - body_top) // 2 + 1, col, a)
    fe(c, cx, head_cy, hr, hr, col, a)
    if arms == "up":
        c.line(cx - bw, body_top + 1, cx - bw - 2, body_top - 4, col, a)
        c.line(cx + bw, body_top + 1, cx + bw + 2, body_top - 4, col, a)
    return head_cy


def star(c, x, y, r, glow, core, line=None, rays=True):
    """A bright four-point star with a glowing halo."""
    c.glow(x, y, r * 2 + 2, glow, 0.6)
    if rays:
        L = r * 2 + 1
        for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)):
            c.line(x, y, x + dx * L, y + dy * L, glow, 200)
        for dx, dy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
            c.line(x, y, x + dx * (r + 1), y + dy * (r + 1), glow, 140)
    if line:
        c.disc(x, y, r + 1, line)
    c.disc(x, y, r, glow)
    c.disc(x, y, max(1, r - 1), core)
    c.set(x, y, (255, 255, 255))


def ruin_stub(c, x, ybase, w, h, p, tilt=0):
    """A broken half-buried column / wall stub. tilt shifts the top sideways (toppling)."""
    top = ybase - h
    for i in range(w):
        col = shade(p["stone"], 0.18 - 0.5 * (i / max(1, w - 1)))
        tx = round(x + i + tilt * (h - 0) / max(1, h))
        for yy in range(top, ybase):
            sx = round(x + i + tilt * (ybase - yy) / max(1, h))
            c.set(sx, yy, col)
    # jagged broken top
    c.hline(round(x + tilt), round(x + w - 1 + tilt), top, p["stone_lt"])
    c.set(round(x + 1 + tilt), top - 1, p["stone_lt"])


def starfield(c, x, y, w, h, col, density=0.05, seed=1):
    c.scatter(x, y, w, h, col, density, seed=seed, a=200)


def lifestream(c, x0, x1, y, p, a=200):
    """A clear glowing ribbon of green-gold water threading the land."""
    for t in range(x0, x1):
        yy = y + round(2.5 * math.sin((t - x0) * 0.32))
        c.set(t, yy, p["glow"], a)
        c.set(t, yy + 1, shade(p["glow"], 0.2), a)
        c.set(t, yy - 1, p["bright"], 120)


# ════════════════════════════════════════════════════════════════════════════════
# major-15 — The Throne of Power (dark): throne + chains to bound figures
# ════════════════════════════════════════════════════════════════════════════════
def major_15():
    st = "dark"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    # cold single source high behind the throne
    c.glow(40, 30, 16, p["glow"], 0.40)

    # ── the throne: a tall imposing chair on a stepped dais ──
    base_y = 96
    # dais steps
    for i, (dw, dy) in enumerate([(56, 0), (44, 6), (32, 12)]):
        frect(c, 40 - dw // 2, base_y - dy, dw, 6, shade(p["stone"], -0.12 - i * 0.05), p["ink"])
    seat_y = base_y - 18
    # throne back: tall slab with two crowning spikes
    frect(c, 30, seat_y - 34, 20, 38, p["stone_dk"], p["ink"])
    cel(c, 33, seat_y - 30, 2, 10, shade(p["stone"], 0.10))   # one cold rim of light, left edge
    for sx in (31, 47):
        c.line(sx, seat_y - 34, sx - (1 if sx < 40 else -1), seat_y - 44, p["ink"])
        fblob(c, sx + (0 if sx < 40 else 0), seat_y - 44, 2, 3, p["stone_dk"], p["ink"])
    # armrests + seat block
    frect(c, 27, seat_y - 6, 26, 8, p["stone"], p["ink"])
    frect(c, 26, seat_y - 2, 4, 12, p["stone_dk"], p["ink"])
    frect(c, 50, seat_y - 2, 4, 12, p["stone_dk"], p["ink"])
    # seated silhouette of authority — barely more than a shape, crowned
    sil = p["ink"]
    fe(c, 40, seat_y - 12, 7, 9, sil)            # robed body
    fe(c, 40, seat_y - 22, 5, 5, sil)            # head
    # a thin cold crown line catching light
    c.hline(36, 44, seat_y - 26, p["accent"])
    for cx2 in (36, 40, 44):
        c.set(cx2, seat_y - 27, p["accent"]); c.set(cx2, seat_y - 28, p["glow"])
    # two faint glints for eyes — authority watching
    c.set(38, seat_y - 22, p["glow"]); c.set(42, seat_y - 22, p["glow"])

    # ── chains running down from the armrests to small bound figures ──
    def chain(x0, y0, x1, y1):
        n = int(math.hypot(x1 - x0, y1 - y0) / 3)
        for i in range(n + 1):
            t = i / max(1, n)
            cxp = round(x0 + (x1 - x0) * t); cyp = round(y0 + (y1 - y0) * t)
            c.disc(cxp, cyp, 1, p["stone_lt"] if i % 2 else p["stone_dk"])
            c.set(cxp, cyp, p["accent"] if i % 2 else p["ink"])

    captives = [(13, 112), (28, 116), (52, 116), (67, 112)]
    arm = [(28, seat_y + 2), (28, seat_y + 2), (52, seat_y + 2), (52, seat_y + 2)]
    for (fx, fy), (ax, ay) in zip(captives, arm):
        chain(ax, ay, fx, fy - 9)
        # bound figure: small, slumped, head bowed
        silhouette(c, fx, fy, 13, p["figure"], arms="down")
        # a shackle ring at the head/shoulders
        c.ring(fx, fy - 9, 2, p["stone_lt"])

    E.atmosphere(c, st, 40, seat_y - 18)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-16 — The Calamity (fire): the falling burning mass over a cracking city
# ════════════════════════════════════════════════════════════════════════════════
def major_16():
    st = "fire"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    # blood-red glare washing the whole sky
    c.dither_rect(0, 0, W, 60, p["glow"], 0.18)
    c.scatter(0, 0, W, 80, p["ink"], 0.18, seed=4, a=130)        # smoke

    # ── the enormous burning mass (a meteor), upper area, blazing trail behind ──
    mx, my, mr = 42, 32, 15
    # ragged flame streaks trailing up-and-back (the meteor falls down-left).
    # Three offset wisps of fire, each thinning to sparks — NOT a tidy cone.
    import random as _r
    rng = _r.Random(16)
    for (ox, oy, ln) in [(0, 0, 13), (-3, 3, 10), (3, -3, 9)]:
        for i in range(ln):
            t = i / (ln - 1)
            jx = rng.uniform(-2, 2) * t; jy = rng.uniform(-2, 2) * t
            tx = round(mx + ox + i * 2.2 + jx); ty = round(my + oy - i * 2.2 + jy)
            rr = max(1, round((mr - 6) * (1 - t) ** 0.7))
            col = p["bright"] if t < 0.25 else (p["accent"] if t < 0.6 else p["glow"])
            c.disc(tx, ty, rr, col, 220)
    # halo of heat
    c.glow(mx, my, mr + 12, p["glow"], 0.75)
    # the molten rock body: irregular, lumpy — not a smooth disc
    fblob(c, mx, my, mr, mr - 1, shade(p["glow"], -0.15), p["ink"])
    fe(c, mx, my, mr - 2, mr - 3, p["glow"])
    fe(c, mx - 2, my - 2, mr - 6, mr - 6, p["accent"])
    fe(c, mx - 4, my - 4, mr - 10, mr - 10, p["bright"])         # white-hot core
    # surface texture: a few dark glowing-edged craters (reads as rock, not a pan)
    for (dx, dy, dr) in [(-7, 4, 3), (6, 6, 2), (3, -7, 2), (-4, -5, 2)]:
        c.disc(mx + dx, my + dy, dr, shade(p["glow"], -0.45))
        c.ring(mx + dx, my + dy, dr, p["accent"])
    # flames licking off the leading (lower-left) edge
    for (ex, ey) in [(-mr, mr - 4), (-mr + 3, mr), (-mr - 2, mr - 8)]:
        c.disc(mx + ex, my + ey, 2, p["glow"]); c.set(mx + ex, my + ey, p["bright"])

    # ── the cracking city in silhouette along the horizon, towers toppling ──
    horizon = 88
    # ground crack glowing
    c.line(0, horizon, 26, horizon - 2, p["glow"])
    c.line(26, horizon - 2, 60, horizon + 1, p["glow"])
    sky_sil = shade(p["stone_dk"], -0.35)
    # standing + leaning + falling towers
    towers = [(8, 30, 0), (18, 22, 0), (28, 40, 0.0), (40, 26, 0.0)]
    for (tx, th, tl) in towers:
        frect(c, tx, horizon - th, 7, th, sky_sil)
        c.rect(tx, horizon - th, 7, 2, shade(p["glow"], -0.2))   # lit top edge
    # a big tower toppling to the right (diagonal)
    bx, bby = 60, horizon
    for i in range(22):
        t = i / 21
        sxp = round(bx + t * 16); syp = round(bby - 22 + t * 18)
        c.disc(sxp, syp, 3, sky_sil)
    c.disc(round(bx + 16), round(bby - 4), 3, shade(p["glow"], -0.2))

    # ── small dark figures fleeing along the foreground ──
    for fx, sc in [(12, 11), (24, 13), (38, 10), (70, 12)]:
        silhouette(c, fx, 116, sc, p["ink"], arms="up")

    # rising embers / ash
    c.scatter(0, 40, W, 70, p["glow"], 0.05, seed=7, a=180)
    c.scatter(0, 0, W, H, p["stone_lt"], 0.02, seed=2, a=90)     # ash flecks

    E.atmosphere(c, st, mx, my)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-17 — The Last Light (thunder): one bright star over ruin, one upturned face
# ════════════════════════════════════════════════════════════════════════════════
def major_17():
    st = "thunder"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    c.scatter(0, 0, W, 70, p["ink"], 0.22, seed=4, a=120)        # storm dark
    starfield(c, 0, 4, W, 50, p["stone_lt"], density=0.02, seed=8)

    # ── a charged, clearing patch of sky around the star ──
    sx, sy = 40, 26
    c.glow(sx, sy, 30, p["sky_bot"], 0.5)                        # the sky clears here
    # a couple of faint, distant bolts at the edges (charge)
    c.line(10, 8, 14, 22, p["accent"], 120); c.line(14, 22, 10, 30, p["accent"], 90)
    c.line(70, 6, 66, 20, p["accent"], 120)
    # the single bright star
    star(c, sx, sy, 4, p["glow"], p["bright"], line=None)
    # a long clean beam of light coming down toward the figure
    for i in range(34):
        yy = sy + 6 + i
        ww = 1 + i // 12
        c.hline(sx - ww, sx + ww, yy, p["glow"], max(20, 150 - i * 3))

    # ── ruined land along the horizon ──
    horizon = 92
    for (rx, rw, rh, tl) in [(6, 8, 10, 0.2), (20, 6, 16, -0.1), (54, 9, 13, 0.15), (68, 6, 9, 0)]:
        ruin_stub(c, rx, horizon, rw, rh, p, tilt=tl)
    c.dither_rect(0, horizon - 2, W, 4, p["stone_dk"], 0.4)

    # ── one figure far below, kneeling, face upturned to the star, arm reaching ──
    fx, gy = 40, 110          # gy = ground line under the figure
    # a small rise of rubble the figure kneels on
    fe(c, fx, gy + 2, 12, 3, shade(p["stone"], -0.1)); fe(c, fx, gy + 1, 9, 2, p["stone"])
    # kneeling body: a low robed mass on the ground
    body = p["stone"]
    fblob(c, fx, gy - 5, 7, 6, body, OUT)                 # torso/robe pooled on ground
    fe(c, fx - 5, gy, 5, 3, body)                          # robe spread on left
    fe(c, fx + 5, gy, 4, 3, body)                          # robe spread on right
    # head tilted up toward the star, lit on top
    hr = 4
    fblob(c, fx + 1, gy - 13, hr, hr, p["bright"], OUT)
    eye(c, fx + 1, gy - 14, 1, look=0, dn=-1)
    # one arm reaching up toward the light
    capsule(c, [(fx + 4, gy - 9), (fx + 7, gy - 18), (fx + 6, gy - 24)], 1, body, OUT)
    c.set(fx + 6, gy - 25, p["bright"])                    # fingertip in the light
    # rim of star-light on head + shoulder
    c.hline(fx - 1, fx + 3, gy - 16, p["glow"])
    c.set(fx + 1, gy - 17, p["bright"])

    E.atmosphere(c, st, sx, sy)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-18 — The World of Ruin (earth): lone figure crossing a broken plain
# ════════════════════════════════════════════════════════════════════════════════
def major_18():
    st = "earth"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    c.scatter(0, 60, W, 30, p["stone_dk"], 0.10, seed=5, a=110)   # dust haze

    horizon = 84
    # ── the broken ochre plain: cracked flat ground + long shadows ──
    for cy in (96, 104, 112):                                     # ground cracks
        c.line(2, cy, 30, cy - 1, shade(p["ground"], -0.18))
        c.line(34, cy + 1, 78, cy, shade(p["ground"], -0.18))
    # half-buried ruins scattered on the plain
    for (rx, rw, rh, tl) in [(6, 7, 9, 0.25), (62, 9, 14, -0.15), (70, 6, 7, 0)]:
        ruin_stub(c, rx, horizon + 2, rw, rh, p, tilt=tl)
    # a distant broken arch (two leaning pillars + a span across the top)
    ar = shade(p["stone"], 0.0); ad = shade(p["stone"], -0.14)
    frect(c, 15, horizon - 14, 4, 14, ar)                         # left pillar
    frect(c, 28, horizon - 14, 4, 14, ad)                         # right pillar
    for i in range(15):                                           # arched span (broken on right)
        t = i / 14
        ax = 17 + round(t * 12)
        ay = horizon - 14 - round(4 * math.sin(t * math.pi))
        if t < 0.7:
            c.set(ax, ay, ar); c.set(ax, ay - 1, ar)
    c.set(28, horizon - 17, ad)                                   # snapped stub on right top

    # ── the lone walker, mid-stride, crossing left-to-right ──
    fx, fy = 38, 110
    # long flat shadow cast to the right
    fe(c, fx + 12, fy + 2, 16, 2, p["ink"], a=100)
    # after-images of absent companions walking beside — translucent ghost-blue tint
    ghost = shade(p["stone_lt"], 0.05)
    silhouette(c, fx - 13, fy - 1, 22, ghost, a=95, arms="down")
    silhouette(c, fx + 14, fy - 1, 21, ghost, a=72, arms="down")
    silhouette(c, fx + 25, fy - 1, 19, ghost, a=48, arms="down")
    # the real figure — solid, head slightly bowed, a traveler's cloak
    chibi_person(c, fx, fy, 24, p["stone_dk"], skin=p["figure"], look=1, dn=2, arms="down")
    # a staff
    c.line(fx + 7, fy - 18, fx + 9, fy + 1, p["ink"])

    E.atmosphere(c, st, None, None)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-19 — The Reunion (holy): the full company together in rising gold light
# ════════════════════════════════════════════════════════════════════════════════
def major_19():
    st = "holy"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    # rising dawn glow from the low horizon behind the company
    c.glow(40, 86, 46, p["glow"], 0.6)
    c.dither_rect(0, 70, W, 22, p["bright"], 0.2)
    c.scatter(8, 6, W - 16, 70, p["bright"], 0.03, seed=6, a=110)  # motes of grace

    # ── a warm rise (low hill) the company stands atop ──
    base = 104
    for i in range(W):
        d = abs(i - 40)
        hy = base - max(0, 10 - d // 5)
        c.vline(i, hy, H, shade(p["ground"], 0.06))
    c.hline(0, W - 1, base - 10, shade(p["horizon"], 0.05))

    # ── the full company, distinct + luminous, faces toward the light ──
    feet = 100
    # palette of distinct tunic colors, all warmed by holy light; spaced so each reads
    members = [
        (10, 26, (196, 86, 78), "down"),     # red warrior
        (25, 30, (118, 150, 200), "side"),   # blue
        (40, 34, (236, 206, 120), "up"),     # gold — centerpiece, arms raised
        (55, 30, (138, 200, 138), "wave"),   # green
        (70, 26, (188, 144, 210), "side"),   # violet
    ]
    for (mx, mh, col, arms) in members:
        # short warm shadow
        fe(c, mx + 1, feet + 1, 5, 1, p["ink"], a=70)
        chibi_person(c, mx, feet, mh, col, look=0, dn=-1, arms=arms)
        # golden rim-light on each head (faces to the dawn)
        hr = max(3, round(mh * 0.26))
        head_top = feet - mh
        c.set(mx, head_top - 1, p["bright"])
        c.hline(mx - 2, mx + 2, head_top, p["accent"])

    # the brightening sky above — a clean band of dawn
    c.dither_rect(0, 30, W, 14, p["bright"], 0.15)

    E.atmosphere(c, st, 40, 80)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-20 — The Final Ascent (ice): the fellowship climbing a vast spire
# ════════════════════════════════════════════════════════════════════════════════
def major_20():
    st = "ice"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    c.scatter(0, 0, W, 60, p["bright"], 0.05, seed=8, a=140)      # drifting frost
    # clouds far below (the world tiny and clouded)
    for cy in (104, 110, 116):
        c.dither_rect(0, cy, W, 4, p["bright"], 0.5)
    c.scatter(0, 100, W, 20, p["stone_lt"], 0.08, seed=3, a=120)

    # ── the vast spire rising diagonally, a narrow climbing ridge ──
    # a steep ridge from lower-left to upper-right
    pts = [(8, 118), (24, 96), (36, 76), (46, 56), (54, 36), (60, 16)]
    # spire body (filled left side, lit right edge)
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        n = int(math.hypot(x2 - x1, y2 - y1))
        for i in range(n + 1):
            t = i / max(1, n)
            xx = round(x1 + (x2 - x1) * t); yy = round(y1 + (y2 - y1) * t)
            # widen toward the base
            wleft = max(3, int(10 * (yy / 118)))
            for k in range(wleft):
                c.set(xx - k, yy, shade(p["stone"], -0.10 - 0.02 * k))
            c.set(xx, yy, p["stone_lt"])          # lit ridge edge
            c.set(xx + 1, yy, p["bright"])

    # ── the final fortress glittering above, at the summit ──
    fxp, fyp = 62, 14
    frect(c, fxp - 6, fyp - 8, 13, 10, p["stone_lt"], p["stone_dk"])
    for sxp in (fxp - 5, fxp - 1, fxp + 3):       # crystalline spires
        c.line(sxp, fyp - 8, sxp, fyp - 13, p["bright"])
        c.set(sxp, fyp - 14, p["accent"])
    c.glow(fxp, fyp - 6, 12, p["bright"], 0.6)
    c.set(fxp - 3, fyp - 4, p["accent"]); c.set(fxp + 2, fyp - 3, p["accent"])  # glints

    # ── the fellowship, small but unbroken, climbing the ridge in a line ──
    climbers = [(20, 99), (31, 82), (41, 64), (50, 45)]
    cols = [(150, 120, 170), (120, 150, 190), (180, 150, 130), (150, 180, 170)]
    for (cx, cy), col in zip(climbers, cols):
        silhouette(c, cx, cy, 11, shade(col, -0.2), arms="up")
        # a tiny lit edge so they read against the spire
        c.set(cx + 1, cy - 8, p["bright"])

    E.atmosphere(c, st, None, None)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-21 — The World Reborn (water): green returns to a flooded healing land
# ════════════════════════════════════════════════════════════════════════════════
def major_21():
    st = "water"; p = E.ELEMENTS[st]
    c = Canvas(W, H, bg=p["sky_top"])
    flat_backdrop(c, st)
    # soft refracted light from above, gentle gold mixed in
    c.glow(40, 16, 40, p["bright"], 0.4)
    c.dither_rect(0, 18, W, 12, p["accent"], 0.10)

    horizon = 80
    # ── the flooded, healing water — calm, reflective, caustics on the surface ──
    c.rect(0, horizon, W, H - horizon, p["ground"])
    c.scatter(0, horizon, W, H - horizon, p["glow"], 0.06, seed=9, a=110)   # caustics
    for ry in range(horizon + 4, H, 6):                          # gentle ripples
        c.hline(0, W - 1, ry, shade(p["stone_lt"], 0.0), 70)

    # ── the lifestream: a clear glowing ribbon threading down from the land ──
    lifestream(c, 8, 72, horizon - 4, p, a=210)
    # a vertical wellspring rising into the sky
    for i in range(20):
        yy = horizon - 6 - i
        c.set(40 + round(2 * math.sin(i * 0.5)), yy, p["glow"], max(40, 200 - i * 8))

    # ── green returns: a fresh shore with new growth ──
    shore = horizon - 2
    for i in range(W):
        d = abs(i - 26)
        gy = shore - max(0, 8 - d // 4)
        c.vline(i, gy, horizon + 1, shade((86, 150, 96), -0.05 + 0.002 * i))
    # sprouts / saplings of new green
    for gx in [10, 18, 30, 50, 62]:
        gh = 6 + (gx % 3) * 2
        c.vline(gx, shore - gh, shore, shade((70, 140, 84), 0.0))
        fblob(c, gx, shore - gh, 3, 4, (120, 190, 120), shade((60, 120, 70), -0.1))
        c.set(gx - 1, shore - gh - 1, p["bright"])               # dewlight

    # a small tree on the rise — life restored
    tx, tbase = 26, shore - 8
    c.rect(tx - 1, tbase - 6, 3, 8, (96, 70, 50))
    fblob(c, tx, tbase - 12, 8, 7, (110, 180, 110), (60, 120, 70))
    cel(c, tx - 3, tbase - 14, 3, 2, (160, 220, 150))

    # ── the fellowship, small and at peace, on the new shore ──
    feet = horizon - 1
    for (mx, mh, col, arms) in [(40, 16, (120, 180, 180), "side"),
                                (49, 17, (180, 160, 120), "down"),
                                (57, 15, (160, 140, 180), "down")]:
        chibi_person(c, mx, feet, mh, col, skin=(236, 206, 176), look=0, dn=1, arms=arms)
        # gentle reflection in the water below
        fe(c, mx, feet + 4, 2, 2, shade(col, -0.2), a=80)

    E.atmosphere(c, st, 40, 30)
    return c


CARDS = {
    "major-15": major_15,
    "major-16": major_16,
    "major-17": major_17,
    "major-18": major_18,
    "major-19": major_19,
    "major-20": major_20,
    "major-21": major_21,
}
