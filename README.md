# TabOjisan's sketchbook_

A single-page art portfolio for [@TabOjisan](https://x.com/TabOjisan).
Every piece starts as lineart; open one and the color gets painted in over
the sketch. Built with React, TypeScript, Vite and Tailwind. Runs on Bun.
Live at [sketch.my.id](https://sketch.my.id).

## Features

- Click a card (or Tab to it, Enter to open). The full-color version paints
  over the lineart in a mask sweep. A progress bar tracks it, Escape closes
  and returns focus.
- The open piece washes its colors behind the grid; closing clears it.
- Scroll the mouse wheel over the cards to move through the archive
  (pinch-zoom still reaches the browser).
- Hovering a card fades its colored version into the paper behind the grid.
- The graph-paper background drops ripple rings under the cursor.
- One screen. Warm paper, monospace type.

## Getting started

```bash
bun install
bun run dev      # http://localhost:5173
```

Other scripts:

```bash
bun run build     # type-check (tsc -b) + production build to dist/
bun run preview   # serve the production build locally
bunx playwright test   # e2e: layout, keyboard, reveal, hover (needs dist built)
```

## Deploy

Static `dist/` on Dokku, served by nginx:

```bash
dokku apps:create sketch
dokku domains:set sketch sketch.my.id
dokku ports:set sketch http:80:80
dokku git:sync --build sketch https://github.com/mbayue/sketchbook_.git main
dokku letsencrypt:enable sketch
```

## Adding artwork

1. Drop a lineart and full-color pair (JPG or PNG) into `src/assets/art/`,
   for example `myart-line.jpg` and `myart-color.jpg`.
2. Convert and compress them:

   ```bash
   bun scripts/convert-art.mjs
   ```

   This reads every `src/assets/art/*.jpg` and writes a resized `.webp` next
   to it.
3. Register the pair in `src/artworks.ts` with its real pixel dimensions
   (the card reserves space before load, preventing layout shift):

   ```ts
   {
     id: "archive-10",
     title: "my piece",
     caption: "optional label for the detail view",
     line: myartLine,
     color: myartColor,
     width: 896, height: 1280,           // lineart size
     colorWidth: 889, colorHeight: 1280, // color size (may differ)
   }
   ```

   Measure with:

   ```bash
   bun -e 'import sharp from "sharp"; for (const f of ["myart-line.webp","myart-color.webp"]) { const m = await sharp("src/assets/art/"+f).metadata(); console.log(f, m.width+"x"+m.height); }'
   ```

## Project structure

```text
src/
  App.tsx                 layout, hover preview, social links, footer credit
  artworks.ts             the gallery data (pairs + pixel dims), add pieces here
  components/
    GridCanvas.tsx        ripple graph-paper background (canvas)
    Gallery.tsx           card strip and wheel scrolling
    DetailView.tsx        timelapse reveal overlay
  assets/art/             image pairs (webp)
public/
  og-image.webp           link-preview image (a color piece, stable URL)
tests/                    playwright e2e (layout, keyboard, reveal, hover)
Dockerfile                multi-stage bun build + nginx static serve
scripts/
  convert-art.mjs         jpg to webp converter (sharp)
```

## Tuning knobs

| What | Where |
| --- | --- |
| Timelapse duration | `DURATION_MS` in `src/components/DetailView.tsx` |
| Ripple strength, speed, lifetime | constants at the top of `src/components/GridCanvas.tsx` |
| Preview sharpness and position | the preview `<img>` classes in `src/App.tsx` |
| Card size | `h-[min(58vh,620px)]` in `src/components/Gallery.tsx` |
| Wheel scroll speed | `el.scrollLeft += e.deltaY` in `src/components/Gallery.tsx` |

## License

The code is released under the [MIT license](LICENSE).
The artwork is © [@TabOjisan](https://x.com/TabOjisan). Don't reuse the
images without asking.
