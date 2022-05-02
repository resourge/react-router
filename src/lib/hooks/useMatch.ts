
import warning from 'tiny-warning';

import { RouteContextObject, useRouteContext } from '../contexts/RouteContext';
import { getPathToMatch, matchPath, MatchPathConfig } from '../utils/matchPath';

import { useLocation } from './useLocation';

export type UseMatchConfig = MatchPathConfig & {
	/**
	 * Transform 
	 */
	hash?: boolean
}

export const useMatch = <Params extends Record<string, string>>(): (path: string, config?: UseMatchConfig) => RouteContextObject<Params> => {
	const parent = useRouteContext<Params>();
	const location = useLocation();
	
	return (path: string, config?: UseMatchConfig) => {
		const { hash, ...matchPathConfig } = (config ?? { hash: false })
	
		const _hash = parent?.hash ?? hash;
	
		warning(!(parent?.hash && !hash), 'Every route inside a hash route will also work with hash')
	
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		let _params: Params = {} as Params;
		let match: boolean = false;
		const _path: string = `${parent?.path ?? ''}${path}`

		const regexp = matchPath<Params>(_path, matchPathConfig);
	
		const result = regexp(getPathToMatch(location, _hash));
			
		if ( typeof result === 'object' ) {
			_params = result.params
			match = true;
		}
	
		return {
			parent,
			path: _path,
			hash: _hash,
			match,
			params: _params,
			regexp
		}
	}
}
