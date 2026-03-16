"""
Compress wedding photos from wed_pic/ into optimized WebP files.
- Resizes to max 1920px on the longest edge
- Outputs WebP at quality 80 (good balance of quality and size)
- Saves compressed files back into wed_pic/ as .webp
- Removes original JPGs after successful conversion
"""

import sys
from pathlib import Path
from PIL import Image

MAX_LONG_EDGE = 1920
QUALITY = 80
SRC_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "album" / "wed_pic"


def compress_image(src: Path):
    img = Image.open(src)

    # Auto-rotate based on EXIF orientation
    from PIL import ImageOps
    img = ImageOps.exif_transpose(img)

    # Resize so longest edge <= MAX_LONG_EDGE
    w, h = img.size
    longest = max(w, h)
    if longest > MAX_LONG_EDGE:
        scale = MAX_LONG_EDGE / longest
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)

    # Save as WebP
    out = src.with_suffix(".webp")
    img.save(out, "WEBP", quality=QUALITY)

    old_size = src.stat().st_size / 1024
    new_size = out.stat().st_size / 1024
    print(f"  {src.name} ({old_size:.0f} KB) -> {out.name} ({new_size:.0f} KB)")

    # Remove original (skip if source is already .webp and was overwritten in-place)
    if src != out:
        src.unlink()


def main():
    if not SRC_DIR.exists():
        print(f"Source directory not found: {SRC_DIR}")
        sys.exit(1)

    images = sorted(SRC_DIR.glob("*"))
    images = [f for f in images if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")]

    if not images:
        print("No JPG/PNG/WebP images found in wed_pic/")
        sys.exit(1)

    print(f"Compressing {len(images)} images (max {MAX_LONG_EDGE}px, WebP q{QUALITY})...\n")
    for img_path in images:
        compress_image(img_path)

    print(f"\nDone! {len(images)} images compressed.")


if __name__ == "__main__":
    main()
