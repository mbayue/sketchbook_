import { useEffect, useRef } from "react";

/**
 * Graph-paper grid with a ripple effect: moving the cursor drops
 * expanding wavelets into the paper, like pebbles in water.
 * A faint breathing keeps the paper alive even when idle.
 */
export default function GridCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 32;
    const BREATH = 1.6; // idle undulation amplitude (px)
    const RIPPLE_SPEED = 0.3; // ring growth (px per ms)
    const RIPPLE_LIFE = 1100; // ms until a ripple fully fades
    const RIPPLE_AMP = 9; // max displacement at the ring crest (px)
    const BAND = 55; // width of the wavelet ring (px)
    const WAVELEN = 26; // wavelength of the ripple crests (px)
    const SPAWN_DIST = 70; // cursor travel between ripple drops

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    const mouse = { x: -9999, y: -9999 };
    const ripples: Array<{ x: number; y: number; born: number }> = [];
    let lastSpawn = { x: -9999, y: -9999 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 2;
      rows = Math.ceil(h / CELL) + 2;
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const dx = mouse.x - lastSpawn.x;
      const dy = mouse.y - lastSpawn.y;
      if (Math.hypot(dx, dy) >= SPAWN_DIST) {
        ripples.push({ x: mouse.x, y: mouse.y, born: performance.now() });
        if (ripples.length > 12) ripples.shift();
        lastSpawn = { x: mouse.x, y: mouse.y };
      }
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // displacement of one grid point at time `now`
    const offsetAt = (gx: number, gy: number, now: number, out: [number, number]) => {
      let ox = BREATH * Math.sin(now * 0.0005 + gx * 0.018 + gy * 0.011);
      let oy = BREATH * Math.sin(now * 0.0004 + gy * 0.016 + gx * 0.009);
      for (const rip of ripples) {
        const age = now - rip.born;
        const dx = gx - rip.x;
        const dy = gy - rip.y;
        const d = Math.hypot(dx, dy);
        const ring = d - age * RIPPLE_SPEED;
        const band = Math.exp(-(ring * ring) / (2 * BAND * BAND));
        if (band < 0.01) continue;
        const envelope = Math.pow(1 - age / RIPPLE_LIFE, 2);
        const push = band * Math.sin(ring / WAVELEN) * RIPPLE_AMP * envelope;
        if (d > 0.001) {
          ox += (dx / d) * push;
          oy += (dy / d) * push;
        }
      }
      out[0] = gx + ox;
      out[1] = gy + oy;
    };

    const tmp: [number, number] = [0, 0];

    const draw = (now: number) => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].born > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(70, 62, 50, 0.09)";
      ctx.lineWidth = 1;

      // horizontal lines
      for (let j = 0; j < rows; j++) {
        const gy = j * CELL - CELL / 2;
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          offsetAt(i * CELL - CELL / 2, gy, now, tmp);
          if (i === 0) ctx.moveTo(tmp[0], tmp[1]);
          else ctx.lineTo(tmp[0], tmp[1]);
        }
        ctx.stroke();
      }
      // vertical lines
      for (let i = 0; i < cols; i++) {
        const gx = i * CELL - CELL / 2;
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          offsetAt(gx, j * CELL - CELL / 2, now, tmp);
          if (j === 0) ctx.moveTo(tmp[0], tmp[1]);
          else ctx.lineTo(tmp[0], tmp[1]);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  );
}
