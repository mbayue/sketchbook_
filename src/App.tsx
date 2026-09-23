import { useState } from "react";
import GridCanvas from "./components/GridCanvas";
import Gallery from "./components/Gallery";
import DetailView from "./components/DetailView";
import { artworks } from "./artworks";

export default function App() {
  const [detail, setDetail] = useState<number | null>(null); // index | null
  const [hovered, setHovered] = useState<number | null>(null); // index | null

  const preview = hovered !== null ? artworks[hovered] : null;
  // when a piece is open, its own colors wash the background like the hover preview
  const backdrop = detail !== null ? artworks[detail] : preview;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <a
        href="#gallery"
        className="sr-only z-50 border border-edge bg-card px-4 py-2 text-sm focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to gallery
      </a>
      {/* full-color wash behind the grid: hovered card, or the open piece */}
      {backdrop && (
        <img
          key={backdrop.id}
          src={backdrop.color}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover object-[50%_40%] opacity-30 transition-opacity duration-500"
        />
      )}

      <GridCanvas />

      <header
        className={`relative z-10 shrink-0 px-8 pt-6 ${
          detail !== null ? "invisible" : ""
        }`}
        inert={detail !== null}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">
              <span className="text-accent">$</span> cat ./sketchbook.txt
            </p>
            <h1 translate="no" className="mt-1 text-3xl font-bold tracking-tight">
              TabOjisan&apos;s sketchbook<span className="text-accent">_</span>
            </h1>
            <p className="mt-1 text-sm text-muted">
              lineart archive — open a piece to watch the timelapse
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            {/*
            <a
              href="mailto:you@example.com?subject=Commission%20Inquiry%20-%20%5BYour%20Name%5D"
              aria-label="Email"
              title="Email me"
              className="flex h-10 w-10 items-center justify-center border border-edge bg-card text-muted shadow-sm transition-colors hover:bg-edge/40 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
            */}
            <a
              href="https://www.pixiv.net/en/users/40589627"
              target="_blank"
              rel="noreferrer"
              aria-label="Pixiv"
              title="Pixiv"
              className="flex h-10 w-10 items-center justify-center border border-edge bg-card text-muted shadow-sm transition-colors hover:bg-edge/40 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M4.94 0A4.953 4.953 0 0 0 0 4.94v14.12A4.953 4.953 0 0 0 4.94 24h14.12A4.953 4.953 0 0 0 24 19.06c-.014 1.355 0-14.12 0-14.12A4.953 4.953 0 0 0 19.06 0Zm1.783 5.465h.904a.37.37 0 0 1 .31.17l.752 1.17a6.172 6.172 0 0 1 10.01 4.834 6.172 6.172 0 0 1-9.394 5.265v2.016a.37.37 0 0 1-.37.367H6.724a.37.37 0 0 1-.37-.367V5.834a.37.37 0 0 1 .37-.37m5.804 2.951a3.222 3.222 0 1 0-.002 6.443 3.222 3.222 0 1 0 .002-6.443" />
              </svg>
            </a>
            <a
              href="https://x.com/TabOjisan"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              title="X (Twitter)"
              className="flex h-10 w-10 items-center justify-center border border-edge bg-card text-muted shadow-sm transition-colors hover:bg-edge/40 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main
        inert={detail !== null}
        className={`relative min-h-0 flex-1 transition-[opacity,filter] duration-500 ${
          detail !== null ? "pointer-events-none blur-md opacity-40" : ""
        }`}
      >
        <Gallery
          artworks={artworks}
          onSelect={setDetail}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
        />
      </main>

      <footer
        inert={detail !== null}
        className={`relative z-10 flex shrink-0 flex-col items-center gap-1 px-8 pb-5 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left sm:text-sm ${
          detail !== null ? "invisible" : ""
        }`}
      >
        <span>
          <span className="text-accent">$</span> commissions:{" "}
          <a
            href="https://tbhdbnb.fanbox.cc"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-edge underline-offset-2 transition-colors hover:text-ink"
          >
            support me on fanbox
          </a>
          _
        </span>
        <span className="flex items-center gap-2">
          <a
            href="https://x.com/TabOjisan"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            © {new Intl.DateTimeFormat(undefined, { year: "numeric" }).format(new Date())}{" "}
            <span className="text-accent">@TabOjisan</span>
          </a>
          <a
            href="https://github.com/mbayue"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            built by mbayue
          </a>
        </span>
      </footer>

      {detail !== null && (
        <DetailView art={artworks[detail]} onClose={() => setDetail(null)} />
      )}

    </div>
  );
}
