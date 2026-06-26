"""
pixelkit — a tiny deliberate pixel-art compositor (Pillow).

Work at a small logical resolution (default 80x120, the 2:3 card ratio), place every
shape with intent, then nearest-neighbour upscale so pixels stay crisp. Colours are RGB
tuples; alpha is supported per-call for glows/fog/vignette.
"""
from PIL import Image
import math

W, H = 80, 120  # logical card size (2:3)

BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def _lerp(a, b, f):
    return (round(a[0] + (b[0] - a[0]) * f),
            round(a[1] + (b[1] - a[1]) * f),
            round(a[2] + (b[2] - a[2]) * f))


def shade(col, f):
    """f<0 darken toward black, f>0 lighten toward white."""
    if f < 0:
        return _lerp(col, (0, 0, 0), -f)
    return _lerp(col, (255, 255, 255), f)


class Canvas:
    def __init__(self, w=W, h=H, bg=(0, 0, 0)):
        self.w, self.h = w, h
        self.px = [[(bg[0], bg[1], bg[2]) for _ in range(w)] for _ in range(h)]

    def set(self, x, y, c, a=255):
        x = int(round(x)); y = int(round(y))
        if not (0 <= x < self.w and 0 <= y < self.h) or c is None:
            return
        if a >= 255:
            self.px[y][x] = (c[0], c[1], c[2])
        elif a > 0:
            bg = self.px[y][x]; t = a / 255
            self.px[y][x] = (round(c[0]*t+bg[0]*(1-t)), round(c[1]*t+bg[1]*(1-t)), round(c[2]*t+bg[2]*(1-t)))

    def rect(self, x, y, w, h, c, a=255):
        for yy in range(int(y), int(y+h)):
            for xx in range(int(x), int(x+w)):
                self.set(xx, yy, c, a)

    def fill(self, c):
        self.rect(0, 0, self.w, self.h, c)

    def hline(self, x0, x1, y, c, a=255):
        if x1 < x0: x0, x1 = x1, x0
        for x in range(int(x0), int(x1)+1): self.set(x, y, c, a)

    def vline(self, x, y0, y1, c, a=255):
        if y1 < y0: y0, y1 = y1, y0
        for y in range(int(y0), int(y1)+1): self.set(x, y, c, a)

    def line(self, x0, y0, x1, y1, c, a=255):
        x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)
        dx = abs(x1-x0); dy = -abs(y1-y0)
        sx = 1 if x0 < x1 else -1; sy = 1 if y0 < y1 else -1
        err = dx+dy
        while True:
            self.set(x0, y0, c, a)
            if x0 == x1 and y0 == y1: break
            e2 = 2*err
            if e2 >= dy: err += dy; x0 += sx
            if e2 <= dx: err += dx; y0 += sy

    def disc(self, cx, cy, r, c, a=255):
        for yy in range(int(cy-r), int(cy+r)+1):
            for xx in range(int(cx-r), int(cx+r)+1):
                if (xx-cx)**2 + (yy-cy)**2 <= r*r: self.set(xx, yy, c, a)

    def ring(self, cx, cy, r, c, a=255):
        steps = max(8, int(2*math.pi*r))
        for i in range(steps):
            t = 2*math.pi*i/steps
            self.set(cx+r*math.cos(t), cy+r*math.sin(t), c, a)

    # --- gradients & dithering ---
    def vgrad(self, x, y, w, h, top, bottom):
        for j in range(int(h)):
            col = _lerp(top, bottom, j/max(1, h-1))
            self.hline(x, x+w-1, y+j, col)

    def vgrad_dither(self, x, y, w, h, top, bottom):
        """two-tone bayer dither transition top->bottom (chunky retro)."""
        for j in range(int(h)):
            t = j/max(1, h-1)
            for i in range(int(w)):
                col = bottom if (BAYER4[(y+j) % 4][(x+i) % 4]+0.5)/16 < t else top
                self.set(x+i, y+j, col)

    def scatter(self, x, y, w, h, c, density, a=255, seed=1, falloff=0.0):
        """organic (hash-noise) scatter of c — clouds, sea, fog without the grid look.
        falloff>0 fades density from top (full) to bottom (full*(1-falloff))."""
        for j in range(int(h)):
            d = density * (1 - falloff * (j / max(1, h-1)))
            for i in range(int(w)):
                hh = ((x+i) * 73856093) ^ ((y+j) * 19349663) ^ (seed * 83492791)
                if (((hh >> 8) & 0xffff) / 0xffff) < d:
                    self.set(x+i, y+j, c, a)

    def dither_rect(self, x, y, w, h, c, density, a=255):
        """scatter c over the rect at bayer density 0..1 — texture/grain/fog."""
        for j in range(int(h)):
            for i in range(int(w)):
                if (BAYER4[(y+j) % 4][(x+i) % 4]+0.5)/16 < density:
                    self.set(x+i, y+j, c, a)

    # --- sprites: ASCII grid + palette map ---
    def sprite(self, x, y, art, pal, scale=1, flip=False):
        for j, row in enumerate(art):
            for i, ch in enumerate(row):
                if ch in (' ', '.'): continue
                col = pal.get(ch)
                if col is None: continue
                ii = (len(row)-1-i) if flip else i
                for sy in range(scale):
                    for sx in range(scale):
                        self.set(x+ii*scale+sx, y+j*scale+sy, col)

    # --- atmosphere ---
    def vignette(self, strength=0.5, col=(0, 0, 0)):
        cx, cy = self.w/2, self.h/2
        maxd = math.hypot(cx, cy)
        for yy in range(self.h):
            for xx in range(self.w):
                d = math.hypot(xx-cx, yy-cy)/maxd
                a = int(255*strength*max(0, d-0.45)/0.55)
                if a > 0: self.set(xx, yy, col, a)

    def glow(self, cx, cy, r, col, strength=0.7):
        for yy in range(int(cy-r), int(cy+r)+1):
            for xx in range(int(cx-r), int(cx+r)+1):
                d = math.hypot(xx-cx, yy-cy)/r
                if d <= 1:
                    self.set(xx, yy, col, int(255*strength*(1-d)**2))

    def reflect(self, x, y0, y1, water_y, tint=None, shimmer=0.5, fade=0.6):
        """mirror rows [y0,y1) downward from water_y into the water, dithered/faded."""
        for j in range(int(y1-y0)):
            src = self.px[int(y0+j)][:] if 0 <= y0+j < self.h else None
            ry = int(water_y + (int(y1)-1 - (y0+j)))
            if ry < 0 or ry >= self.h or src is None: continue
            f = j/max(1, y1-y0)
            for xx in range(x, min(self.w, x+0)) if False else range(self.w):
                if (BAYER4[ry % 4][xx % 4]+0.5)/16 < shimmer*(1-f*fade):
                    col = src[xx]
                    if tint: col = _lerp(col, tint, 0.4)
                    self.set(xx, ry, col)

    def save(self, path, scale=5):
        img = Image.new("RGB", (self.w, self.h))
        img.putdata([self.px[y][x] for y in range(self.h) for x in range(self.w)])
        img.resize((self.w*scale, self.h*scale), Image.NEAREST).save(path)


