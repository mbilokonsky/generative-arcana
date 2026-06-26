"""
Ulysses "Vico" pixel pack — the KEYS suit (Mythic Acceptance).

Core motif: the key, locks, keyholes, doors, thresholds opening, light spilling through. Gentle,
never forced (contrast the Towers suit which breaks). Each card = key/door imagery arranged by the
rank's idea, painted in the card's Vico age (read from station_slug in deck.json):

  keys-0  Homecoming   heroes     keys-7  History      gods
  keys-1  Replacement  men        keys-8  Invitation   heroes
  keys-2  Trinity      ricorso    keys-9  Recurrence   men
  keys-3  The City     gods       keys-10 Child        ricorso
  keys-4  The Outsider heroes     keys-11 Father       gods
  keys-5  Identity     men        keys-12 Mother       heroes
  keys-6  Asymmetry    ricorso    keys-13 Affirmation  men

Only this file is authored. Helpers stay local; shared vocabulary comes from motifs.py.
"""
import math
from motifs import *  # Canvas, AGES, shade, W, H, figure, crowd, building, key, lamp, starfield, sky, ...


# ── local helpers ──────────────────────────────────────────────────────────────
def base_sky(c, p, age, hor=84):
    """Lay the age backdrop: sky + ground band, atmosphere per Vico register."""
    if age == "gods":
        # primal dark, storm overhead
        c.vgrad(0, 0, W, hor, p["sky_top"], p["sky_bot"])
        c.scatter(0, 0, W, hor - 16, p["ink"], 0.18, a=150, seed=7, falloff=0.5)
        c.scatter(0, 4, W, hor - 30, shade(p["stone"], -0.3), 0.10, a=120, seed=13)
    elif age == "heroes":
        # monumental twilight: top->horizon glow
        c.vgrad(0, 0, W, hor, p["sky_top"], p["horizon"])
    elif age == "men":
        # flat civic daylight
        c.vgrad(0, 0, W, hor, p["sky_top"], p["sky_bot"])
    else:  # ricorso — night->dawn, drifting motes, fog
        c.vgrad(0, 0, W, hor, p["sky_top"], p["sky_bot"])
        c.scatter(0, hor - 40, W, 40, p["horizon"], 0.10, a=70, seed=21)
    # ground
    c.rect(0, hor, W, H - hor, p["ground"])
    c.hline(0, W - 1, hor, shade(p["ground"], 0.25))
    c.rect(0, hor + 1, W, 2, shade(p["ground"], 0.12))


def vignette_for(c, age):
    if age == "gods":
        c.vignette(0.55)
    elif age == "heroes":
        c.vignette(0.4)
    elif age == "men":
        c.vignette(0.2)
    else:
        c.vignette(0.45, col=AGES["ricorso"]["ink"])


def sun(c, p, x, y, r=8, strength=0.9):
    c.glow(x, y, r * 2, p["accent"], strength)
    c.disc(x, y, r, p["bright"])
    for i in range(0, 360, 45):
        t = math.radians(i)
        c.set(x + (r + 2) * math.cos(t), y + (r + 2) * math.sin(t), p["accent"])


