import { useSyncExternalStore } from "react";

// "Plain English" (default) vs "Developer view" for the Engine Room. Shared by every back-end demo.
let dev = false;
const listeners = new Set();

const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};

export function setDevView(value) {
    if (value === dev) return;
    dev = value;
    listeners.forEach((fn) => fn());
}

export const useDevView = () =>
    useSyncExternalStore(
        subscribe,
        () => dev,
        () => dev
    );