# ── Vico age palettes ────────────────────────────────────────────────────────
# Each age = a constrained palette + an implied light. Keys are semantic so card
# recipes read the same across ages; values differ to carry the age's mood.
AGES = {
    "gods": dict(
        sky_top=(22, 24, 34), sky_bot=(58, 54, 70), horizon=(92, 80, 96),
        ground=(14, 13, 20), ink=(8, 8, 12),
        bright=(247, 240, 205), accent=(232, 178, 70), ember=(214, 96, 38),
        stone=(70, 72, 88), stone_lt=(110, 112, 130), stone_dk=(38, 40, 54),
        figure=(16, 16, 22),
    ),
    "heroes": dict(
        sky_top=(46, 34, 74), sky_bot=(150, 92, 96), horizon=(214, 140, 86),
        ground=(40, 28, 44), ink=(20, 14, 26),
        bright=(244, 214, 150), accent=(206, 150, 70), ember=(196, 92, 70),
        stone=(120, 96, 76), stone_lt=(176, 140, 96), stone_dk=(74, 56, 56),
        figure=(28, 20, 34),
    ),
    "men": dict(
        sky_top=(176, 182, 180), sky_bot=(206, 204, 192), horizon=(214, 210, 196),
        ground=(150, 138, 116), ink=(58, 52, 46),
        bright=(238, 234, 220), accent=(150, 120, 70), ember=(140, 110, 84),
        stone=(150, 142, 126), stone_lt=(190, 184, 168), stone_dk=(108, 100, 86),
        figure=(70, 62, 56),
    ),
    "ricorso": dict(
        sky_top=(18, 26, 46), sky_bot=(70, 86, 112), horizon=(196, 168, 168),
        ground=(30, 40, 54), ink=(14, 18, 28),
        bright=(224, 214, 220), accent=(120, 170, 168), ember=(190, 130, 140),
        stone=(64, 78, 92), stone_lt=(120, 140, 150), stone_dk=(36, 46, 60),
        figure=(26, 32, 44),
    ),
}
