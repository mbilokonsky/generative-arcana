"""
FF creatures — DIRECTION A: chibi / anime. Big heads, big eyes, bold dark outlines, flat cel fills
(one highlight tone). Clean curves (vector feel) + flat pixel fills. Creature stays flat; the element
lives in the backdrop.
"""
from ff_flatkit import fe, fblob, frect, eye, cel, capsule, blade, OUT, W, H
from ff_creatures import CHOCOBO, MOOGLE, CACTUAR, TONBERRY


def amber_eye(c, cx, cy, r, P):
    c.disc(cx, cy, r, OUT); c.disc(cx, cy, r - 1, P["eye"])
    c.set(cx, cy + 1, (130, 74, 20)); c.set(cx - 1, cy - 1, (255, 235, 180))


def chef_knife(c, hx, hy):
    """A big chef's knife: brown handle gripped at (hx, hy), grey blade pointed up, spine on the left."""
    grey, hi, wood = (214, 222, 230), (248, 252, 255), (104, 74, 48)
    frect(c, hx - 1, hy - 1, 3, 7, wood, OUT)               # handle
    c.hline(hx - 2, hx + 2, hy - 2, (150, 162, 172))        # bolster
    bx, y0, L = hx, hy - 3, 16
    for j in range(L + 1):
        t = j / L; y = y0 - j
        lx = round(bx - 2 + t); rx = round(bx + 3 - 4 * t)
        if rx < lx: rx = lx
        c.hline(lx, rx, y, grey)
        c.set(lx, y, hi)                                    # spine highlight
        c.set(lx - 1, y, OUT); c.set(rx + 1, y, OUT)        # blade outline
    c.hline(bx - 3, bx + 4, y0 + 1, OUT)                    # base
    c.set(bx - 1, y0 - L - 1, OUT)                          # tip


def chibi_chocobo(c, cx, feet, el):
    P = CHOCOBO
    # little body + legs
    c.rect(cx - 3, feet - 7, 2, 7, OUT); c.rect(cx + 2, feet - 7, 2, 7, OUT)
    c.hline(cx - 5, cx - 1, feet, OUT); c.hline(cx + 1, cx + 5, feet, OUT)
    fblob(c, cx, feet - 12, 8, 8, P["body"], OUT)
    # big head
    hy = feet - 26
    fblob(c, cx, hy, 13, 12, P["body"], OUT)
    cel(c, cx - 5, hy - 5, 4, 3, P["light"])
    # three crest feathers
    for dx in (-5, 0, 5):
        fblob(c, cx + dx, hy - 13, 2, 4, P["body"], OUT)
    # eyes + beak
    eye(c, cx - 5, hy, 4, look=1); eye(c, cx + 5, hy, 4, look=1)
    fblob(c, cx, hy + 6, 3, 2, P["beak"], OUT)
    c.set(cx, hy + 7, P["beak_dk"])
    return cx, hy


def chibi_moogle(c, cx, feet, el):
    P = MOOGLE
    # wings
    fblob(c, cx - 11, feet - 16, 4, 6, P["wing"], OUT); fblob(c, cx + 11, feet - 16, 4, 6, P["wing"], OUT)
    # body
    fblob(c, cx, feet - 10, 8, 8, P["body"], OUT)
    # big head
    hy = feet - 24
    fblob(c, cx, hy, 13, 12, P["body"], OUT)
    cel(c, cx - 5, hy - 5, 4, 3, P["light"])
    # ears
    fblob(c, cx - 9, hy - 9, 3, 4, P["body"], OUT); fblob(c, cx + 9, hy - 9, 3, 4, P["body"], OUT)
    c.set(cx - 9, hy - 9, P["pom"]); c.set(cx + 9, hy - 9, P["pom"])
    # eyes + mouth
    eye(c, cx - 5, hy, 4); eye(c, cx + 5, hy, 4)
    c.hline(cx - 1, cx + 1, hy + 6, OUT)
    # antenna + pom-pom
    c.vline(cx, hy - 12, hy - 17, OUT)
    fblob(c, cx, hy - 21, 4, 4, P["pom"], OUT); cel(c, cx - 1, hy - 22, 1, 1, (255, 200, 200))
    return cx, hy - 21


