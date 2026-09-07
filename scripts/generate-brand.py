from hashlib import sha256
from pathlib import Path
import json

from PIL import Image, ImageOps, __version__ as pillow_version


root = Path(__file__).resolve().parents[1]
source = json.loads((root / "assets/brand/source.json").read_text())
for name, record in source["masters"].items():
    if sha256((root / name).read_bytes()).hexdigest() != record["sha256"]:
        raise ValueError(f"Selected master changed: {name}")

foreground = Image.open(root / "logo.png").convert("RGBA")
square = Image.open(root / "assets/brand/icon.png").convert("RGBA")
rounded = Image.open(root / "assets/brand/icon-rounded.png").convert("RGBA")
background = Image.open(root / "assets/brand/background.png").convert("RGBA")
public = root / "public"
public.mkdir(exist_ok=True)
outputs = []


def save(image, name, role, **options):
    destination = public / name
    image.save(destination, **options)
    decoded = Image.open(destination)
    record = {
        "path": f"public/{name}",
        "role": role,
        "sha256": sha256(destination.read_bytes()).hexdigest(),
        "width": decoded.width,
        "height": decoded.height,
    }
    if decoded.format == "ICO":
        record["entries"] = []
        for size in sorted(decoded.ico.sizes()):
            entry = decoded.ico.getimage(size).convert("RGBA")
            record["entries"].append({
                "width": entry.width,
                "height": entry.height,
                "alphaExtrema": list(entry.getchannel("A").getextrema()),
            })
    outputs.append(record)


for size in [24, 32, 48, 64, 80, 128, 256]:
    save(foreground.resize((size, size), Image.Resampling.LANCZOS),
         f"logo-{size}.png", "transparent application mark")
save(foreground.resize((32, 32), Image.Resampling.LANCZOS),
     "favicon.png", "transparent browser mark")
save(foreground, "favicon.ico", "transparent browser mark",
     format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)])
save(square.resize((180, 180), Image.Resampling.LANCZOS).convert("RGB"),
     "apple-touch-icon.png", "opaque square platform presentation")
social = ImageOps.fit(background, (1200, 630), Image.Resampling.LANCZOS)
social.alpha_composite(rounded.resize((560, 560), Image.Resampling.LANCZOS), (320, 35))
save(social.convert("RGB"), "opengraph-image.png", "large rounded presentation on its own field")

report = {
    "generator": "scripts/generate-brand.py",
    "pillow": pillow_version,
    "study": source["study"],
    "finishing": source["finishing"],
    "icoSizes": [16, 24, 32, 48, 64],
    "files": outputs,
}
(root / "assets/brand/derivatives.json").write_text(json.dumps(report, indent="\t") + "\n")
print(f"Generated {len(outputs)} brand assets from the checked {source['study']} masters.")
