// Lets the page you leave tell the next page "you arrived through a wipe", so the next page
// can start in the same colour and lift away instead of flashing dark first.
// (The tiny inline script in each HTML <head> reads the same key to paint the colour at once.)
const KEY = "pt";
const WORD_KEY = "pw";
const MAX_AGE_MS = 10000;

// Finds the big word on the wipe panel (matched by its text, so it works with any LinkCue layout)
// and records where it sits, so the next page's title can start from exactly that spot.
export function captureCueWord(label) {
  try {
    if (!label) return null;
    let best = null;
    let bestSize = 0;
    document.querySelectorAll("body *").forEach((el) => {
      if (el.children.length || el.textContent.trim() !== label) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const r = el.getBoundingClientRect();
      if (fs > bestSize && r.width > 0) {
        bestSize = fs;
        best = { word: label, left: r.left, top: r.top, width: r.width, height: r.height, fs };
      }
    });
    return best;
  } catch {
    return null;
  }
}

export function readHandoff() {
  try {
    const raw = sessionStorage.getItem(WORD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function markLeaving(word) {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
    if (word) sessionStorage.setItem(WORD_KEY, JSON.stringify(word));
    else sessionStorage.removeItem(WORD_KEY);
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
    sessionStorage.removeItem(WORD_KEY);
  } catch {
    /* ignore */
  }
  document.documentElement.style.background = "";
}