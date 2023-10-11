import { useContext } from 'react';

import { RouteContext } from '../contexts/RouteContext';
import { type MatchResult } from '../utils/matchPath';

import { type MatchPathProps, useMatchPath } from './useMatchPath';

export type MatchRouteProps = MatchPathProps

/**
 * Hook to match current route.
 * @returns null if it is a no match, if returns 'NO_ROUTE' is a route without context, otherwise returns {@link MatchResult}
 */
export const useMatchRoute = (matchProps: MatchRouteProps, matchResult?: MatchResult | null) => {
	const parentRoute = useContext(RouteContext);

	if ( 
		matchProps.path === undefined
	) {
		return 'NO_ROUTE'
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useMatchPath(
		matchProps,
		parentRoute,
		matchResult
	)
}
