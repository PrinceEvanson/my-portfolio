// Lets the page you leave tell the next page "you arrived through a wipe", so the next page
// can start in the same colour and lift away instead of flashing dark first.
// (The tiny inline script in each HTML <head> reads the same key to paint the colour at once.)
const KEY = "pt";
const MAX_AGE_MS = 10000;

export function markLeaving() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage blocked: the next page just uses its normal intro */
  }
}

export function cameByWipe() {
  try {
    const t = Number(sessionStorage.getItem(KEY));
    return t > 0 && Date.now() - t < MAX_AGE_MS;
  } catch {
    return false;
  }
}

export function clearArrival() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  document.documentElement.style.background = "";
}
