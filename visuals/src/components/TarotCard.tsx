/**
 * <TarotCard> — the one boundary component. Runs any CardSketch in a p5 INSTANCE-mode canvas
 * and owns the full lifecycle so card authors never touch React or the DOM:
 *   - responsive sizing (ResizeObserver), retina (pixelDensity)
 *   - pause when off-screen (IntersectionObserver), when tab hidden, or when `paused`
 *   - reduced-motion / poster mode -> one deterministic still frame, no loop
 *   - normalized pointer + a `signal` channel back to the host
 *
 * It draws ONLY the art. The banner (suit/rank/name) is the host's job — see <CardFrame>.
 */
import { useEffect, useRef } from "react";
import type p5 from "p5";
import type { CardData, CardSketch, PointerState } from "../runtime/types";
import { buildKit, resizeKit, tickKit } from "../runtime/kit";

export interface TarotCardProps {
  card: CardData;
  sketch: CardSketch;
  /** "live" animates; "poster" renders a single still frame. Default "live". */
  mode?: "live" | "poster";
  /** Force-pause regardless of visibility (e.g. host knows it's in a closed drawer). */
  paused?: boolean;
  /** Receive named events emitted by the card's interactive affordances. */
  onSignal?: (name: string, detail?: unknown) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function TarotCard({ card, sketch, mode = "live", paused = false, onSignal, className, style }: TarotCardProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  // latest-props refs so the p5 draw closure reads current values without re-instantiating
  const sketchRef = useRef(sketch); sketchRef.current = sketch;
  const cardRef = useRef(card); cardRef.current = card;
  const modeRef = useRef(mode); modeRef.current = mode;
  const pausedRef = useRef(paused); pausedRef.current = paused;
  const onSignalRef = useRef(onSignal); onSignalRef.current = onSignal;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let instance: p5 | null = null;
    let disposed = false;

    const mql = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    let onScreen = true;
    let pressedLatch = false;
    let tAccum = 0;

    import("p5").then(({ default: P5 }) => {
      if (disposed) return;

      const sketchFn = (p: p5) => {
        const kit = buildKit(p, cardRef.current, {
          reducedMotion: !!mql?.matches,
          signal: (name, detail) => onSignalRef.current?.(name, detail),
        });

        const sizeToHost = () => {
          const r = host.getBoundingClientRect();
          const w = Math.max(1, Math.round(r.width));
          const h = Math.max(1, Math.round(r.height));
          p.resizeCanvas(w, h, false);
          resizeKit(kit, w, h);
        };

        const isLive = () =>
          modeRef.current === "live" && !pausedRef.current && onScreen &&
          (typeof document === "undefined" || !document.hidden) && !mql?.matches;

        const renderPoster = () => {
          if (kit.w < 2 || kit.h < 2) return;
          try {
            tickKit(kit, 0, readPointer(p, kit.w, kit.h, false));
            (sketchRef.current.poster ?? sketchRef.current.draw)(kit);
          } catch (e) {
            console.error("[TarotCard]", cardRef.current.slug, e);
            p.noLoop();
          }
        };

        p.setup = () => {
          const r = host.getBoundingClientRect();
          const c = p.createCanvas(Math.max(1, r.width), Math.max(1, r.height));
          c.parent(host);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          resizeKit(kit, p.width, p.height);
          sketchRef.current.init?.(kit);
          if (!isLive()) {
            renderPoster();
            p.noLoop();
          }
        };

        p.draw = () => {
          if (!isLive()) { p.noLoop(); renderPoster(); return; }
          if (kit.w < 2 || kit.h < 2) return;
          tAccum += p.deltaTime / 1000;
          const ptr = readPointer(p, kit.w, kit.h, pressedLatch);
          pressedLatch = false;
          tickKit(kit, tAccum, ptr);
          try {
            if (sketchRef.current.onPointer && (ptr.inside || ptr.down)) sketchRef.current.onPointer(kit);
            sketchRef.current.draw(kit);
          } catch (e) {
            console.error("[TarotCard]", cardRef.current.slug, e);
            p.noLoop(); // stop this one card rather than throwing every frame
          }
        };

        p.mousePressed = () => { pressedLatch = true; };

        // expose a re-sizer + a wake hook on the instance for the observers below
        (p as unknown as { _resize: () => void })._resize = sizeToHost;
        (p as unknown as { _wake: () => void })._wake = () => { if (isLive()) p.loop(); else { p.noLoop(); renderPoster(); } };
      };

      instance = new P5(sketchFn, host);
      instanceRef.current = instance;

      // resize
      const resizeObs = new ResizeObserver(() => (instance as unknown as { _resize?: () => void })?._resize?.());
      resizeObs.observe(host);

      // pause off-screen
      const io = new IntersectionObserver(
        (entries) => {
          onScreen = entries[0]?.isIntersecting ?? true;
          (instance as unknown as { _wake?: () => void })?._wake?.();
        },
        { threshold: 0.05 },
      );
      io.observe(host);

      const onVis = () => (instance as unknown as { _wake?: () => void })?._wake?.();
      document.addEventListener("visibilitychange", onVis);
      mql?.addEventListener?.("change", onVis);

      // store disposers
      (instance as unknown as { _dispose?: () => void })._dispose = () => {
        resizeObs.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        mql?.removeEventListener?.("change", onVis);
      };
    });

    return () => {
      disposed = true;
      const inst = instance as unknown as { _dispose?: () => void; remove: () => void } | null;
      inst?._dispose?.();
      inst?.remove();
      instanceRef.current = null;
    };
    // re-create only when the identity of the card or sketch changes
  }, [card.slug, sketch.slug]);

  // wake/repaint when mode or paused changes (observers only fire on visibility changes)
  useEffect(() => {
    (instanceRef.current as unknown as { _wake?: () => void } | null)?._wake?.();
  }, [mode, paused]);

  return <div ref={hostRef} className={className} style={{ width: "100%", height: "100%", ...style }} />;
}

function readPointer(p: p5, w: number, h: number, pressed: boolean): PointerState {
  const x = p.mouseX / Math.max(1, w);
  const y = p.mouseY / Math.max(1, h);
  const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
  return { x, y, inside, down: p.mouseIsPressed && inside, pressed: pressed && inside };
}
