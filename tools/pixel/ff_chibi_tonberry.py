"""
Final Fantasy chibi pixel pack — the TONBERRY suit (Bane·Journey).

The tonberry is the inexorable passage: the slow lantern-lit march, mortality, patient reckoning.
Tan burlap hood+robe, round GREEN head, amber eyes, a glowing lantern, a big chef's knife, a fish
tail, the X-stitch. The lantern's warm glow is the signature light source in the dark.

Each fn() -> 80x120 Canvas:
  1. flat_backdrop(c, station)         (element = palette/light ONLY)
  2. a scene set by the card's RANK idea + meaning, in Tonberry vocabulary
  3. ff_elements.atmosphere(...) + contact(...) shadows
"""
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT,
                        flat_backdrop, contact, W, H)
from ff_chibi import chibi_tonberry, chef_knife, amber_eye
from ff_creatures import TONBERRY as P
import ff_elements as E


# ─────────────────────────────────────────────────────────────────────────────
# Tonberry-specific primitives
# ─────────────────────────────────────────────────────────────────────────────

LANT = P["lantern"]
LANT_DK = P["lantern_dk"]
CORE = (255, 250, 224)


def lantern(c, lx, ly, r=14, s=0.85, scale=1.0):
    """A free-standing glowing lantern (the suit's light source). scale shrinks the body."""
    c.glow(lx, ly, r, LANT, s)
    bw = max(2, round(6 * scale)); bh = max(3, round(9 * scale))
    frect(c, lx - bw // 2, ly - bh // 2, bw, bh, LANT, LANT_DK)
    c.rect(lx - bw // 2, ly - bh // 2 - 1, bw, 2, LANT_DK)              # top cap
    c.rect(lx - bw // 2 + 1, ly - bh // 2 + 1, max(1, bw - 2), max(1, bh - 2), CORE)  # bright core
    return lx, ly


def mini_tonberry(c, cx, feet, el, facing=-1, lant=True, lant_r=11,
                  knife=False, green=True, h=1.0):
    """A small simplified tonberry: tan hood+robe blob, optional green face + lantern dot + knife.
    facing: -1 left, +1 right. Returns (cx, hood_y)."""
    p = E.ELEMENTS[el]
    body_h = round(13 * h)
    hy = feet - body_h
    # fish tail nub (behind, opposite facing)
    tx = cx - facing * 6
    capsule(c, [(cx, feet - 6), (tx, feet - 7), (tx - facing * 2, feet - 5)], 2, P["skin"], OUT)
    # robe
    fblob(c, cx, feet - round(6 * h), round(6 * h) + 1, round(7 * h), P["robe"], OUT)
    # X-stitch
    sx, sy = cx, feet - round(7 * h)
    c.line(sx - 2, sy - 1, sx + 2, sy + 3, P["robe_dk"])
    c.line(sx + 2, sy - 1, sx - 2, sy + 3, P["robe_dk"])
    # hood
    fblob(c, cx, hy, round(7 * h), round(7 * h), P["robe"], OUT)
    c.line(cx, hy - round(8 * h), cx - 3, hy - 2, OUT)
    c.line(cx, hy - round(8 * h), cx + 3, hy - 2, OUT)
    # green face in the hood opening
    if green:
        fblob(c, cx + facing, hy + 1, round(4 * h), round(4 * h), P["skin"], OUT)
        # two amber eye dots
        c.disc(cx + facing - 1, hy, 1, P["eye"])
        c.disc(cx + facing + 2, hy, 1, P["eye"])
    else:
        fe(c, cx + facing, hy + 1, 3, 3, P["robe_dk"])
        c.disc(cx + facing - 1, hy, 1, P["eye"])
        c.disc(cx + facing + 2, hy, 1, P["eye"])
    # lantern dot held out front
    if lant:
        lx, ly = cx + facing * 9, feet - 6
        lantern(c, lx, ly, r=lant_r, s=0.8, scale=0.55)
        c.line(lx, ly - 3, cx + facing * 4, feet - 9, OUT)
    if knife:
        kx = cx - facing * 7
        blade(c, kx, feet - 6, kx - facing * 1, feet - 16, 3, P["blade"], OUT)
    return cx, hy


def corridor(c, el, cx=40, vanish=70, near=120, mouth_w=64, far_w=10, top=2):
    """A dark perspective corridor: two converging walls + floor, vanishing toward `vanish`.
    Returns (far_cx, far_y) = the distant point."""
    p = E.ELEMENTS[el]
    wall = p["stone_dk"]
    wall_lt = p["stone"]
    floor = shade(p["ground"], -0.15)
    far_y = vanish
    # darken everything first toward the dark end
    # floor wedge (trapezoid from wide near-bottom to narrow far point)
    for y in range(far_y, near):
        t = (y - far_y) / max(1, (near - far_y))
        half = round(far_w / 2 + (mouth_w / 2 - far_w / 2) * t)
        c.hline(cx - half, cx + half, y, shade(floor, -0.05 + 0.12 * t))
    # left + right walls as converging dark bands above the floor edges
    for y in range(top, near):
        t = max(0.0, (y - far_y) / max(1, (near - far_y)))
        half = round(far_w / 2 + (mouth_w / 2 - far_w / 2) * t) if y >= far_y else \
               round(far_w / 2 * (y - top) / max(1, far_y - top))
        # wall verticals just outside the floor edge
        c.vline(cx - half - 1, y, y, shade(wall, -0.1))
        c.vline(cx + half + 1, y, y, shade(wall, -0.1))
    return cx, far_y


def door(c, cx, top, w=20, h=34, el="dark", glow=False):
    """A heavy closed stone door at the far end."""
    p = E.ELEMENTS[el]
    frect(c, cx - w // 2, top, w, h, p["stone_dk"], OUT)
    # arched lintel
    c.disc(cx, top, w // 2, p["stone_dk"])
    c.disc(cx, top, w // 2, OUT) if False else None
    for dx in range(-w // 2, w // 2 + 1):
        c.set(cx + dx, top - round((1 - (dx / (w / 2)) ** 2) ** 0.5 * (w // 2)), OUT)
    # planks
    for px in range(cx - w // 2 + 4, cx + w // 2, 5):
        c.vline(px, top, top + h - 1, shade(p["stone_dk"], -0.25))
    # iron band
    c.hline(cx - w // 2, cx + w // 2 - 1, top + h // 2, shade(p["stone"], 0.1))
    if glow:
        c.glow(cx, top + h // 2, w, p["glow"], 0.3)


def boundary_stone(c, cx, base, w=10, h=20, el="earth", mark=False):
    p = E.ELEMENTS[el]
    frect(c, cx - w // 2, base - h, w, h, p["stone"], OUT)
    c.disc(cx, base - h, w // 2, p["stone"])
    fe(c, cx, base - h, w // 2, 3, p["stone_lt"])           # top highlight
    c.rect(cx - w // 2, base - h, w, 2, p["stone_lt"])
    if mark:
        # a carved owed-mark (a notch cross)
        c.vline(cx, base - h + 5, base - h + 13, p["stone_dk"])
        c.hline(cx - 3, cx + 3, base - h + 9, p["stone_dk"])
    return cx, base


def water_band(c, top, bot, el):
    """Flooded floor: teal water + caustic flecks."""
    p = E.ELEMENTS[el]
    for y in range(top, bot):
        t = (y - top) / max(1, bot - top)
        c.hline(0, W - 1, y, shade(p["sky_bot"], -0.18 + 0.22 * t))
    c.dither_rect(0, top, W, bot - top, p["glow"], 0.10, a=130)
    c.hline(0, W - 1, top, p["bright"], a=110)              # surface line


# ─────────────────────────────────────────────────────────────────────────────
# Cards
# ─────────────────────────────────────────────────────────────────────────────

def ace():  # tonberry-0 · thunder · one tonberry + its first lit lantern in the dark
    el = "thunder"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    far_cx, far_y = corridor(c, el, vanish=58, near=118, mouth_w=70, far_w=8)
    # far lantern flaring awake, throwing a long stark shadow toward us
    lx, ly = far_cx, far_y + 6
    c.glow(lx, ly, 22, LANT, 0.9)
    # the long thrown shadow down the floor
    for y in range(ly + 4, 118):
        t = (y - ly) / (118 - ly)
        c.hline(far_cx - round(2 + 7 * t), far_cx + round(2 + 7 * t), y, shade(p["ink"], 0), a=120)
    lantern(c, lx, ly, r=18, s=0.9, scale=0.7)
    # a small domed figure just beginning its first step, near (one foot lifted)
    cx2, feet2 = 40, 110
    mini_tonberry(c, cx2, feet2, el, facing=-1, lant=False, h=1.2)
    # a stark rim of the far light on its lit edge
    c.line(cx2 - 7, feet2 - 18, cx2 - 7, feet2 - 6, shade(p["glow"], 0.2), a=150)
    E.atmosphere(c, el, lx, ly)
    contact(c, cx2, feet2, el)
    return c


def two():  # tonberry-1 · earth · debt & debtor weighed across a closing distance
    el = "earth"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    base = 110
    boundary_stone(c, 16, base, w=12, h=26, el=el, mark=True)     # the debt
    boundary_stone(c, 64, base, w=12, h=22, el=el)               # the debtor's marker
    # the slow walker on the line between, lantern low
    mini_tonberry(c, 40, base, el, facing=1, lant=True, lant_r=12, h=1.1)
    # the line joining the two stones
    c.hline(20, 60, base + 2, shade(p["ground"], -0.2), a=140)
    E.atmosphere(c, el, 40, base - 10)
    contact(c, 40, base, el); contact(c, 16, base, el, w=8); contact(c, 64, base, el, w=8)
    return c


def three():  # tonberry-2 · holy · recognition: the one approached finally SEES, named by light
    el = "holy"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # radiant gold-white spilling down from high/unseen
    c.glow(W // 2, 0, 70, p["glow"], 0.55)
    for k in range(6):
        c.dither_rect(28 + k, 4, 24 - 2 * k, 60, p["bright"], 0.18, a=90)
    # the lantern-bearer advancing into the light, haloed
    cx, hy = chibi_tonberry(c, 40, 110, el)
    c.glow(cx, hy, 16, p["glow"], 0.4)                            # halo of being seen
    E.atmosphere(c, el, cx, hy)
    contact(c, 40, 110, el)
    return c


def four():  # tonberry-3 · ice · certainty made solid, four-square, frozen still
    el = "ice"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # a squared crystalline frame around the corridor
    for (x, y, w, h) in [(10, 26, 60, 80)]:
        c.rect(x, y, w, 2, p["stone_lt"]); c.rect(x, y + h, w, 2, p["stone_lt"])
        c.rect(x, y, 2, h, p["stone_lt"]); c.rect(x + w, y, 2, h, p["stone_lt"])
    # inner squared band — the four-square structure
    c.rect(18, 34, 44, 2, shade(p["stone"], 0.1)); c.rect(18, 96, 44, 2, shade(p["stone"], 0.1))
    c.rect(18, 34, 2, 64, shade(p["stone"], 0.1)); c.rect(60, 34, 2, 64, shade(p["stone"], 0.1))
    # frost crystals in the corners
    for (fx, fy) in [(14, 30), (66, 30), (14, 102), (66, 102)]:
        c.line(fx - 3, fy, fx + 3, fy, p["bright"]); c.line(fx, fy - 3, fx, fy + 3, p["bright"])
    # utterly still figure, lantern frozen mid-swing
    cx, hy = chibi_tonberry(c, 40, 100, el)
    # breath, hanging
    c.dither_rect(cx + 8, hy - 4, 6, 5, p["bright"], 0.4, a=120)
    E.atmosphere(c, el, cx, hy)
    contact(c, 40, 100, el)
    return c


def five():  # tonberry-4 · water · wading the flood of memory; faces surfacing/dissolving
    el = "water"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    water_band(c, 70, H, el)
    # caustics across the upper walls
    c.dither_rect(0, 30, W, 40, p["glow"], 0.08, a=110)
    # dim remembered faces surfacing/dissolving (scatter of green head-ghosts)
    for (gx, gy) in [(16, 84), (62, 90), (24, 100), (58, 104)]:
        fe(c, gx, gy, 4, 3, P["skin_dk"], a=120)
        c.disc(gx - 1, gy, 1, p["ink"], a=140); c.disc(gx + 2, gy, 1, p["ink"], a=140)
    # a figure wading forward against the pull, waist-deep
    cx, hy = chibi_tonberry(c, 40, 98, el)
    # erase legs into the water (overdraw water over feet)
    c.dither_rect(cx - 12, 90, 24, 12, shade(p["sky_bot"], -0.12), 0.7, a=150)
    # doubled reflection in moving water
    for j in range(8):
        c.hline(cx - 6, cx + 6, 98 + j, shade(p["glow"], 0.1), a=max(0, 90 - j * 10))
    E.atmosphere(c, el, cx, hy)
    contact(c, 40, 98, el)
    return c


def six():  # tonberry-5 · wind · exchange of release; ash & paper drifting off, lighter
    el = "wind"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # an opening of brightness far ahead (where things are carried)
    c.glow(64, 22, 26, p["bright"], 0.6)
    # loose ash & old paper lifting and drifting toward the opening
    for k in range(18):
        ax = 6 + (k * 53) % 64
        ay = 30 + (k * 37) % 70
        col = p["stone_lt"] if k % 2 else shade(p["accent"], 0.2)
        c.line(ax, ay, ax + 3, ay - 2, col, a=160)
    # streaks of moving air across the corridor
    for k in range(5):
        yy = 30 + k * 14
        c.dither_rect(0, yy, W, 2, p["stone_lt"], 0.55, a=130)
    # the figure walking lighter, lantern-flame leaning in the breeze
    cx, hy = chibi_tonberry(c, 36, 108, el)
    # flame leaning toward the opening (over the hero's lantern)
    c.line(cx - 14, 96, cx - 9, 93, LANT, a=220)
    c.set(cx - 9, 92, p["bright"])
    # one big page caught lifting off the figure, going
    fblob(c, 56, 70, 3, 4, p["bright"], p["stone_dk"])
    c.line(58, 68, 62, 64, p["stone_lt"], a=180)
    E.atmosphere(c, el, 64, 22)
    contact(c, 36, 108, el)
    return c


def seven():  # tonberry-6 · dark · the lone trial: one weak light in near-total black
    el = "dark"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # faint converging walls, then swallow the frame in black
    corridor(c, el, vanish=50, near=118, mouth_w=66, far_w=10)
    c.dither_rect(0, 0, W, H, p["ink"], 0.8, a=205)
    c.rect(0, 0, W, H, p["ink"], a=95)
    # one weak point of lantern-light holding against the void
    cx, feet = 40, 92
    lx, ly = cx - 9, feet - 8
    c.glow(lx, ly, 32, LANT, 0.5)
    c.glow(lx, ly, 14, LANT, 0.9)
    # a barely-legible small domed silhouette, just enough to read as the walker
    robe = shade(P["robe"], -0.35); robe_ln = shade(P["robe"], -0.55)
    fblob(c, cx, feet - 7, 7, 8, robe, robe_ln)
    c.line(cx - 3, feet - 9, cx + 3, feet - 4, robe_ln); c.line(cx + 3, feet - 9, cx - 3, feet - 4, robe_ln)
    fblob(c, cx, feet - 15, 7, 7, robe, robe_ln)
    fblob(c, cx, feet - 14, 4, 4, shade(P["skin"], -0.3), robe_ln)   # faint green head
    c.disc(cx - 2, feet - 14, 1, P["eye"]); c.disc(cx + 2, feet - 14, 1, P["eye"])
    lantern(c, lx, ly, r=12, s=0.9, scale=0.55)
    c.line(lx + 1, ly - 2, cx - 4, feet - 11, robe_ln)               # arm to lantern
    E.atmosphere(c, el, lx, ly)
    return c


def eight():  # tonberry-7 · fire · craft accelerating; forge-heat, knife catching flame
    el = "fire"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # forge-glow rising along the walls, just out of frame
    c.glow(8, 70, 34, p["glow"], 0.5); c.glow(72, 64, 34, p["glow"], 0.5)
    c.dither_rect(0, 40, W, 60, p["glow"], 0.10, a=120)
    # rising embers / ash on heated air
    for k in range(14):
        ex = 8 + (k * 47) % 64; ey = 100 - (k * 29) % 70
        c.set(ex, ey, p["accent"]); c.set(ex, ey - 1, p["bright"])
    # heat-shimmer at the far end
    c.dither_rect(28, 20, 24, 16, p["accent"], 0.3, a=110)
    # the figure advancing with purpose, knife catching a hot edge
    cx, hy = chibi_tonberry(c, 40, 110, el)
    # hot rim along the raised knife
    c.line(cx + 11, 96, cx + 9, 84, p["bright"], a=210)
    E.atmosphere(c, el, cx, hy)
    contact(c, 40, 110, el)
    return c


def nine():  # tonberry-8 · thunder · the full weight borne to the threshold door, bowed
    el = "thunder"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    far_cx, far_y = corridor(c, el, vanish=40, near=118, mouth_w=72, far_w=22)
    # a great closed door looming at the end
    door(c, 40, 30, w=30, h=46, el=el)
    # storm-violet tension: hard white edges
    c.vline(24, 30, 76, p["bright"], a=120); c.vline(56, 30, 76, p["bright"], a=120)
    # a small figure halts before it, bowed under its weight, lantern raised
    cx, feet = 40, 110
    mini_tonberry(c, cx, feet, el, facing=-1, lant=False, h=1.0)
    # raised lantern toward the threshold
    lantern(c, cx - 9, feet - 18, r=13, s=0.85, scale=0.6)
    c.line(cx - 8, feet - 16, cx - 3, feet - 8, OUT)
    # the burden weighing it down — heavy hunch (dark mass on back)
    fe(c, cx + 4, feet - 9, 4, 5, shade(P["robe"], -0.3))
    E.atmosphere(c, el, 40, 50)
    contact(c, cx, feet, el)
    return c


def ten():  # tonberry-9 · earth · arrival completed; the whole procession / grave-flat slab
    el = "earth"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # a low stone chamber: heavy ceiling band + an open far door
    c.rect(0, 24, W, 8, p["stone_dk"])                            # ceiling
    door(c, 40, 30, w=16, h=26, el=el, glow=True)                # far door open beyond
    # a settled grave-flat slab, lantern set down upon it
    frect(c, 22, 100, 36, 7, p["stone"], OUT)
    c.rect(22, 100, 36, 2, p["stone_lt"])
    lantern(c, 30, 96, r=12, s=0.7, scale=0.6)                   # set-down lantern
    # a whole procession of tonberries: the march come full, overflow
    proc = [(13, 112, 0.8), (62, 116, 0.85), (40, 118, 1.0), (24, 120, 0.7), (54, 120, 0.7)]
    for (mx, mf, mh) in proc:
        mini_tonberry(c, mx, mf, el, facing=1 if mx < 40 else -1,
                      lant=(mh > 0.9), lant_r=10, h=mh)
    # dust drifting to rest
    c.dither_rect(0, 90, W, 30, p["stone_lt"], 0.05, a=90)
    E.atmosphere(c, el, 40, 95)
    return c


def freelancer():  # tonberry-10 · holy · a small plain tonberry at the mouth, first lantern
    el = "holy"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # soft gold-white from above blessing the first step
    c.glow(W // 2, 2, 64, p["glow"], 0.55)
    # the mouth of a long pale passage receding behind into bright unknown
    for y in range(20, 96):
        t = (y - 20) / 76
        half = round(4 + 26 * t)
        c.hline(40 - half, 40 + half, y, shade(p["sky_bot"], -0.06 + 0.10 * t))
    c.hline(40 - 4, 40 + 4, 20, p["bright"], a=160)              # far bright point
    # a small UNMARKED figure, plainly drawn (NO knife), freshly lit lantern held uncertainly
    cx, feet = 40, 110
    mini_tonberry(c, cx, feet, el, facing=-1, lant=True, lant_r=12, h=1.2)
    # a touch of blessing light on its dome
    c.glow(cx, feet - 18, 12, p["glow"], 0.3)
    E.atmosphere(c, el, cx, feet - 14)
    contact(c, cx, feet, el)
    return c


def knight():  # tonberry-11 · ice · advancing knife-raised, deliberate, disciplined
    el = "ice"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # frost-rimed crystalline corridor, sharp edges
    for k in range(5):
        c.line(6 + k, 30 + k * 14, 6 + k, 30 + k * 14 + 8, p["bright"], a=160)
        c.line(74 - k, 36 + k * 14, 74 - k, 36 + k * 14 + 8, p["bright"], a=160)
    corridor(c, el, vanish=34, near=104, mouth_w=66, far_w=14)
    # the armored figure striding with deliberate purpose, knife held level & sure
    cx, hy = chibi_tonberry(c, 38, 108, el)
    # raise the hero's own knife higher to read as "advancing, knife raised"
    chef_knife(c, cx + 13, 96)
    # a cold blade-glint on the lifted knife
    c.line(cx + 11, 92, cx + 12, 84, p["bright"], a=200)
    # breath fogging in the cold
    c.dither_rect(cx + 6, hy - 3, 6, 5, p["bright"], 0.4, a=120)
    E.atmosphere(c, el, cx, hy)
    contact(c, 38, 108, el)
    return c


def sage():  # tonberry-12 · water · still hooded elder, lantern held, deep calm water
    el = "water"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    water_band(c, 64, H, el)
    # vaulted chamber arch overhead
    for dx in range(-30, 31):
        c.set(40 + dx, 26 + round((1 - (dx / 30) ** 2) ** 0.5 * 14), p["stone_dk"])
    # slow caustics across walls
    c.dither_rect(0, 30, W, 36, p["glow"], 0.07, a=100)
    # dim remembered shapes in the depths, calm not threatening
    for (gx, gy) in [(14, 92), (66, 96), (40, 108)]:
        fe(c, gx, gy, 5, 3, P["skin_dk"], a=90)
    # the master, utterly still, holding the lantern, at home in the current
    cx, hy = chibi_tonberry(c, 40, 96, el)
    # submerge lower robe into water
    c.dither_rect(cx - 11, 88, 22, 10, shade(p["sky_bot"], -0.1), 0.6, a=140)
    # serene slow caustic glow around it
    c.glow(cx, hy, 14, p["glow"], 0.3)
    E.atmosphere(c, el, cx, hy)
    contact(c, 40, 96, el)
    return c


def warrior():  # tonberry-13 · wind · transfigured at the open door, lantern raised high
    el = "wind"; c = Canvas(W, H); flat_backdrop(c, el)
    p = E.ELEMENTS[el]
    # an open far door, pale luminous sky beyond pouring through
    c.glow(40, 16, 46, p["bright"], 0.75)
    frect(c, 27, 6, 26, 44, p["stone"], p["stone_dk"])          # door frame
    c.rect(31, 10, 18, 38, shade(p["bright"], 0.05))            # the bright opening
    for dy in range(38):                                         # light pouring out, fanning down
        t = dy / 38
        hw = round(9 + 8 * t)
        c.hline(40 - hw, 40 + hw, 48 + dy, p["bright"], a=max(0, 70 - dy * 2))
    # a bright scattering wind streaming down, carrying ash into pale sky
    for k in range(22):
        ax = 4 + (k * 53) % 72
        ay = 28 + (k * 41) % 78
        c.line(ax, ay, ax + 4, ay - 3, shade(p["accent"], 0.25), a=170)
    # the figure transfigured at the threshold — custom body so the lantern is RAISED HIGH (one only)
    cx, feet = 40, 114
    hy = feet - 26
    # green fish tail + feet
    capsule(c, [(cx + 7, feet - 9), (cx + 13, feet - 11), (cx + 16, feet - 9)], 2, P["skin"], OUT)
    fblob(c, cx - 4, feet - 2, 3, 2, P["skin"], OUT); fblob(c, cx + 4, feet - 2, 3, 2, P["skin"], OUT)
    # robe + X-stitch
    fblob(c, cx, feet - 12, 10, 11, P["robe"], OUT)
    cel(c, cx - 4, feet - 16, 3, 4, P["robe_lt"])
    c.line(cx - 3, feet - 13, cx + 3, feet - 8, P["robe_dk"]); c.line(cx + 3, feet - 13, cx - 3, feet - 8, P["robe_dk"])
    # hood + green head
    fblob(c, cx, hy - 1, 12, 11, P["robe"], OUT)
    c.line(cx, hy - 13, cx - 4, hy - 6, OUT); c.line(cx, hy - 13, cx + 4, hy - 6, OUT); fe(c, cx, hy - 9, 2, 3, P["robe"])
    fblob(c, cx, hy + 2, 9, 8, P["skin"], OUT); cel(c, cx - 3, hy - 1, 3, 3, P["skin_lt"])
    amber_eye(c, cx - 4, hy + 1, 3, P); amber_eye(c, cx + 4, hy + 1, 3, P)
    fblob(c, cx, hy + 6, 3, 2, P["skin"], OUT); c.hline(cx - 1, cx + 1, hy + 8, P["skin_dk"])
    # the knife kept low in the left hand (calm)
    blade(c, cx - 11, feet - 10, cx - 13, feet - 20, 3, P["blade"], OUT)
    fblob(c, cx - 10, feet - 10, 2, 2, P["skin"], OUT)
    # ONE radiant lantern raised HIGH in the right hand
    rx, ry = cx + 11, 64
    c.line(cx + 9, feet - 16, rx, ry + 5, OUT)                   # raised right arm
    fblob(c, cx + 9, feet - 15, 2, 2, P["skin"], OUT)           # green fist at shoulder
    lantern(c, rx, ry, r=26, s=1.0, scale=0.85)
    c.glow(rx, ry, 34, p["bright"], 0.45)
    # crown-glow of realization
    c.glow(cx, hy, 16, LANT, 0.4)
    E.atmosphere(c, el, rx, ry)
    contact(c, cx, feet, el)
    return c


CARDS = {
    "tonberry-0": ace,
    "tonberry-1": two,
    "tonberry-2": three,
    "tonberry-3": four,
    "tonberry-4": five,
    "tonberry-5": six,
    "tonberry-6": seven,
    "tonberry-7": eight,
    "tonberry-8": nine,
    "tonberry-9": ten,
    "tonberry-10": freelancer,
    "tonberry-11": knight,
    "tonberry-12": sage,
    "tonberry-13": warrior,
}
