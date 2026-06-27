"""
Final Fantasy chibi pixel pack — the MOOGLE suit (Boon - Place): hearth, home, community, shelter,
the saved moment, kupo-warmth.

Element (station_slug) = palette + light only, laid down by flat_backdrop and read from ELEMENTS.
Rank dictates the composition; meaning text dictates the scene. We use the chibi_moogle hero for
single-subject cards and simplified mini-moogles (round body + red pom) for multiples.

CARDS = {slug: fn} for moogle-0 .. moogle-13. Each fn() -> Canvas(80x120).
Render:  python tools/pixel/ff_build.py --suit moogle
"""
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT, W, H,
                        flat_backdrop, contact)
from ff_chibi import chibi_moogle
import ff_elements as E

MOOGLE = dict(body=(238, 232, 222), light=(255, 253, 248), dark=(198, 190, 178),
              pom=(226, 78, 88), pom_dk=(178, 52, 66), wing=(222, 216, 208))


# ── mini-moogle: a small simplified moogle from primitives (body + head + red pom) ─
def mini_moogle(c, cx, cy, s=1.0, look=0, face=True, pom=True):
    """A compact moogle centered head at (cx, cy). s scales it (~1.0 = 18px tall).
    Signature cue = the red pom on the antenna. Returns the pom (fx, fy)."""
    P = MOOGLE
    br = round(6 * s); hr = round(7 * s)
    # body just below the head
    fblob(c, cx, cy + hr + br - 2, br, br, P["body"], OUT)
    # tiny wings
    fblob(c, cx - br - 2, cy + hr, max(1, round(2 * s)), round(3 * s), P["wing"], OUT)
    fblob(c, cx + br + 2, cy + hr, max(1, round(2 * s)), round(3 * s), P["wing"], OUT)
    # head
    fblob(c, cx, cy, hr, round(hr * 0.92), P["body"], OUT)
    cel(c, cx - round(hr * 0.4), cy - round(hr * 0.4), max(1, round(2 * s)), max(1, round(1.4 * s)), P["light"])
    # ears
    er = max(1, round(2 * s))
    fblob(c, cx - hr + 1, cy - hr + 2, er, er + 1, P["body"], OUT)
    fblob(c, cx + hr - 1, cy - hr + 2, er, er + 1, P["body"], OUT)
    c.set(cx - hr + 1, cy - hr + 2, P["pom"]); c.set(cx + hr - 1, cy - hr + 2, P["pom"])
    if face:
        er2 = max(2, round(3 * s))
        eye(c, cx - round(hr * 0.45), cy, er2, look=look)
        eye(c, cx + round(hr * 0.45), cy, er2, look=look)
        c.hline(cx - 1, cx + 1, cy + round(hr * 0.55), OUT)
    # antenna + pom
    fx, fy = cx, cy - hr - round(7 * s)
    c.vline(cx, cy - hr, cy - hr - round(6 * s), OUT)
    if pom:
        fblob(c, fx, fy, round(3 * s), round(3 * s), P["pom"], OUT)
        c.set(fx - 1, fy - 1, (255, 200, 200))
    return fx, fy


# ── props ─────────────────────────────────────────────────────────────────────
def lamp(c, cx, cy, P, bright=True):
    """A small lantern: warm body, dark cap, glow. cy is the top of the lamp body."""
    warm = P["bright"]; warmd = shade(P["accent"], -0.1)
    if bright:
        c.glow(cx, cy + 5, 14, P["glow"], 0.6)
    frect(c, cx - 3, cy, 6, 8, warm, OUT)
    c.rect(cx - 3, cy - 2, 6, 2, OUT)          # cap
    c.set(cx, cy - 3, OUT)                       # ring
    if bright:
        c.rect(cx - 2, cy + 1, 4, 6, P["bright"])
        c.set(cx, cy + 3, (255, 255, 240))
    else:
        c.rect(cx - 2, cy + 1, 4, 6, shade(P["stone"], 0.0))
    c.rect(cx - 4, cy + 8, 8, 1, OUT)           # base