def bigkey(c, x, y, p, h=34, w=10, col=None, glow=False):
    """A large, deliberate hero key (lit upper-left): bow ring + shaft + bit teeth.
    x,y = center of the bow ring; key hangs downward."""
    col = col or p["accent"]
    lit = shade(col, 0.28)
    dk = shade(col, -0.3)
    r = max(3, w // 2 + 1)
    # bow ring (hollow)
    c.ring(x, y, r, col)
    c.ring(x, y, r - 1, lit)
    # ring hole highlight on upper-left
    c.set(x - 1, y - 1, p["bright"])
    if glow:
        c.glow(x, y, r * 2, p["accent"], 0.5)
    # shaft
    shaft_top = y + r
    shaft_bot = y + r + h
    c.rect(x - 1, shaft_top, 2, shaft_bot - shaft_top, col)
    c.vline(x - 1, shaft_top, shaft_bot, lit)   # left-lit
    c.vline(x + 1, shaft_top, shaft_bot, dk)    # right shade (if width permits)
    # bit / teeth at the bottom, pointing right
    c.rect(x + 1, shaft_bot - 7, 4, 2, col)
    c.rect(x + 1, shaft_bot - 3, 5, 2, col)
    c.set(x + 1, shaft_bot - 7, lit)
    return (x, shaft_top, shaft_bot)


def smallkey(c, x, y, p, h=15, col=None):
    """Compact key variant for groupings/rings (uses motif vocabulary, lit)."""
    col = col or p["accent"]
    c.ring(x, y, 3, col)
    c.set(x - 1, y - 1, shade(col, 0.4))
    c.vline(x, y + 3, y + h, col)
    c.hline(x, x + 3, y + h, col)
    c.hline(x, x + 2, y + h - 3, col)


def keyhole(c, x, y, p, scale=1, col=None):
    """A keyhole shape (circle + tapering slot), lit from within if col=bright."""
    col = col or p["ink"]
    c.disc(x, y, 2 * scale, col)
    c.rect(x - scale, y, 2 * scale + 1, 5 * scale, col)


def door(c, x, ytop, w, h, p, ajar=0.0, light=None):
    """A door/threshold in a wall. ajar 0..1 = how far open; light = spill colour when open."""
    light = light or p["bright"]
    # frame / jamb
    c.rect(x - 2, ytop - 2, w + 4, h + 2, shade(p["stone"], -0.15))
    # opening (dark behind)
    c.rect(x, ytop, w, h, shade(p["ink"], -0.2))
    if ajar > 0:
        # light spilling through the gap on the right side
        gap = max(2, int(w * ajar))
        for j in range(h):
            t = 1 - j / max(1, h - 1)
            for i in range(gap):
                a = int(220 * (1 - i / max(1, gap)) * (0.4 + 0.6 * t))
                c.set(x + w - 1 - i, ytop + j, light, a)
        # glow puddle at the threshold foot
        c.glow(x + w - gap // 2, ytop + h, gap + 4, light, 0.5)
        # the door leaf itself, swung partly open on the left, lit edge
        leaf_w = w - gap
        for i in range(leaf_w):
            c.vline(x + i, ytop, ytop + h - 1, shade(p["stone_dk"], -0.1 + 0.2 * (1 - i / max(1, leaf_w))))
        c.vline(x + leaf_w, ytop, ytop + h - 1, p["bright"])  # bright sunlit edge
    else:
        # closed door leaf with panels + a keyhole
        for i in range(w):
            c.vline(x + i, ytop, ytop + h - 1, shade(p["stone"], 0.18 - 0.5 * (i / max(1, w - 1))))
        c.rect(x + 1, ytop + 2, w - 2, h // 2 - 3, shade(p["stone"], -0.2))
        c.rect(x + 1, ytop + h // 2 + 1, w - 2, h // 2 - 3, shade(p["stone"], -0.2))
        keyhole(c, x + w - 3, ytop + h // 2, p, col=p["ink"])


def wall(c, x, ytop, w, h, p):
    """A civic wall block with faint courses (men/gods architecture)."""
    for i in range(w):
        c.vline(x + i, ytop, ytop + h, shade(p["stone"], 0.16 - 0.45 * (i / max(1, w - 1))))
    for cy in range(ytop + 4, ytop + h, 6):
        c.hline(x, x + w - 1, cy, shade(p["stone"], -0.18), a=120)


# ── cards ───────────────────────────────────────────────────────────────────────
def keys_0():  # Homecoming — heroes. A key turning gently in a lock made for it; the door home.
    age = "heroes"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=86)
    sun(c, p, 60, 24, r=7, strength=0.85)
    # a low doorway in a wall: home receiving you. door ajar, warm light.
    door(c, 30, 52, 20, 34, p, ajar=0.45, light=p["bright"])
    # the hero key, large, hanging beside the door (recognition, not force)
    bigkey(c, 16, 40, p, h=30, w=9, glow=True)
    # small figure arriving at the threshold
    figure(c, 56, 86, 22, p["figure"])
    vignette_for(c, age)
    return c


def keys_1():  # Replacement — men. One key handed to / exchanged for another; gentle succession.
    age = "men"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=82)
    wall(c, 0, 30, W, 52, p)  # flat civic wall
    # old key, fading (left, desaturated/darker)
    old = shade(p["stone_dk"], 0.1)
    bigkey(c, 26, 40, p, h=26, w=8, col=old)
    # new key, solid + lit (right), slightly higher = ascendant
    bigkey(c, 52, 34, p, h=28, w=9, col=p["accent"])
    # an arrow-like handoff: a row of dots from old to new
    for i in range(5):
        c.set(34 + i * 3, 52, shade(p["bright"], -0.1), a=160)
    vignette_for(c, age)
    return c


def keys_2():  # Trinity — ricorso. Three keys arranged as a triangle, a key opening a third space.
    age = "ricorso"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=88)
    c.scatter(0, 8, W, 70, p["bright"], 0.04, a=130, seed=5)  # drifting motes
    # a soft glowing keyhole-space at the triangle's center (the third, stabilizing term)
    c.glow(40, 54, 18, p["accent"], 0.55)
    keyhole(c, 40, 50, p, scale=2, col=shade(p["bright"], -0.05))
    # three keys pointing inward toward the center, forming a triangle
    smallkey(c, 40, 22, p, h=13, col=p["bright"])             # top
    smallkey(c, 22, 72, p, h=13, col=p["accent"])            # lower-left
    smallkey(c, 58, 72, p, h=13, col=shade(p["accent"], 0.2))  # lower-right
    # faint triangle binding them
    c.line(40, 26, 24, 70, shade(p["bright"], -0.2), a=90)
    c.line(40, 26, 56, 70, shade(p["bright"], -0.2), a=90)
    c.line(24, 70, 56, 70, shade(p["bright"], -0.2), a=90)
    vignette_for(c, age)
    return c


def keys_3():  # The City — gods. A key ring as the four-square city; doors as access points.
    age = "gods"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=92)
    c.glow(40, 30, 26, p["ember"], 0.35)  # primal glow over the city
    # four-square city wall with four doors (the bounded space, every door an access point)
    cx0, cy0, bw, bh = 14, 44, 52, 46
    wall(c, cx0, cy0, bw, bh, p)
    # four doorways (foursquare), each a lit access point with a warm interior
    for dx in (cx0 + 7, cx0 + bw - 17):
        for dy in (cy0 + 6, cy0 + 26):
            c.rect(dx - 1, dy - 1, 12, 16, shade(p["stone_dk"], -0.2))   # jamb
            c.rect(dx, dy, 10, 14, shade(p["ink"], -0.25))               # opening
            # warm interior glow, brighter at the foot (light through the door)
            for j in range(14):
                t = j / 13
                c.rect(dx + 1, dy + 1 + j, 8, 1, p["ember"], a=int(60 + 110 * t))
            c.rect(dx + 3, dy + 9, 4, 5, p["accent"], a=200)             # bright threshold
    # a great key above, the unifying ring of access over the whole city
    bigkey(c, 40, 14, p, h=22, w=9, col=p["accent"], glow=True)
    vignette_for(c, age)
    return c


def keys_4():  # The Outsider — heroes. A figure at the edge holding a key for a door others miss.
    age = "heroes"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=86)
    sun(c, p, 22, 22, r=6, strength=0.8)
    # the four-square wall fills most of the frame (the city that excludes)
    wall(c, 0, 40, 54, 46, p)
    # a door at the right edge only the outsider sees — ajar, warm light spilling
    door(c, 60, 48, 18, 38, p, ajar=0.55, light=p["bright"])
    # the outsider figure at the margin between wall and door, holding a key
    figure(c, 50, 86, 22, p["figure"])
    smallkey(c, 40, 58, p, h=11, col=p["accent"])
    vignette_for(c, age)
    return c


