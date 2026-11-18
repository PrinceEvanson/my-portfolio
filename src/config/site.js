// Site-wide settings. Change these and every page follows.
export const site = {
  // Links to OTHER websites (GitHub, LinkedIn...): cue animation, then a new browser tab.
  externalNewTab: true,
  // Links to other pages of THIS portfolio: false = same tab with a page-wipe transition.
  internalNewTab: false,

  cueMs: 650, // "opening in a new tab" cue, before an external tab opens
  wipeMs: 750, // page-wipe, before an internal page loads in the same tab

  // One entry per real page. `path` is relative to the site root and must match a folder
  // with an index.html in the project (home is the root index.html).
  pages: [
    { key: "home", label: "Home", path: "", blurb: "Back to the start" },
    { key: "about", label: "About", path: "about/", blurb: "Who I am" },
    { key: "work", label: "Work", path: "work/", blurb: "Selected projects" },
    { key: "contact", label: "Contact", path: "contact/", blurb: "Say hello" },
  ],
};
