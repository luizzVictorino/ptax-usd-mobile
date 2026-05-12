from pathlib import Path
from PIL import Image

project = Path('/home/ubuntu/ptax-usd-mobile')
source = Path('/home/ubuntu/webdev-static-assets/ptax-usd-icon.png')
targets = [
    project / 'assets/images/icon.png',
    project / 'assets/images/splash-icon.png',
    project / 'assets/images/favicon.png',
    project / 'assets/images/android-icon-foreground.png',
]

with Image.open(source) as image:
    image = image.convert('RGBA')
    image.thumbnail((768, 768), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (768, 768), (0, 87, 184, 255))
    left = (768 - image.width) // 2
    top = (768 - image.height) // 2
    canvas.alpha_composite(image, (left, top))

    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(target, format='PNG', optimize=True, compress_level=9)
        print(f'{target}: {target.stat().st_size / 1024:.1f}KB')
