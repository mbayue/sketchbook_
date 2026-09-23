import { useEffect, useRef } from "react";
import type { Artwork } from "../artworks";

interface GalleryProps {
  artworks: Artwork[];
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
  onLeave: () => void;
}

export default function Gallery({
  artworks,
  onSelect,
  onHover,
  onLeave,
}: GalleryProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  // map vertical mouse wheel to horizontal gallery scroll
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      if (e.ctrlKey || e.metaKey) return; // let pinch-zoom reach the browser
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section id="gallery" className="relative z-10 flex h-full items-center">
      <div
        ref={rowRef}
        role="region"
        aria-label="Artwork archive, scroll horizontally"
        tabIndex={0}
        className="no-scrollbar flex w-full items-center gap-5 overflow-x-auto px-8 py-4"
      >
        {artworks.map((art, i) => (
          <button
            key={art.id}
            type="button"
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={onLeave}
            className="group shrink-0 border border-edge bg-card p-2 shadow-sm transition-[box-shadow] duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open ${art.title}`}
          >
            <img
              src={art.line}
              alt={art.title}
              width={art.width}
              height={art.height}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              className="block h-[min(58vh,620px)] w-auto select-none transition-transform duration-300 group-hover:-translate-y-2"
            />
            <span className="mt-2 flex items-center justify-between px-1 pb-1 text-xs text-muted">
              <span translate="no">{art.id}</span>
              <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                $ open
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
