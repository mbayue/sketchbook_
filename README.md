# sketchbook_

A single-page art portfolio. Every piece starts as lineart; open one and the
color gets painted in over the sketch. Built with React, TypeScript, Vite and
Tailwind. Runs on Bun.

## Features

- Click a card to open it. The full-color version is painted over the lineart
  with an animated mask sweep, plus a progress bar and a replay button.
- Scroll the mouse wheel over the cards to move through the archive.
- Hovering a card fades its colored version into the paper behind the grid.
- The graph-paper background drops ripple rings under the cursor and breathes
  gently when you stop moving.
- One screen, warm paper theme, monospace type.

## Getting started

```bash
bun install
bun run dev      # http://localhost:5173
```

Other scripts:

```bash
bun run build     # type-check (tsc -b) + production build to dist/
bun run preview   # serve the production build locally
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
3. Register the pair in `src/artworks.ts`:

   ```ts
   {
     id: "archive-10",
     title: "my piece",
     caption: "optional label for the detail view",
     line: myartLine,
     color: myartColor,
   }
   ```

## Project structure

```text
src/
  App.tsx                 layout, hover preview, social links, footer credit
  artworks.ts             the gallery data, add or remove pieces here
  components/
    GridCanvas.tsx        ripple graph-paper background (canvas)
    Gallery.tsx           card strip and wheel scrolling
    DetailView.tsx        timelapse reveal overlay
  assets/art/             image pairs (webp)
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
The artwork is not: all images are © [@TabOjisan](https://x.com/TabOjisan),
used here with the artist's permission. Don't reuse them without asking.