def keys_5():  # Identity — men. Two figures recognizing each other by the keys they carry.
    age = "men"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=84)
    wall(c, 0, 30, W, 54, p)
    # two figures facing, each holding a key — the karass of key-holders
    figure(c, 22, 84, 30, p["figure"])
    figure(c, 58, 84, 30, p["figure"])
    smallkey(c, 32, 50, p, h=12, col=p["accent"])
    smallkey(c, 48, 50, p, h=12, col=p["accent"])
    # recognition: a soft shared glow between them
    c.glow(40, 52, 12, p["bright"], 0.3)
    vignette_for(c, age)
    return c


def keys_6():  # Asymmetry — ricorso. Seven keys that won't pair/balance; one stands apart.
    age = "ricorso"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=90)
    c.scatter(0, 6, W, 74, p["bright"], 0.035, a=110, seed=9)
    # six keys in three uneven pairs along the bottom, one odd key apart/elevated
    pairs = [(14, 70), (24, 64), (40, 72), (50, 66), (66, 70)]
    for (x, y) in pairs:
        smallkey(c, x, y, p, h=11, col=shade(p["accent"], -0.05))
    smallkey(c, 32, 58, p, h=11, col=shade(p["accent"], -0.05))
    # the odd one out: brighter, alone, higher up
    smallkey(c, 40, 26, p, h=14, col=p["bright"])
    c.glow(40, 30, 9, p["accent"], 0.4)
    vignette_for(c, age)
    return c