def hearth(c, cx, base, P, lit=True, ash=False):
    """A stone hearth/fireplace. base = floor line; cx = center."""
    st, stl, std = P["stone"], P["stone_lt"], P["stone_dk"]
    frect(c, cx - 13, base - 16, 26, 16, st, OUT)       # mantle block
    frect(c, cx - 9, base - 12, 18, 12, std, OUT)       # hearth opening (dark)
    if lit:
        # flames
        c.glow(cx, base - 4, 12, P["glow"], 0.7)
        for (dx, h, col) in ((-4, 5, P["accent"]), (0, 8, P["glow"]), (4, 6, P["accent"])):
            fblob(c, cx + dx, base - 3 - h // 2, 2, h // 2, col, shade(col, -0.2))
        fblob(c, cx, base - 3, 3, 2, P["bright"], P["accent"])
    elif ash:
        c.hline(cx - 6, cx + 6, base - 2, P["stone_dk"])
        c.set(cx, base - 3, P["glow"])              # one weak ember
        c.set(cx + 1, base - 3, shade(P["glow"], -0.2))
    # logs
    c.hline(cx - 5, cx + 5, base - 1, shade((104, 74, 48), 0.0))


def letter(c, x, y, P, ang=0):
    """A small envelope/letter."""
    fr = (244, 240, 230)
    frect(c, x, y, 9, 6, fr, OUT)
    c.line(x, y, x + 4, y + 3, OUT); c.line(x + 8, y, x + 4, y + 3, OUT)
    c.set(x + 7, y + 4, MOOGLE["pom"])  # a little red seal


def crate(c, x, y, w, h, P):
    frect(c, x, y, w, h, P["stone_lt"], OUT)
    c.line(x, y, x + w - 1, y + h - 1, shade(P["stone"], -0.1))
    c.line(x + w - 1, y, x, y + h - 1, shade(P["stone"], -0.1))


def floor_band(c, P, y=104, h=16):
    """A warm interior floor strip over the backdrop ground."""
    c.rect(0, y, W, h, shade(P["stone_dk"], -0.05))
    c.dither_rect(0, y, W, 3, P["stone"], 0.4)
    c.hline(0, W - 1, y, OUT)


def window(c, x, y, P, frost=False, storm=False, night=False):
    """A window on the back wall."""
    pane = P["sky_bot"] if not night else shade(P["sky_top"], -0.1)
    frect(c, x, y, 14, 16, pane, OUT, lw=1)
    c.vline(x + 7, y, y + 15, OUT); c.hline(x, x + 13, y + 7, OUT)
    if frost:
        for (px, py) in ((x + 1, y + 1), (x + 9, y + 1), (x + 1, y + 9), (x + 11, y + 12)):
            c.set(px, py, P["bright"]); c.set(px + 1, py, P["bright"])
    if storm:
        c.line(x + 4, y + 1, x + 2, y + 8, P["bright"])
        c.line(x + 2, y + 8, x + 6, y + 14, P["bright"])
    if night:
        c.set(x + 3, y + 3, P["glow"]); c.set(x + 10, y + 5, P["bright"])


# ── helper to start a card ──────────────────────────────────────────────────────
def base(station):
    c = Canvas(W, H)
    flat_backdrop(c, station)
    return c, E.ELEMENTS[station]


# ══════════════════════════════════════════════════════════════════════════════
# THE 14 CARDS
# ══════════════════════════════════════════════════════════════════════════════

def ace():
    """Ace / holy — one moogle claims a bare room; the first lamp lit, grace from above."""
    st = "holy"; c, P = base(st)
    floor_band(c, P, y=104, h=16)
    # bare pale wall already washed in grace from above
    c.glow(W // 2, 6, 64, P["glow"], 0.5)
    # the single lit lamp on a small stand, warm bloom against the pale room
    lx, ly = 52, 74
    frect(c, lx - 3, 90, 6, 14, P["stone_lt"], OUT)   # little stand
    c.glow(lx, ly + 5, 26, P["accent"], 0.55)
    c.glow(lx, ly + 5, 16, P["glow"], 0.9)
    lamp(c, lx, ly, P, bright=True)
    c.rect(lx - 2, ly + 1, 4, 6, P["bright"])         # extra-bright core
    c.set(lx, ly + 3, (255, 255, 245))
    # a folded blanket on the bare floor
    frect(c, 18, 98, 12, 5, shade(P["stone"], 0.05), OUT)
    c.hline(18, 29, 100, shade(P["stone_lt"], 0.0))
    # one moogle, hand cupped toward the lamp's light
    fx, fy = mini_moogle(c, 30, 78, s=1.3, look=1)
    contact(c, 30, 104, st, w=11)
    contact(c, lx, 104, st, w=8)
    E.atmosphere(c, st, lx, ly + 4)
    return c


def two():
    """Two / ice — a pair on either side of a banked hearth, the home held still."""
    st = "ice"; c, P = base(st)
    floor_band(c, P, y=104, h=16)
    window(c, 33, 30, P, frost=True)
    # low banked hearth between them
    hearth(c, W // 2, 104, P, lit=False, ash=True)
    # two moogles facing inward
    mini_moogle(c, 18, 84, s=1.0, look=1)
    mini_moogle(c, 62, 84, s=1.0, look=-1)
    contact(c, 18, 104, st, w=8); contact(c, 62, 104, st, w=8)
    E.atmosphere(c, st, W // 2, 100)
    return c


def three():
    """Three / water — three around a laden table, the shared meal, first growth."""
    st = "water"; c, P = base(st)
    floor_band(c, P, y=106, h=14)
    # table with steaming bowls
    frect(c, 24, 92, 32, 4, shade((104, 74, 48), 0.1), OUT)   # table top
    c.vline(27, 96, 105, OUT); c.vline(52, 96, 105, OUT)      # legs
    for bx in (30, 40, 50):
        fblob(c, bx, 90, 3, 2, P["bright"], OUT)              # bowl
        for s in range(3):
            c.set(bx, 86 - s, P["bright"], 150)               # steam
    fblob(c, 40, 88, 2, 4, P["stone_lt"], OUT)               # pitcher
    # three moogles gathered round
    mini_moogle(c, 18, 76, s=0.9, look=1)
    mini_moogle(c, 40, 70, s=0.95, look=0)
    mini_moogle(c, 62, 76, s=0.9, look=-1)
    contact(c, 40, 106, st, w=20)
    E.atmosphere(c, st, 40, 92)
    return c


def four():
    """Four / wind — a snug foursquare cottage holds against scouring wind; lamp steady within."""
    st = "wind"; c, P = base(st)
    # streaming wind
    for k in range(5):
        c.dither_rect(0, 16 + k * 12, W, 1, P["stone_lt"], 0.6)
        c.line(4, 18 + k * 12, 22, 16 + k * 12, P["bright"], 120)
    floor_band(c, P, y=108, h=12)
    cx = W // 2
    # the cottage: a solid foursquare frame, walls below the roofline
    frect(c, cx - 18, 58, 36, 50, P["stone_lt"], OUT)         # walls
    # solid pitched roof, fully covering the wall top
    for j in range(15):
        c.hline(cx - 20 + j, cx + 20 - j, 58 - 15 + j, P["stone_dk"])
    c.line(cx - 20, 58, cx, 43, OUT); c.line(cx + 20, 58, cx, 43, OUT)
    c.hline(cx - 20, cx + 20, 58, OUT)
    # door (latched firm)
    frect(c, cx - 6, 88, 12, 20, shade(P["stone_dk"], -0.1), OUT)
    c.set(cx + 3, 98, P["accent"])                            # latch
    # lit window, warm interior glowing against the washed-out outside
    warm = (255, 224, 150)
    frect(c, cx + 2, 66, 13, 16, warm, OUT)
    c.vline(cx + 8, 66, 81, OUT); c.hline(cx + 2, cx + 14, 74, OUT)
    c.glow(cx + 8, 74, 14, (255, 200, 110), 0.5)
    # a calm moogle silhouetted tending a steady lamp, inside the window
    fblob(c, cx + 5, 75, 3, 3, shade(P["stone_dk"], 0.05), None)
    c.set(cx + 4, 74, MOOGLE["pom"])
    c.disc(cx + 11, 76, 1, (255, 250, 220))           # the steady lamp flame
    contact(c, cx, 108, st, w=22)
    E.atmosphere(c, st, cx + 8, 74)
    return c


def five():
    """Five / dark — the lamp gone out: a lone moogle huddles in a near-dark room, one weak ember."""
    st = "dark"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    # heavy gloom swallows the corners
    c.scatter(0, 0, W, H, P["ink"], 0.20, seed=12, a=140)
    # dead hearth with one weak ember (the only light)
    hearth(c, 54, 108, P, lit=False, ash=True)
    c.glow(54, 104, 12, P["glow"], 0.45)
    c.set(54, 105, P["glow"]); c.set(55, 105, shade(P["glow"], 0.2))
    # a toppled stool (disruption of the home)
    c.line(18, 104, 26, 96, OUT); c.line(26, 96, 30, 102, OUT)
    c.line(26, 96, 22, 104, OUT)
    # the lone moogle, huddled, just barely lit by the ember on its near side
    fx, fy = mini_moogle(c, 30, 84, s=1.1, look=1, pom=True)
    c.set(38, 86, P["glow"], 120); c.set(38, 90, P["glow"], 90)   # faint ember-rim
    # gloom over the far corner
    c.scatter(0, 40, 26, 60, P["ink"], 0.28, seed=5, a=140)
    contact(c, 30, 108, st, w=11)
    E.atmosphere(c, st, 54, 104)
    return c


def six():
    """Six / fire — moogles pass loaves & mugs around a bright open hearth; reciprocity."""
    st = "fire"; c, P = base(st)
    floor_band(c, P, y=106, h=14)
    # big bright hearth at center-back
    hearth(c, W // 2, 92, P, lit=True)
    c.glow(W // 2, 80, 30, P["glow"], 0.35)
    # ash drifting up
    c.scatter(28, 30, 24, 50, P["glow"], 0.04, seed=8, a=150)
    # two moogles exchanging a loaf hand-to-hand
    mini_moogle(c, 18, 82, s=1.0, look=1)
    mini_moogle(c, 62, 82, s=1.0, look=-1)
    # the passed loaf + a mug, between them
    fblob(c, 40, 88, 4, 2, P["accent"], OUT)          # loaf
    fblob(c, 31, 90, 2, 2, P["stone_lt"], OUT)        # mug
    fblob(c, 49, 90, 2, 2, P["stone_lt"], OUT)
    contact(c, 18, 106, st, w=9); contact(c, 62, 106, st, w=9)
    E.atmosphere(c, st, W // 2, 88)
    return c


def seven():
    """Seven / thunder — a lone moogle keeps vigil in a dark shop as a storm presses the window."""
    st = "thunder"; c, P = base(st)
    floor_band(c, P, y=106, h=14)
    c.scatter(0, 0, W, 80, P["ink"], 0.28, seed=4, a=140)
    # the storm bolt outside the window
    window(c, 48, 26, P, storm=True, night=True)
    c.line(60, 4, 54, 24, P["bright"], 200); c.line(54, 24, 60, 40, P["bright"], 180)
    c.glow(57, 24, 16, P["glow"], 0.35)
    # the shop counter the keeper rests a paw on
    frect(c, 6, 90, 40, 6, shade((104, 74, 48), 0.0), OUT)
    c.vline(10, 96, 105, OUT); c.vline(42, 96, 105, OUT)
    fblob(c, 30, 88, 3, 2, P["stone_lt"], OUT)   # the lit save-point crystal on the counter
    c.set(30, 87, P["bright"])
    # the lone keeper, awake, vigilant, raised behind the counter
    fx, fy = mini_moogle(c, 22, 70, s=1.15, look=0, pom=True)
    contact(c, 22, 105, st, w=12)
    E.atmosphere(c, st, 57, 30)
    return c


def eight():
    """Eight / earth — busy craft: a moogle works a well-stocked shop, restacking crates, tallying."""
    st = "earth"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    # heavy shelves of crates (solid mass, accelerating industry)
    for row, ry in enumerate((52, 72)):
        for cx0 in range(6, 70, 16):
            crate(c, cx0, ry, 13, 14, P)
    # dust hanging gold
    c.scatter(0, 30, W, 50, P["glow"], 0.05, seed=5, a=110)
    # the working moogle mid-stride, lifting a crate, ledger nearby
    mini_moogle(c, 40, 88, s=1.05, look=1, pom=True)
    crate(c, 50, 90, 11, 12, P)                       # crate being moved
    frect(c, 22, 92, 7, 9, (244, 240, 230), OUT)      # the ledger
    c.hline(23, 27, 95, OUT); c.hline(23, 27, 98, OUT)
    contact(c, 40, 108, st, w=12)
    E.atmosphere(c, st, 40, 88)
    return c


def nine():
    """Nine / holy — the laden hearth near-full: keeper in a warm doorway raising a lamp for the last one."""
    st = "holy"; c, P = base(st)
    floor_band(c, P, y=106, h=14)
    c.glow(W // 2, 10, 50, P["glow"], 0.3)
    # the warm doorway, interior already bright behind
    frect(c, 30, 50, 28, 56, shade(P["glow"], 0.05), OUT)   # bright interior
    frect(c, 30, 50, 28, 56, None)                          # (frame only)
    c.rect(30, 50, 28, 2, OUT); c.vline(30, 50, 105, OUT); c.vline(57, 50, 105, OUT)
    # light streaming out and down the steps
    c.glow(44, 72, 26, P["glow"], 0.5)
    for s in range(3):
        c.hline(28 - s * 4, 60 + s * 4, 106 + s * 3, shade(P["glow"], 0.0), 90)
    # the keeper holding a raised lamp into the night
    fx, fy = mini_moogle(c, 44, 70, s=1.0, look=0, pom=True)
    lamp(c, 56, 60, P, bright=True)
    c.line(50, 70, 56, 64, OUT)                             # raised arm to lamp
    contact(c, 44, 106, st, w=12)
    E.atmosphere(c, st, 56, 64)
    return c


def ten():
    """Ten / ice — a whole gathered household; the eldest passing a key down; the home complete & full."""
    st = "ice"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    window(c, 8, 24, P, frost=True); window(c, 58, 24, P, frost=True)
    # laden shelves behind
    frect(c, 26, 44, 28, 5, P["stone_lt"], OUT)
    for bx in range(29, 52, 6):
        fblob(c, bx, 42, 2, 2, P["stone"], OUT)
    c.glow(W // 2, 30, 24, P["glow"], 0.2)
    # a whole crowd of moogles, varied sizes
    mini_moogle(c, 14, 88, s=0.8, look=1)
    mini_moogle(c, 66, 88, s=0.8, look=-1)
    mini_moogle(c, 28, 80, s=0.75, look=0)
    mini_moogle(c, 52, 80, s=0.75, look=0)
    # the elder (center, larger) pressing a key into a younger paw
    fx, fy = mini_moogle(c, 40, 76, s=1.0, look=0, pom=True)
    c.set(40, 96, P["accent"]); c.set(41, 96, P["accent"]); c.set(40, 97, P["accent"])  # the key
    contact(c, 40, 108, st, w=30)
    E.atmosphere(c, st, 40, 90)
    return c


def freelancer():
    """Freelancer / water — a young moogle improvises a first nest in a borrowed corner; raw warmth."""
    st = "water"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    c.scatter(0, 20, W, 80, P["glow"], 0.05, seed=9, a=90)   # faint caustics
    cx = 40
    # a borrowed corner: two faint walls meeting
    c.vline(8, 40, 108, shade(P["stone_dk"], 0.05), 120)
    # a single draped blanket making a first nest
    for j in range(12):
        c.hline(cx - 16 + j // 2, cx + 16, 94 + j, shade(P["stone"], 0.06 - j * 0.01))
    c.hline(cx - 16, cx + 16, 94, OUT)
    fblob(c, cx - 10, 92, 5, 3, P["stone_lt"], OUT)         # a pillow heaped up
    fblob(c, cx + 12, 100, 3, 2, P["bright"], OUT)          # one little bowl set out
    # the lone plain beginner moogle, all potential, settling in
    fx, fy = mini_moogle(c, cx - 4, 78, s=1.2, look=0, pom=True)
    contact(c, cx - 4, 108, st, w=13)
    E.atmosphere(c, st, cx, 88)
    return c


def knight():
    """Knight / wind — a moogle braces a traveling awning open against a hard wind; care as valor, errand."""
    st = "wind"; c, P = base(st)
    # hard streaming wind
    for k in range(6):
        c.dither_rect(0, 12 + k * 13, W, 1, P["stone_lt"], 0.6)
        c.line(2, 14 + k * 13, 24, 11 + k * 13, P["bright"], 120)
    floor_band(c, P, y=108, h=12)
    cx = 46
    # a traveling refuge pitched on open ground: a slanted canvas awning roof
    canvas = shade(P["accent"], 0.0); canvasd = shade(P["accent"], -0.18)
    # the awning: a parallelogram roof tilted by the gust
    for j in range(16):
        c.hline(cx - 22 + j, cx + 14 + j, 50 + j, canvas)
    c.line(cx - 22, 50, cx + 14, 50, OUT); c.line(cx - 6, 66, cx + 30, 66, OUT)
    c.line(cx - 22, 50, cx - 6, 66, OUT); c.line(cx + 14, 50, cx + 30, 66, OUT)
    c.dither_rect(cx - 12, 54, 24, 8, canvasd, 0.4)         # canvas seams
    # far support pole, planted firm
    c.vline(cx + 26, 66, 104, OUT); c.vline(cx + 27, 66, 104, P["stone_lt"])
    # the near pole the keeper braces, leaning into the wind
    c.line(cx - 18, 52, cx - 6, 100, OUT); c.line(cx - 17, 52, cx - 5, 100, P["stone_lt"])
    # streaming pennant off the high corner
    c.line(cx + 14, 48, cx + 26, 45, MOOGLE["pom"]); c.line(cx + 26, 45, cx + 21, 49, MOOGLE["pom"])
    # the keeper, fur streaming, planting the refuge
    fx, fy = mini_moogle(c, cx - 12, 78, s=1.05, look=1, pom=True)
    contact(c, cx - 12, 108, st, w=12); contact(c, cx + 26, 104, st, w=8)
    E.atmosphere(c, st, cx, 60)
    return c


def sage():
    """Sage / dark — a calm elder moogle sits at ease in a near-dark room; mastery, the quiet root."""
    st = "dark"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    c.scatter(0, 0, W, H, P["ink"], 0.22, seed=7, a=140)
    # the home's shapes barely surface from deep negative space
    c.rect(54, 56, 20, 4, shade(P["stone_dk"], 0.05), 80)   # a faint shelf
    c.vline(60, 56, 92, shade(P["stone_dk"], 0.0), 50)
    c.rect(6, 92, 14, 16, shade(P["stone_dk"], 0.05), 70)   # a faint chair
    # one faint source glinting in the elder's calm eyes
    c.glow(40, 70, 16, P["glow"], 0.35)
    c.set(28, 70, P["bright"]); c.set(28, 71, P["glow"])    # a small steady source, low-left
    c.glow(28, 70, 8, P["glow"], 0.5)
    # the elder, seated at perfect ease, hands folded, calm
    fx, fy = mini_moogle(c, 40, 76, s=1.25, look=-1, pom=True)
    # folded paws, resting in the lap
    fblob(c, 40, 96, 5, 3, shade(MOOGLE["body"], -0.1), OUT)
    c.hline(37, 43, 96, OUT)
    contact(c, 40, 108, st, w=14)
    E.atmosphere(c, st, 28, 70)
    return c


def warrior_of_light():
    """Warrior of Light / fire — a grand radiant moogle, arms wide, a roaring hearth, a gathered crowd."""
    st = "fire"; c, P = base(st)
    floor_band(c, P, y=108, h=12)
    cx = W // 2
    # the great roaring hearth behind, a communal hall
    frect(c, cx - 16, 40, 32, 60, shade(P["stone"], -0.05), OUT)
    frect(c, cx - 11, 46, 22, 50, P["stone_dk"], OUT)
    c.glow(cx, 70, 34, P["glow"], 0.85)
    for (dx, h, col) in ((-7, 16, P["accent"]), (-2, 26, P["glow"]), (4, 20, P["accent"]), (8, 14, P["glow"])):
        fblob(c, cx + dx, 88 - h // 2, 3, h // 2, col, shade(col, -0.2))
    fblob(c, cx, 88, 5, 3, P["bright"], P["accent"])
    # drifting ash + rim-lit gold air
    c.scatter(cx - 20, 20, 40, 70, P["glow"], 0.05, seed=8, a=160)
    # a crowd of gathered figures of every kind (small mini-moogles at the base, varied)
    for (mx, ms) in ((10, 0.6), (22, 0.55), (58, 0.55), (70, 0.6)):
        mini_moogle(c, mx, 96, s=ms, look=0, face=True)
    # arms flung wide (drawn under the hero so they read as emerging from the body)
    capsule(c, [(cx - 7, 90), (cx - 16, 82)], 2, MOOGLE["body"], OUT)
    capsule(c, [(cx + 7, 90), (cx + 16, 82)], 2, MOOGLE["body"], OUT)
    # THE radiant hero moogle, arms flung wide, crowned by light
    fx, hy = chibi_moogle(c, cx, 100, st)
    # a radiant crown of light
    c.glow(cx, hy, 18, P["glow"], 0.6)
    for a in range(-2, 3):
        c.line(cx + a * 5, hy - 4, cx + a * 7, hy - 12, P["bright"], 160)
    contact(c, cx, 108, st, w=18)
    E.atmosphere(c, st, cx, hy)
    return c


CARDS = {
    "moogle-0": ace,
    "moogle-1": two,
    "moogle-2": three,
    "moogle-3": four,
    "moogle-4": five,
    "moogle-5": six,
    "moogle-6": seven,
    "moogle-7": eight,
    "moogle-8": nine,
    "moogle-9": ten,
    "moogle-10": freelancer,
    "moogle-11": knight,
    "moogle-12": sage,
    "moogle-13": warrior_of_light,
}
