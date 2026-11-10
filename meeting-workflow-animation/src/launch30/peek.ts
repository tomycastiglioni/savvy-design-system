import { createContext, useContext } from "react";

// True inside Launch30Peek: the scenes leave out every headline, the opening
// line and the client's question, so only the product UI is on screen.
export const PeekContext = createContext(false);
export const usePeek = () => useContext(PeekContext);

// True only in the website sneak peek (not in the resizes, which also use
// PeekContext to draw the UI without its text): its client list keeps the
// approved short scroll.
export const ShortScrollContext = createContext(false);
export const useShortScroll = () => useContext(ShortScrollContext);
