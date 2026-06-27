"""
Final Fantasy chibi pixel pack — the CHOCOBO suit (Boon·Journey): the road, motion, travel,
freedom, glad arrival, help on the way. 14 minors, chocobo-0 .. chocobo-13.

Element (station_slug) = palette + light only (flat_backdrop + ELEMENTS colors). The RANK shapes
the composition; the meaning text picks the scene. Single-subject ranks use chibi_chocobo; multiples
use mini_chocobo built from toolkit primitives. Flat fills, bold OUT outlines, big eyes — no gradients.
"""
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT, W, H,
                        flat_backdrop, contact)
from ff_chibi import chibi_chocobo
from ff_creatures import CHOCOBO as P
import ff_elements as E


# ── a simplified mini-chocobo: clear body + neck + head + beak + 3 crest feathers ─
def mini_chocobo(c, cx, feet, facing=1, scale=1.0, run=False, look=None):
    """A compact but READABLE chocobo for multi-subject cards. facing: +1 right, -1 left.
    Keeps minimum sizes so even small ones read as a bird (round body, neck, beaked head,
    crest). run: legs splayed mid-stride. Returns (cx, head_y)."""
    body = P["body"]; lt = P["light"]; bk = P["beak"]; bkd = P["beak_dk"]
    br = max(4, round(6 * scale))           # body radius
    hr = max(3, round(4 * scale))           # head radius
    by = feet - br - 2                       # body center
    hx = cx + facing * max(1, round(2*scale))
    hy = by - br - hr + 1                    # head center, set above body via a neck
    # legs
    if run:
        c.line(cx - 1, by + br - 1, cx - max(3, round(4*scale)), feet, OUT)
        c.line(cx + 1, by + br - 1, cx + max(3, round(4*scale)), feet, OUT)
    else:
        for lx in (cx - 2, cx + 1):
            c.rect(lx, by + br - 1, 2, feet - (by + br - 1), OUT)
        c.hline(cx - 4, cx - 1, feet, OUT); c.hline(cx + 1, cx + 4, feet, OUT)
    # tail plume (behind, away from facing)
    fblob(c, cx - facing * (br - 1), by - 1, max(2, round(3*scale)), max(3, round(4*scale)), P["dark"], OUT)
    # body
    fblob(c, cx, by, br, br, body, OUT)
    cel(c, cx - 2, by - 2, 2, 2, lt)
    # neck: connect body to the raised head
    c.line(cx, by - br + 1, hx, hy + hr - 1, OUT)
    c.line(cx + facing, by - br + 1, hx + facing, hy + hr - 1, body)
    # head
    fblob(c, hx, hy, hr, hr, body, OUT)
    # crest feathers, angled back (opposite facing)
    for i, dx in enumerate((-1, 0, 1)):
        fblob(c, hx - facing*2 + dx, hy - hr - 1, 1, 2, body, OUT)
    # eye + beak pointing in facing direction
    lk = look if look is not None else facing
    eye(c, hx + facing, hy - 1, max(2, hr - 1), look=lk)
    fblob(c, hx + facing * (hr + 1), hy + 1, 2, 1, bk, OUT)
    c.set(hx + facing * (hr + 1), hy + 1, bkd)
    return hx, hy


def _sky_glow(c, station, n=0):
    """A few element sparks/streaks in the upper sky."""
    p = E.ELEMENTS[station]
    pts = [(14, 18), (30, 12), (52, 16), (66, 22), (40, 26), (22, 30), (60, 34)]
    for (x, y) in pts[:n]:
        c.disc(x, y, 1, p["glow"], 200)