def keys_7():  # History — gods. Keys passed down across an ocean of time; layered, ancestral.
    age = "gods"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=80)
    c.glow(40, 18, 24, p["ember"], 0.3)
    # an ocean of understanding below (dark water with scattered glints)
    c.rect(0, 80, W, H - 80, shade(p["sky_bot"], -0.45))
    c.scatter(0, 80, W, H - 80, p["accent"], 0.05, a=130, seed=17)
    c.hline(0, W - 1, 80, shade(p["bright"], -0.3), a=120)
    # a descending stair of keys: generations, each smaller/dimmer going back in time
    cols = [p["bright"], shade(p["accent"], 0.1), p["accent"], shade(p["accent"], -0.2), shade(p["stone"], 0.0)]
    for i, col in enumerate(cols):
        smallkey(c, 16 + i * 12, 24 + i * 8, p, h=12 - i, col=col)
    vignette_for(c, age)
    return c


def keys_8():  # Invitation — heroes. A door ajar, key in hand, light spilling; the threshold.
    age = "heroes"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=88)
    starfield(c, 0, 4, W, 40, p, density=0.05, seed=3)  # stars overhead (garden under stars)
    # a tall door, ajar, warm light spilling out — the breath before yes
    door(c, 28, 38, 24, 48, p, ajar=0.55, light=p["bright"])
    # a key hangs by the door, ready, not yet turned
    bigkey(c, 16, 46, p, h=26, w=8, glow=True)
    # a small figure at the threshold, about to step through
    figure(c, 58, 86, 22, p["figure"])
    vignette_for(c, age)
    return c


def keys_9():  # Recurrence — men. Keys in a ring/cycle; doors lock and unlock again.
    age = "men"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=84)
    wall(c, 0, 28, W, 56, p)
    # a great ring of keys (the cycle made explicit)
    cx, cy, R = 40, 56, 22
    c.ring(cx, cy, R, p["accent"])
    c.ring(cx, cy, R - 1, shade(p["accent"], -0.2))
    n = 8
    for i in range(n):
        t = 2 * math.pi * i / n - math.pi / 2
        kx = cx + R * math.cos(t)
        ky = cy + R * math.sin(t)
        smallkey(c, int(kx), int(ky), p, h=7, col=p["bright"] if i == 0 else p["accent"])
    # an arrow hinting circulation
    c.set(cx + R, cy - 2, p["bright"]); c.set(cx + R + 1, cy, p["bright"]); c.set(cx + R, cy + 2, p["bright"])
    vignette_for(c, age)
    return c


def keys_10():  # Child — ricorso. A small figure trying keys in a lock with patient curiosity.
    age = "ricorso"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=90)
    c.scatter(0, 6, W, 78, p["bright"], 0.035, a=110, seed=11)
    # a closed door with a lit keyhole, the child reaching toward it
    door(c, 44, 46, 22, 44, p, ajar=0.0)
    c.glow(44 + 22 - 3, 46 + 22, 7, p["accent"], 0.4)  # keyhole glow
    # small child figure (short), holding a tiny key out toward the lock
    figure(c, 22, 90, 24, p["figure"])
    smallkey(c, 34, 64, p, h=9, col=p["bright"])
    vignette_for(c, age)
    return c


