"""Designed 1200x630 share cards, one per product, written to public/assets/bmp/share/.

Link unfurlers (WhatsApp, Facebook, X, iMessage) only ever show one still image, and a raw
portrait product crop reads as an accident in a landscape card. These compose the real photo
with the brand's own typography and palette so a shared link looks deliberate.

Run after build_media.py. Fonts are the same Bodoni Moda / Manrope the site loads.
"""
import json
import os
import textwrap

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "public", "assets", "bmp")
OUT = os.path.join(ASSETS, "share")
FONTS = os.path.join(ROOT, "scripts", "fonts")

W, H = 1200, 630
PERI = (129, 143, 217)
PERI_LO = (108, 122, 198)
NAVY = (29, 26, 65)
BONE = (244, 240, 233)
GOLD = (201, 169, 97)
GOLD_HI = (224, 206, 122)

PHOTO_W = 497          # right-hand photo panel
PAD = 64


def font(name, size, weight, opsz=None):
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    axes = f.get_variation_axes()
    f.set_variation_by_axes([weight, opsz if opsz is not None else size][: len(axes)])
    return f


def draw_naira_price(d, xy, amount, f, fill):
    """Neither Bodoni Moda nor Manrope carries U+20A6, and the tofu box it produced looked
    broken on the card. The sign is an N with two bars, so draw it from the same font."""
    x, y = xy
    n_w = d.textlength("N", font=f)
    d.text((x, y), "N", font=f, fill=fill)

    box = f.getbbox("N")
    cap_top, cap_bottom = y + box[1], y + box[3]
    cap = cap_bottom - cap_top
    bar = max(2, round(cap * 0.075))
    over = n_w * 0.11
    for frac in (0.36, 0.60):
        by = round(cap_top + cap * frac)
        d.rectangle([x - over, by, x + n_w + over, by + bar], fill=fill)

    d.text((x + n_w + n_w * 0.22, y), "{:,}".format(amount), font=f, fill=fill)
    return x + n_w + n_w * 0.22 + d.textlength("{:,}".format(amount), font=f)


def fit_cover(im, w, h):
    s = max(w / im.width, h / im.height)
    nw, nh = round(im.width * s), round(im.height * s)
    im = im.resize((nw, nh), Image.LANCZOS)
    # bias the crop upward: on a standing figure the face and bodice matter more than the hem
    top = max(0, round((nh - h) * 0.28))
    left = (nw - w) // 2
    return im.crop((left, top, left + w, top + h))


def tracked(draw, xy, text, f, fill, tracking=0):
    """Letter-spaced text: PIL has no tracking, and the brand's eyebrows depend on it."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + tracking
    return x


def build(photo_path, title, price, category_label):
    photo = ImageOps.exif_transpose(Image.open(photo_path)).convert("RGB")

    # Base: the photo itself, blown out and blurred, so the card's colour comes from the piece
    base = fit_cover(photo, W, H).filter(ImageFilter.GaussianBlur(42))
    card = Image.blend(base, Image.new("RGB", (W, H), PERI), 0.72)

    # Vertical brand wash on the copy side
    wash = Image.new("RGB", (W, H), PERI_LO)
    mask = Image.linear_gradient("L").rotate(90, expand=True).resize((W, H))
    card = Image.composite(card, wash, mask)

    # Photo panel, bled to the right edge with a soft hand-off into the copy side
    panel = fit_cover(photo, PHOTO_W, H)
    feather = Image.new("L", (PHOTO_W, H), 255)
    fd = ImageDraw.Draw(feather)
    for i in range(110):                       # horizontal fade on the panel's left edge
        fd.line([(i, 0), (i, H)], fill=int(255 * (i / 110) ** 1.5))
    card.paste(panel, (W - PHOTO_W, 0), feather)

    d = ImageDraw.Draw(card, "RGBA")

    # Keep type legible over whatever the photo is doing
    d.rectangle([0, 0, W - PHOTO_W + 150, H], fill=(29, 26, 65, 92))

    x = PAD
    tracked(d, (x, 60), "BMP CLOTHINGS", font("Manrope.ttf", 21, 700), GOLD_HI, 4.2)
    d.line([(x, 102), (x + 92, 102)], fill=GOLD, width=2)

    # Title: Bodoni, wrapped to the copy column, bottom-anchored above the price
    title_f = font("BodoniModa.ttf", 60, 600, 72)
    col = W - PHOTO_W - PAD + 70
    lines, line = [], ""
    for word in title.split():
        probe = (line + " " + word).strip()
        if d.textlength(probe, font=title_f) <= col:
            line = probe
        else:
            lines.append(line)
            line = word
    lines.append(line)
    if len(lines) > 3:
        lines = lines[:3]
        lines[-1] = lines[-1].rstrip(" ,") + "…"

    y = 170
    for ln in lines:
        d.text((x, y), ln, font=title_f, fill=BONE)
        y += 70

    y = max(y + 16, 420)
    tracked(d, (x, y), category_label.upper(), font("Manrope.ttf", 17, 600), (244, 240, 233, 170), 3.4)

    draw_naira_price(d, (x, y + 34), price, font("BodoniModa.ttf", 58, 700, 60), GOLD_HI)

    # Footer: the action, since a share is usually the first thing a new customer sees
    tracked(d, (x, H - 74), "ORDER ON WHATSAPP  ·  0901 962 4520",
            font("Manrope.ttf", 18, 600), (244, 240, 233, 200), 1.8)

    return card


def main():
    catalog = json.load(open(os.path.join(ROOT, "src", "data", "catalog.json"), encoding="utf-8"))
    cat_name = {c["key"]: c["name"] for c in catalog["categories"]}
    media = catalog["media"]
    os.makedirs(OUT, exist_ok=True)

    made = 0
    for p in catalog["products"]:
        mid = p["images"][0]
        widest = max(media[mid]["widths"])
        src = os.path.join(ASSETS, *f"{mid}-{widest}.webp".split("/"))
        if not os.path.exists(src):
            print("  missing source:", src)
            continue
        card = build(src, p["title"], p["price"], cat_name.get(p["category"], "BMP"))
        card.save(os.path.join(OUT, f"{p['slug']}.jpg"), "JPEG", quality=86, optimize=True, progressive=True)
        made += 1
    print(f"share cards: {made} written to public/assets/bmp/share/")


if __name__ == "__main__":
    main()
