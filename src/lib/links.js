import { site } from "@/config/site";

// Build a URL that respects Vite's `base` (so the site also works in a sub-folder like GitHub Pages).
export const url = (path = "") => `${import.meta.env.BASE_URL}${path}`.replace(/([^:])\/{2,}/g, "$1/");

// "/about/", "/about" and "/about/index.html" are all the same page.
const norm = (p) => p.replace(/\/index\.html$/, "/").replace(/(.)\/$/, "$1");

export const isCurrent = (path) =>
  norm(new URL(url(path), window.location.origin).pathname) === norm(window.location.pathname);

// What kind of link is this?
//  mail     mailto:/tel: -> leave to the browser
//  hash     #section on the same page (or a "#" placeholder) -> leave to the browser
//  self     the page you're already on -> scroll to top
//  internal another page of this portfolio
//  external anywhere else
export function classify(href) {
  if (!href || href === "#") return "hash";
  if (/^(mailto|tel|sms):/i.test(href)) return "mail";
  if (href.startsWith("#")) return "hash";
  let u;
  try {
    u = new URL(href, window.location.href);
  } catch {
    return "hash";
  }
  if (u.origin !== window.location.origin) return "external";
  if (norm(u.pathname) === norm(window.location.pathname)) return u.hash ? "hash" : "self";
  return "internal";
}

// Friendly name shown in the "Opening ... in a new tab" cue.
export function labelFor(href) {
  const u = new URL(href, window.location.href);
  if (u.origin !== window.location.origin) return u.host.replace(/^www\./, "");
  const page = site.pages.find(
    (p) => norm(new URL(url(p.path), window.location.origin).pathname) === norm(u.pathname)
  );
  return page ? page.label : u.pathname;
}
