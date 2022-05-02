import { createContext } from 'react';

import { Action, RouteLocation } from './LocationContext';

export type To = string | null

/**
 * Type for on route change (used by `listen` property)
 */
export type RouteChange = (action: Action, location: RouteLocation) => void
/**
 * Type for on before route change (used by `beforeRouteChange` property)
 */
type BeforeRouteChangeNewLocation = Omit<RouteLocation, 'path'>

/**
 * Type for on before route change (used by `beforeRouteChange` property)
 */
export type BeforeRouteChange = (
	currentLocation: RouteLocation, 
	nextLocation: RouteLocation | undefined, 
	next: () => void
) => boolean | BeforeRouteChangeNewLocation | Promise<boolean | BeforeRouteChangeNewLocation>

export interface RouteHistory {
	/**
	 * History length
	 */
	readonly length: number
	/**
	 * History scrollRestoration
	 */
	readonly scrollRestoration: ScrollRestoration
	/**
	 * History state, gets lost on refresh
	 */
	readonly state: any
	/**
	 * Current location
	 */
	readonly location: RouteLocation
	/**
	 * History native back
	 */
	back: () => void
	/**
	 * History native forward
	 */
	forward: () => void
	/**
	 * History native go
	 */
	go: (delta?: number) => void
	/**
	 * Method to listen to `URL` changes
	 */
	listen: (fn: RouteChange) => () => void
	/**
	 * Method to listen to `URL` changes
	 */
	beforeRouteChange: (fn: BeforeRouteChange) => () => void
	/**
	 * Method to push new `URL` 
	 * Note: (in browser uses native pushState)
	 */
	push: <State = any>(to?: To, state?: State) => void
	/**
	 * Method to replace `URL` 
	 * Note: (in browser uses native replaceState)
	 */
	replace: <State = any>(to?: To, state?: State) => void
}

export type HistoryContextObject = {
	history: RouteHistory
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const HistoryContext = createContext<HistoryContextObject>(null!)
