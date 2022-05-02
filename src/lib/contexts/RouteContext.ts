import { createContext, useContext } from 'react';

import { MatchFunction } from 'path-to-regexp';

export type RouteContextObject<Params extends Record<string, string>> = {
	/**
	 * Boolean if path matches current `URL`
	 */
	match: boolean
	/**
	 * Current route path (merged with previous path's)
	 */
	path: string
	/**
	 * Current route params
	 */
	params: Params
	/**
	 * Transforms current route tree into hashed route
	 */
	hash?: boolean
	/**
	 * Method to check `URL`
	 */
	regexp: MatchFunction<any>
	/**
	 * Parent route RouteContextObject
	 */
	parent: RouteContextObject<Params> | null
}

export const RouteContext = createContext<RouteContextObject<any> | null>(null)

export const useRouteContext = <Params extends Record<string, string>>() => {
	return useContext<RouteContextObject<Params> | null>(RouteContext);
}
