import { useEffect, useRef } from "react";

// A grid of dots that scatters away from your cursor and springs back.
// Press and hold to flip the force and pull them in instead.
export default function FieldDemo({ fg, onExplore }) {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -999, y: -999, down: false });
  const moves = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = 24;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    ctx.fillStyle = fg;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const p = pointer.current;
      const radius = p.down ? 170 : 115;

      for (const d of dots) {
        const dx = d.x - p.x;
        const dy = d.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < radius) {
          const f = (1 - dist / radius) * (p.down ? -1.3 : 2.6);
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
        d.vx += (d.hx - d.x) * 0.06; // spring home
        d.vy += (d.hy - d.y) * 0.06;
        d.vx *= 0.86; // friction
        d.vy *= 0.86;
        d.x += d.vx;
        d.y += d.vy;

        const disp = Math.hypot(d.x - d.hx, d.y - d.hy);
        ctx.globalAlpha = 0.3 + Math.min(disp / 40, 0.7);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5 + Math.min(disp / 6, 4), 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [fg]);

  const setPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    pointer.current.x = e.clientX - r.left;
    pointer.current.y = e.clientY - r.top;
  };

  return (
    <div className="relative h-full min-h-[240px] overflow-hidden rounded-xl">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerMove={(e) => {
          setPos(e);
          moves.current += 1;
          if (moves.current === 25) onExplore();
        }}
        onPointerDown={(e) => {
          setPos(e);
          pointer.current.down = true;
          onExplore();
        }}
        onPointerUp={() => {
          pointer.current.down = false;
        }}
        onPointerLeave={() => {
          pointer.current = { x: -999, y: -999, down: false };
        }}
      />
    </div>
  );
}
