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
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="relative z-10 flex h-full items-center">
      <div
        ref={rowRef}
        className="no-scrollbar flex w-full items-center gap-5 overflow-x-auto px-8 py-4"
      >
        {artworks.map((art, i) => (
          <button
            key={art.id}
            type="button"
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={onLeave}
            className="group shrink-0 border border-edge bg-card p-2 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Open ${art.title}`}
          >
            <img
              src={art.line}
              alt={art.title}
              draggable={false}
              className="block h-[min(58vh,620px)] w-auto select-none"
            />
            <span className="mt-2 flex items-center justify-between px-1 pb-1 text-xs text-muted">
              <span>{art.id}</span>
              <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100">
                $ open
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