def chibi_cactuar(c, cx, feet, el):
    P = CACTUAR
    by = feet - 20
    # RIGHT-ANGLE limbs: a segment straight out from the body, then a 90-degree bend.
    # They emerge perpendicular and shoot to the sides — never crossing the body.
    capsule(c, [(cx + 6, by - 5), (cx + 13, by - 5), (cx + 13, by - 12)], 2, P["body"], OUT)   # right arm: out, then up
    capsule(c, [(cx - 6, by - 1), (cx - 13, by - 1), (cx - 13, by + 6)], 2, P["body"], OUT)    # left arm: out, then down
    capsule(c, [(cx + 4, by + 12), (cx + 9, by + 12), (cx + 9, by + 21)], 2, P["body"], OUT)   # right leg: out, then down
    capsule(c, [(cx - 4, by + 12), (cx - 9, by + 12), (cx - 9, by + 21)], 2, P["body"], OUT)   # left leg: out, then down
    # body drawn over the limb roots, so the limbs read as emerging from its sides
    fblob(c, cx, by, 7, 14, P["body"], OUT)
    cel(c, cx - 3, by - 6, 2, 4, P["light"])
    # head-top spikes
    for dx in (-3, 0, 3):
        c.line(cx + dx, by - 13, cx + dx, by - 18, P["dark"])
    # face: dot eyes + O mouth
    c.disc(cx - 3, by - 4, 1, P["face"]); c.disc(cx + 3, by - 4, 1, P["face"])
    c.ring(cx, by + 2, 2, P["face"])
    # body spines
    for (sx, sy) in ((-5, -8), (5, -2), (-5, 6), (4, 11)):
        c.set(cx + sx, by + sy, P["spine"])
    return cx, by - 4


def chibi_tonberry(c, cx, feet, el):
    P = TONBERRY
    hy = feet - 26
    # green fish tail (behind, right) with a fin
    capsule(c, [(cx + 7, feet - 9), (cx + 13, feet - 11), (cx + 16, feet - 9)], 2, P["skin"], OUT)
    c.line(cx + 16, feet - 13, cx + 20, feet - 15, OUT); c.line(cx + 16, feet - 5, cx + 20, feet - 15, OUT)
    fe(c, cx + 17, feet - 11, 2, 4, P["skin_lt"])
    # little green feet
    fblob(c, cx - 4, feet - 2, 3, 2, P["skin"], OUT); fblob(c, cx + 4, feet - 2, 3, 2, P["skin"], OUT)
    # tan burlap robe
    fblob(c, cx, feet - 12, 10, 11, P["robe"], OUT)
    cel(c, cx - 4, feet - 16, 3, 4, P["robe_lt"])
    # the signature X-stitch on the robe
    c.line(cx - 3, feet - 13, cx + 3, feet - 8, P["robe_dk"]); c.line(cx + 3, feet - 13, cx - 3, feet - 8, P["robe_dk"])
    # tan hood (sits over and behind the head), with a soft point
    fblob(c, cx, hy - 1, 12, 11, P["robe"], OUT)
    c.line(cx, hy - 13, cx - 4, hy - 6, OUT); c.line(cx, hy - 13, cx + 4, hy - 6, OUT); fe(c, cx, hy - 9, 2, 3, P["robe"])
    # the big round GREEN head in the hood's opening
    fblob(c, cx, hy + 2, 9, 8, P["skin"], OUT)
    cel(c, cx - 3, hy - 1, 3, 3, P["skin_lt"])
    # round amber eyes + snout + mouth
    amber_eye(c, cx - 4, hy + 1, 3, P); amber_eye(c, cx + 4, hy + 1, 3, P)
    fblob(c, cx, hy + 6, 3, 2, P["skin"], OUT); c.hline(cx - 1, cx + 1, hy + 8, P["skin_dk"])
    # lantern (left hand) — larger, brighter — held by a green hand
    lx, ly = cx - 14, feet - 11
    c.glow(lx, ly, 15, P["lantern"], 0.85)
    frect(c, lx - 3, ly - 5, 6, 9, P["lantern"], P["lantern_dk"])   # body
    c.rect(lx - 3, ly - 6, 6, 2, P["lantern_dk"])                   # top cap
    c.rect(lx - 2, ly - 4, 4, 7, (255, 250, 224))                   # bright core
    c.line(lx, ly - 6, cx - 8, feet - 14, OUT); fblob(c, cx - 9, feet - 13, 2, 2, P["skin"], OUT)
    # a big chef's knife held up in the right hand
    chef_knife(c, cx + 11, feet - 11)
    fblob(c, cx + 11, feet - 11, 2, 2, P["skin"], OUT)   # green fist gripping the handle
    return cx, hy