# ════════════════════════════════════════════════════════════════════════════════
# Ace (0) — fire — one chocobo rearing, a single spark of departure
def chocobo_0():
    c = Canvas(); st = "fire"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # the unlit road ahead, a dark ribbon running back to the smoldering horizon
    for k in range(14):
        y = 100 - k * 1
        w = 26 - k
        c.hline(40 - w//2, 40 + w//2, y, shade(p["ground"], -0.12 - k*0.01))
    cx, feet = 38, 102
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # crest-feathers flaring like a struck match: brighten the three crest tips
    for dx in (-5, 0, 5):
        c.disc(cx + dx, hy - 13, 1, p["bright"], 220)
        c.glow(cx + dx, hy - 13, 4, p["glow"], 0.35)
    # the single origin spark of departure, lifting from the head in a bright arc and
    # bursting brightest at the top — the road opening before the mind has chosen
    spark = [(50, 56), (56, 48), (52, 40), (60, 34), (54, 26), (62, 20)]
    for i, (x, y) in enumerate(spark):
        r = 1 if i < 4 else 2
        c.disc(x, y, r, p["bright"], 255)
        c.glow(x, y, 4 + i, p["glow"], 0.45)
    # the one big departure spark crowning it all
    c.disc(62, 18, 3, p["bright"], 255); c.glow(62, 18, 12, p["glow"], 0.6)
    contact(c, cx, feet, st, w=15)
    E.atmosphere(c, st, hx, hy)
    return c


# Two (1) — thunder — a pair: a fork of two roads, bird poised between
def chocobo_1():
    c = Canvas(); st = "thunder"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # two roads diverging from a near junction toward hard white distance (up-and-out)
    c.line(40, 114, 6, 92, shade(p["stone_lt"], 0.1))
    c.line(40, 114, 74, 92, shade(p["stone_lt"], 0.1))
    c.line(41, 114, 7, 93, p["bright"]); c.line(41, 114, 75, 93, p["bright"])
    # the two distant horizons each road runs to
    c.disc(7, 91, 2, p["bright"], 200); c.disc(73, 91, 2, p["bright"], 200)
    # a single fissure of light hanging above the junction
    c.line(40, 6, 36, 26, p["bright"], 230); c.line(36, 26, 42, 40, p["bright"], 210)
    c.glow(39, 24, 12, p["glow"], 0.35)
    cx, feet = 40, 104
    # forked double shadow first
    fe(c, cx - 10, feet + 2, 8, 2, p["ink"], a=80)
    fe(c, cx + 10, feet + 2, 8, 2, p["ink"], a=80)
    hx, hy = chibi_chocobo(c, cx, feet, st)
    E.atmosphere(c, st, 40, 30)
    return c


# Three (2) — earth — three steps of a trail: a chocobo + the worn path it made
def chocobo_2():
    c = Canvas(); st = "earth"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # patient mass of stone, low on the horizon (not competing with the trail)
    fblob(c, 64, 88, 11, 5, p["stone"], p["stone_dk"])
    # a fresh trail pressed into ochre grassland — a worn ribbon unspooling back from
    # the bird's feet to the horizon (the route it has MADE)
    for k in range(20):
        t = k / 19
        y = 100 - k
        px = round(54 - 36 * t)             # curves back to the left distance
        w = max(1, round(5 * (1 - t)))
        c.hline(px - w, px + w, y, shade(p["ground"], -0.16))
        c.hline(px - w, px - w + 1, y, shade(p["ground"], -0.26))
    # three clear paired footprints along the fresh trail — first solid evidence
    for (x, y) in [(48, 96), (40, 90), (33, 84)]:
        c.disc(x - 1, y, 1, shade(p["ground"], -0.32))
        c.disc(x + 1, y - 1, 1, shade(p["ground"], -0.32))
    cx, feet = 54, 100
    # looking back over the path it made (facing left)
    hx, hy = chibi_chocobo(c, cx, feet, st)
    contact(c, cx, feet, st, w=14)
    E.atmosphere(c, st, hx, hy)
    return c


# Four (3) — holy — a stable frame: gate ajar, harness hung, road beyond
def chocobo_3():
    c = Canvas(); st = "holy"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # the stable-yard: a foursquare frame of posts and a rail (a place, not a cage)
    post = p["stone_dk"]; postlt = p["stone"]
    for px in (10, 70):
        frect(c, px - 2, 70, 4, 36, postlt, post)
    frect(c, 8, 70, 64, 3, postlt, post)          # top rail across
    # the gate, standing pointedly ajar (right post swung open)
    frect(c, 56, 74, 3, 30, postlt, post)
    c.line(58, 76, 70, 96, post)                   # the open gate leaf, angled out
    c.line(59, 78, 71, 98, postlt)
    # road visible beyond the open gate
    c.line(64, 104, 78, 96, shade(p["ground"], -0.1))
    # halo of clean gold-white from above
    c.glow(40, 14, 40, p["glow"], 0.5)
    cx, feet = 38, 102
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # harness hung ready but unbuckled on the rail
    c.line(24, 73, 24, 84, p["ink"]); c.line(24, 84, 28, 80, p["ink"])
    c.disc(24, 73, 1, p["accent"])
    contact(c, cx, feet, st, w=14)
    E.atmosphere(c, st, 40, 16)
    return c


# Five (4) — ice — conflict/stall: bird flank-deep in frozen pass, momentum arrested
def chocobo_4():
    c = Canvas(); st = "ice"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # the glazed crystalline road ahead, sharp shards
    for (x, y, h) in [(14, 96, 8), (24, 100, 6), (58, 98, 7), (68, 102, 5), (40, 104, 5)]:
        c.line(x, y + h, x, y, p["bright"])
        c.line(x, y, x - 2, y + 4, shade(p["accent"], 0.1))
        c.line(x, y, x + 2, y + 4, shade(p["accent"], 0.1))
    cx, feet = 40, 100
    # snow piled flank-deep — drawn AFTER the bird so it buries the lower body
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # mute the plumage feel via a cold overlay band of drifting frost over the bird
    c.dither_rect(cx - 14, feet - 24, 28, 24, p["bright"], 0.12)
    # the snow drift burying the legs
    fblob(c, cx, feet - 2, 16, 6, p["bright"], p["stone_dk"])
    fe(c, cx, feet - 3, 14, 4, shade(p["bright"], -0.02))
    # one slow visible plume of breath, hanging and unmoving
    for i, (dx, dy) in enumerate([(8, -4), (11, -6), (14, -7), (17, -7)]):
        c.disc(cx + dx, hy + dy, 2 - (i // 3), p["bright"], 150 - i*20)
    E.atmosphere(c, st, hx, hy)
    return c


# Six (5) — water — exchange: rider and chocobo ford a river, hand at its neck
def chocobo_5():
    c = Canvas(); st = "water"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # the shallow teal river across the lower frame
    c.rect(0, 96, W, H - 96, shade(p["ground"], 0.08))
    c.dither_rect(0, 96, W, H - 96, p["glow"], 0.18)        # caustics
    for y in (100, 106, 112):
        c.hline(6, 74, y, p["bright"], 120)
    cx, feet = 40, 104
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # a simplified rider seated on the bird's BACK (low, to the right), clear of the
    # face; a trusting hand reaches forward to rest at the neck
    rx, ry = cx + 11, feet - 18
    fblob(c, rx, ry, 4, 7, p["stone"], OUT)                 # torso/cloak
    fblob(c, rx, ry - 9, 3, 3, p["stone_lt"], OUT)          # head
    cel(c, rx - 1, ry - 2, 1, 2, p["bright"])
    # the trusting hand resting at the bird's neck
    c.line(rx - 4, ry, cx + 5, feet - 22, p["stone_lt"])
    fblob(c, cx + 5, feet - 22, 1, 1, p["bright"], OUT)     # the hand
    # reflection doubling below the waterline
    fe(c, cx, feet + 6, 9, 4, shade(P["body"], -0.2), a=120)
    contact(c, cx, feet, st, w=14)
    E.atmosphere(c, st, hx, hy)
    return c


# Seven (6) — wind — lone chocobo at a threshold: running flat-out, alone on the plain
def chocobo_6():
    c = Canvas(); st = "wind"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # vast empty plain — push the single runner to the right of frame, lots of open
    # space at its back, the one figure in all that openness
    cx, feet = 50, 102
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # strong wind streaming crest and tail BACK (to the left) — long directional blur
    for (y, x0) in [(hy - 4, cx - 30), (hy + 8, cx - 26), (feet - 16, cx - 34),
                    (feet - 6, cx - 28)]:
        c.hline(x0, cx - 8, y, p["stone_lt"], 150)
        c.hline(x0 - 4, cx - 10, y + 1, p["bright"], 110)
    # loose grass and dust lifting and streaming away to the left
    for (x, y) in [(18, 100), (26, 104), (12, 108), (32, 110), (8, 102), (22, 112)]:
        c.disc(x, y, 1, p["stone_lt"], 180)
        c.set(x - 3, y, p["bright"], 120)
    contact(c, cx, feet, st, w=16)
    E.atmosphere(c, st, hx, hy)
    return c


# Eight (7) — dark — several in dynamic motion: a night ride racing into the unknown
def chocobo_7():
    c = Canvas(); st = "dark"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # void-violet country; the road already swallowed behind
    # three mini-chocobos racing right in a receding diagonal — accelerating into dark
    mini_chocobo(c, 16, 64, facing=1, scale=0.6, run=True)
    mini_chocobo(c, 38, 82, facing=1, scale=0.85, run=True)
    mini_chocobo(c, 60, 104, facing=1, scale=1.1, run=True)
    # speed streaks behind each, dissolving into near-black
    for (x, y, n) in [(8, 60, 5), (26, 78, 7), (44, 100, 10)]:
        for k in range(n):
            c.set(x - k*2, y, p["stone_lt"], 130 - k*12)
    # a single weak source of light glinting off the lead bird's eye/neck
    c.glow(66, 92, 11, p["glow"], 0.32)
    c.disc(66, 92, 1, p["bright"], 255)
    contact(c, 60, 104, st, w=13)
    E.atmosphere(c, st, 62, 98)
    return c


# Nine (8) — fire — heavy/laden near-fullness: laboring up the final slope at dusk
def chocobo_8():
    c = Canvas(); st = "fire"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # the final slope: a clear dark wedge of land rising to the upper-right (the crest)
    for x in range(0, W):
        sy = round(116 - x * 0.62)          # ground surface climbs to the right
        c.vline(x, max(0, sy), H, shade(p["ground"], -0.05))
        c.hline(x, x, sy, shade(p["accent"], -0.2))   # lit slope edge
    # a faint glow just over the crest at upper-right — the journey's end
    c.glow(72, 64, 15, p["glow"], 0.6)
    c.disc(72, 64, 4, p["bright"], 240)
    # bird planted on the slope, mid-frame, leaning up into the climb (facing right)
    cx, feet = 38, 94
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # hot rim-light edging the straining near (right) flank against the char-dark land
    for dy in range(-16, 14):
        c.set(cx + 14, hy + 14 + dy, p["accent"], 170)
        if dy % 2 == 0:
            c.set(cx + 15, hy + 14 + dy, p["glow"], 130)
    # ash drifting up on the heat-shimmered air
    for (x, y) in [(52, 50), (60, 42), (46, 38), (64, 52), (40, 34), (56, 60)]:
        c.disc(x, y, 1, p["accent"], 150)
    contact(c, cx, feet, st, w=15)
    E.atmosphere(c, st, hx, hy)
    return c


# Ten (9) — thunder — flock/overflow: one gallops home as a flock streams out past
def chocobo_9():
    c = Canvas(); st = "thunder"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # sky split by hard white light + bruised violet
    c.line(40, 0, 34, 30, p["bright"], 230); c.line(34, 30, 44, 48, p["bright"], 200)
    c.glow(38, 28, 16, p["glow"], 0.4)
    # the road full of birds coming and going — a streaming flock
    # flock heading OUT (facing right, away over the ridge), spread and receding small
    flock_out = [(50, 72, 0.55), (62, 66, 0.45), (44, 62, 0.5), (58, 54, 0.4), (70, 58, 0.38)]
    for (x, y, s) in flock_out:
        mini_chocobo(c, x, y, facing=1, scale=s, run=True)
    # one big chocobo galloping HOME (facing left toward us, foreground)
    mini_chocobo(c, 24, 104, facing=-1, scale=1.25, run=True)
    # double-shadowed relief from the charge in the air
    fe(c, 24, 106, 9, 2, p["ink"], a=70)
    fe(c, 30, 106, 9, 2, p["accent"], a=60)
    contact(c, 26, 104, st, w=14)
    E.atmosphere(c, st, 38, 30)
    return c


# Freelancer (10) — earth — plain lone fledgling: young, unsaddled, planted on solid ground
def chocobo_10():
    c = Canvas(); st = "earth"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # low grounded country: stone + dust, a flat horizon
    fblob(c, 14, 90, 9, 5, p["stone"], p["stone_dk"])
    fblob(c, 68, 92, 8, 4, p["stone"], p["stone_dk"])
    cx, feet = 40, 104
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # young & gangly: a single soft tuft where the full crest hasn't grown in (overdraw
    # the tall crest tips with sky, leave a stubby down-tuft)
    for dx in (-5, 0, 5):
        fe(c, cx + dx, hy - 13, 2, 3, p["sky_bot"])        # remove the tall crest
    fblob(c, cx, hy - 12, 2, 2, P["body"], OUT)            # one short fledgling tuft
    cel(c, cx - 1, hy - 13, 1, 1, P["light"])
    # all four toes spread firmly on the earth — planted, grounded, steady
    for tx in (cx - 7, cx - 3, cx + 3, cx + 7):
        c.disc(tx, feet, 1, P["foot"])
        c.set(tx, feet + 1, OUT)
    # a half-curious gaze toward a horizon it has not yet decided to run for
    c.disc(56, 88, 1, p["accent"], 200)                    # a far point on the horizon
    contact(c, cx, feet, st, w=16)
    E.atmosphere(c, st, hx, hy)
    return c


# Knight (11) — holy — active dash/deed: armored rider charges, message held high
def chocobo_11():
    c = Canvas(); st = "holy"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # halo of radiant gold-white from above; clean luminous road streaming away behind
    c.glow(40, 12, 44, p["glow"], 0.55)
    c.line(8, 110, 40, 94, p["bright"]); c.line(72, 112, 40, 94, p["bright"])
    cx, feet = 38, 100
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # rider in mail on its back, message/case held high
    rx, ry = cx + 2, hy + 6
    fblob(c, rx, ry, 4, 6, p["stone_lt"], OUT)             # mail torso (bright)
    fblob(c, rx, ry - 8, 3, 3, p["stone"], OUT)            # helmed head
    cel(c, rx - 1, ry - 1, 1, 2, p["bright"])              # blaze off the mail
    # the arm raised holding a sealed message high
    c.line(rx + 3, ry - 2, rx + 8, ry - 12, p["stone"])
    frect(c, rx + 6, ry - 16, 4, 4, p["bright"], p["accent"])   # the held message
    # motion: a few speed flecks trailing back-left
    for k in range(5):
        c.set(cx - 10 - k*2, hy + 10, p["bright"], 150 - k*20)
    contact(c, cx, feet, st, w=14)
    E.atmosphere(c, st, rx + 8, ry - 14)
    return c


# Sage (12) — ice — calm, centered chocobo: old, still, surveying a known country
def chocobo_12():
    c = Canvas(); st = "ice"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # a high frost-blue ridge; glazed trails quiet below
    frect(c, 0, 100, W, 20, shade(p["ground"], -0.04))
    for y in (104, 110, 116):
        c.hline(6, 74, y, p["bright"], 90)
    # distant peaks
    for (x, h) in [(14, 12), (40, 16), (66, 10)]:
        c.line(x - 8, 96, x, 96 - h, p["stone_lt"]); c.line(x, 96 - h, x + 8, 96, p["stone_lt"])
    cx, feet = 40, 98
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # eyes half-closed (overdraw lids) — calm, inward, knowing
    for ex in (cx - 5, cx + 5):
        c.hline(ex - 3, ex + 3, hy - 1, P["body"])
        c.hline(ex - 3, ex + 3, hy, OUT)                   # the lowered lid line
    # slow clear breath hanging in high-key pale light
    for i, (dx, dy) in enumerate([(8, -2), (11, -3), (14, -3)]):
        c.disc(hx + dx, hy + dy, 2, p["bright"], 120 - i*30)
    contact(c, cx, feet, st, w=15)
    E.atmosphere(c, st, hx, hy)
    return c


# Warrior of Light (13) — water — grand, radiant, crowned: legendary lead mount + line of riders
def chocobo_13():
    c = Canvas(); st = "water"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    # luminous coastal road; the sea running teal and bright beside it
    c.rect(0, 92, W, H - 92, shade(p["ground"], 0.1))
    c.dither_rect(0, 92, W, H - 92, p["glow"], 0.2)
    for y in (96, 104, 112):
        c.hline(0, W, y, p["bright"], 110)
    # the luminous road the company travels
    c.line(4, 116, 50, 90, shade(p["stone_lt"], 0.1))
    c.line(76, 118, 56, 90, shade(p["stone_lt"], 0.1))
    # a far shining horizon glow the lead bird looks toward
    c.glow(60, 80, 14, p["bright"], 0.5)
    # the long line of riders behind, receding small up the coastal road
    line_out = [(50, 90, 0.55), (60, 84, 0.45), (68, 80, 0.36), (74, 77, 0.3)]
    for (x, y, s) in line_out:
        hx2, hy2 = mini_chocobo(c, x, y, facing=1, scale=s)
        fblob(c, x, hy2 + max(2, round(4*s)), 1, 2, p["stone"], OUT)   # tiny rider
    # the magnificent lead chocobo, foreground, crowned and radiant
    cx, feet = 30, 108
    hx, hy = chibi_chocobo(c, cx, feet, st)
    # a radiant crown of light above the head — the realized capstone
    for dx, dy in [(-6, -6), (-3, -9), (0, -10), (3, -9), (6, -6)]:
        c.disc(hx + dx, hy + dy - 13, 1, p["bright"], 255)
        c.glow(hx + dx, hy + dy - 13, 4, p["glow"], 0.45)
    # caustics doubling the lead bird in the shallows
    fe(c, cx, feet + 6, 10, 4, shade(P["body"], -0.18), a=120)
    contact(c, cx, feet, st, w=16)
    E.atmosphere(c, st, hx, hy - 6)
    return c


CARDS = {
    "chocobo-0": chocobo_0, "chocobo-1": chocobo_1, "chocobo-2": chocobo_2,
    "chocobo-3": chocobo_3, "chocobo-4": chocobo_4, "chocobo-5": chocobo_5,
    "chocobo-6": chocobo_6, "chocobo-7": chocobo_7, "chocobo-8": chocobo_8,
    "chocobo-9": chocobo_9, "chocobo-10": chocobo_10, "chocobo-11": chocobo_11,
    "chocobo-12": chocobo_12, "chocobo-13": chocobo_13,
}
