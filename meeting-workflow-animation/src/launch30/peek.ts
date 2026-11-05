import { createContext, useContext } from "react";

// True inside Launch30Peek: the scenes leave out every headline, the opening
// line and the client's question, so only the product UI is on screen.
export const PeekContext = createContext(false);
export const usePeek = () => useContext(PeekContext);
