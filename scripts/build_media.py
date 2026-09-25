"""Builds responsive WebP media + src/data/catalog.json from content/products.json and media-originals/.

Run: python scripts/build_media.py
"""
import json
import os
import shutil
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIG = os.path.join(ROOT, "media-originals")
OUT = os.path.join(ROOT, "public", "assets", "bmp")
WIDTHS = (480, 960, 1440, 1800)
DUP_DIST = 10

HEX = {
    "Gold": "#c9a24a", "Blue": "#2f55c4", "Black": "#1d1714", "White": "#f5f1ea", "Yellow": "#e7bd2c",
    "Pink": "#e96fa3", "Lilac": "#b8a0d8", "Red": "#c0262d", "Orange": "#e1702c", "Brown": "#6b4431",
    "Cobalt": "#2440b8",
}
# Collage photos are side-by-side panels of equal width.
PANELS = {"local/30ka.jpg": 3}


def dhash(im, n=12):
    g = im.convert("L").resize((n + 1, n), Image.LANCZOS)
    px = g.load()
    return [px[c, r] > px[c + 1, r] for r in range(n) for c in range(n)]


def ham(a, b):
    return sum(x != y for x, y in zip(a, b))


def load(ref):
    path, _, panel = ref.partition("#")
    im = ImageOps.exif_transpose(Image.open(os.path.join(ORIG, *path.split("/")))).convert("RGB")
    if panel != "":
        k = PANELS.get(path, 2)
        i = int(panel)
        w, h = im.size
        # trim a few px at panel seams so dividers never show
        left = i * w // k + (4 if i else 0)
        right = (i + 1) * w // k - (4 if i < k - 1 else 0)
        im = im.crop((left, 0, right, h))
    return im


def save(im, mid, max_w=1800, quality=88):
    os.makedirs(os.path.dirname(os.path.join(OUT, mid)), exist_ok=True)
    w, h = im.size
    widths = sorted({x for x in WIDTHS if x < w} | {min(w, max_w)})
    for tw in widths:
        th = round(h * tw / w)
        im.resize((tw, th), Image.LANCZOS).save(os.path.join(OUT, f"{mid}-{tw}.webp"), "WEBP", quality=quality, method=6)
    return {"w": w, "h": h, "widths": widths}


def main():
    for d in ("products", "brand", "customers"):
        shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)
    src = json.load(open(os.path.join(ROOT, "content", "products.json"), encoding="utf-8"))
    media, manifest, products = {}, [], []
    global_hashes = []

    for p in src["products"]:
        kept, ref_to_id = [], {}
        for ref in p["images"]:
            im = load(ref)
            h = dhash(im)
            dup = next((mid for mid, hh in kept if ham(h, hh) <= DUP_DIST), None)
            if dup:
                ref_to_id[ref] = dup
                continue
            for other, oh in global_hashes:
                if ham(h, oh) <= DUP_DIST:
                    print(f"WARNING cross-product duplicate: {ref} ({p['slug']}) ~ {other}")
            mid = f"products/{p['category']}/{p['slug']}-{len(kept) + 1}"
            media[mid] = save(im, mid)
            kept.append((mid, h))
            global_hashes.append((mid, h))
            ref_to_id[ref] = mid
            manifest.append({
                "id": mid, "product": p.get("code") or p["title"], "slug": p["slug"], "category": p["category"],
                "type": "image", "source": ("https://bmpclothings.com (" + ref + ")") if ref.startswith("products/") else f"owner photo {ref}",
                "orientation": "portrait" if im.height >= im.width else "landscape",
                "width": im.width, "height": im.height,
                "usage": ["product", "collection"],
            })

        colours = []
        for c in p.get("colours", []):
            img = c.get("image")
            colours.append({"name": c["name"], "hex": HEX.get(c["name"], "#999"), "image": ref_to_id.get(img) if img else None})

        out = {k: v for k, v in p.items() if k not in ("images", "colours")}
        out["images"] = [mid for mid, _ in kept]
        out["colours"] = colours
        out["worn"] = p["source"] == "live" and p["category"] == "tops"
        products.append(out)
        print(f"{p['slug']:40s} {len(p['images'])} refs -> {len(kept)} unique")

    poster = Image.open(os.path.join(ORIG, "video", "bmp-hero-poster.jpg")).convert("RGB")
    media["video/bmp-hero-poster"] = save(poster, "video/bmp-hero-poster", quality=86)
    manifest.append({"id": "video/bmp-hero.mp4", "type": "video", "source": "owner supplied heropage.mp4",
                     "width": 752, "height": 416, "usage": ["hero"], "notes": "audio stripped; mp4 + webm"})

    # social share image: hero gown on the warm surface colour
    hero = load("local/80k.jpg")
    og = Image.new("RGB", (1200, 630), (129, 143, 217))
    hh = 630
    hw = round(hero.width * hh / hero.height)
    og.paste(hero.resize((hw, hh), Image.LANCZOS), (1200 - hw - 60, 0))
    os.makedirs(os.path.join(OUT, "brand"), exist_ok=True)
    og.save(os.path.join(OUT, "brand", "og-image.jpg"), "JPEG", quality=86)

    for c in src["categories"]:
        c["count"] = sum(1 for p in products if p["category"] == c["key"])

    json.dump({"categories": src["categories"], "occasions": src["occasions"], "products": products, "media": media},
              open(os.path.join(ROOT, "src", "data", "catalog.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(manifest, open(os.path.join(OUT, "media-manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{len(products)} products, {len(media)} media entries")


if __name__ == "__main__":
    main()
