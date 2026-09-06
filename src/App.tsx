import { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import GridCanvas from "./components/GridCanvas";
import Gallery from "./components/Gallery";
import DetailView from "./components/DetailView";
import { artworks } from "./artworks";

export default function App() {
  const [detail, setDetail] = useState<number | null>(null); // index | null
  const [hovered, setHovered] = useState<number | null>(null); // index | null

  const preview = hovered !== null ? artworks[hovered] : null;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* full-color preview of the hovered card, blurred behind the grid */}
      {preview && (
        <img
          key={preview.id}
          src={preview.color}
          alt=""
          className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover object-[50%_40%] opacity-30 transition-opacity duration-500"
        />
      )}

      <GridCanvas />

      <header className="relative z-10 shrink-0 px-8 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">
              <span className="text-accent">$</span> cat ./sketchbook.txt
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              sketchbook<span className="text-accent">_</span>
            </h1>
            <p className="mt-1 text-sm text-muted">
              lineart archive — open a piece to watch the timelapse
            </p>
          </div>

          <div className="flex gap-2 pt-1">
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
            <a
              href="https://facebook.com/yourname"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="flex h-10 w-10 items-center justify-center border border-edge bg-card text-muted shadow-sm transition-colors hover:bg-edge/40 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://x.com/yourname"
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
        className={`relative min-h-0 flex-1 transition-all duration-500 ${
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

      <footer className="relative z-10 flex shrink-0 flex-col items-center gap-1 px-8 pb-5 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left sm:text-sm">
        <span>
          <span className="text-accent">$</span> commissions: hit my DMs if you're interested_
        </span>
        <span className="flex items-center gap-2">
          <a
            href="https://x.com/TabOjisan"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            art by <span className="text-accent">@TabOjisan</span>
          </a>
          <a
            href="https://github.com/mbayue"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            © {new Date().getFullYear()} mbayue
          </a>
        </span>
      </footer>

      {detail !== null && (
        <DetailView art={artworks[detail]} onClose={() => setDetail(null)} />
      )}

      <SpeedInsights />
      <Analytics />
    </div>
  );
}