def keys_11():  # Father — gods. Mature figure offering a key; paternal wisdom of access.
    age = "gods"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=88)
    c.glow(40, 24, 22, p["ember"], 0.32)
    # a doorway behind; the father stands central, offering a key outward
    door(c, 30, 46, 20, 42, p, ajar=0.25, light=p["accent"])
    figure(c, 40, 88, 40, p["figure"])  # large central form
    # the offered key, held out to the side, glowing (teaching by offering)
    bigkey(c, 60, 50, p, h=22, w=8, glow=True)
    vignette_for(c, age)
    return c


def keys_12():  # Mother — heroes. The ground that needs no key; an open space, doors dissolving.
    age = "heroes"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=88)
    sun(c, p, 40, 24, r=8, strength=0.9)  # warm radiant ground beyond doors
    # a wide-open archway/threshold, no door leaf — space that was never closed
    c.rect(24, 40, 32, 48, shade(p["ink"], -0.1))           # opening
    # arch top
    for i in range(32):
        d = abs(i - 16)
        c.vline(24 + i, 40 - (8 - d // 2 if d < 16 else 0), 40, shade(p["stone"], -0.1))
    c.rect(20, 40, 4, 48, shade(p["stone"], 0.1))           # left jamb (lit)
    c.rect(56, 40, 4, 48, shade(p["stone"], -0.3))          # right jamb (shade)
    # warm light filling the opening (the ground you unlock TO)
    for j in range(48):
        t = 1 - j / 48
        c.rect(24, 40 + j, 32, 1, p["bright"], a=int(120 * t))
    c.glow(40, 64, 20, p["accent"], 0.4)
    # the maternal figure at center within the light
    figure(c, 40, 86, 30, p["figure"])
    # a single key laid down at her feet — no longer needed
    smallkey(c, 56, 80, p, h=8, col=shade(p["accent"], -0.1))
    vignette_for(c, age)
    return c


def keys_13():  # Affirmation — men? No: men. The great door open to radiant light; YES.
    age = "men"; p = AGES[age]
    c = Canvas()
    base_sky(c, p, age, hor=94)
    # a dark wall the great door is set into, so the opening reads against it
    wall(c, 12, 18, 56, 76, p)
    # the great door flung fully open onto radiant light — yes to keys
    ox, oy, ow, oh = 28, 22, 24, 72
    c.rect(ox, oy, ow, oh, shade(p["bright"], -0.05))            # the bright opening
    # radiant light pouring out, beams + bloom
    c.glow(40, 56, 40, p["bright"], 0.95)
    c.glow(40, 56, 22, p["accent"], 0.45)
    for ang in range(-60, 61, 15):                              # rays
        t = math.radians(ang - 90)
        c.line(40, 56, 40 + 60 * math.cos(t), 56 + 60 * math.sin(t), p["bright"], a=70)
    # two door leaves swung fully open, one each side (lit inner edge, shaded outer)
    for sx, side in ((ox, -1), (ox + ow - 1, +1)):
        lw = 6
        for i in range(lw):
            xx = sx + side * i
            f = i / (lw - 1)
            c.vline(xx, oy, oy + oh - 1, shade(p["stone"], -0.35 + 0.2 * f))
        c.vline(sx, oy, oy + oh - 1, p["bright"])               # bright inner lit edge
    # the key, finished, glowing at the heart of the light — the affirmed motif
    bigkey(c, 40, 36, p, h=24, w=9, col=shade(p["accent"], 0.15), glow=True)
    vignette_for(c, age)
    return c


CARDS = {
    "keys-0": keys_0,
    "keys-1": keys_1,
    "keys-2": keys_2,
    "keys-3": keys_3,
    "keys-4": keys_4,
    "keys-5": keys_5,
    "keys-6": keys_6,
    "keys-7": keys_7,
    "keys-8": keys_8,
    "keys-9": keys_9,
    "keys-10": keys_10,
    "keys-11": keys_11,
    "keys-12": keys_12,
    "keys-13": keys_13,
}
