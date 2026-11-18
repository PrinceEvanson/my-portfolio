// Content for the interactive "Lab" section on the home page.

// One entry per demo chapter. `bg` / `fg` are the chapter's colours (hex, 6 digits).
export const chapters = [
  {
    id: "physics",
    num: "01",
    stamp: "Physics",
    kicker: "Springs & physics",
    title: "Motion that feels alive.",
    blurb:
      "Real spring physics instead of canned easing: elements overshoot, settle and follow each other like they have weight. Tune it until it feels right.",
    tags: ["Motion", "Spring physics", "Gestures"],
    hint: "Click the arena, then change the sliders and click again.",
    bg: "#c6ff3d",
    fg: "#0a0a0b",
  },
  {
    id: "field",
    num: "02",
    stamp: "Fields",
    kicker: "Reactive canvas",
    title: "Interfaces that notice you.",
    blurb:
      "Hundreds of particles, one cursor. Canvas fields answer hover and press at 60fps, perfect for backgrounds and hero sections that react to the visitor.",
    tags: ["Canvas 2D", "requestAnimationFrame", "Pointer events"],
    hint: "Move over the grid. Press and hold to pull it in.",
    bg: "#7c5cff",
    fg: "#f4f4f0",
  },
  {
    id: "type",
    num: "03",
    stamp: "Type",
    kicker: "Kinetic typography",
    title: "Words with personality.",
    blurb:
      "Type your own text and choose how it arrives: a wave, 3D flips, an explosion or a decoding scramble. Text becomes part of the motion design.",
    tags: ["Staggering", "3D transforms", "Text effects"],
    hint: "Edit the text, then press an effect.",
    bg: "#ff6b6b",
    fg: "#0a0a0b",
  },
  {
    id: "layout",
    num: "04",
    stamp: "Layout",
    kicker: "Shared-element transitions",
    title: "Layouts that shape-shift.",
    blurb:
      "Cards that grow into full views with no jump cut. Shared-layout animation keeps the eye oriented while the interface changes state.",
    tags: ["Layout animation", "layoutId", "AnimatePresence"],
    hint: "Tap a card, then tap it again to close.",
    bg: "#f4f4f0",
    fg: "#0a0a0b",
  },
  {
    id: "scrub",
    num: "05",
    stamp: "Timeline",
    kicker: "Timeline control",
    title: "Stories you can scrub.",
    blurb:
      "Everything is tied to one progress value: shape, rotation, colour and orbit. The same idea drives scroll-linked storytelling, only here you hold the playhead.",
    tags: ["GSAP", "ScrollTrigger", "Motion values"],
    hint: "Drag the slider, or press play.",
    bg: "#131316",
    fg: "#c6ff3d",
  },
];

// The flippable company badge. TODO: replace the placeholders with your real details.
export const badge = {
  company: "Prince Evanson", 
  mark: "PE", 
  idNo: "dGhlIGJlc3Q=",
  department: "Full-Stack Eng.",
  since: "2026", 
  status: "Open to work",
  photo: "https://media.licdn.com/dms/image/v2/D4D03AQHhn-BRHspLlQ/profile-displayphoto-crop_800_800/B4DZ1ztf.WGUAM-/0/1775762805364?e=1796860800&v=beta&t=kBKTFZYuSCw04RhSkezDn4L3kMG4vArYOojILXhm_cg", 
  credentials: [
    { label: "Education", value: "Moringa School" },
    { label: "Certifications", value: "Software Engineering" },
    { label: "Focus", value: "Full-stack apps, from UI to database" },
  ],
};
