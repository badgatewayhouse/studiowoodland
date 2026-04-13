# Studio Woodland — Project Notes

## Project Overview
Artist portfolio website for Lynn M. Ruiz / Studio LMR. Static HTML/CSS/JS site (`index.html`, `styles.css`, `main.js`, `artworks.js`).

## Logo

### Source file
`LmR-3.jpg` — client-supplied photo of Lynn's handwritten "LmR" signature (ink on white paper).

### Generated file
`LmR-logo.png` — processed transparent PNG used in the nav banner (top-left).

### How to regenerate / adjust stroke weight
The logo is generated via a Python/Pillow script. **Radius** controls stroke thickness — higher = bolder. Current value: **14**.

```python
from PIL import Image, ImageFilter

img = Image.open('LmR-3.jpg').convert('L')
inverted = img.point(lambda p: 255 - p)
blurred = inverted.filter(ImageFilter.GaussianBlur(radius=14))  # ← adjust this
amplified = blurred.point(lambda p: min(255, int(p * 3.5)))

result = Image.new('RGBA', img.size)
apix = amplified.load()
rpix = result.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        a = apix[x, y]
        rpix[x, y] = (15, 12, 10, a)

result.save('LmR-logo.png')
```

**Tuning guide:**
| Radius | Effect |
|--------|--------|
| 9      | Thin — close to original pen weight |
| 12     | Medium-bold |
| 14     | Current — bold, legible at small nav size |
| 16+    | Strokes start merging in dense areas |

Run the script from the repo root, then hard-refresh the browser to see changes.

### CSS (in `styles.css`)
```css
.nav-logo {
  height: 68px;
  width: auto;
  flex-shrink: 0;
}
```
Increase `height` to make the logo larger in the nav.

## Dependencies
- Python 3 + Pillow (`pip install pillow`) — for logo regeneration only
- No build step for the site itself; it's plain HTML/CSS/JS
