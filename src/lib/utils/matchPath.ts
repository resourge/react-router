import { FIT_IN_ALL_ROUTES } from './constants';
import { getUrlPattern, type UrlPattern } from './getUrlPattern';
import { getHrefWhenHashOrNormal } from './utils';

type MatchProps = UrlPattern & {
	currentPath?: string
	paths?: string[]
};

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Check if URL for current route was changed
	 */
	checkNewVersion: (url: URL) => boolean
	/**
	 * If URL pattern is exact
	 */
	exact?: boolean
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
	 * All possible paths for the route
	 */
	paths?: string[]
	/**
	 * Current route search
	 */
	search: string
	/**
	 * Unique id for route. (prevents routes from rendering again if nothing changed)
	 */
	unique: string
	/**
	 * Route URL
	 */
	url?: URL
};

/**
 * Method to match href to {@link MatchProps path}
 * @param _href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export function matchPath<Params extends Record<string, string> = Record<string, string>>(
	url: URL,
	{
		baseURL, exact, hash, path, paths
	}: MatchProps
): MatchResult<Params> | null {
	const urlPattern = getUrlPattern({
		baseURL,
		exact,
		hash,
		path 
	});
	const _href = getHrefWhenHashOrNormal(url, hash);

	const match = urlPattern.exec(_href);

	if ( match ) {
		const search = match.search.input;
		const unique = getUniqueId(path, match);

		return {
			checkNewVersion: (url: URL) => {
				const _href = getHrefWhenHashOrNormal(url, hash);
				const match = urlPattern.exec(_href);

				return match
					? unique === getUniqueId(path, match)
					: false;
			},
			exact, 
			getParams: () => {
				const { groups } = match.pathname;

				return Object.entries(groups)
				.filter(([key, value]) => key !== '0' && value)
				.reduce<Record<string, string>>((obj, [key, value]) => {
					obj[key] = value!;

					return obj;
				}, {}) as Params;
			},
			hash: hash ?? false,
			path,
			paths,
			search,
			unique,
			url
		};
	}

	return null;
}

function getUniqueId(path: string, match: URLPatternResult) {
	const { pathname } = match;
	const group = pathname.groups[0];
	const input = pathname.input;
	
	if (group) {
		const index = input.indexOf(group);
		const length = group.length;

		return path.includes(FIT_IN_ALL_ROUTES)
			? input.slice(Math.max(0, index + length))
			: input.slice(0, Math.max(0, index));
	}

	return input;
}
