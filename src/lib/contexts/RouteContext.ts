import { createContext, useContext } from 'react'

import { type MatchResult } from '../utils/matchPath'

export type RouteContextObject<Params extends Record<string, string> = Record<string, string>> = MatchResult<Params>

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const RouteContext = createContext<RouteContextObject | null>(null)

/**
 * Hook to access first parent 'Route'.
 */
export const useRoute = <Params extends Record<string, string> = Record<string, string>>() => {
	return useContext(RouteContext) as RouteContextObject<Params>
}
