/**
 * @param delta - The position in the history to which you want to move, relative to the current page. A negative value moves backwards, a positive value moves forwards. So, for example, backNavigate(2) moves forward two pages and backNavigate(-2) moves back two pages.
 */
export type BackNavigateMethod = (delta?: number) => void;
