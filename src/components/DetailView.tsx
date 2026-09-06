import { useEffect, useState } from "react";
import type { Artwork } from "../artworks";

const DURATION_MS = 7000;

interface DetailViewProps {
  art: Artwork;
  onClose: () => void;
}

/**
 * Detail view: the colored piece sits underneath the lineart.
 * A soft mask band sweeps downward on its own — the timelapse reveal.
 */
export default function DetailView({ art, onClose }: DetailViewProps) {
  const [progress, setProgress] = useState(0); // 0..100
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setProgress(0);
    setPlaying(true);
  }, [art]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min((t - start) / DURATION_MS, 1);
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      setProgress(eased * 100);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, art]);

  // mask: black = lineart visible, transparent = color shows through
  const mask =
    progress >= 100
      ? "none"
      : `linear-gradient(to bottom, transparent ${Math.max(progress - 8, 0)}%, black ${progress}%)`;

  return (
    <div
      className="fixed inset-0 z-30 flex cursor-pointer flex-col items-center justify-center"
      onClick={onClose}
      role="button"
      aria-label="Close detail view"
    >
      <p className="mb-4 text-sm text-muted">
        [<span className="text-accent">{art.id}</span>] {art.title} —{" "}
        {art.caption ?? "timelapse reveal"}
      </p>

      <div
        className="relative cursor-default border border-edge bg-white p-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={art.color} alt="" className="block max-h-[68vh] w-auto" />
          {progress < 100 && (
            <img
              src={art.line}
              alt=""
              className="absolute inset-0 block h-full w-full object-cover"
              style={{ maskImage: mask, WebkitMaskImage: mask }}
            />
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1 flex-1 bg-edge">
            <div
              className="h-full bg-accent transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted">{Math.round(progress)}%</span>
          <button
            type="button"
            className="border border-edge px-2 py-0.5 text-xs text-ink hover:bg-edge/40"
            onClick={() => {
              setProgress(0);
              setPlaying(true);
            }}
          >
            $ replay
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">[click blank section to go back]</p>
    </div>
  );
}
