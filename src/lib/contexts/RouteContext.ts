import { createContext, useContext } from 'react'

import invariant from 'tiny-invariant'

import { type MatchResult } from '../utils/matchPath'

export type RouteContextObject<Params extends Record<string, string> = Record<string, string>> = MatchResult<Params>

export const RouteContext = createContext<RouteContextObject | null>(null)

/**
 * Hook to access first parent 'Route'.
 */
export const useRoute = <Params extends Record<string, string> = Record<string, string>>() => {
	const context = useContext(RouteContext);

	if ( __DEV__ ) {
		invariant(context, 'useRoute can only be used in the context of a Route component.')
	}

	return context as RouteContextObject<Params>;
}
