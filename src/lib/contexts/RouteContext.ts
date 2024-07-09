import { createContext, useContext } from 'react';

import { type MatchResult } from '../utils/matchPath';

export type RouteContextObject<Params extends Record<string, string> = Record<string, string>> = MatchResult<Params>;

export const RouteContext = createContext<RouteContextObject | undefined>(undefined);

/**
 * Hook to access first parent 'Route'.
 */
export const useRoute = <Params extends Record<string, string> = Record<string, string>>(): RouteContextObject<Params> => {
	const context = useContext(RouteContext);

	return (context ?? {
		getParams: () => ({}),
		hash: false,
		path: '',
		search: '',
		unique: '',
		exact: true
	}) as RouteContextObject<Params>;
};
