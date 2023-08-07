import { createContext, useContext } from 'react'

// import invariant from 'tiny-invariant'

import { type MatchResult } from '../utils/matchPath'

import { useRouter } from './RouterContext'

export type RouteContextObject<Params extends Record<string, string> = Record<string, string>> = MatchResult<Params>

export const RouteContext = createContext<RouteContextObject | undefined>(undefined)

/**
 * Hook to access first parent 'Route'.
 */
export const useRoute = <Params extends Record<string, string> = Record<string, string>>(): RouteContextObject<Params> => {
	const { baseUrl } = useRouter();
	const context = useContext(RouteContext);

	/* if ( __DEV__ ) {
		invariant(context, 'useRoute can only be used in the context of a Route component.')
	} */

	return (context ?? {
		getParams: () => ({}),
		hash: false,
		path: baseUrl,
		search: '',
		unique: baseUrl
	}) as RouteContextObject<Params>
}
