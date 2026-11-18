// Lets the preloader find out where the navbar's "Prince" and green dot are on screen,
// so the preloader's text and crown can fly there and land exactly on top of them.

const targets = {};

const set = (key) => (el) => {
    if (el) targets[key] = el;
    else delete targets[key];
};

// Stable ref callbacks: <span ref={brandNameRef} /> and <span ref={brandDotRef} />
export const brandNameRef = set("name");
export const brandDotRef = set("dot");

// Remembers that the preloader flew to the logo, so the navbar can show it instantly on landing
// (on pages without the preloader it fades in instead).
let flown = false;
export const markFlown = () => {
    flown = true;
};
export const wasFlown = () => flown;

// Where the navbar's name and dot are right now (null if the navbar isn't mounted).
export function getBrandRects() {
    const name = targets.name;
    const dot = targets.dot;
    if (!name || !dot) return null;
    return { name: name.getBoundingClientRect(), dot: dot.getBoundingClientRect() };
}

// Pure maths (easy to test): how far and how much to scale the preloader's elements so they
// land on the navbar's.
//   name:  top-left anchored, so the text keeps its proportions as it shrinks
//   crown: centre anchored, so it shrinks into the middle of the dot
export function computeFlight(target, nameRect, crownRect) {
    if (!target || !nameRect?.width || !crownRect?.width) return null;
    return {
        name: {
            x: target.name.left - nameRect.left,
            y: target.name.top - nameRect.top,
            scale: target.name.width / nameRect.width,
        },
        crown: {
            x: target.dot.left + target.dot.width / 2 - (crownRect.left + crownRect.width / 2),
            y: target.dot.top + target.dot.height / 2 - (crownRect.top + crownRect.height / 2),
            scale: target.dot.width / crownRect.width,
        },
    };
}