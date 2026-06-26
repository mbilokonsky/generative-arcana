import { useEffect, useState } from "react";

/**
 * Minimal hash router. Hash routing is deliberate: it makes the SPA work on GitHub Pages with
 * zero server config, and (relevant to the coming reading system) the #fragment is never sent to
 * any server — so a reading encoded in the URL stays entirely client-side.
 */
export function currentRoute(): string {
  if (typeof window === "undefined") return "/";
  return window.location.hash.replace(/^#/, "") || "/";
}

export function navigate(to: string) {
  window.location.hash = to.startsWith("/") ? to : `/${to}`;
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const onChange = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
