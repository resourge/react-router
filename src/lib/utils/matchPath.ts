import { FIT_IN_ALL_ROUTES } from './constants';
import { getUrlPattern, type UrlPattern } from './getUrlPattern';
import { getHrefWhenHashOrNormal } from './utils';

type MatchProps = UrlPattern & {
	currentPath?: string
	paths?: string[]
}

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Get current route params
	 */
	getParams: () => Params
	/**
	 * If current route is hashed
	 */
	hash: boolean
	/**
	 * Current route path (merged with previous path's)
	 */
	path: string
	/**
	 * Current route search
	 */
	search: string
	/**
	 * Unique id for route. (prevents routes from rendering again if nothing changed)
	 */
	unique: string
	/**
	 * If URL pattern is exact
	 */
	exact?: boolean
	/**
	 * Hash path
	 */
	hashPath?: string
	/**
	 * All possible paths for the route
	 */
	paths?: string[]
	/**
	 * Route URL
	 */
	url?: URL
}

function getUniqueId(path: string, match: URLPatternResult) {
	if (match.pathname.groups[0]) {
		const index = match.pathname.input.indexOf(match.pathname.groups[0]);
		const l = (match.pathname.groups[0].length);
		if ( path.includes(FIT_IN_ALL_ROUTES) ) {
			return match.pathname.input.substring(index + l, match.pathname.input.length);
		}
		return match.pathname.input.substring(0, index);
	}

	return match.pathname.input;
}

/**
 * Method to match href to {@link MatchProps path}
 * @param _href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export function matchPath<Params extends Record<string, string> = Record<string, string>>(
	url: URL,
	matchProps: MatchProps
): MatchResult<Params> | null {
	const {
		hash, path, hashPath, exact, paths
	} = matchProps;
	const urlPattern = getUrlPattern(matchProps);

	const _href = getHrefWhenHashOrNormal(url, matchProps.hash);

	const match = urlPattern.exec(_href);

	if ( match ) {
		const search = match.search.input;

		const unique = getUniqueId(path, match);

		return {
			url,
			exact, 
			unique,
			path,
			paths,
			search,
			getParams: () => {
				const matchUrl = match.pathname;

				return (Object.entries(matchUrl.groups)
				.filter(([key, value]) => key !== '0' && value) as Array<[string, string]>)
				.reduce<Record<string, string>>((obj, [key, value]) => {
					obj[key] = value;

					return obj;
				}, {}) as Params;
			},
			hash: hash ?? false,
			hashPath
		};
	}

	return null;
}
