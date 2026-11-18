import { createContext, useContext } from "react";

// true once the page intro (preloader / title wipe) has finished.
export const ReadyContext = createContext(false);
export const useReady = () => useContext(ReadyContext);
