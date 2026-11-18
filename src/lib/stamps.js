import { useSyncExternalStore } from "react";

// A tiny shared store so the Lab (front end) and the Engine Room (back end) stamp the same badge.
let state = { set: new Set(), last: null };
const listeners = new Set();

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function stamp(id) {
  if (state.set.has(id)) return;
  const set = new Set(state.set);
  set.add(id);
  state = { set, last: { id, n: set.size } };
  listeners.forEach((fn) => fn());
}

export const useStamps = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
