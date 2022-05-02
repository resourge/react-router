import { RouteContextObject } from '../contexts/RouteContext';

import { UseMatchConfig, useMatch } from './useMatch';

export type RouteConfig = UseMatchConfig

/**
 * Check's if `path` is valid (basically a Route component).
 * Returns all the necessary information's for the `RouteContext`.
 */
export const useRoute = <Params extends Record<string, string>>(
	path: string, 
	config?: UseMatchConfig
): RouteContextObject<Params> => {
	const match = useMatch<Params>()

	return match(path, config);
}
