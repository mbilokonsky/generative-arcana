/**
 * <RawP5Card> — runs a standalone p5 instance-mode sketch supplied as a SOURCE STRING
 * (`function sketch(p) { p.setup=…; p.draw=… }`), the visual format decks authored in the prior
 * tool shipped (e.g. Ulysses). It compiles the string once, runs it in a p5 instance, and CSS-fits
 * the sketch's own canvas to the card frame.
 *
 * Unlike <TarotCard> (which drives a typed CardSketch through SketchKit), the deck code here owns its
 * setup/draw and canvas size; we only wrap them to fit, to honor live/poster + off-screen pausing,
 * and to isolate errors so one bad sketch can't crash the browser.
 */
import { useEffect, useRef } from "react";
import type p5 from "p5";

export interface RawP5CardProps {
  slug: string;
  /** p5 source defining a top-level `function sketch(p) { … }`. */
  code: string;
  mode?: "live" | "poster";
  paused?: boolean;
  style?: React.CSSProperties;
}

/**
 * Normalize Processing-era API names a few migrated sketches still use to their p5 equivalents.
 * p5 defines `pushMatrix`/`popMatrix` as non-writable stubs that throw, so a runtime instance shim
 * can't override them — we rewrite the source instead (the sketches call `p.pushMatrix()` literally).
 */
function normalize(code: string): string {
  return code.replace(/\bp\.pushMatrix\b/g, "p.push").replace(/\bp\.popMatrix\b/g, "p.pop");
}

/** Compile a source string into its `sketch` function, or null if it doesn't define one. */
function compile(code: string, slug: string): ((p: p5) => void) | null {
  try {
    // The bundled deck sketches are trusted, authored source (not user input).
    const factory = new Function(`${normalize(code)}\n;return typeof sketch === "function" ? sketch : null;`);
    const fn = factory();
    return typeof fn === "function" ? (fn as (p: p5) => void) : null;
  } catch (e) {
    console.error("[RawP5Card] compile failed", slug, e);
    return null;
  }
}

export function RawP5Card({ slug, code, mode = "live", paused = false, style }: RawP5CardProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<p5 | null>(null);
  const modeRef = useRef(mode); modeRef.current = mode;
  const pausedRef = useRef(paused); pausedRef.current = paused;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fn = compile(code, slug);
    if (!fn) return;

    let instance: p5 | null = null;
    let disposed = false;
    let onScreen = true;
    const mql = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const isLive = () =>
      modeRef.current === "live" && !pausedRef.current && onScreen &&
      (typeof document === "undefined" || !document.hidden) && !mql?.matches;

    import("p5").then(({ default: P5 }) => {
      if (disposed) return;

      instance = new P5((p: p5) => {
        fn(p); // deck code assigns p.setup / p.draw / p.createCanvas(400,600)
        const userSetup = p.setup;
        const userDraw = p.draw;
        const drawOnce = () => { try { userDraw?.call(p); } catch (e) { console.error("[RawP5Card] draw", slug, e); p.noLoop(); } };

        p.setup = function () {
          try { userSetup?.call(p); } catch (e) { console.error("[RawP5Card] setup", slug, e); }
          const cv = host.querySelector("canvas");
          if (cv) { cv.style.width = "100%"; cv.style.height = "100%"; cv.style.display = "block"; }
          // These sketches paint in draw(), not setup() — so a frozen poster still needs ONE frame.
          if (!isLive()) { drawOnce(); p.noLoop(); }
        };

        // The live loop just runs the deck's draw, guarded; pausing is via loop()/noLoop() below.
        p.draw = drawOnce;
      }, host);
      instanceRef.current = instance;

      const wake = () => { const inst = instance; if (!inst) return; if (isLive()) inst.loop(); else inst.noLoop(); };
      const io = new IntersectionObserver((es) => { onScreen = es[0]?.isIntersecting ?? true; wake(); }, { threshold: 0.05 });
      io.observe(host);
      const onVis = () => wake();
      document.addEventListener("visibilitychange", onVis);
      mql?.addEventListener?.("change", onVis);
      (instance as unknown as { _dispose?: () => void })._dispose = () => {
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
  }, [slug, code]);

  // wake/freeze when mode or paused changes
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    if (modeRef.current === "live" && !pausedRef.current) inst.loop(); else inst.noLoop();
  }, [mode, paused]);

  return <div ref={hostRef} style={{ width: "100%", height: "100%", ...style }} />;
}
